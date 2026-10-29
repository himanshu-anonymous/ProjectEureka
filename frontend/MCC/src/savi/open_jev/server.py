"""
Open-Jev REST Server endpoint implementation conforming to Zefan-Cai/Open-Jev.
Provides `/v1/systemone` and `/v1/ask` serving typed Choice, Noul, and Score decisions.
"""

from __future__ import annotations
from fastapi import APIRouter, status
from savi.open_jev.schema import OpenJevRequest, OpenJevResponse
from savi.open_jev.engine import LocalOpenJevEngine
from savi.config import settings

open_jev_router = APIRouter(prefix="", tags=["Open-Jev System One"])
engine = LocalOpenJevEngine(
    model_id=settings.credentials.open_jev_model_id,
    default_temperature=settings.credentials.open_jev_temperature,
)


@open_jev_router.post(
    "/v1/systemone",
    response_model=OpenJevResponse,
    summary="Standard Open-Jev System One Decision Endpoint",
)
async def system_one_decision(request: OpenJevRequest) -> OpenJevResponse:
    """
    Evaluates context state against typed questions (Choice, Noul, Score).
    Returns calibrated probability distributions without autoregressive text generation.
    """
    response = engine.process_request(request)
    return response


@open_jev_router.post(
    "/v1/ask",
    response_model=OpenJevResponse,
    summary="Alias endpoint for Open-Jev ask",
)
async def ask_decision(request: OpenJevRequest) -> OpenJevResponse:
    response = engine.process_request(request)
    return response


@open_jev_router.get(
    "/v1/health",
    summary="Open-Jev Server Health & Capability Check",
)
async def open_jev_health():
    return {
        "status": "healthy",
        "service": "Open-Jev Decision Server",
        "repository": "https://github.com/Zefan-Cai/Open-Jev",
        "model_id": engine.model_id,
        "default_temperature": engine.temperature,
        "primitives_supported": ["choice", "noul", "score"],
    }
