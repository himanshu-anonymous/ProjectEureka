"""
Comprehensive Test Suite for NousResearch Hermes Agent Integration.
Verifies autonomous tool execution loop, persistent memory, subagent spawning,
Open-Jev System 1 formal logic integration, Gemma 4 discovery, and FastAPI endpoints.
"""

import pytest
import asyncio
from unittest.mock import patch
from fastapi.testclient import TestClient

from savi.config import settings
from savi.hermes.schema import (
    HermesToolCall,
    HermesToolResult,
    HermesSkill,
    HermesStep,
    HermesTrajectory,
    HermesInvestigationReport,
)
from savi.hermes.memory import HermesSessionMemory
from savi.hermes.tools import HermesToolRegistry
from savi.hermes.agent import HermesInvestigationAgent
from savi.api.main import app


def test_hermes_session_memory_working_and_facts():
    """Verify Hermes two-tier memory: transient working vs persistent factual."""
    memory = HermesSessionMemory()

    # Working memory
    memory.store_working("active_query", "semiconductor export restrictions")
    assert memory.recall_working("active_query") == "semiconductor export restrictions"
    assert memory.recall_working("non_existent", "default") == "default"

    # Factual knowledge
    memory.store_fact("entity:tsmc", {"trust": 0.95, "sector": "foundry"})
    recalled_fact = memory.recall_fact("entity:tsmc")
    assert recalled_fact is not None
    assert recalled_fact["trust"] == 0.95

    # Memory clear
    memory.clear_working_memory()
    assert memory.recall_working("active_query") is None
    # Factual knowledge survives
    assert memory.recall_fact("entity:tsmc") is not None


def test_hermes_skills_bank_learning_loop():
    """Verify self-improving procedural skills registration and usage tracking."""
    memory = HermesSessionMemory()
    initial_skills = len(memory.list_skills())
    assert initial_skills >= 2  # Seed skills present

    new_skill = HermesSkill(
        name="cross_platform_disinformation_audit",
        description="Audit velocity spike and astroturfed accounts across Twitter and Reddit.",
        instructions="Sample 6D vector -> Run Isolation Rainforest -> Query Open-Jev Noul.",
    )
    memory.register_skill(new_skill)

    retrieved = memory.get_skill("cross_platform_disinformation_audit")
    assert retrieved is not None
    assert retrieved.name == "cross_platform_disinformation_audit"
    assert retrieved.usage_count == 1

    # Second recall increments usage
    memory.get_skill("cross_platform_disinformation_audit")
    assert retrieved.usage_count == 2


@pytest.mark.asyncio
async def test_hermes_tool_registry_execution():
    """Verify SAVI tool execution via HermesToolRegistry."""
    memory = HermesSessionMemory()
    registry = HermesToolRegistry(memory=memory)

    defs = registry.get_definitions()
    tool_names = [d.name for d in defs]
    assert "search_web_gemma" in tool_names
    assert "scrape_article_firecrawl" in tool_names
    assert "extract_knowledge_graph_triplets" in tool_names
    assert "verify_claim_open_jev" in tool_names
    assert "detect_bot_anomalies" in tool_names
    assert "calculate_savi_metrics" in tool_names
    assert "store_memory" in tool_names
    assert "recall_memory" in tool_names
    assert "learn_skill" in tool_names

    # Test Open-Jev verification tool call
    call = HermesToolCall(
        tool_name="verify_claim_open_jev",
        arguments={"claim": "Federal Reserve adjusts benchmark rate by 25 bps.", "context": "FOMC press release"},
    )
    result = await registry.execute_tool(call)
    assert result.success is True
    assert "verdict" in result.output
    assert "evidence_score" in result.output

    # Test Anomaly detection tool call
    call_anomaly = HermesToolCall(
        tool_name="detect_bot_anomalies",
        arguments={"features": [25.0, 0.9, 1.2, 0.4, 0.95, 1.0]},
    )
    res_anomaly = await registry.execute_tool(call_anomaly)
    assert res_anomaly.success is True
    assert "anomaly_score" in res_anomaly.output
    assert "verdict" in res_anomaly.output

    # Test SAVI Metrics tool call
    call_metrics = HermesToolCall(
        tool_name="calculate_savi_metrics",
        arguments={"sentiment_val": 0.2, "authority_val": 2.5, "validation_score": 0.9, "impact_reach": 2000.0},
    )
    res_metrics = await registry.execute_tool(call_metrics)
    assert res_metrics.success is True
    assert "composite_savi_score" in res_metrics.output
    assert "sentiment_score" in res_metrics.output


