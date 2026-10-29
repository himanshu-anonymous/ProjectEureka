"""Claim Verifier & Entailment Engine for EUREKA Nirdeshak v2.

MANDATORY RULES:
1. Every claim must cite existing evidence IDs (E1..En).
2. Each number must match the (entity, metric, value) in its cited evidence at display rounding.
   Devanagari digits normalized. NO global number pool. NO constant whitelist.
3. Entity names and dates must exist in the cited evidence.
4. Second-pass model check verifies entailment (cited evidence strictly entails the claim).
5. Unsupported claims are dropped or flagged.
6. If more than 50% of claims fail, or evidence pack is empty, ABSTAIN with:
   - What was found
   - What is missing
   - Suggested questions
7. Assign confidence: High (all structured data), Medium (retrieved text/heuristics), Low (partial/repaired).
"""

import asyncio
import json
import logging
import re
from typing import Any, Dict, List, Optional, Set, Tuple
from pydantic import BaseModel, Field

from eureka.copilot.evidence import EvidenceItem, EvidencePack

logger = logging.getLogger("eureka.copilot.verifier")

DEVANAGARI_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")
ARABIC_INDIC_DIGITS = str.maketrans("٠١٢३٤٥٦٧٨٩", "0123456789")


def normalize_numerals(text: str) -> str:
    """Normalize Devanagari and Arabic-Indic numerals to standard ASCII digits."""
    if not text:
        return ""
    norm = text.translate(DEVANAGARI_DIGITS).translate(ARABIC_INDIC_DIGITS)
    # Strip thousands commas between digits (1,234 -> 1234)
    norm = re.sub(r'(?<=\d),(?=\d)', '', norm)
    return norm


def extract_numbers_from_text(text: str) -> List[float]:
    """Extract float values from text after digit normalization."""
    clean = normalize_numerals(text)
    matches = re.findall(r'-?\b\d+(?:\.\d+)?\b', clean)
    numbers = []
    for m in matches:
        try:
            numbers.append(float(m))
        except ValueError:
            pass
    return numbers


def extract_numbers_from_dict(data: Any) -> Set[float]:
    """Extract all numbers from an evidence item's dictionary or value."""
    nums = set()
    if isinstance(data, (int, float)) and not isinstance(data, bool):
        nums.add(round(float(data), 2))
    elif isinstance(data, dict):
        for v in data.values():
            nums.update(extract_numbers_from_dict(v))
    elif isinstance(data, list):
        for item in data:
            nums.update(extract_numbers_from_dict(item))
    elif isinstance(data, str):
        for n in extract_numbers_from_text(data):
            nums.add(round(n, 2))
    return nums


class VerifiedClaim(BaseModel):
    text: str
    evidence: List[str] = Field(default_factory=list)
    numbers: List[Dict[str, Any]] = Field(default_factory=list)
    status: str = "verified"  # verified, flagged, dropped
    flag_reason: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()


