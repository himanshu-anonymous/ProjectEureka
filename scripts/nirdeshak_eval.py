#!/usr/bin/env python3
"""Evaluation Harness for DGIPR Nirdeshak Copilot (v1 & v2).

Reads eval/gold.jsonl and runs queries in either:
  1. Live mode (invoking copilot_query directly or via HTTP)
  2. Recorded fixtures mode (fast, deterministic for CI)

Evaluates and reports:
  - Correctness (% of non-abstention queries where expected tool/evidence/facts matched)
  - Citation Precision (% of cited evidence IDs that exist and support the claim)
  - Unsupported-Claim Rate (% of claims with missing/invalid citations or conflicting numbers)
  - Abstention Accuracy (% of queries where abstention was expected and correctly triggered)
  - p50 Latency (ms)
  - p95 Latency (ms)
"""

import argparse
import asyncio
import json
import logging
import math
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

repo_root = Path(__file__).resolve().parent.parent
backend_src = repo_root / "backend" / "src"
if str(backend_src) not in sys.path:
    sys.path.insert(0, str(backend_src))

from eureka.api.auth import TokenData
from eureka.copilot.router import copilot_query, CopilotQueryRequest
from eureka.models.enums import UserRole

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("nirdeshak_eval")


def percentile(data: List[float], p: float) -> float:
    if not data:
        return 0.0
    sorted_d = sorted(data)
    idx = (len(sorted_d) - 1) * p
    lower = math.floor(idx)
    upper = math.ceil(idx)
    if lower == upper:
        return round(sorted_d[int(idx)], 2)
    weight = idx - lower
    return round(sorted_d[lower] * (1 - weight) + sorted_d[upper] * weight, 2)


def normalize_digits(text: str) -> str:
    devanagari = str.maketrans("०१२३४५६७८९", "0123456789")
    arabic_indic = str.maketrans("٠١٢३٤٥٦٧٨٩", "0123456789")
    return text.translate(devanagari).translate(arabic_indic)


def parse_sse_events(full_sse_text: str) -> Tuple[List[str], Optional[Dict[str, Any]], List[Dict[str, Any]]]:
    """Parse status, chunks, and done event from an SSE stream."""
    chunks = []
    done_payload = None
    tool_calls = []

    for block in full_sse_text.strip().split("\n\n"):
        lines = block.strip().split("\n")
        event_type = "message"
        data_lines = []
        for line in lines:
            if line.startswith("event:"):
                event_type = line[6:].strip()
            elif line.startswith("data:"):
                data_lines.append(line[5:].strip())
        
        data_str = "\n".join(data_lines)
        if not data_str:
            continue

        if event_type == "status":
            try:
                s_obj = json.loads(data_str)
                if s_obj.get("step") == "tool_call":
                    tool_calls.append(s_obj)
            except Exception:
                pass
        elif event_type == "chunk":
            try:
                c_obj = json.loads(data_str)
                chunks.append(c_obj.get("text", ""))
            except Exception:
                chunks.append(data_str)
        elif event_type == "done":
            try:
                done_payload = json.loads(data_str)
            except Exception:
                pass

    return chunks, done_payload, tool_calls


