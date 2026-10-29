"""
Phase 5: CQRS Query Store & Materialized View Serving Engine.
Supports live PostgreSQL 16 serving (<10ms) and in-memory SQLite emulation.
"""

from __future__ import annotations
import json
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from savi.config import DatabaseConfig, settings


@dataclass
class IntelligenceRecord:
    content_id: str
    canonical_hash: str
    primary_headline: str
    origin_platform: str
    published_timestamp: datetime
    processed_timestamp: datetime
    sentiment_score: float
    accuracy_rating: float
    validation_index: float
    impact_ranking: float
    anomaly_metric: float
    open_jev_audit: Dict[str, Any]
    platform_distribution: Dict[str, Any]
    multimodal_features: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "content_id": self.content_id,
            "canonical_hash": self.canonical_hash,
            "primary_headline": self.primary_headline,
            "origin_platform": self.origin_platform,
            "published_timestamp": self.published_timestamp.isoformat(),
            "processed_timestamp": self.processed_timestamp.isoformat(),
            "sentiment_score": self.sentiment_score,
            "accuracy_rating": self.accuracy_rating,
            "validation_index": self.validation_index,
            "impact_ranking": self.impact_ranking,
            "anomaly_metric": self.anomaly_metric,
            "open_jev_audit": self.open_jev_audit,
            "platform_distribution": self.platform_distribution,
            "multimodal_features": self.multimodal_features,
        }


