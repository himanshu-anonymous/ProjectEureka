# Implementation Plan: Three-Column Executive Dashboard Workspace

## 1. Overview
Restructure the executive dashboard (`src/components/dashboard/MainDashboard.tsx`) into a balanced three-column desktop workspace inspired by the ProjectTrack reference layout, while retaining 100% of the Government of Maharashtra institutional design system, data bindings, routing, and component functionality.

## 2. Source Files Involved

### Files to Modify:
1. `src/components/zones/KPIRibbon/KPIRibbon.tsx`: Add flexible column layout support (`variant="column"` or responsive 2x2 grid `grid-cols-1 sm:grid-cols-2`) for comfortable rendering inside a column.
2. `src/components/zones/DistrictLeaderboard/DistrictLeaderboard.tsx`: Add optional `showChart?: boolean = true` prop to suppress the internal stacked bar chart when placed on the executive dashboard.
3. `src/app/dashboard/page.tsx`: Replace `<MainDashboard />` with the newly created `<ThreeColumnDashboard />`.
4. `src/app/page.tsx`: Replace `<MainDashboard />` with the newly created `<ThreeColumnDashboard />`.
5. `src/components/skeletons/DashboardPageSkeleton.tsx`: Synchronize the skeleton loader to match the 3-column layout, maintaining zero Cumulative Layout Shift (CLS).

### Files Preserved Unchanged:
- `src/components/dashboard/MainDashboard.tsx`: **Preserved intact** in the codebase as requested.

### New Components to Create:
1. `src/components/dashboard/ThreeColumnDashboard.tsx`: Dedicated new 3-column executive workspace module containing Column 1 (District Performance), Column 2 (Geographic Intelligence), and Column 3 (Live Intelligence).
2. `src/components/dashboard/BreakingNewsTicker.tsx`: Compact single-line / slim breaking news ticker placed directly beneath the Maharashtra GIS Map in Column 2.
3. `src/components/dashboard/KeyMetricsTrends.tsx`: Dedicated analytical trends card in Column 2 wrapping `DistrictPerformanceChart` with bilingual header and CPI pillar indicators.

## 3. Ordered Implementation Phases

### Phase 1: Sub-Component Layout Adaptations
- Update `DistrictLeaderboard.tsx` to accept `showChart?: boolean` (defaults to `true`). When `false`, it renders only the search bar, district counter, and ranked district table, with no duplicate chart.
- Update `KPIRibbon.tsx` to support compact reflow (`grid-cols-1 sm:grid-cols-2 gap-2.5` when in column layout).

### Phase 2: Create Center Column Auxiliary Modules
- Build `BreakingNewsTicker.tsx`:
  - Consumes existing `newsQueueData.ts` or store state.
  - Displays red/amber pulsing "BREAKING" badge, live headline, district tag, sentiment dot, and source publication.
  - Includes cycle buttons (`<`, `>`), pause/play toggle for accessibility, and click-to-expand.
- Build `KeyMetricsTrends.tsx`:
  - Institutional card header matching the government design tokens.
  - Mounts the existing `DistrictPerformanceChart` (stacked bar chart showing Volume, TAT, Sentiment, and Crisis SLA for top districts).
  - Responsive height (~240px) fitting neatly beneath the ticker.

### Phase 3: ThreeColumnDashboard.tsx 3-Column Composition & Page Replacement
- Build `ThreeColumnDashboard.tsx` with the 3 columns:
  - **Left Column** (`xl:col-span-4 2xl:col-span-3.5 flex flex-col gap-4.5`):
    1. `<KPIRibbon />` (2x2 cards)
    2. `<DistrictLeaderboard showChart={false} />` (Search + 36-district table)
    3. `<ScoreDecomposition />` (4 constituent score progress bars)
  - **Center Column** (`xl:col-span-4 2xl:col-span-5 flex flex-col gap-4.5`):
    1. `<GISMap />` (Aspect-locked Maharashtra map with DIO live state)
    2. `<BreakingNewsTicker />` (Compact breaking news strip)
    3. `<KeyMetricsTrends />` (Stacked bar trend chart)
    4. `<TopLowerMatrix />` (Top 5 vs Lower Band matrix)
  - **Right Column** (`xl:col-span-4 2xl:col-span-3.5 flex flex-col gap-4.5`):
    1. `<SocialMediaAnalysis />` (Split streams: X/Twitter + multi-platform)
    2. `<EmergencyAlert />` (Single-axis header, primary incident triage, active queue)
    3. `<LiveNewsQueue />` (Full live news wire feed with tabs & sentiment filters)
    4. `<LiveStreaming />` (16:9 video player + 4-channel selector)
- In `src/app/dashboard/page.tsx` and `src/app/page.tsx`, swap `<MainDashboard />` to `<ThreeColumnDashboard />`.
- `MainDashboard.tsx` remains completely preserved in the codebase.

### Phase 4: Zero CLS Skeleton Synchronization
- Update `DashboardPageSkeleton.tsx` to match the exact 3-column desktop layout.
- Verify that initial page load and authentication verification (`!authInitialized`) show no layout shifts.

### Phase 5: Verification & Quality Assurance
- Automated Tests: Run `npm test` to verify all 49 existing test cases pass.
- TypeScript Verification: Run `npx tsc --noEmit` to ensure 0 type errors.
- Production Build: Run `npm run build` to confirm all 30 routes compile without warnings or errors.
- Responsive Checks: Verify layout across 320px, 768px, 1024px, 1280px, and 1600px viewports.

## 4. Regression Risks & Mitigations
- **Risk 1: Duplicate Chart Rendering**: If `DistrictPerformanceChart` is mounted in both the Left Column and Center Column.
  - *Mitigation*: Prop `showChart={false}` ensures `DistrictLeaderboard` only renders the table in `MainDashboard`.
- **Risk 2: Right Column Horizontal Overflow**: The right rail in a 3-column layout is ~340px-420px.
  - *Mitigation*: `EmergencyAlert.tsx` already uses a compact single-axis header and proportional buttons; `SocialMediaAnalysis.tsx` and `LiveStreaming.tsx` will use single-column / flex-col layout on narrow column widths.
- **Risk 3: CLS on Initial Auth / Loading**: Changing `MainDashboard.tsx` without synchronizing `DashboardPageSkeleton.tsx`.
  - *Mitigation*: Mirror the 3-column grid structure in `DashboardPageSkeleton.tsx`.
