"""
Canonical data models for Phase 1 Ingestion and Phase 2 Pipeline Routing.
"""

from __future__ import annotations
import hashlib
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AuthorMetadata(BaseModel):
    author_id: str
    username: str
    account_age_days: float = 0.0
    followers_count: int = 0
    following_count: int = 0
    is_verified: bool = False
    flair: Optional[str] = None

    @property
    def follower_following_ratio(self) -> float:
        return self.followers_count / max(1, self.following_count)


class EngagementMetrics(BaseModel):
    views: int = 0
    upvotes: int = 0
    downvotes: int = 0
    shares: int = 0  # Retweets, reposts
    replies: int = 0
    quote_count: int = 0
    propagation_velocity: float = 0.0  # Actions per minute

    @property
    def upvote_ratio(self) -> float:
        total = self.upvotes + self.downvotes
        return self.upvotes / total if total > 0 else 1.0


class MultimodalData(BaseModel):
    captions: Optional[str] = None
    transcript_segments: List[Dict[str, Any]] = Field(default_factory=list)
    keyframe_embeddings: List[List[float]] = Field(default_factory=list)
    audio_sentiment_score: Optional[float] = None


class ScrapedPayload(BaseModel):
    content_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    canonical_hash: str = ""
    origin_platform: str  # 'web', 'reddit', 'twitter', 'youtube'
    headline_or_title: str
    sanitized_body: str
    author: AuthorMetadata
    published_timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    citations: List[str] = Field(default_factory=list)
    engagement: EngagementMetrics = Field(default_factory=EngagementMetrics)
    multimodal: Optional[MultimodalData] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def model_post_init(self, __context: Any) -> None:
        if not self.canonical_hash:
            raw_repr = f"{self.origin_platform}:{self.headline_or_title}:{self.sanitized_body[:200]}"
            self.canonical_hash = hashlib.sha256(raw_repr.encode("utf-8")).hexdigest()

    def to_feature_vector(self) -> List[float]:
        """
        Extracts multi-dimensional observation vector for Isolation Rainforest:
        [engagement_ratio, author_age_norm, propagation_velocity, length_perplexity_proxy, upvote_ratio, verified_signal]
        """
        eng_proxy = (self.engagement.views + 1.0) / (self.engagement.shares + 1.0)
        age_norm = min(1.0, self.author.account_age_days / 365.0)
        velocity = min(10.0, self.engagement.propagation_velocity)
        text_len_proxy = min(1.0, len(self.sanitized_body) / 1000.0)
        up_ratio = self.engagement.upvote_ratio
        verif = 1.0 if self.author.is_verified else 0.0

        return [eng_proxy, age_norm, velocity, text_len_proxy, up_ratio, verif]
