"""Entity Linking & Multilingual Time-Phrase Parsing for EUREKA Nirdeshak v2.

Provides:
1. In-memory alias tables for:
   - districts (36 districts with Marathi, English, historical & colloquial aliases)
   - departments (18+ Maharashtra govt departments with abbreviations and aliases)
   - schemes (Flagship welfare schemes in Maharashtra)
   - officials (Key governance & administrative roles)
   - outlets (Major print newspapers & TV broadcast outlets)
2. Character trigram fuzzy matching with configurable similarity thresholds.
3. Multilingual time-phrase parser (English, Marathi, Hindi) resolving to bounded (start_date, end_date) windows.
"""

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import re
from typing import Any, Dict, List, Optional, Set, Tuple

from eureka.core.reference_data import DISTRICTS, DISTRICT_ALIASES, DEPARTMENT_CODES_EN
from eureka.copilot.verifier import normalize_numerals


@dataclass(frozen=True)
class EntityLinkResult:
    """Linked entity canonical representation."""
    canonical_id: str
    name: str
    category: str
    matched_term: str
    match_type: str  # "exact", "substring", "trigram_fuzzy"
    score: float
    properties: Dict[str, Any]


@dataclass(frozen=True)
class TimeWindow:
    """Parsed time window for retrieval and scoped queries."""
    start_date: datetime
    end_date: datetime
    phrase: str
    window_type: str  # "hours_24", "hours_48", "days_7", "days_30", "today", "yesterday", "custom"


def compute_trigrams(text: str) -> Set[str]:
    """Compute character trigrams of a normalized text string."""
    norm = re.sub(r"[^\w\s]", "", text.strip().lower())
    if len(norm) < 3:
        return {norm} if norm else set()
    # Include word-boundary padding for trigrams
    padded = f" {norm} "
    return {padded[i:i+3] for i in range(len(padded) - 2)}


def trigram_similarity(s1: str, s2: str) -> float:
    """Calculate character trigram Dice similarity between two strings."""
    t1 = compute_trigrams(s1)
    t2 = compute_trigrams(s2)
    if not t1 or not t2:
        return 1.0 if s1.strip().lower() == s2.strip().lower() else 0.0
    intersection = len(t1 & t2)
    return 2.0 * intersection / (len(t1) + len(t2))


# In-memory alias catalog: alias -> (canonical_id, name, category, properties)
ALIAS_CATALOG: List[Tuple[str, str, str, str, Dict[str, Any]]] = []


