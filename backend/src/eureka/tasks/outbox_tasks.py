"""Transactional Outbox Celery Worker with Cypher UNWIND Batching.

Polls outbox_events table using `SELECT ... FOR UPDATE SKIP LOCKED` every 5 seconds
and projects nodes and edges into Neo4j in high-throughput UNWIND batches.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from eureka.core.celery_app import celery_app
from eureka.core.config import get_settings
from eureka.core.database import sync_db_context
from eureka.core.neo4j_driver import Neo4jGraphService
from eureka.models.enums import AggregateType, OutboxEventStatus
from eureka.models.orm import OutboxEvent

logger = logging.getLogger(__name__)
settings = get_settings()


class BatchNeo4jOutboxProjector:
    """Batch projector leveraging Cypher UNWIND for maximum throughput."""

    def __init__(self, driver_service=Neo4jGraphService):
        self.driver_service = driver_service

    def project_batch(self, events: List[OutboxEvent]) -> int:
        """Batch-project a list of OutboxEvents using Cypher UNWIND."""
        if not events:
            return 0

        canon_events_batch = []
        district_links_batch = []
        dept_links_batch = []
        releases_batch = []
        claims_batch = []
        districts_batch = []
        departments_batch = []
        event_source_links_batch = []
        entities_batch = []
        relations_batch = []

        now_iso = datetime.now(timezone.utc).isoformat()

        for event in events:
            payload = event.payload or {}
            agg_type = event.aggregate_type
            agg_id = event.aggregate_id

            if agg_type in (AggregateType.CANONICAL_EVENT, "CanonicalEvent"):
                canon_events_batch.append({
                    "id": agg_id,
                    "title": payload.get("title", ""),
                    "summary": payload.get("summary", ""),
                    "status": payload.get("status", "pending_review"),
                    "verification_status": payload.get("verification_status", "UNVERIFIED"),
                    "primary_language": payload.get("primary_language", "mr"),
                    "first_detected_at": payload.get("first_detected_at", now_iso),
                    "last_updated_at": payload.get("last_updated_at", now_iso),
                })
                if payload.get("district_code"):
                    district_links_batch.append({
                        "event_id": agg_id,
                        "district_code": payload["district_code"],
                        "district_name": payload.get("district_name", payload["district_code"]),
                    })
                if payload.get("department_code"):
                    dept_links_batch.append({
                        "event_id": agg_id,
                        "dept_code": payload["department_code"],
                        "dept_name": payload.get("department_name", payload["department_code"]),
                    })

            elif agg_type in (AggregateType.RELEASE, "Release"):
                releases_batch.append({
                    "id": agg_id,
                    "title": payload.get("title", ""),
                    "source": payload.get("source", "QUAD"),
                    "url": payload.get("url", ""),
                    "timestamp": payload.get("timestamp", now_iso),
                    "canonical_event_id": payload.get("canonical_event_id"),
                })

            elif agg_type in (AggregateType.CLAIM, "Claim"):
                claims_batch.append({
                    "id": agg_id,
                    "text": payload.get("text", ""),
                    "is_rumor": payload.get("is_rumor", True),
                    "refuted": payload.get("refuted", False),
                    "canonical_event_id": payload.get("canonical_event_id"),
                    "district_code": payload.get("district_code"),
                })

            elif agg_type in (AggregateType.DISTRICT, "District"):
                districts_batch.append({
                    "code": agg_id,
                    "name": payload.get("name", agg_id),
                    "state": payload.get("state", "Maharashtra"),
                })

            elif agg_type in (AggregateType.DEPARTMENT, "Department"):
                departments_batch.append({
                    "code": agg_id,
                    "name": payload.get("name", agg_id),
                })

            elif agg_type in (AggregateType.EVENT_SOURCE_LINK, "EventSourceLink"):
                event_source_links_batch.append({
                    "link_id": agg_id,
                    "release_id": payload.get("release_id", payload.get("normalized_record_id")),
                    "canonical_event_id": payload.get("canonical_event_id"),
                    "similarity_score": payload.get("similarity_score", 1.0),
                    "bound_by": payload.get("bound_by", "SemIf-OpenJev"),
                })

            elif agg_type in (AggregateType.ENTITY, "Entity"):
                entities_batch.append({
                    "id": agg_id,
                    "name": payload.get("name", ""),
                    "category": payload.get("category", "entity"),
                    "canonical_id": payload.get("canonical_id", agg_id),
                })

            elif agg_type in (AggregateType.RELATION, "Relation"):
                relations_batch.append({
                    "id": agg_id,
                    "source_id": payload.get("source_entity_id"),
                    "target_id": payload.get("target_entity_id"),
                    "relation_type": payload.get("relation_type", "RELATED_TO"),
                    "source_table": payload.get("source_table", ""),
                    "source_id_ref": payload.get("source_id", ""),
                    "confidence": payload.get("confidence", 1.0),
                    "as_of": payload.get("as_of", now_iso),
                })

        # 1. Execute CanonicalEvent batch UNWIND
        if canon_events_batch:
            cypher = """
            UNWIND $events AS evt
            MERGE (e:CanonicalEvent {id: evt.id})
            SET e.title = evt.title,
                e.summary = evt.summary,
                e.status = evt.status,
                e.verification_status = evt.verification_status,
                e.primary_language = evt.primary_language,
                e.first_detected_at = datetime(evt.first_detected_at),
                e.last_updated_at = datetime(evt.last_updated_at)
            """
            self.driver_service.run_query(cypher, {"events": canon_events_batch})

        # 2. Execute :AFFECTS District edge batch UNWIND
        if district_links_batch:
            cypher = """
            UNWIND $links AS link
            MERGE (e:CanonicalEvent {id: link.event_id})
            MERGE (d:District {code: link.district_code})
            ON CREATE SET d.name = link.district_name, d.state = 'Maharashtra'
            MERGE (e)-[:AFFECTS]->(d)
            """
            self.driver_service.run_query(cypher, {"links": district_links_batch})

        # 3. Execute :RELATES_TO Department edge batch UNWIND
        if dept_links_batch:
            cypher = """
            UNWIND $links AS link
            MERGE (e:CanonicalEvent {id: link.event_id})
            MERGE (dep:Department {code: link.dept_code})
            ON CREATE SET dep.name = link.dept_name
            MERGE (e)-[:RELATES_TO]->(dep)
            """
            self.driver_service.run_query(cypher, {"links": dept_links_batch})

        # 4. Execute Release batch UNWIND
        if releases_batch:
            cypher = """
            UNWIND $releases AS rel
            MERGE (r:Release {id: rel.id})
            SET r.title = rel.title,
                r.source = rel.source,
                r.url = rel.url,
                r.timestamp = datetime(rel.timestamp)
            WITH r, rel
            WHERE rel.canonical_event_id IS NOT NULL
            MERGE (e:CanonicalEvent {id: rel.canonical_event_id})
            MERGE (r)-[:REPORTS_ON]->(e)
            """
            self.driver_service.run_query(cypher, {"releases": releases_batch})

        # 5. Execute Claim batch UNWIND
        if claims_batch:
            cypher = """
            UNWIND $claims AS clm
            MERGE (c:Claim {id: clm.id})
            SET c.text = clm.text,
                c.is_rumor = clm.is_rumor,
                c.refuted = clm.refuted
            WITH c, clm
            WHERE clm.canonical_event_id IS NOT NULL
            MERGE (e:CanonicalEvent {id: clm.canonical_event_id})
            MERGE (e)-[:CONTAINS_CLAIM]->(c)
            WITH c, clm
            WHERE clm.district_code IS NOT NULL
            MERGE (d:District {code: clm.district_code})
            MERGE (c)-[:AFFECTS]->(d)
            """
            self.driver_service.run_query(cypher, {"claims": claims_batch})

        # 6. Execute Districts and Departments
        if districts_batch:
            cypher = """
            UNWIND $districts AS dist
            MERGE (d:District {code: dist.code})
            SET d.name = dist.name, d.state = dist.state
            """
            self.driver_service.run_query(cypher, {"districts": districts_batch})

        if departments_batch:
            cypher = """
            UNWIND $departments AS dept
            MERGE (dep:Department {code: dept.code})
            SET dep.name = dept.name
            """
            self.driver_service.run_query(cypher, {"departments": departments_batch})

        # 7. Execute EventSourceLinks
        if event_source_links_batch:
            cypher = """
            UNWIND $links AS link
            MERGE (r:Release {id: link.release_id})
            MERGE (e:CanonicalEvent {id: link.canonical_event_id})
            MERGE (r)-[rel:REPORTS_ON]->(e)
            SET rel.similarity_score = link.similarity_score,
                rel.bound_by = link.bound_by,
                rel.link_id = link.link_id
            """
            self.driver_service.run_query(cypher, {"links": event_source_links_batch})

        # 8. Execute Extracted Entities
        if entities_batch:
            cypher = """
            UNWIND $entities AS ent
            MERGE (n:NamedEntity {id: ent.id})
            SET n.name = ent.name,
                n.category = ent.category,
                n.canonical_id = ent.canonical_id
            """
            self.driver_service.run_query(cypher, {"entities": entities_batch})

        # 9. Execute Extracted Relations
        if relations_batch:
            cypher = """
            UNWIND $relations AS rel
            MERGE (s:NamedEntity {id: rel.source_id})
            MERGE (t:NamedEntity {id: rel.target_id})
            MERGE (s)-[r:EXTRACTED_RELATION {id: rel.id}]->(t)
            SET r.type = rel.relation_type,
                r.source_table = rel.source_table,
                r.source_id = rel.source_id_ref,
                r.confidence = rel.confidence,
                r.as_of = rel.as_of
            """
            self.driver_service.run_query(cypher, {"relations": relations_batch})

        return len(events)


def process_pending_outbox_unwind_batch(batch_size: Optional[int] = None) -> int:
    """Fetch pending outbox events using FOR UPDATE SKIP LOCKED and UNWIND project to Neo4j."""
    limit = batch_size or settings.OUTBOX_BATCH_SIZE
    projector = BatchNeo4jOutboxProjector()
    now_utc = datetime.now(timezone.utc)

    with sync_db_context() as session:
        stmt = (
            select(OutboxEvent)
            .where(OutboxEvent.status == OutboxEventStatus.PENDING)
            .order_by(OutboxEvent.created_at.asc())
            .limit(limit)
            .with_for_update(skip_locked=True)
        )
        events = session.execute(stmt).scalars().all()

        if not events:
            return 0

        try:
            # Batch project into Neo4j using UNWIND
            projector.project_batch(events)

            # Mark all as PROCESSED
            for event in events:
                event.status = OutboxEventStatus.PROCESSED
                event.processed_at = now_utc
                event.last_error = None
            session.commit()
            logger.info("Batch projected %d outbox events to Neo4j via Cypher UNWIND", len(events))
            return len(events)

        except Exception as exc:
            logger.error("Batch UNWIND projection error: %s; falling back to per-item retry", exc)
            session.rollback()

            # Per-event fallback with retry budget
            processed_count = 0
            for event in events:
                try:
                    projector.project_batch([event])
                    event.status = OutboxEventStatus.PROCESSED
                    event.processed_at = datetime.now(timezone.utc)
                    event.last_error = None
                    processed_count += 1
                except Exception as inner_exc:
                    event.retry_count += 1
                    event.last_error = str(inner_exc)
                    if event.retry_count >= settings.OUTBOX_MAX_RETRIES:
                        event.status = OutboxEventStatus.FAILED
                        logger.error("OutboxEvent %s marked FAILED after %d retries", event.id, settings.OUTBOX_MAX_RETRIES)
                    else:
                        logger.warning("OutboxEvent %s retry %d failed: %s", event.id, event.retry_count, inner_exc)
            session.commit()
            return processed_count


@celery_app.task(
    bind=True,
    name="eureka.tasks.outbox_tasks.poll_outbox_events_task",
    max_retries=3,
    default_retry_delay=5,
)
def poll_outbox_events_task(self):
    """Celery Beat periodic task polling outbox_events every 5 seconds."""
    try:
        return process_pending_outbox_unwind_batch()
    except Exception as exc:
        logger.error("Error in poll_outbox_events_task: %s", exc)
        raise self.retry(exc=exc)
