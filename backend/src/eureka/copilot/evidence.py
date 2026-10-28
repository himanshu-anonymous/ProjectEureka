"""Evidence Pack & Evidence Item Definitions for EUREKA Nirdeshak v2.

MANDATORY RULES:
1. Every tool returns records with a stable evidence ID (E1..En), source_table, source_id, as_of,
   source_status (live or demo), and source_url (when one exists).
2. The EvidencePack aggregates all evidence items for a given query, maintaining
   token budgets, scope restrictions, and entity/metric/value indices.
3. Every claim and every number generated in response must cite valid evidence IDs from this pack.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EvidenceItem(BaseModel):
    id: str  # E1, E2, ...
    entity: str  # e.g. "Thane", "MH-04", "Maharashtra", "Konkan"
    metric: Optional[str] = None  # e.g. "composite_index", "volume", "sentiment", "crisis_sla"
    value: Any = None  # e.g. 88.4, 32, "MODERATE"
    raw_data: Dict[str, Any] = Field(default_factory=dict)
    source_table: str  # e.g. "district_metrics", "incident_tickets"
    source_id: str  # e.g. "MH-04", "TKT-101"
    as_of: str  # ISO timestamp
    source_status: str  # "live" | "demo"
    source_url: Optional[str] = None  # e.g. "/district/MH-04", "/sources/ticket/101"


class EvidencePack(BaseModel):
    scope: str = "Statewide"
    token_budget: int = 4000
    items: List[EvidenceItem] = Field(default_factory=list)

    def add_item(
        self,
        entity: str,
        metric: Optional[str] = None,
        value: Any = None,
        source_table: str = "generic_data",
        source_id: str = "unknown",
        as_of: str = "",
        source_status: str = "live",
        source_url: Optional[str] = None,
        raw_data: Optional[Dict[str, Any]] = None,
    ) -> str:
        idx = len(self.items) + 1
        ev_id = f"E{idx}"
        item = EvidenceItem(
            id=ev_id,
            entity=str(entity),
            metric=metric,
            value=value,
            source_table=source_table,
            source_id=str(source_id),
            as_of=as_of,
            source_status=source_status,
            source_url=source_url,
            raw_data=raw_data or {},
        )
        self.items.append(item)
        return ev_id

    def get(self, evidence_id: str) -> Optional[EvidenceItem]:
        for it in self.items:
            if it.id == evidence_id:
                return it
        return None

    def to_dict_list(self) -> List[Dict[str, Any]]:
        return [it.model_dump() for it in self.items]

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

    def to_map(self) -> Dict[str, Dict[str, Any]]:
        return {it.id: it.model_dump() for it in self.items}

    def format_for_prompt(self) -> str:
        if not self.items:
            return "No verified evidence items available in evidence pack."
        lines = []
        for it in self.items:
            parts = [f"[{it.id}] Entity: {it.entity}"]
            if it.metric and it.value is not None:
                parts.append(f"Metric: {it.metric} = {it.value}")
            parts.append(f"Source: {it.source_table}#{it.source_id}")
            if it.source_url:
                parts.append(f"URL: {it.source_url}")
            parts.append(f"Status: {it.source_status}")
            lines.append(" | ".join(parts))
        return "\n".join(lines)


def build_evidence_pack_from_tool_data(
    tool_name: str,
    tool_data: Dict[str, Any],
    scope: str = "Statewide",
) -> EvidencePack:
    """Extract individual structured EvidenceItems from any tool execution response."""
    pack = EvidencePack(scope=scope)
    as_of = tool_data.get("as_of", "")
    source_status = tool_data.get("source_status", "live")
    data = tool_data.get("data", tool_data)

    if not isinstance(data, dict) and not isinstance(data, list):
        return pack

    # Check for error or refusal
    if isinstance(data, dict) and data.get("error"):
        pack.add_item(
            entity="Authorization",
            metric="error",
            value=data.get("error"),
            source_table="access_control",
            source_id="refusal",
            as_of=as_of,
            source_status=source_status,
            raw_data=data,
        )
        return pack

    if tool_name == "league_table":
        districts = data.get("districts", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        for d in districts:
            d_code = d.get("district_code", "MH-XX")
            d_name = d.get("name_en", d_code)
            if "rank" in d:
                pack.add_item(
                    entity=f"{d_name} ({d_code})",
                    metric="rank",
                    value=d.get("rank"),
                    source_table="district_metrics",
                    source_id=d_code,
                    as_of=as_of,
                    source_status=source_status,
                    source_url=f"/district/{d_code}",
                    raw_data=d,
                )
            pack.add_item(
                entity=f"{d_name} ({d_code})",
                metric="composite_index",
                value=d.get("composite_index"),
                source_table="district_metrics",
                source_id=d_code,
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{d_code}",
                raw_data=d,
            )
            pillars = d.get("pillars", {})
            for p_name, p_val in pillars.items():
                pack.add_item(
                    entity=f"{d_name} ({d_code})",
                    metric=f"pillar_{p_name}",
                    value=p_val,
                    source_table="district_pillars",
                    source_id=f"{d_code}:{p_name}",
                    as_of=as_of,
                    source_status=source_status,
                    source_url=f"/district/{d_code}",
                    raw_data={"pillar": p_name, "score": p_val},
                )

    elif tool_name in ("district_profile", "pillar_breakdown"):
        d_code = data.get("district_code", "MH-XX")
        d_name = data.get("name_en") or data.get("district_name") or d_code
        if "composite_index" in data:
            pack.add_item(
                entity=f"{d_name} ({d_code})",
                metric="composite_index",
                value=data.get("composite_index"),
                source_table="district_metrics",
                source_id=d_code,
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{d_code}",
                raw_data=data,
            )
        pillars = data.get("pillars", {})
        for p_name, p_val in pillars.items():
            pack.add_item(
                entity=f"{d_name} ({d_code})",
                metric=f"pillar_{p_name}",
                value=p_val,
                source_table="district_pillars",
                source_id=f"{d_code}:{p_name}",
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{d_code}",
                raw_data={"pillar": p_name, "score": p_val},
            )
        raw = data.get("raw_metrics", {})
        for r_name, r_val in raw.items():
            pack.add_item(
                entity=f"{d_name} ({d_code})",
                metric=r_name,
                value=r_val,
                source_table="raw_metrics",
                source_id=f"{d_code}:{r_name}",
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{d_code}",
                raw_data={r_name: r_val},
            )

    elif tool_name == "active_rumors":
        tickets = data.get("tickets", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        if not tickets:
            target_entity = data.get("district_code") or "Statewide"
            pack.add_item(
                entity=target_entity,
                metric="active_tickets_count",
                value=0,
                source_table="incident_tickets",
                source_id="zero_pending",
                as_of=as_of,
                source_status=source_status,
                source_url="/fact-check",
                raw_data={"count": 0, "status": "clear", "pending_breaches": 0},
            )
        for t in tickets:
            t_id = t.get("ticket_id", "TKT-00")
            d_code = t.get("district_code", "MH-XX")
            pack.add_item(
                entity=f"Ticket {t_id} ({d_code})",
                metric="urgency_level",
                value=t.get("urgency_level"),
                source_table="incident_tickets",
                source_id=t_id,
                as_of=as_of,
                source_status=source_status,
                source_url=f"/sources/ticket/{t_id}",
                raw_data=t,
            )

    elif tool_name == "compare_districts":
        districts = data.get("districts", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        for d in districts:
            d_code = d.get("district_code", "MH-XX")
            d_name = d.get("name_en", d_code)
            if "rank" in d:
                pack.add_item(
                    entity=f"{d_name} ({d_code})",
                    metric="rank",
                    value=d.get("rank"),
                    source_table="district_metrics",
                    source_id=d_code,
                    as_of=as_of,
                    source_status=source_status,
                    source_url=f"/district/{d_code}",
                    raw_data=d,
                )
            pack.add_item(
                entity=f"{d_name} ({d_code})",
                metric="composite_index",
                value=d.get("composite_index"),
                source_table="district_metrics",
                source_id=d_code,
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{d_code}",
                raw_data=d,
            )

    elif tool_name == "forecast":
        d_code = data.get("district_code", "MH-XX")
        pack.add_item(
            entity=f"Forecast ({d_code})",
            metric="diffusion_risk_index",
            value=data.get("diffusion_risk_index"),
            source_table="diffusion_forecasts",
            source_id=d_code,
            as_of=as_of,
            source_status=source_status,
            source_url=f"/district/{d_code}/forecast",
            raw_data=data,
        )
        pack.add_item(
            entity=f"Forecast ({d_code})",
            metric="spread_velocity",
            value=data.get("spread_velocity"),
            source_table="diffusion_forecasts",
            source_id=d_code,
            as_of=as_of,
            source_status=source_status,
            source_url=f"/district/{d_code}/forecast",
            raw_data=data,
        )

    elif tool_name == "neighbors":
        d_code = data.get("district_code", "MH-XX")
        nodes = data.get("nodes", [])
        for n in nodes:
            n_id = n.get("id", "MH-XX")
            pack.add_item(
                entity=f"Neighbor ({n_id})",
                metric="adjacency",
                value=n.get("label", n_id),
                source_table="district_boundaries",
                source_id=n_id,
                as_of=as_of,
                source_status=source_status,
                source_url=f"/district/{n_id}",
                raw_data=n,
            )

    elif tool_name == "division_rollup":
        div_name = data.get("division", "Division")
        pack.add_item(
            entity=f"Division {div_name}",
            metric="average_composite_index",
            value=data.get("average_composite_index"),
            source_table="division_rollups",
            source_id=div_name,
            as_of=as_of,
            source_status=source_status,
            source_url=f"/division/{div_name}",
            raw_data=data,
        )
        pack.add_item(
            entity=f"Division {div_name}",
            metric="district_count",
            value=data.get("district_count"),
            source_table="division_rollups",
            source_id=div_name,
            as_of=as_of,
            source_status=source_status,
            source_url=f"/division/{div_name}",
            raw_data=data,
        )

    elif tool_name == "search_media_and_text":
        snippets = data.get("snippets", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        for snip in snippets:
            d_code = snip.get("district_code")
            title = snip.get("title") or snip.get("source_table") or "Text Snippet"
            ent_label = f"{title} ({d_code})" if d_code else title
            pack.add_item(
                entity=ent_label,
                metric="text_snippet",
                value=snip.get("snippet"),
                source_table=snip.get("source_table", "hybrid_text_retrieval"),
                source_id=str(snip.get("source_id", "snip")),
                as_of=snip.get("as_of", as_of),
                source_status=source_status,
                source_url=snip.get("url"),
                raw_data=snip,
            )

    else:
        # Generic dict items
        if isinstance(data, dict):
            for k, v in data.items():
                if isinstance(v, (int, float, str, bool)):
                    pack.add_item(
                        entity=tool_name,
                        metric=k,
                        value=v,
                        source_table="generic_data",
                        source_id=k,
                        as_of=as_of,
                        source_status=source_status,
                        raw_data={k: v},
                    )

    return pack


def merge_subgraph_into_evidence_pack(
    pack: EvidencePack,
    subgraph: Any,
    max_triples: int = 30,
) -> int:
    """Merge knowledge subgraph triples into the EvidencePack within token limits."""
    if not subgraph or not hasattr(subgraph, "triples_raw"):
        return 0
    added = 0
    for edge in getattr(subgraph, "triples_raw", [])[:max_triples]:
        s_name = edge.get("source_name", "Source")
        t_name = edge.get("target_name", "Target")
        rel = edge.get("relation_type", "RELATED_TO")
        src_table = edge.get("source_table", "subgraph_knowledge")
        src_id = str(edge.get("source_id_ref", "rel"))
        as_of_val = edge.get("as_of", "")
        if hasattr(as_of_val, "isoformat"):
            as_of_val = as_of_val.isoformat()

        pack.add_item(
            entity=f"{s_name} -> {t_name}",
            metric=rel,
            value=f"{s_name} [{rel}] {t_name}",
            source_table=src_table,
            source_id=src_id,
            as_of=str(as_of_val),
            source_status="live",
            source_url=None,
            raw_data=edge,
        )
        added += 1
    return added


def merge_snippets_into_evidence_pack(
    pack: EvidencePack,
    snippets_data: Dict[str, Any],
    max_snippets: int = 10,
) -> int:
    """Merge ranked text snippets into the EvidencePack."""
    if not isinstance(snippets_data, dict):
        return 0
    data = snippets_data.get("data", snippets_data)
    snippets = data.get("snippets", []) if isinstance(data, dict) else []
    added = 0
    for snip in snippets[:max_snippets]:
        d_code = snip.get("district_code")
        title = snip.get("title") or snip.get("source_table") or "Text Snippet"
        ent_label = f"{title} ({d_code})" if d_code else title
        pack.add_item(
            entity=ent_label,
            metric="text_snippet",
            value=snip.get("snippet"),
            source_table=snip.get("source_table", "hybrid_text_retrieval"),
            source_id=str(snip.get("source_id", "snip")),
            as_of=snip.get("as_of", ""),
            source_status=snip.get("source_status", "live"),
            source_url=snip.get("url"),
            raw_data=snip,
        )
        added += 1
    return added

