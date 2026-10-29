"""
Phase 2 Decision Orchestrator (Open-Jev System 1 decision head).
Coordinates multi-agent scheduling, tool selection (search vs scrape vs API),
fallback tiers, and PPO feedback hints according to Zefan-Cai/Open-Jev specification
and SAVI Agent Context Spec Section 2.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from savi.config import settings
from savi.open_jev.client import OpenJevClient
from savi.open_jev.schema import ChoiceQuestion, NoulQuestion, ScoreQuestion


class OrchestratorDecisionInput(BaseModel):
    user_intent: str
    platforms_requested: List[str] = Field(default_factory=lambda: ["web", "reddit", "twitter", "youtube"])
    mdp_state_summary: Dict[str, Any] = Field(default_factory=dict)
    last_execution_results: Dict[str, Any] = Field(default_factory=dict)
    candidate_urls_from_gemma: List[str] = Field(default_factory=list)
    candidate_urls_from_gemini: List[str] = Field(default_factory=list)
    temporal_window_minutes: float = 15.0
    active_gemma_key_index: int = 0
    active_gemini_key_index: int = 0
    notes: Optional[str] = None


class OrchestratorDecisionOutput(BaseModel):
    next_agent: str  # web_search_gemma | web_search_gemini | web_scrape_firecrawl | reddit | twitter | youtube | none
    action: str      # search | scrape | api | backoff | rotate_key | rotate_proxy | switch_parser
    target: str      # query string, URL, subreddit, video_id, or status URL
    parser_mode: str # api | firecrawl | headless | apify
    priority: int = 1
    parallel_agents: List[str] = Field(default_factory=list)
    macro_cascade_hint: bool = False
    ppo_action_hint: Optional[str] = None  # INCREASE_DELAY | SWITCH_PARSER | SOFT_BACKOFF | ROTATE_KEY | null
    fallback_tier: int = 1
    reasoning: str
    open_jev_probabilities: Optional[Dict[str, Any]] = None
    risk_score: Optional[float] = None


class DecisionOrchestrator:
    """
    Open-Jev Decision Engine:
    Evaluates current state, rate limit triggers, candidate URLs, and platform needs
    using Open-Jev typed primitives (Choice, Noul, Score) to issue optimal operational decisions.
    """
    def __init__(self, model_id: Optional[str] = None):
        self.model_id = model_id or settings.credentials.open_jev_model_id
        self.open_jev_client = OpenJevClient(model_id=self.model_id)

    def plan_next_step(self, plan_input: OrchestratorDecisionInput) -> OrchestratorDecisionOutput:
        """
        Determines next agent, execution tier, and PPO action hint
        using Open-Jev System 1 primitives and §2 decision rubric.
        """
        last_results = plan_input.last_execution_results
        key_idx = plan_input.active_gemma_key_index if plan_input.active_gemma_key_index != 0 else plan_input.active_gemini_key_index
        candidate_urls = plan_input.candidate_urls_from_gemma or plan_input.candidate_urls_from_gemini

        hit_429 = any(res.get("hit_429_rate_limit", False) for res in last_results.values())
        hit_captcha = any(res.get("hit_captcha_challenge", False) for res in last_results.values())

        # Construct serialized context state for Open-Jev evaluation
        state_str = (
            f"Intent: {plan_input.user_intent}. "
            f"Platforms: {','.join(plan_input.platforms_requested)}. "
            f"Active Gemma Key: {key_idx}. "
            f"Candidate URLs: {len(candidate_urls)}. "
            f"Rate Limit 429: {hit_429}. "
            f"Captcha Wall: {hit_captcha}."
        )

        # Open-Jev System 1 query with Choice, Noul, and Score primitives
        jev_response = self.open_jev_client.ask(
            state=state_str,
            questions={
                "rate_limit_noul": {
                    "type": "noul",
                    "instructions": "Did the ingestion mesh experience HTTP 429 or quota exhaustion?",
                },
                "captcha_noul": {
                    "type": "noul",
                    "instructions": "Was a bot wall, cloudflare challenge, or captcha encountered?",
                },
                "action_choice": {
                    "type": "choice",
                    "options": ["search", "scrape", "api", "backoff", "rotate_key", "switch_parser"],
                    "instructions": "Select operational action for next scraping cycle",
                },
                "risk_score": {
                    "type": "score",
                    "instructions": "Evaluate ingestion throttling risk and latency penalty",
                    "levels": [1, 2, 3, 4, 5],
                },
            },
        )

        risk_level = 1.0
        if "risk_score" in jev_response.decisions:
            risk_level = float(jev_response.decisions["risk_score"].score)

        probs_summary = {
            k: v.probabilities for k, v in jev_response.decisions.items() if hasattr(v, "probabilities")
        }

        # Rule 1: Handle rate limits with PPO Key Rotation or Soft Backoff
        if hit_429:
            if key_idx == 0:
                return OrchestratorDecisionOutput(
                    next_agent="web_search_gemma",
                    action="rotate_key",
                    target=plan_input.user_intent,
                    parser_mode="api",
                    priority=1,
                    ppo_action_hint="ROTATE_KEY",
                    fallback_tier=2,
                    reasoning="HTTP 429 / quota detected on primary Gemma key. Rotating to secondary GEMMA_API_KEY_2 (Tier 2).",
                    open_jev_probabilities=probs_summary,
                    risk_score=risk_level,
                )
            else:
                return OrchestratorDecisionOutput(
                    next_agent="web_scrape_firecrawl",
                    action="backoff",
                    target=plan_input.user_intent,
                    parser_mode="firecrawl",
                    priority=1,
                    ppo_action_hint="SOFT_BACKOFF",
                    fallback_tier=3,
                    reasoning="Multiple rate limits encountered across primary and secondary keys. Triggering soft backoff.",
                    open_jev_probabilities=probs_summary,
                    risk_score=risk_level,
                )

        # Rule 2: Handle Captchas by switching parser strategy
        if hit_captcha:
            return OrchestratorDecisionOutput(
                next_agent="web_scrape_firecrawl",
                action="switch_parser",
                target=candidate_urls[0] if candidate_urls else plan_input.user_intent,
                parser_mode="firecrawl",
                priority=1,
                ppo_action_hint="SWITCH_PARSER",
                fallback_tier=2,
                reasoning="Captcha / bot wall encountered on native DOM parser. Switching parser mode to Firecrawl.",
                open_jev_probabilities=probs_summary,
                risk_score=risk_level,
            )

        # Rule 3: Web Discovery -> Scrape Handover
        if candidate_urls:
            target_url = candidate_urls[0]
            parallel = [p for p in plan_input.platforms_requested if p in ["reddit", "twitter", "youtube"]]
            return OrchestratorDecisionOutput(
                next_agent="web_scrape_firecrawl",
                action="scrape",
                target=target_url,
                parser_mode="firecrawl",
                priority=1,
                parallel_agents=parallel,
                macro_cascade_hint=len(parallel) > 1,
                ppo_action_hint=None,
                fallback_tier=1,
                reasoning=f"Discovered candidate URLs from Gemma. Dispatching Firecrawl to extract sanitized article from {target_url}.",
                open_jev_probabilities=probs_summary,
                risk_score=risk_level,
            )

        # Rule 4: Initial Step -> Initiate Gemma Search Discovery
        if "web" in plan_input.platforms_requested:
            parallel = [p for p in plan_input.platforms_requested if p != "web"]
            return OrchestratorDecisionOutput(
                next_agent="web_search_gemma",
                action="search",
                target=plan_input.user_intent,
                parser_mode="api",
                priority=1,
                parallel_agents=parallel,
                macro_cascade_hint=True,
                ppo_action_hint=None,
                fallback_tier=1,
                reasoning="Initial query step: executing Gemma discovery with Google Search grounding to identify authoritative URLs.",
                open_jev_probabilities=probs_summary,
                risk_score=risk_level,
            )

        # Default fallback
        first_plat = plan_input.platforms_requested[0] if plan_input.platforms_requested else "none"
        return OrchestratorDecisionOutput(
            next_agent=first_plat,
            action="api",
            target=plan_input.user_intent,
            parser_mode="api",
            priority=1,
            parallel_agents=[],
            macro_cascade_hint=False,
            ppo_action_hint=None,
            fallback_tier=1,
            reasoning=f"Routing directly to primary platform {first_plat}.",
            open_jev_probabilities=probs_summary,
            risk_score=risk_level,
        )
