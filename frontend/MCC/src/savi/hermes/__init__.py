"""
SAVI Hermes Agent Package.
Provides first-class integration with NousResearch Hermes Agent architecture,
incorporating autonomous multi-step investigation loops, self-improving procedural skills,
persistent session memory, and SAVI tool suites.
"""

from __future__ import annotations
from savi.hermes.schema import (
    HermesToolDefinition,
    HermesToolParameter,
    HermesToolCall,
    HermesToolResult,
    HermesStep,
    HermesTrajectory,
    HermesSkill,
    HermesInvestigationReport,
)
from savi.hermes.memory import HermesSessionMemory
from savi.hermes.tools import HermesToolRegistry
from savi.hermes.agent import HermesInvestigationAgent

__all__ = [
    "HermesToolDefinition",
    "HermesToolParameter",
    "HermesToolCall",
    "HermesToolResult",
    "HermesStep",
    "HermesTrajectory",
    "HermesSkill",
    "HermesInvestigationReport",
    "HermesSessionMemory",
    "HermesToolRegistry",
    "HermesInvestigationAgent",
]
