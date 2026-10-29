"""
Data schemas and types for NousResearch Hermes Agent integration.
Defines tool definitions, execution trajectories, memory structures, and investigation reports.
"""

from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class HermesToolParameter(BaseModel):
    name: str
    type: str  # string | integer | number | boolean | array | object
    description: str
    required: bool = True
    default: Optional[Any] = None


class HermesToolDefinition(BaseModel):
    name: str
    description: str
    parameters: List[HermesToolParameter] = Field(default_factory=list)

    def to_json_schema(self) -> Dict[str, Any]:
        """Converts to standard function-calling JSON schema format."""
        props = {}
        reqs = []
        for p in self.parameters:
            props[p.name] = {"type": p.type, "description": p.description}
            if p.required:
                reqs.append(p.name)
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": props,
                    "required": reqs,
                },
            },
        }


class HermesToolCall(BaseModel):
    call_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    tool_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)


class HermesToolResult(BaseModel):
    call_id: str
    tool_name: str
    success: bool = True
    output: Any = None
    error: Optional[str] = None
    latency_ms: float = 0.0


class HermesStep(BaseModel):
    step_index: int
    thought: str
    tool_call: Optional[HermesToolCall] = None
    tool_result: Optional[HermesToolResult] = None
    observation: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class HermesTrajectory(BaseModel):
    investigation_id: str
    goal: str
    steps: List[HermesStep] = Field(default_factory=list)
    status: str = "IN_PROGRESS"  # IN_PROGRESS | COMPLETED | FAILED | MAX_STEPS_REACHED
    total_steps: int = 0
    total_latency_ms: float = 0.0


class HermesSkill(BaseModel):
    name: str
    description: str
    instructions: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    usage_count: int = 0


class HermesInvestigationReport(BaseModel):
    investigation_id: str
    query: str
    verdict: str  # VERIFIED_TRUE | CONTRADICTED_FALSE | UNVERIFIED_DEVELOPING | MANIPULATED_DISINFORMATION
    confidence_score: float
    executive_summary: str
    verified_claims: List[Dict[str, Any]] = Field(default_factory=list)
    triplets: List[Dict[str, str]] = Field(default_factory=list)
    open_jev_decisions: Dict[str, Any] = Field(default_factory=dict)
    savi_composite_metrics: Dict[str, Any] = Field(default_factory=dict)
    anomalous_signals: List[str] = Field(default_factory=list)
    trajectory: HermesTrajectory
    learned_skills: List[str] = Field(default_factory=list)
    subagents_dispatched: int = 0
    execution_latency_ms: float = 0.0
