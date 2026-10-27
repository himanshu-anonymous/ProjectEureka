"""
Proximal Policy Optimization (PPO) Controller for Adaptive Scraping Ingestion.
Implements Actor-Critic network, Generalized Advantage Estimation (GAE),
and clipped surrogate objective L^{CLIP}(theta).
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Tuple, Dict, Any
import numpy as np
from savi.config import PPOConfig, settings
from savi.ingestion.mdp_env import ScraperAction


@dataclass
class TrajectoryBatch:
    states: List[np.ndarray] = field(default_factory=list)
    actions: List[int] = field(default_factory=list)
    rewards: List[float] = field(default_factory=list)
    values: List[float] = field(default_factory=list)
    log_probs: List[float] = field(default_factory=list)
    dones: List[bool] = field(default_factory=list)

    def clear(self) -> None:
        self.states.clear()
        self.actions.clear()
        self.rewards.clear()
        self.values.clear()
        self.log_probs.clear()
        self.dones.clear()

    def __len__(self) -> int:
        return len(self.states)


class ActorCriticNetwork:
    """
    Two-layer shared feature representation with separate policy (Actor)
    and value function (Critic) heads. Implemented using vectorized NumPy.
    """
    def __init__(self, state_dim: int = 6, action_dim: int = 6, hidden_dim: int = 64):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.hidden_dim = hidden_dim

        # Xavier / He weight initialization
        rng = np.random.default_rng(42)
        scale_shared = np.sqrt(2.0 / (state_dim + hidden_dim))
        self.w_shared = rng.normal(0, scale_shared, (state_dim, hidden_dim)).astype(np.float32)
        self.b_shared = np.zeros((hidden_dim,), dtype=np.float32)

        scale_policy = np.sqrt(2.0 / (hidden_dim + action_dim))
        self.w_policy = rng.normal(0, scale_policy, (hidden_dim, action_dim)).astype(np.float32)
        self.b_policy = np.zeros((action_dim,), dtype=np.float32)

        scale_value = np.sqrt(2.0 / (hidden_dim + 1))
        self.w_value = rng.normal(0, scale_value, (hidden_dim, 1)).astype(np.float32)
        self.b_value = np.zeros((1,), dtype=np.float32)

    def forward(self, state: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Forward pass:
        state: shape (state_dim,) or (batch_size, state_dim)
        Returns: (action_probabilities, state_value)
        """
        if state.ndim == 1:
            x = np.maximum(0.0, np.dot(state, self.w_shared) + self.b_shared)  # ReLU
            logits = np.dot(x, self.w_policy) + self.b_policy
            # Numerically stable Softmax
            exp_logits = np.exp(logits - np.max(logits))
            probs = exp_logits / np.sum(exp_logits)
            value = float(np.dot(x, self.w_value)[0] + self.b_value[0])
            return probs, value
        else:
            x = np.maximum(0.0, np.dot(state, self.w_shared) + self.b_shared)
            logits = np.dot(x, self.w_policy) + self.b_policy
            exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
            probs = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)
            values = np.dot(x, self.w_value) + self.b_value
            return probs, values.flatten()


