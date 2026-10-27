"""
Unit tests for Phase 1: Scraping MDP Environment & PPO Controller.
"""

import numpy as np
import pytest
from savi.ingestion.mdp_env import (
    ScraperAction,
    ScraperMDPState,
    ScraperExecutionResult,
    ScrapingMDPEnvironment,
)
from savi.ingestion.ppo_controller import PPOController, ActorCriticNetwork


def test_mdp_state_normalization():
    state = ScraperMDPState(
        inter_request_delay_ms=2500.0,
        proxy_health_score=0.85,
        rate_limit_ema=0.15,
        server_latency_ms=450.0,
        dom_drift_distance=0.25,
        quota_remaining_fraction=0.90,
    )
    vec = state.to_normalized_vector()
    assert vec.shape == (6,)
    assert 0.0 <= vec[0] <= 2.0
    assert 0.0 <= vec[1] <= 1.0
    assert 0.0 <= vec[2] <= 1.0


def test_point_based_reward_formulation():
    env = ScrapingMDPEnvironment()

    # Success case: 2 valid payloads, no 429, 200ms latency, no captcha, no ban
    res_success = ScraperExecutionResult(
        valid_payloads_count=2,
        hit_429_rate_limit=False,
        latency_ms=200.0,
        hit_captcha_challenge=False,
        is_terminal_ban=False,
    )
    reward_success = env.compute_reward(res_success)
    # R = 2.0*2 - 15.0*0 - 0.5*(0.2) - 10.0*0 - 50.0*0 = 4.0 - 0.1 = 3.9
    assert reward_success == pytest.approx(3.9, rel=1e-2)

    # 429 rate limit penalty case
    res_429 = ScraperExecutionResult(
        valid_payloads_count=0,
        hit_429_rate_limit=True,
        latency_ms=500.0,
        hit_captcha_challenge=False,
        is_terminal_ban=False,
    )
    reward_429 = env.compute_reward(res_429)
    # R = 0 - 15.0 - 0.5*(0.5) = -15.25
    assert reward_429 == pytest.approx(-15.25, rel=1e-2)

    # Terminal ban severe penalty case
    res_ban = ScraperExecutionResult(
        valid_payloads_count=0,
        hit_429_rate_limit=True,
        latency_ms=1000.0,
        hit_captcha_challenge=True,
        is_terminal_ban=True,
    )
    reward_ban = env.compute_reward(res_ban)
    # Penalty hierarchy: w5 >> w2 > w4 >> w1 > w3
    assert reward_ban <= -75.0


def test_scraper_actions_transitions():
    env = ScrapingMDPEnvironment()
    env.reset()
    init_delay = env.state.inter_request_delay_ms

    # Test decrease delay (a_1)
    env.step(ScraperAction.DECREASE_DELAY)
    assert env.state.inter_request_delay_ms < init_delay

    # Test increase delay (a_2)
    env.step(ScraperAction.INCREASE_DELAY)
    assert env.state.inter_request_delay_ms == init_delay

    # Test key rotation (a_3)
    env.step(ScraperAction.ROTATE_KEY)
    assert env.state.quota_remaining_fraction >= 0.99


def test_ppo_controller_selection_and_update():
    controller = PPOController()
    env = ScrapingMDPEnvironment()
    state = env.reset()

    # Collect a short rollout trajectory
    for _ in range(8):
        action, log_prob, val = controller.select_action(state)
        next_state, reward, done, _ = env.step(action)
        controller.store_transition(state, action, reward, val, log_prob, done)
        state = next_state

    assert len(controller.memory) == 8

    # Run update epoch
    metrics = controller.update(state)
    assert "policy_loss" in metrics
    assert "value_loss" in metrics
    assert len(controller.memory) == 0  # Cleared after update