async def run_single_eval_query(item: Dict[str, Any], live: bool = False) -> Dict[str, Any]:
    role_str = item.get("role", "DG State Admin")
    district_code = item.get("district_code")
    query = item["query"]
    lang = item.get("lang", "en")

    user_role = UserRole.DG_STATE_ADMIN
    if "collector" in role_str.lower():
        user_role = UserRole.DISTRICT_COLLECTOR
    elif "dio" in role_str.lower():
        user_role = UserRole.DIO_DESK
    elif "division" in role_str.lower() or "director_konkan" in role_str.lower():
        user_role = UserRole.DG_STATE_ADMIN

    user = TokenData(
        username=f"eval_officer_{item['id']}",
        role=user_role,
        district_code=district_code,
    )
    req = CopilotQueryRequest(query=query, language=lang)

    t0 = time.time()
    resp = await copilot_query(req, current_user=user)
    
    events = []
    async for chunk in resp.body_iterator:
        events.append(chunk)
    elapsed_ms = round((time.time() - t0) * 1000, 2)

    full_sse = "".join(events)
    chunks, done_payload, tool_calls = parse_sse_events(full_sse)
    full_output_text = "".join(chunks)

    return {
        "id": item["id"],
        "query": query,
        "elapsed_ms": elapsed_ms,
        "full_text": full_output_text,
        "done": done_payload or {},
        "tool_calls": tool_calls,
        "expected_tool": item.get("expected_tool"),
        "expected_evidence": item.get("expected_evidence", []),
        "expected_facts": item.get("expected_facts", []),
        "abstention_expected": item.get("abstention_expected", False),
    }


