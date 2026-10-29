"""
Persistent Session Memory & Self-Improving Skill Bank for NousResearch Hermes Agent.
Maintains factual knowledge across investigations and stores reusable procedural skills.
"""

from __future__ import annotations
import json
import os
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from savi.hermes.schema import HermesSkill


class HermesSessionMemory:
    """
    Two-tier memory architecture for Hermes Agent:
    1. Working Memory: Transient scratchpad for the active investigation
    2. Factual Knowledge & Skill Bank: Persistent state surviving across sessions
    """
    def __init__(self, persistence_path: Optional[str] = None):
        self.persistence_path = persistence_path
        self.working_memory: Dict[str, Any] = {}
        self.factual_knowledge: Dict[str, Any] = {
            "trusted_sources": ["reuters.com", "apnews.com", "bloomberg.com", "nature.com"],
            "suspicious_domains": ["clickbait-wire.xyz", "daily-rumor.biz"],
            "verified_claims_cache": {},
        }
        self.skills_store: Dict[str, HermesSkill] = {}
        self._init_default_skills()

        if self.persistence_path and os.path.exists(self.persistence_path):
            self.load_from_disk(self.persistence_path)

    def _init_default_skills(self) -> None:
        """Seed default investigative skills into the Hermes skill repository."""
        self.register_skill(HermesSkill(
            name="deep_fact_verification",
            description="Verify news assertions using tri-source corroboration and Open-Jev formal logic.",
            instructions="1. Search web via Gemma 4 -> 2. Scrape primary source via Firecrawl -> 3. Extract SPO triplets -> 4. Run Open-Jev Choice/Noul/Score -> 5. Score SAVI metrics.",
        ))
        self.register_skill(HermesSkill(
            name="disinformation_triage",
            description="Isolate astroturfed social media manipulation using Isolation Rainforest.",
            instructions="Extract 6D engagement & velocity vector, test for hyperplane anomaly boundary >= 0.65, quarantine if flagged.",
        ))

    def store_working(self, key: str, value: Any) -> None:
        """Stores transient item into active investigation working memory."""
        self.working_memory[key] = value

    def recall_working(self, key: str, default: Any = None) -> Any:
        """Retrieves item from active working memory."""
        return self.working_memory.get(key, default)

    def store_fact(self, key: str, value: Any) -> None:
        """Stores persistent factual knowledge across sessions."""
        self.factual_knowledge[key] = value
        if self.persistence_path:
            self.save_to_disk(self.persistence_path)

    def recall_fact(self, key: str, default: Any = None) -> Any:
        """Retrieves persistent fact from factual knowledge store."""
        return self.factual_knowledge.get(key, default)

    def register_skill(self, skill: HermesSkill) -> None:
        """Registers a newly learned or existing procedural skill."""
        self.skills_store[skill.name] = skill
        if self.persistence_path:
            self.save_to_disk(self.persistence_path)

    def get_skill(self, name: str) -> Optional[HermesSkill]:
        """Retrieves skill and increments usage count."""
        skill = self.skills_store.get(name)
        if skill:
            skill.usage_count += 1
        return skill

    def list_skills(self) -> List[HermesSkill]:
        return list(self.skills_store.values())

    def clear_working_memory(self) -> None:
        self.working_memory.clear()

    def export_state(self) -> Dict[str, Any]:
        return {
            "factual_knowledge": self.factual_knowledge,
            "skills": {k: v.model_dump() for k, v in self.skills_store.items()},
        }

    def save_to_disk(self, file_path: str) -> None:
        try:
            os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(self.export_state(), f, indent=2)
        except Exception:
            pass

    def load_from_disk(self, file_path: str) -> None:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "factual_knowledge" in data:
                    self.factual_knowledge.update(data["factual_knowledge"])
                if "skills" in data:
                    for name, s_dict in data["skills"].items():
                        self.skills_store[name] = HermesSkill(**s_dict)
        except Exception:
            pass
