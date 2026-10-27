"""Integration tests for PostgreSQL 16 database, schema migrations, and materialized views."""

import os
import uuid
from datetime import datetime, timezone
import pytest
import psycopg2
from psycopg2.extras import RealDictCursor


def is_postgres_available() -> bool:
    """Check if PostgreSQL test container is reachable."""
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    user = os.getenv("POSTGRES_USER", "test_user")
    password = os.getenv("POSTGRES_PASSWORD", "test_password")
    dbname = os.getenv("POSTGRES_DB", "test_eureka_db")
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            dbname=dbname,
            connect_timeout=2,
        )
        conn.close()
        return True
    except Exception:
        return False


pytestmark = pytest.mark.skipif(
    not is_postgres_available(),
    reason="PostgreSQL service container not reachable (run in CI or start local container)",
)


@pytest.fixture(scope="module")
def pg_connection():
    """Yield a direct psycopg2 connection to PostgreSQL."""
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    user = os.getenv("POSTGRES_USER", "test_user")
    password = os.getenv("POSTGRES_PASSWORD", "test_password")
    dbname = os.getenv("POSTGRES_DB", "test_eureka_db")

    conn = psycopg2.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname=dbname,
        connect_timeout=5,
    )
    conn.autocommit = True
    yield conn
    conn.close()


def test_postgres_connection_and_version(pg_connection):
    """Verify live connectivity and PostgreSQL version."""
    with pg_connection.cursor() as cur:
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        assert "PostgreSQL" in version


def test_savi_schema_and_materialized_views(pg_connection):
    """Verify SAVI schema tables, indices, and materialized view exist."""
    with pg_connection.cursor(cursor_factory=RealDictCursor) as cur:
        # Check intelligence_master table exists
        cur.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'intelligence_master';
        """)
        row = cur.fetchone()
        assert row is not None, "intelligence_master table missing"

        # Check materialized view exists
        cur.execute("""
            SELECT matviewname FROM pg_matviews 
            WHERE schemaname = 'public' AND matviewname = 'mv_top_impact_intelligence';
        """)
        mv_row = cur.fetchone()
        assert mv_row is not None, "mv_top_impact_intelligence materialized view missing"

        # Insert a sample intelligence record
        test_id = str(uuid.uuid4())
        test_hash = f"hash_{uuid.uuid4().hex[:16]}"
        cur.execute("""
            INSERT INTO intelligence_master (
                content_id, canonical_hash, primary_headline, origin_platform,
                published_timestamp, sentiment_score, accuracy_rating,
                validation_index, impact_ranking, anomaly_metric,
                open_jev_audit, platform_distribution
            ) VALUES (
                %s, %s, %s, %s, NOW(), 0.85, 0.95, 0.90, 0.92, 0.10,
                '{"verdict": "VERIFIED", "reasoning_chain": ["Premise A", "Conclusion B"]}'::jsonb,
                '{"twitter": 120, "web": 45}'::jsonb
            ) ON CONFLICT (content_id) DO NOTHING;
        """, (test_id, test_hash, "Official DGIPR Press Advisory", "web"))

        # Verify query against table
        cur.execute("SELECT primary_headline FROM intelligence_master WHERE content_id = %s;", (test_id,))
        record = cur.fetchone()
        assert record is not None
        assert record["primary_headline"] == "Official DGIPR Press Advisory"


def test_eureka_tables_and_metadata(pg_connection):
    """Verify EUREKA core tables exist in PostgreSQL."""
    with pg_connection.cursor() as cur:
        cur.execute("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public';
        """)
        existing_tables = {r[0] for r in cur.fetchall()}

        # Verify key relational tables
        assert "media_events" in existing_tables, "media_events table missing"


def test_media_events_crud_operations():
    """Verify SQLAlchemy MediaEvent model operations against PostgreSQL."""
    from eureka.core.database import sync_engine
    from eureka.db.models import MediaEvent
    from sqlalchemy.orm import sessionmaker

    Session = sessionmaker(bind=sync_engine)
    session = Session()

    try:
        sample_id = f"test_ev_{uuid.uuid4().hex[:8]}"
        event = MediaEvent(
            record_id=sample_id,
            district="Thane",
            event_type="Press Release",
            english_content="District administration testing PostgreSQL pipeline.",
            event_timestamp=datetime.now(timezone.utc),
            turnaround_time_mins=35.0,
            sentiment_score=0.75,
            crisis_resolved=True,
        )
        session.add(event)
        session.commit()

        # Query back
        retrieved = session.query(MediaEvent).filter_by(record_id=sample_id).first()
        assert retrieved is not None
        assert retrieved.district == "Thane"
        assert retrieved.turnaround_time_mins == 35.0

        # Clean up
        session.delete(retrieved)
        session.commit()
    finally:
        session.close()


@pytest.mark.asyncio
async def test_asyncpg_connection_to_postgres():
    """Verify asyncpg async driver connection to PostgreSQL."""
    import asyncpg

    host = os.getenv("POSTGRES_HOST", "localhost")
    port = int(os.getenv("POSTGRES_PORT", "5432"))
    user = os.getenv("POSTGRES_USER", "test_user")
    password = os.getenv("POSTGRES_PASSWORD", "test_password")
    dbname = os.getenv("POSTGRES_DB", "test_eureka_db")

    conn = await asyncpg.connect(
        user=user,
        password=password,
        database=dbname,
        host=host,
        port=port,
    )
    val = await conn.fetchval("SELECT 1;")
    assert val == 1
    await conn.close()
