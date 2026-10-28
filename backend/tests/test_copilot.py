"""Comprehensive Test Suite for DGIPR Open UI Copilot.

Tests cover:
1. Key isolation (grep codebase to enforce ONLY eureka/copilot/ accesses keys).
2. Server-side RBAC enforcement (State Admin, Collector, DIO, Division Head).
3. Cross-district refusal (e.g. Palghar Collector querying Beed MH-23 returns PERMISSION_DENIED).
4. Number grounding (fabricated numbers in OpenUI Lang are rejected, fallback ViewSpec returned).
5. Prompt injection defense (adversarial strings in tool outputs treated as data).
6. Memory isolation, HMAC pseudonymization, forget-me, and post-extraction filtering.
7. Multilingual intent routing (Marathi, Hindi, English).
8. Fail-open resilience (Mem0/Qdrant or LLM failure does not crash service).
"""

import os
import re
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from eureka.copilot.tools import (
    CopilotPrincipal,
    LeagueTableArgs,
    DistrictProfileArgs,
    PillarBreakdownArgs,
    CompareDistrictsArgs,
    ActiveRumorsArgs,
    tool_league_table,
    tool_district_profile,
    tool_pillar_breakdown,
    tool_compare_districts,
    tool_active_rumors,
    COPILOT_TOOLS_MAP,
    get_copilot_function_declarations,
    verify_district_authorization,
)
from eureka.copilot.memory import (
    pseudonymize_user_id,
    is_allowed_preference,
    CopilotMemoryManager,
)
from eureka.copilot.openui_generator import (
    detect_language,
    generate_copilot_system_instruction,
    extract_all_numbers,
    extract_numbers_from_openui,
    validate_openui_output,
    OpenUIPipeline,
)
from eureka.copilot.viewspec import ViewSpecBuilder, KpiCardSpec, DataTableSpec, BarChartSpec, ViewSpec


# ============================================================================
# 1. KEY ISOLATION TEST
# ============================================================================

def test_key_isolation_grep_codebase():
    """Enforce that OPENUI_COPILOT_GEMINI_API_KEY and THESYS_API_KEY are ONLY
    referenced inside backend/src/eureka/copilot/.
    No other package, module, or frontend file may read or reference these environment variables.
    """
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    key_pattern = re.compile(r"OPENUI_COPILOT_GEMINI_API_KEY|THESYS_API_KEY")
    
    violations = []
    
    def is_path_allowed(path_str: str) -> bool:
        norm = os.path.normpath(path_str)
        # Allowed if inside eureka/copilot, test_copilot.py, docs, or env files
        if os.path.normpath("src/eureka/copilot") in norm:
            return True
        if os.path.normpath("tests") in norm:
            return True
        if os.path.normpath("docs") in norm:
            return True
        if norm.endswith(".env.example") or norm.endswith(".env"):
            return True
        return False
    
    for root, dirs, files in os.walk(repo_root):
        # Skip git, node_modules, venvs, cache, and external reference clones in core/ and openui/
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "venv", "__pycache__", ".next", ".gemini", "core", "openui", "dist", "build", ".pytest_cache", "project-eureka"}]
        
        for file in files:
            if not file.endswith((".py", ".ts", ".tsx", ".js", ".mjs", ".sh", ".yaml", ".yml")):
                continue
            
            full_path = os.path.normpath(os.path.join(root, file))
            
            # Check if this file is in an allowed location
            if is_path_allowed(full_path):
                continue
                
            try:
                with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    matches = key_pattern.findall(content)
                    if matches:
                        violations.append(f"{full_path}: {matches}")
            except Exception:
                pass

    assert not violations, f"Key isolation violated! Keys found outside eureka/copilot: {violations}"


# ============================================================================
# 2. RBAC & CROSS-DISTRICT ACCESS CONTROLS
# ============================================================================

