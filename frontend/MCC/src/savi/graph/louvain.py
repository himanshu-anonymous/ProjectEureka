"""
Phase 3: Louvain Modularity Optimization Algorithm for Community Detection.
Implements modularity metric Q and multi-platform sub-network partitioning.
"""

from __future__ import annotations
from typing import Dict, List, Set, Tuple, Any
import networkx as nx
import numpy as np


def compute_modularity_q(graph: nx.Graph, communities: Dict[Any, int]) -> float:
    """
    Computes Louvain modularity Q according to the SAVI specification:
    Q = (1 / 2m) * sum_{i, j} [ A_{ij} - (k_i * k_j) / (2m) ] * delta(c_i, c_j)
    """
    m = graph.size(weight="weight")
    if m <= 0.0:
        return 0.0

    nodes = list(graph.nodes())
    degrees = dict(graph.degree(weight="weight"))
    two_m = 2.0 * m
    q_sum = 0.0

    # Group nodes by community for efficient computation
    community_to_nodes: Dict[int, List[Any]] = {}
    for node, comm in communities.items():
        community_to_nodes.setdefault(comm, []).append(node)

    for comm_id, member_nodes in community_to_nodes.items():
        subgraph = graph.subgraph(member_nodes)
        # Sum of internal edge weights: sum_{i,j in C} A_{ij}
        internal_edges_weight = 2.0 * subgraph.size(weight="weight")
        # Sum of degrees: sum_{i in C} k_i
        total_deg = sum(degrees.get(n, 0.0) for n in member_nodes)

        q_sum += internal_edges_weight - (total_deg * total_deg) / two_m

    return float(q_sum / two_m)


class LouvainCommunityDetector:
    """
    Identifies coordinated informational sub-networks, bot rings,
    and cross-platform echo chambers using Louvain modularity optimization.
    """
    def __init__(self, resolution: float = 1.0, seed: int = 42):
        self.resolution = resolution
        self.seed = seed

    def detect_communities(self, graph: nx.Graph) -> Tuple[Dict[Any, int], float]:
        """
        Executes Louvain community partitioning on input graph.
        Returns: (node_to_community_map, modularity_score_Q)
        """
        if graph.number_of_nodes() == 0:
            return {}, 0.0

        if graph.number_of_edges() == 0:
            # Each node in its own community
            return {node: idx for idx, node in enumerate(graph.nodes())}, 0.0

        # Ensure edge weights exist
        for u, v, d in graph.edges(data=True):
            if "weight" not in d:
                d["weight"] = 1.0

        communities_generator = nx.community.louvain_communities(
            graph,
            weight="weight",
            resolution=self.resolution,
            seed=self.seed,
        )

        node_to_comm: Dict[Any, int] = {}
        for comm_idx, comm_set in enumerate(communities_generator):
            for node in comm_set:
                node_to_comm[node] = comm_idx

        # Calculate modularity Q
        q_score = compute_modularity_q(graph, node_to_comm)
        return node_to_comm, q_score
