"""
Unit and integration test suite for Zefan-Cai/Open-Jev System 1 Decision Integration.
Verifies Choice, Noul, and Score primitives, client fallback, server endpoints,
and integration into DecisionOrchestrator and OpenJEVLogicEngine.
"""

import pytest
from fastapi.testclient import TestClient

from savi.open_jev.schema import (
    ChoiceQuestion,
    NoulQuestion,
    ScoreQuestion,
    OpenJevRequest,
    OpenJevResponse,
)
from savi.open_jev.engine import LocalOpenJevEngine
from savi.open_jev.client import OpenJevClient, Client
from savi.orchestration.decision_orchestrator import (
    DecisionOrchestrator,
    OrchestratorDecisionInput,
)
from savi.graph.open_jev import OpenJEVLogicEngine
from savi.graph.triplet_extractor import Triplet
from savi.api.main import app


def test_open_jev_engine_choice_primitive():
    """Verify Open-Jev evaluates Choice questions returning calibrated probabilities."""
    engine = LocalOpenJevEngine(model_id="ZefanCai/Open-Jev-27B-v1.1")
    q = ChoiceQuestion(
        type="choice",
        options=["search", "scrape", "api", "backoff"],
        instructions="Select ingestion strategy for new unknown topic",
    )
    decision = engine.evaluate_choice("New topic requested by user without URLs", q, temp=0.7)

    assert decision.type == "choice"
    assert decision.selected in q.options
    assert len(decision.probabilities) == 4
    assert sum(decision.probabilities.values()) == pytest.approx(1.0, abs=0.01)
    assert decision.confidence > 0.0


def test_open_jev_engine_noul_primitive():
    """Verify Open-Jev evaluates Noul questions returning yes/no/uncertain probabilities."""
    engine = LocalOpenJevEngine()
    q = NoulQuestion(
        type="noul",
        instructions="Did the ingestion mesh experience HTTP 429 rate limit or quota exhaustion?",
    )

    # State with rate limit trigger
    dec_hit = engine.evaluate_noul("Warning: scraper hit 429 rate limit error code.", q, temp=0.7)
    assert dec_hit.type == "noul"
    assert "yes" in dec_hit.probabilities
    assert "no" in dec_hit.probabilities
    assert "uncertain" in dec_hit.probabilities
    assert dec_hit.probabilities["yes"] > dec_hit.probabilities["no"]

    # State without rate limit trigger
    dec_clean = engine.evaluate_noul("Standard organic harvesting 200 OK throughput.", q, temp=0.7)
    assert dec_clean.probabilities["no"] > dec_clean.probabilities["yes"]


def test_open_jev_engine_score_primitive():
    """Verify Open-Jev evaluates Score questions returning level probabilities and expected score."""
    engine = LocalOpenJevEngine()
    q = ScoreQuestion(
        type="score",
        instructions="Assess throttling risk level",
        levels=[1, 2, 3, 4, 5],
    )
    decision = engine.evaluate_score("High rate limits and repeated 429 delays encountered", q, temp=0.7)

    assert decision.type == "score"
    assert len(decision.probabilities) == 5
    assert sum(decision.probabilities.values()) == pytest.approx(1.0, abs=0.01)
    assert 1.0 <= decision.score <= 5.0


def test_open_jev_client_convenience_methods():
    """Verify OpenJevClient matches `from jev.client import Client` helper methods."""
    client = Client()

    # Choice helper
    c_dec = client.ask_choice(
        state="Breaking geopolitics wire report published",
        options=["web_search_gemini", "reddit", "twitter"],
        instructions="Select primary discovery agent",
    )
    assert c_dec.selected in ["web_search_gemini", "reddit", "twitter"]

    # Noul helper
    n_dec = client.ask_noul(
        state="Cloudflare anti-bot challenge captcha detected on target page",
        instructions="Was a bot wall or captcha encountered?",
    )
    assert n_dec.probabilities["yes"] > 0.40

    # Score helper
    s_dec = client.ask_score(
        state="Optimal scraping latency under 100ms with zero errors",
        instructions="Evaluate system performance score",
        levels=[1, 2, 3, 4, 5],
    )
    assert 1.0 <= s_dec.score <= 5.0


@pytest.mark.asyncio
async def test_open_jev_client_async_ask():
    """Verify async ask returns structured response."""
    client = OpenJevClient()
    res = await client.ask_async(
        state="Central bank announces monetary policy adjustment",
        questions={
            "action": {
                "type": "choice",
                "options": ["scrape", "search"],
            },
            "is_policy": {
                "type": "noul",
                "instructions": "Is this a macroeconomic policy announcement?",
            },
        },
    )
    assert isinstance(res, OpenJevResponse)
    assert "action" in res.decisions
    assert "is_policy" in res.decisions
    assert res.latency_ms >= 0.0


def test_decision_orchestrator_open_jev_probabilities():
    """Verify DecisionOrchestrator incorporates Open-Jev probability feedback."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="NVIDIA artificial intelligence chips",
        platforms_requested=["web", "reddit", "twitter", "youtube"],
    )
    output = orchestrator.plan_next_step(inp)

    assert output.open_jev_probabilities is not None
    assert "action_choice" in output.open_jev_probabilities
    assert "rate_limit_noul" in output.open_jev_probabilities
    assert output.risk_score is not None


def test_open_jev_logic_engine_verdict():
    """Verify OpenJEVLogicEngine includes Open-Jev System 1 decisions in audit payload."""
    engine = OpenJEVLogicEngine()
    claim = Triplet(subject="Company", predicate="confirms", object="Launch")
    evidence = [Triplet(subject="Company", predicate="confirms", object="Launch")]

    verdict = engine.verify_claim(claim, evidence)
    audit = verdict.to_audit_json()

    assert "open_jev_decisions" in audit
    assert "formal_verdict" in audit["open_jev_decisions"]
    assert audit["verdict"] in ["Entailment", "Neutral", "Contradiction"]


def test_open_jev_fastapi_endpoints():
    """Verify Open-Jev REST server endpoints /v1/systemone and /v1/health."""
    client = TestClient(app)

    # Health check
    health_resp = client.get("/v1/health")
    assert health_resp.status_code == 200
    health_data = health_resp.json()
    assert health_data["status"] == "healthy"
    assert "choice" in health_data["primitives_supported"]

    # System One Decision endpoint
    payload = {
        "state": "High volume market volatility detected on exchanges",
        "questions": {
            "strategy": {
                "type": "choice",
                "options": ["conservative", "aggressive", "neutral"],
            },
            "alert_needed": {
                "type": "noul",
                "instructions": "Should an anomaly alert be broadcasted?",
            },
        },
        "temperature": 0.7,
    }
    resp = client.post("/v1/systemone", json=payload)
    assert resp.status_code == 200
    res_data = resp.json()
    assert "decisions" in res_data
    assert "strategy" in res_data["decisions"]
    assert "alert_needed" in res_data["decisions"]
    assert res_data["decisions"]["strategy"]["type"] == "choice"
    assert res_data["decisions"]["alert_needed"]["type"] == "noul"
