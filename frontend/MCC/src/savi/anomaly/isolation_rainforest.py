"""
Extended Isolation Forest (Isolation Rainforest) for Non-Axis-Aligned Multidimensional Anomaly Detection.
Implements oblique slicing hyperplanes, average path length c(n), and anomaly scoring s(x, n).
"""

from __future__ import annotations
import math
from dataclasses import dataclass
from typing import List, Optional, Tuple, Dict, Any
import numpy as np
from savi.config import IsolationRainforestConfig, settings

# Euler–Mascheroni constant
EULER_MASCHERONI = 0.577215664901532860606512


def average_path_length_c(n: int) -> float:
    """
    Computes average path length of unsuccessful search in a Binary Search Tree (BST):
    c(n) = 2*(ln(n - 1) + gamma_E) - (2*(n - 1) / n) for n > 2
    c(2) = 1.0, c(n <= 1) = 0.0
    """
    if n <= 1:
        return 0.0
    if n == 2:
        return 1.0
    return 2.0 * (math.log(n - 1.0) + EULER_MASCHERONI) - (2.0 * (n - 1.0) / float(n))


class ExtendedIsolationNode:
    """Node in an Extended Isolation Tree holding oblique hyperplane parameters."""
    def __init__(
        self,
        left: Optional[ExtendedIsolationNode] = None,
        right: Optional[ExtendedIsolationNode] = None,
        normal_vector: Optional[np.ndarray] = None,
        intercept_point: Optional[np.ndarray] = None,
        size: int = 0,
        is_leaf: bool = False,
    ):
        self.left = left
        self.right = right
        self.normal_vector = normal_vector      # \vec{n} \in \mathbb{R}^d
        self.intercept_point = intercept_point  # \vec{p} \in \mathbb{R}^d
        self.size = size
        self.is_leaf = is_leaf


class ExtendedIsolationTree:
    """Single isolation tree built with random non-axis-aligned slicing hyperplanes."""
    def __init__(self, max_depth: int):
        self.max_depth = max_depth
        self.root: Optional[ExtendedIsolationNode] = None

    def fit(self, X: np.ndarray, current_depth: int = 0) -> ExtendedIsolationNode:
        n_samples, n_features = X.shape

        # Termination criteria: max depth reached, single sample, or identical points
        if current_depth >= self.max_depth or n_samples <= 1:
            return ExtendedIsolationNode(size=n_samples, is_leaf=True)

        min_val = np.min(X, axis=0)
        max_val = np.max(X, axis=0)
        if np.allclose(min_val, max_val):
            return ExtendedIsolationNode(size=n_samples, is_leaf=True)

        # Generate random normal vector \vec{n} ~ N(0, I_d)
        n_vec = np.random.normal(0, 1.0, size=(n_features,)).astype(np.float32)
        norm = np.linalg.norm(n_vec)
        if norm > 1e-8:
            n_vec /= norm

        # Project data onto normal vector: v = X \cdot \vec{n}
        v = np.dot(X, n_vec)
        v_min, v_max = float(np.min(v)), float(np.max(v))
        if np.isclose(v_min, v_max):
            return ExtendedIsolationNode(size=n_samples, is_leaf=True)

        # Draw intercept value uniformly along data projection domain
        p_val = float(np.random.uniform(v_min, v_max))
        p_vec = (p_val * n_vec).astype(np.float32)

        # Hyperplane split: (\vec{x} - \vec{p}) \cdot \vec{n} <= 0
        dots = v - p_val
        left_mask = dots <= 0.0
        right_mask = ~left_mask

        left_child = self.fit(X[left_mask], current_depth + 1)
        right_child = self.fit(X[right_mask], current_depth + 1)

        return ExtendedIsolationNode(
            left=left_child,
            right=right_child,
            normal_vector=n_vec,
            intercept_point=p_vec,
            size=n_samples,
            is_leaf=False,
        )

    def path_length(self, x: np.ndarray, node: Optional[ExtendedIsolationNode], current_depth: int = 0) -> float:
        """Computes path length h(x) traversed until isolation."""
        if node is None or node.is_leaf:
            # Add average path length of remaining unbuilt subtree
            return current_depth + average_path_length_c(node.size if node else 0)

        # Oblique cut evaluation: (x - p) \cdot n <= 0
        dot_val = np.dot(x - node.intercept_point, node.normal_vector)
        if dot_val <= 0.0:
            return self.path_length(x, node.left, current_depth + 1)
        else:
            return self.path_length(x, node.right, current_depth + 1)


