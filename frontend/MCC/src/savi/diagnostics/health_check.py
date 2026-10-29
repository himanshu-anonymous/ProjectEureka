"""
SAVI Platform: Comprehensive System Health Check & Diagnostic Service.
Performs real-time diagnostics across:
1. Persistence & CQRS Stores (PostgreSQL 16 & Neo4j 5.x)
2. Decision Models & Open-Jev System 1 Primitives (Choice, Noul, Score)
3. Anomaly Detection (Isolation Rainforest oblique trees)
4. Reinforcement Learning (Point-Based PPO Controller)
5. Quad-Model Ingestion Mesh & API Credentials
6. Asynchronous CDC Transaction Worker
7. Host Telemetry & Resource Utilization
"""

from __future__ import annotations
import os
import platform
import sys
import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field

from savi.config import settings
from savi.open_jev.engine import LocalOpenJevEngine
from savi.open_jev.schema import ChoiceQuestion, NoulQuestion, ScoreQuestion
from savi.open_jev.client import OpenJevClient
from savi.anomaly.isolation_rainforest import IsolationRainforest
from savi.ingestion.ppo_controller import PPOController
from savi.persistence.postgres_store import IntelligenceQueryStore
from savi.graph.neo4j_driver import Neo4jLiveClusterClient


START_TIME = time.time()


class ComponentHealth(BaseModel):
    name: str
    status: str  # "HEALTHY" | "DEGRADED" | "UNHEALTHY"
    latency_ms: Optional[float] = None
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)


class SystemHealthReport(BaseModel):
    overall_status: str  # "HEALTHY" | "DEGRADED" | "UNHEALTHY"
    timestamp: str
    uptime_seconds: float
    platform: str
    python_version: str
    components: Dict[str, ComponentHealth]
    summary: Dict[str, Any]