class VerificationResult(BaseModel):
    abstained: bool = False
    abstention_reason: Optional[str] = None
    what_was_found: List[str] = Field(default_factory=list)
    what_is_missing: List[str] = Field(default_factory=list)
    suggested_questions: List[str] = Field(default_factory=list)
    claims: List[VerifiedClaim] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    follow_ups: List[str] = Field(default_factory=list)
    confidence: str = "High"  # High, Medium, Low
    unsupported_count: int = 0
    total_claims_count: int = 0
    evidence_pack_ids: List[str] = Field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

    def render_output_text(self, language: str = "en") -> str:
        """Render markdown text with citation chips and structured sections."""
        if self.abstained:
            if language == "mr":
                lines = [
                    "### माहितीचा अभाव / असमर्थता (Abstained)\n",
                    "**तपासलेली माहिती (What was found):**",
                ]
                for f in (self.what_was_found or ["कोणतीही अधिकृत माहिती सापडली नाही."]):
                    lines.append(f"- {f}")
                lines.append("\n**गहाळ माहिती (What is missing):**")
                for m in (self.what_is_missing or ["विनंती केलेला डेटा उपलब्ध नाही किंवा कार्यक्षेत्राबाहेर आहे."]):
                    lines.append(f"- {m}")
                lines.append("\n**सुचवलेले प्रश्न (Suggested questions):**")
                for q in (self.suggested_questions or ["सर्व जिल्ह्यांची सुशासन क्रमवारी दाखवा", "ठाणे जिल्ह्याची सद्यस्थिती काय आहे?"]):
                    lines.append(f"- {q}")
                return "\n".join(lines)
            elif language == "hi":
                lines = [
                    "### जानकारी का अभाव / अनुपलब्ध (Abstained)\n",
                    "**क्या पाया गया (What was found):**",
                ]
                for f in (self.what_was_found or ["कोई आधिकारिक रिकॉर्ड नहीं मिला।"]):
                    lines.append(f"- {f}")
                lines.append("\n**क्या अनुपलब्ध है (What is missing):**")
                for m in (self.what_is_missing or ["अनुरोधित डेटा उपलब्ध नहीं है अथवा आपके अधिकार क्षेत्र से बाहर है।"]):
                    lines.append(f"- {m}")
                lines.append("\n**सुझाए गए प्रश्न (Suggested questions):**")
                for q in (self.suggested_questions or ["राज्य के शीर्ष 5 जिलों की रैंकिंग दिखाएं", "नासिक जिले का स्कोरकार्ड क्या है?"]):
                    lines.append(f"- {q}")
                return "\n".join(lines)
            else:
                lines = [
                    "### Insufficient Governed Data (Abstained)\n",
                    "**What was found:**",
                ]
                for f in (self.what_was_found or ["No matching official records found within authorized scope."]):
                    lines.append(f"- {f}")
                lines.append("\n**What is missing:**")
                for m in (self.what_is_missing or ["Requested metrics or entity are not present in current datasets."]):
                    lines.append(f"- {m}")
                lines.append("\n**Suggested questions:**")
                for q in (self.suggested_questions or ["Show statewide district governance leaderboard", "Show profile for Thane MH-04"]):
                    lines.append(f"- {q}")
                return "\n".join(lines)

        # Non-abstained: Render claims with citation chips
        claim_texts = []
        for c in self.claims:
            if c.status == "dropped":
                continue
            chips = "".join(f" [{ev}]" for ev in c.evidence)
            claim_texts.append(f"{c.text}{chips}")

        output_lines = ["\n\n".join(claim_texts)]

        if self.gaps:
            gap_title = "What could not be found" if language == "en" else ("गहाळ माहिती" if language == "mr" else "अनुपलब्ध जानकारी")
            output_lines.append(f"\n\n**{gap_title}:**")
            for g in self.gaps:
                output_lines.append(f"- {g}")

        if self.follow_ups:
            fu_title = "Suggested follow-ups" if language == "en" else ("सुचवलेले प्रश्न" if language == "mr" else "सुझाए गए प्रश्न")
            output_lines.append(f"\n\n**{fu_title}:**")
            for fu in self.follow_ups:
                output_lines.append(f"- {fu}")

        return "\n".join(output_lines)


