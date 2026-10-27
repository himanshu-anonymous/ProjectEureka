"""
Unit tests for Phase 2: Extended Isolation Forest (Isolation Rainforest).
"""

import numpy as np
import pytest
from savi.anomaly.isolation_rainforest import (
    IsolationRainforest,
    ExtendedIsolationTree,
    average_path_length_c,
)


def test_average_path_length_c_formula():
    assert average_path_length_c(0) == 0.0
    assert average_path_length_c(1) == 0.0
    assert average_path_length_c(2) == 1.0

    # For n = 256, c(n) should be approx 2 * (ln(255) + 0.5772) - 2*(255)/256 ≈ 10.23
    c_256 = average_path_length_c(256)
    assert 9.5 < c_256 < 11.0


def test_isolation_rainforest_oblique_hyperplane_detection():
    rng = np.random.default_rng(42)

    # Generate synthetic clustered organic data in 6 dimensions
    # centered around [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    n_samples = 300
    X_organic = rng.normal(loc=0.5, scale=0.1, size=(n_samples, 6)).astype(np.float32)

    forest = IsolationRainforest()
    forest.fit(X_organic)

    # Test an in-distribution organic point
    x_organic_test = np.array([0.5, 0.52, 0.48, 0.51, 0.49, 0.50], dtype=np.float32)
    score_organic = forest.compute_anomaly_score(x_organic_test)
    action_org, info_org = forest.route_decision(score_organic)

    assert score_organic < 0.60
    assert action_org in ["PASS_ORGANIC", "FLAG_ELEVATED"]

    # Test an extreme synthetic outlier (e.g. artificial engagement ratio and bot velocity)
    x_anomaly = np.array([15.0, -10.0, 50.0, -20.0, 30.0, 10.0], dtype=np.float32)
    score_anomaly = forest.compute_anomaly_score(x_anomaly)
    action_anom, info_anom = forest.route_decision(score_anomaly)

    # Outlier should isolate at very shallow tree depths, yielding high score
    assert score_anomaly > score_organic
    assert score_anomaly >= 0.65
    assert action_anom == "QUARANTINE"
    assert info_anom["penalty_weight"] == 1.0


def test_decision_boundary_thresholds():
    forest = IsolationRainforest()
    # Test boundary mappings
    act_org, _ = forest.route_decision(0.40)
    assert act_org == "PASS_ORGANIC"

    act_flag, _ = forest.route_decision(0.58)
    assert act_flag == "FLAG_ELEVATED"

    act_quar, _ = forest.route_decision(0.85)
    assert act_quar == "QUARANTINE"
