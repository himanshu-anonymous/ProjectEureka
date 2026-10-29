"""
Integration tests for End-to-End SAVI Pipeline:
Ingestion Agents -> Dynamic DAG Router -> Isolation Rainforest -> Neo4j -> Open JEV -> SAVI Metrics -> CDC Sink -> CQRS Serving.
"""

import pytest
from datetime import datetime, timezone
from savi.api.main import SAVIPipelineOrchestrator
from savi.ingestion.schema import ScrapedPayload, AuthorMetadata, EngagementMetrics


@pytest.mark.asyncio
async def test_end_to_end_pipeline_flow():
    orchestrator = SAVIPipelineOrchestrator()
    await orchestrator.start()

    payload = ScrapedPayload(
        origin_platform="web",
        headline_or_title="Federal Bank adjusts interest rates to counteract inflationary pressures",
        sanitized_body=(
            "The central bank officially announced a 25 basis point reduction. "
            "Cross-platform reporting confirms the policy implementation effective immediately."
        ),
        author=AuthorMetadata(
            author_id="financial_times_01",
            username="FinancialTimesDesk",
            account_age_days=2500.0,
            is_verified=True,
        ),
        published_timestamp=datetime.now(timezone.utc),
        citations=["https://ft.com/markets/interest-rates"],
        engagement=EngagementMetrics(
            views=15000,
            upvotes=850,
            downvotes=12,
            shares=320,
            propagation_velocity=3.4,
        ),
    )

    result = await orchestrator.ingest_and_process(payload)

    # Verify pipeline step results
    assert result["content_id"] == payload.content_id
    assert result["route_type"] in ["MICRO_EVENT", "MACRO_CASCADE"]
    assert "anomaly_verdict" in result
    assert result["triplets_extracted"] >= 1
    assert result["open_jev"] is not None
    assert result["savi_metrics"] is not None
    assert result["pipeline_latency_ms"] >= 0.0

    # Verify CQRS Query Store materialized view query
    top_items = orchestrator.query_store.get_top_impact_intelligence(limit=10)
    assert len(top_items) >= 1
    matched = [item for item in top_items if item["content_id"] == payload.content_id]
    assert len(matched) == 1
    assert matched[0]["primary_headline"] == payload.headline_or_title
    assert "factual_verdict" in matched[0]

    await orchestrator.stop()