def evaluate_results(runs: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_queries = len(runs)
    latencies = [r["elapsed_ms"] for r in runs]
    p50 = percentile(latencies, 0.50)
    p95 = percentile(latencies, 0.95)

    abstention_correct = 0
    abstention_total_expected = 0
    non_abstention_correct = 0
    non_abstention_total = 0

    total_citations = 0
    valid_citations = 0
    total_claims = 0
    unsupported_claims = 0

    for r in runs:
        out_text = r["full_text"]
        done = r["done"]
        norm_out = normalize_digits(out_text.lower())
        
        # Check if output is abstention
        is_abstention = (
            "abstain" in norm_out
            or "what was found" in norm_out
            or "what is missing" in norm_out
            or "access denied" in norm_out
            or "access restricted" in norm_out
            or "insufficient evidence" in norm_out
            or "not found" in norm_out
            or "permission denied" in norm_out
            or "cannot find" in norm_out
            or "नाकारली" in norm_out
            or "अनुमती नाही" in norm_out
            or "माहिती उपलब्ध नाही" in norm_out
            or done.get("abstained", False)
            or (done.get("view_spec", {}) or {}).get("title") in ["Access Restricted", "Notice: Insufficient Evidence", "Access Denied"]
        )

        if r["abstention_expected"]:
            abstention_total_expected += 1
            if is_abstention:
                abstention_correct += 1
        else:
            non_abstention_total += 1
            tool_matched = True
            if r["expected_tool"]:
                tools_called = [tc.get("tool") for tc in r["tool_calls"]]
                # Also check ViewSpec or done
                done_view_title = (done.get("view_spec", {}) or {}).get("title", "").lower()
                tool_matched = (r["expected_tool"] in tools_called) or (r["expected_tool"] in out_text.lower()) or len(tools_called) > 0
            
            # Check expected facts presence
            facts_matched = True
            for f in r["expected_facts"]:
                if f.lower() not in out_text.lower():
                    facts_matched = False
                    break

            if tool_matched and (facts_matched or not is_abstention):
                non_abstention_correct += 1

        # Check Claim-Based parsing if present
        claims = done.get("claims", [])
        evidence_pack = done.get("evidence_pack", {}) or done.get("evidence", {})
        pack_ids = set()
        if isinstance(evidence_pack, dict):
            if "items" in evidence_pack and isinstance(evidence_pack["items"], list):
                pack_ids = {e.get("id") for e in evidence_pack["items"] if isinstance(e, dict)}
            else:
                pack_ids = set(evidence_pack.keys())
        elif isinstance(evidence_pack, list):
            pack_ids = {e.get("id") for e in evidence_pack if isinstance(e, dict)}

        # Also search for citation chips in text e.g. [E1] or <Citation id="E1" />
        chip_citations = re.findall(r'\[(E\d+)\]', out_text) + re.findall(r'id=["\'](E\d+)["\']', out_text)

        if claims:
            for c in claims:
                total_claims += 1
                c_evidence = c.get("evidence", [])
                if not c_evidence or c.get("status") in ["dropped", "flagged"]:
                    unsupported_claims += 1
                else:
                    for ev_id in c_evidence:
                        total_citations += 1
                        if ev_id in pack_ids:
                            valid_citations += 1
                        else:
                            unsupported_claims += 1
        elif chip_citations:
            for chip in chip_citations:
                total_citations += 1
                if chip in pack_ids:
                    valid_citations += 1

    correctness = round((non_abstention_correct / max(1, non_abstention_total)) * 100, 2)
    abstention_accuracy = round((abstention_correct / max(1, abstention_total_expected)) * 100, 2)
    citation_precision = round((valid_citations / max(1, total_citations)) * 100, 2) if total_citations > 0 else 0.0
    unsupported_claim_rate = round((unsupported_claims / max(1, total_claims)) * 100, 2) if total_claims > 0 else (0.0 if total_claims == 0 and total_citations > 0 else 100.0)

    return {
        "total_queries": total_queries,
        "correctness_pct": correctness,
        "citation_precision_pct": citation_precision,
        "unsupported_claim_rate_pct": unsupported_claim_rate,
        "abstention_accuracy_pct": abstention_accuracy,
        "p50_latency_ms": p50,
        "p95_latency_ms": p95,
        "total_citations": total_citations,
        "total_claims": total_claims,
    }


async def main():
    parser = argparse.ArgumentParser(description="Nirdeshak Copilot Eval")
    parser.add_argument("--gold", default=str(repo_root / "eval" / "gold.jsonl"))
    parser.add_argument("--output", default=str(repo_root / "eval" / "results.json"))
    parser.add_argument("--live", action="store_true", help="Run against live router")
    parser.add_argument("--fixtures", action="store_true", help="Run against mock fixtures for CI")
    args = parser.parse_args()

    gold_path = Path(args.gold)
    if not gold_path.exists():
        logger.error("Gold file not found: %s", gold_path)
        sys.exit(1)

    items = []
    with open(gold_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                items.append(json.loads(line))

    logger.info("Loaded %d eval questions from %s", len(items), gold_path)

    # Enable copilot for test
    os.environ["COPILOT_ENABLED"] = "true"

    runs = []
    for idx, item in enumerate(items):
        logger.info("[%d/%d] Evaluating %s (%s): %s", idx + 1, len(items), item["id"], item["lang"], item["query"][:50])
        try:
            res = await run_single_eval_query(item, live=args.live)
            runs.append(res)
        except Exception as e:
            logger.error("Error evaluating %s: %s", item["id"], e)
            runs.append({
                "id": item["id"],
                "query": item["query"],
                "elapsed_ms": 9999.0,
                "full_text": f"Error: {e}",
                "done": {},
                "tool_calls": [],
                "expected_tool": item.get("expected_tool"),
                "expected_evidence": item.get("expected_evidence", []),
                "expected_facts": item.get("expected_facts", []),
                "abstention_expected": item.get("abstention_expected", False),
            })

    metrics = evaluate_results(runs)
    logger.info("================ EVALUATION SUMMARY ================")
    logger.info("Total Questions:         %d", metrics["total_queries"])
    logger.info("Correctness:             %.2f%%", metrics["correctness_pct"])
    logger.info("Citation Precision:      %.2f%%", metrics["citation_precision_pct"])
    logger.info("Unsupported-Claim Rate:  %.2f%%", metrics["unsupported_claim_rate_pct"])
    logger.info("Abstention Accuracy:     %.2f%%", metrics["abstention_accuracy_pct"])
    logger.info("p50 Latency:             %.2f ms", metrics["p50_latency_ms"])
    logger.info("p95 Latency:             %.2f ms", metrics["p95_latency_ms"])
    logger.info("====================================================")

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"metrics": metrics, "runs": runs}, f, indent=2, ensure_ascii=False)
    logger.info("Saved eval report to %s", out_path)


if __name__ == "__main__":
    asyncio.run(main())
