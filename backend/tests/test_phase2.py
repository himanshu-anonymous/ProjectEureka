"""Test Suite for EUREKA Nirdeshak v2 Phase 2: Text Retrieval & Graph Context.

Covers:
1. Text search migration & ORM models (ExtractedEntity, EntityMention, ExtractedRelation, ExtractionCheckpoint).
2. Entity linking (districts, departments, schemes, officials, outlets) & trigram fuzzy matching.
3. Multilingual time-phrase parsing (English, Marathi, Hindi with Devanagari numerals).
4. Schema-based extraction, resumable checkpoints, and outbox projection.
5. Subgraph context generation (seed linking, 1-2 hop expansion, hub suppression, recency decay, GraphViewSpec).
6. Hybrid retrieval tool (lexical search, strict RBAC scope enforcement, snippet formatting).
7. Evidence pack merging (structured data + subgraph + snippets) and verifier confidence calibration.
"""

from datetime import datetime, timedelta, timezone
import pytest
from unittest.mock import MagicMock, patch

from eureka.models.enums import AggregateType, OutboxEventStatus, UserRole
from eureka.models.orm import (
    ExtractedEntity,
    EntityMention,
    ExtractedRelation,
    ExtractionCheckpoint,
    OutboxEvent,
)
from eureka.copilot.entity_linking import (
    link_entities,
    parse_time_phrase,
    trigram_similarity,
    compute_trigrams,
)
from eureka.copilot.subgraph import (
    get_subgraph_context,
    ALLOWED_RELATIONS_BY_TYPE,
    HUB_NODE_IDS,
)
from eureka.copilot.retrieval_tool import (
    tool_search_media_and_text,
    SearchMediaAndTextArgs,
)
from eureka.copilot.tools import CopilotPrincipal
from eureka.copilot.evidence import (
    EvidencePack,
    merge_subgraph_into_evidence_pack,
    merge_snippets_into_evidence_pack,
    build_evidence_pack_from_tool_data,
)
from eureka.copilot.verifier import ClaimVerifier, VerifiedClaim
from eureka.workers.extraction_tasks import (
    process_record_text_extraction,
    determine_relation_type,
)
from eureka.tasks.outbox_tasks import BatchNeo4jOutboxProjector


# ============================================================================
# 1. ORM MODELS & SCHEMA INTEGRITY
# ============================================================================

def test_orm_models_instantiation():
    """Verify ORM models instantiate cleanly with required fields."""
    now = datetime.now(timezone.utc)
    ent = ExtractedEntity(
        id="MH-07",
        name="Pune",
        category="district",
        canonical_id="MH-07",
        properties={"code": "MH-07", "division": "DIV-PUN"},
        created_at=now,
    )
    assert ent.id == "MH-07"
    assert ent.category == "district"

    mention = EntityMention(
        id="m1",
        entity_id=ent.id,
        source_table="clippings",
        source_id="101",
        mention_text="पुणे",
        confidence=1.0,
        district_code="MH-07",
        as_of=now,
        created_at=now,
    )
    assert mention.entity_id == "MH-07"
    assert mention.confidence == 1.0

    rel = ExtractedRelation(
        id="r1",
        source_entity_id="MH-07",
        target_entity_id="SCHEME-LADKI-BAHIN",
        relation_type="IMPLEMENTS_SCHEME",
        source_table="scheme_hoardings",
        source_id="5",
        confidence=0.9,
        as_of=now,
        created_at=now,
    )
    assert rel.relation_type == "IMPLEMENTS_SCHEME"

    chk = ExtractionCheckpoint(
        source_table="clippings",
        last_processed_id="101",
        last_processed_at=now,
        records_processed=42,
    )
    assert chk.records_processed == 42


# ============================================================================
# 2. ENTITY LINKING & TRIGRAM FUZZY MATCHING
# ============================================================================

def test_entity_linking_districts_multilingual():
    """Verify English, Marathi, and historical names link to canonical district codes."""
    # English
    res_en = link_entities("What is happening in Pune and Thane districts?")
    ids_en = {r.canonical_id for r in res_en}
    assert "MH-07" in ids_en  # Pune
    assert "MH-04" in ids_en  # Thane

    # Marathi
    res_mr = link_entities("पालघर आणि नाशिक मधील परिस्थिती काय आहे?")
    ids_mr = {r.canonical_id for r in res_mr}
    assert "MH-03" in ids_mr  # Palghar
    assert "MH-21" in ids_mr  # Nashik

    # Former / Historical names
    res_former = link_entities("Reports from Aurangabad and Osmanabad")
    ids_former = {r.canonical_id for r in res_former}
    assert "MH-17" in ids_former  # Chhatrapati Sambhajinagar
    assert "MH-14" in ids_former  # Dharashiv


