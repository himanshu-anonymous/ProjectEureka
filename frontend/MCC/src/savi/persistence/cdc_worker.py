"""
Phase 5: Asynchronous Transaction Sink / Change Data Capture (CDC) Worker Pool.
Transfers processed topological SAVI states from Neo4j Command Store to PostgreSQL Query Store.
"""

from __future__ import annotations
import asyncio
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from savi.persistence.postgres_store import IntelligenceQueryStore, IntelligenceRecord
from savi.ingestion.schema import ScrapedPayload
from savi.metrics.savi_suite import SAVIMetricsResult
from savi.graph.open_jev import JEVVerificationVerdict


class CDCTransactionWorker:
    """
    Asynchronous transaction queue worker syncing finalized analytical states.
    Decouples write-heavy graph operations from user-facing query traffic.
    """
    def __init__(self, query_store: IntelligenceQueryStore):
        self.query_store = query_store
        self.queue: asyncio.Queue[IntelligenceRecord] = asyncio.Queue()
        self.is_running = False
        self._worker_task: Optional[asyncio.Task] = None

    async def enqueue_finalized_state(
        self,
        payload: ScrapedPayload,
        metrics: SAVIMetricsResult,
        audit: JEVVerificationVerdict,
        platform_distribution: Dict[str, Any],
    ) -> None:
        record = IntelligenceRecord(
            content_id=payload.content_id,
            canonical_hash=payload.canonical_hash,
            primary_headline=payload.headline_or_title,
            origin_platform=payload.origin_platform,
            published_timestamp=payload.published_timestamp,
            processed_timestamp=datetime.now(timezone.utc),
            sentiment_score=metrics.sentiment_score,
            accuracy_rating=metrics.accuracy_rating,
            validation_index=metrics.validation_index,
            impact_ranking=metrics.impact_ranking,
            anomaly_metric=metrics.anomaly_metric,
            open_jev_audit=audit.to_audit_json(),
            platform_distribution=platform_distribution,
            multimodal_features=payload.multimodal.model_dump() if payload.multimodal else None,
        )
        await self.queue.put(record)

    async def start(self) -> None:
        self.is_running = True
        self._worker_task = asyncio.create_task(self._process_queue())

    async def stop(self) -> None:
        self.is_running = False
        if self._worker_task:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass

    async def flush(self) -> int:
        """Synchronously drains all pending records into the query store."""
        count = 0
        while not self.queue.empty():
            record = await self.queue.get()
            self.query_store.insert_record(record)
            self.queue.task_done()
            count += 1
        return count

    async def _process_queue(self) -> None:
        while self.is_running:
            try:
                record = await self.queue.get()
                self.query_store.insert_record(record)
                self.queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception:
                await asyncio.sleep(0.1)
