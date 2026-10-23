# Executive Dashboard Spatial Restructuring: Three-Column Workspace Architecture

## 1. Problem Statement & Architecture Strategy
The current executive dashboard (`src/components/dashboard/MainDashboard.tsx`) is arranged in vertically stacked rows:
1. Full-width KPI ribbon across the top.
2. A 2-column operational split (Left 8 cols: District Leaderboard + CPI Decomposition; Right 4 cols: Emergency Alert + Live News Queue).
3. A separate bottom section (`LeadershipOverview`) containing a 2x2 grid (Top/Lower Matrix, Social Media Split Streams, Maharashtra GIS Map, Live Event Streaming).

### Non-Destructive Separation Strategy:
To ensure maximum safety, reversibility, and code preservation:
- **Preserve Original Dashboard**: `src/components/dashboard/MainDashboard.tsx` is left 100% intact in the codebase.
- **Create New Executive Module**: Build `src/components/dashboard/ThreeColumnDashboard.tsx` embodying the balanced 3-column ProjectTrack spatial layout.
- **Plug Into Pages**: Update `src/app/dashboard/page.tsx` and `src/app/page.tsx` to import and render `<ThreeColumnDashboard />` instead of `<MainDashboard />`.

## 2. Target Three-Column Operational Hierarchy (ProjectTrack Spatial Layout)
Following the spatial composition of the reference ProjectTrack layout while strictly preserving the **Government of Maharashtra** institutional identity, color palette, data bindings, and feature set:

```
+---------------------------------------------------------------------------------------------------------------------------------+
| GLOBAL TOP HEADER (State Emblem, Search, Live Clock, Notifications, Clearance Avatar)                                            |
+---------------------------------------------------------------------------------------------------------------------------------+
| DASHBOARD TOOLBAR ("State Operations Overview", Division Filter, District Filter, Date Range Filter, Telemetry Export)           |
+---------------------------------------------------+---------------------------------------------+-------------------------------+
| COLUMN 1: DISTRICT PERFORMANCE                    | COLUMN 2: GEOGRAPHIC INTELLIGENCE           | COLUMN 3: LIVE INTELLIGENCE   |
| (Left Rail ~30% - 33%)                            | (Center Rail ~38% - 42%)                    | (Right Rail ~28% - 32%)       |
+---------------------------------------------------+---------------------------------------------+-------------------------------+
| 1. Key Performance Indicators (KPIRibbon)         | 1. Maharashtra GIS Map (GISMap)             | 1. Social Media Analysis      |
|    - 4 compact metric cards (2x2 grid)            |    - 800:664 aspect SVG map with DIO panel  |    - X/Twitter + Multi-feed   |
|    - Releases, TAT, Sentiment, Tickets            |    - Interactive hover & district drilldown |                               |
|                                                   |                                             | 2. Emergency Alert & Crisis   |
| 2. District Leaderboard (DistrictLeaderboard)     | 2. Breaking News Ticker (BreakingNewsTicker)|    - Dark-slate single axis   |
|    - Searchable 36-district table                 |    - Live wire strip under map              |    - High-threat incident card|
|    - Division filter & ranking                    |    - Cycle & pause accessible controls      |    - Active triage queue      |
|                                                   |                                             |                               |
| 3. CPI Score Decomposition (ScoreDecomposition)   | 3. Key Metrics & Trends (DistrictChart)     | 3. Live Media & News Ingestion|
|    - Volume, TAT, Sentiment, SLA                  |    - Top-5 stacked bar chart (ECharts)      |    - Full OCR / wire feed     |
|    - 4-stream composite breakdown                 |    - Volume, Speed, Sentiment, Crisis SLA   |    - Sentiment filter pills   |
|                                                   |                                             |                               |
|                                                   | 4. Additional District Comparison           | 4. Live Event Streaming       |
|                                                   |    - Top/Lower Five Matrix                  |    - 16:9 video player        |
|                                                   |    - Segmented switcher (Top / Lower)       |    - 4-channel switcher       |
+---------------------------------------------------+---------------------------------------------+-------------------------------+
```

## 3. Component Allocation & Inventory

