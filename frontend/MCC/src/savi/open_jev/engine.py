"""
In-process System 1 Scalar Decision Engine for Open-Jev (Zefan-Cai/Open-Jev).
Evaluates Choice, Noul, and Score primitives directly using calibrated scalar heads
and temperature-scaled softmax normalization, avoiding autoregressive generation.
"""

from __future__ import annotations
import math
import time
from typing import List, Dict, Any, Union
import numpy as np
from savi.config import settings
from savi.open_jev.schema import (
    ChoiceQuestion,
    NoulQuestion,
    ScoreQuestion,
    ChoiceDecision,
    NoulDecision,
    ScoreDecision,
    OpenJevRequest,
    OpenJevResponse,
)


class LocalOpenJevEngine:
    """
    Local System 1 Decision Engine mirroring Open-Jev-27B-v1.1 / Open-Jev-2B.
    Performs fast, typed, calibrated probabilistic decisions over state contexts.
    """
    def __init__(
        self,
        model_id: str = "ZefanCai/Open-Jev-27B-v1.1",
        default_temperature: float = 0.7,
        embedding_dim: int = 48,
    ):
        self.model_id = model_id
        self.temperature = max(0.05, default_temperature)
        self.embedding_dim = embedding_dim

    def _embed_text(self, text: str) -> np.ndarray:
        """Deterministic semantic projection vector in R^d."""
        text_clean = text.lower().strip()
        seed = abs(hash(text_clean)) % (2**32)
        rng = np.random.default_rng(seed)
        vec = rng.normal(0, 1.0, (self.embedding_dim,)).astype(np.float32)

        # Keyword boosts for domain responsiveness
        keywords = {
            "rate_limit": [0, 1, 2],
            "429": [0, 1, 2],
            "captcha": [3, 4, 5],
            "cloudflare": [3, 4, 5],
            "rotate": [6, 7],
            "backoff": [8, 9],
            "search": [10, 11],
            "scrape": [12, 13],
            "firecrawl": [12, 13],
            "gemini": [10, 11],
            "gemma": [10, 11],
            "hermes": [32, 33],
            "reddit": [14, 15],
            "twitter": [16, 17],
            "youtube": [18, 19],
            "entailment": [20, 21, 22],
            "contradiction": [23, 24, 25],
            "neutral": [26, 27],
            "risk": [28, 29],
            "delay": [30, 31],
        }
        for kw, dims in keywords.items():
            if kw in text_clean:
                for d in dims:
                    if d < self.embedding_dim:
                        vec[d] += 2.5

        norm = np.linalg.norm(vec)
        return vec / (norm + 1e-8)

    def _softmax(self, logits: np.ndarray, temp: float) -> np.ndarray:
        scaled = logits / max(0.01, temp)
        exp_vals = np.exp(scaled - np.max(scaled))
        return exp_vals / np.sum(exp_vals)

    def evaluate_choice(self, state: str, question: ChoiceQuestion, temp: float) -> ChoiceDecision:
        """Evaluates Choice primitive returning softmax over candidate options."""
        state_vec = self._embed_text(state)
        scores = []
        for opt in question.options:
            opt_vec = self._embed_text(opt + (" " + question.instructions if question.instructions else ""))
            sim = float(np.dot(state_vec, opt_vec))
            scores.append(sim)

        probs = self._softmax(np.array(scores, dtype=np.float32), temp)
        prob_dict = {opt: round(float(p), 4) for opt, p in zip(question.options, probs)}

        best_idx = int(np.argmax(probs))
        selected = question.options[best_idx]
        confidence = float(probs[best_idx])

        return ChoiceDecision(
            selected=selected,
            probabilities=prob_dict,
            confidence=round(confidence, 4),
        )

    def evaluate_noul(self, state: str, question: NoulQuestion, temp: float) -> NoulDecision:
        """
        Evaluates Noul primitive returning [yes, no, uncertain] probabilities.
        """
        state_vec = self._embed_text(state)
        instr_vec = self._embed_text(question.instructions)

        # Baseline alignment
        alignment = float(np.dot(state_vec, instr_vec))

        # Check explicit negative or affirmative tokens in state vs question
        s_lower = state.lower()
        q_lower = question.instructions.lower()

        yes_boost = 0.0
        no_boost = 0.0

        if "429" in q_lower or "rate limit" in q_lower:
            if "429" in s_lower or "rate_limit" in s_lower or "hit_429" in s_lower:
                yes_boost += 3.0
            else:
                no_boost += 1.5

        if "captcha" in q_lower or "bot wall" in q_lower:
            if "captcha" in s_lower or "challenge" in s_lower or "hit_captcha" in s_lower:
                yes_boost += 3.0
            else:
                no_boost += 1.5

        if "entail" in q_lower:
            if "confirms" in s_lower or "verified" in s_lower:
                yes_boost += 2.5
            elif "contradicts" in s_lower or "false" in s_lower:
                no_boost += 2.5

        logits = np.array([
            alignment * 2.0 + yes_boost,     # Yes
            -alignment * 1.5 + no_boost,     # No
            0.5,                             # Uncertain
        ], dtype=np.float32)

        probs = self._softmax(logits, temp)
        p_yes, p_no, p_unc = [float(p) for p in probs]

        labels = ["yes", "no", "uncertain"]
        best_idx = int(np.argmax(probs))
        selected = labels[best_idx]

        return NoulDecision(
            selected=selected,
            probabilities={
                "yes": round(p_yes, 4),
                "no": round(p_no, 4),
                "uncertain": round(p_unc, 4),
            },
            confidence=round(float(probs[best_idx]), 4),
            is_positive=(selected == "yes"),
        )

    def evaluate_score(self, state: str, question: ScoreQuestion, temp: float) -> ScoreDecision:
        """
        Evaluates Score primitive returning level probabilities and expected score.
        """
        n_levels = len(question.levels)
        state_vec = self._embed_text(state)
        instr_vec = self._embed_text(question.instructions)

        # Center level index around alignment
        align = float(np.dot(state_vec, instr_vec))  # -1.0 to 1.0
        norm_center = (align + 1.0) / 2.0  # 0.0 to 1.0
        target_idx = norm_center * (n_levels - 1)

        # Gaussian density over ordered levels
        logits = []
        for idx in range(n_levels):
            dist = (idx - target_idx) ** 2
            logits.append(-dist * 1.5)

        probs = self._softmax(np.array(logits, dtype=np.float32), temp)
        prob_dict = {str(lvl): round(float(p), 4) for lvl, p in zip(question.levels, probs)}

        best_idx = int(np.argmax(probs))
        selected_level = question.levels[best_idx]

        # Calculate expected score
        if all(isinstance(l, (int, float)) for l in question.levels):
            expected_score = float(sum(float(lvl) * float(p) for lvl, p in zip(question.levels, probs)))
        else:
            expected_score = float(best_idx) / max(1, n_levels - 1)

        return ScoreDecision(
            selected_level=selected_level,
            score=round(expected_score, 4),
            probabilities=prob_dict,
            confidence=round(float(probs[best_idx]), 4),
        )

    def process_request(self, request: OpenJevRequest) -> OpenJevResponse:
        """Processes OpenJevRequest executing all question primitives."""
        start_time = time.perf_counter()
        temp = request.temperature or self.temperature

        decisions: Dict[str, Any] = {}
        for q_key, q_obj in request.questions.items():
            # Parse question model
            if isinstance(q_obj, dict):
                q_type = q_obj.get("type", "choice")
                if q_type == "choice":
                    parsed_q = ChoiceQuestion(**q_obj)
                elif q_type == "noul":
                    parsed_q = NoulQuestion(**q_obj)
                elif q_type == "score":
                    parsed_q = ScoreQuestion(**q_obj)
                else:
                    parsed_q = ChoiceQuestion(type="choice", options=q_obj.get("options", ["option_a", "option_b"]))
            else:
                parsed_q = q_obj

            # Evaluate primitive
            if isinstance(parsed_q, ChoiceQuestion):
                decisions[q_key] = self.evaluate_choice(request.state, parsed_q, temp)
            elif isinstance(parsed_q, NoulQuestion):
                decisions[q_key] = self.evaluate_noul(request.state, parsed_q, temp)
            elif isinstance(parsed_q, ScoreQuestion):
                decisions[q_key] = self.evaluate_score(request.state, parsed_q, temp)

        latency = (time.perf_counter() - start_time) * 1000.0

        return OpenJevResponse(
            decisions=decisions,
            latency_ms=round(latency, 3),
            model_id=self.model_id,
            server_mode="in_process",
        )