class IsolationRainforest:
    """
    Ensemble of Extended Isolation Trees (Isolation Rainforest).
    Guards against astroturfing, bot storms, and engagement spam.
    """
    def __init__(self, config: IsolationRainforestConfig = settings.rainforest):
        self.config = config
        self.trees: List[ExtendedIsolationTree] = []
        self.subsample_size = config.subsample_size
        self.max_depth = int(math.ceil(math.log2(max(self.subsample_size, 2))))
        self.c_subsample = average_path_length_c(self.subsample_size)
        self.is_fitted = False

    def fit(self, X: np.ndarray) -> IsolationRainforest:
        """Fits ensemble over training matrix X of shape (N, d)."""
        n_samples = X.shape[0]
        actual_subsample = min(self.subsample_size, n_samples)
        self.c_subsample = average_path_length_c(actual_subsample)
        self.trees.clear()

        for _ in range(self.config.n_trees):
            indices = np.random.choice(n_samples, size=actual_subsample, replace=False)
            tree = ExtendedIsolationTree(max_depth=self.max_depth)
            tree.root = tree.fit(X[indices])
            self.trees.append(tree)

        self.is_fitted = True
        return self

    def compute_anomaly_score(self, x: np.ndarray) -> float:
        """
        Computes anomaly score s(x, n) = 2^(- E[h(x)] / c(n)).
        x: observation vector in R^d
        """
        if not self.trees:
            # Untrained fallback defaults to organic baseline
            return 0.35

        path_lengths = [t.path_length(x, t.root) for t in self.trees]
        mean_path = float(np.mean(path_lengths))

        if self.c_subsample <= 0.0:
            return 0.50

        score = float(2.0 ** (- (mean_path / self.c_subsample)))
        return float(np.clip(score, 0.0, 1.0))

    def predict_anomaly_score(self, X: np.ndarray) -> np.ndarray:
        """Computes anomaly scores for 1D vector or 2D matrix of observations."""
        X_arr = np.asarray(X, dtype=np.float32)
        if X_arr.ndim == 1:
            return np.array([self.compute_anomaly_score(X_arr)], dtype=np.float32)
        return np.array([self.compute_anomaly_score(row) for row in X_arr], dtype=np.float32)

    def route_decision(self, anomaly_score: float) -> Tuple[str, Dict[str, Any]]:
        """
        Decision Boundary Logic according to SAVI specification:
        - s(x, n) >= 0.65 -> Quarantine Queue
        - s(x, n) < 0.50  -> Organic, passes down pipeline
        - 0.50 <= s(x, n) <= 0.65 -> Flagged with penalty weight, elevated verification
        """
        if anomaly_score >= self.config.flagged_threshold:
            action = "QUARANTINE"
            desc = "Unnatural synthetic anomaly or engagement fraud detected. Routed to quarantine queue."
            penalty_weight = 1.0
        elif anomaly_score < self.config.organic_threshold:
            action = "PASS_ORGANIC"
            desc = "Organic propagation dynamics verified. Standard pipeline processing."
            penalty_weight = 0.0
        else:
            action = "FLAG_ELEVATED"
            desc = "Marginal anomaly detected. Dispatched to Neo4j with elevated verification threshold."
            # Normalized penalty within [0.50, 0.65] range
            penalty_weight = (anomaly_score - self.config.organic_threshold) / (
                self.config.flagged_threshold - self.config.organic_threshold
            )

        return action, {
            "action": action,
            "anomaly_score": anomaly_score,
            "penalty_weight": penalty_weight,
            "description": desc,
        }