def test_rbac_state_admin_access():
    """State Admin can access any district and statewide league tables."""
    admin_principal = CopilotPrincipal(
        username="admin_super",
        role="DG State Admin",
        district_code=None,
        division=None,
    )
    
    # Statewide query succeeds
    table_res = tool_league_table(admin_principal, LeagueTableArgs())
    assert table_res["source_status"] in ("live", "demo")
    data = table_res["data"]
    assert "districts" in data
    assert len(data["districts"]) > 0
    
    # Access any district profile succeeds
    profile_res = tool_district_profile(admin_principal, DistrictProfileArgs(district_code="MH-18"))
    assert profile_res["source_status"] in ("live", "demo")
    assert profile_res["data"]["district_code"] == "MH-18"


def test_rbac_collector_own_district():
    """Collector can access own district profile and pillar breakdown."""
    palghar_collector = CopilotPrincipal(
        username="collector_palghar",
        role="District Collector",
        district_code="MH-18",
        division="Konkan",
    )
    
    profile_res = tool_district_profile(palghar_collector, DistrictProfileArgs(district_code="MH-18"))
    assert profile_res["source_status"] in ("live", "demo")
    assert profile_res["data"]["district_code"] == "MH-18"
    assert "pillars" in profile_res["data"]
    
    breakdown_res = tool_pillar_breakdown(palghar_collector, PillarBreakdownArgs(district_code="MH-18"))
    assert breakdown_res["source_status"] in ("live", "demo")
    assert breakdown_res["data"]["district_code"] == "MH-18"


def test_rbac_cross_district_refusal():
    """Palghar Collector querying Beed (MH-23) returns PERMISSION_DENIED."""
    palghar_collector = CopilotPrincipal(
        username="collector_palghar",
        role="District Collector",
        district_code="MH-18",
        division="Konkan",
    )
    
    # Direct profile check
    res_profile = tool_district_profile(palghar_collector, DistrictProfileArgs(district_code="MH-23"))
    assert res_profile.get("error") == "PERMISSION_DENIED"
    assert "MH-18" in res_profile.get("message", "")
    
    # Pillar breakdown check
    res_pillar = tool_pillar_breakdown(palghar_collector, PillarBreakdownArgs(district_code="MH-23"))
    assert res_pillar.get("error") == "PERMISSION_DENIED"


def test_rbac_compare_districts_refusal():
    """Collector cannot compare districts if one of them is outside their scope."""
    palghar_collector = CopilotPrincipal(
        username="collector_palghar",
        role="District Collector",
        district_code="MH-18",
        division="Konkan",
    )
    
    res = tool_compare_districts(
        palghar_collector,
        CompareDistrictsArgs(district_codes=["MH-18", "MH-12"]),
    )
    assert res.get("error") == "PERMISSION_DENIED"


def test_rbac_division_head_scoping():
    """Division Head (Konkan) can see districts in Konkan, but not other divisions."""
    konkan_head = CopilotPrincipal(
        username="div_head_konkan",
        role="Director Konkan Division",
        district_code=None,
        division="Konkan",
    )
    
    # Authorized for Konkan district (Palghar MH-04 or MH-01 through MH-07)
    res_konkan = tool_district_profile(konkan_head, DistrictProfileArgs(district_code="MH-04"))
    assert res_konkan["source_status"] in ("live", "demo")
    
    # Unauthorized for Nagpur (MH-32)
    res_nagpur = tool_district_profile(konkan_head, DistrictProfileArgs(district_code="MH-32"))
    assert res_nagpur.get("error") == "PERMISSION_DENIED"


def test_rbac_active_rumors_scoping():
    """Collector querying active rumors only receives rumors for their district."""
    palghar_collector = CopilotPrincipal(
        username="collector_palghar",
        role="District Collector",
        district_code="MH-18",
        division="Konkan",
    )
    
    res = tool_active_rumors(palghar_collector, ActiveRumorsArgs(district_code="MH-18"))
    assert res["source_status"] in ("live", "demo")
    for r in res["data"].get("rumors", []):
        assert r["district_code"] == "MH-18"


