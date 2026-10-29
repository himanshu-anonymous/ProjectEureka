r"""
Phase 4: SAVI Analytical Formulation Matrix.
Implements the four foundational platform metrics:
- S: Sentiment Dynamics: S_{dyn}(t) = \int_0^t ( \nabla S_{plat}(\tau) \cdot e^{-\lambda(t-\tau)} ) d\tau
- A: Factual Accuracy: A_{score} = \mu_{topo} \cdot P(C_{ent}) \cdot (1 - 1 / \sum W_{authority})
- V: Logical Validation: V_{index} = 1.0 - ( (\kappa_{contradictions} + s(x, n)) / 2 )
- I: News Impact Index: I_{impact} = \sum_{m \in M} ( E_n^{(m)} \cdot C_B(m) ) \cdot (d\mathcal{V} / dt)
"""

from __future__ import annotations
import math
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from savi.config import SAVIMetricsConfig, settings


@dataclass
class SAVIMetricsResult:
    sentiment_score: float      # S_{dyn} \in [-1.0, 1.0]
    accuracy_rating: float      # A_{score} \in [0.0, 1.0]
    validation_index: float     # V_{index} \in [0.0, 1.0]
    impact_ranking: float       # I_{impact} >= 0.0
    anomaly_metric: float       # s(x, n) \in [0.0, 1.0]

    def to_dict(self) -> Dict[str, float]:
        return {
            "sentiment_score": round(self.sentiment_score, 4),
            "accuracy_rating": round(self.accuracy_rating, 4),
            "validation_index": round(self.validation_index, 4),
            "impact_ranking": round(self.impact_ranking, 4),
            "anomaly_metric": round(self.anomaly_metric, 4),
        }


class SAVIEngine:
    """Computes the complete SAVI analytical formulation matrix."""
    def __init__(self, config: SAVIMetricsConfig = settings.metrics):
        self.config = config

    def compute_sentiment_dynamics(
        self,
        sentiment_trajectory: List[Tuple[float, float]],  # List of (timestamp_tau, sentiment_val)
        current_time_t: float,
    ) -> float:
        r"""
        S_{dyn}(t) = \int_{0}^t ( \nabla \vec{S}_{plat}(\tau) \cdot e^{-\lambda(t-\tau)} ) d\tau
        Tracks directional drift and velocity of affective polarity, penalizing decayed historic states.
        """
        if len(sentiment_trajectory) < 2:
            return float(sentiment_trajectory[0][1]) if sentiment_trajectory else 0.0

        lambda_decay = self.config.sentiment_decay_lambda
        integral_sum = 0.0

        for i in range(1, len(sentiment_trajectory)):
            tau_prev, s_prev = sentiment_trajectory[i - 1]
            tau_curr, s_curr = sentiment_trajectory[i]

            delta_tau = max(1e-4, tau_curr - tau_prev)
            # Gradient \nabla S_{plat}
            grad_s = (s_curr - s_prev) / delta_tau

            # Temporal decay factor e^{-\lambda(t - \tau)}
            tau_mid = (tau_prev + tau_curr) / 2.0
            decay_factor = math.exp(-lambda_decay * max(0.0, current_time_t - tau_mid))

            # Riemann integration increment
            integral_sum += grad_s * decay_factor * delta_tau

        # Bound dynamic drift to [-1.0, 1.0]
        return float(np.tanh(integral_sum))

    def compute_factual_accuracy(
        self,
        mu_topo: float,                 # Topological convergence [0, 1]
        p_entailment: float,            # P(\mathcal{C}_{ent}) from Open JEV [0, 1]
        authority_weights: List[float], # W_{authority} list of corroborating nodes
    ) -> float:
        r"""
        A_{score} = \mu_{topo} \cdot P(\mathcal{C}_{ent}) \cdot (1 - \frac{1}{\sum W_{authority}})
        Measures cross-platform topological convergence scaled by Open JEV entailment and authority.
        """
        sum_w = max(1.001, sum(authority_weights))
        authority_scaling = 1.0 - (1.0 / sum_w)

        a_score = mu_topo * p_entailment * authority_scaling
        return float(np.clip(a_score, 0.0, 1.0))

    def compute_logical_validation(
        self,
        kappa_contradictions: float,    # Contradiction factor [0, 1]
        anomaly_score_s: float,         # Isolation Rainforest score s(x, n) [0, 1]
    ) -> float:
        r"""
        V_{index} = 1.0 - ( (\kappa_{contradictions} + s(\vec{x}, n)) / 2 )
        Audits structural coherence against Isolation Rainforest anomaly score to penalize bot manipulation.
        """
        penalty = (kappa_contradictions + anomaly_score_s) / 2.0
        v_index = 1.0 - penalty
        return float(np.clip(v_index, 0.0, 1.0))

    def compute_news_impact_index(
        self,
        platform_engagements: Dict[str, float],      # Platform -> normalized engagement E_n^{(m)}
        betweenness_centralities: Dict[str, float],  # Platform -> betweenness centrality C_B(m)
        transmission_velocity: float,               # d\mathcal{V} / dt (rate of propagation)
    ) -> float:
        r"""
        I_{impact} = \sum_{m \in \mathcal{M}} ( E_n^{(m)} \cdot \mathcal{C}_B(m) ) \cdot \frac{d\mathcal{V}}{dt}
        Quantifies global propagation reach via normalized engagement, betweenness centrality, and transmission velocity.
        """
        weighted_reach = 0.0
        for m, e_norm in platform_engagements.items():
            cb = betweenness_centralities.get(m, 0.1)
            weighted_reach += e_norm * cb

        impact = weighted_reach * max(0.01, transmission_velocity)
        return float(max(0.0, impact))

    def evaluate(
        self,
        sentiment_trajectory: List[Tuple[float, float]],
        current_time_t: float,
        mu_topo: float,
        p_entailment: float,
        authority_weights: List[float],
        kappa_contradictions: float,
        anomaly_score_s: float,
        platform_engagements: Dict[str, float],
        betweenness_centralities: Dict[str, float],
        transmission_velocity: float,
    ) -> SAVIMetricsResult:
        s_dyn = self.compute_sentiment_dynamics(sentiment_trajectory, current_time_t)
        a_score = self.compute_factual_accuracy(mu_topo, p_entailment, authority_weights)
        v_index = self.compute_logical_validation(kappa_contradictions, anomaly_score_s)
        i_impact = self.compute_news_impact_index(
            platform_engagements,
            betweenness_centralities,
            transmission_velocity,
        )

        return SAVIMetricsResult(
            sentiment_score=s_dyn,
            accuracy_rating=a_score,
            validation_index=v_index,
            impact_ranking=i_impact,
            anomaly_metric=anomaly_score_s,
        )
