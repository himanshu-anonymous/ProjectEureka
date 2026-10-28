"""Deterministic ViewSpec Schema & Canonical Builder.

Serves as:
1. Ground truth representation of governed tool data.
2. Guaranteed fallback when generative OpenUI output fails validation or repair.
3. Fully compliant with GIGW 3.0 & UX4G accessibility (every chart/graph includes text summary and table alternative).
"""

from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field, ConfigDict


class BaseComponentSpec(BaseModel):
    model_config = ConfigDict(extra="forbid")
    component: str


class TextSpec(BaseComponentSpec):
    component: Literal["Text"] = "Text"
    content: str


class HeadingSpec(BaseComponentSpec):
    component: Literal["Heading"] = "Heading"
    level: int = Field(default=2, ge=1, le=4)
    text: str


class CalloutSpec(BaseComponentSpec):
    component: Literal["Callout"] = "Callout"
    type: Literal["info", "warning", "success", "critical"] = "info"
    message: str


class KpiCardSpec(BaseComponentSpec):
    component: Literal["KpiCard"] = "KpiCard"
    title: str
    value: Union[str, float, int]
    unit: Optional[str] = None
    delta: Optional[float] = None
    status: Literal["positive", "negative", "neutral", "critical"] = "neutral"
    caption: Optional[str] = None


class DataTableSpec(BaseComponentSpec):
    component: Literal["DataTable"] = "DataTable"
    columns: List[str]
    rows: List[Dict[str, Any]]
    caption: Optional[str] = None


class BarChartSpec(BaseComponentSpec):
    component: Literal["BarChart"] = "BarChart"
    title: str
    x_key: str
    y_key: str
    data: List[Dict[str, Any]]
    text_summary: str = Field(description="Accessible summary for screen readers & GIGW 3.0")
    table_alternative: DataTableSpec


class LineChartSpec(BaseComponentSpec):
    component: Literal["LineChart"] = "LineChart"
    title: str
    x_key: str
    y_key: str
    data: List[Dict[str, Any]]
    text_summary: str = Field(description="Accessible summary for screen readers & GIGW 3.0")
    table_alternative: DataTableSpec


class PieChartSpec(BaseComponentSpec):
    component: Literal["PieChart"] = "PieChart"
    title: str
    categories: Optional[List[str]] = None
    values: Optional[List[Union[int, float]]] = None
    variant: Literal["pie", "donut"] = "donut"
    data: Optional[List[Dict[str, Any]]] = None
    text_summary: str = Field(description="Accessible summary for screen readers & GIGW 3.0")
    table_alternative: DataTableSpec


class GraphViewSpec(BaseComponentSpec):
    component: Literal["GraphView"] = "GraphView"
    title: str
    nodes: List[Dict[str, Any]] = Field(max_length=200, description="Capped at 200 nodes for performance")
    edges: List[Dict[str, Any]]
    text_summary: str
    table_alternative: DataTableSpec


class StackSpec(BaseComponentSpec):
    component: Literal["Stack"] = "Stack"
    direction: Literal["vertical", "horizontal"] = "vertical"
    children: List[Union[
        KpiCardSpec,
        DataTableSpec,
        BarChartSpec,
        LineChartSpec,
        PieChartSpec,
        GraphViewSpec,
        CalloutSpec,
        HeadingSpec,
        TextSpec,
    ]]


AnyComponentSpec = Union[
    StackSpec,
    KpiCardSpec,
    DataTableSpec,
    BarChartSpec,
    LineChartSpec,
    PieChartSpec,
    GraphViewSpec,
    CalloutSpec,
    HeadingSpec,
    TextSpec,
]


