"""
Phase 3: Spatio-Temporal Graph Neural Network (STGNN).
Implements localized first-order spectral graph convolutions Z^{(l)} = D~^{-1/2} A~ D~^{-1/2} H^{(l)} W_S^{(l)}
and Gated Temporal Convolutions (GLU) Phi(Y) = (Y * Theta_1 + b_1) odot sigma(Y * Theta_2 + b_2).
"""

from __future__ import annotations
from typing import Tuple, List, Optional
import numpy as np
from savi.config import STGNNConfig, settings


def sigmoid(x: np.ndarray) -> np.ndarray:
    """Numerically stable sigmoid function."""
    return np.where(
        x >= 0,
        1.0 / (1.0 + np.exp(-x)),
        np.exp(x) / (1.0 + np.exp(x)),
    )


class SpectralGraphConvolutionLayer:
    """
    First-order spectral spatial graph convolution:
    Z = \tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H W_S
    """
    def __init__(self, in_features: int, out_features: int, seed: int = 42):
        self.in_features = in_features
        self.out_features = out_features
        rng = np.random.default_rng(seed)
        scale = np.sqrt(2.0 / (in_features + out_features))
        self.w_s = rng.normal(0, scale, (in_features, out_features)).astype(np.float32)
        self.bias = np.zeros((out_features,), dtype=np.float32)

    def normalize_adjacency(self, A: np.ndarray) -> np.ndarray:
        r"""
        Computes symmetric normalized adjacency: \tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2}
        with self-loops: \tilde{A} = A + I_N
        """
        n = A.shape[0]
        a_tilde = A + np.eye(n, dtype=np.float32)
        d_tilde = np.sum(a_tilde, axis=1)

        # d_tilde^{-1/2}
        d_inv_sqrt = np.power(d_tilde, -0.5, where=(d_tilde > 0), out=np.zeros_like(d_tilde))
        d_inv_sqrt[d_tilde <= 0] = 0.0

        d_mat_inv_sqrt = np.diag(d_inv_sqrt)
        norm_adj = np.dot(np.dot(d_mat_inv_sqrt, a_tilde), d_mat_inv_sqrt)
        return norm_adj.astype(np.float32)

    def forward(self, H: np.ndarray, A: np.ndarray) -> np.ndarray:
        """
        H: Node features matrix of shape (N, in_features)
        A: Adjacency matrix of shape (N, N)
        Returns: Z of shape (N, out_features)
        """
        norm_a = self.normalize_adjacency(A)
        # Spatial aggregation: \tilde{D}^{-1/2} \tilde{A} \tilde{D}^{-1/2} H
        agg = np.dot(norm_a, H)
        # Linear transformation + bias: agg * W_S + b
        z = np.dot(agg, self.w_s) + self.bias
        # ReLU non-linearity
        return np.maximum(0.0, z)


class GatedTemporalConvolutionLayer:
    r"""
    Gated Temporal Convolution (GLU):
    \Phi(Y) = (Y * \Theta_1 + b_1) \odot \sigma(Y * \Theta_2 + b_2)
    where Y \in \mathbb{R}^{M \times C_i} is the sequence of historical node embeddings.
    """
    def __init__(self, in_channels: int, out_channels: int, kernel_size: int = 3, seed: int = 42):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size
        rng = np.random.default_rng(seed)

        scale = np.sqrt(2.0 / (kernel_size * in_channels + out_channels))
        # Convolution kernels for candidate and gate
        self.theta_1 = rng.normal(0, scale, (kernel_size, in_channels, out_channels)).astype(np.float32)
        self.b_1 = np.zeros((out_channels,), dtype=np.float32)

        self.theta_2 = rng.normal(0, scale, (kernel_size, in_channels, out_channels)).astype(np.float32)
        self.b_2 = np.zeros((out_channels,), dtype=np.float32)

    def causal_conv_1d(self, Y: np.ndarray, theta: np.ndarray, bias: np.ndarray) -> np.ndarray:
        """
        1D causal convolution across temporal sequence:
        Y: shape (M, C_in)
        theta: shape (kernel_size, C_in, C_out)
        bias: shape (C_out,)
        Returns: shape (M, C_out)
        """
        m, c_in = Y.shape
        c_out = theta.shape[2]
        k = self.kernel_size

        # Left-pad sequence with zeros for causal convolution
        padded_y = np.pad(Y, ((k - 1, 0), (0, 0)), mode="constant", constant_values=0.0)
        output = np.zeros((m, c_out), dtype=np.float32)

        for t in range(m):
            # Window slice of length k
            window = padded_y[t : t + k, :]  # shape (k, C_in)
            # Element-wise product and contraction over kernel and channels
            val = np.sum(window[:, :, None] * theta, axis=(0, 1)) + bias
            output[t] = val

        return output

    def forward(self, Y: np.ndarray) -> np.ndarray:
        r"""
        Applies Gated Temporal Convolution (GLU):
        \Phi(Y) = (Y * \Theta_1 + b_1) \odot \sigma(Y * \Theta_2 + b_2)
        """
        candidate = self.causal_conv_1d(Y, self.theta_1, self.b_1)
        gate = sigmoid(self.causal_conv_1d(Y, self.theta_2, self.b_2))
        # Hadamard product
        return candidate * gate


class SpatioTemporalGNN:
    r"""
    Composite Spatio-Temporal Graph Neural Network (STGNN).
    Alternates spatial spectral graph convolutions with temporal GLU convolutions.
    Yields dynamic node embedding matrix H_{ST} \in \mathbb{R}^{N \times d}.
    """
    def __init__(self, config: STGNNConfig = settings.stgnn):
        self.config = config
        self.spatial_layer_1 = SpectralGraphConvolutionLayer(
            in_features=config.feature_dim,
            out_features=config.hidden_dim,
            seed=101,
        )
        self.temporal_glu = GatedTemporalConvolutionLayer(
            in_channels=config.hidden_dim,
            out_channels=config.hidden_dim,
            kernel_size=config.temporal_kernel_size,
            seed=202,
        )
        self.spatial_layer_2 = SpectralGraphConvolutionLayer(
            in_features=config.hidden_dim,
            out_features=config.feature_dim,
            seed=303,
        )

    def forward(
        self,
        node_features_history: np.ndarray,
        adjacency_matrix: np.ndarray,
    ) -> np.ndarray:
        """
        node_features_history: shape (M, N, feature_dim) where M is number of time steps, N nodes
        adjacency_matrix: shape (N, N)
        Returns: dynamic embedding H_ST of shape (N, feature_dim)
        """
        m_timesteps, n_nodes, f_dim = node_features_history.shape

        # Step 1: Spatial convolution across each time slice
        spatial_embeddings_seq = np.zeros((m_timesteps, n_nodes, self.config.hidden_dim), dtype=np.float32)
        for t in range(m_timesteps):
            h_t = node_features_history[t]
            spatial_embeddings_seq[t] = self.spatial_layer_1.forward(h_t, adjacency_matrix)

        # Step 2: Temporal GLU across each node's trajectory
        temporal_embeddings = np.zeros((n_nodes, self.config.hidden_dim), dtype=np.float32)
        for i in range(n_nodes):
            node_seq = spatial_embeddings_seq[:, i, :]  # shape (M, hidden_dim)
            glu_out = self.temporal_glu.forward(node_seq)
            # Take latest causal state
            temporal_embeddings[i] = glu_out[-1]

        # Step 3: Final spatial projection to feature_dim
        h_st = self.spatial_layer_2.forward(temporal_embeddings, adjacency_matrix)
        return h_st
