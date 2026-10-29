"""
Open-Jev Client conforming to Zefan-Cai/Open-Jev `jev.client.Client`.
Provides typed probabilistic decision-making over context state using
Choice, Noul, and Score primitives with automatic fallback to local engine.
"""

from __future__ import annotations
import time
from typing import Dict, Any, Optional, List, Union
import httpx
from savi.config import settings
from savi.open_jev.schema import (
    OpenJevRequest,
    OpenJevResponse,
    ChoiceQuestion,
    NoulQuestion,
    ScoreQuestion,
    ChoiceDecision,
    NoulDecision,
    ScoreDecision,
)
from savi.open_jev.engine import LocalOpenJevEngine


class OpenJevClient:
    """
    Python client for Zefan-Cai/Open-Jev System 1 models.
    Supports local/remote Open-Jev servers with in-process fallback.
    """
    def __init__(
        self,
        server_url: Optional[str] = None,
        model_id: Optional[str] = None,
        temperature: Optional[float] = None,
    ):
        self.server_url = server_url or settings.credentials.open_jev_server_url
        self.model_id = model_id or settings.credentials.open_jev_model_id
        self.temperature = temperature if temperature is not None else settings.credentials.open_jev_temperature
        self.local_engine = LocalOpenJevEngine(
            model_id=self.model_id,
            default_temperature=self.temperature,
        )
        self._server_checked = False
        self._server_alive = False

    def _check_server_liveness(self) -> bool:
        if not self._server_checked and self.server_url:
            try:
                with httpx.Client(timeout=httpx.Timeout(0.15, connect=0.08)) as client:
                    r = client.get(f"{self.server_url.rstrip('/')}/v1/health")
                    self._server_alive = (r.status_code == 200)
            except Exception:
                self._server_alive = False
            self._server_checked = True
        return self._server_alive

    async def _check_server_liveness_async(self) -> bool:
        if not self._server_checked and self.server_url:
            try:
                async with httpx.AsyncClient(timeout=httpx.Timeout(0.15, connect=0.08)) as client:
                    r = await client.get(f"{self.server_url.rstrip('/')}/v1/health")
                    self._server_alive = (r.status_code == 200)
            except Exception:
                self._server_alive = False
            self._server_checked = True
        return self._server_alive

    def ask(
        self,
        state: str,
        questions: Dict[str, Any],
        temperature: Optional[float] = None,
        timeout: float = 2.0,
    ) -> OpenJevResponse:
        """
        Synchronously asks Open-Jev to evaluate typed questions over state.
        Attempts HTTP call to Open-Jev server; falls back to in-process engine.
        """
        req = OpenJevRequest(
            state=state,
            questions=questions,
            temperature=temperature or self.temperature,
        )

        # Attempt HTTP call to Open-Jev server if active
        if self._check_server_liveness():
            t0 = time.perf_counter()
            try:
                with httpx.Client(timeout=httpx.Timeout(timeout, connect=0.1)) as client:
                    resp = client.post(
                        f"{self.server_url.rstrip('/')}/v1/systemone",
                        json=req.model_dump(),
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        data["server_mode"] = "http_server"
                        data["latency_ms"] = round((time.perf_counter() - t0) * 1000.0, 3)
                        return OpenJevResponse(**data)
            except Exception:
                self._server_alive = False

        # In-process System 1 execution fallback (<1ms)
        return self.local_engine.process_request(req)

    async def ask_async(
        self,
        state: str,
        questions: Dict[str, Any],
        temperature: Optional[float] = None,
        timeout: float = 2.0,
    ) -> OpenJevResponse:
        """
        Asynchronously asks Open-Jev to evaluate typed questions over state.
        """
        req = OpenJevRequest(
            state=state,
            questions=questions,
            temperature=temperature or self.temperature,
        )

        if await self._check_server_liveness_async():
            t0 = time.perf_counter()
            try:
                async with httpx.AsyncClient(timeout=httpx.Timeout(timeout, connect=0.1)) as client:
                    resp = await client.post(
                        f"{self.server_url.rstrip('/')}/v1/systemone",
                        json=req.model_dump(),
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        data["server_mode"] = "http_server"
                        data["latency_ms"] = round((time.perf_counter() - t0) * 1000.0, 3)
                        return OpenJevResponse(**data)
            except Exception:
                self._server_alive = False

        return self.local_engine.process_request(req)


    def ask_choice(
        self,
        state: str,
        options: List[str],
        instructions: Optional[str] = None,
        question_name: str = "choice_decision",
    ) -> ChoiceDecision:
        """Helper to quickly query a single Choice primitive."""
        q = ChoiceQuestion(options=options, instructions=instructions)
        res = self.ask(state=state, questions={question_name: q})
        return res.decisions[question_name]  # type: ignore

    def ask_noul(
        self,
        state: str,
        instructions: str,
        question_name: str = "noul_decision",
    ) -> NoulDecision:
        """Helper to quickly query a single Noul primitive."""
        q = NoulQuestion(instructions=instructions)
        res = self.ask(state=state, questions={question_name: q})
        return res.decisions[question_name]  # type: ignore

    def ask_score(
        self,
        state: str,
        instructions: str,
        levels: Optional[List[Union[int, float, str]]] = None,
        question_name: str = "score_decision",
    ) -> ScoreDecision:
        """Helper to quickly query a single Score primitive."""
        q = ScoreQuestion(instructions=instructions, levels=levels or [1, 2, 3, 4, 5])
        res = self.ask(state=state, questions={question_name: q})
        return res.decisions[question_name]  # type: ignore


# Convenience alias matching `from jev.client import Client`
Client = OpenJevClient