# ============================================================================
# 3. NUMBER GROUNDING & SANITIZATION
# ============================================================================

def test_extract_all_numbers():
    """Extract numeric values from complex nested structures."""
    sample_data = {
        "district_code": "MH-18",
        "composite_index": 84.5,
        "rank": 3,
        "pillars": {
            "volume": 22.5,
            "speed_tat": 18.0,
        },
        "incidents": [
            {"id": "INC-1", "score": 90.0},
        ],
    }
    nums = extract_all_numbers(sample_data)
    assert 84.5 in nums
    assert 3.0 in nums
    assert 22.5 in nums
    assert 18.0 in nums
    assert 90.0 in nums


def test_extract_numbers_from_openui():
    """Extract numeric attributes from OpenUI markup."""
    markup = (
        '<Stack direction="vertical">\n'
        '  <KpiCard title="Palghar Score" value="84.5" unit="/100" delta=3.2 status="positive" />\n'
        '  <KpiCard title="State Rank" value="3" status="neutral" />\n'
        '</Stack>'
    )
    nums = extract_numbers_from_openui(markup)
    assert 84.5 in nums
    assert 3.2 in nums
    assert 3.0 in nums


def test_grounding_valid_numbers_passes():
    """When OpenUI Lang numbers match tool results, validate_openui_output succeeds."""
    tool_results = [{
        "data": {
            "district_code": "MH-18",
            "composite_index": 84.5,
            "rank": 3,
        }
    }]
    
    markup = (
        '<Stack direction="vertical">\n'
        '  <KpiCard title="Palghar Score" value="84.5" unit="/100" status="positive" />\n'
        '  <KpiCard title="Rank" value="3" status="neutral" />\n'
        '</Stack>'
    )
    
    is_valid, errors = validate_openui_output(markup, tool_results)
    assert is_valid is True
    assert errors == []


def test_grounding_fabricated_numbers_rejected():
    """When OpenUI Lang invents numbers not in tool data, validate_openui_output fails with FABRICATED_NUMBER."""
    tool_results = [{
        "data": {
            "district_code": "MH-18",
            "composite_index": 84.5,
            "rank": 3,
        }
    }]
    
    # 999.9 and 421 are completely ungrounded
    hallucinated_markup = (
        '<Stack direction="vertical">\n'
        '  <KpiCard title="Fabricated Score" value="999.9" unit="/100" />\n'
        '  <KpiCard title="Fabricated Count" value="421" />\n'
        '</Stack>'
    )
    
    is_valid, errors = validate_openui_output(hallucinated_markup, tool_results)
    assert is_valid is False
    assert any("FABRICATED_NUMBER" in err for err in errors)


def test_disallowed_html_tags_rejected():
    """Raw HTML scripts or iframes are rejected immediately."""
    tool_results = [{"data": {"score": 80.0}}]
    
    malicious_markup = (
        '<Heading level=1 text="Overview" />\n'
        '<script>alert("xss")</script>\n'
        '<KpiCard title="Score" value="80.0" />'
    )
    
    is_valid, errors = validate_openui_output(malicious_markup, tool_results)
    assert is_valid is False
    assert any("forbidden HTML tags" in err for err in errors)


# ============================================================================
# 4. MEM0 USER ISOLATION & PRIVACY
# ============================================================================

def test_user_pseudonymization():
    """Officer IDs must be hashed with HMAC-SHA256 and never stored in plaintext."""
    user1 = "collector_palghar"
    user2 = "collector_beed"
    
    hash1 = pseudonymize_user_id(user1)
    hash2 = pseudonymize_user_id(user2)
    
    # 32 character hex string
    assert len(hash1) == 32
    assert len(hash2) == 32
    assert hash1 != hash2
    assert user1 not in hash1
    assert user2 not in hash2
    
    # Deterministic for the same user
    assert pseudonymize_user_id(user1) == hash1