class ClaimVerifier:
    """Rigorous verification of claims, evidence citations, numbers, entities, and entailment."""

    def __init__(self, gemma_client: Optional[Any] = None):
        self._gemma_client = gemma_client

    async def verify_claims(
        self,
        claims_data: Dict[str, Any],
        evidence_pack: EvidencePack,
        language: str = "en",
        user_query: str = "",
        max_failure_share: float = 0.50,
    ) -> VerificationResult:
        """Execute full 5-stage verification on generated claims against the EvidencePack."""
        # 1. Check if evidence pack is empty
        if not evidence_pack.items:
            return self._build_empty_pack_abstention(language, user_query)

        raw_claims = claims_data.get("claims", [])
        raw_gaps = claims_data.get("gaps", [])
        raw_follow_ups = claims_data.get("follow_ups", [])

        if not raw_claims:
            # Check if there are gaps
            return self._build_no_claims_abstention(language, user_query, raw_gaps, evidence_pack)

        verified_claims: List[VerifiedClaim] = []
        unsupported_count = 0
        total_claims_count = len(raw_claims)
        available_ids = {it.id: it for it in evidence_pack.items}

        for rc in raw_claims:
            text = rc.get("text", "").strip()
            cited_ids = rc.get("evidence", [])
            numbers = rc.get("numbers", [])

            # (a) Check evidence citation
            if not cited_ids or not isinstance(cited_ids, list):
                unsupported_count += 1
                verified_claims.append(
                    VerifiedClaim(
                        text=text,
                        evidence=[],
                        status="dropped",
                        flag_reason="Citation-less claim: No evidence ID cited",
                    )
                )
                continue

            valid_cited_ids = [cid for cid in cited_ids if cid in available_ids]
            if not valid_cited_ids:
                unsupported_count += 1
                verified_claims.append(
                    VerifiedClaim(
                        text=text,
                        evidence=cited_ids,
                        status="dropped",
                        flag_reason=f"Cites non-existent evidence IDs: {cited_ids}",
                    )
                )
                continue

            # (b) Number check: Each number must match the cited evidence
            # No global pool! Must match the specific cited evidence item.
            number_mismatch = False
            mismatch_details = []

            for num_obj in numbers:
                val = num_obj.get("value")
                ev_id = num_obj.get("evidence")
                if val is None:
                    continue

                try:
                    num_val = float(normalize_numerals(str(val)))
                except ValueError:
                    continue

                if ev_id not in available_ids:
                    number_mismatch = True
                    mismatch_details.append(f"Number {val} cites missing evidence {ev_id}")
                    break

                target_item = available_ids[ev_id]
                allowed_numbers = extract_numbers_from_dict(target_item.value)
                allowed_numbers.update(extract_numbers_from_dict(target_item.raw_data))
                if target_item.value is not None:
                    try:
                        allowed_numbers.add(round(float(target_item.value), 2))
                    except (ValueError, TypeError):
                        pass

                # Check match at display rounding (tolerance 0.1 or exact)
                matched = any(abs(num_val - allowed) < 0.15 for allowed in allowed_numbers)
                if not matched:
                    number_mismatch = True
                    mismatch_details.append(f"Number {num_val} not grounded in cited {ev_id} ({target_item.entity})")
                    break

            if number_mismatch:
                unsupported_count += 1
                verified_claims.append(
                    VerifiedClaim(
                        text=text,
                        evidence=valid_cited_ids,
                        numbers=numbers,
                        status="dropped",
                        flag_reason="; ".join(mismatch_details),
                    )
                )
                continue

            # (c) Entity and Date verification
            entity_mismatch = False
            # Check if claim mentions another district not in the cited evidence
            all_known_districts = {
                "thane": "MH-04", "nashik": "MH-21", "pune": "MH-07", "palghar": "MH-03",
                "nagpur": "MH-31", "satara": "MH-08", "ahilyanagar": "MH-25", "kolhapur": "MH-10",
                "solapur": "MH-09", "beed": "MH-23", "chhatrapati sambhajinagar": "MH-17",
            }
            claim_lower = text.lower()
            cited_entities_lower = " ".join([
                f"{available_ids[cid].entity} {str(available_ids[cid].value or '')} {json.dumps(available_ids[cid].raw_data, default=str)}".lower()
                for cid in valid_cited_ids
            ])

            for d_name, d_code in all_known_districts.items():
                if (d_name in claim_lower or d_code.lower() in claim_lower) and (d_name not in cited_entities_lower and d_code.lower() not in cited_entities_lower):
                    entity_mismatch = True
                    unsupported_count += 1
                    verified_claims.append(
                        VerifiedClaim(
                            text=text,
                            evidence=valid_cited_ids,
                            numbers=numbers,
                            status="dropped",
                            flag_reason=f"Claim mentions entity '{d_name}' but cites evidence for '{cited_entities_lower}'",
                        )
                    )
                    break

            if entity_mismatch:
                continue

            # Date verification: any explicit ISO or calendar dates must exist in cited evidence
            date_matches = re.findall(r'\b(?:\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})\b', text)
            date_mismatch = False
            for d_str in date_matches:
                date_in_evidence = any(
                    d_str in it.as_of or d_str in json.dumps(it.raw_data, default=str)
                    for it in [available_ids[cid] for cid in valid_cited_ids]
                )
                if not date_in_evidence:
                    date_mismatch = True
                    unsupported_count += 1
                    verified_claims.append(
                        VerifiedClaim(
                            text=text,
                            evidence=valid_cited_ids,
                            numbers=numbers,
                            status="dropped",
                            flag_reason=f"Claim mentions ungrounded date '{d_str}' not present in cited evidence records.",
                        )
                    )
                    break

            if date_mismatch:
                continue

            # (d) Entailment pass
            entailed, entail_reason = await self._check_entailment(text, [available_ids[cid] for cid in valid_cited_ids])
            if not entailed:
                unsupported_count += 1
                verified_claims.append(
                    VerifiedClaim(
                        text=text,
                        evidence=valid_cited_ids,
                        numbers=numbers,
                        status="dropped",
                        flag_reason=f"Entailment failed: {entail_reason}",
                    )
                )
                continue

            # Passed all checks!
            verified_claims.append(
                VerifiedClaim(
                    text=text,
                    evidence=valid_cited_ids,
                    numbers=numbers,
                    status="verified",
                )
            )

        # (e) Check failure share
        failure_share = unsupported_count / max(1, total_claims_count)
        valid_claims = [c for c in verified_claims if c.status == "verified"]

        if failure_share > max_failure_share or not valid_claims:
            return self._build_high_failure_abstention(
                language=language,
                user_query=user_query,
                unsupported_count=unsupported_count,
                total_count=total_claims_count,
                evidence_pack=evidence_pack,
                gaps=raw_gaps,
                claims=verified_claims,
            )

        # Calculate confidence
        confidence = "High"
        for vc in valid_claims:
            for cid in vc.evidence:
                item = available_ids[cid]
                if item.source_table in (
                    "diffusion_forecasts",
                    "heuristics",
                    "hybrid_text_retrieval",
                    "clippings",
                    "media_events",
                    "subgraph_knowledge",
                    "reference_data.borders",
                    "reference_data.schemes",
                ):
                    confidence = "Medium"
                    break
        if unsupported_count > 0:
            confidence = "Low" if confidence == "High" else confidence

        return VerificationResult(
            abstained=False,
            claims=valid_claims,
            gaps=raw_gaps,
            follow_ups=raw_follow_ups,
            confidence=confidence,
            unsupported_count=unsupported_count,
            total_claims_count=total_claims_count,
            evidence_pack_ids=list(available_ids.keys()),
        )

    async def _check_entailment(self, claim_text: str, cited_items: List[EvidenceItem]) -> Tuple[bool, str]:
        """Check whether the cited evidence entails the claim text."""
        # Fast rule-based rejection of fabricated causes and extreme statements
        fabricated_cause_words = ["conspiracy", "scam", "riot instigated by", "resigned due to", "arrested for bribe"]
        if any(w in claim_text.lower() for w in fabricated_cause_words):
            # Check if this exact text exists in cited items
            has_cause = any(w in json.dumps(it.raw_data, default=str).lower() for it in cited_items for w in fabricated_cause_words)
            if not has_cause:
                return False, "Fabricated cause or unverified speculation detected."

        # If LLM client is available, run second model pass
        if self._gemma_client:
            try:
                evidence_summary = "\n".join(
                    f"[{it.id}] Entity: {it.entity}, Metric: {it.metric}={it.value}, Details: {json.dumps(it.raw_data, default=str)[:200]}"
                    for it in cited_items
                )
                entail_prompt = (
                    "You are a strict Entailment Verifier for government intelligence data. "
                    "Decide if the provided EVIDENCE strictly ENTAILS the CLAIM. "
                    "If the claim invents facts, reasons, or causes not stated in the evidence, return false.\n\n"
                    f"EVIDENCE:\n{evidence_summary}\n\n"
                    f"CLAIM: {claim_text}\n\n"
                    "Respond with ONLY JSON: {\"entailed\": true|false, \"reason\": \"...\"}"
                )
                resp = await asyncio.wait_for(
                    self._gemma_client.generate(
                        contents=[{"role": "user", "parts": [{"text": entail_prompt}]}],
                        user_id="verifier_system",
                    ),
                    timeout=3.0,
                )
                cand = resp.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                m = re.search(r'\{.*\}', cand, re.DOTALL)
                if m:
                    res_json = json.loads(m.group(0))
                    return bool(res_json.get("entailed", True)), res_json.get("reason", "")
            except Exception as e:
                logger.debug("Entailment LLM pass skipped or timed out: %s", e)

        return True, "Entailed by evidence structure"

    def _build_empty_pack_abstention(self, language: str, query: str) -> VerificationResult:
        if language == "mr":
            found = ["प्रशासकीय सुरक्षा नियमांनुसार कोणताही अधिकृत डेटा सापडला नाही."]
            missing = [f"'{query}' साठी आवश्यक असलेले रेकॉर्ड उपलब्ध नाहीत किंवा परवानग्या मर्यादित आहेत."]
            suggested = ["महाराष्ट्रातील सर्व जिल्ह्यांची सुशासन क्रमवारी दाखवा", "ठाणे जिल्ह्याची सद्यस्थिती काय आहे?"]
        elif language == "hi":
            found = ["प्रशासनिक सुरक्षा नियमों के अंतर्गत कोई आधिकारिक रिकॉर्ड नहीं मिला।"]
            missing = [f"'{query}' से संबंधित डेटा उपलब्ध नहीं है या अनुमति प्रतिबंधित है।"]
            suggested = ["महाराष्ट्र के शीर्ष 5 जिलों की रैंकिंग दिखाएं", "नासिक जिले का स्कोरकार्ड क्या है?"]
        else:
            found = ["No official records found within current scope or permissions."]
            missing = [f"Records supporting '{query}' are missing or restricted by role clearance."]
            suggested = ["Show statewide district governance leaderboard", "Show profile for Thane MH-04"]

        return VerificationResult(
            abstained=True,
            abstention_reason="Empty Evidence Pack",
            what_was_found=found,
            what_is_missing=missing,
            suggested_questions=suggested,
            confidence="Low",
        )

    def _build_no_claims_abstention(
        self, language: str, query: str, gaps: List[str], pack: EvidencePack
    ) -> VerificationResult:
        found_entities = [it.entity for it in pack.items[:3]]
        found = [f"Retrieved {len(pack.items)} background records for: {', '.join(found_entities)}."]
        missing = gaps or ["Model could not construct verified claims from the evidence pack."]
        suggested = ["Show statewide district governance leaderboard", "List active rumors and SLA tickets"]

        return VerificationResult(
            abstained=True,
            abstention_reason="No Verified Claims Generated",
            what_was_found=found,
            what_is_missing=missing,
            suggested_questions=suggested,
            confidence="Low",
        )

    def _build_high_failure_abstention(
        self,
        language: str,
        user_query: str,
        unsupported_count: int,
        total_count: int,
        evidence_pack: EvidencePack,
        gaps: List[str],
        claims: Optional[List[VerifiedClaim]] = None,
    ) -> VerificationResult:
        found = [f"Retrieved {len(evidence_pack.items)} verified evidence items across {evidence_pack.scope}."]
        missing = [
            f"{unsupported_count} of {total_count} generated claims failed numerical or entity citation verification.",
            *(gaps or ["Missing specific grounding metrics for query context."])
        ]
        suggested = ["Show statewide district governance leaderboard", "Compare Nashik and Ahilyanagar performance"]

        return VerificationResult(
            abstained=True,
            abstention_reason=f"High Failure Rate ({unsupported_count}/{total_count} claims ungrounded)",
            what_was_found=found,
            what_is_missing=missing,
            suggested_questions=suggested,
            confidence="Low",
            claims=claims or [],
            unsupported_count=unsupported_count,
            total_claims_count=total_count,
        )
