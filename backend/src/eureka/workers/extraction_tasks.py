"""Schema-based entity and claim extraction background worker for Project EUREKA.

Extracts entities, mentions, and relations over normalized text and media streams,
persisting to Postgres and projecting to Neo4j through the transactional outbox.
Resumable via extraction_checkpoints with rate limiting.
"""

from datetime import datetime, timezone
import logging
import uuid
from typing import Any, Dict, List, Optional, Tuple

from celery.utils.log import get_task_logger
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import Session

from eureka.core.celery_app import celery_app
from eureka.core.database import sync_db_context
from eureka.models.enums import AggregateType, OutboxEventStatus
from eureka.models.orm import (
    ExtractedEntity,
    EntityMention,
    ExtractedRelation,
    ExtractionCheckpoint,
    OutboxEvent,
    NormalizedRecord,
    Clipping,
    FactCheckTicket,
)
from eureka.db.models import MediaEvent
from eureka.copilot.entity_linking import link_entities, EntityLinkResult

logger = get_task_logger(__name__)


RELATION_SCHEMA_RULES = {
    ("official", "district"): "POSTED_IN",
    ("official", "department"): "HEADS_DEPARTMENT",
    ("department", "scheme"): "ADMINISTERS_SCHEME",
    ("district", "scheme"): "IMPLEMENTS_SCHEME",
    ("outlet", "district"): "COVERS_DISTRICT",
    ("outlet", "scheme"): "REPORTS_ON",
    ("outlet", "department"): "REPORTS_ON",
}


def determine_relation_type(cat1: str, cat2: str) -> Tuple[str, bool]:
    """Determine relation type and orientation between two entity categories."""
    pair = (cat1, cat2)
    if pair in RELATION_SCHEMA_RULES:
        return RELATION_SCHEMA_RULES[pair], False
    rev_pair = (cat2, cat1)
    if rev_pair in RELATION_SCHEMA_RULES:
        return RELATION_SCHEMA_RULES[rev_pair], True
    return "CO_OCCURS_WITH", False


def process_record_text_extraction(
    session: Session,
    source_table: str,
    source_id: str,
    text: str,
    record_date: Optional[datetime] = None,
    default_district: Optional[str] = None,
) -> Dict[str, int]:
    """Extract entities, mentions, and relations from a text block and write to DB & outbox."""
    if not text or not text.strip():
        return {"entities": 0, "mentions": 0, "relations": 0}

    now_utc = datetime.now(timezone.utc)
    as_of = record_date or now_utc

    # 1. Link entities
    linked = link_entities(text, threshold=0.70)
    if not linked:
        return {"entities": 0, "mentions": 0, "relations": 0}

    extracted_entities: List[ExtractedEntity] = []
    mentions: List[EntityMention] = []
    relations: List[ExtractedRelation] = []

    # Map of canonical_id -> entity object
    entity_map: Dict[str, ExtractedEntity] = {}

    for item in linked:
        # Check if entity already exists in session or DB
        existing = session.get(ExtractedEntity, item.canonical_id)
        if not existing:
            # Create new entity record
            new_ent = ExtractedEntity(
                id=item.canonical_id,
                name=item.name,
                category=item.category,
                canonical_id=item.canonical_id,
                properties=item.properties,
                created_at=now_utc,
            )
            session.add(new_ent)
            session.flush()
            existing = new_ent

            # Project to outbox for Neo4j
            session.add(
                OutboxEvent(
                    id=str(uuid.uuid4()),
                    aggregate_type=AggregateType.ENTITY,
                    aggregate_id=item.canonical_id,
                    payload={
                        "id": item.canonical_id,
                        "name": item.name,
                        "category": item.category,
                        "canonical_id": item.canonical_id,
                        "properties": item.properties,
                    },
                    status=OutboxEventStatus.PENDING,
                    created_at=now_utc,
                )
            )

        entity_map[item.canonical_id] = existing

        # Mention record
        mention_id = str(uuid.uuid4())
        mention = EntityMention(
            id=mention_id,
            entity_id=item.canonical_id,
            source_table=source_table,
            source_id=str(source_id),
            mention_text=item.matched_term,
            confidence=item.score,
            district_code=item.properties.get("code") if item.category == "district" else default_district,
            as_of=as_of,
            created_at=now_utc,
        )
        session.add(mention)
        mentions.append(mention)

    # 2. Extract relations between co-occurring entities
    linked_items = list(entity_map.values())
    for i in range(len(linked_items)):
        for j in range(i + 1, len(linked_items)):
            ent_a = linked_items[i]
            ent_b = linked_items[j]

            rel_type, reversed_orient = determine_relation_type(ent_a.category, ent_b.category)
            src_id = ent_b.id if reversed_orient else ent_a.id
            tgt_id = ent_a.id if reversed_orient else ent_b.id

            rel_id = str(uuid.uuid4())
            rel = ExtractedRelation(
                id=rel_id,
                source_entity_id=src_id,
                target_entity_id=tgt_id,
                relation_type=rel_type,
                source_table=source_table,
                source_id=str(source_id),
                confidence=0.85,
                as_of=as_of,
                created_at=now_utc,
            )
            session.add(rel)
            relations.append(rel)

            # Project relation to Neo4j via outbox
            session.add(
                OutboxEvent(
                    id=str(uuid.uuid4()),
                    aggregate_type=AggregateType.RELATION,
                    aggregate_id=rel_id,
                    payload={
                        "id": rel_id,
                        "source_entity_id": src_id,
                        "target_entity_id": tgt_id,
                        "relation_type": rel_type,
                        "source_table": source_table,
                        "source_id": str(source_id),
                        "confidence": 0.85,
                        "as_of": as_of.isoformat() if as_of else None,
                    },
                    status=OutboxEventStatus.PENDING,
                    created_at=now_utc,
                )
            )

    return {
        "entities": len(entity_map),
        "mentions": len(mentions),
        "relations": len(relations),
    }