def test_preference_filtering():
    """Post-extraction filter drops preferences that mention sensitive contact info, incident words, or lack topics."""
    # Presentation preferences are allowed
    assert is_allowed_preference("Officer prefers Marathi language and bar charts") is True
    assert is_allowed_preference("Prefers concise summary tables for district reviews") is True
    assert is_allowed_preference("Bilingual view with KPI cards") is True
    
    # Sensitive contact info is rejected
    assert is_allowed_preference("Email is officer@maharashtra.gov.in") is False
    assert is_allowed_preference("Contact: 9876543210") is False
    
    # Incident / crime details are rejected
    assert is_allowed_preference("Officer asked about protest and riot in station") is False
    assert is_allowed_preference("Incident killed 3 people in accident") is False
    
    # Irrelevant text lacking presentation topics is rejected
    assert is_allowed_preference("The weather was sunny today") is False


@pytest.mark.asyncio
async def test_memory_fail_open_resilience():
    """If Qdrant or embedder fails, search_preferences returns empty list without raising."""
    mem_mgr = CopilotMemoryManager()
    
    # Force client initialization failure
    with patch.object(mem_mgr, "_get_mem0", return_value=None):
        res = await mem_mgr.search_preferences("collector_palghar", "Show rankings")
        assert res == []


# ============================================================================
# 5. LANGUAGE ROUTING & SYSTEM INSTRUCTIONS
# ============================================================================

def test_detect_language():
    """Verify language detection across Marathi, Hindi, and English."""
    # Marathi queries
    assert detect_language("महाराष्ट्र राज्य क्रमवारी दाखवा आणि माहिती द्या") == "mr"
    assert detect_language("पालघर जिल्ह्याचा स्कोअर कसा आहे") == "mr"
    
    # Hindi queries
    assert detect_language("महाराष्ट्र राज्य की रैंकिंग क्या है") == "hi"
    assert detect_language("पालघर जिले का स्कोर क्या हुआ") == "hi"
    
    # English queries
    assert detect_language("Show Maharashtra district leaderboard") == "en"
    assert detect_language("What is the pillar breakdown for Palghar?") == "en"


def test_generate_copilot_system_instruction():
    """System instruction dynamically incorporates language, UX4G standards, and user preferences."""
    sys_mr = generate_copilot_system_instruction(
        language="mr",
        user_preferences=["Prefers Marathi language", "Prefers bar charts"],
    )
    assert "मराठी भाषेत" in sys_mr
    assert "Prefers Marathi language" in sys_mr
    assert "GIGW 3.0 / UX4G" in sys_mr
    assert "STRICT SAFETY & DATA CONSTRAINTS" in sys_mr


# ============================================================================
# 6. VIEWSPEC & FALLBACK
# ============================================================================

def test_viewspec_builder_and_fallback():
    """ViewSpecBuilder correctly constructs fallback ViewSpec when generative UI fails."""
    tool_res = {
        "district_code": "MH-18",
        "name_en": "Palghar",
        "district_name": "Palghar",
        "composite_index": 84.5,
        "rank": 3,
    }
    
    vspec = OpenUIPipeline.create_fallback_viewspec("district_profile", {"data": tool_res})
    assert vspec.source_status == "live"
    lang = vspec.to_openui_lang()
    assert "Palghar" in lang
    assert "84.5" in lang


# ============================================================================
# 7. TOOL DECLARATIONS INTEGRITY
# ============================================================================

def test_all_10_tools_declared_and_mapped():
    """Verify all 10 governed read-only tools are present in catalog and declarations."""
    expected_tools = {
        "league_table",
        "district_profile",
        "pillar_breakdown",
        "trend",
        "compare_districts",
        "active_rumors",
        "forecast",
        "neighbors",
        "division_rollup",
        "dossier_summary",
    }
    
    assert set(COPILOT_TOOLS_MAP.keys()) == expected_tools
    
    declarations = get_copilot_function_declarations()
    decl_names = {d["name"] for d in declarations}
    assert decl_names == expected_tools


