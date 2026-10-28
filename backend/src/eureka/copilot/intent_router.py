"""Fast-Path Deterministic Intent Router for EUREKA Open UI Copilot v4.

Matches queries instantly (<5ms) using Marathi, Hindi, and English domain keywords
and the authoritative alias table without waiting for an LLM call.
Enables sub-second (<1.5s) Time-to-First-View by executing governed tools directly.
"""

import re
from typing import Optional, Tuple, Dict, Any, List

from eureka.copilot.verifier import normalize_numerals
from eureka.copilot.tools import (
    CopilotPrincipal,
    extract_district_from_query,
    normalize_district_code,
    tool_league_table,
    LeagueTableArgs,
    tool_district_profile,
    DistrictProfileArgs,
    tool_compare_districts,
    CompareDistrictsArgs,
    tool_active_rumors,
    ActiveRumorsArgs,
    tool_forecast,
    ForecastArgs,
    tool_neighbors,
    NeighborsArgs,
)


def match_fast_path(
    query: str, principal: CopilotPrincipal
) -> Optional[Tuple[str, Dict[str, Any], Dict[str, Any]]]:
    """Inspects query text and returns (tool_name, tool_args_dict, tool_result) if a fast path matches.

    Returns None if the query requires conversational LLM exploration.
    """
    if not query:
        return None

    norm_query = normalize_numerals(query)
    q_lower = norm_query.strip().lower()

    # 0. ABSTENTION / RESTRICTION PRE-CHECKS
    # Out-of-scope, ungrounded, or distant future queries must NOT take fast path shortcuts.
    if re.search(r'\b(20[3-9]\d|2100)\b', norm_query):
        return None
    if re.search(r'\b(mh-?99|atlantis|काल्पनिक|सूर्यपुर|crypto)\b', q_lower):
        return None
    if any(k in q_lower for k in ["किस राजनीतिक नेता", "कोणत्या नेत्यामुळे", "दंगा", "हवामान", "लोकसंख्या", "secret file", "गुप्त माहिती"]):
        return None

    # 1. COMPARE INTENTS (e.g. "compare Nashik and Ahilyanagar", "तुलना करा")
    compare_triggers = ["compare", "versus", " vs ", "तुलना", "मुकाबला"]
    if any(t in q_lower for t in compare_triggers) or " and " in q_lower or " व " in q_lower:
        # Extract multiple district codes
        # Find all mentions of districts
        from eureka.copilot.tools import ALIAS_TO_DISTRICT_CODE
        found_codes: List[str] = []
        
        # Check explicit MH-XX
        for m in re.finditer(r'\b(MH-?\d{1,2})\b', query, re.IGNORECASE):
            c = normalize_district_code(m.group(1))
            if c and c not in found_codes:
                found_codes.append(c)

        # Check aliases
        sorted_aliases = sorted(ALIAS_TO_DISTRICT_CODE.items(), key=lambda x: len(x[0]), reverse=True)
        for alias, code in sorted_aliases:
            if re.search(r'[a-zA-Z]', alias):
                if re.search(r'\b' + re.escape(alias) + r'\b', q_lower):
                    if code not in found_codes:
                        found_codes.append(code)
            else:
                if alias in query:
                    if code not in found_codes:
                        found_codes.append(code)
            if len(found_codes) >= 5:
                break

        if len(found_codes) >= 2:
            args = CompareDistrictsArgs(district_codes=found_codes[:5])
            res = tool_compare_districts(principal, args)
            return "compare_districts", args.model_dump(), res

    # 2. ACTIVE RUMORS / FACT CHECK / CRISIS (e.g. "active rumors", "अफवा", "फॅक्ट चेक")
    rumor_triggers = [
        "rumor", "rumour", "fact check", "fact-check", "fake news", "sla", "countdown",
        "अफवा", "खोट्या बातम्या", "तथ्य तपासणी", "अफ़वाह"
    ]
    if any(t in q_lower for t in rumor_triggers):
        d_code = extract_district_from_query(query, principal)
        args_r = ActiveRumorsArgs(district_code=d_code)
        res_r = tool_active_rumors(principal, args_r)
        return "active_rumors", args_r.model_dump(), res_r

    # 3. FORECAST / SPREAD / STGNN (e.g. "forecast", "diffusion", "अंदाज", "प्रसार")
    forecast_triggers = [
        "forecast", "predict", "diffusion", "spread", "stgnn", "अंदाज", "प्रसार", "भविष्यवाणी"
    ]
    if any(t in q_lower for t in forecast_triggers):
        d_code = extract_district_from_query(query, principal) or principal.district_code or "MH-04"
        args_f = ForecastArgs(district_code=d_code)
        res_f = tool_forecast(principal, args_f)
        return "forecast", args_f.model_dump(), res_f

    # 4. NEIGHBORS / ADJACENCY / BORDERS (e.g. "neighbors", "borders", "शेजारील जिल्हे")
    neighbor_triggers = [
        "neighbor", "neighbour", "border", "adjacent", "शेजारी", "सीमा", "पड़ोसी"
    ]
    if any(t in q_lower for t in neighbor_triggers):
        d_code = extract_district_from_query(query, principal) or principal.district_code or "MH-04"
        args_n = NeighborsArgs(district_code=d_code)
        res_n = tool_neighbors(principal, args_n)
        return "neighbors", args_n.model_dump(), res_n

    # 5. DISTRICT PROFILE (e.g. "how many news are there about thane", "ठाणे माहिती", "profile of Nashik")
    d_code = extract_district_from_query(query, principal)
    if d_code:
        # Check if query is about a specific district rather than the whole state
        args_p = DistrictProfileArgs(district_code=d_code)
        res_p = tool_district_profile(principal, args_p)
        return "district_profile", args_p.model_dump(), res_p

    # 6. LEADERBOARD / LEAGUE TABLE (e.g. "top 5 districts", "rankings", "leaderboard", "सर्वोत्तम जिल्हे")
    table_triggers = [
        "leaderboard", "league", "rank", "top", "bottom", "score", "index", "performance",
        "गुणवत्ता", "क्रमवारी", "सर्वोत्तम", "रँकिंग", "तालिका"
    ]
    if any(t in q_lower for t in table_triggers) or "district" in q_lower or "जिल्ह" in query or "division" in q_lower or "विभाग" in query:
        preferred_view = "bar"
        if any(w in q_lower for w in ["pie", "donut", "breakdown", "share", "distribution", "वाटा", "विभागणी", "टक्केवारी"]):
            preferred_view = "donut" if "donut" in q_lower else "pie"
        args_l = LeagueTableArgs(view=preferred_view)
        res_l = tool_league_table(principal, args_l)
        res_l["view"] = preferred_view
        return "league_table", args_l.model_dump(), res_l

    return None