def test_entity_linking_departments_schemes_officials_outlets():
    """Verify linking across departments, schemes, officials, and press outlets."""
    text = (
        "पुणे जिल्हाधिकारी यांनी महिला व बालविकास विभागाच्या लाडकी बहीण योजनेचा आढावा घेतला. "
        "याबाबत लोकमत वृत्तपत्राने अहवाल दिला."
    )
    res = link_entities(text)
    ids = {r.canonical_id for r in res}

    assert "MH-07" in ids                      # Pune
    assert "OFFICIAL-COLLECTOR" in ids         # District Collector
    assert "DEPT-WCD" in ids                   # Women & Child Development
    assert "SCHEME-LADKI-BAHIN" in ids         # Majhi Ladki Bahin Yojana
    assert "OUTLET-LOKMAT" in ids              # Lokmat


def test_trigram_fuzzy_matching_tolerance():
    """Verify trigram similarity tolerates minor misspellings and transliteration drift."""
    # Compute similarity between Ahmaadnagar and Ahilyanagar / Ahmednagar
    sim = trigram_similarity("ahmaadnagar", "ahmednagar")
    assert sim >= 0.65

    # Test link_entities with slight misspelling
    res = link_entities("Ahmaadnagar collectorate meeting")
    matched_ids = [r.canonical_id for r in res]
    assert "MH-25" in matched_ids  # Ahilyanagar / Ahmednagar


# ============================================================================
# 3. MULTILINGUAL TIME-PHRASE PARSER
# ============================================================================

def test_time_phrase_parser_english():
    """Verify English 24h, 7d, 30d, today, yesterday."""
    ref = datetime(2026, 10, 28, 12, 0, 0, tzinfo=timezone.utc)

    tw_24 = parse_time_phrase("What happened in the last 24 hours?", reference_date=ref)
    assert tw_24 is not None
    assert tw_24.window_type == "hours_24"
    assert tw_24.start_date == ref - timedelta(hours=24)

    tw_7d = parse_time_phrase("Incidents reported over past 7 days", reference_date=ref)
    assert tw_7d is not None
    assert tw_7d.window_type == "days_7"
    assert tw_7d.start_date == ref - timedelta(days=7)

    tw_today = parse_time_phrase("Today's morning updates", reference_date=ref)
    assert tw_today is not None
    assert tw_today.window_type == "today"


def test_time_phrase_parser_marathi_devanagari():
    """Verify Marathi phrases with Devanagari numerals are parsed accurately."""
    ref = datetime(2026, 10, 28, 12, 0, 0, tzinfo=timezone.utc)

    # २४ तास
    tw_mr24 = parse_time_phrase("गेल्या २४ तासांत काय घडले?", reference_date=ref)
    assert tw_mr24 is not None
    assert tw_mr24.window_type == "hours_24"
    assert tw_mr24.start_date == ref - timedelta(hours=24)

    # ७ दिवस / आठवडा
    tw_mr7 = parse_time_phrase("मागील आठवड्यातील अहवाल", reference_date=ref)
    assert tw_mr7 is not None
    assert tw_mr7.window_type == "days_7"

    # काल
    tw_yest = parse_time_phrase("काल काय घडले?", reference_date=ref)
    assert tw_yest is not None
    assert tw_yest.window_type == "yesterday"


def test_time_phrase_parser_hindi():
    """Verify Hindi phrases are recognized."""
    ref = datetime(2026, 10, 28, 12, 0, 0, tzinfo=timezone.utc)

    tw_hi24 = parse_time_phrase("पिछले २४ घंटे की खबरें", reference_date=ref)
    assert tw_hi24 is not None
    assert tw_hi24.window_type == "hours_24"

    tw_hi7 = parse_time_phrase("पिछले ७ दिन का सारांश", reference_date=ref)
    assert tw_hi7 is not None
    assert tw_hi7.window_type == "days_7"