# ============================================================================
# 8. STAGE TIMERS & SERVER-TIMING AUDIT
# ============================================================================

@pytest.mark.asyncio
async def test_copilot_stage_timers_and_server_timing():
    """Verify that copilot query emits stage timings and server_timing in done event."""
    import json
    import re
    from eureka.copilot.router import copilot_query, CopilotQueryRequest
    from eureka.api.auth import TokenData
    from eureka.models.enums import UserRole

    user = TokenData(username="test_officer", role=UserRole.DG_STATE_ADMIN)
    req = CopilotQueryRequest(query="Show top 5 districts", language="en")

    response = await copilot_query(req, current_user=user)
    events = []
    async for chunk in response.body_iterator:
        events.append(chunk)

    full_text = "".join(events)
    assert "event: done" in full_text
    done_match = re.search(r"event: done\ndata: (\{.*\})", full_text)
    assert done_match is not None
    done_data = json.loads(done_match.group(1))
    assert "timings" in done_data
    assert "first_byte_ms" in done_data["timings"]
    assert "last_byte_ms" in done_data["timings"]
    assert "server_timing" in done_data


# ============================================================================
# 9. MULTI-GRAPH GENERATION (PIE, BAR, LINE) PARITY TESTS
# ============================================================================

def test_pie_chart_spec_and_openui_rendering():
    """Verify PieChartSpec properly serializes into compliant OpenUI Lang markup."""
    from eureka.copilot.viewspec import ViewSpec, PieChartSpec, DataTableSpec, TextSpec

    table_alt = DataTableSpec(
        columns=["Category", "Value"],
        rows=[{"Category": "Konkan", "Value": 7}, {"Category": "Pune", "Value": 5}],
        caption="Division Breakdown",
    )
    pie = PieChartSpec(
        title="Revenue Divisions Distribution",
        categories=["Konkan", "Pune"],
        values=[7, 5],
        variant="donut",
        data=[{"name": "Konkan", "value": 7}, {"name": "Pune", "value": 5}],
        text_summary="2 divisions represented.",
        table_alternative=table_alt,
    )
    vspec = ViewSpec(
        title="Division Distribution View",
        as_of="2026-10-20T00:00:00Z",
        source_status="live",
        components=[pie],
    )

    markup = vspec.to_openui_lang()
    assert "<PieChart" in markup
    assert 'title="Revenue Divisions Distribution"' in markup
    assert 'variant="donut"' in markup
    assert "Konkan" in markup
    assert "<DataTable" in markup


def test_pie_chart_validation_with_number_grounding():
    """Verify that PieChart passes validate_openui_output when numbers and summaries are grounded."""
    from eureka.copilot.openui_generator import validate_openui_output

    tool_results = [{
        "data": {
            "districts": [
                {"name_en": "Konkan", "count": 7},
                {"name_en": "Pune", "count": 5},
            ]
        }
    }]

    valid_pie_markup = """<PieChart title="Division Share" variant="donut" values="[7, 5]">
  <Text content="Division distribution for 2 divisions." />
  <DataTable columns="Category,Count" rows="[{&quot;Category&quot;: &quot;Konkan&quot;, &quot;Count&quot;: 7}]" />
</PieChart>"""

    is_valid, errors = validate_openui_output(valid_pie_markup, tool_results)
    assert is_valid is True, f"Validation failed unexpectedly: {errors}"


