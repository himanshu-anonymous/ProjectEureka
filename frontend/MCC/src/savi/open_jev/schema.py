"""
Canonical schema and data models for Zefan-Cai/Open-Jev System 1 Decision Engine.
Implements the three core primitives:
1. Choice: multi-way candidate selection returning softmax probabilities.
2. Noul: proposition / binary verification returning [yes, no, uncertain] probabilities.
3. Score: ordinal level evaluation returning normalized scores and level distributions.
"""

from __future__ import annotations
import enum
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field


class QuestionType(str, enum.Enum):
    CHOICE = "choice"
    NOUL = "noul"
    SCORE = "score"


class ChoiceQuestion(BaseModel):
    """Asks Open-Jev to select one option from a predefined set of alternatives."""
    type: str = "choice"
    options: List[str] = Field(..., min_length=2)
    instructions: Optional[str] = None


class NoulQuestion(BaseModel):
    """
    Asks Open-Jev a binary or proposition-based question.
    Returns probabilities for 'yes', 'no', and 'uncertain'.
    """
    type: str = "noul"
    instructions: str


class ScoreQuestion(BaseModel):
    """Evaluates state against ordered levels or an ordinal scale."""
    type: str = "score"
    instructions: str
    levels: List[Union[int, float, str]] = Field(default_factory=lambda: [1, 2, 3, 4, 5])


class ChoiceDecision(BaseModel):
    type: str = "choice"
    selected: str
    probabilities: Dict[str, float]
    confidence: float


class NoulDecision(BaseModel):
    type: str = "noul"
    selected: str  # "yes" | "no" | "uncertain"
    probabilities: Dict[str, float]  # {"yes": p_yes, "no": p_no, "uncertain": p_unc}
    confidence: float
    is_positive: bool = False


class ScoreDecision(BaseModel):
    type: str = "score"
    selected_level: Union[int, float, str]
    score: float  # Normalized 0.0 - 1.0 or expected value
    probabilities: Dict[str, float]
    confidence: float


class OpenJevRequest(BaseModel):
    """
    Standard Open-Jev /v1/systemone request:
    Supplies context state and questions dictionary.
    """
    state: str
    questions: Dict[str, Union[ChoiceQuestion, NoulQuestion, ScoreQuestion, Dict[str, Any]]]
    temperature: Optional[float] = None
    prefix_cache: bool = False


class OpenJevResponse(BaseModel):
    """Typed probability decision output from Open-Jev model."""
    decisions: Dict[str, Union[ChoiceDecision, NoulDecision, ScoreDecision, Dict[str, Any]]]
    latency_ms: float = 0.0
    model_id: str = "ZefanCai/Open-Jev-27B-v1.1"
    server_mode: str = "in_process"  # "http_server" | "in_process" | "remote"