def _initialize_alias_catalog():
    global ALIAS_CATALOG
    if ALIAS_CATALOG:
        return

    # 1. Districts (36)
    for code, div, name_en, name_mr, former in DISTRICTS:
        props = {"code": code, "division": div, "name_en": name_en, "name_mr": name_mr}
        ALIAS_CATALOG.append((name_en.lower(), code, name_en, "district", props))
        ALIAS_CATALOG.append((name_mr.lower(), code, name_en, "district", props))
        if former:
            ALIAS_CATALOG.append((former.lower(), code, name_en, "district", props))

    for alias_mr, code, lang, note in DISTRICT_ALIASES:
        # Lookup English name from DISTRICTS
        d_en = next((d[2] for d in DISTRICTS if d[0] == code), code)
        div = next((d[1] for d in DISTRICTS if d[0] == code), "DIV-MUM")
        props = {"code": code, "division": div, "name_en": d_en}
        ALIAS_CATALOG.append((alias_mr.strip().lower(), code, d_en, "district", props))

    # Additional district nicknames & common transliterations
    extra_districts = [
        ("pune", "MH-07", "Pune", "district", {"code": "MH-07", "division": "DIV-PUN"}),
        ("poona", "MH-07", "Pune", "district", {"code": "MH-07", "division": "DIV-PUN"}),
        ("puney", "MH-07", "Pune", "district", {"code": "MH-07", "division": "DIV-PUN"}),
        ("पुणे", "MH-07", "Pune", "district", {"code": "MH-07", "division": "DIV-PUN"}),
        ("mumbai", "MH-01", "Mumbai City", "district", {"code": "MH-01", "division": "DIV-MUM"}),
        ("bombay", "MH-01", "Mumbai City", "district", {"code": "MH-01", "division": "DIV-MUM"}),
        ("मुंबई", "MH-01", "Mumbai City", "district", {"code": "MH-01", "division": "DIV-MUM"}),
        ("aurangabad", "MH-17", "Chhatrapati Sambhajinagar", "district", {"code": "MH-17", "division": "DIV-CSN"}),
        ("संभाजीनगर", "MH-17", "Chhatrapati Sambhajinagar", "district", {"code": "MH-17", "division": "DIV-CSN"}),
        ("छत्रपती संभाजीनगर", "MH-17", "Chhatrapati Sambhajinagar", "district", {"code": "MH-17", "division": "DIV-CSN"}),
        ("औरंगाबाद", "MH-17", "Chhatrapati Sambhajinagar", "district", {"code": "MH-17", "division": "DIV-CSN"}),
        ("osmanabad", "MH-14", "Dharashiv", "district", {"code": "MH-14", "division": "DIV-LAT"}),
        ("धाराशिव", "MH-14", "Dharashiv", "district", {"code": "MH-14", "division": "DIV-LAT"}),
        ("उस्मानाबाद", "MH-14", "Dharashiv", "district", {"code": "MH-14", "division": "DIV-LAT"}),
        ("ahmednagar", "MH-25", "Ahilyanagar", "district", {"code": "MH-25", "division": "DIV-NSK"}),
        ("अहिल्यानगर", "MH-25", "Ahilyanagar", "district", {"code": "MH-25", "division": "DIV-NSK"}),
        ("अहमदनगर", "MH-25", "Ahilyanagar", "district", {"code": "MH-25", "division": "DIV-NSK"}),
        ("palghar", "MH-03", "Palghar", "district", {"code": "MH-03", "division": "DIV-KON"}),
        ("पालघर", "MH-03", "Palghar", "district", {"code": "MH-03", "division": "DIV-KON"}),
        ("thane", "MH-04", "Thane", "district", {"code": "MH-04", "division": "DIV-KON"}),
        ("ठाणे", "MH-04", "Thane", "district", {"code": "MH-04", "division": "DIV-KON"}),
        ("nagpur", "MH-31", "Nagpur", "district", {"code": "MH-31", "division": "DIV-NGP"}),
        ("नागपूर", "MH-31", "Nagpur", "district", {"code": "MH-31", "division": "DIV-NGP"}),
        ("beed", "MH-20", "Beed", "district", {"code": "MH-20", "division": "DIV-CSN"}),
        ("बीड", "MH-20", "Beed", "district", {"code": "MH-20", "division": "DIV-CSN"}),
        ("bid", "MH-20", "Beed", "district", {"code": "MH-20", "division": "DIV-CSN"}),
        ("solapur", "MH-09", "Solapur", "district", {"code": "MH-09", "division": "DIV-PUN"}),
        ("सोलापूर", "MH-09", "Solapur", "district", {"code": "MH-09", "division": "DIV-PUN"}),
        ("nashik", "MH-21", "Nashik", "district", {"code": "MH-21", "division": "DIV-NSK"}),
        ("नाशिक", "MH-21", "Nashik", "district", {"code": "MH-21", "division": "DIV-NSK"}),
        ("satara", "MH-08", "Satara", "district", {"code": "MH-08", "division": "DIV-PUN"}),
        ("सातारा", "MH-08", "Satara", "district", {"code": "MH-08", "division": "DIV-PUN"}),
        ("kolhapur", "MH-10", "Kolhapur", "district", {"code": "MH-10", "division": "DIV-KOL"}),
        ("कोल्हापूर", "MH-10", "Kolhapur", "district", {"code": "MH-10", "division": "DIV-KOL"}),
        ("amravati", "MH-26", "Amravati", "district", {"code": "MH-26", "division": "DIV-AMT"}),
        ("अमरावती", "MH-26", "Amravati", "district", {"code": "MH-26", "division": "DIV-AMT"}),
        ("latur", "MH-13", "Latur", "district", {"code": "MH-13", "division": "DIV-LAT"}),
        ("लातूर", "MH-13", "Latur", "district", {"code": "MH-13", "division": "DIV-LAT"}),
    ]
    for alias, code, name, cat, props in extra_districts:
        ALIAS_CATALOG.append((alias.lower(), code, name, cat, props))

    # 2. Departments
    for code, name_en in DEPARTMENT_CODES_EN.items():
        props = {"code": code, "name_en": name_en}
        ALIAS_CATALOG.append((name_en.lower(), code, name_en, "department", props))
        # Short forms (e.g. "Public Health", "Revenue", "Agriculture", "Home")
        short = name_en.replace(" Department", "").replace(" and Drugs", "").replace(" and Forest", "")
        ALIAS_CATALOG.append((short.lower(), code, name_en, "department", props))

    dept_aliases_mr = [
        ("सार्वजनिक आरोग्य विभाग", "DEPT-PH", "Public Health Department"),
        ("आरोग्य विभाग", "DEPT-PH", "Public Health Department"),
        ("आरोग्य", "DEPT-PH", "Public Health Department"),
        ("health department", "DEPT-PH", "Public Health Department"),
        ("गृह विभाग", "DEPT-HOME", "Home Department"),
        ("गृह", "DEPT-HOME", "Home Department"),
        ("महसूल विभाग", "DEPT-REV", "Revenue and Forest Department"),
        ("महसूल", "DEPT-REV", "Revenue and Forest Department"),
        ("revenue", "DEPT-REV", "Revenue and Forest Department"),
        ("कृषी विभाग", "DEPT-AGRI", "Agriculture Department"),
        ("कृषी", "DEPT-AGRI", "Agriculture Department"),
        ("agriculture", "DEPT-AGRI", "Agriculture Department"),
        ("शालेय शिक्षण विभाग", "DEPT-SES", "School Education and Sports Department"),
        ("शिक्षण विभाग", "DEPT-SES", "School Education and Sports Department"),
        ("महिला व बालविकास विभाग", "DEPT-WCD", "Women and Child Development Department"),
        ("महिला व बालविकास", "DEPT-WCD", "Women and Child Development Department"),
        ("जलसंपदा विभाग", "DEPT-WR", "Water Resources Department"),
        ("जलसंपदा", "DEPT-WR", "Water Resources Department"),
        ("नगर विकास विभाग", "DEPT-UD", "Urban Development Department"),
        ("सार्वजनिक बांधकाम विभाग", "DEPT-PWD", "Public Works Department"),
        ("पीडब्ल्यूडी", "DEPT-PWD", "Public Works Department"),
        ("माहिती तंत्रज्ञान विभाग", "DEPT-IT", "Information Technology Department"),
    ]
    for alias, code, name in dept_aliases_mr:
        ALIAS_CATALOG.append((alias.lower(), code, name, "department", {"code": code, "name_en": name}))

    # 3. Schemes
    schemes = [
        ("मुख्यमंत्री माझी लाडकी बहीण योजना", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("माझी लाडकी बहीण", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("लाडकी बहीण", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("ladki bahin", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("ladki bahin yojana", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("majhi ladki bahin", "SCHEME-LADKI-BAHIN", "Majhi Ladki Bahin Yojana"),
        ("जलयुक्त शिवार", "SCHEME-JALYUKT-SHIVAR", "Jalyukt Shivar Abhiyan"),
        ("जलयुक्त शिवार २.०", "SCHEME-JALYUKT-SHIVAR", "Jalyukt Shivar Abhiyan"),
        ("jalyukt shivar", "SCHEME-JALYUKT-SHIVAR", "Jalyukt Shivar Abhiyan"),
        ("महात्मा जोतीराव फुले जन आरोग्य योजना", "SCHEME-MJPJAY", "MJPJAY Health Assurance"),
        ("महात्मा फुले जन आरोग्य योजना", "SCHEME-MJPJAY", "MJPJAY Health Assurance"),
        ("mjpjay", "SCHEME-MJPJAY", "MJPJAY Health Assurance"),
        ("जन आरोग्य योजना", "SCHEME-MJPJAY", "MJPJAY Health Assurance"),
        ("नमो शेतकरी महासन्मान निधी", "SCHEME-NAMO-SHETKARI", "Namo Shetkari Mahasanman"),
        ("नमो शेतकरी", "SCHEME-NAMO-SHETKARI", "Namo Shetkari Mahasanman"),
        ("namo shetkari", "SCHEME-NAMO-SHETKARI", "Namo Shetkari Mahasanman"),
        ("मुख्यमंत्री युवा कार्य प्रशिक्षण योजना", "SCHEME-LADKA-BHAU", "Mukhyamantri Yuva Karya Prashikshan"),
        ("लाडका भाऊ", "SCHEME-LADKA-BHAU", "Mukhyamantri Yuva Karya Prashikshan"),
        ("ladka bhau", "SCHEME-LADKA-BHAU", "Mukhyamantri Yuva Karya Prashikshan"),
        ("मुख्यमंत्री अन्नपूर्णा योजना", "SCHEME-ANNAPURNA", "Mukhyamantri Annapurna Yojana"),
        ("अन्नपूर्णा योजना", "SCHEME-ANNAPURNA", "Mukhyamantri Annapurna Yojana"),
        ("annapurna yojana", "SCHEME-ANNAPURNA", "Mukhyamantri Annapurna Yojana"),
        ("लेक लाडकी योजना", "SCHEME-LEK-LADKI", "Lek Ladki Yojana"),
        ("lek ladki", "SCHEME-LEK-LADKI", "Lek Ladki Yojana"),
        ("संजय गांधी निराधार योजना", "SCHEME-SANJAY-GANDHI", "Sanjay Gandhi Niradhar Yojana"),
        ("sanjay gandhi niradhar", "SCHEME-SANJAY-GANDHI", "Sanjay Gandhi Niradhar Yojana"),
    ]
    for alias, code, name in schemes:
        ALIAS_CATALOG.append((alias.lower(), code, name, "scheme", {"code": code, "name_en": name}))

    # 4. Officials / Leadership Positions
    officials = [
        ("collector", "OFFICIAL-COLLECTOR", "District Collector"),
        ("district collector", "OFFICIAL-COLLECTOR", "District Collector"),
        ("जिल्हाधिकारी", "OFFICIAL-COLLECTOR", "District Collector"),
        ("डीएम", "OFFICIAL-COLLECTOR", "District Collector"),
        ("dm", "OFFICIAL-COLLECTOR", "District Collector"),
        ("जिल्हा दंडाधिकारी", "OFFICIAL-COLLECTOR", "District Collector"),
        ("district information officer", "OFFICIAL-DIO", "District Information Officer"),
        ("dio", "OFFICIAL-DIO", "District Information Officer"),
        ("जिल्हा माहिती अधिकारी", "OFFICIAL-DIO", "District Information Officer"),
        ("माहिती अधिकारी", "OFFICIAL-DIO", "District Information Officer"),
        ("डीआयओ", "OFFICIAL-DIO", "District Information Officer"),
        ("guardian minister", "OFFICIAL-GUARDIAN-MINISTER", "Guardian Minister"),
        ("पालकमंत्री", "OFFICIAL-GUARDIAN-MINISTER", "Guardian Minister"),
        ("पालक मंत्री", "OFFICIAL-GUARDIAN-MINISTER", "Guardian Minister"),
        ("superintendent of police", "OFFICIAL-SP", "Superintendent of Police"),
        ("sp", "OFFICIAL-SP", "Superintendent of Police"),
        ("पोलीस अधीक्षक", "OFFICIAL-SP", "Superintendent of Police"),
        ("एसपी", "OFFICIAL-SP", "Superintendent of Police"),
        ("chief minister", "OFFICIAL-CM", "Chief Minister"),
        ("cm", "OFFICIAL-CM", "Chief Minister"),
        ("मुख्यमंत्री", "OFFICIAL-CM", "Chief Minister"),
        ("सीएम", "OFFICIAL-CM", "Chief Minister"),
        ("deputy chief minister", "OFFICIAL-DCM", "Deputy Chief Minister"),
        ("dcm", "OFFICIAL-DCM", "Deputy Chief Minister"),
        ("उपमुख्यमंत्री", "OFFICIAL-DCM", "Deputy Chief Minister"),
        ("divisional commissioner", "OFFICIAL-DIV-COMM", "Divisional Commissioner"),
        ("विभागीय आयुक्त", "OFFICIAL-DIV-COMM", "Divisional Commissioner"),
        ("municipal commissioner", "OFFICIAL-MC", "Municipal Commissioner"),
        ("महानगरपालिका आयुक्त", "OFFICIAL-MC", "Municipal Commissioner"),
        ("मनपा आयुक्त", "OFFICIAL-MC", "Municipal Commissioner"),
        ("zp ceo", "OFFICIAL-ZP-CEO", "Zilla Parishad CEO"),
        ("मुख्य कार्यकारी अधिकारी", "OFFICIAL-ZP-CEO", "Zilla Parishad CEO"),
    ]
    for alias, code, name in officials:
        ALIAS_CATALOG.append((alias.lower(), code, name, "official", {"code": code, "name_en": name}))

    # 5. Outlets (Press / TV / Digital)
    outlets = [
        ("lokmat", "OUTLET-LOKMAT", "Lokmat"),
        ("लोकमत", "OUTLET-LOKMAT", "Lokmat"),
        ("sakal", "OUTLET-SAKAL", "Sakal"),
        ("सकाळ", "OUTLET-SAKAL", "Sakal"),
        ("maharashtra times", "OUTLET-MT", "Maharashtra Times"),
        ("महाराष्ट्र टाइम्स", "OUTLET-MT", "Maharashtra Times"),
        ("मटा", "OUTLET-MT", "Maharashtra Times"),
        ("pudhari", "OUTLET-PUDHARI", "Pudhari"),
        ("पुढारी", "OUTLET-PUDHARI", "Pudhari"),
        ("loksatta", "OUTLET-LOKSATTA", "Loksatta"),
        ("लोकसत्ता", "OUTLET-LOKSATTA", "Loksatta"),
        ("divya marathi", "OUTLET-DIVYA-MARATHI", "Divya Marathi"),
        ("दिव्य मराठी", "OUTLET-DIVYA-MARATHI", "Divya Marathi"),
        ("saamana", "OUTLET-SAAMANA", "Saamana"),
        ("सामना", "OUTLET-SAAMANA", "Saamana"),
        ("abp majha", "OUTLET-ABP-MAJHA", "ABP Majha"),
        ("एबीपी माझा", "OUTLET-ABP-MAJHA", "ABP Majha"),
        ("zee 24 taas", "OUTLET-ZEE-24-TAAS", "Zee 24 Taas"),
        ("झी २४ तास", "OUTLET-ZEE-24-TAAS", "Zee 24 Taas"),
        ("tv9 marathi", "OUTLET-TV9-MARATHI", "TV9 Marathi"),
        ("टीव्ही ९ मराठी", "OUTLET-TV9-MARATHI", "TV9 Marathi"),
        ("news18 lokmat", "OUTLET-NEWS18-LOKMAT", "News18 Lokmat"),
        ("न्यूज १८ लोकमत", "OUTLET-NEWS18-LOKMAT", "News18 Lokmat"),
        ("saam tv", "OUTLET-SAAM-TV", "Saam TV"),
        ("साम टीव्ही", "OUTLET-SAAM-TV", "Saam TV"),
    ]
    for alias, code, name in outlets:
        ALIAS_CATALOG.append((alias.lower(), code, name, "outlet", {"code": code, "name_en": name}))


def link_entities(text: str, threshold: float = 0.65) -> List[EntityLinkResult]:
    """Scan query or text for recognized entities using exact, substring, and trigram fuzzy matching."""
    _initialize_alias_catalog()

    if not text:
        return []

    norm_text = normalize_numerals(text).strip().lower()
    # Tokenize text into words & n-grams (up to 4 tokens)
    words = re.findall(r"[\w\u0900-\u097F]+", norm_text)
    ngrams: List[Tuple[str, int]] = []
    for n in range(1, 5):
        for i in range(len(words) - n + 1):
            ngrams.append((" ".join(words[i:i+n]), n))

    results_by_canonical: Dict[str, EntityLinkResult] = {}

    for alias, canonical_id, name, category, props in ALIAS_CATALOG:
        alias_norm = alias.strip().lower()
        if not alias_norm:
            continue

        # 1. Exact match in full text or boundary match
        pattern = r"(?<!\w)" + re.escape(alias_norm) + r"(?!\w)"
        if re.search(pattern, norm_text):
            res = EntityLinkResult(
                canonical_id=canonical_id,
                name=name,
                category=category,
                matched_term=alias,
                match_type="exact",
                score=1.0,
                properties=props,
            )
            # Retain highest scoring match per canonical entity
            if canonical_id not in results_by_canonical or results_by_canonical[canonical_id].score < 1.0:
                results_by_canonical[canonical_id] = res
            continue

        # 2. Substring match for longer aliases (>= 4 chars)
        if len(alias_norm) >= 4 and alias_norm in norm_text:
            res = EntityLinkResult(
                canonical_id=canonical_id,
                name=name,
                category=category,
                matched_term=alias,
                match_type="substring",
                score=0.92,
                properties=props,
            )
            if canonical_id not in results_by_canonical or results_by_canonical[canonical_id].score < 0.92:
                results_by_canonical[canonical_id] = res
            continue

        # 3. Trigram fuzzy matching against n-grams of similar length
        # Only evaluate if length within +/- 4 characters
        alias_len = len(alias_norm)
        for cand, n in ngrams:
            if abs(len(cand) - alias_len) > 3:
                continue
            sim = trigram_similarity(cand, alias_norm)
            if sim >= threshold:
                res = EntityLinkResult(
                    canonical_id=canonical_id,
                    name=name,
                    category=category,
                    matched_term=cand,
                    match_type="trigram_fuzzy",
                    score=round(sim, 3),
                    properties=props,
                )
                if canonical_id not in results_by_canonical or results_by_canonical[canonical_id].score < sim:
                    results_by_canonical[canonical_id] = res

    # Sort results by score descending, then longest matched term
    sorted_results = sorted(
        results_by_canonical.values(),
        key=lambda r: (r.score, len(r.matched_term)),
        reverse=True,
    )
    return sorted_results


def parse_time_phrase(text: str, reference_date: Optional[datetime] = None) -> Optional[TimeWindow]:
    """Parse multilingual temporal expressions (English, Marathi, Hindi) into a bounded datetime window.
    
    Supports:
    - 24 hours: "last 24 hours", "past 24 hours", "गेल्या २४ तासांत", "मागील २४ तास", "पिछले २४ घंटे"
    - 48 hours: "last 48 hours", "गेल्या ४८ तासांत", "पिछले ४८ घंटे"
    - Today: "today", "आज", "आजचे", "आज का"
    - Yesterday: "yesterday", "काल", "कालचे", "कल"
    - 7 days: "last 7 days", "past week", "गेल्या ७ दिवसांत", "मागील आठवडा", "पिछले ७ दिन", "पिछले हफ्ते"
    - 30 days / month: "last 30 days", "past month", "गेल्या ३० दिवसांत", "मागील महिना", "पिछले ३० दिन"
    """
    if not text:
        return None

    now = reference_date or datetime.now(timezone.utc)
    norm = normalize_numerals(text).strip().lower()

    # 1. 24 hours
    p_24h = re.compile(r"(?:last|past)\s+24\s*(?:hours|hrs)|(?:गेल्या|मागील)\s*24\s*तास(?:ांत)?|पिछले\s*24\s*घंटे")
    if p_24h.search(norm):
        return TimeWindow(
            start_date=now - timedelta(hours=24),
            end_date=now,
            phrase="last 24 hours",
            window_type="hours_24",
        )

    # 2. 48 hours
    p_48h = re.compile(r"(?:last|past)\s+48\s*(?:hours|hrs)|(?:गेल्या|मागील)\s*48\s*तास(?:ांत)?|पिछले\s*48\s*घंटे")
    if p_48h.search(norm):
        return TimeWindow(
            start_date=now - timedelta(hours=48),
            end_date=now,
            phrase="last 48 hours",
            window_type="hours_48",
        )

    # 3. Today
    p_today = re.compile(r"\btoday\b|\bआज\b|\bआजचे\b|\bआजचा\b|\bआज का\b")
    if p_today.search(norm):
        start_today = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=now.tzinfo)
        return TimeWindow(
            start_date=start_today,
            end_date=now,
            phrase="today",
            window_type="today",
        )

    # 4. Yesterday
    p_yesterday = re.compile(r"\byesterday\b|\bकाल\b|\bकालचे\b|\bकालचा\b|\bकल\b|\bकल का\b")
    if p_yesterday.search(norm):
        start_yest = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=now.tzinfo) - timedelta(days=1)
        end_yest = datetime(now.year, now.month, now.day, 23, 59, 59, tzinfo=now.tzinfo) - timedelta(days=1)
        return TimeWindow(
            start_date=start_yest,
            end_date=end_yest,
            phrase="yesterday",
            window_type="yesterday",
        )

    # 5. 7 days / Past week
    p_7d = re.compile(r"(?:last|past)\s+(?:7\s*days|week)|(?:गेल्या|मागील)\s*(?:7\s*दिवस(?:ांत)?|आठवडा|आठवड्यात)|पिछले\s*(?:7\s*दिन|हफ्ते|सप्ताह)")
    if p_7d.search(norm):
        return TimeWindow(
            start_date=now - timedelta(days=7),
            end_date=now,
            phrase="past 7 days",
            window_type="days_7",
        )

    # 6. 30 days / Past month
    p_30d = re.compile(r"(?:last|past)\s+(?:30\s*days|month)|(?:गेल्या|मागील)\s*(?:30\s*दिवस(?:ांत)?|महिना|महिन्यात)|पिछले\s*(?:30\s*दिन|महीने)")
    if p_30d.search(norm):
        return TimeWindow(
            start_date=now - timedelta(days=30),
            end_date=now,
            phrase="past 30 days",
            window_type="days_30",
        )

    # 7. Generic N days (e.g. "past 14 days", "गेल्या १४ दिवसांत", "पिछले १५ दिन")
    p_ndays = re.compile(r"(?:last|past|गेल्या|मागील|पिछले)\s*(\d{1,3})\s*(?:days|दिवस|दिवसांत|दिन)")
    m_n = p_ndays.search(norm)
    if m_n:
        days = int(m_n.group(1))
        return TimeWindow(
            start_date=now - timedelta(days=days),
            end_date=now,
            phrase=f"past {days} days",
            window_type="custom",
        )

    return None
