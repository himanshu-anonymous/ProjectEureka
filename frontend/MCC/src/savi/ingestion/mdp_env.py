"""
Point-Based Reinforcement Learning MDP Environment for Adaptive Scraping Ingestion.
Defines continuous State Space S, discrete Action Space A, transition dynamics P,
and the point-based reward function R_t according to the SAVI technical specification.
"""

from __future__ import annotations
import enum
from typing import Tuple, Dict, Any, List
import numpy as np
from pydantic import BaseModel
from savi.config import PPOConfig, settings


class ScraperAction(enum.IntEnum):
    DECREASE_DELAY = 0    # a_1: \Delta \tau_{req} - \delta t
    INCREASE_DELAY = 1    # a_2: \Delta \tau_{req} + \delta t
    ROTATE_KEY = 2        # a_3: Atomic context-preserving API key rotation
    ROTATE_PROXY = 3      # a_4: Rotate residential proxy subnet
    SWITCH_PARSER = 4     # a_5: Switch parser strategy (e.g. API -> Headless DOM)
    SOFT_BACKOFF = 5      # a_6: Pause queue execution for T_{backoff}


class ScraperExecutionResult(BaseModel):
    valid_payloads_count: int = 0      # V_{valid}
    hit_429_rate_limit: bool = False   # E_{429}
    latency_ms: float = 200.0          # L_{ms}
    hit_captcha_challenge: bool = False# C_{captcha}
    is_terminal_ban: bool = False       # \mathbb{I}_{ban}


class ScraperMDPState:
    r"""
    Continuous multi-dimensional state vector:
    s_t = [\Delta \tau_{req}, \rho_{proxy}, \kappa_{429}, \mu_{latency}, \sigma_{dom\_drift}, \xi_{quota\_remaining}]
    """
    def __init__(
        self,
        inter_request_delay_ms: float = 1000.0,
        proxy_health_score: float = 1.0,
        rate_limit_ema: float = 0.0,
        server_latency_ms: float = 200.0,
        dom_drift_distance: float = 0.0,
        quota_remaining_fraction: float = 1.0,
    ):
        self.inter_request_delay_ms = inter_request_delay_ms
        self.proxy_health_score = proxy_health_score
        self.rate_limit_ema = rate_limit_ema
        self.server_latency_ms = server_latency_ms
        self.dom_drift_distance = dom_drift_distance
        self.quota_remaining_fraction = quota_remaining_fraction

    def to_normalized_vector(self) -> np.ndarray:
        """Normalized state vector in range approx [0, 1] for stable neural network training."""
        delay_norm = np.clip(self.inter_request_delay_ms / 5000.0, 0.0, 2.0)
        proxy_norm = np.clip(self.proxy_health_score, 0.0, 1.0)
        ema_norm = np.clip(self.rate_limit_ema, 0.0, 1.0)
        lat_norm = np.clip(self.server_latency_ms / 2000.0, 0.0, 2.0)
        drift_norm = np.clip(self.dom_drift_distance, 0.0, 1.0)
        quota_norm = np.clip(self.quota_remaining_fraction, 0.0, 1.0)
        return np.array([delay_norm, proxy_norm, ema_norm, lat_norm, drift_norm, quota_norm], dtype=np.float32)

    def to_raw_vector(self) -> np.ndarray:
        return np.array([
            self.inter_request_delay_ms,
            self.proxy_health_score,
            self.rate_limit_ema,
            self.server_latency_ms,
            self.dom_drift_distance,
            self.quota_remaining_fraction,
        ], dtype=np.float32)