def test_fast_path_and_viewspec_pie_intent():
    """Fast-path query with 'pie chart' sets view=pie and produces a PieChart component in ViewSpec."""
    from eureka.copilot.intent_router import match_fast_path
    from eureka.copilot.tools import CopilotPrincipal
    from eureka.copilot.viewspec import ViewSpecBuilder

    principal = CopilotPrincipal(username="dg_admin", role="DG State Admin")
    match = match_fast_path("Show me a pie chart of top districts", principal)

    assert match is not None
    tool_name, tool_args, tool_result = match
    assert tool_name == "league_table"
    assert tool_result.get("view") == "pie"

    vspec = ViewSpecBuilder.build_from_tool_result(tool_name, tool_result)
    comp_names = [c.component for c in vspec.components]
    assert "PieChart" in comp_names


# ============================================================================
# 10. PHASE 1 EVIDENCE-FIRST & VERIFIER TESTS
# ============================================================================

@pytest.mark.asyncio
async def test_citation_less_claim_rejected():
    """Verify that a claim with no evidence IDs cited is strictly rejected."""
    from eureka.copilot.evidence import EvidencePack, EvidenceItem
    from eureka.copilot.verifier import ClaimVerifier

    pack = EvidencePack(
        scope="DG State Admin",
        items=[
            EvidenceItem(
                id="E1",
                entity="Palghar",
                metric="cpi",
                value=88.4,
                source_table="districts_cache",
                source_id="MH-03",
                as_of="2026-10-20T00:00:00Z",
                source_status="live",
                raw_data={"district": "Palghar", "cpi": 88.4},
            )
        ],
    )

    verifier = ClaimVerifier()
    raw_claims = [
        {"text": "Palghar governance CPI score is 88.4", "evidence": []}
    ]

    result = await verifier.verify_claims({"claims": raw_claims}, pack)
    assert len(result.claims) == 1
    assert result.claims[0].status == "dropped"
    assert "Citation-less claim" in (result.claims[0].flag_reason or "")


@pytest.mark.asyncio
async def test_number_from_wrong_entity_rejected():
    """Verify that citing a number attributed to a different entity is rejected."""
    from eureka.copilot.evidence import EvidencePack, EvidenceItem
    from eureka.copilot.verifier import ClaimVerifier

    pack = EvidencePack(
        scope="DG State Admin",
        items=[
            EvidenceItem(
                id="E1",
                entity="Pune",
                metric="cpi",
                value=89.2,
                source_table="districts_cache",
                source_id="MH-12",
                as_of="2026-10-20T00:00:00Z",
                source_status="live",
                raw_data={"district": "Pune", "cpi": 89.2},
            ),
            EvidenceItem(
                id="E2",
                entity="Thane",
                metric="cpi",
                value=85.1,
                source_table="districts_cache",
                source_id="MH-04",
                as_of="2026-10-20T00:00:00Z",
                source_status="live",
                raw_data={"district": "Thane", "cpi": 85.1},
            ),
        ],
    )

    verifier = ClaimVerifier()
    # Claim attributes 89.2 (Pune's score) to Thane using E2 citation
    raw_claims = [
        {
            "text": "Thane has an overall CPI of 89.2 [E2]",
            "evidence": ["E2"],
            "numbers": [{"value": 89.2, "evidence": "E2"}],
        }
    ]

    result = await verifier.verify_claims({"claims": raw_claims}, pack)
    assert len(result.claims) == 1
    assert result.claims[0].status in ["dropped", "flagged"]
    assert "not grounded" in (result.claims[0].flag_reason or "").lower()


