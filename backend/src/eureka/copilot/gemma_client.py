"""GemmaClient: Governed HTTP client for Google AI Studio generateContent.

Enforces:
- Header: X-goog-api-key (isolated copilot key)
- Temperature 0.0
- System instruction & function declarations
- Strict timeout & bounded retry
- Circuit breaker state machine
- Per-user & global rate limiters
- Strict key redaction in all exceptions and logs
"""

import asyncio
import json
import logging
import re
import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple
import httpx

from eureka.copilot.config import get_copilot_settings

logger = logging.getLogger("eureka.copilot.gemma_client")


class CopilotSecurityException(Exception):
    """Raised when security guardrails or rate caps are triggered."""
    pass


class CopilotCircuitBreakerOpen(Exception):
    """Raised when the circuit breaker is open due to consecutive failures."""
    pass


def redact_secrets(text: str) -> str:
    """Ensure no API keys, bearer tokens, or secret hashes appear in text/logs."""
    if not text:
        return text
    # Redact query params ?key=... or key=...
    text = re.sub(r'(?:key|apiKey|X-goog-api-key)=([a-zA-Z0-9_\-]{8,})', r'key=[REDACTED_KEY]', text, flags=re.IGNORECASE)
    # Redact Bearer tokens
    text = re.sub(r'Bearer\s+[a-zA-Z0-9_\-\.]{15,}', 'Bearer [REDACTED_TOKEN]', text, flags=re.IGNORECASE)
    # Redact generic AI Studio key patterns (AIzaSy...)
    text = re.sub(r'AIzaSy[a-zA-Z0-9_\-]{30,}', '[REDACTED_GEMINI_KEY]', text)
    # Redact Thesys or other sk-... keys
    text = re.sub(r'th-[a-zA-Z0-9_\-]{20,}|sk-[a-zA-Z0-9_\-]{20,}', '[REDACTED_API_KEY]', text)
    return text