class ScrapingMDPEnvironment:
    """
    Simulated/Live Scraping MDP Environment managing state updates, action transitions,
    and reward computation for the adaptive scraping mesh.
    """
    def __init__(self, config: PPOConfig = settings.ppo):
        self.config = config
        self.state = ScraperMDPState()
        self.step_count = 0
        self.proxy_success_window: List[int] = [1] * 100
        self.key_rotation_index = 0
        self.total_keys = 5
        self.parser_strategy = "api"  # "api" or "headless_dom"
        self.backoff_remaining_s = 0.0

    def reset(self) -> np.ndarray:
        self.state = ScraperMDPState(
            inter_request_delay_ms=1000.0,
            proxy_health_score=1.0,
            rate_limit_ema=0.0,
            server_latency_ms=200.0,
            dom_drift_distance=0.0,
            quota_remaining_fraction=1.0,
        )
        self.step_count = 0
        self.proxy_success_window = [1] * 100
        self.key_rotation_index = 0
        self.parser_strategy = "api"
        self.backoff_remaining_s = 0.0
        return self.state.to_normalized_vector()

    def compute_reward(self, execution: ScraperExecutionResult) -> float:
        """
        Calculates R_t based on the specification:
        R_t = w1*V_{valid} - w2*E_{429} - w3*(L_{ms}/1000) - w4*C_{captcha} - w5*I_{ban}
        """
        v_valid = float(execution.valid_payloads_count)
        e_429 = 1.0 if execution.hit_429_rate_limit else 0.0
        l_ms_norm = execution.latency_ms / 1000.0
        c_captcha = 1.0 if execution.hit_captcha_challenge else 0.0
        i_ban = 1.0 if execution.is_terminal_ban else 0.0

        reward = (
            self.config.w1_valid * v_valid
            - self.config.w2_rate_limit * e_429
            - self.config.w3_latency * l_ms_norm
            - self.config.w4_captcha * c_captcha
            - self.config.w5_ban * i_ban
        )
        return float(reward)

    def apply_action(self, action: ScraperAction | int) -> Dict[str, Any]:
        """Executes selected control action a_t in the environment."""
        action_enum = ScraperAction(action)
        action_info = {"action": action_enum.name}

        if action_enum == ScraperAction.DECREASE_DELAY:
            self.state.inter_request_delay_ms = max(
                self.config.min_delay_ms,
                self.state.inter_request_delay_ms - self.config.delta_t_ms,
            )
        elif action_enum == ScraperAction.INCREASE_DELAY:
            self.state.inter_request_delay_ms = min(
                self.config.max_delay_ms,
                self.state.inter_request_delay_ms + self.config.delta_t_ms,
            )
        elif action_enum == ScraperAction.ROTATE_KEY:
            self.key_rotation_index = (self.key_rotation_index + 1) % self.total_keys
            # Key rotation restores fraction of active quota
            self.state.quota_remaining_fraction = 1.0
            action_info["new_key_index"] = self.key_rotation_index
        elif action_enum == ScraperAction.ROTATE_PROXY:
            # Rotating residential proxy subnet recovers health
            self.proxy_success_window = [1] * 100
            self.state.proxy_health_score = 1.0
            action_info["proxy_subnet_rotated"] = True
        elif action_enum == ScraperAction.SWITCH_PARSER:
            self.parser_strategy = "headless_dom" if self.parser_strategy == "api" else "api"
            # Switching parser can bypass DOM drift or API blocks
            self.state.dom_drift_distance = max(0.0, self.state.dom_drift_distance - 0.4)
            action_info["new_parser_strategy"] = self.parser_strategy
        elif action_enum == ScraperAction.SOFT_BACKOFF:
            self.backoff_remaining_s = self.config.soft_backoff_duration_s
            # Backoff reduces rate limit EMA
            self.state.rate_limit_ema *= 0.5
            action_info["backoff_duration_s"] = self.backoff_remaining_s

        return action_info

    def step(
        self,
        action: ScraperAction | int,
        simulated_execution: ScraperExecutionResult | None = None,
    ) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """
        Performs one MDP transition:
        Returns: (next_state_normalized, reward, done, info)
        """
        self.step_count += 1
        action_info = self.apply_action(action)

        # If execution result is not provided from live scraper, simulate realistic response
        if simulated_execution is None:
            simulated_execution = self._simulate_step_execution(action)

        # Update proxy health sliding window
        is_success = 1 if (not simulated_execution.hit_429_rate_limit and not simulated_execution.hit_captcha_challenge and not simulated_execution.is_terminal_ban) else 0
        self.proxy_success_window.pop(0)
        self.proxy_success_window.append(is_success)
        self.state.proxy_health_score = sum(self.proxy_success_window) / 100.0

        # Update Rate Limit EMA: kappa_429
        alpha = 0.20
        e_429_val = 1.0 if simulated_execution.hit_429_rate_limit else 0.0
        self.state.rate_limit_ema = alpha * e_429_val + (1.0 - alpha) * self.state.rate_limit_ema

        # Update latency and quota
        self.state.server_latency_ms = simulated_execution.latency_ms
        self.state.quota_remaining_fraction = max(0.0, self.state.quota_remaining_fraction - 0.01)

        # Calculate reward
        reward = self.compute_reward(simulated_execution)
        done = simulated_execution.is_terminal_ban or (self.step_count >= 1000)

        info = {
            **action_info,
            "execution": simulated_execution.model_dump(),
            "step": self.step_count,
        }

        return self.state.to_normalized_vector(), reward, done, info

    def _simulate_step_execution(self, action: ScraperAction | int) -> ScraperExecutionResult:
        """Internal stochastic model for realistic simulation during training/testing."""
        delay = self.state.inter_request_delay_ms

        # Higher request rates (lower delay) increase probability of 429
        p_429 = float(np.clip(np.exp(-delay / 800.0) * 0.45, 0.0, 0.8))
        hit_429 = bool(np.random.rand() < p_429)

        # Latency varies with server load + delay
        base_latency = 180.0 + float(np.random.normal(20.0, 15.0))
        if hit_429:
            base_latency += 300.0

        # Captcha risk increases with repeated rate limits or DOM drift
        p_captcha = float(np.clip(self.state.rate_limit_ema * 0.3 + self.state.dom_drift_distance * 0.2, 0.0, 0.5))
        hit_captcha = bool(np.random.rand() < p_captcha)

        # Terminal ban is rare unless captcha/429 continuously triggered
        p_ban = float(0.05 if (hit_429 and hit_captcha) else 0.0)
        is_ban = bool(np.random.rand() < p_ban)

        valid_count = 0 if (hit_429 or hit_captcha or is_ban) else int(np.random.randint(1, 4))

        return ScraperExecutionResult(
            valid_payloads_count=valid_count,
            hit_429_rate_limit=hit_429,
            latency_ms=max(50.0, base_latency),
            hit_captcha_challenge=hit_captcha,
            is_terminal_ban=is_ban,
        )
