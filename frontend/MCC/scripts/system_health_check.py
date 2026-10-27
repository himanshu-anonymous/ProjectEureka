"""
SAVI Platform: Comprehensive System Health Checkup CLI.
Executes deep diagnostic inspection across all layers:
1. PostgreSQL 16 CQRS Query Store & Materialized View latency
2. Neo4j 5.x Graph Database Bolt Cluster & Topology engine
3. Open-Jev System 1 Decision Head (Choice, Noul, Score primitives)
4. Isolation Rainforest Oblique Hyperplane Anomaly Detector
5. PPO Reinforcement Learning Rate-Limiting Policy Controller
6. Quad-Model Harvester API Key Readiness & Dual-Gemini Rotation Mesh
7. Host Runtime, Process RSS Memory, and System Resource Telemetry

Usage:
    uv run python scripts/system_health_check.py
    uv run python scripts/system_health_check.py --json
    uv run python scripts/system_health_check.py --strict
"""

from __future__ import annotations
import sys
import json
import argparse
from typing import Dict, Any

from savi.diagnostics import SystemHealthChecker, SystemHealthReport


# ANSI styling helpers (safe for Windows terminals)
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


def format_status_badge(status: str) -> str:
    if status == "HEALTHY":
        return f"{GREEN}[PASS]{RESET}"
    elif status == "DEGRADED":
        return f"{YELLOW}[WARN]{RESET}"
    else:
        return f"{RED}[FAIL]{RESET}"


def print_cli_report(report: SystemHealthReport):
    print("\n" + "=" * 78)
    print(f" {BOLD}{CYAN}SAVI PLATFORM: SYSTEM HEALTH & DIAGNOSTIC AUDIT{RESET} ")
    print("=" * 78)

    # Overview
    overall_color = GREEN if report.overall_status == "HEALTHY" else (YELLOW if report.overall_status == "DEGRADED" else RED)
    print(f" Overall Status:   {overall_color}{BOLD}{report.overall_status}{RESET}")
    print(f" Platform Host:    {report.platform}")
    print(f" Python Runtime:   {report.python_version}")
    print(f" Host Uptime:      {report.uptime_seconds:.1f} seconds")
    print(f" Audit Timestamp:  {report.timestamp}")
    print("-" * 78)

    # Detailed Subsystems
    print(f" {BOLD}{'COMPONENT':<34} {'STATUS':<10} {'LATENCY':<12} {'DETAILS'}{RESET}")
    print("-" * 78)

    for key, comp in report.components.items():
        badge = format_status_badge(comp.status)
        lat_str = f"{comp.latency_ms:.2f} ms" if comp.latency_ms is not None else "N/A"
        print(f" {comp.name:<33} {badge:<19} {lat_str:<12} {comp.message}")

        # Print indented extra details if present
        if comp.details:
            detail_items = []
            for k, v in comp.details.items():
                if k not in ("error", "indices"):
                    detail_items.append(f"{k}: {v}")
            if detail_items:
                details_line = ", ".join(detail_items[:4])
                print(f"   {CYAN}--> {details_line}{RESET}")

    print("=" * 78)
    summary = report.summary
    total = summary.get("total_components", len(report.components))
    healthy = summary.get("healthy_components", 0)
    degraded = summary.get("degraded_components", 0)
    unhealthy = summary.get("unhealthy_components", 0)

    summary_line = (
        f" Summary: {GREEN}{healthy}/{total} Healthy{RESET} | "
        f"{YELLOW}{degraded} Degraded{RESET} | "
        f"{RED}{unhealthy} Unhealthy{RESET}"
    )
    print(summary_line)
    print("=" * 78 + "\n")


def main():
    parser = argparse.ArgumentParser(description="SAVI System Health Checkup CLI")
    parser.add_argument("--json", action="store_true", help="Output health report as raw JSON")
    parser.add_argument("--strict", action="store_true", help="Exit with code 1 if any component is DEGRADED or UNHEALTHY")
    args = parser.parse_args()

    checker = SystemHealthChecker()
    report = checker.generate_report()

    if args.json:
        print(report.model_dump_json(indent=2))
    else:
        print_cli_report(report)

    if args.strict:
        if report.overall_status in ("DEGRADED", "UNHEALTHY"):
            sys.exit(1)
    else:
        if report.overall_status == "UNHEALTHY":
            sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
