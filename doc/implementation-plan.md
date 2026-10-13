# Maha-Command Center — Implementation Plan

> **Document type:** UI/UX implementation strategy
> **Perspective:** Principal Frontend Architect & Senior Enterprise UI/UX Designer

---

## 1. Design Philosophy

### Core Principles

1. **Data-first, not decoration-first.** Every pixel serves an operational purpose. The dashboard communicates statewide publicity performance, district rankings, active crises, and live media ingestion — not visual novelty.

2. **Institutional credibility.** This is a Maharashtra Government administrative system. The design must feel like a mature, dependable public-sector tool — not a SaaS analytics demo, a cybersecurity terminal, or a futuristic command center concept.

3. **Monochrome discipline.** Strict grayscale palette with no colored accents. State is communicated through typography weight, border emphasis, spatial hierarchy, and text labels — never through color alone.

4. **Fixed architecture, improved execution.** The five-zone structure is non-negotiable. The information architecture comes from the existing product blueprint. Our job is to make it visually precise, consistent, and professional.

---

## 2. Visual Strategy

### Hierarchy Communication

The dashboard has three tiers of visual importance:

```
Tier 1 (Primary):   KPI Ribbon + Emergency Alerts
                     ↳ Largest type, strongest borders, highest surface contrast

Tier 2 (Analytical): District Leaderboard + CPI Decomposition + OCR Feed
                     ↳ Standard panels, data-dense tables and charts

Tier 3 (Overview):   Leadership Overview (4 panels)
                     ↳ Slightly reduced visual weight, secondary section heading
```

### Surface Strategy

- **One level of surface only.** White panels (`#FFFFFF`) sit on the page canvas (`#F5F6F7`). No cards-within-cards, no nested surfaces.
- **Panel boundaries:** 1px `#DADCE0` border + 4px border-radius. No shadows except a barely perceptible `0 1px 2px rgba(0,0,0,0.04)` if needed for panel definition.
- **Internal separation:** Subtle dividers (`#E8EAED`) between sections within a panel. Never thick borders around every cell.

### Typography Strategy

- **KPI values:** `1.75rem` (28px) semibold — prominent but not oversized. The numbers should be scannable at a glance, not shouting.
- **Panel headings:** `1rem` (16px) semibold — clear section labels, not decorative banners.
- **Table data:** `0.8125rem` (13px) normal — compact, scannable, high-density.
- **Metadata:** `0.75rem` (12px) muted — timestamps, comparison periods, processing latency.

### Spacing Strategy

The 16px gap between zones creates a consistent visual rhythm. Internal panel padding is also 16px. This creates a harmonious ratio where zone gaps and internal breathing room feel intentional and related.

```
┌─ 16px padding ─┐
│                 │
│  Panel content  │  ← 16px zone gap between panels
│                 │
└─ 16px padding ─┘
     ↕ 16px gap
┌─ 16px padding ─┐
│                 │
│  Next panel     │
│                 │
└─ 16px padding ─┘
```

---

## 3. Zone-by-Zone Implementation Strategy

### Zone 1 — KPI Ribbon

**Design approach:** Four equal-width cards in a single row. Each card is a self-contained metric summary with strict vertical alignment across all four cards.

**Implementation notes:**
- CSS Grid `grid-cols-4` ensures exact equal widths
- Use a consistent internal layout: icon + label row → value row → target row → trend row
- Trend arrows (▲ ▼) are Unicode characters styled as text, not separate icon components
- The "vs. previous 7 days" label anchors the comparison and appears in muted text at the bottom

**Key decision:** The primary value typography is `1.75rem` (28px) — large enough to scan quickly from a distance, but restrained enough that the KPI ribbon doesn't visually overpower the analytical zones below.

### Zone 2 — District Leaderboard

**Design approach:** This is the primary interaction surface. The chart serves as a visual summary; the table is where the real work happens.

**Implementation notes:**
- Chart and table share the same filtered dataset. Filtering the division dropdown updates both simultaneously.
- The bar chart shows **Top 5 only** — a compact summary, not a complete visualization of all districts.
- Table columns use right-aligned numerics with consistent decimal/unit formatting.
- Row selection is the bridge to Zone 3 — clicking a row immediately updates the CPI decomposition panel.
- The "View" button in the Action column could open a detailed district modal or navigate to the District Operations page.

