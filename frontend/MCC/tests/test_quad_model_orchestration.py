"""
Unit and integration tests for SAVI Quad-Model Ingestion & Orchestration system.
Verifies Open-Jev decision rubric, Gemini key rotation, Firecrawl ingestion,
YouTube multimodal extraction, and end-to-end investigation workflow.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock

from savi.config import settings
from savi.orchestration.decision_orchestrator import (
    DecisionOrchestrator,
    OrchestratorDecisionInput,
    OrchestratorDecisionOutput,
)
from savi.ingestion.agents.web_discovery_gemma import (
    GemmaWebDiscoveryAgent,
    DiscoveryResult,
    GemmaDiscoveryArtifact,
    GeminiWebDiscoveryAgent,
    GeminiDiscoveryArtifact,
)
from savi.ingestion.agents.web_agent import FirecrawlScraper, WebIngestionAgent
from savi.ingestion.agents.reddit_agent import RedditIngestionAgent
from savi.ingestion.agents.twitter_agent import TwitterIngestionAgent
from savi.ingestion.agents.youtube_agent import YouTubeIngestionAgent
from savi.api.main import SAVIPipelineOrchestrator


def test_decision_orchestrator_initial_step():
    """Verify that an initial web query initiates Gemma Search Discovery."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="NVIDIA Blackwell architecture shipment delays",
        platforms_requested=["web", "reddit", "twitter", "youtube"],
    )
    decision = orchestrator.plan_next_step(inp)

    assert decision.next_agent in ["web_search_gemma", "web_search_gemini"]
    assert decision.action == "search"
    assert decision.fallback_tier == 1
    assert "reddit" in decision.parallel_agents
    assert "Initial query step" in decision.reasoning


def test_decision_orchestrator_url_handover():
    """Verify that discovered candidate URLs trigger Firecrawl scrape action."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="NVIDIA Blackwell architecture",
        candidate_urls_from_gemini=["https://reuters.com/tech/nvidia-chips-2026"],
        platforms_requested=["web", "reddit", "twitter", "youtube"],
    )
    decision = orchestrator.plan_next_step(inp)

    assert decision.next_agent == "web_scrape_firecrawl"
    assert decision.action == "scrape"
    assert decision.target == "https://reuters.com/tech/nvidia-chips-2026"
    assert decision.parser_mode == "firecrawl"


def test_decision_orchestrator_rate_limit_key_rotation():
    """Verify that HTTP 429 on primary key triggers PPO ROTATE_KEY to secondary key."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="macro policy update",
        last_execution_results={"web": {"hit_429_rate_limit": True}},
        active_gemini_key_index=0,
    )
    decision = orchestrator.plan_next_step(inp)

    assert decision.action == "rotate_key"
    assert decision.ppo_action_hint == "ROTATE_KEY"
    assert decision.fallback_tier == 2


