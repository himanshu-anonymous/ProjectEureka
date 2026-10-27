"""
Tool Suite for NousResearch Hermes Agent integration.
Exposes SAVI Quad-Agent, Open-Jev verification, and analytical modules as callable Hermes tools.
"""

from __future__ import annotations
import time
from typing import Dict, Any, List, Optional, Callable, Awaitable
import numpy as np

from savi.hermes.schema import (
    HermesToolDefinition,
    HermesToolParameter,
    HermesToolCall,
    HermesToolResult,
    HermesSkill,
)
from savi.hermes.memory import HermesSessionMemory
from savi.ingestion.agents.web_discovery_gemma import GemmaWebDiscoveryAgent
from savi.ingestion.agents.web_agent import WebIngestionAgent
from savi.graph.triplet_extractor import OpenIEExtractor
from savi.open_jev.engine import LocalOpenJevEngine
from savi.open_jev.schema import ChoiceQuestion, NoulQuestion, ScoreQuestion
from savi.anomaly.isolation_rainforest import IsolationRainforest
from savi.metrics.savi_suite import SAVIEngine


class HermesToolRegistry:
    """
    Registers and executes SAVI platform tools for the Hermes Agent loop.
    Enables autonomous discovery, scraping, formal logic verification, and metric computation.
    """
    def __init__(self, memory: HermesSessionMemory):
        self.memory = memory
        self.web_discovery = GemmaWebDiscoveryAgent()
        self.web_agent = WebIngestionAgent()
        self.triplet_extractor = OpenIEExtractor()
        self.open_jev_engine = LocalOpenJevEngine()
        self.rainforest = IsolationRainforest()
        # Seed representative sample for anomaly detection
        rng = np.random.default_rng(42)
        dummy_data = rng.uniform(0.1, 1.0, (200, 6)).astype(np.float32)
        self.rainforest.fit(dummy_data)
        self.savi_engine = SAVIEngine()

        self._definitions: Dict[str, HermesToolDefinition] = {}
        self._handlers: Dict[str, Callable[[Dict[str, Any]], Awaitable[Any]]] = {}
        self._register_default_tools()

    def register_tool(
        self,
        definition: HermesToolDefinition,
        handler: Callable[[Dict[str, Any]], Awaitable[Any]],
    ) -> None:
        self._definitions[definition.name] = definition
        self._handlers[definition.name] = handler

    def get_definitions(self) -> List[HermesToolDefinition]:
        return list(self._definitions.values())

    async def execute_tool(self, call: HermesToolCall) -> HermesToolResult:
        """Executes a tool call and captures latency and status."""
        start_time = time.perf_counter()
        handler = self._handlers.get(call.tool_name)
        if not handler:
            return HermesToolResult(
                call_id=call.call_id,
                tool_name=call.tool_name,
                success=False,
                error=f"Tool '{call.tool_name}' not found in Hermes tool registry.",
                latency_ms=(time.perf_counter() - start_time) * 1000.0,
            )

        try:
            output = await handler(call.arguments)
            latency = (time.perf_counter() - start_time) * 1000.0
            return HermesToolResult(
                call_id=call.call_id,
                tool_name=call.tool_name,
                success=True,
                output=output,
                latency_ms=round(latency, 2),
            )
        except Exception as e:
            latency = (time.perf_counter() - start_time) * 1000.0
            return HermesToolResult(
                call_id=call.call_id,
                tool_name=call.tool_name,
                success=False,
                error=str(e),
                latency_ms=round(latency, 2),
            )

    def _register_default_tools(self) -> None:
        # Tool 1: search_web_gemma
        self.register_tool(
            HermesToolDefinition(
                name="search_web_gemma",
                description="Perform web search & discovery using Google Gemma 4 with search grounding to find authoritative URLs.",
                parameters=[
                    HermesToolParameter(name="query", type="string", description="The search query or investigative topic"),
                    HermesToolParameter(name="max_results", type="integer", description="Maximum number of links to retrieve", required=False, default=3),
                ],
            ),
            self._handle_search_web_gemma,
        )

        # Tool 2: scrape_article_firecrawl
        self.register_tool(
            HermesToolDefinition(
                name="scrape_article_firecrawl",
                description="Scrape and extract sanitized, markdown-formatted article text from a target URL via Firecrawl scraper.",
                parameters=[
                    HermesToolParameter(name="url", type="string", description="The article URL to scrape and sanitize"),
                ],
            ),
            self._handle_scrape_article_firecrawl,
        )

        # Tool 3: extract_knowledge_graph_triplets
        self.register_tool(
            HermesToolDefinition(
                name="extract_knowledge_graph_triplets",
                description="Extract Subject-Predicate-Object (SPO) factual triplets from narrative text for graph verification.",
                parameters=[
                    HermesToolParameter(name="text", type="string", description="The text passage to extract triplets from"),
                ],
            ),
            self._handle_extract_triplets,
        )

        # Tool 4: verify_claim_open_jev
        self.register_tool(
            HermesToolDefinition(
                name="verify_claim_open_jev",
                description="Evaluate claim veracity and deception using Open-Jev System 1 primitives (Choice, Noul, Score).",
                parameters=[
                    HermesToolParameter(name="claim", type="string", description="The specific factual claim or headline"),
                    HermesToolParameter(name="context", type="string", description="Contextual evidence or article excerpt", required=False, default=""),
                ],
            ),
            self._handle_verify_claim_open_jev,
        )

        # Tool 5: detect_bot_anomalies
        self.register_tool(
            HermesToolDefinition(
                name="detect_bot_anomalies",
                description="Detect inorganic manipulation or astroturfing using Isolation Rainforest on engagement & velocity vectors.",
                parameters=[
                    HermesToolParameter(name="features", type="array", description="6D array: [engagement, account_age, velocity, text_len, upvote_ratio, verified]"),
                ],
            ),
            self._handle_detect_bot_anomalies,
        )

        # Tool 6: calculate_savi_metrics
        self.register_tool(
            HermesToolDefinition(
                name="calculate_savi_metrics",
                description="Compute full SAVI metric suite: Sentiment dynamics, Factual accuracy, Validation index, and News impact.",
                parameters=[
                    HermesToolParameter(name="sentiment_val", type="number", description="Raw sentiment polarity [-1.0, 1.0]"),
                    HermesToolParameter(name="authority_val", type="number", description="Source institutional authority weight [0.0, 5.0]"),
                    HermesToolParameter(name="validation_score", type="number", description="Logic consistency score [0.0, 1.0]"),
                    HermesToolParameter(name="impact_reach", type="number", description="Cross-platform audience reach / virality metric"),
                ],
            ),
            self._handle_calculate_savi_metrics,
        )

        # Tool 7: recall_memory & store_memory
        self.register_tool(
            HermesToolDefinition(
                name="store_memory",
                description="Persist an important finding, verified assertion, or trust signal into Hermes session memory.",
                parameters=[
                    HermesToolParameter(name="key", type="string", description="Unique key for the finding"),
                    HermesToolParameter(name="value", type="string", description="The fact or insight to persist"),
                    HermesToolParameter(name="is_persistent", type="boolean", description="Whether to persist across future sessions", required=False, default=True),
                ],
            ),
            self._handle_store_memory,
        )
        self.register_tool(
            HermesToolDefinition(
                name="recall_memory",
                description="Recall previously stored knowledge or verified claim from Hermes memory.",
                parameters=[
                    HermesToolParameter(name="key", type="string", description="The key to retrieve"),
                ],
            ),
            self._handle_recall_memory,
        )

        # Tool 8: learn_skill
        self.register_tool(
            HermesToolDefinition(
                name="learn_skill",
                description="Self-improve by saving a reusable procedural investigative skill into Hermes skill repository.",
                parameters=[
                    HermesToolParameter(name="name", type="string", description="Short identifier for the learned skill"),
                    HermesToolParameter(name="instructions", type="string", description="Step-by-step instructions or rubric for this skill"),
                    HermesToolParameter(name="description", type="string", description="Summary of when and why to apply this skill", required=False, default=""),
                ],
            ),
            self._handle_learn_skill,
        )

    async def _handle_search_web_gemma(self, args: Dict[str, Any]) -> Dict[str, Any]:
        query = args.get("query", "")
        max_res = int(args.get("max_results", 3))
        artifact, exec_res = await self.web_discovery.discover_urls(query, max_results=max_res)
        results = [r.model_dump() for r in artifact.results]
        self.memory.store_working(f"search:{query}", results)
        return {
            "query": query,
            "results_count": len(results),
            "results": results,
            "latency_ms": round(artifact.search_latency_ms, 2),
            "model": self.web_discovery.model,
        }

    async def _handle_scrape_article_firecrawl(self, args: Dict[str, Any]) -> Dict[str, Any]:
        url = args.get("url", "")
        payloads, exec_res = await self.web_agent.ingest_source(url)
        if payloads:
            p = payloads[0]
            self.memory.store_working(f"scrape:{url}", p.sanitized_body)
            return {
                "url": url,
                "title": p.headline_or_title,
                "body_excerpt": p.sanitized_body[:1000],
                "char_count": len(p.sanitized_body),
                "author": p.author.username,
                "domain": p.author.domain,
                "latency_ms": round(exec_res.latency_ms, 2),
            }
        return {"url": url, "error": "No article content retrieved", "char_count": 0}

    async def _handle_extract_triplets(self, args: Dict[str, Any]) -> Dict[str, Any]:
        text = args.get("text", "")
        triplets = self.triplet_extractor.extract_triplets(text)
        formatted = [{"subject": s, "predicate": p, "object": o} for s, p, o in triplets]
        return {"triplets_count": len(formatted), "triplets": formatted}

    async def _handle_verify_claim_open_jev(self, args: Dict[str, Any]) -> Dict[str, Any]:
        claim = args.get("claim", "")
        context = args.get("context", "")
        state_str = f"Claim: {claim}\nContext: {context[:400]}"

        # 1. Choice: Credibility tier
        c_dec = self.open_jev_engine.evaluate_choice(
            state=state_str,
            question=ChoiceQuestion(
                options=["VERIFIED_CREDIBLE", "UNVERIFIED_DEVELOPING", "SENSATIONALIZED_MISINFORMATION"],
                instructions="Assess the credibility tier and editorial rigor of this claim.",
            ),
            temp=0.7,
        )

        # 2. Noul: Astroturfing or deception
        n_dec = self.open_jev_engine.evaluate_noul(
            state=state_str,
            question=NoulQuestion(instructions="Does this claim demonstrate manipulative falsehood or astroturfing?"),
            temp=0.7,
        )

        # 3. Score: Objective veracity rating (1 to 5)
        s_dec = self.open_jev_engine.evaluate_score(
            state=state_str,
            question=ScoreQuestion(instructions="Score evidentiary rigor and factual alignment (1 to 5).", levels=[1, 2, 3, 4, 5]),
            temp=0.7,
        )

        return {
            "verdict": c_dec.selected,
            "verdict_confidence": round(c_dec.confidence, 4),
            "deception_noul": {
                "detected": n_dec.selected,
                "is_positive": n_dec.is_positive,
                "probabilities": {k: round(v, 4) for k, v in n_dec.probabilities.items()},
            },
            "evidence_score": round(s_dec.score, 2),
            "model_id": self.open_jev_engine.model_id,
        }

    async def _handle_detect_bot_anomalies(self, args: Dict[str, Any]) -> Dict[str, Any]:
        features = args.get("features", [20.0, 0.8, 1.2, 0.5, 0.9, 1.0])
        feat_vec = np.array(features, dtype=np.float32)
        score = self.rainforest.compute_anomaly_score(feat_vec)
        action, decision_meta = self.rainforest.route_decision(float(score))
        return {
            "anomaly_score": round(float(score), 4),
            "verdict": action,
            "is_anomalous": action in ["FLAG_ELEVATED", "QUARANTINE"],
            "decision": decision_meta,
        }

    async def _handle_calculate_savi_metrics(self, args: Dict[str, Any]) -> Dict[str, Any]:
        s_val = float(args.get("sentiment_val", 0.1))
        a_val = float(args.get("authority_val", 2.0))
        v_val = float(args.get("validation_score", 0.85))
        i_val = float(args.get("impact_reach", 1500.0))

        metrics = self.savi_engine.evaluate(
            sentiment_trajectory=[(0.0, s_val), (1.0, s_val + 0.05)],
            current_time_t=1.0,
            mu_topo=0.88,
            p_entailment=v_val,
            authority_weights=[a_val, 1.5],
            kappa_contradictions=max(0.0, 1.0 - v_val),
            anomaly_score_s=0.35,
            platform_engagements={"web": i_val * 0.6, "social": i_val * 0.4},
            betweenness_centralities={"web": 0.5, "social": 0.5},
            transmission_velocity=1.5,
        )
        res_dict = metrics.to_dict()
        res_dict["composite_savi_score"] = round(
            (metrics.accuracy_rating * 0.4) + (metrics.validation_index * 0.4) + (min(1.0, metrics.impact_ranking / 3000.0) * 0.2),
            4,
        )
        res_dict["risk_tier"] = "LOW_RISK" if metrics.validation_index >= 0.70 else ("ELEVATED_RISK" if metrics.validation_index >= 0.50 else "HIGH_RISK")
        return res_dict

    async def _handle_store_memory(self, args: Dict[str, Any]) -> Dict[str, Any]:
        key = args.get("key", "")
        val = args.get("value", "")
        persistent = bool(args.get("is_persistent", True))
        if persistent:
            self.memory.store_fact(key, val)
        else:
            self.memory.store_working(key, val)
        return {"stored": True, "key": key, "persistent": persistent}

    async def _handle_recall_memory(self, args: Dict[str, Any]) -> Dict[str, Any]:
        key = args.get("key", "")
        fact = self.memory.recall_fact(key)
        working = self.memory.recall_working(key)
        found = fact if fact is not None else working
        return {"key": key, "found": found is not None, "value": found}

    async def _handle_learn_skill(self, args: Dict[str, Any]) -> Dict[str, Any]:
        name = args.get("name", "")
        instructions = args.get("instructions", "")
        desc = args.get("description", "") or f"Learned skill: {name}"
        skill = HermesSkill(name=name, description=desc, instructions=instructions)
        self.memory.register_skill(skill)
        return {"learned": True, "name": name, "total_skills": len(self.memory.skills_store)}
