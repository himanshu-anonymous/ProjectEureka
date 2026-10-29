"""
Phase 2: Dynamic DAG Pipeline Controller.
Routes ingestion envelopes between Micro-Event (Parallel) and Macro-Cascade (Grouped)
pipelines prior to Isolation Rainforest filtering.
"""

from __future__ import annotations
import asyncio
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional, Tuple
from savi.config import PipelineConfig, settings
from savi.ingestion.schema import ScrapedPayload
from savi.anomaly.isolation_rainforest import IsolationRainforest
import numpy as np


@dataclass
class RoutedEnvelope:
    payload: ScrapedPayload
    route_type: str  # "MICRO_EVENT" or "MACRO_CASCADE"
    matched_entity_cluster: Optional[str] = None
    anomaly_verdict: Optional[Dict[str, Any]] = None
    routed_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class MacroCascadeTemporalBuffer:
    """
    Shared temporal buffer for coordinated spatio-temporal batching across platforms.
    Holds items with cross-platform entity matches within temporal window Delta t <= 15 min.
    """
    def __init__(self, window_seconds: float = 900.0):
        self.window_seconds = window_seconds
        self.buffer: List[ScrapedPayload] = []

    def add(self, payload: ScrapedPayload) -> None:
        self.buffer.append(payload)
        self.cleanup_expired()

    def cleanup_expired(self) -> None:
        cutoff = datetime.now(timezone.utc) - timedelta(seconds=self.window_seconds)
        self.buffer = [p for p in self.buffer if p.published_timestamp >= cutoff]

    def find_cross_platform_matches(self, payload: ScrapedPayload) -> List[ScrapedPayload]:
        """Detects overlapping entities or keywords across different platforms."""
        matches = []
        payload_tokens = set(payload.headline_or_title.lower().split())

        for buffered in self.buffer:
            if buffered.origin_platform != payload.origin_platform:
                buffered_tokens = set(buffered.headline_or_title.lower().split())
                overlap = payload_tokens.intersection(buffered_tokens)
                # Significant token overlap (> 2 non-stopword tokens) or shared citation
                has_citation_match = bool(set(payload.citations).intersection(set(buffered.citations)))
                if len(overlap) >= 2 or has_citation_match:
                    matches.append(buffered)

        return matches


class DynamicDAGRouter:
    """
    Evaluates each content payload x_i to dynamically dictate processing concurrency:
    - Micro-Event Route: Localized, single-platform, low propagation velocity.
    - Macro-Cascade Route: Cross-platform entity matching within Delta t <= 15 min.
    """
    def __init__(
        self,
        config: PipelineConfig = settings.pipeline,
        rainforest: Optional[IsolationRainforest] = None,
    ):
        self.config = config
        self.rainforest = rainforest or IsolationRainforest()
        self.temporal_buffer = MacroCascadeTemporalBuffer(window_seconds=config.macro_cascade_window_seconds)
        self.quarantine_queue: List[RoutedEnvelope] = []
        self.clean_dispatch_queue: List[RoutedEnvelope] = []

    def evaluate_route(self, payload: ScrapedPayload) -> str:
        """
        Determines whether the payload belongs to Micro-Event or Macro-Cascade.
        """
        velocity = payload.engagement.propagation_velocity
        matches = self.temporal_buffer.find_cross_platform_matches(payload)

        # Macro-Cascade condition: Cross-platform match within 15 min OR high velocity burst
        if len(matches) > 0 or velocity >= self.config.velocity_threshold:
            return "MACRO_CASCADE"
        return "MICRO_EVENT"

    async def process_payload(self, payload: ScrapedPayload) -> RoutedEnvelope:
        route_type = self.evaluate_route(payload)

        if route_type == "MACRO_CASCADE":
            # Add to shared temporal buffer for coordinated batching
            self.temporal_buffer.add(payload)
            envelope = RoutedEnvelope(payload=payload, route_type="MACRO_CASCADE")
        else:
            # Micro-Event: executes independent lightweight path
            envelope = RoutedEnvelope(payload=payload, route_type="MICRO_EVENT")

        # Pass envelope through Extended Isolation Forest (Isolation Rainforest)
        feature_vec = np.array(payload.to_feature_vector(), dtype=np.float32)
        score = self.rainforest.compute_anomaly_score(feature_vec)
        verdict_action, verdict_info = self.rainforest.route_decision(score)
        envelope.anomaly_verdict = verdict_info

        if verdict_action == "QUARANTINE":
            self.quarantine_queue.append(envelope)
        else:
            self.clean_dispatch_queue.append(envelope)

        return envelope
