"""
Configuration module for SAVI (Sentiment, Accuracy, Validation, Impact) Platform.
Contains hyperparameter defaults, network topologies, API credentials, and service settings.
"""

import os
from typing import List, Tuple, Optional
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load local environment variables from .env
load_dotenv()


class APICredentialsConfig(BaseModel):
    """Live API credentials and paired key rotation registry for external model endpoints."""
    firecrawl_api_key: str = Field(default_factory=lambda: os.getenv("FIRECRAWL_API_KEY", ""))
    gemma_api_key: str = Field(default_factory=lambda: os.getenv("GEMMA_API_KEY", os.getenv("GEMINI_API_KEY", "")))
    gemma_api_key_2: str = Field(default_factory=lambda: os.getenv("GEMMA_API_KEY_2", os.getenv("GEMINI_API_KEY_2", "")))
    gemma_model: str = Field(default_factory=lambda: os.getenv("GEMMA_MODEL", "gemma-4"))
    gemini_api_key: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY", os.getenv("GEMMA_API_KEY", "")))
    gemini_api_key_2: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY_2", os.getenv("GEMMA_API_KEY_2", "")))
    gemini_model: str = Field(default_factory=lambda: os.getenv("GEMINI_MODEL", "gemini-flash-latest"))
    openai_api_key: str = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY", ""))
    openai_chat_model: str = Field(default_factory=lambda: os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini"))
    apify_api_key: str = Field(default_factory=lambda: os.getenv("APIFY_API_KEY", os.getenv("APIFY_TOKEN", "")))
    apify_token: str = Field(default_factory=lambda: os.getenv("APIFY_TOKEN", os.getenv("APIFY_API_KEY", "")))
    youtube_api_key: str = Field(default_factory=lambda: os.getenv("YOUTUBE_API_KEY", ""))
    open_jev_server_url: str = Field(default_factory=lambda: os.getenv("OPEN_JEV_SERVER_URL", "http://127.0.0.1:8791"))
    open_jev_model_id: str = Field(default_factory=lambda: os.getenv("OPEN_JEV_MODEL_ID", "ZefanCai/Open-Jev-27B-v1.1"))
    open_jev_temperature: float = Field(default_factory=lambda: float(os.getenv("OPEN_JEV_TEMPERATURE", "0.7")))

    def get_gemma_key(self, index: int = 0) -> str:
        """Returns Gemma key for the given rotation index (0: primary, 1: secondary)."""
        if index == 1 and (self.gemma_api_key_2 or self.gemini_api_key_2):
            return self.gemma_api_key_2 or self.gemini_api_key_2
        return self.gemma_api_key or self.gemini_api_key or self.gemma_api_key_2 or self.gemini_api_key_2

    def rotate_gemma_key(self, current_index: int) -> Tuple[int, str]:
        """Toggles between primary (0) and secondary (1) Gemma API keys."""
        new_index = 1 if current_index == 0 else 0
        return new_index, self.get_gemma_key(new_index)

    def get_gemini_key(self, index: int = 0) -> str:
        """Backwards compatibility alias for get_gemma_key."""
        return self.get_gemma_key(index)

    def rotate_gemini_key(self, current_index: int) -> Tuple[int, str]:
        """Backwards compatibility alias for rotate_gemma_key."""
        return self.rotate_gemma_key(current_index)


class HermesAgentConfig(BaseModel):
    """Configuration for NousResearch Hermes Agent integration."""
    model_id: str = Field(default_factory=lambda: os.getenv("HERMES_MODEL_ID", "NousResearch/Hermes-3-Llama-3.1-8B"))
    server_url: Optional[str] = Field(default_factory=lambda: os.getenv("HERMES_SERVER_URL", None))
    max_steps: int = Field(default_factory=lambda: int(os.getenv("HERMES_MAX_STEPS", "8")))
    temperature: float = Field(default_factory=lambda: float(os.getenv("HERMES_TEMPERATURE", "0.7")))
    memory_store_path: str = Field(default_factory=lambda: os.getenv("HERMES_MEMORY_PATH", "data/hermes_memory.json"))


class PPOConfig(BaseModel):
    """Hyperparameters for PPO Reinforcement Learning Scraper Controller."""
    # State dimension: [inter_request_delay, proxy_health, kappa_429, latency, dom_drift, quota_remaining]
    state_dim: int = 6
    action_dim: int = 6
    gamma: float = 0.99
    gae_lambda: float = 0.95
    clip_epsilon: float = 0.20
    learning_rate: float = 0.0003
    value_coef: float = 0.50
    entropy_coef: float = 0.01
    epochs_per_update: int = 4
    batch_size: int = 32

    # Reward function weights: R_t = w1*V_valid - w2*E_429 - w3*(L_ms/1000) - w4*C_captcha - w5*I_ban
    # Hierarchy: w5 >> w2 > w4 >> w1 > w3
    w1_valid: float = 2.0
    w2_rate_limit: float = 15.0
    w3_latency: float = 0.5
    w4_captcha: float = 10.0
    w5_ban: float = 50.0

    # Step size for delay adjustments (ms)
    delta_t_ms: float = 250.0
    min_delay_ms: float = 50.0
    max_delay_ms: float = 10000.0
    soft_backoff_duration_s: float = 30.0


class IsolationRainforestConfig(BaseModel):
    """Hyperparameters for Extended Isolation Forest (Isolation Rainforest)."""
    n_trees: int = 100
    subsample_size: int = 256
    dimension: int = 6  # Engagement, account age, token perplexity, velocity gradient, etc.
    organic_threshold: float = 0.50
    flagged_threshold: float = 0.65  # [0.50, 0.65] = elevated review, > 0.65 = quarantine


class PipelineConfig(BaseModel):
    """Dynamic DAG Router & Orchestration settings."""
    macro_cascade_window_seconds: float = 900.0  # 15 minutes window for cross-platform grouping
    velocity_threshold: float = 1.5  # Acceleration threshold for macro routing
    batch_flush_interval_seconds: float = 5.0


class STGNNConfig(BaseModel):
    """Spatio-Temporal Graph Neural Network Configuration."""
    feature_dim: int = 32
    hidden_dim: int = 64
    temporal_kernel_size: int = 3
    num_st_blocks: int = 2
    dropout: float = 0.1


class SAVIMetricsConfig(BaseModel):
    """SAVI Analytical Suite hyperparameters."""
    sentiment_decay_lambda: float = 0.10  # Exponential decay for historic affective states
    base_authority_weight: float = 1.0


class DatabaseConfig(BaseModel):
    """Persistence and Graph Database configuration."""
    postgres_host: str = Field(default_factory=lambda: os.getenv("SAVI_POSTGRES_HOST", "localhost"))
    postgres_port: int = Field(default_factory=lambda: int(os.getenv("SAVI_POSTGRES_PORT", "5433")))
    postgres_db: str = Field(default_factory=lambda: os.getenv("SAVI_POSTGRES_DB", "savi_master"))
    postgres_user: str = Field(default_factory=lambda: os.getenv("SAVI_POSTGRES_USER", "savi_admin"))
    postgres_password: str = Field(default_factory=lambda: os.getenv("SAVI_POSTGRES_PASSWORD", "savi_secret"))

    neo4j_uri: str = Field(default_factory=lambda: os.getenv("SAVI_NEO4J_URI", "bolt://localhost:7687"))
    neo4j_user: str = Field(default_factory=lambda: os.getenv("SAVI_NEO4J_USER", "neo4j"))
    neo4j_password: str = Field(default_factory=lambda: os.getenv("SAVI_NEO4J_PASSWORD", "savi_graph_secret"))


class SAVIConfig(BaseModel):
    """Unified Platform Configuration."""
    credentials: APICredentialsConfig = Field(default_factory=APICredentialsConfig)
    ppo: PPOConfig = Field(default_factory=PPOConfig)
    rainforest: IsolationRainforestConfig = Field(default_factory=IsolationRainforestConfig)
    pipeline: PipelineConfig = Field(default_factory=PipelineConfig)
    stgnn: STGNNConfig = Field(default_factory=STGNNConfig)
    metrics: SAVIMetricsConfig = Field(default_factory=SAVIMetricsConfig)
    db: DatabaseConfig = Field(default_factory=DatabaseConfig)
    hermes: HermesAgentConfig = Field(default_factory=HermesAgentConfig)


# Default global settings instance
settings = SAVIConfig()