# ============================================================================
# 4. SCHEMA EXTRACTION & OUTBOX PROJECTION
# ============================================================================

def test_determine_relation_type():
    """Verify schema relation deduction between entity categories."""
    rel1, rev1 = determine_relation_type("official", "district")
    assert rel1 == "POSTED_IN"
    assert rev1 is False

    rel2, rev2 = determine_relation_type("district", "scheme")
    assert rel2 == "IMPLEMENTS_SCHEME"
    assert rev2 is False

    rel3, rev3 = determine_relation_type("department", "scheme")
    assert rel3 == "ADMINISTERS_SCHEME"
    assert rev3 is False


def test_process_record_text_extraction_mock():
    """Verify entity, mention, and relation extraction with outbox projection."""
    mock_session = MagicMock()
    mock_session.get.return_value = None  # New entities

    text = "ठाणे जिल्हाधिकारी यांनी जलयुक्त शिवार योजनेचा आढावा घेतला."
    stats = process_record_text_extraction(
        session=mock_session,
        source_table="clippings",
        source_id="101",
        text=text,
        default_district="MH-04",
    )

    assert stats["entities"] >= 2  # Thane, Collector, Jalyukt Shivar
    assert stats["mentions"] >= 2
    assert stats["relations"] >= 1

    # Verify OutboxEvent was added for both Entity and Relation
    added_outbox = [
        call_args[0][0]
        for call_args in mock_session.add.call_args_list
        if isinstance(call_args[0][0], OutboxEvent)
    ]
    agg_types = {e.aggregate_type for e in added_outbox}
    assert AggregateType.ENTITY in agg_types or "Entity" in agg_types
    assert AggregateType.RELATION in agg_types or "Relation" in agg_types


def test_batch_outbox_projector_entity_relation():
    """Verify BatchNeo4jOutboxProjector handles Entity and Relation aggregates."""
    mock_driver = MagicMock()
    projector = BatchNeo4jOutboxProjector(driver_service=mock_driver)

    events = [
        OutboxEvent(
            id="e1",
            aggregate_type=AggregateType.ENTITY,
            aggregate_id="MH-07",
            payload={"name": "Pune", "category": "district", "canonical_id": "MH-07"},
            status=OutboxEventStatus.PENDING,
        ),
        OutboxEvent(
            id="e2",
            aggregate_type=AggregateType.RELATION,
            aggregate_id="r1",
            payload={
                "source_entity_id": "MH-07",
                "target_entity_id": "SCHEME-LADKI-BAHIN",
                "relation_type": "IMPLEMENTS_SCHEME",
                "source_table": "schemes",
                "source_id": "1",
                "confidence": 0.95,
            },
            status=OutboxEventStatus.PENDING,
        ),
    ]

    count = projector.project_batch(events)
    assert count == 2
    assert mock_driver.run_query.call_count == 2


# ============================================================================
# 5. SUBGRAPH CONTEXT & GRAPHVIEW SPEC
# ============================================================================

def test_subgraph_context_expansion_and_bounds():
    """Verify subgraph seeds from linked entities, suppresses hubs, and bounds triples."""
    ctx = get_subgraph_context(
        query="पुणे आणि सातारा मधील लाडकी बहीण योजना",
        question_type="governance",
        min_triples=30,
        max_triples=50,
    )

    assert len(ctx.seed_entities) >= 2
    assert 10 <= len(ctx.triples) <= 60

    # Ensure hub nodes were not expanded as subjects
    for t in ctx.triples:
        for hub in HUB_NODE_IDS:
            assert f"[{hub}]" not in t

    # Ensure GraphViewSpec is properly constructed
    gv = ctx.graph_view
    assert gv.component == "GraphView"
    assert len(gv.nodes) > 0
    assert len(gv.edges) > 0
    assert gv.table_alternative is not None
    assert len(gv.table_alternative.rows) == len(gv.edges)


def test_subgraph_context_question_type_filtering():
    """Verify rumor questions filter relations to claim/contagion relationships."""
    ctx = get_subgraph_context(
        query="पालघर मधील अफवा आणि पडताळणी",
        question_type="rumor",
    )
    allowed = ALLOWED_RELATIONS_BY_TYPE["rumor"]
    for edge in ctx.triples_raw:
        assert edge["relation_type"] in allowed


