"""
Unit tests for Phase 4: SAVI Analytical Formulation Matrix.
"""

import pytest
import numpy as np
from savi.metrics.savi_suite import SAVIEngine, SAVIMetricsResult


def test_sentiment_dynamics_decay():
    engine = SAVIEngine()

    # Trajectory of sentiment over time: [(t, s)]
    # Upward drift from 0.0 to 0.8
    traj = [(0.0, 0.0), (1.0, 0.3), (2.0, 0.8)]
    current_t = 2.5

    s_dyn = engine.compute_sentiment_dynamics(traj, current_t)
    # Directional drift is positive
    assert s_dyn > 0.0
    assert -1.0 <= s_dyn <= 1.0


def test_factual_accuracy_scaling():
    engine = SAVIEngine()

    # High topological convergence (0.9), high entailment (0.85), high authority weights
    a_high = engine.compute_factual_accuracy(
        mu_topo=0.9,
        p_entailment=0.85,
        authority_weights=[3.0, 4.0, 5.0],  # sum = 12, (1 - 1/12) = 11/12 ≈ 0.916
    )
    assert 0.65 < a_high < 0.85

    # Low authority weighting reduces accuracy
    a_low = engine.compute_factual_accuracy(
        mu_topo=0.9,
        p_entailment=0.85,
        authority_weights=[1.1],  # sum = 1.1, (1 - 1/1.1) = 0.09
    )
    assert a_low < a_high


def test_logical_validation_penalty():
    engine = SAVIEngine()

    # Clean case: no contradictions, low anomaly
    v_clean = engine.compute_logical_validation(kappa_contradictions=0.0, anomaly_score_s=0.2)
    # V = 1.0 - (0.0 + 0.2)/2 = 0.9
    assert v_clean == pytest.approx(0.9, rel=1e-2)

    # Bot astroturfing case: high contradictions + high anomaly score
    v_bot = engine.compute_logical_validation(kappa_contradictions=0.8, anomaly_score_s=0.8)
    # V = 1.0 - (0.8 + 0.8)/2 = 0.2
    assert v_bot == pytest.approx(0.2, rel=1e-2)


def test_news_impact_index_reach():
    engine = SAVIEngine()

    engagements = {"twitter": 0.9, "reddit": 0.6, "web": 0.4}
    centralities = {"twitter": 0.8, "reddit": 0.5, "web": 0.3}
    velocity = 5.0  # actions per min

    impact = engine.compute_news_impact_index(engagements, centralities, velocity)
    # Weighted reach = 0.9*0.8 + 0.6*0.5 + 0.4*0.3 = 0.72 + 0.30 + 0.12 = 1.14
    # Impact = 1.14 * 5.0 = 5.7
    assert impact == pytest.approx(5.7, rel=1e-2)
