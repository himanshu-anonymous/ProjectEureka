# Maha-Command Center — Master Task Plan

> **Project:** Maha-Command Center Frontend (Next.js)
> **Owner:** DGIPR, Government of Maharashtra
> **Type:** Government KPI Dashboard / Operations Command Center
> **Framework:** Next.js 14+ (App Router) + Tailwind CSS + TypeScript
> **Design:** Strict monochrome, data-first, minimalist government UI
>
> **Reference documents:**
> - [`writing-block.md`](file:///d:/gov_project/doc/writing-block.md) — Master specification
> - [`analysis.md`](file:///d:/gov_project/doc/analysis.md) — Extracted requirements analysis
> - [`architecture.md`](file:///d:/gov_project/doc/architecture.md) — Component architecture & file structure
> - [`design-system.md`](file:///d:/gov_project/doc/design-system.md) — Design tokens, typography, component specs
> - [`tech-stack.md`](file:///d:/gov_project/doc/tech-stack.md) — Technology stack & library details
> - [`Maha-Command Center Dashboard.png`](file:///d:/gov_project/doc/Maha-Command%20Center%20Dashboard.png) — Reference screenshot

---

## Technology Stack Summary

| Category | Library | Package | Why |
|---|---|---|---|
| Framework | Next.js 14+ | `next@14` | App Router, server components, SSR — spec requirement |
| Language | TypeScript | `typescript` | Type safety for complex data structures |
| Styling | Tailwind CSS v3 | `tailwindcss@3` | Spec requirement, CSS custom properties for design tokens |
| UI Primitives | Radix UI | `@radix-ui/*` | Headless, accessible, no opinionated styling — perfect for monochrome |
| Icons | Lucide React | `lucide-react` | Clean monochrome outline icons, comprehensive set |
| Charts | ECharts (via echarts-for-react) | `echarts` + `echarts-for-react` | Spec requirement for data visualizations, grayscale theming |
| Data Tables | TanStack Table v8 | `@tanstack/react-table` | Headless, full sorting/filtering/search, headless = full style control |
| GIS Map | react-simple-maps | `react-simple-maps` | Lightweight SVG maps, custom GeoJSON for Maharashtra districts |
| State Management | Zustand | `zustand` | Lightweight, cross-zone state sync, no boilerplate |
| i18n | next-intl | `next-intl` | Native App Router integration, ICU message format, Marathi support |
| Fonts | Noto Sans + Noto Sans Devanagari | `@fontsource/noto-sans` | Marathi glyph support — spec requirement |
| Virtual Scroll | react-virtuoso | `react-virtuoso` | Dynamic-height virtual list, prepend-without-jump for OCR feed |
| Date/Time | date-fns | `date-fns` | Lightweight date formatting, SLA countdown calculation |

---

## Task Breakdown

### Legend

- 🔴 **Critical** — Blocks other tasks
- 🟡 **Important** — Core functionality
- 🟢 **Standard** — Expected feature
- ⚪ **Enhancement** — Polish & refinement

Status markers: `[ ]` Not started | `[~]` In progress | `[x]` Complete

---

## PHASE 1: PROJECT FOUNDATION 🔴

### Task 1.1 — Project Initialization
**Priority:** 🔴 Critical | **Estimated effort:** 30 min

- [ ] **1.1.1** Initialize Next.js 14+ project with TypeScript and App Router
  ```bash
  npx create-next-app@14 maha-command-center --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] **1.1.2** Install core dependencies
  ```bash
  npm install zustand echarts echarts-for-react @tanstack/react-table react-virtuoso
  npm install react-simple-maps topojson-client d3-geo lucide-react next-intl date-fns
  npm install @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-tooltip
  npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-popover
  npm install clsx tailwind-merge class-variance-authority
  ```
- [ ] **1.1.3** Install dev dependencies
  ```bash
  npm install -D @types/d3-geo @types/topojson-client
  ```
- [ ] **1.1.4** Configure `tsconfig.json` path aliases (`@/components`, `@/lib`, `@/stores`, etc.)
- [ ] **1.1.5** Create the folder structure per `architecture.md`

---

### Task 1.2 — Design Token System
**Priority:** 🔴 Critical | **Estimated effort:** 1 hour

- [ ] **1.2.1** Define CSS custom properties in `globals.css`
  - All color tokens from `design-system.md` Section 1
  - Typography tokens from Section 2
  - Spacing tokens from Section 3
- [ ] **1.2.2** Configure `tailwind.config.ts` to reference CSS custom properties
  ```typescript
  // Map Tailwind utilities to CSS variables
  colors: {
    page: 'var(--bg-page)',
    surface: 'var(--bg-surface)',
    'surface-secondary': 'var(--bg-surface-secondary)',
    selected: 'var(--bg-selected)',
    // ... etc.
  }
  ```
- [ ] **1.2.3** Set up Noto Sans font loading in root layout
  - Import Noto Sans (Latin + Devanagari subsets)
  - Apply as `font-family` on `<html>` element
  - Configure Noto Sans Mono for monospaced contexts
- [ ] **1.2.4** Create ECharts monochrome theme definition
  - 5-level grayscale series palette
  - Grid, axis, label styling per design system

---

### Task 1.3 — Type Definitions
**Priority:** 🔴 Critical | **Estimated effort:** 45 min

- [ ] **1.3.1** Define `types/district.ts`
  ```typescript
  interface District {
    id: string;
    name: string;
    division: string;
    releases: number;
    avgTAT: number;       // minutes
    sentiment: number;     // percentage (0-100)
    crisisSLA: number;     // percentage (0-100)
    cpi: number;           // composite performance index (0-100)
    rank: number;
  }
  ```
- [ ] **1.3.2** Define `types/incident.ts`
  ```typescript
  interface Incident {
    id: string;            // e.g. "INC-2025-0417"
    summary: string;
    source: string;
    channel: string;
    verificationStatus: 'In Progress' | 'Verified' | 'Debunked' | 'Pending';
    severity: 'High' | 'Medium' | 'Low';
    slaDeadline: Date;
    district: string;
    rebuttalAuthorized: boolean;
  }
  ```
- [ ] **1.3.3** Define `types/kpi.ts`
  ```typescript
  interface KPIMetric {
    label: string;
    value: number | string;
    target: number | string;
    targetPercentage: number;
    trend: number;           // percentage change
    trendDirection: 'up' | 'down' | 'flat';
    comparisonPeriod: string; // e.g. "vs. previous 7 days"
    icon: string;
  }
  ```
- [ ] **1.3.4** Define `types/ocrRecord.ts`
  ```typescript
  interface OCRRecord {
    id: string;
    publication: string;
    timestamp: Date;
    headline: string;
    district: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    ocrConfidence: number;  // 0-1
    processingLatency: number; // minutes
  }
  ```
- [ ] **1.3.5** Define `types/roles.ts`
  ```typescript
  type UserRole = 'dg_admin' | 'collector' | 'dio_desk';
  interface RolePermissions {
    globalLeaderboard: boolean;
    crisisAuthorization: boolean;
    localDataEntry: boolean;
    restrictedDistrict: string | null; // null = all districts
  }
  ```

---

### Task 1.4 — Demo Data Generation
**Priority:** 🔴 Critical | **Estimated effort:** 1.5 hours

- [ ] **1.4.1** Create `data/districts.ts` with realistic demo data for 5 districts
  - Pune, Nagpur, Thane, Nashik, Aurangabad (as shown in reference screenshot)
  - Include all fields needed for table, chart, and CPI decomposition
  - **Do NOT fabricate all 36 districts** — clearly mark as demo data
- [ ] **1.4.2** Create `data/divisions.ts` — Maharashtra's 6 administrative divisions
  - Pune, Nagpur, Nashik, Aurangabad, Konkan, Amravati
- [ ] **1.4.3** Create `data/incidents.ts` — 3 demo incidents
  - INC-2025-0417 (High), INC-2025-0416 (Medium), INC-2025-0415 (Low)
  - As shown in reference screenshot
- [ ] **1.4.4** Create `data/ocrFeed.ts` — 4–6 demo OCR records
  - Lokmat, ABP Majha, TV9 Marathi, Sakal (as shown in screenshot)
  - Include Marathi headlines
- [ ] **1.4.5** Create `data/socialMedia.ts` — Platform-wise demo metrics
- [ ] **1.4.6** Create `data/kpiMetrics.ts` — 4 KPI card values matching screenshot

---

### Task 1.5 — State Management (Zustand Store)
**Priority:** 🔴 Critical | **Estimated effort:** 45 min

- [ ] **1.5.1** Create `stores/dashboardStore.ts` with Zustand
  - Geographic scope state (scope, division, district)
  - Selected district for cross-zone sync
  - Current user role
  - Language locale
  - Reporting period
  - Sync status and timestamp
- [ ] **1.5.2** Create `stores/selectors.ts` — derived selectors
  - `useSelectedDistrictData` — full district record for selected district
  - `useFilteredDistricts` — districts filtered by scope/division
  - `useRolePermissions` — computed permissions from role
- [ ] **1.5.3** Create custom hooks
  - `hooks/useDistrictSelection.ts` — district select/deselect logic
  - `hooks/useRolePermissions.ts` — permission checks
  - `hooks/useSLACountdown.ts` — real-time SLA timer
  - `hooks/useGeographicFilter.ts` — scope filter logic

---

### Task 1.6 — CPI Scoring Logic
**Priority:** 🔴 Critical | **Estimated effort:** 30 min

- [ ] **1.6.1** Implement `lib/scoring.ts` with exact formulas from spec
  ```typescript
  // Volume: min(25, (totalReleases / 300) * 25)
  export function volumeScore(totalReleases: number): number;
  
  // TAT: 0-45 min = 25; 45-120 min = linear; 120+ = 0
  export function tatScore(avgTAT: number): number;
  
  // Sentiment: ((netSentimentIndex + 1) / 2) * 25
  export function sentimentScore(netSentimentIndex: number): number;
  
  // Crisis SLA: (refutedWithin90 / totalRumors) * 25
  export function crisisSLAScore(refuted: number, total: number): number;
  
  // Composite: sum of all four
  export function compositeCPI(...): number;
  ```
- [ ] **1.6.2** Implement `lib/formatting.ts`
  - Number formatting with comma separators
  - Percentage formatting
  - Time duration formatting (minutes → "42m", "2h 14m")
  - Date/timestamp formatting
- [ ] **1.6.3** Implement `lib/constants.ts`
  - KPI targets, SLA thresholds, scoring boundaries
  - Navigation items array
  - Division list

---

## PHASE 2: APPLICATION SHELL 🔴

### Task 2.1 — Root Layout & App Shell
**Priority:** 🔴 Critical | **Estimated effort:** 1.5 hours

- [ ] **2.1.1** Build `components/layout/AppShell.tsx`
  - Flex container: sidebar + main content area
  - Responsive behavior: sidebar visible/collapsed/hidden by breakpoint
  - Pass children for page content
- [ ] **2.1.2** Build `components/layout/Header.tsx`
  - Height: 56–64px, fixed top
  - Left: Maharashtra Government / DGIPR text + "Maha-Command Center" + subtitle
  - Right: Sync time, Refresh button, Role selector, Language selector, Profile menu
  - Use Radix UI `Select` for dropdowns
  - Connect role selector to Zustand store
  - Connect language selector to Zustand store
- [ ] **2.1.3** Build `components/layout/Sidebar.tsx`
  - Width: 208–224px on desktop
  - 7 navigation items with Lucide icons
  - Active state: `--bg-selected` background
  - Collapse button at bottom
  - Use Next.js `Link` for navigation
  - Collapse to icon-only on tablet
- [ ] **2.1.4** Build `components/layout/MobileNav.tsx`
  - Hamburger menu trigger
  - Full-screen overlay with navigation items
  - Use Radix UI `Dialog` for overlay
- [ ] **2.1.5** Apply to `app/layout.tsx`
  - Wrap all pages in `AppShell`
  - Set up font loading
  - Set up metadata (title, description)

---

### Task 2.2 — Dashboard Toolbar
**Priority:** 🔴 Critical | **Estimated effort:** 30 min

- [ ] **2.2.1** Build `components/layout/DashboardToolbar.tsx`
  - Page title: "Statewide Operations Overview"
  - Geographic scope selector (Radix Select): All Maharashtra / Division / District
  - Period filter selector: Last 7 days / Last 30 days / Last 90 days
  - Optional sync status indicator
  - Connect all selectors to Zustand store

---

### Task 2.3 — Shared UI Components
**Priority:** 🔴 Critical | **Estimated effort:** 1.5 hours

- [ ] **2.3.1** Build `components/shared/Panel.tsx`
  - Reusable container: white bg, border, radius, padding
  - Optional heading + action slot
  - Optional border-left emphasis for severity
- [ ] **2.3.2** Build `components/shared/Button.tsx`
  - Variants: primary (dark), secondary (outline), ghost (text)
  - Sizes: sm (32px), md (36px), lg (40px)
  - Loading state
  - Disabled state
- [ ] **2.3.3** Build `components/shared/Select.tsx`
  - Wrapper around Radix UI Select
  - Styled to match design system
  - Compact height (32–36px)
- [ ] **2.3.4** Build `components/shared/Badge.tsx`
  - Monochrome severity badges
  - Variants: filled (dark bg), outlined, text-only
  - Dot indicator (●, ◐, ○) for severity levels
- [ ] **2.3.5** Build `components/shared/SearchInput.tsx`
  - Search icon + text input
  - Debounced onChange
  - Clear button
- [ ] **2.3.6** Build `components/shared/TabGroup.tsx`
  - Wrapper around Radix Tabs
  - Underline active indicator (not pill style)
  - text-sm, monochrome
- [ ] **2.3.7** Build `components/shared/ProgressBar.tsx`
  - Horizontal bar with fill percentage
  - Grayscale fills only
  - Label slot for score display
- [ ] **2.3.8** Build `components/shared/Tooltip.tsx`
  - Wrapper around Radix Tooltip
  - Consistent styling
- [ ] **2.3.9** Build `components/shared/StatusText.tsx`
  - Restrained status indicator (text-based, no color)
  - Variants: met, at-risk, critical, pending

---

### Task 2.4 — Navigation Stub Pages
**Priority:** 🟢 Standard | **Estimated effort:** 20 min

- [ ] **2.4.1** Create stub pages for all 7 navigation destinations
  - Each page: Panel with heading + "Coming soon" placeholder
  - Correct page titles in toolbar
  - Pages: command-overview, media-surveillance, narrative-sentiment, misinformation, district-operations, press-releases, audit-telemetry

---

## PHASE 3: ZONE 1 — KPI RIBBON 🟡

### Task 3.1 — KPI Cards
**Priority:** 🟡 Important | **Estimated effort:** 1.5 hours

- [ ] **3.1.1** Build `components/zones/KPIRibbon/KPICard.tsx`
  - Concise metric label (with small icon)
  - One prominent primary value (text-2xl, **not** oversized)
  - Target / comparison statistic
  - Trend indicator (▲/▼ arrow + percentage, text only)
  - Comparison period label
  - Equal heights enforced via CSS Grid
  - Right-aligned trend in bottom row
- [ ] **3.1.2** Build `components/zones/KPIRibbon/KPIRibbon.tsx`
  - 4-card grid: `grid-cols-4` on desktop, `grid-cols-2` on tablet, `grid-cols-1` on mobile
  - Full content width
  - 16px gap between cards
  - Pull data from `data/kpiMetrics.ts`
- [ ] **3.1.3** Implement KPI data formatting
  - Total Releases: `1,248` / Target 1,500 (83%) / ↓ 12%
  - Average TAT: `47 min` / Target ≤60 min (78%) / ↓ 18%
  - Sentiment Index: `72%` / Target ≥70% (Met) / ↑ 6%
  - Misinformation Tickets: `8` / Target ≤15 (Met) / ↓ 33%

---

## PHASE 4: ZONE 2 — DISTRICT LEADERBOARD 🟡

### Task 4.1 — Performance Chart
**Priority:** 🟡 Important | **Estimated effort:** 1 hour

- [ ] **4.1.1** Build `components/zones/DistrictLeaderboard/PerformanceChart.tsx`
  - ECharts vertical bar chart
  - Top 5 districts by CPI
  - Grayscale bars (darkest = highest CPI)
  - Labels on top of bars
  - Y-axis: 0–100 scale
  - X-axis: district names
  - Responsive height
  - Apply monochrome ECharts theme
- [ ] **4.1.2** Connect chart to filtered/sorted district data
  - Re-render when scope filter changes
  - Show top 5 from current filtered set

---

### Task 4.2 — District Data Table
**Priority:** 🟡 Important | **Estimated effort:** 2 hours

- [ ] **4.2.1** Build `components/zones/DistrictLeaderboard/DistrictTableControls.tsx`
  - Search input (debounced, searches district name)
  - Division filter dropdown (All Divisions + 6 divisions)
  - Result count display: "Showing X of Y districts"
- [ ] **4.2.2** Build `components/zones/DistrictLeaderboard/DistrictTable.tsx`
  - TanStack Table v8 integration
  - Columns: Rank | District | Division | Releases | Avg TAT | Sentiment | Crisis SLA | CPI | Action
  - Right-aligned numeric columns
  - Sortable: Releases, Avg TAT, Sentiment, Crisis SLA, CPI
  - Row click → select district → update Zustand store
  - Selected row highlighted with `--bg-selected`
  - "View" button in Action column
  - Subtle row separators (1px `--border-subtle`)
  - Compact row height (40–44px)
  - Horizontally scrollable on mobile
- [ ] **4.2.3** Implement search and filter logic
  - Filter districts by search query (name match)
  - Filter by division selection
  - Update result count
  - Maintain sort state across filter changes

---

### Task 4.3 — Tab Navigation & Top/Lower Five
**Priority:** 🟡 Important | **Estimated effort:** 45 min

- [ ] **4.3.1** Build `components/zones/DistrictLeaderboard/TopLowerTabs.tsx`
  - Radix Tabs: CPI Ranking | Event Coverage (Top/Lower 5) | Specific News Coverage (Top/Lower 5)
  - CPI Ranking → shows chart + table (default)
  - Event Coverage → compact Top 5 / Lower 5 comparison
  - Specific News → compact Top 5 / Lower 5 comparison
- [ ] **4.3.2** Build compact Top/Lower 5 view
  - Two-column layout: Top 5 (left) | Lower 5 (right)
  - Compact numbered list with value

---

### Task 4.4 — Zone 2 Container
**Priority:** 🟡 Important | **Estimated effort:** 30 min

- [ ] **4.4.1** Build `components/zones/DistrictLeaderboard/DistrictLeaderboard.tsx`
  - Panel container with heading: "District Performance & Leaderboard"
  - Tab group at top
  - Chart + controls + table layout
  - Occupies 8/12 columns (left workspace, upper)

---

## PHASE 5: ZONE 3 — CPI SCORE DECOMPOSITION 🟡

### Task 5.1 — Score Decomposition Panel
**Priority:** 🟡 Important | **Estimated effort:** 1.5 hours

- [ ] **5.1.1** Build `components/zones/ScoreDecomposition/ComponentBar.tsx`
  - Component name (with small icon)
  - Description (raw metric label)
  - Horizontal progress bar (earned/25 points)
  - Score display: "22 / 25"
  - Raw metric value: e.g., "248 releases"
  - Gap display: "Gap: 3 pts"
  - Grayscale fill bar
- [ ] **5.1.2** Build `components/zones/ScoreDecomposition/ScoreDecomposition.tsx`
  - Header: "CPI Score Decomposition — {District Name} (Selected District)"
  - Right header: "Rank #{rank} | CPI {score}/100"
  - 4 × ComponentBar stacked vertically:
    1. Volume — Total releases / 300
    2. TAT / Dispatch Speed — Avg TAT (minutes)
    3. Media Sentiment — Net Sentiment Index
    4. Crisis SLA — Rumors refuted within 90 min
  - Subscribe to Zustand selectedDistrict
  - Recalculate scores using `lib/scoring.ts` formulas
  - Show empty/placeholder state when no district selected
  - Occupies 8/12 columns (left workspace, lower)
- [ ] **5.1.3** Connect to Zustand store
  - Listen to `selectedDistrict` changes
  - Fetch/compute component scores for selected district
  - Display district name, rank, and CPI score in header

---

## PHASE 6: ZONE 5 — EMERGENCY ALERT & CRISIS MONITOR 🟡

### Task 6.1 — Emergency Alert Panel
**Priority:** 🟡 Important | **Estimated effort:** 1.5 hours

- [ ] **6.1.1** Build `components/zones/EmergencyAlert/SLACountdown.tsx`
  - Real-time countdown timer
  - Display: "SLA remaining: Xh Ym" or "X min"
  - Uses `useSLACountdown` hook
  - Static display based on actual SLA data (no fake changing values)
- [ ] **6.1.2** Build `components/zones/EmergencyAlert/PrimaryIncident.tsx`
  - Incident ID (monospaced)
  - Severity badge (● High / ◐ Medium / ○ Low — monochrome)
  - Summary text
  - Source / channel
  - Verification status
  - SLA countdown
  - Action buttons: "View Evidence", "View Timeline"
  - "Authorize Rebuttal" button — **role-gated** (only DG Admin + Collector)
  - Strong dark border-left for High severity
  - Prominent card treatment
- [ ] **6.1.3** Build `components/zones/EmergencyAlert/SecondaryIncident.tsx`
  - Compact row: ID, severity dot, summary, SLA remaining
  - Minimal height
  - Click to expand or promote to primary view
- [ ] **6.1.4** Build `components/zones/EmergencyAlert/EmergencyAlert.tsx`
  - Panel heading: "Emergency Alert & Crisis Monitor"
  - Active count badge: "3 Active"
  - Primary incident at top (most critical)
  - Secondary incidents as compact rows below
  - "View all incidents →" link at bottom
  - Occupies 4/12 columns (right workspace, upper)
  - Role-based button visibility from Zustand role state

---

## PHASE 7: ZONE 4 — OCR MEDIA INGESTION FEED 🟡

### Task 7.1 — OCR Feed Panel
**Priority:** 🟡 Important | **Estimated effort:** 1 hour

- [ ] **7.1.1** Build `components/zones/OCRFeed/SentimentFilter.tsx`
  - Pill/button group: All | Positive | Negative | Neutral
  - Active state: filled dark pill
  - Inactive: outlined pill
  - Single-select behavior
- [ ] **7.1.2** Build `components/zones/OCRFeed/FeedItem.tsx`
  - Publication name + timestamp (monospaced)
  - Extracted headline (Marathi text — Noto Sans Devanagari)
  - District tag
  - Sentiment label (text-only: "Positive" / "Negative" / "Neutral")
  - OCR confidence (decimal, e.g., 0.92)
  - Processing latency (e.g., "2m")
  - Subtle horizontal separator between items (not nested cards)
- [ ] **7.1.3** Build `components/zones/OCRFeed/OCRFeed.tsx`
  - Panel heading: "OCR Media Ingestion Feed"
  - Last updated timestamp + Refresh action
  - "Insert Sample" button
  - Sentiment filter
  - Vertically scrollable feed list
  - New records appear without disrupting scroll position
  - Clearly label as demo data
  - Occupies 4/12 columns (right workspace, lower)

---

## PHASE 8: FIVE-ZONE LAYOUT ASSEMBLY 🔴

### Task 8.1 — Command Overview Page
**Priority:** 🔴 Critical | **Estimated effort:** 1 hour

- [ ] **8.1.1** Build `app/command-overview/page.tsx`
  - DashboardToolbar at top
  - Zone 1: KPIRibbon (full width)
  - Below Zone 1: 12-column CSS Grid
    - Left (8 columns): Zone 2 (upper) + Zone 3 (lower)
    - Right (4 columns): Zone 5 (upper) + Zone 4 (lower)
  - Leadership Overview section below
  - All zones properly spaced (16px gap)
- [ ] **8.1.2** Verify cross-zone state synchronization
  - Select district in Zone 2 → Zone 3 updates
  - Role change → Zone 5 buttons update
  - Geographic filter → Zone 2 table filters
- [ ] **8.1.3** Responsive layout verification
  - Desktop (≥1440px): Full 8:4 split
  - Tablet (768–1024px): Stacked zones
  - Mobile (~390px): Single column, scrollable tables

---

## PHASE 9: LEADERSHIP OVERVIEW PANELS 🟢

### Task 9.1 — Top/Lower Five Matrix (Panel 1)
**Priority:** 🟢 Standard | **Estimated effort:** 45 min

- [ ] **9.1.1** Build `components/leadership/TopLowerMatrix/TopLowerMatrix.tsx`
  - Tab group: Event Coverage | Specific News Coverage
  - Two-column layout: Top 5 list | Lower 5 list
  - Numbered list with district name and count value
  - Total districts count at bottom
  - Compact table format

---

### Task 9.2 — Social Media Analysis (Panel 2)
**Priority:** 🟢 Standard | **Estimated effort:** 1.5 hours

- [ ] **9.2.1** Build `components/leadership/SocialMediaAnalysis/PlatformTabs.tsx`
  - Tabs: X (Twitter) | Facebook | Instagram | YouTube | LinkedIn | WhatsApp
  - Icon + label per tab
- [ ] **9.2.2** Build `components/leadership/SocialMediaAnalysis/EngagementMetrics.tsx`
  - 4 compact metric cards per platform:
    - Total Mentions (with trend)
    - Organic Reach (with trend)
    - Engagement Rate (with trend)
    - Reel Completion (with trend)
- [ ] **9.2.3** Build `components/leadership/SocialMediaAnalysis/TalukaEngagement.tsx`
  - ECharts horizontal bar chart: "Taluka-wise Engagement (Top 5)"
  - Grayscale bars
  - Labels: taluka name + value
- [ ] **9.2.4** Build `components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx`
  - Container with platform tabs
  - Metric cards + taluka chart below

---

### Task 9.3 — Maharashtra GIS Map (Panel 3)
**Priority:** 🟢 Standard | **Estimated effort:** 2 hours

- [ ] **9.3.1** Obtain Maharashtra district GeoJSON boundaries
  - Source: DataMeet India or similar open dataset
  - Must cover all 36 districts
  - Store in `public/geojson/maharashtra-districts.json`
- [ ] **9.3.2** Build `components/leadership/GISMap/GISMap.tsx`
  - react-simple-maps with ComposableMap + Geographies
  - Grayscale district fills
  - Hover: show district name + DIO status
  - Click: select district → sync with Zustand store
  - Division filter dropdown
  - Selected district highlighted
- [ ] **9.3.3** Build `components/leadership/GISMap/DistrictTooltip.tsx`
  - District name
  - DIO Status: ● Active / ○ Inactive
  - "View Details →" link
  - Position follows cursor

---

### Task 9.4 — Live Event Streaming (Panel 4)
**Priority:** 🟢 Standard | **Estimated effort:** 45 min

- [ ] **9.4.1** Build `components/leadership/LiveStreaming/StreamTabs.tsx`
  - Tabs: YouTube | Facebook | Instagram | TV Channels
- [ ] **9.4.2** Build `components/leadership/LiveStreaming/EmptyStreamState.tsx`
  - Play icon (circle)
  - "No live stream available"
  - "Live event streams will appear here when available."
  - Clean, honest empty state
- [ ] **9.4.3** Build `components/leadership/LiveStreaming/LiveStreaming.tsx`
  - Container with stream tabs
  - Show stream preview if available
  - Show empty state for unavailable sources
  - Division filter for filtering events
  - Keep compact and visually subordinate

---

### Task 9.5 — Leadership Overview Container
**Priority:** 🟢 Standard | **Estimated effort:** 20 min

- [ ] **9.5.1** Build `components/leadership/LeadershipOverview.tsx`
  - Section heading: "Leadership Overview"
  - 2-column CSS Grid on desktop
  - 1-column stack on mobile
  - Less visual prominence than primary zones
  - 4 panels in order: Top/Lower Matrix, Social Media, GIS Map, Live Streaming
  - Preserve the **four documented data pillars** as meaningful categories:
    1. Print and electronic media
    2. Social media and digital
    3. Fact-checking and crisis
    4. Field publicity and IEC (GPS logs, mobile van routes, street-play coverage)

---

## PHASE 10: INTERNATIONALIZATION (i18n) 🟢

### Task 10.1 — English/Marathi Language Support
**Priority:** 🟢 Standard | **Estimated effort:** 2 hours

- [ ] **10.1.1** Configure `next-intl` in App Router
  - Middleware for locale detection
  - Message file loading
- [ ] **10.1.2** Create `i18n/en.json` — English translations
  - All UI labels, headings, button text, status text
  - Navigation items
  - KPI labels and units
- [ ] **10.1.3** Create `i18n/mr.json` — Marathi translations
  - Complete translation of all UI strings
  - Note: OCR feed headlines already in Marathi
- [ ] **10.1.4** Apply translations to all components
  - Use `useTranslations` hook throughout
  - Ensure Marathi text renders correctly with Noto Sans Devanagari

---

## PHASE 11: ROLE-BASED ACCESS CONTROL 🟡

### Task 11.1 — Role UI Gating
**Priority:** 🟡 Important | **Estimated effort:** 1 hour

- [ ] **11.1.1** Implement `hooks/useRolePermissions.ts`
  ```typescript
  function useRolePermissions(): {
    canViewGlobalLeaderboard: boolean;
    canAuthorizeCrisis: boolean;
    canEnterLocalData: boolean;
    restrictedDistrict: string | null;
  }
  ```
- [ ] **11.1.2** Apply role-based visibility
  - **DG State Admin:** Full leaderboard, crisis authorization, no data entry
  - **District Collector:** Filtered leaderboard (own division), single-click crisis auth, no data entry
  - **DIO Desk:** No leaderboard, no crisis auth, local data entry buttons visible
- [ ] **11.1.3** Update Zone 2 — filter districts based on role
  - DG Admin: all districts visible
  - Collector: filter to their permitted districts
  - DIO: hide global leaderboard, show own district only
- [ ] **11.1.4** Update Zone 5 — conditional "Authorize Rebuttal" button
  - Show only for DG Admin and Collector roles
  - Disable for DIO Desk
- [ ] **11.1.5** Add visual indicator for current role in header
  - Clear role label, no duplicate indicators

---

## PHASE 12: RESPONSIVE REFINEMENT ⚪

### Task 12.1 — Responsive Testing & Fixes
**Priority:** ⚪ Enhancement | **Estimated effort:** 2 hours

- [ ] **12.1.1** Desktop (≥1440px) verification
  - Compact sidebar + full header
  - 4 KPI cards in single row
  - 8:4 column split working
  - 2-column leadership overview
  - No horizontal overflow
- [ ] **12.1.2** Tablet (768–1024px) adjustments
  - Sidebar collapses to icon-only or hidden
  - KPI cards: 2×2 grid
  - Main zones stacked or rebalanced
  - Leadership panels: 2-column maintained if possible
- [ ] **12.1.3** Mobile (~390px) adjustments
  - Hamburger menu for navigation
  - KPI cards stacked vertically
  - All zones stacked vertically
  - Emergency alert accessible without deep scrolling
  - Tables horizontally scrollable within containers
  - No page-level horizontal overflow
  - Touch-friendly controls (min 44px tap targets)
- [ ] **12.1.4** Fix any overlapping panels or collisions
  - Header vs sidebar interaction
  - Fixed vs scrollable content areas
  - Panel width constraints

---

## PHASE 13: POLISH & VALIDATION ⚪

### Task 13.1 — Visual Refinement
**Priority:** ⚪ Enhancement | **Estimated effort:** 1.5 hours

- [ ] **13.1.1** Verify monochrome compliance
  - No colored accents anywhere
  - No gradients or glassmorphism
  - Charts use grayscale only
  - Status indicators use text/shape, not color
- [ ] **13.1.2** Typography consistency audit
  - All headings using correct size/weight
  - KPI values moderate (not oversized)
  - Table text compact and readable
  - Monospaced only for timestamps/IDs
- [ ] **13.1.3** Spacing consistency audit
  - 16px zone gaps everywhere
  - Consistent panel padding
  - Aligned control heights
  - No excessive whitespace or cramped areas
- [ ] **13.1.4** Remove unnecessary elements
  - No duplicate controls
  - No misleading status indicators
  - No decorative markup
  - No excessive nested containers

---

### Task 13.2 — Interaction Validation
**Priority:** ⚪ Enhancement | **Estimated effort:** 1 hour

- [ ] **13.2.1** District selection sync
  - Click district in table → Zone 3 updates
  - Click district on map → Zone 3 updates + table highlights
  - Clear selection → Zone 3 shows placeholder
- [ ] **13.2.2** Filter interactions
  - Geographic scope changes → table, chart, feed update
  - Division filter → table filters, count updates
  - Search → table filters, count updates
  - Sentiment filter → OCR feed filters
- [ ] **13.2.3** Role switching
  - Switch role → leaderboard visibility changes
  - Switch role → crisis buttons show/hide
  - Switch role → data entry options appear/disappear
- [ ] **13.2.4** Sort interactions
  - Click sortable column header → table sorts
  - Sort indicator visible
  - Persistent sort across filter changes

---

### Task 13.3 — Final Acceptance Criteria Checklist
**Priority:** ⚪ Enhancement | **Estimated effort:** 30 min

- [ ] ✅ Five-zone desktop structure followed exactly
- [ ] ✅ Four primary KPI cards preserved
- [ ] ✅ Four leadership overview panels available
- [ ] ✅ Prescribed monochrome palette used
- [ ] ✅ District selection/ranking/filtering/decomposition synchronized
- [ ] ✅ TAT scoring follows documented thresholds
- [ ] ✅ Crisis monitor and OCR feed preserve functional behavior
- [ ] ✅ Role-based views reflect permission matrix
- [ ] ✅ Desktop + tablet + mobile responsive
- [ ] ✅ Existing functionality preserved or marked unavailable
- [ ] ✅ No overlapping panels, no horizontal overflow, no excessive nesting
- [ ] ✅ Demo data clearly labeled
- [ ] ✅ No fabricated districts, incidents, or live data

---

## Implementation Order (Critical Path)

```
Phase 1 (Foundation) ──→ Phase 2 (App Shell) ──→ Phase 3 (KPI Ribbon)
                                                       │
                                                       ▼
                              Phase 8 (Layout) ←── Phase 4 (Leaderboard)
                                    │                  │
                                    │                  ▼
                                    │           Phase 5 (Score Decomp)
                                    │
                                    ├──────→ Phase 6 (Emergency Alert)
                                    │
                                    ├──────→ Phase 7 (OCR Feed)
                                    │
                                    ▼
                              Phase 9 (Leadership Overview)
                                    │
                                    ▼
                              Phase 10 (i18n)
                                    │
                                    ▼
                              Phase 11 (RBAC)
                                    │
                                    ▼
                              Phase 12 (Responsive)
                                    │
                                    ▼
                              Phase 13 (Polish)
```

---

## Estimated Total Effort

| Phase | Description | Estimated Hours |
|---|---|---|
| Phase 1 | Project Foundation | ~5h |
| Phase 2 | Application Shell | ~4h |
| Phase 3 | KPI Ribbon | ~1.5h |
| Phase 4 | District Leaderboard | ~4h |
| Phase 5 | Score Decomposition | ~1.5h |
| Phase 6 | Emergency Alert | ~1.5h |
| Phase 7 | OCR Feed | ~1h |
| Phase 8 | Layout Assembly | ~1h |
| Phase 9 | Leadership Overview | ~5h |
| Phase 10 | i18n | ~2h |
| Phase 11 | RBAC | ~1h |
| Phase 12 | Responsive | ~2h |
| Phase 13 | Polish & Validation | ~3h |
| **Total** | | **~33h** |