def test_hermes_subagent_spawning():
    """Verify subagent spawning inherits knowledge and skills with independent working memory."""
    agent = HermesInvestigationAgent()
    agent.memory.store_fact("parent_fact", "verified_signal")

    subagent = agent.spawn_subagent(role="Secondary Verifier")
    assert subagent is not None
    assert subagent.memory.recall_fact("parent_fact") == "verified_signal"

    # Working memory isolation
    agent.memory.store_working("parent_scratch", 123)
    assert subagent.memory.recall_working("parent_scratch") is None


@pytest.mark.asyncio
async def test_hermes_agent_investigate_autonomous_trajectory():
    """Verify end-to-end autonomous investigation trajectory and report synthesis."""
    agent = HermesInvestigationAgent()

    with patch("httpx.AsyncClient.post", side_effect=Exception("Mocked network call")):
        report = await agent.investigate(
            query="Global chip manufacturing capacity expansion in Europe",
            max_steps=5,
            deep_verification=True,
        )

        assert isinstance(report, HermesInvestigationReport)
        assert report.query == "Global chip manufacturing capacity expansion in Europe"
        assert report.verdict in ["VERIFIED_TRUE", "UNVERIFIED_DEVELOPING", "MANIPULATED_DISINFORMATION"]
        assert report.confidence_score > 0.0
        assert len(report.trajectory.steps) >= 4
        assert report.trajectory.status == "COMPLETED"

        # Trajectory step audit
        step_names = [s.tool_call.tool_name for s in report.trajectory.steps if s.tool_call]
        assert "search_web_gemma" in step_names
        assert "scrape_article_firecrawl" in step_names
        assert "extract_knowledge_graph_triplets" in step_names
        assert "verify_claim_open_jev" in step_names

        # Self-improvement check
        assert len(report.learned_skills) >= 1
        assert len(report.savi_composite_metrics) > 0


def test_hermes_fastapi_endpoints():
    """Verify FastAPI routes for Hermes investigation, skills, and memory."""
    client = TestClient(app)

    # 1. GET /api/v1/hermes/skills
    resp_skills = client.get("/api/v1/hermes/skills")
    assert resp_skills.status_code == 200
    data_skills = resp_skills.json()
    assert "skills" in data_skills
    assert data_skills["count"] >= 2

    # 2. GET /api/v1/hermes/memory
    resp_mem = client.get("/api/v1/hermes/memory")
    assert resp_mem.status_code == 200
    data_mem = resp_mem.json()
    assert "factual_knowledge" in data_mem

    # 3. POST /api/v1/hermes/investigate
    with patch("httpx.AsyncClient.post", side_effect=Exception("Simulated offline")):
        resp_inv = client.post(
            "/api/v1/hermes/investigate",
            json={
                "query": "Quantum computing cryptographic breakthrough",
                "max_steps": 5,
                "deep_verification": False,
            },
        )
        assert resp_inv.status_code == 200
        inv_data = resp_inv.json()
        assert "investigation_id" in inv_data
        assert "trajectory" in inv_data
        assert "verdict" in inv_data
        assert len(inv_data["trajectory"]["steps"]) >= 4


def test_extension_analyze_with_hermes_mode():
    """Verify browser extension endpoint with use_hermes=True flag."""
    client = TestClient(app)

    with patch("httpx.AsyncClient.post", side_effect=Exception("Simulated offline")):
        response = client.post(
            "/api/v1/extension/analyze",
            json={
                "url": "https://reuters.com/markets/energy/clean-hydrogen-2026",
                "title": "Clean Hydrogen Production Milestones Reported in European Infrastructure",
                "raw_text": "European energy consortium achieves green hydrogen cost parity ahead of 2030 projection.",
                "use_hermes": True,
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "hermes_investigation" in data
        assert data["hermes_investigation"] is not None
        assert "trajectory" in data["hermes_investigation"]
        assert "verdict" in data["hermes_investigation"]