class IntelligenceQueryStore:
    """
    CQRS Query Store interface.
    Connects to live PostgreSQL 16 cluster or falls back to SQLite emulation.
    """
    def __init__(self, db_config: DatabaseConfig = settings.db, in_memory: bool = False):
        self.db_config = db_config
        self.in_memory = in_memory
        self.is_postgres = False
        self.pg_conn = None
        self.sqlite_conn = None

        if not in_memory:
            try:
                self.pg_conn = psycopg2.connect(
                    host=db_config.postgres_host,
                    port=db_config.postgres_port,
                    dbname=db_config.postgres_db,
                    user=db_config.postgres_user,
                    password=db_config.postgres_password,
                    connect_timeout=3,
                )
                self.pg_conn.autocommit = True
                self.is_postgres = True
            except Exception:
                # Fallback to local SQLite emulation if Postgres is unreachable
                self.is_postgres = False

        if not self.is_postgres:
            self.sqlite_conn = sqlite3.connect(":memory:" if in_memory else "savi_query_store.db", check_same_thread=False)
            self.sqlite_conn.row_factory = sqlite3.Row
            self._init_sqlite_db()

    def _init_sqlite_db(self) -> None:
        """Initializes tables and indexing matching the PostgreSQL schema in SQLite."""
        cur = self.sqlite_conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS intelligence_master (
                content_id TEXT PRIMARY KEY,
                canonical_hash TEXT UNIQUE NOT NULL,
                primary_headline TEXT NOT NULL,
                origin_platform TEXT NOT NULL,
                published_timestamp TEXT NOT NULL,
                processed_timestamp TEXT NOT NULL,
                sentiment_score REAL NOT NULL,
                accuracy_rating REAL NOT NULL,
                validation_index REAL NOT NULL,
                impact_ranking REAL NOT NULL,
                anomaly_metric REAL NOT NULL,
                open_jev_audit TEXT NOT NULL,
                platform_distribution TEXT NOT NULL,
                multimodal_features TEXT
            );
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_intelligence_impact_acc
            ON intelligence_master (impact_ranking DESC, accuracy_rating DESC);
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_intelligence_pub_time
            ON intelligence_master (published_timestamp DESC);
        """)
        self.sqlite_conn.commit()

    def insert_record(self, record: IntelligenceRecord) -> None:
        """Inserts record into Intelligence Master."""
        if self.is_postgres:
            with self.pg_conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO intelligence_master (
                        content_id, canonical_hash, primary_headline, origin_platform,
                        published_timestamp, processed_timestamp, sentiment_score,
                        accuracy_rating, validation_index, impact_ranking, anomaly_metric,
                        open_jev_audit, platform_distribution, multimodal_features
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (canonical_hash) DO UPDATE SET
                        content_id = EXCLUDED.content_id,
                        primary_headline = EXCLUDED.primary_headline,
                        sentiment_score = EXCLUDED.sentiment_score,
                        accuracy_rating = EXCLUDED.accuracy_rating,
                        validation_index = EXCLUDED.validation_index,
                        impact_ranking = EXCLUDED.impact_ranking,
                        anomaly_metric = EXCLUDED.anomaly_metric,
                        open_jev_audit = EXCLUDED.open_jev_audit,
                        platform_distribution = EXCLUDED.platform_distribution,
                        multimodal_features = EXCLUDED.multimodal_features,
                        processed_timestamp = CURRENT_TIMESTAMP;
                """, (
                    record.content_id,
                    record.canonical_hash,
                    record.primary_headline,
                    record.origin_platform,
                    record.published_timestamp,
                    record.processed_timestamp,
                    float(record.sentiment_score),
                    float(record.accuracy_rating),
                    float(record.validation_index),
                    float(record.impact_ranking),
                    float(record.anomaly_metric),
                    json.dumps(record.open_jev_audit),
                    json.dumps(record.platform_distribution),
                    json.dumps(record.multimodal_features) if record.multimodal_features else None,
                ))
                # Refresh Materialized View
                try:
                    cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mv_top_impact_intelligence;")
                except Exception:
                    cur.execute("REFRESH MATERIALIZED VIEW mv_top_impact_intelligence;")
        else:
            cur = self.sqlite_conn.cursor()
            cur.execute("""
                INSERT OR REPLACE INTO intelligence_master (
                    content_id, canonical_hash, primary_headline, origin_platform,
                    published_timestamp, processed_timestamp, sentiment_score,
                    accuracy_rating, validation_index, impact_ranking, anomaly_metric,
                    open_jev_audit, platform_distribution, multimodal_features
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                record.content_id,
                record.canonical_hash,
                record.primary_headline,
                record.origin_platform,
                record.published_timestamp.isoformat(),
                record.processed_timestamp.isoformat(),
                record.sentiment_score,
                record.accuracy_rating,
                record.validation_index,
                record.impact_ranking,
                record.anomaly_metric,
                json.dumps(record.open_jev_audit),
                json.dumps(record.platform_distribution),
                json.dumps(record.multimodal_features) if record.multimodal_features else None,
            ))
            self.sqlite_conn.commit()

    def get_top_impact_intelligence(self, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Queries Materialized View 'mv_top_impact_intelligence':
        - published_timestamp >= NOW() - 24 HOURS
        - anomaly_metric < 0.65
        - ORDER BY impact_ranking DESC LIMIT 100
        """
        if self.is_postgres:
            with self.pg_conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT
                        content_id,
                        primary_headline,
                        origin_platform,
                        accuracy_rating,
                        impact_ranking,
                        factual_verdict,
                        reasoning_nodes,
                        platform_distribution
                    FROM mv_top_impact_intelligence
                    ORDER BY impact_ranking DESC
                    LIMIT %s;
                """, (limit,))
                rows = cur.fetchall()
                results = []
                for r in rows:
                    results.append({
                        "content_id": str(r["content_id"]),
                        "primary_headline": r["primary_headline"],
                        "origin_platform": r["origin_platform"],
                        "accuracy_rating": float(r["accuracy_rating"]),
                        "impact_ranking": float(r["impact_ranking"]),
                        "factual_verdict": r["factual_verdict"],
                        "reasoning_nodes": r["reasoning_nodes"] if isinstance(r["reasoning_nodes"], list) else [],
                        "platform_distribution": r["platform_distribution"] if isinstance(r["platform_distribution"], dict) else {},
                    })
                return results
        else:
            cur = self.sqlite_conn.cursor()
            cur.execute("""
                SELECT
                    content_id,
                    primary_headline,
                    origin_platform,
                    accuracy_rating,
                    impact_ranking,
                    sentiment_score,
                    validation_index,
                    anomaly_metric,
                    open_jev_audit,
                    platform_distribution
                FROM intelligence_master
                WHERE anomaly_metric < 0.65
                ORDER BY impact_ranking DESC
                LIMIT ?;
            """, (limit,))
            rows = cur.fetchall()
            results = []
            for r in rows:
                audit = json.loads(r["open_jev_audit"])
                results.append({
                    "content_id": r["content_id"],
                    "primary_headline": r["primary_headline"],
                    "origin_platform": r["origin_platform"],
                    "accuracy_rating": r["accuracy_rating"],
                    "impact_ranking": r["impact_ranking"],
                    "sentiment_score": r["sentiment_score"],
                    "validation_index": r["validation_index"],
                    "factual_verdict": audit.get("verdict", "Unknown"),
                    "reasoning_nodes": audit.get("reasoning_chain", []),
                    "platform_distribution": json.loads(r["platform_distribution"]),
                })
            return results

    def get_by_content_id(self, content_id: str) -> Optional[Dict[str, Any]]:
        if self.is_postgres:
            with self.pg_conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM intelligence_master WHERE content_id = %s;", (content_id,))
                row = cur.fetchone()
                if not row:
                    return None
                return {
                    "content_id": str(row["content_id"]),
                    "canonical_hash": row["canonical_hash"],
                    "primary_headline": row["primary_headline"],
                    "origin_platform": row["origin_platform"],
                    "published_timestamp": row["published_timestamp"].isoformat(),
                    "processed_timestamp": row["processed_timestamp"].isoformat(),
                    "sentiment_score": float(row["sentiment_score"]),
                    "accuracy_rating": float(row["accuracy_rating"]),
                    "validation_index": float(row["validation_index"]),
                    "impact_ranking": float(row["impact_ranking"]),
                    "anomaly_metric": float(row["anomaly_metric"]),
                    "open_jev_audit": row["open_jev_audit"],
                    "platform_distribution": row["platform_distribution"],
                    "multimodal_features": row["multimodal_features"],
                }
        else:
            cur = self.sqlite_conn.cursor()
            cur.execute("SELECT * FROM intelligence_master WHERE content_id = ?;", (content_id,))
            row = cur.fetchone()
            if not row:
                return None
            return {
                "content_id": row["content_id"],
                "canonical_hash": row["canonical_hash"],
                "primary_headline": row["primary_headline"],
                "origin_platform": row["origin_platform"],
                "published_timestamp": row["published_timestamp"],
                "processed_timestamp": row["processed_timestamp"],
                "sentiment_score": row["sentiment_score"],
                "accuracy_rating": row["accuracy_rating"],
                "validation_index": row["validation_index"],
                "impact_ranking": row["impact_ranking"],
                "anomaly_metric": row["anomaly_metric"],
                "open_jev_audit": json.loads(row["open_jev_audit"]),
                "platform_distribution": json.loads(row["platform_distribution"]),
                "multimodal_features": json.loads(row["multimodal_features"]) if row["multimodal_features"] else None,
            }