**Key decision:** The chart occupies approximately 40% of the zone width (or sits above the table on narrow screens). It provides spatial context for the table rankings without dominating the panel.

### Zone 3 — CPI Score Decomposition

**Design approach:** Four horizontal progress bars with score labels. This is a diagnostic view — it answers "why is this district ranked here?"

**Implementation notes:**
- Each bar shows earned points / 25 max, with a "Gap" indicator for lost points.
- The raw metric (e.g., "248 releases", "42 min") provides operational context.
- Bars use grayscale fills — darker fill = higher score percentage.
- The header clearly identifies: district name, rank, and composite CPI score.
- When no district is selected, show a placeholder: "Select a district from the leaderboard above to view CPI decomposition."

**Key decision:** Horizontal bars, not circular gauges. The spec explicitly forbids "four oversized circular charts or elaborate gauges." Horizontal bars are data-dense, scannable, and comparable.

### Zone 5 — Emergency Alert

**Design approach:** The highest-priority incident gets prominent treatment with full details. Secondary incidents are compact rows underneath.

**Implementation notes:**
- The primary incident has a **2px left border** in `#303134` (darkest gray) for High severity.
- SLA countdown displays the actual remaining time from the incident data, not a live ticking clock with fabricated values.
- "Authorize Rebuttal" button is the most critical action — it should be visually distinct (primary dark button) but appears **only for authorized roles**.
- Medium and Low severity incidents use lighter left-border weights (1px, `#5F6368` and `#80868B`).

**Key decision:** No red alert banners, no flashing, no pulsing. A critical alert is communicated through strong dark borders, bold text, and spatial prominence at the top of the right column.

### Zone 4 — OCR Feed

**Design approach:** A vertically scannable stream of newspaper records. Think of it as a filtered inbox, not a social media feed.

