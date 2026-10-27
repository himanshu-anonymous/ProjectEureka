"""
SAVI Database Initialization & Health Verification Script.
Connects to live PostgreSQL 16 and Neo4j 5.x clusters, verifies schemas,
and executes end-to-end read/write sanity checks.
"""

import time
import uuid
from datetime import datetime, timezone
import psycopg2
from psycopg2.extras import RealDictCursor
from neo4j import GraphDatabase

from savi.config import settings
from savi.persistence.postgres_store import IntelligenceQueryStore, IntelligenceRecord
from savi.graph.neo4j_driver import Neo4jLiveClusterClient
from savi.graph.triplet_extractor import Triplet
from savi.ingestion.schema import ScrapedPayload, AuthorMetadata, EngagementMetrics


def verify_postgresql():
    print("\n" + "=" * 60)
    print("  [1/2] Verifying PostgreSQL 16 Intelligence Master  ")
    print("=" * 60)
    db = settings.db
    print(f"Connecting to postgres://{db.postgres_user}:***@{db.postgres_host}:{db.postgres_port}/{db.postgres_db}...")

    conn = psycopg2.connect(
        host=db.postgres_host,
        port=db.postgres_port,
        dbname=db.postgres_db,
        user=db.postgres_user,
        password=db.postgres_password,
        connect_timeout=5,
    )
    conn.autocommit = True
    print("--> Connected to PostgreSQL successfully.")

    with conn.cursor() as cur:
        # Check tables
        cur.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'intelligence_master';
        """)
        tbl = cur.fetchone()
        assert tbl is not None, "Table 'intelligence_master' does not exist!"
        print("  [OK] Table 'intelligence_master' exists.")

        # Check materialized view
        cur.execute("""
            SELECT matviewname FROM pg_matviews 
            WHERE schemaname = 'public' AND matviewname = 'mv_top_impact_intelligence';
        """)
        mv = cur.fetchone()
        assert mv is not None, "Materialized View 'mv_top_impact_intelligence' does not exist!"
        print("  [OK] Materialized View 'mv_top_impact_intelligence' exists.")

        # Check indices
        cur.execute("""
            SELECT indexname FROM pg_indexes 
            WHERE schemaname = 'public' AND tablename = 'intelligence_master';
        """)
        indices = [row[0] for row in cur.fetchall()]
        print(f"  [OK] Active indices on intelligence_master: {', '.join(indices)}")

    # Test CQRS insertion and materialized view query
    store = IntelligenceQueryStore(in_memory=False)
    test_id = str(uuid.uuid4())
    sample_record = IntelligenceRecord(
        content_id=test_id,
        canonical_hash=f"hash_{test_id[:8]}",
        primary_headline="Global Regulatory Body announces liquidity adjustment framework",
        origin_platform="web",
        published_timestamp=datetime.now(timezone.utc),
        processed_timestamp=datetime.now(timezone.utc),
        sentiment_score=0.45,
        accuracy_rating=0.92,
        validation_index=0.88,
        impact_ranking=4.75,
        anomaly_metric=0.18,
        open_jev_audit={
            "verdict": "Entailment",
            "probabilities": {"entailment": 0.92, "contradiction": 0.03, "neutral": 0.05},
            "reasoning_chain": ["Verified against primary registry archives."],
        },
        platform_distribution={"web": 0.8, "twitter": 0.2},
        multimodal_features=None,
    )

    t0 = time.perf_counter()
    store.insert_record(sample_record)
    insert_ms = (time.perf_counter() - t0) * 1000.0
    print(f"  [OK] Inserted test record into PostgreSQL in {insert_ms:.2f} ms.")

    t1 = time.perf_counter()
    top_items = store.get_top_impact_intelligence(limit=5)
    query_ms = (time.perf_counter() - t1) * 1000.0
    print(f"  [OK] Queried 'mv_top_impact_intelligence' in {query_ms:.3f} ms. Retrieved {len(top_items)} items.")
    for item in top_items[:2]:
        print(f"       * {item['primary_headline']} | Impact: {item['impact_ranking']} | Verdict: {item['factual_verdict']}")

    conn.close()


def verify_neo4j():
    print("\n" + "=" * 60)
    print("  [2/2] Verifying Neo4j 5.x Graph Compute Cluster  ")
    print("=" * 60)
    db = settings.db
    print(f"Connecting to {db.neo4j_uri} as {db.neo4j_user}...")

    client = Neo4jLiveClusterClient()
    assert client.is_connected, "Failed to connect to Neo4j!"
    print("--> Connected to Neo4j successfully.")

    # Write test knowledge graph
    test_payload = ScrapedPayload(
        origin_platform="twitter",
        headline_or_title="Federal Bank adjusts base interest rate",
        sanitized_body="Official statement: Reserve bank lowers rates by 25bps to maintain financial stability.",
        author=AuthorMetadata(
            author_id="fed_desk",
            username="FederalReserve",
            account_age_days=3000.0,
            is_verified=True,
        ),
        published_timestamp=datetime.now(timezone.utc),
        citations=["https://federalreserve.gov/press/2026"],
        engagement=EngagementMetrics(views=50000, shares=3200, propagation_velocity=12.5),
    )

    triplets = [
        Triplet(subject="Federal Bank", predicate="adjusts", object="base rate", confidence=0.95),
        Triplet(subject="Reserve Bank", predicate="confirms", object="stability", confidence=0.90),
    ]

    t0 = time.perf_counter()
    client.sync_payload(test_payload, triplets)
    sync_ms = (time.perf_counter() - t0) * 1000.0
    print(f"  [OK] Synced content node, author, platform, citations & triplets in {sync_ms:.2f} ms.")

    counts = client.count_nodes()
    print(f"  [OK] Live Neo4j Node Counts: {counts}")

    client.close()


if __name__ == "__main__":
    print("Starting SAVI Database Initialization & Health Probes...")
    verify_postgresql()
    verify_neo4j()
    print("\n" + "=" * 60)
    print("  ALL SAVI DATABASE SYSTEMS ARE FULLY OPERATIONAL!  ")
    print("=" * 60)
