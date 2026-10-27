"""
Backward compatibility proxy module for web_discovery_gemini.
Transitions to Google Gemma 4 (web_discovery_gemma.py).
"""

from __future__ import annotations
from savi.ingestion.agents.web_discovery_gemma import (
    DiscoveryResult,
    GemmaDiscoveryArtifact,
    GeminiDiscoveryArtifact,
    GemmaWebDiscoveryAgent,
    GeminiWebDiscoveryAgent,
)

__all__ = [
    "DiscoveryResult",
    "GemmaDiscoveryArtifact",
    "GeminiDiscoveryArtifact",
    "GemmaWebDiscoveryAgent",
    "GeminiWebDiscoveryAgent",
]