class ViewSpec(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str
    as_of: str
    source_status: Literal["live", "demo", "unavailable"] = "live"
    district_code: Optional[str] = None
    fallback: bool = False
    components: List[AnyComponentSpec]

    def to_openui_lang(self) -> str:
        """Render the ViewSpec into valid OpenUI Lang syntax for streaming/rendering."""
        lines = []
        for comp in self.components:
            lines.append(render_component_to_openui(comp))
        return "\n\n".join(lines)


def render_component_to_openui(comp: AnyComponentSpec) -> str:
    """Recursively convert a typed component specification into OpenUI Lang markup."""
    c_type = comp.component

    if c_type == "Heading":
        h = comp  # type: HeadingSpec
        prefix = "#" * h.level
        return f"{prefix} {h.text}"

    if c_type == "Text":
        t = comp  # type: TextSpec
        return t.content

    if c_type == "Callout":
        c = comp  # type: CalloutSpec
        return f'<Callout type="{c.type}" message="{c.message}" />'

    if c_type == "KpiCard":
        k = comp  # type: KpiCardSpec
        props = [f'title="{k.title}"', f'value="{k.value}"']
        if k.unit:
            props.append(f'unit="{k.unit}"')
        if k.delta is not None:
            props.append(f'delta={k.delta}')
        props.append(f'status="{k.status}"')
        if k.caption:
            props.append(f'caption="{k.caption}"')
        return f"<KpiCard {' '.join(props)} />"

    if c_type == "DataTable":
        dt = comp  # type: DataTableSpec
        cols_str = ",".join(dt.columns)
        # Format rows simply
        rows_data = []
        for r in dt.rows[:50]:  # Cap rows for prompt brevity
            rows_data.append(r)
        import json
        rows_json = json.dumps(rows_data).replace('"', '&quot;')
        return f'<DataTable columns="{cols_str}" rows="{rows_json}" />'

    if c_type in ("BarChart", "LineChart"):
        chart = comp
        import json
        data_json = json.dumps(chart.data).replace('"', '&quot;')
        tbl_comp = render_component_to_openui(chart.table_alternative)
        return (
            f'<{c_type} title="{chart.title}" xKey="{chart.x_key}" yKey="{chart.y_key}" data="{data_json}">\n'
            f'  <Text content="{chart.text_summary}" />\n'
            f'  {tbl_comp}\n'
            f'</{c_type}>'
        )

    if c_type == "PieChart":
        pie = comp  # type: PieChartSpec
        import json
        data_json = json.dumps(pie.data or []).replace('"', '&quot;')
        cats_json = json.dumps(pie.categories or []).replace('"', '&quot;')
        vals_json = json.dumps(pie.values or []).replace('"', '&quot;')
        tbl_comp = render_component_to_openui(pie.table_alternative)
        return (
            f'<PieChart title="{pie.title}" variant="{pie.variant}" categories="{cats_json}" values="{vals_json}" data="{data_json}">\n'
            f'  <Text content="{pie.text_summary}" />\n'
            f'  {tbl_comp}\n'
            f'</PieChart>'
        )

    if c_type == "GraphView":
        gv = comp  # type: GraphViewSpec
        import json
        nodes_json = json.dumps(gv.nodes[:200]).replace('"', '&quot;')
        edges_json = json.dumps(gv.edges[:300]).replace('"', '&quot;')
        tbl_comp = render_component_to_openui(gv.table_alternative)
        return (
            f'<GraphView title="{gv.title}" nodes="{nodes_json}" edges="{edges_json}">\n'
            f'  <Text content="{gv.text_summary}" />\n'
            f'  {tbl_comp}\n'
            f'</GraphView>'
        )

    if c_type == "Stack":
        st = comp  # type: StackSpec
        children_rendered = "\n  ".join(render_component_to_openui(child) for child in st.children)
        return f'<Stack direction="{st.direction}">\n  {children_rendered}\n</Stack>'

    return ""


class ViewSpecBuilder:
    """Builds authoritative, evidence-grounded ViewSpecs directly from governed tool data."""

    @staticmethod
    def build_from_tool_result(tool_name: str, tool_result: Dict[str, Any], fallback: bool = False) -> ViewSpec:
        as_of = tool_result.get("as_of", "2026-10-19T00:00:00Z")
        status = tool_result.get("source_status", "live")
        data = tool_result.get("data", {})

        # Handle permission denied or errors
        if "error" in tool_result or (isinstance(data, dict) and "error" in data):
            err_msg = tool_result.get("message") or (data.get("message") if isinstance(data, dict) else "Access refused.")
            return ViewSpec(
                title="Access Restricted",
                as_of=as_of,
                source_status=status,
                fallback=fallback,
                components=[
                    CalloutSpec(type="critical", message=str(err_msg)),
                    TextSpec(content="You do not have administrative authorization to inspect this district or jurisdiction."),
                ],
            )

        if tool_name == "league_table":
            districts = data.get("districts", []) if isinstance(data, dict) else data
            top_kpis = []
            if districts:
                top_1 = districts[0]
                top_kpis.append(
                    KpiCardSpec(
                        title=f"Top Ranked: {top_1.get('name_en')}",
                        value=top_1.get("composite_index", 0.0),
                        unit="/100",
                        status="positive",
                        caption="Rank #1 Maharashtra",
                    )
                )
            
            table_rows = []
            chart_data = []
            for d in districts:
                table_rows.append({
                    "Rank": d.get("rank"),
                    "District": f"{d.get('name_en')} ({d.get('name_mr')})",
                    "Score": d.get("composite_index"),
                    "Volume": d.get("pillars", {}).get("volume", 0),
                    "Sentiment": d.get("pillars", {}).get("sentiment", 0),
                    "Crisis SLA": d.get("pillars", {}).get("crisis_sla", 0),
                })
                chart_data.append({
                    "district": d.get("name_en"),
                    "score": d.get("composite_index"),
                })

            table_spec = DataTableSpec(
                columns=["Rank", "District", "Score", "Volume", "Sentiment", "Crisis SLA"],
                rows=table_rows,
                caption="100-Point Composite Governance Index Leaderboard",
            )

            view_mode = tool_result.get("view") or (data.get("view") if isinstance(data, dict) else "bar")
            if view_mode in ("pie", "donut"):
                top_slice = districts[:6]
                chart_spec = PieChartSpec(
                    title="Leading Districts Share of Score",
                    categories=[d.get("name_en") for d in top_slice],
                    values=[d.get("composite_index") for d in top_slice],
                    variant="donut" if view_mode == "donut" else "pie",
                    data=[{"name": d.get("name_en"), "value": d.get("composite_index")} for d in top_slice],
                    text_summary=f"Distribution of composite index among leading {len(top_slice)} districts.",
                    table_alternative=table_spec,
                )
            else:
                chart_spec = BarChartSpec(
                    title="District Performance Comparison",
                    x_key="district",
                    y_key="score",
                    data=chart_data[:15],
                    text_summary=f"Leaderboard comparing {len(districts)} districts. Top rank is {districts[0].get('name_en') if districts else 'N/A'}.",
                    table_alternative=table_spec,
                )

            components: List[AnyComponentSpec] = [
                HeadingSpec(level=2, text="Maharashtra District Governance Leaderboard"),
            ]
            if top_kpis:
                components.append(top_kpis[0])
            components.extend([chart_spec, table_spec])

            return ViewSpec(
                title="District Governance Leaderboard",
                as_of=as_of,
                source_status=status,
                fallback=fallback,
                components=components,
            )

        if tool_name in ("district_profile", "pillar_breakdown"):
            d_name = data.get("name_en") or data.get("district_name") or "District"
            d_code = data.get("district_code", "MH-XX")
            score = data.get("composite_index", 0.0)
            pillars = data.get("pillars", {})
            raw = data.get("raw_metrics", {})

            kpis = [
                KpiCardSpec(title="Composite Index", value=score, unit="/100", status="positive" if score >= 75 else "neutral"),
                KpiCardSpec(title="Volume Pillar", value=pillars.get("volume", 0), unit="/35"),
                KpiCardSpec(title="Sentiment Pillar", value=pillars.get("sentiment", 0), unit="/35"),
                KpiCardSpec(title="Crisis SLA Pillar", value=pillars.get("crisis_sla", 0), unit="/30", status="critical" if raw.get("active_crisis_tickets", 0) > 0 else "positive"),
            ]

            pillar_rows = [
                {"Pillar": "Information Volume", "Score": pillars.get("volume", 0), "Max": 35, "Detail": f"{raw.get('total_releases', 0)} official releases"},
                {"Pillar": "Net Sentiment", "Score": pillars.get("sentiment", 0), "Max": 35, "Detail": f"{raw.get('net_sentiment', 0):.2f} NSI score"},
                {"Pillar": "Crisis SLA", "Score": pillars.get("crisis_sla", 0), "Max": 30, "Detail": f"{raw.get('active_crisis_tickets', 0)} active rumors"},
            ]

            table_spec = DataTableSpec(
                columns=["Pillar", "Score", "Max", "Detail"],
                rows=pillar_rows,
                caption=f"3-Pillar Breakdown for {d_name} ({d_code})",
            )

            return ViewSpec(
                title=f"District Profile: {d_name} ({d_code})",
                as_of=as_of,
                source_status=status,
                district_code=d_code,
                fallback=fallback,
                components=[
                    HeadingSpec(level=2, text=f"{d_name} ({data.get('name_mr', '')}) — Performance Dossier"),
                    StackSpec(direction="horizontal", children=kpis[:3]),
                    StackSpec(direction="horizontal", children=kpis[3:]),
                    table_spec,
                ],
            )

        if tool_name == "active_rumors":
            tickets = data.get("tickets", []) if isinstance(data, dict) else data
            rows = []
            for t in tickets:
                rows.append({
                    "Ticket ID": t.get("ticket_id"),
                    "Claim": t.get("claim_text", "")[:60],
                    "District": t.get("district_code"),
                    "SLA Remaining": t.get("sla_remaining_formatted", "N/A"),
                    "Urgency": t.get("urgency_level", "NORMAL"),
                })

            table_spec = DataTableSpec(
                columns=["Ticket ID", "Claim", "District", "SLA Remaining", "Urgency"],
                rows=rows,
                caption="Active Crisis & Rumor SLA Queue",
            )

            urgent_count = sum(1 for t in tickets if t.get("urgency_level") == "CRITICAL")
            callout = CalloutSpec(
                type="critical" if urgent_count > 0 else "info",
                message=f"{len(tickets)} pending fact-check tickets active ({urgent_count} critical SLA breaches pending).",
            )

            return ViewSpec(
                title="Active Rumors & Crisis Queue",
                as_of=as_of,
                source_status=status,
                fallback=fallback,
                components=[
                    HeadingSpec(level=2, text="90-Minute Crisis SLA Incident Queue"),
                    callout,
                    table_spec,
                ],
            )

        if tool_name == "division_rollup":
            divisions_data = data.get("divisions", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
            cats = [d.get("division", f"Division {i+1}") for i, d in enumerate(divisions_data)]
            vals = [d.get("composite_index", d.get("district_count", 0.0)) for d in divisions_data]
            tbl_rows = [{"Division": c, "Value": v} for c, v in zip(cats, vals)]
            tbl_spec = DataTableSpec(columns=["Division", "Value"], rows=tbl_rows, caption="Division Breakdown")
            chart_spec = PieChartSpec(
                title="Revenue Division Distribution",
                categories=cats,
                values=vals,
                variant="donut",
                data=[{"name": c, "value": v} for c, v in zip(cats, vals)],
                text_summary=f"Division distribution across {len(cats)} administrative divisions.",
                table_alternative=tbl_spec,
            )
            return ViewSpec(
                title="Division Rollup Overview",
                as_of=as_of,
                source_status=status,
                fallback=fallback,
                components=[
                    HeadingSpec(level=2, text="Administrative Divisions Breakdown"),
                    chart_spec,
                    tbl_spec,
                ],
            )

        if tool_name == "trend":
            trend_points = data.get("points", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
            tbl_rows = [{"Date": p.get("date", f"Day {i+1}"), "Score": p.get("score", 0.0)} for i, p in enumerate(trend_points)]
            tbl_spec = DataTableSpec(columns=["Date", "Score"], rows=tbl_rows, caption="Historical Trend")
            chart_spec = LineChartSpec(
                title="Historical Governance Trajectory",
                x_key="day",
                y_key="score",
                data=[{"day": p.get("date", f"Day {i+1}"), "score": p.get("score", 0.0)} for i, p in enumerate(trend_points)],
                text_summary=f"Temporal trend over {len(trend_points)} points.",
                table_alternative=tbl_spec,
            )
            return ViewSpec(
                title="Governance Trajectory Trend",
                as_of=as_of,
                source_status=status,
                fallback=fallback,
                components=[
                    HeadingSpec(level=2, text="Governance Performance Trend"),
                    chart_spec,
                    tbl_spec,
                ],
            )

        # Default fallback view for any other tool
        return ViewSpec(
            title=f"Data Summary: {tool_name.replace('_', ' ').title()}",
            as_of=as_of,
            source_status=status,
            fallback=fallback,
            components=[
                HeadingSpec(level=2, text=f"Query Output — {tool_name}"),
                TextSpec(content=f"Report generated as of {as_of} with status '{status}'."),
                DataTableSpec(
                    columns=["Key", "Value"],
                    rows=[{"Key": str(k), "Value": str(v)} for k, v in (data.items() if isinstance(data, dict) else enumerate(data))],
                    caption="Structured Metric Records",
                ),
            ],
        )