def test_decision_orchestrator_secondary_rate_limit_backoff():
    """Verify that HTTP 429 when already on secondary key triggers SOFT_BACKOFF."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="macro policy update",
        last_execution_results={"web": {"hit_429_rate_limit": True}},
        active_gemini_key_index=1,
    )
    decision = orchestrator.plan_next_step(inp)

    assert decision.action == "backoff"
    assert decision.ppo_action_hint == "SOFT_BACKOFF"
    assert decision.fallback_tier == 3


def test_decision_orchestrator_captcha_switch_parser():
    """Verify that Captcha/Cloudflare detection triggers parser switch."""
    orchestrator = DecisionOrchestrator()
    inp = OrchestratorDecisionInput(
        user_intent="market news",
        candidate_urls_from_gemini=["https://bloomberg.com/markets/asia"],
        last_execution_results={"web": {"hit_captcha_challenge": True}},
    )
    decision = orchestrator.plan_next_step(inp)

    assert decision.action == "switch_parser"
    assert decision.ppo_action_hint == "SWITCH_PARSER"
    assert decision.parser_mode == "firecrawl"


def test_gemma_agent_key_rotation():
    """Verify that GemmaWebDiscoveryAgent rotates index between 0 and 1."""
    agent = GemmaWebDiscoveryAgent()
    assert agent.active_key_index == 0

    agent.rotate_key()
    assert agent.active_key_index == 1

    agent.rotate_key()
    assert agent.active_key_index == 0


def test_gemini_agent_key_rotation():
    """Verify that GeminiWebDiscoveryAgent rotates index between 0 and 1 (backwards compatibility)."""
    agent = GeminiWebDiscoveryAgent()
    assert agent.active_key_index == 0

    agent.rotate_key()
    assert agent.active_key_index == 1

    agent.rotate_key()
    assert agent.active_key_index == 0


@pytest.mark.asyncio
async def test_gemma_agent_discovery_mock():
    """Verify GemmaWebDiscoveryAgent returns structured DiscoveryResult items with Gemma 4 model."""
    agent = GemmaWebDiscoveryAgent()
    assert "gemma" in agent.model.lower()

    with patch("httpx.AsyncClient.post", side_effect=Exception("Simulated connection error")):
        artifact, exec_res = await agent.discover_urls("Federal Reserve quantitative tightening", max_results=2)

        assert isinstance(artifact, GemmaDiscoveryArtifact)
        assert len(artifact.results) >= 1
        assert artifact.results[0].url.startswith("http")
        assert exec_res.valid_payloads_count >= 1


@pytest.mark.asyncio
async def test_gemini_agent_discovery_mock():
    """Verify GeminiWebDiscoveryAgent returns structured DiscoveryResult items (backwards compatibility)."""
    agent = GeminiWebDiscoveryAgent()

    # When network calls fail or in test mode, discover_urls produces representative results
    with patch("httpx.AsyncClient.post", side_effect=Exception("Simulated connection error")):
        artifact, exec_res = await agent.discover_urls("Federal Reserve quantitative tightening", max_results=2)

        assert isinstance(artifact, GeminiDiscoveryArtifact)
        assert len(artifact.results) >= 1
        assert artifact.results[0].url.startswith("http")
        assert exec_res.valid_payloads_count >= 1


@pytest.mark.asyncio
async def test_firecrawl_scraper_mock():
    """Verify Firecrawl scraper returns markdown and status."""
    scraper = FirecrawlScraper()

    with patch("httpx.AsyncClient.post", side_effect=Exception("Mocked 500")):
        content, metadata = await scraper.scrape_url("https://reuters.com/tech/chips")
        assert len(content) > 0
        assert "url" in metadata


@pytest.mark.asyncio
async def test_youtube_agent_openai_structured_analysis():
    """Verify YouTube agent multimodal factual extraction structure."""
    agent = YouTubeIngestionAgent()
    payloads, exec_res = await agent.ingest_source("video_test_id")

    assert len(payloads) == 1
    p = payloads[0]
    assert p.origin_platform == "youtube"
    assert p.multimodal is not None
    assert p.multimodal.captions is not None
    assert len(p.multimodal.keyframe_embeddings) == 4



@pytest.mark.asyncio
async def test_pipeline_investigate_topic_end_to_end():
    """Verify complete end-to-end investigate_topic orchestration flow."""
    pipeline = SAVIPipelineOrchestrator()
    await pipeline.start()

    res = await pipeline.investigate_topic(
        query="Semiconductor lithography export controls and global market impact",
        platforms=["web", "reddit", "twitter", "youtube"],
        max_results=2,
    )

    assert "decision" in res
    assert "discovery" in res
    assert res["ingested_count"] >= 1
    assert "pipeline_results" in res

    first_item = res["pipeline_results"][0]
    assert "savi_metrics" in first_item
    assert "sentiment_score" in first_item["savi_metrics"]
    assert "accuracy_rating" in first_item["savi_metrics"]
    assert "validation_index" in first_item["savi_metrics"]
    assert "impact_ranking" in first_item["savi_metrics"]

    await pipeline.stop()