class PPOController:
    """
    PPO Policy Optimization Controller managing exploration, advantage estimation,
    and clipped surrogate gradient updates.
    """
    def __init__(self, config: PPOConfig = settings.ppo):
        self.config = config
        self.network = ActorCriticNetwork(
            state_dim=config.state_dim,
            action_dim=config.action_dim,
            hidden_dim=64,
        )
        self.memory = TrajectoryBatch()

    def select_action(self, state: np.ndarray, deterministic: bool = False) -> Tuple[int, float, float]:
        """
        Selects an action a_t given state s_t.
        Returns: (action, log_prob, value)
        """
        probs, value = self.network.forward(state)
        # Avoid division by zero in log
        probs = np.clip(probs, 1e-8, 1.0)
        probs /= np.sum(probs)

        if deterministic:
            action = int(np.argmax(probs))
        else:
            action = int(np.random.choice(self.config.action_dim, p=probs))

        log_prob = float(np.log(probs[action]))
        return action, log_prob, value

    def store_transition(
        self,
        state: np.ndarray,
        action: int,
        reward: float,
        value: float,
        log_prob: float,
        done: bool,
    ) -> None:
        self.memory.states.append(state)
        self.memory.actions.append(action)
        self.memory.rewards.append(reward)
        self.memory.values.append(value)
        self.memory.log_probs.append(log_prob)
        self.memory.dones.append(done)

    def compute_gae(
        self,
        rewards: List[float],
        values: List[float],
        dones: List[bool],
        next_value: float,
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Calculates Generalized Advantage Estimator (GAE) across operational scraping epochs:
        delta_t = r_t + gamma * V(s_{t+1}) * (1 - done) - V(s_t)
        A_t = sum_{l=0}^inf (gamma * lambda)^l delta_{t+l}
        """
        n_steps = len(rewards)
        advantages = np.zeros(n_steps, dtype=np.float32)
        returns = np.zeros(n_steps, dtype=np.float32)
        gae = 0.0

        for t in reversed(range(n_steps)):
            is_last = (t == n_steps - 1)
            v_next = next_value if is_last else values[t + 1]
            non_terminal = 0.0 if dones[t] else 1.0

            delta = rewards[t] + self.config.gamma * v_next * non_terminal - values[t]
            gae = delta + self.config.gamma * self.config.gae_lambda * non_terminal * gae
            advantages[t] = gae
            returns[t] = advantages[t] + values[t]

        # Normalize advantages for training stability
        adv_mean = np.mean(advantages)
        adv_std = np.std(advantages) + 1e-8
        norm_advantages = (advantages - adv_mean) / adv_std
        return norm_advantages, returns

    def update(self, next_state: np.ndarray) -> Dict[str, float]:
        """
        Executes PPO update epoch using clipped surrogate objective:
        L^{CLIP}(theta) = E [ min( r_t(theta)*A_t, clip(r_t(theta), 1-eps, 1+eps)*A_t ) ]
        """
        if len(self.memory) == 0:
            return {"policy_loss": 0.0, "value_loss": 0.0}

        _, next_value = self.network.forward(next_state)
        advantages, returns = self.compute_gae(
            self.memory.rewards,
            self.memory.values,
            self.memory.dones,
            next_value,
        )

        states = np.array(self.memory.states, dtype=np.float32)
        actions = np.array(self.memory.actions, dtype=np.int32)
        old_log_probs = np.array(self.memory.log_probs, dtype=np.float32)

        total_policy_loss = 0.0
        total_value_loss = 0.0
        n_epochs = self.config.epochs_per_update
        lr = self.config.learning_rate
        eps = self.config.clip_epsilon

        # Perform mini-batch gradient updates
        for _ in range(n_epochs):
            # Forward pass over full batch
            x_shared = np.maximum(0.0, np.dot(states, self.network.w_shared) + self.network.b_shared)
            logits = np.dot(x_shared, self.network.w_policy) + self.network.b_policy
            exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
            probs = exp_logits / (np.sum(exp_logits, axis=1, keepdims=True) + 1e-8)
            curr_values = (np.dot(x_shared, self.network.w_value) + self.network.b_value).flatten()

            # Probability ratio: r_t(theta) = pi_theta(a_t | s_t) / pi_theta_old(a_t | s_t)
            batch_indices = np.arange(len(actions))
            selected_probs = np.clip(probs[batch_indices, actions], 1e-8, 1.0)
            curr_log_probs = np.log(selected_probs)
            ratios = np.exp(curr_log_probs - old_log_probs)

            # Clipped surrogate objective
            surr1 = ratios * advantages
            surr2 = np.clip(ratios, 1.0 - eps, 1.0 + eps) * advantages
            policy_loss = -np.mean(np.minimum(surr1, surr2))

            # Value function loss (MSE)
            value_loss = 0.5 * np.mean((returns - curr_values) ** 2)

            total_policy_loss += float(policy_loss)
            total_value_loss += float(value_loss)

            # Approximate policy gradient step
            # Grad w.r.t logits for policy:
            d_logits = probs.copy()
            d_logits[batch_indices, actions] -= 1.0
            # Scale by advantage direction
            d_logits *= (advantages[:, None] / len(actions))

            grad_w_policy = np.dot(x_shared.T, d_logits)
            grad_b_policy = np.sum(d_logits, axis=0)

            # Grad w.r.t value head:
            d_values = -(returns - curr_values)[:, None] / len(actions)
            grad_w_value = np.dot(x_shared.T, d_values)
            grad_b_value = np.sum(d_values, axis=0)

            # Gradient descent update with parameter bounds
            self.network.w_policy -= lr * np.clip(grad_w_policy, -1.0, 1.0)
            self.network.b_policy -= lr * np.clip(grad_b_policy, -1.0, 1.0)
            self.network.w_value -= lr * np.clip(grad_w_value, -1.0, 1.0)
            self.network.b_value -= lr * np.clip(grad_b_value, -1.0, 1.0)

        # Clear batch memory
        self.memory.clear()

        return {
            "policy_loss": total_policy_loss / n_epochs,
            "value_loss": total_value_loss / n_epochs,
        }
