# Maha-Command Center — Specification Analysis

> **Document type:** Pre-implementation analysis
> **Source:** `writing-block.md` + reference dashboard screenshot
> **Prepared for:** Next.js frontend implementation

---

## 1. Product Identity

| Attribute | Value |
|---|---|
| Product name | Maha-Command Center |
| Owner | Directorate General of Information and Public Relations (DGIPR) |
| Government | Government of Maharashtra |
| Subtitle | State Information Operations |
| Nature | Government KPI dashboard / operations command center |

---

## 2. Core Functional Areas (7 Navigation Destinations)

| # | Destination | Description |
|---|---|---|
| 1 | Command Overview | Main dashboard — the five-zone layout (primary scope of this redesign) |
| 2 | Media Surveillance | Media monitoring and tracking |
| 3 | Narrative & Sentiment | Sentiment analysis and narrative tracking |
| 4 | Misinformation & Fact-Checking | Crisis management and fact-checking workflows |
| 5 | District Operations | District-level operational management |
| 6 | Press Releases & Briefings | Press release management and publishing |
| 7 | Audit & Telemetry | System audit logs and telemetry data |

> **Note:** The spec focuses on the **Command Overview** page (destination 1). Other pages are navigation stubs for now.

---

## 3. Application Shell Architecture

### Header (56–64 px)

**Left cluster:**
- Maharashtra Government / DGIPR text identity
- Product name: "Maha-Command Center"
- Optional subtitle: "State Information Operations"

**Right cluster:**
- Last successful data sync timestamp
- Manual refresh button
- User role selector dropdown
- English/Marathi language selector
- User profile menu (avatar + name)

### Sidebar Navigation (208–224 px on desktop)

- Monochrome icons
- Concise labels
- One understated selected state
- Collapsible on smaller screens
- No duplicate division filters

---

## 4. Dashboard Toolbar

Single compact bar below the header containing:
- Page title: "Statewide Operations Overview"
- Geographic scope selector: All Maharashtra / division / district
- Reporting period filter (optional)
- Sync status (if not in header)

---

