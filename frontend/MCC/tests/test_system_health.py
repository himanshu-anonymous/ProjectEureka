"""
Tests for SAVI Platform System Health Checkup and Diagnostic Subsystem.
Verifies diagnostics across:
1. PostgreSQL 16 CQRS store and materialized views
2. Neo4j graph cluster compute
3. Open-Jev System 1 Decision Head
4. Isolation Rainforest anomaly detection
5. PPO reinforcement learning controller
6. API credential rotation mesh
7. System runtime telemetry
8. FastAPI /health and /api/v1/system/health endpoints
"""

import pytest
from fastapi.testclient import TestClient

from savi.diagnostics import (
    SystemHealthChecker,
    ComponentHealth,
    SystemHealthReport,
)
from savi.api.main import app


@pytest.fixture
def health_checker():
    return SystemHealthChecker()


def test_system_health_checker_initialization(health_checker):
    assert health_checker.query_store is not None
    assert health_checker.open_jev_client is not None
    assert health_checker.local_jev_engine is not None
    assert health_checker.rainforest is not None
    assert health_checker.ppo_controller is not None


def test_check_postgresql(health_checker):
    health = health_checker.check_postgresql()
    assert isinstance(health, ComponentHealth)
    assert health.name == "PostgreSQL Master"
    assert health.status in ("HEALTHY", "DEGRADED", "UNHEALTHY")
    assert health.latency_ms is not None
    assert health.latency_ms >= 0.0
    assert "port" in health.details


def test_check_neo4j(health_checker):
    health = health_checker.check_neo4j()
    assert isinstance(health, ComponentHealth)
    assert health.name == "Neo4j Graph Compute"
    assert health.status in ("HEALTHY", "DEGRADED", "UNHEALTHY")
    assert health.latency_ms is not None
    assert "uri" in health.details


def test_check_open_jev(health_checker):
    health = health_checker.check_open_jev()
    assert isinstance(health, ComponentHealth)
    assert health.name == "Open-Jev System 1 Decision Head"
    assert health.status == "HEALTHY"
    assert health.latency_ms is not None
    assert health.latency_ms > 0.0
    assert "choice_confidence" in health.details
    assert "noul_yes_probability" in health.details
    assert "score_expected" in health.details


def test_check_rainforest(health_checker):
    health = health_checker.check_rainforest()
    assert isinstance(health, ComponentHealth)
    assert health.name == "Isolation Rainforest (EIF)"
    assert health.status == "HEALTHY"
    assert health.latency_ms is not None
    assert health.latency_ms > 0.0
    assert health.details["n_trees"] > 0
    assert 0.0 <= health.details["test_vector_score"] <= 1.0
    assert health.details["probe_route_action"] in ("PASS_ORGANIC", "FLAG_ELEVATED", "QUARANTINE")


def test_check_ppo_controller(health_checker):
    health = health_checker.check_ppo_controller()
    assert isinstance(health, ComponentHealth)
    assert health.name == "PPO RL Controller"
    assert health.status == "HEALTHY"
    assert health.latency_ms is not None
    assert health.details["state_dim"] == 6
    assert health.details["action_dim"] == 6
    assert 0 <= health.details["probe_action"] < 6


def test_check_api_credentials(health_checker):
    health = health_checker.check_api_credentials()
    assert isinstance(health, ComponentHealth)
    assert health.name == "External API Credentials Mesh"
    assert health.status in ("HEALTHY", "DEGRADED")
    assert "gemini_key_rotation_ready" in health.details


def test_check_system_telemetry(health_checker):
    health = health_checker.check_system_telemetry()
    assert isinstance(health, ComponentHealth)
    assert health.name == "System Host & Runtime Telemetry"
    assert health.status == "HEALTHY"
    assert health.details["uptime_seconds"] >= 0.0
    assert health.details["cpu_count"] >= 1
    assert "os_platform" in health.details
    assert "python_version" in health.details


def test_generate_report(health_checker):
    report = health_checker.generate_report()
    assert isinstance(report, SystemHealthReport)
    assert report.overall_status in ("HEALTHY", "DEGRADED", "UNHEALTHY")
    assert report.uptime_seconds >= 0.0
    assert "postgresql" in report.components
    assert "neo4j" in report.components
    assert "open_jev" in report.components
    assert "isolation_rainforest" in report.components
    assert "ppo_controller" in report.components
    assert "api_credentials" in report.components
    assert "system_telemetry" in report.components
    assert report.summary["total_components"] == 7
    assert (
        report.summary["healthy_components"]
        + report.summary["degraded_components"]
        + report.summary["unhealthy_components"]
        == 7
    )


def test_api_health_endpoint():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "overall_status" in data
    assert "components" in data
    assert "summary" in data
    assert data["summary"]["total_components"] == 7


def test_api_system_health_endpoint():
    client = TestClient(app)
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    data = response.json()
    assert "overall_status" in data
    assert "components" in data
    assert "postgresql" in data["components"]
    assert "neo4j" in data["components"]
    assert "open_jev" in data["components"]
    assert "isolation_rainforest" in data["components"]
    assert "ppo_controller" in data["components"]
    assert "api_credentials" in data["components"]
    assert "system_telemetry" in data["components"]
    assert data["summary"]["total_components"] == 7
