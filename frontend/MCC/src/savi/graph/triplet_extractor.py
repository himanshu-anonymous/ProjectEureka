"""
Phase 3: Open Information Extraction & Triplet Parsing.
Extracts Subject-Predicate-Object (S, P, O) triplets from text payloads.
"""

from __future__ import annotations
import re
from dataclasses import dataclass
from typing import List, Tuple, Dict, Any


@dataclass
class Triplet:
    subject: str
    predicate: str
    object: str
    confidence: float = 1.0

    def to_tuple(self) -> Tuple[str, str, str]:
        return (self.subject, self.predicate, self.object)

    def __str__(self) -> str:
        return f"({self.subject}, {self.predicate}, {self.object})"


class OpenIEExtractor:
    """
    Open Information Extraction pipeline converting text payloads into
    structured knowledge triplets E = (e_subject, r_predicate, e_object).
    """
    def __init__(self):
        # Known predicate indicator patterns for financial / intelligence claims
        self.predicate_patterns = [
            (r"(confirms|corroborates|verifies|proves)", "confirms"),
            (r"(refutes|contradicts|denies|debunks)", "contradicts"),
            (r"(announces|declares|reports|claims)", "reports"),
            (r"(causes|triggers|leads to|results in)", "causes"),
            (r"(increases|surges|spikes|elevates)", "increases"),
            (r"(decreases|drops|falls|declines)", "decreases"),
            (r"(regulates|bans|penalizes|restricts)", "restricts"),
        ]

    def extract_triplets(self, text: str, fallback_subject: str = "Event") -> List[Triplet]:
        triplets: List[Triplet] = []
        sentences = re.split(r"[.!?;\n]+", text)

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence or len(sentence) < 10:
                continue

            matched = False
            for pattern, canonical_pred in self.predicate_patterns:
                match = re.search(pattern, sentence, re.IGNORECASE)
                if match:
                    start_idx = match.start()
                    end_idx = match.end()

                    subj = sentence[:start_idx].strip()
                    obj = sentence[end_idx:].strip()

                    # Clean punctuation
                    subj = re.sub(r"^[^\w]+|[^\w]+$", "", subj)
                    obj = re.sub(r"^[^\w]+|[^\w]+$", "", obj)

                    if not subj:
                        subj = fallback_subject
                    if not obj:
                        obj = "Statement"

                    # Limit token length for clean graph nodes
                    subj_tokens = " ".join(subj.split()[-4:])
                    obj_tokens = " ".join(obj.split()[:5])

                    triplets.append(Triplet(
                        subject=subj_tokens,
                        predicate=canonical_pred,
                        object=obj_tokens,
                        confidence=0.85,
                    ))
                    matched = True
                    break

            if not matched:
                words = sentence.split()
                if len(words) >= 3:
                    subj = " ".join(words[:2])
                    pred = "asserts"
                    obj = " ".join(words[2:6])
                    triplets.append(Triplet(
                        subject=subj,
                        predicate=pred,
                        object=obj,
                        confidence=0.60,
                    ))

        return triplets