## 5. Five-Zone Dashboard Architecture (12-Column Grid)

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│                    ZONE 1 — KPI Ribbon (full width)          │
├────────────────────────────────────┬─────────────────────────┤
│ ZONE 2 — District Leaderboard     │ ZONE 5 — Emergency      │
│ (8 columns / ~67%)                │ Alert & Crisis Monitor   │
│                                   │ (4 columns / ~33%)       │
├────────────────────────────────────┤                         │
│ ZONE 3 — CPI Score Decomposition  ├─────────────────────────┤
│ (8 columns / ~67%)                │ ZONE 4 — OCR Media      │
│                                   │ Ingestion Feed           │
│                                   │ (4 columns / ~33%)       │
└────────────────────────────────────┴─────────────────────────┘
```

### Zone Details

#### Zone 1 — KPI Ribbon (4 cards, full width)

| Card | Metric | Primary Value | Supporting Data |
|---|---|---|---|
| 1 | Total Releases | Press-release volume | Target, % of target, vs previous period |
| 2 | Average TAT | Turnaround time (minutes) | Target ≤60 min, % change, vs previous |
| 3 | Sentiment Index | Public media sentiment % | Target ≥70%, trend, vs previous |
| 4 | Misinformation Tickets | Active/pending cases count | Target ≤15 (Met), trend, vs previous |

#### Zone 2 — District Leaderboard (left, upper)

**Chart:** Top 5 Districts by CPI (bar chart)

**Table columns:** Rank | District | Division | Releases | Avg TAT | Sentiment | Crisis SLA | CPI | Action

**Interactions:** Search, filter by division, sort columns, select district, show filtered count

**Sub-tabs:** CPI Ranking | Event Coverage (Top/Lower 5) | Specific News Coverage (Top/Lower 5)

#### Zone 3 — CPI Score Decomposition (left, lower)

**4 components, each 25 points max (total 100):**

| Component | Formula | Max |
|---|---|---|
| Volume | `min(25, (Total Releases / 300) × 25)` | 25 |
| TAT/Dispatch Speed | 0–45 min = 25pts; 45–120 min = linear degradation; 120+ min = 0 | 25 |
| Media Sentiment | `((Net Sentiment Index + 1) / 2) × 25` | 25 |
| Crisis SLA | `(Rumors refuted within 90 min / Total Rumors) × 25` | 25 |

**Display per component:** Name, earned/25 pts, raw metric, penalty/gap

**Header:** District name, CPI score /100, rank #

#### Zone 5 — Emergency Alert & Crisis Monitor (right, upper)

**Per incident:** ID, summary, source/channel, verification status, severity, SLA countdown, evidence button, timeline button, rebuttal authorization (role-gated)

**Layout:** Primary incident prominent, secondary incidents as compact rows

#### Zone 4 — OCR Media Ingestion Feed (right, lower)

**Per record:** Publication/source, timestamp, extracted headline (Marathi text), associated district, sentiment, OCR confidence, processing latency

**Filters:** All | Positive | Negative | Neutral

**Actions:** Manual refresh, Insert Sample

---

## 6. Leadership Overview (Secondary Section)

Four panels in a 2-column grid below the five zones:

| Panel | Content |
|---|---|
| Top/Lower Five Matrix | District extremes — Event Coverage + Specific News Coverage tabs, Top 5 / Lower 5 tables |
| Social Media Analysis | X/Twitter, Facebook, Instagram, YouTube, LinkedIn, WhatsApp — Total Mentions, Organic Reach, Engagement Rate, Reel Completion, Taluka-wise Engagement |
| Maharashtra GIS Map | Interactive map of 36 districts, hover/select, DIO status, division filter |
| Live Event Streaming | YouTube, Facebook, Instagram, TV Channels tabs — CM event streams, empty states for unavailable |

---

## 7. Design System — Monochrome Tokens

| Token | Hex | CSS Variable (proposed) |
|---|---|---|
| Page background | `#F5F6F7` | `--bg-page` |
| Primary surface | `#FFFFFF` | `--bg-surface` |
| Secondary surface | `#F0F1F3` | `--bg-surface-secondary` |
| Selected surface | `#E7E9EC` | `--bg-selected` |
| Primary text | `#202124` | `--text-primary` |
| Secondary text | `#5F6368` | `--text-secondary` |
| Muted text | `#80868B` | `--text-muted` |
| Standard border | `#DADCE0` | `--border-standard` |
| Subtle divider | `#E8EAED` | `--border-subtle` |
| Primary action | `#303134` | `--action-primary` |
| Inverse text | `#FFFFFF` | `--text-inverse` |

---

## 8. Typography & Spacing

- **Font family:** Noto Sans (with Marathi glyph support)
- **Monospaced:** For timestamps, IDs, technical metadata only
- **Spacing base:** 4px scale (8, 12, 16, 24, 32 px)
- **Content gutter:** 20–24 px
- **Zone gap:** 16 px
- **Panel padding:** 16 px
- **Control height:** 32–36 px
- **Button height:** 36–40 px
- **Corner radius:** 4–6 px
- **Table row height:** 40–44 px

---

## 9. Role-Based Access Control

| Role | Global Leaderboard | Crisis Authorization | Local Data Entry |
|---|---|---|---|
| DG State Admin | ✅ Full access | ✅ Yes | ❌ No |
| District Collector | ⚠️ Filtered view only | ✅ Single-click auth | ❌ No |
| DIO Desk | ❌ No | ❌ No | ✅ Local only |

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop | ≥1440 px | Full layout — sidebar, 4 KPIs in row, 8:4 split, 2-col leadership |
| Tablet | 768–1024 px | Reduced sidebar, 2-col KPIs, stacked/rebalanced zones |
| Mobile | ~390 px | Collapsed nav, stacked KPIs, stacked zones, scrollable tables |

---

## 11. Explicit Constraints & Anti-Patterns

### MUST NOT do:
- No colored accents, gradients, glassmorphism, neon, glows
- No colored status badges
- No excessively rounded cards or excessive shadows
- No decorative animation
- No red/green chart series
- No extra KPI cards beyond the 4 defined
- No large decorative headers or welcome banners
- No circular gauges for every metric
- No terminal-style uppercase labels
- No fake streaming video, invented social media posts, fictional incidents
- No invented government seals
- No new modules not in the blueprint

### MUST do:
- Grayscale-only interface
- Light-first design
- Data-first, restrained, professional
- Charts use gray shades, gridlines, marker shapes, labels, line patterns
- UI understandable without color
- Clearly label demo/simulated data
- Preserve all existing DOM IDs, calculations, event handlers