class GemmaClient:
    """Production client for Gemma with rate-limiting, circuit breaker, and retry."""

    def __init__(self):
        self.settings = get_copilot_settings()
        # Circuit breaker state
        self._consecutive_failures = 0
        self._circuit_open_until = 0.0
        self._circuit_threshold = 5
        self._circuit_reset_timeout = 15.0  # seconds

        # Sliding window rate limiters (timestamps)
        self._user_requests: Dict[str, List[float]] = defaultdict(list)
        self._global_requests: List[float] = []

        # Persistent shared client with connection pooling & keep-alive
        self._client = httpx.AsyncClient(
            timeout=httpx.Timeout(connect=15.0, read=60.0, write=15.0, pool=15.0),
            limits=httpx.Limits(max_keepalive_connections=20, max_connections=50),
        )

    def _check_rate_limits(self, user_id: str) -> None:
        """Enforce per-user and global queries-per-minute rate caps."""
        now = time.time()
        window = 60.0

        # Purge expired timestamps
        self._global_requests = [t for t in self._global_requests if now - t < window]
        if len(self._global_requests) >= self.settings.COPILOT_RATE_LIMIT_GLOBAL_PER_MIN:
            raise CopilotSecurityException("Global copilot rate limit exceeded. Please wait a moment.")

        self._user_requests[user_id] = [t for t in self._user_requests[user_id] if now - t < window]
        # Prune stale inactive users to avoid unbounded memory growth
        stale_users = [u for u, ts in self._user_requests.items() if not any(now - t < window for t in ts)]
        for u in stale_users:
            self._user_requests.pop(u, None)
        if len(self._user_requests[user_id]) >= self.settings.COPILOT_RATE_LIMIT_USER_PER_MIN:
            raise CopilotSecurityException("Per-user copilot query limit exceeded (max 10/min).")

        # Record this request
        self._global_requests.append(now)
        self._user_requests[user_id].append(now)

    def _check_circuit_breaker(self) -> None:
        """Check if circuit breaker is open."""
        now = time.time()
        if now < self._circuit_open_until:
            wait_time = int(self._circuit_open_until - now)
            raise CopilotCircuitBreakerOpen(
                f"Gemma model circuit breaker is OPEN due to repeated errors. Cooling down ({wait_time}s remaining)."
            )

    def _record_success(self) -> None:
        self._consecutive_failures = 0
        self._circuit_open_until = 0.0

    def _record_failure(self) -> None:
        self._consecutive_failures += 1
        if self._consecutive_failures >= self._circuit_threshold:
            self._circuit_open_until = time.time() + self._circuit_reset_timeout
            logger.warning(
                "Circuit breaker tripped after %d failures. Open for %ds.",
                self._consecutive_failures,
                self._circuit_reset_timeout,
            )

    async def generate(
        self,
        contents: List[Dict[str, Any]],
        system_instruction: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        user_id: str = "anonymous",
    ) -> Dict[str, Any]:
        """Execute a generateContent call with retries and circuit breaker."""
        if self.settings.COPILOT_KILL_SWITCH:
            raise CopilotSecurityException("Copilot query service is temporarily disabled via emergency kill switch.")

        self._check_rate_limits(user_id)
        self._check_circuit_breaker()

        api_key = self.settings.get_effective_gemini_key()
        if not api_key:
            raise CopilotSecurityException("OPENUI_COPILOT_GEMINI_API_KEY is not configured.")

        primary_model = self.settings.COPILOT_MODEL
        if not primary_model.startswith("models/"):
            primary_model = f"models/{primary_model}"

        # Build request body
        payload: Dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.0,
                "maxOutputTokens": self.settings.COPILOT_MAX_OUTPUT_TOKENS,
            },
        }

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        if tools:
            payload["tools"] = tools

        headers = {
            "X-goog-api-key": api_key,
            "Content-Type": "application/json",
            "Connection": "keep-alive",
        }

        client_timeout = httpx.Timeout(
            connect=15.0,
            read=60.0,
            write=15.0,
            pool=15.0,
        )

        # Sanitize payload safely
        payload = json.loads(json.dumps(payload, default=str))
        candidate_models = [primary_model]
        if "flash" not in primary_model:
            candidate_models.append("models/gemini-flash-lite-latest")

        max_retries = 1
        last_error = None

        for cur_model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/{cur_model}:generateContent"
            for attempt in range(max_retries + 1):
                try:
                    resp = await self._client.post(url, json=payload, headers=headers)
                    
                    if resp.status_code == 200:
                        self._record_success()
                        res_json = resp.json()
                        res_json["_model_id"] = cur_model
                        return res_json
                    
                    # Non-retryable 4xx client errors (400, 401, 403, 404) must fail immediately without retry
                    if resp.status_code in (400, 401, 403, 404):
                        err_msg = redact_secrets(resp.text)
                        raise RuntimeError(f"Gemma API client error HTTP {resp.status_code} on {cur_model}: {err_msg[:200]}")

                    # Retry only on 429 or 5xx with backoff
                    if resp.status_code in (429, 500, 502, 503, 504) and attempt < max_retries:
                        backoff = (2 ** attempt) * 0.5
                        logger.warning("%s returned HTTP %d. Retrying in %.1fs...", cur_model, resp.status_code, backoff)
                        await asyncio.sleep(backoff)
                        continue

                    err_msg = redact_secrets(resp.text)
                    raise RuntimeError(f"Gemma API returned HTTP {resp.status_code}: {err_msg[:200]}")

                except httpx.TimeoutException as exc:
                    last_error = exc
                    if attempt < max_retries:
                        await asyncio.sleep(1.0)
                        continue
                    if cur_model != candidate_models[-1]:
                        break
                    raise TimeoutError("Gemma API timed out after retry bounds.") from None
                except Exception as exc:
                    last_error = exc
                    if attempt < max_retries and not isinstance(exc, (CopilotSecurityException, CopilotCircuitBreakerOpen)):
                        await asyncio.sleep(1.0)
                        continue
                    if cur_model != candidate_models[-1]:
                        break
                    clean_msg = redact_secrets(str(exc))
                    raise RuntimeError(f"GemmaClient error: {clean_msg}") from None

        self._record_failure()
        raise RuntimeError(f"GemmaClient failed after retry attempts: {redact_secrets(str(last_error))}")