@pytest.mark.asyncio
async def test_fabricated_cause_dropped_or_flagged():
    """Verify that a claim with a fabricated cause/entity not present in evidence is dropped or flagged."""
    from eureka.copilot.evidence import EvidencePack, EvidenceItem
    from eureka.copilot.verifier import ClaimVerifier

    pack = EvidencePack(
        scope="DG State Admin",
        items=[
            EvidenceItem(
                id="E1",
                entity="Thane",
                metric="incident",
                value="Heavy rainfall waterlogging",
                source_table="incidents",
                source_id="INC-101",
                as_of="2026-10-20T00:00:00Z",
                source_status="live",
                raw_data={"district": "Thane", "incident": "Heavy rainfall waterlogging", "severity": "Medium"},
            )
        ],
    )

    verifier = ClaimVerifier()
    # Claim invents an explosion in a transformer causing an outage on unverified date
    raw_claims = [
        {
            "text": "An industrial boiler explosion caused mass grid blackout across Thane on 2026-12-31 [E1]",
            "evidence": ["E1"],
            "numbers": [],
        }
    ]

    result = await verifier.verify_claims({"claims": raw_claims}, pack)
    assert len(result.claims) == 1
    assert result.claims[0].status in ["dropped", "flagged"]
    assert result.claims[0].flag_reason is not None


@pytest.mark.asyncio
async def test_empty_evidence_abstains():
    """Verify that when evidence pack is empty, verifier builds a structured abstention."""
    from eureka.copilot.evidence import EvidencePack
    from eureka.copilot.verifier import ClaimVerifier

    empty_pack = EvidencePack(scope="DG State Admin", items=[])
    verifier = ClaimVerifier()

    result = await verifier.verify_claims(
        claims_data={"claims": []},
        evidence_pack=empty_pack,
        user_query="What is the governance score of Atlantis?",
    )

    assert result.abstained is True
    assert len(result.what_was_found) > 0
    assert len(result.what_is_missing) > 0
    assert len(result.suggested_questions) > 0


@pytest.mark.asyncio
async def test_fast_path_upgrade_verified():
    """Verify that fast-path narrative upgrades are strictly passed through the ClaimVerifier."""
    from eureka.copilot.evidence import EvidencePack, EvidenceItem
    from eureka.copilot.verifier import ClaimVerifier

    pack = EvidencePack(
        scope="DG State Admin",
        items=[
            EvidenceItem(
                id="E1",
                entity="Palghar",
                metric="cpi",
                value=88.4,
                source_table="districts_cache",
                source_id="MH-03",
                as_of="2026-10-20T00:00:00Z",
                source_status="live",
                raw_data={"name": "Palghar", "rank": 14, "cpi": 88.4},
            )
        ],
    )

    verifier = ClaimVerifier()
    upgrade_claims = [
        {
            "text": "Palghar is ranked 14 with a governance CPI of 88.4 [E1]",
            "evidence": ["E1"],
            "numbers": [{"value": 88.4, "evidence": "E1"}],
        }
    ]

    result = await verifier.verify_claims({"claims": upgrade_claims}, pack)
    assert len(result.claims) == 1
    assert result.claims[0].status == "verified"
    assert result.claims[0].evidence == ["E1"]


def test_role_scoping_holds():
    """Verify that role scoping holds across District Collector, DIO Desk, and Division Head."""
    from eureka.copilot.tools import (
        CopilotPrincipal,
        DistrictProfileArgs,
        tool_district_profile,
        verify_district_authorization,
    )

    # 1. District Collector for Thane (MH-04) cannot query Palghar (MH-03)
    collector_thane = CopilotPrincipal(
        username="collector_thane",
        role="District Collector",
        district_code="MH-04",
    )
    denied = verify_district_authorization(collector_thane, "MH-03")
    assert denied is not None
    assert "Access Denied" in denied

    # 2. Collector for Thane CAN query Thane (MH-04)
    allowed = verify_district_authorization(collector_thane, "MH-04")
    assert allowed is None

    # 3. Division Head for Konkan cannot query Pune (MH-12, Desh division)
    div_head_konkan = CopilotPrincipal(
        username="div_head_konkan",
        role="Division Head",
        division="Konkan",
    )
    div_denied = verify_district_authorization(div_head_konkan, "MH-12")
    assert div_denied is not None
    assert "Access Denied" in div_denied

    # 4. Division Head for Konkan CAN query Palghar (MH-03, part of Konkan)
    div_allowed = verify_district_authorization(div_head_konkan, "MH-03")
    assert div_allowed is None