**Implementation notes:**
- Each record is separated by a subtle horizontal line (`#E8EAED`), not wrapped in its own card.
- Marathi headlines use Noto Sans Devanagari at standard body size.
- Sentiment filter uses a compact pill-group at the top (All / Positive / Negative / Neutral).
- New records prepend without disrupting scroll position (react-virtuoso's `firstItemIndex` feature).
- "Insert Sample" button is clearly marked as demo functionality.

**Key decision:** The feed panel has a fixed height with internal scroll. It does not expand to push other content down.

---

## 4. Leadership Overview Strategy

The four leadership panels occupy a secondary section below the five primary zones. They are **visually subordinate** — slightly smaller headings, no additional emphasis.

### Panel rendering order

```
┌──────────────────────┬──────────────────────┐
│ Top/Lower 5 Matrix   │ Social Media Analysis │
├──────────────────────┼──────────────────────┤
│ Maharashtra GIS Map  │ Live Event Streaming  │
└──────────────────────┴──────────────────────┘
```

### GIS Map approach

- SVG-rendered Maharashtra district boundaries from local GeoJSON.
- Grayscale fills with slightly darker selected-district highlight.
- Hover tooltip with district name, DIO status, "View Details" link.
- Click-to-select syncs with the Zustand district store.
- No invented boundaries, no live markers, no heatmap colors.

### Live Streaming approach

- Honest empty states: "No live stream available. Live event streams will appear here when available."
- No fake video players or placeholder thumbnails that imply active streams.

---

## 5. Interaction Design

### Primary Interaction: District Selection

This is the most important interaction in the dashboard. It connects Zone 2 → Zone 3 → GIS Map.

```
User clicks "Pune" row in Zone 2 table
  ↓
Zustand store: selectedDistrict = "pune"
  ↓
Zone 2: Pune row gets --bg-selected background
Zone 3: Header updates to "CPI Score Decomposition — Pune"
         Four bars recalculate to Pune's scores
GIS Map: Pune district path gets --bg-selected fill
```

### Secondary Interactions

| Interaction | Effect |
|---|---|
| Change geographic scope | Filters Zone 2 table + chart, updates toolbar label |
| Change division filter | Filters Zone 2 table, updates count, chart shows filtered top 5 |
| Search districts | Filters Zone 2 table by name match, updates count |
| Sort table column | Re-orders Zone 2 table, maintains selection |
| Switch sentiment filter | Filters Zone 4 OCR feed records |
| Switch social media tab | Swaps Platform metrics in Leadership Panel 2 |
| Switch user role | Updates leaderboard visibility, crisis button visibility |
| Change language | Swaps all UI strings to Marathi/English |

### Role Switching UX

The role selector is in the header. When switched:

| From → To | Visual Change |
|---|---|
| DG Admin → Collector | Leaderboard filters to permitted districts, global view restricted |
| DG Admin → DIO Desk | Leaderboard hidden, only local district data visible, crisis auth hidden |
| Collector → DG Admin | Full leaderboard restored, all districts visible |

The switch is instantaneous — no page reload, no loading state.

---

## 6. Responsive Implementation Strategy

### Desktop (≥1440px) — Target Layout

This is the primary design target. All five zones visible in their prescribed positions. Sidebar expanded. Four KPIs in a row. 8:4 column split for the main workspace.

### Tablet (768–1024px) — Graceful Compression

- Sidebar collapses to icon-only (56px) or auto-hides with toggle.
- KPI cards remain in a 4-column row if space permits, otherwise 2×2 grid.
- Main workspace zones may need to stack vertically, with Zone 5 (Emergency) and Zone 4 (OCR Feed) moving below Zones 2 and 3.
- Leadership panels stay in 2-column grid.

### Mobile (~390px) — Essential Information

- Sidebar becomes hamburger menu overlay.
- KPIs stack into a single column.
- All zones stack vertically: Zone 1 → Zone 5 (emergency first for urgency) → Zone 2 → Zone 3 → Zone 4.
- Tables scroll horizontally within their own container (no page-level overflow).
- Charts resize responsively (ECharts handles this natively).
- Leadership panels stack vertically.
- Touch targets minimum 44px.

---

## 7. Performance Considerations

| Concern | Strategy |
|---|---|
| ECharts bundle size | Tree-shake via `echarts/core` + selective chart registration |
| GIS map rendering | SVG paths from local GeoJSON, no external tile server |
| OCR feed with many items | react-virtuoso for virtual scrolling |
| Font loading | `next/font/google` with `display: swap` for zero CLS |
| Component hydration | Charts loaded with `next/dynamic({ ssr: false })` |
| State updates | Zustand selectors prevent unnecessary zone re-renders |
| Tailwind CSS | Purge unused utilities in production build |

---

## 8. Development Workflow

### Phase sequencing rationale

1. **Foundation first** — design tokens, types, data, and state must exist before any component.
2. **Shell before zones** — header, sidebar, and toolbar establish the spatial container for zones.
3. **Zones in dependency order** — Zone 1 (KPI) is independent. Zone 2 (Leaderboard) must exist before Zone 3 (Decomposition) because Zone 3 depends on district selection from Zone 2.
4. **Right column zones** (5 + 4) can be built in parallel with left column.
5. **Leadership overview** is secondary and builds on the same shared components.
6. **i18n and RBAC** are cross-cutting concerns applied after the main UI is functional.
7. **Responsive and polish** are final — fix layout issues after all content is in place.

### Quality gates between phases

| Gate | Criteria |
|---|---|
| After Phase 2 | Shell renders on all breakpoints, navigation works, role selector connected |
| After Phase 8 | All 5 zones render in correct positions, district selection syncs Zone 2 ↔ Zone 3 |
| After Phase 9 | Leadership overview renders, GIS map interactive, all panels populated |
| After Phase 13 | Full acceptance criteria checklist passes |

---

## 9. Files Created in This Planning Phase

| File | Purpose |
|---|---|
| [`doc/analysis.md`](file:///d:/gov_project/doc/analysis.md) | Structured extraction of all requirements from the spec |
| [`doc/architecture.md`](file:///d:/gov_project/doc/architecture.md) | Component hierarchy, file structure, state management |
| [`doc/design-system.md`](file:///d:/gov_project/doc/design-system.md) | Color tokens, typography, spacing, component specs |
| [`doc/tech-stack.md`](file:///d:/gov_project/doc/tech-stack.md) | Library choices with versions and justifications |
| [`doc/task.md`](file:///d:/gov_project/doc/task.md) | Master task plan with 13 phases and detailed subtasks |
| [`doc/implementation-plan.md`](file:///d:/gov_project/doc/implementation-plan.md) | This document — strategic design and implementation guide |