| Component Name | Source Path | New Location | Status | Refactoring Required |
|---|---|---|---|---|
| `KPIRibbon` | `src/components/zones/KPIRibbon/` | Column 1, Top (Order 1) | Reused | Reflow into compact 2x2 grid within column |
| `DistrictLeaderboard` | `src/components/zones/DistrictLeaderboard/` | Column 1, Middle (Order 2) | Reused | Add `showChart={false}` to show table only (chart moved to center) |
| `ScoreDecomposition` | `src/components/zones/ScoreDecomposition/` | Column 1, Bottom (Order 3) | Reused | None; already compact and modular |
| `GISMap` | `src/components/leadership/GISMap/` | Column 2, Top (Order 1) | Reused | None; maintain aspect ratio and safe header |
| `BreakingNewsTicker` | `src/components/dashboard/BreakingNewsTicker.tsx` | Column 2, Middle (Order 2) | **NEW** | Compact single-line / slim ticker beneath map |
| `KeyMetricsTrends` | `src/components/dashboard/KeyMetricsTrends.tsx` | Column 2, Middle (Order 3) | **NEW** | Wraps `DistrictPerformanceChart` with header & legend |
| `TopLowerMatrix` | `src/components/leadership/TopLowerMatrix/` | Column 2, Bottom (Order 4) | Reused | None; standalone matrix component |
| `SocialMediaAnalysis` | `src/components/leadership/SocialMediaAnalysis/` | Column 3, Top (Order 1) | Reused | Compact split / stacked layout in right rail |
| `EmergencyAlert` | `src/components/zones/EmergencyAlert/` | Column 3, Middle (Order 2) | Reused | Maintained with single-axis header & triage |
| `LiveNewsQueue` | `src/components/dashboard/LiveNewsQueue.tsx` | Column 3, Middle (Order 3) | Reused | Full news queue with tabs, search, and badges |
| `LiveStreaming` | `src/components/leadership/LiveStreaming/` | Column 3, Bottom (Order 4) | Reused | 16:9 player with channel selector beneath |

## 4. Elimination of Duplicate Renderings & Layout Conflicts
1. **Stacked Bar Chart Duplication**: Previously, `DistrictPerformanceChart` was rendered inside `DistrictLeaderboard`. Since the ProjectTrack spatial layout places analytical trends directly below the center map/news ticker, `DistrictLeaderboard` accepts an optional `showChart?: boolean = true` prop. In `MainDashboard`, `showChart={false}` is passed, while the chart is rendered inside `KeyMetricsTrends` in Column 2. This prevents duplicate chart rendering.
2. **News Ingestion Separation**: The center column displays a compact, accessible `BreakingNewsTicker` strip directly below the map, while the right column displays the full, searchable `LiveNewsQueue` feed.
3. **LeadershipOverview Decoupling**: Rather than bundling `GISMap`, `TopLowerMatrix`, `SocialMediaAnalysis`, and `LiveStreaming` into an isolated bottom 2x2 section, their component boundaries are decoupled and placed into their respective spatial columns.

## 5. Responsive Breakpoint Behavior
- **Desktop (>= 1280px / `xl:` & `2xl:`)**: 3-column layout (`grid-cols-12`: Column 1 = 4 cols / 3.5 cols, Column 2 = 4 cols / 5 cols, Column 3 = 4 cols / 3.5 cols). All three columns align at the top (`items-start`).
- **Tablet (1024px - 1279px / `lg:`)**: 2-column layout. Column 1 (District Performance) and Column 2 (Geographic & Analytical Intelligence) side-by-side; Column 3 (Live Intelligence & Streaming) spans full width beneath or stacks in logical order.
- **Mobile (< 1024px)**: Single column reflow (`grid-cols-1`). Sequential reading order: KPIs -> Map -> News Ticker -> District Table -> CPI Decomposition -> Trends -> Matrix -> Social Intelligence -> Crisis Alert -> News Queue -> Live Streaming.

## 6. Accessibility & Operational Guardrails
- **Keyboard & Focus Management**: All interactive controls (tabs, dropdowns, buttons, ticker pause/play) maintain visible focus rings (`focus-visible:ring-1 focus-visible:ring-gov-blue`).
- **Motion Accessibility**: Breaking news ticker includes pause/play controls, cycle buttons, and respects `prefers-reduced-motion`.
- **Zero CLS Skeleton Synchronization**: `DashboardPageSkeleton.tsx` is updated to mirror the exact 3-column desktop geometry.