# ============================================================================
# 6. RETRIEVAL TOOL & RBAC SCOPE ENFORCEMENT
# ============================================================================

def test_retrieval_tool_state_admin_wide_scope():
    """Verify State Admin can perform statewide search."""
    admin = CopilotPrincipal(username="dg_admin", role=UserRole.DG_STATE_ADMIN.value)
    res = tool_search_media_and_text(admin, SearchMediaAndTextArgs(query="Ladki Bahin Yojana"))

    assert "error" not in res
    assert "data" in res
    data = res.get("data", {})
    assert "snippets" in data
    assert "time_window" in data


def test_retrieval_tool_district_collector_cross_refusal():
    """Verify District Collector is strictly prohibited from searching other districts."""
    collector = CopilotPrincipal(
        username="collector_pune",
        role=UserRole.DISTRICT_COLLECTOR.value,
        district_code="MH-07",
    )

    # Querying unauthorized district must return PERMISSION_DENIED
    res = tool_search_media_and_text(
        collector,
        SearchMediaAndTextArgs(query="water crisis", district_code="MH-03"),
    )
    assert res.get("error") == "PERMISSION_DENIED"


def test_retrieval_tool_dio_desk_own_district():
    """Verify DIO desk can search within their own assigned district."""
    dio = CopilotPrincipal(
        username="dio_palghar",
        role=UserRole.DIO_DESK.value,
        district_code="MH-03",
    )
    res = tool_search_media_and_text(
        dio,
        SearchMediaAndTextArgs(query="rumor refutation", district_code="MH-03"),
    )
    assert "error" not in res
    assert "data" in res


# ============================================================================
# 7. EVIDENCE PACK MERGING & CONFIDENCE CALIBRATION
# ============================================================================

def test_merge_subgraph_into_evidence_pack():
    """Verify subgraph triples merge into EvidencePack with stable IDs and token budget."""
    pack = EvidencePack(scope="Statewide")
    subgraph = get_subgraph_context("पुणे आणि ठाणे")

    added = merge_subgraph_into_evidence_pack(pack, subgraph, max_triples=10)
    assert added > 0
    assert len(pack.items) == added

    # Check evidence item structure
    first_item = pack.items[0]
    assert first_item.id.startswith("E")
    assert first_item.source_table != ""
    assert first_item.source_id != ""


def test_merge_snippets_into_evidence_pack():
    """Verify text snippets merge into EvidencePack."""
    pack = EvidencePack(scope="Statewide")
    snippets_data = {
        "status": "success",
        "data": {
            "snippets": [
                {
                    "source_table": "clippings",
                    "source_id": "clip_101",
                    "title": "Lokmat News",
                    "snippet": "4.5 lakh beneficiaries enrolled.",
                    "date": "2026-10-28T00:00:00Z",
                    "url": "/clippings/101",
                    "source_status": "live",
                }
            ]
        }
    }

    added = merge_snippets_into_evidence_pack(pack, snippets_data, max_snippets=5)
    assert added == 1
    assert pack.items[0].metric == "text_snippet"
    assert pack.items[0].source_table == "clippings"
    assert pack.items[0].source_id == "clip_101"


@pytest.mark.asyncio
async def test_verifier_confidence_medium_for_text_snippets():
    """Verify confidence is Medium when claims cite retrieved text snippets."""
    pack = EvidencePack(scope="Statewide")
    pack.add_item(
        entity="Lokmat News (Pune)",
        metric="text_snippet",
        value="4.5 lakh beneficiaries enrolled in Pune district.",
        source_table="clippings",
        source_id="clip_101",
        as_of="2026-10-28T00:00:00Z",
        raw_data={"district": "MH-07", "content": "4.5 lakh beneficiaries enrolled in Pune district."},
    )

    verifier = ClaimVerifier()
    claims_obj = {
        "claims": [
            {
                "text": "Over 4.5 lakh beneficiaries enrolled in Pune district [E1].",
                "evidence": ["E1"],
                "numbers": [{"value": 4.5, "evidence": "E1"}],
            }
        ],
        "gaps": [],
        "follow_ups": [],
    }

    result = await verifier.verify_claims(claims_obj, pack, language="en", user_query="How many beneficiaries?")
    assert result.abstained is False
    assert len(result.claims) == 1
    assert result.confidence == "Medium"  # Medium because source is clippings/text!