def run_table_extraction(
    session: Session,
    table_name: str,
    batch_size: int = 50,
    max_records: int = 200,
) -> int:
    """Run resumable extraction over a given source table."""
    now_utc = datetime.now(timezone.utc)
    checkpoint = session.get(ExtractionCheckpoint, table_name)
    if not checkpoint:
        checkpoint = ExtractionCheckpoint(
            source_table=table_name,
            last_processed_id=None,
            last_processed_at=None,
            records_processed=0,
            updated_at=now_utc,
        )
        session.add(checkpoint)
        session.flush()

    total_processed = 0

    while total_processed < max_records:
        current_limit = min(batch_size, max_records - total_processed)

        # Build query depending on table
        records = []
        if table_name == "normalized_records":
            stmt = select(NormalizedRecord)
            if checkpoint.last_processed_at:
                stmt = stmt.where(
                    or_(
                        NormalizedRecord.created_at > checkpoint.last_processed_at,
                        and_(
                            NormalizedRecord.created_at == checkpoint.last_processed_at,
                            NormalizedRecord.id > (checkpoint.last_processed_id or ""),
                        ),
                    )
                )
            stmt = stmt.order_by(NormalizedRecord.created_at.asc(), NormalizedRecord.id.asc()).limit(current_limit)
            records = session.execute(stmt).scalars().all()

        elif table_name == "clippings":
            stmt = select(Clipping)
            if checkpoint.last_processed_at:
                stmt = stmt.where(
                    or_(
                        Clipping.created_at > checkpoint.last_processed_at,
                        and_(
                            Clipping.created_at == checkpoint.last_processed_at,
                            Clipping.id > (checkpoint.last_processed_id or ""),
                        ),
                    )
                )
            stmt = stmt.order_by(Clipping.created_at.asc(), Clipping.id.asc()).limit(current_limit)
            records = session.execute(stmt).scalars().all()

        elif table_name == "fact_check_tickets":
            stmt = select(FactCheckTicket)
            if checkpoint.last_processed_at:
                stmt = stmt.where(
                    or_(
                        FactCheckTicket.created_at > checkpoint.last_processed_at,
                        and_(
                            FactCheckTicket.created_at == checkpoint.last_processed_at,
                            FactCheckTicket.id > (checkpoint.last_processed_id or ""),
                        ),
                    )
                )
            stmt = stmt.order_by(FactCheckTicket.created_at.asc(), FactCheckTicket.id.asc()).limit(current_limit)
            records = session.execute(stmt).scalars().all()

        elif table_name == "media_events":
            stmt = select(MediaEvent)
            if checkpoint.last_processed_at:
                stmt = stmt.where(MediaEvent.event_timestamp > checkpoint.last_processed_at)
            stmt = stmt.order_by(MediaEvent.event_timestamp.asc()).limit(current_limit)
            records = session.execute(stmt).scalars().all()

        if not records:
            break

        last_rec = None
        for rec in records:
            source_id = str(rec.id)
            rec_date = getattr(rec, "created_at", None) or getattr(rec, "event_timestamp", None)
            district_code = getattr(rec, "district_code", None) or getattr(rec, "district", None)

            if table_name == "normalized_records":
                text = f"{rec.title or ''}\n{rec.cleaned_text or ''}"
            elif table_name == "clippings":
                text = f"{rec.headline or ''}\n{rec.summary or ''}"
            elif table_name == "fact_check_tickets":
                text = rec.claim_text or ""
            elif table_name == "media_events":
                text = rec.english_content or ""
            else:
                text = ""

            process_record_text_extraction(
                session=session,
                source_table=table_name,
                source_id=source_id,
                text=text,
                record_date=rec_date,
                default_district=district_code,
            )
            last_rec = rec

        if last_rec:
            checkpoint.last_processed_id = str(last_rec.id)
            checkpoint.last_processed_at = getattr(last_rec, "created_at", None) or getattr(last_rec, "event_timestamp", None)
            checkpoint.records_processed += len(records)
            checkpoint.updated_at = datetime.now(timezone.utc)
            session.commit()

        total_processed += len(records)
        if len(records) < current_limit:
            break

    return total_processed


@celery_app.task(
    bind=True,
    name="eureka.workers.extraction_tasks.extract_entities_and_claims_task",
    max_retries=3,
    default_retry_delay=10,
)
def extract_entities_and_claims_task(self, batch_size: int = 50, max_records: int = 200) -> Dict[str, Any]:
    """Background Celery task performing rate-limited, resumable entity and claim extraction."""
    logger.info("Starting schema-based entity & claim extraction task...")
    results = {}
    tables = ["normalized_records", "clippings", "fact_check_tickets", "media_events"]

    with sync_db_context() as session:
        for t in tables:
            try:
                count = run_table_extraction(
                    session=session,
                    table_name=t,
                    batch_size=batch_size,
                    max_records=max_records,
                )
                results[t] = count
                logger.info("Extracted %d records for table %s", count, t)
            except Exception as exc:
                logger.error("Extraction error on %s: %s", t, exc, exc_info=True)
                results[t] = f"error: {str(exc)}"

    return {
        "status": "completed",
        "records_extracted": results,
    }
