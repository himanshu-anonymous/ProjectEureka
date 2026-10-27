"""
SAVI Platform: Full Autonomous End-to-End Multi-Model Simulation Runner.
Demonstrates the complete 5-phase segregated computational pipeline and the
quad-model decision & harvesting infrastructure with live API integration.
"""

import asyncio
import time
from datetime import datetime, timezone
from savi.api.main import SAVIPipelineOrchestrator
from savi.orchestration.decision_orchestrator import OrchestratorDecisionInput


async def main():
    print("=" * 85)
    print("   SAVI (Sentiment, Accuracy, Validation, Impact) Intelligence Platform  ")
    print("   Quad-Model Autonomous Harvesting, Structural Verification & Serving Mesh ")
    print("=" * 85)

    orchestrator = SAVIPipelineOrchestrator()
    await orchestrator.start()

    topic = "Global semiconductor supply chain and artificial intelligence hardware policy"

    print(f"\n[Phase 0] Topic Selected for Autonomous Investigation:")
    print(f"          '{topic}'")

    print("\n" + "-" * 85)
    print(" [Phase 1: Open-Jev Decision Orchestrator & Gemini Web Discovery]")
    print("-" * 85)

    # 1. Open-Jev Decision Head Planning
    t_plan = time.perf_counter()
    decision_input = OrchestratorDecisionInput(
        user_intent=topic,
        platforms_requested=["web", "reddit", "twitter", "youtube"],
        active_gemini_key_index=orchestrator.web_discovery_agent.active_key_index,
    )
    decision = orchestrator.decision_orchestrator.plan_next_step(decision_input)
    plan_ms = (time.perf_counter() - t_plan) * 1000.0

    print(f"[Open-Jev Decision Engine] Latency: {plan_ms:.2f} ms")
    print(f"  * Next Agent:     {decision.next_agent}")
    print(f"  * Action:         {decision.action}")
    print(f"  * Parser Mode:    {decision.parser_mode}")
    print(f"  * Fallback Tier:  Tier {decision.fallback_tier}")
    print(f"  * Parallel Mesh:  {', '.join(decision.parallel_agents)}")
    print(f"  * Reasoning:      {decision.reasoning}")

    # 2. Web Discovery via Gemini with Search Grounding
    print(f"\n[Agent 1: Gemini Web Discovery] Querying Gemini for authoritative URLs...")
    t_disc = time.perf_counter()
    disc_artifact, disc_exec = await orchestrator.web_discovery_agent.discover_urls(topic, max_results=3)
    disc_ms = (time.perf_counter() - t_disc) * 1000.0

    print(f"[Gemini Discovery] Latency: {disc_ms:.2f} ms | Authoritative URLs Found: {len(disc_artifact.results)}")
    for i, r in enumerate(disc_artifact.results, 1):
        print(f"  [{i}] [{r.trust_signal.upper()}] {r.title}")
        print(f"      URL: {r.url}")

    primary_web_url = disc_artifact.results[0].url if disc_artifact.results else "https://reuters.com/technology/semiconductors"

    print("\n" + "-" * 85)
    print(" [Phase 2: Quad-Agent Cross-Platform Harvesting under PPO Controller]")
    print("-" * 85)

    sources = [
        (orchestrator.web_agent, primary_web_url),
        (orchestrator.reddit_agent, "hardware"),
        (orchestrator.twitter_agent, "AISemiconductors"),
        (orchestrator.youtube_agent, "yt_semiconductor_deepdive"),
    ]

    for agent, target in sources:
        t0 = time.perf_counter()
        payloads, exec_res = await agent.ingest_source(target)
        harvest_ms = (time.perf_counter() - t0) * 1000.0

        print(f"\n---> Ingested from Agent [{agent.platform_name.upper()}]: (Latency: {harvest_ms:.2f} ms)")
        for p in payloads:
            print(f"     Title: {p.headline_or_title}")
            print(f"     Author: {p.author.username} (Age: {p.author.account_age_days:.0f}d, Verified: {p.author.is_verified})")
            print(f"     Engagement: {p.engagement.views} views, {p.engagement.shares} shares, velocity={p.engagement.propagation_velocity}/min")

            # PPO Controller decision step
            curr_state = orchestrator.mdp_env.state.to_normalized_vector()
            action, log_prob, val = orchestrator.ppo_controller.select_action(curr_state)
            next_state, reward, done, info = orchestrator.mdp_env.step(action, exec_res)
            orchestrator.ppo_controller.store_transition(curr_state, action, reward, val, log_prob, done)

            print(f"     [RL PPO Controller] Action: {info.get('action')} | Feedback Reward R_t: {reward:+.3f}")

            # End-to-End Pipeline Execution (Phases 2-4)
            res = await orchestrator.ingest_and_process(p)
            print(f"     [DAG Router] Route: {res['route_type']}")
            print(f"     [Isolation Rainforest] Verdict: {res['anomaly_verdict']['action']} (Score: {res['anomaly_verdict']['anomaly_score']:.4f})")
            print(f"     [Neo4j Staging] Triplets Extracted: {res['triplets_extracted']}")
            if res.get("open_jev"):
                print(f"     [Open JEV Logic Engine] Verdict: {res['open_jev']['verdict']} (Entailment: {res['open_jev']['probabilities']['entailment']:.3f})")
            print(f"     [SAVI Metric Matrix]:")
            m = res["savi_metrics"]
            print(f"       * S (Sentiment Dynamics): {m['sentiment_score']:+.4f}")
            print(f"       * A (Factual Accuracy):  {m['accuracy_rating']:.4f}")
            print(f"       * V (Logical Validation): {m['validation_index']:.4f}")
            print(f"       * I (News Impact Index):  {m['impact_ranking']:.4f}")
            print(f"     [Processing Latency]: {res['pipeline_latency_ms']:.2f} ms")

    # PPO Policy Update
    ppo_update = orchestrator.ppo_controller.update(orchestrator.mdp_env.state.to_normalized_vector())
    print(f"\n[PPO Optimization] Policy updated across batch trajectory. Policy Loss: {ppo_update['policy_loss']:.4f}, Value Loss: {ppo_update['value_loss']:.4f}")

    print("\n" + "=" * 85)
    print("  [Phase 5: CQRS Serving] PostgreSQL Materialized View Query (<10ms target)")
    print("=" * 85)

    t_query_start = time.perf_counter()
    top_intelligence = orchestrator.query_store.get_top_impact_intelligence(limit=10)
    query_latency_ms = (time.perf_counter() - t_query_start) * 1000.0

    print(f"\nRetrieved {len(top_intelligence)} top-impact intelligence items in {query_latency_ms:.3f} ms:")
    for idx, item in enumerate(top_intelligence, 1):
        print(f"  [{idx}] {item['primary_headline']}")
        print(f"      Platform: {item['origin_platform']} | Impact Rank: {item['impact_ranking']:.2f} | Accuracy: {item['accuracy_rating']:.2f} | Factual Verdict: {item['factual_verdict']}")
        print(f"      Reasoning: {item['reasoning_nodes'][0] if item.get('reasoning_nodes') else 'None'}")

    await orchestrator.stop()
    print("\n" + "=" * 85)
    print("Simulation complete. All Quad-Model Agents, Open-Jev, PPO, and Databases operational.")
    print("=" * 85)


if __name__ == "__main__":
    asyncio.run(main())
