"""
Unit tests for Phase 3: Graph Structuring, Louvain, STGNN, and Open JEV.
"""

import numpy as np
import networkx as nx
import pytest
from savi.graph.triplet_extractor import OpenIEExtractor, Triplet
from savi.graph.louvain import LouvainCommunityDetector, compute_modularity_q
from savi.graph.stgnn import SpatioTemporalGNN, SpectralGraphConvolutionLayer, GatedTemporalConvolutionLayer
from savi.graph.open_jev import OpenJEVLogicEngine, JEVClass


def test_triplet_extraction():
    extractor = OpenIEExtractor()
    text = "Independent audit confirms anomalous transactions across platform records. Regulatory agency restricts foreign exchange."
    triplets = extractor.extract_triplets(text)

    assert len(triplets) >= 2
    preds = [t.predicate for t in triplets]
    assert "confirms" in preds or "restricts" in preds


def test_louvain_modularity_computation():
    # Construct a simple graph with two distinct cliques
    G = nx.Graph()
    G.add_edge("A1", "A2", weight=1.0)
    G.add_edge("A2", "A3", weight=1.0)
    G.add_edge("A1", "A3", weight=1.0)

    G.add_edge("B1", "B2", weight=1.0)
    G.add_edge("B2", "B3", weight=1.0)
    G.add_edge("B1", "B3", weight=1.0)

    # Weak bridge between cliques
    G.add_edge("A3", "B1", weight=0.1)

    detector = LouvainCommunityDetector()
    comm_map, q_score = detector.detect_communities(G)

    assert len(comm_map) == 6
    # Modularity Q should be positive and substantial for well-separated cliques
    assert q_score > 0.20


def test_stgnn_spectral_and_temporal_convolution():
    stgnn = SpatioTemporalGNN()

    # 4 time steps, 5 nodes, 32 feature dimensions
    m_time = 4
    n_nodes = 5
    f_dim = 32

    rng = np.random.default_rng(42)
    node_history = rng.normal(0, 1.0, (m_time, n_nodes, f_dim)).astype(np.float32)

    # Adjacency matrix for 5-node cycle
    A = np.zeros((n_nodes, n_nodes), dtype=np.float32)
    for i in range(n_nodes):
        A[i, (i + 1) % n_nodes] = 1.0
        A[(i + 1) % n_nodes, i] = 1.0

    # Forward pass
    h_st = stgnn.forward(node_history, A)

    assert h_st.shape == (n_nodes, f_dim)
    assert not np.isnan(h_st).any()


def test_open_jev_logic_engine():
    jev = OpenJEVLogicEngine(embedding_dim=32)

    claim = Triplet(subject="Regulatory Body", predicate="confirms", object="Compliance Breach")
    evidence_supporting = [
        Triplet(subject="Regulatory Body", predicate="confirms", object="Compliance Breach"),
        Triplet(subject="Official Ledger", predicate="confirms", object="Audit Report"),
    ]

    verdict_ent = jev.verify_claim(claim, evidence_supporting)
    assert verdict_ent.p_entailment > verdict_ent.p_contradiction
    assert verdict_ent.predicted_class == "Entailment"

    # Evidence contradicting
    evidence_contradicting = [
        Triplet(subject="Regulatory Body", predicate="contradicts", object="Compliance Breach")
    ]
    verdict_con = jev.verify_claim(claim, evidence_contradicting)
    assert verdict_con.p_contradiction > 0.30

    # No evidence -> Neutral prior elevated
    verdict_neu = jev.verify_claim(claim, [])
    assert verdict_neu.p_neutral > 0.40
