#!/usr/bin/env python3
"""Cloudflare Named Tunnel Launcher for Project EUREKA / SAVI Backend.

This script manages the persistent, encrypted Cloudflare Tunnel connection
between the local/VPS FastAPI application (port 8000) and the Cloudflare Edge.

Usage:
  python scripts/run_cloudflare_tunnel.py [--token <TUNNEL_TOKEN>] [--port <PORT>]

Environment Variables (.env):
  CLOUDFLARE_TUNNEL_TOKEN: The Zero Trust token from the Cloudflare Dashboard.
  PORT / FASTAPI_PORT: Target backend port (default: 8000).
"""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import sys
from pathlib import Path


def is_port_open(host: str, port: int, timeout: float = 1.5) -> bool:
    """Check if the local backend port is actively listening."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        return s.connect_ex((host, port)) == 0


def load_env_token() -> str | None:
    """Read CLOUDFLARE_TUNNEL_TOKEN from .env or backend/.env."""
    candidates = [Path(".env"), Path("backend/.env"), Path(".env.local")]
    for candidate in candidates:
        if candidate.exists():
            with open(candidate, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("CLOUDFLARE_TUNNEL_TOKEN="):
                        val = line.split("=", 1)[1].strip().strip('"').strip("'")
                        if val:
                            return val
    return os.getenv("CLOUDFLARE_TUNNEL_TOKEN")


def resolve_cloudflared_command() -> list[str]:
    """Find local cloudflared binary or fall back to npx cloudflared."""
    if shutil.which("cloudflared"):
        return ["cloudflared"]
    if shutil.which("npx"):
        return ["npx", "cloudflared"]
    raise RuntimeError(
        "Neither 'cloudflared' nor 'npx' was found on PATH. "
        "Please install Node.js (for npx) or download cloudflared from https://github.com/cloudflare/cloudflared/releases"
    )


def main():
    parser = argparse.ArgumentParser(description="Launch Persistent Cloudflare Tunnel for EUREKA")
    parser.add_argument("--token", help="Cloudflare Zero Trust Tunnel Token")
    parser.add_argument("--port", type=int, default=8000, help="Local FastAPI port (default: 8000)")
    parser.add_argument("--host", default="127.0.0.1", help="Local host address (default: 127.0.0.1)")
    parser.add_argument("--quick", action="store_true", help="Force ephemeral quick tunnel for testing")
    args = parser.parse_args()

    token = args.token or load_env_token()
    cmd_prefix = resolve_cloudflared_command()

    print("=" * 70)
    print("Project EUREKA — Cloudflare Tunnel Ingress Manager")
    print("=" * 70)

    # 1. Pre-flight check on local backend
    backend_ready = is_port_open(args.host, args.port)
    if backend_ready:
        print(f"[OK] Local backend detected at http://{args.host}:{args.port}")
    else:
        print(f"[WARNING] Local backend at http://{args.host}:{args.port} is NOT currently listening.")
        print("          Start FastAPI via: uv run uvicorn eureka.api.main:app --port 8000 --host 127.0.0.1")
        print("          The tunnel will start and forward once the backend boots.\n")

    # 2. Launch mode determination
    if token and not args.quick:
        print(f"[MODE] Running Persistent Named Tunnel with token authentication...")
        print(f"[TARGET] Forwarding ingress to http://{args.host}:{args.port}")
        print("=" * 70)
        run_cmd = cmd_prefix + ["tunnel", "--no-autoupdate", "run", "--token", token]
    else:
        if not args.quick:
            print("[INFO] No CLOUDFLARE_TUNNEL_TOKEN provided.")
            print("       To make your tunnel permanent (never expires):")
            print("       1. Create a tunnel in Cloudflare Zero Trust -> Networks -> Tunnels")
            print("       2. Add CLOUDFLARE_TUNNEL_TOKEN=<token> to your .env")
            print("       Falling back to an ephemeral Quick Tunnel (trycloudflare.com)...\n")
        print(f"[MODE] Running Ephemeral Quick Tunnel to http://{args.host}:{args.port}...")
        print("=" * 70)
        run_cmd = cmd_prefix + [
            "tunnel",
            "--edge-ip-version", "4",
            "--protocol", "http2",
            "--url", f"http://{args.host}:{args.port}",
        ]

    try:
        subprocess.run(run_cmd, check=True)
    except KeyboardInterrupt:
        print("\n[STOPPED] Cloudflare tunnel process terminated by user.")
        sys.exit(0)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Cloudflare tunnel exited with error code {e.returncode}")
        sys.exit(e.returncode)


if __name__ == "__main__":
    main()