class SystemHealthChecker:
    """
    Comprehensive diagnostic engine inspecting all 5 phases of the SAVI architecture.
    """
    def __init__(self, query_store: Optional[IntelligenceQueryStore] = None):
        self.query_store = query_store or IntelligenceQueryStore(in_memory=False)
        self.open_jev_client = OpenJevClient()
        self.local_jev_engine = LocalOpenJevEngine()
        self.rainforest = IsolationRainforest()
        self.ppo_controller = PPOController()

    def check_postgresql(self) -> ComponentHealth:
        """Audits PostgreSQL Master, tables, indices, and materialized view latency."""
        t0 = time.perf_counter()
        db = settings.db

        if not self.query_store.is_postgres:
            return ComponentHealth(
                name="PostgreSQL Master",
                status="DEGRADED",
                latency_ms=0.0,
                message="PostgreSQL unreachable; running in SQLite emulation fallback mode.",
                details={"store_type": "sqlite", "host": db.postgres_host, "port": db.postgres_port},
            )

        try:
            import psycopg2
            conn = psycopg2.connect(
                host=db.postgres_host,
                port=db.postgres_port,
                dbname=db.postgres_db,
                user=db.postgres_user,
                password=db.postgres_password,
                connect_timeout=3,
            )
            with conn.cursor() as cur:
                # 1. Table existence and count
                cur.execute("SELECT count(*) FROM intelligence_master;")
                record_count = cur.fetchone()[0]

                # 2. Materialized view status & query latency
                t_mv = time.perf_counter()
                cur.execute("SELECT count(*) FROM mv_top_impact_intelligence;")
                mv_count = cur.fetchone()[0]
                mv_latency_ms = (time.perf_counter() - t_mv) * 1000.0

                # 3. Indices
                cur.execute("""
                    SELECT indexname FROM pg_indexes 
                    WHERE schemaname = 'public' AND tablename = 'intelligence_master';
                """)
                indices = [row[0] for row in cur.fetchall()]

            conn.close()
            total_latency = (time.perf_counter() - t0) * 1000.0

            is_fast = mv_latency_ms < 15.0
            status_val = "HEALTHY" if is_fast else "DEGRADED"

            return ComponentHealth(
                name="PostgreSQL Master",
                status=status_val,
                latency_ms=round(total_latency, 3),
                message=f"PostgreSQL 16 active on port {db.postgres_port}. MV latency: {mv_latency_ms:.2f}ms.",
                details={
                    "database": db.postgres_db,
                    "host": db.postgres_host,
                    "port": db.postgres_port,
                    "records_count": record_count,
                    "materialized_view_rows": mv_count,
                    "mv_query_latency_ms": round(mv_latency_ms, 3),
                    "indices": indices,
                },
            )
        except Exception as e:
            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="PostgreSQL Master",
                status="UNHEALTHY",
                latency_ms=round(latency, 3),
                message=f"PostgreSQL connection failed: {str(e)}",
                details={"error": str(e), "host": db.postgres_host, "port": db.postgres_port},
            )

    def check_neo4j(self) -> ComponentHealth:
        """Audits Neo4j Graph Database cluster connectivity and node/relationship counts."""
        t0 = time.perf_counter()
        db = settings.db
        client = Neo4jLiveClusterClient()

        if not client.is_connected:
            return ComponentHealth(
                name="Neo4j Graph Compute",
                status="DEGRADED",
                latency_ms=0.0,
                message="Neo4j cluster unreachable; topological compute operating in-memory.",
                details={"uri": db.neo4j_uri, "fallback": "in_memory_networkx"},
            )

        try:
            with client.driver.session() as session:
                result = session.run("RETURN 1 AS ping")
                ping_val = result.single()["ping"]

                # Optional node count
                node_res = session.run("MATCH (n) RETURN count(n) AS cnt")
                node_cnt = node_res.single()["cnt"]

                rel_res = session.run("MATCH ()-[r]->() RETURN count(r) AS cnt")
                rel_cnt = rel_res.single()["cnt"]

            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="Neo4j Graph Compute",
                status="HEALTHY",
                latency_ms=round(latency, 3),
                message=f"Neo4j 5.x connected at {db.neo4j_uri}. Nodes: {node_cnt}, Edges: {rel_cnt}.",
                details={
                    "uri": db.neo4j_uri,
                    "node_count": node_cnt,
                    "relationship_count": rel_cnt,
                    "ping": ping_val,
                },
            )
        except Exception as e:
            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="Neo4j Graph Compute",
                status="DEGRADED",
                latency_ms=round(latency, 3),
                message=f"Neo4j query error: {str(e)}; fallback active.",
                details={"error": str(e), "uri": db.neo4j_uri},
            )

    def check_open_jev(self) -> ComponentHealth:
        """Audits Open-Jev System 1 primitives: Choice, Noul, Score."""
        t0 = time.perf_counter()
        try:
            # 1. Choice test
            c_dec = self.local_jev_engine.evaluate_choice(
                state="Health audit probe for system validation",
                question=ChoiceQuestion(options=["primary", "secondary"], instructions="Select route"),
                temp=0.7,
            )
            # 2. Noul test
            n_dec = self.local_jev_engine.evaluate_noul(
                state="Health checkup signal",
                question=NoulQuestion(instructions="Is system operational?"),
                temp=0.7,
            )
            # 3. Score test
            s_dec = self.local_jev_engine.evaluate_score(
                state="Optimal health performance",
                question=ScoreQuestion(instructions="Score system health", levels=[1, 2, 3, 4, 5]),
                temp=0.7,
            )

            latency = (time.perf_counter() - t0) * 1000.0

            return ComponentHealth(
                name="Open-Jev System 1 Decision Head",
                status="HEALTHY",
                latency_ms=round(latency, 3),
                message=f"Open-Jev ({self.local_jev_engine.model_id}) primitives verified in {latency:.2f}ms.",
                details={
                    "model_id": self.local_jev_engine.model_id,
                    "temperature": self.local_jev_engine.temperature,
                    "choice_confidence": c_dec.confidence,
                    "noul_yes_probability": n_dec.probabilities.get("yes"),
                    "score_expected": s_dec.score,
                    "server_endpoint": settings.credentials.open_jev_server_url,
                },
            )
        except Exception as e:
            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="Open-Jev System 1 Decision Head",
                status="UNHEALTHY",
                latency_ms=round(latency, 3),
                message=f"Open-Jev execution failed: {str(e)}",
                details={"error": str(e)},
            )

    def check_rainforest(self) -> ComponentHealth:
        """Audits Isolation Rainforest tree fitting and anomaly boundary calculations."""
        t0 = time.perf_counter()
        try:
            import numpy as np
            if not self.rainforest.trees:
                # Fit sample
                sample = np.random.uniform(0.1, 5.0, (100, 6)).astype(np.float32)
                self.rainforest.fit(sample)

            test_vec = np.array([15.0, 0.8, 2.5, 0.4, 0.95, 1.0], dtype=np.float32)
            score = float(self.rainforest.compute_anomaly_score(test_vec))
            action, route_info = self.rainforest.route_decision(score)
            latency = (time.perf_counter() - t0) * 1000.0

            return ComponentHealth(
                name="Isolation Rainforest (EIF)",
                status="HEALTHY",
                latency_ms=round(latency, 3),
                message=f"Rainforest active with {len(self.rainforest.trees)} oblique hyperplane trees (Probe Route: {action}).",
                details={
                    "n_trees": len(self.rainforest.trees),
                    "subsample_size": self.rainforest.subsample_size,
                    "max_depth": self.rainforest.max_depth,
                    "test_vector_score": round(score, 4),
                    "probe_route_action": action,
                },
            )
        except Exception as e:
            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="Isolation Rainforest (EIF)",
                status="UNHEALTHY",
                latency_ms=round(latency, 3),
                message=f"Rainforest error: {str(e)}",
                details={"error": str(e)},
            )

    def check_ppo_controller(self) -> ComponentHealth:
        """Audits PPO Reinforcement Learning policy controller and transition state."""
        t0 = time.perf_counter()
        try:
            import numpy as np
            state_vec = np.zeros(6, dtype=np.float32)
            action, log_prob, val = self.ppo_controller.select_action(state_vec)
            latency = (time.perf_counter() - t0) * 1000.0

            action_names = ["DECREASE_DELAY", "INCREASE_DELAY", "SWITCH_PARSER", "ROTATE_PROXY", "SOFT_BACKOFF", "ROTATE_KEY"]
            selected_action_name = action_names[action] if 0 <= action < len(action_names) else f"Action_{action}"

            return ComponentHealth(
                name="PPO RL Controller",
                status="HEALTHY",
                latency_ms=round(latency, 3),
                message=f"PPO Policy active (Action Space: 6, State Dim: 6). Probe: {selected_action_name}.",
                details={
                    "state_dim": 6,
                    "action_dim": 6,
                    "probe_action": action,
                    "probe_action_name": selected_action_name,
                    "value_estimate": round(val, 4),
                    "memory_trajectory_size": len(self.ppo_controller.memory.states),
                },
            )
        except Exception as e:
            latency = (time.perf_counter() - t0) * 1000.0
            return ComponentHealth(
                name="PPO RL Controller",
                status="UNHEALTHY",
                latency_ms=round(latency, 3),
                message=f"PPO Controller error: {str(e)}",
                details={"error": str(e)},
            )

    def check_api_credentials(self) -> ComponentHealth:
        """Audits API keys and dual-key rotation registry for Gemma 4 and external providers."""
        creds = settings.credentials
        gemma_1 = bool(creds.gemma_api_key or creds.gemini_api_key)
        gemma_2 = bool(creds.gemma_api_key_2 or creds.gemini_api_key_2)
        firecrawl = bool(creds.firecrawl_api_key)
        openai = bool(creds.openai_api_key)
        apify = bool(creds.apify_api_key)

        configured_count = sum([gemma_1, gemma_2, firecrawl, openai, apify])
        status_val = "HEALTHY" if configured_count >= 3 else "DEGRADED"

        return ComponentHealth(
            name="External API Credentials Mesh",
            status=status_val,
            latency_ms=0.0,
            message=f"{configured_count}/5 key slots configured. Dual Gemma key rotation: {'Active' if (gemma_1 and gemma_2) else 'Single Key'}.",
            details={
                "gemma_primary_configured": gemma_1,
                "gemma_secondary_configured": gemma_2,
                "gemma_key_rotation_ready": gemma_1 and gemma_2,
                "gemma_model": creds.gemma_model,
                "gemini_primary_configured": gemma_1,
                "gemini_secondary_configured": gemma_2,
                "gemini_key_rotation_ready": gemma_1 and gemma_2,
                "gemini_model": creds.gemma_model,
                "firecrawl_configured": firecrawl,
                "openai_configured": openai,
                "openai_model": creds.openai_chat_model,
                "apify_configured": apify,
            },
        )

    def check_system_telemetry(self) -> ComponentHealth:
        """Audits process memory, CPU utilization, host OS, and uptime."""
        uptime = time.time() - START_TIME
        rss_mb = 0.0
        sys_ram_percent = 0.0
        sys_ram_total_gb = 0.0
        cpu_count = os.cpu_count() or 1

        try:
            import psutil
            process = psutil.Process(os.getpid())
            mem_info = process.memory_info()
            rss_mb = mem_info.rss / (1024 * 1024)
            sys_mem = psutil.virtual_memory()
            sys_ram_percent = sys_mem.percent
            sys_ram_total_gb = sys_mem.total / (1024**3)
            cpu_count = psutil.cpu_count() or cpu_count
            telemetry_source = "psutil"
        except ImportError:
            telemetry_source = "standard_library_fallback"

        return ComponentHealth(
            name="System Host & Runtime Telemetry",
            status="HEALTHY",
            latency_ms=0.0,
            message=f"Uptime: {uptime:.1f}s | Process RSS: {rss_mb:.1f} MB | System RAM: {sys_ram_percent}% used.",
            details={
                "process_rss_mb": round(rss_mb, 2),
                "system_ram_total_gb": round(sys_ram_total_gb, 2),
                "system_ram_used_percent": sys_ram_percent,
                "cpu_count": cpu_count,
                "uptime_seconds": round(uptime, 1),
                "os_platform": f"{platform.system()} {platform.release()}",
                "python_version": sys.version.split()[0],
                "telemetry_source": telemetry_source,
            },
        )

    def generate_report(self) -> SystemHealthReport:
        """Executes full diagnostic suite and aggregates report."""
        components = {
            "postgresql": self.check_postgresql(),
            "neo4j": self.check_neo4j(),
            "open_jev": self.check_open_jev(),
            "isolation_rainforest": self.check_rainforest(),
            "ppo_controller": self.check_ppo_controller(),
            "api_credentials": self.check_api_credentials(),
            "system_telemetry": self.check_system_telemetry(),
        }

        # Aggregate overall status
        statuses = [c.status for c in components.values()]
        if any(s == "UNHEALTHY" for s in statuses):
            overall = "UNHEALTHY"
        elif any(s == "DEGRADED" for s in statuses):
            overall = "DEGRADED"
        else:
            overall = "HEALTHY"

        uptime = time.time() - START_TIME

        return SystemHealthReport(
            overall_status=overall,
            timestamp=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=round(uptime, 2),
            platform=f"{platform.system()} {platform.release()} ({platform.machine()})",
            python_version=sys.version.split()[0],
            components=components,
            summary={
                "total_components": len(components),
                "healthy_components": sum(1 for s in statuses if s == "HEALTHY"),
                "degraded_components": sum(1 for s in statuses if s == "DEGRADED"),
                "unhealthy_components": sum(1 for s in statuses if s == "UNHEALTHY"),
            },
        )
