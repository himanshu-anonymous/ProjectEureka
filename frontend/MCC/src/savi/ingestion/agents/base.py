"""
Base class for SAVI Ingestion Agents with adaptive throttling and feedback callbacks.
"""

from __future__ import annotations
import abc
import asyncio
import time
from typing import Optional, List, Dict, Any
from savi.ingestion.schema import ScrapedPayload
from savi.ingestion.mdp_env import ScraperExecutionResult, ScraperAction


class BaseIngestionAgent(abc.ABC):
    def __init__(self, platform_name: str):
        self.platform_name = platform_name
        self.inter_request_delay_ms: float = 1000.0
        self.active_proxy_subnet: str = "default_pool"
        self.active_api_key_idx: int = 0
        self.parser_mode: str = "api"
        self.is_paused: bool = False

    def update_control_parameters(
        self,
        delay_ms: Optional[float] = None,
        proxy_subnet: Optional[str] = None,
        key_idx: Optional[int] = None,
        parser_mode: Optional[str] = None,
    ) -> None:
        if delay_ms is not None:
            self.inter_request_delay_ms = delay_ms
        if proxy_subnet is not None:
            self.active_proxy_subnet = proxy_subnet
        if key_idx is not None:
            self.active_api_key_idx = key_idx
        if parser_mode is not None:
            self.parser_mode = parser_mode

    async def throttle(self) -> None:
        """Enforces adaptive inter-request delay."""
        delay_sec = self.inter_request_delay_ms / 1000.0
        if delay_sec > 0:
            await asyncio.sleep(delay_sec)

    @abc.abstractmethod
    async def ingest_source(self, target: str) -> Tuple[List[ScrapedPayload], ScraperExecutionResult]:
        """Harvests data from platform target and returns payload batch + execution health metrics."""
        pass
