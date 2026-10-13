# Maha-Command Center — Component Architecture

> **Document type:** Component decomposition for Next.js implementation
> **Framework:** Next.js 14+ (App Router) + Tailwind CSS + ECharts

---

## 1. Project File Structure (Proposed)

```
maha-command-center/
├── public/
│   ├── fonts/                        # Noto Sans font files
│   ├── geojson/                      # Maharashtra district boundary data
│   └── images/                       # Static assets (Maharashtra emblem etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (Application Shell)
│   │   ├── page.tsx                  # Redirect to /command-overview
│   │   ├── globals.css               # Design tokens + Tailwind config
│   │   ├── command-overview/
│   │   │   └── page.tsx              # Main Dashboard (5-zone layout)
│   │   ├── media-surveillance/
│   │   │   └── page.tsx              # Stub page
│   │   ├── narrative-sentiment/
│   │   │   └── page.tsx              # Stub page
│   │   ├── misinformation/
│   │   │   └── page.tsx              # Stub page
│   │   ├── district-operations/
│   │   │   └── page.tsx              # Stub page
│   │   ├── press-releases/
│   │   │   └── page.tsx              # Stub page
│   │   └── audit-telemetry/
│   │       └── page.tsx              # Stub page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Header + Sidebar + Content wrapper
│   │   │   ├── Header.tsx            # 56-64px persistent header
│   │   │   ├── Sidebar.tsx           # 208-224px left navigation
│   │   │   ├── DashboardToolbar.tsx  # Toolbar below header
│   │   │   └── MobileNav.tsx         # Mobile navigation overlay
│   │   ├── zones/
│   │   │   ├── KPIRibbon/
│   │   │   │   ├── KPIRibbon.tsx     # Zone 1 container (4 cards)
│   │   │   │   └── KPICard.tsx       # Individual KPI card
│   │   │   ├── DistrictLeaderboard/
│   │   │   │   ├── DistrictLeaderboard.tsx    # Zone 2 container
│   │   │   │   ├── PerformanceChart.tsx       # Top 5 bar chart (ECharts)
│   │   │   │   ├── DistrictTable.tsx          # Ranked data table
│   │   │   │   ├── DistrictTableControls.tsx  # Search + division filter
│   │   │   │   └── TopLowerTabs.tsx           # CPI / Event / News tabs
│   │   │   ├── ScoreDecomposition/
│   │   │   │   ├── ScoreDecomposition.tsx     # Zone 3 container
│   │   │   │   ├── ComponentBar.tsx           # Single score bar
│   │   │   │   └── scoring.ts                 # CPI calculation logic
│   │   │   ├── EmergencyAlert/
│   │   │   │   ├── EmergencyAlert.tsx         # Zone 5 container
│   │   │   │   ├── PrimaryIncident.tsx        # Featured incident card
│   │   │   │   ├── SecondaryIncident.tsx      # Compact incident row
│   │   │   │   └── SLACountdown.tsx           # SLA timer component
│   │   │   └── OCRFeed/
│   │   │       ├── OCRFeed.tsx                # Zone 4 container
│   │   │       ├── FeedItem.tsx               # Individual feed record
│   │   │       └── SentimentFilter.tsx        # All/Positive/Negative/Neutral
│   │   ├── leadership/
│   │   │   ├── LeadershipOverview.tsx          # 2-column grid wrapper
│   │   │   ├── TopLowerMatrix/
│   │   │   │   ├── TopLowerMatrix.tsx         # Panel 1
│   │   │   │   └── ExtremesTable.tsx          # Top 5 / Lower 5 table
│   │   │   ├── SocialMediaAnalysis/
│   │   │   │   ├── SocialMediaAnalysis.tsx    # Panel 2
│   │   │   │   ├── PlatformTabs.tsx           # Platform tab navigation
│   │   │   │   ├── EngagementMetrics.tsx      # Metric cards
│   │   │   │   └── TalukaEngagement.tsx       # Bar chart
│   │   │   ├── GISMap/
│   │   │   │   ├── GISMap.tsx                 # Panel 3
│   │   │   │   └── DistrictTooltip.tsx        # Hover/selection info
│   │   │   └── LiveStreaming/
│   │   │       ├── LiveStreaming.tsx           # Panel 4
│   │   │       ├── StreamTabs.tsx             # YouTube/FB/IG/TV tabs
│   │   │       └── EmptyStreamState.tsx       # Unavailable state
│   │   └── shared/
│   │       ├── Panel.tsx              # Reusable panel surface
│   │       ├── Badge.tsx              # Monochrome badge
│   │       ├── Button.tsx             # Action button
│   │       ├── Select.tsx             # Dropdown select
│   │       ├── SearchInput.tsx        # Search field
│   │       ├── TabGroup.tsx           # Tab navigation
│   │       ├── ProgressBar.tsx        # Horizontal progress bar
│   │       ├── StatusText.tsx         # Restrained status indicator
│   │       └── Tooltip.tsx            # Info tooltip
│   ├── data/
│   │   ├── districts.ts               # 36 district demo dataset
│   │   ├── incidents.ts               # Demo misinformation incidents
│   │   ├── ocrFeed.ts                 # Demo OCR feed records
│   │   ├── socialMedia.ts             # Demo social media metrics
│   │   └── liveStreams.ts             # Demo stream data
│   ├── hooks/
│   │   ├── useDistrictSelection.ts    # District selection sync
│   │   ├── useRolePermissions.ts      # Role-based UI gating
│   │   ├── useSLACountdown.ts         # SLA timer logic
│   │   └── useGeographicFilter.ts     # Scope filter state
│   ├── stores/
│   │   └── dashboardStore.ts          # Zustand store for cross-zone state
│   ├── lib/
│   │   ├── scoring.ts                 # CPI scoring formulas
│   │   ├── formatting.ts             # Number/date formatting
│   │   └── constants.ts              # Application constants
│   ├── types/
│   │   ├── district.ts               # District data types
│   │   ├── incident.ts               # Incident data types
│   │   ├── kpi.ts                    # KPI metric types
│   │   ├── ocrRecord.ts             # OCR feed record types
│   │   └── roles.ts                  # Role permission types
│   └── i18n/
│       ├── config.ts                 # i18n configuration
│       ├── en.json                   # English translations
│       └── mr.json                   # Marathi translations
├── tailwind.config.ts                # Tailwind with design tokens
├── next.config.ts                    # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 2. Component Dependency Graph

```
AppShell
├── Header
│   ├── SyncStatus
│   ├── RefreshButton
│   ├── RoleSelector (Select)
│   ├── LanguageSelector (Select)
│   └── UserProfileMenu
├── Sidebar
│   └── NavItem × 7
├── MobileNav (responsive overlay)
└── DashboardToolbar
    ├── PageTitle
    ├── GeographicScopeSelector (Select)
    └── PeriodFilter (Select)

CommandOverviewPage
├── KPIRibbon
│   └── KPICard × 4
├── LeftWorkspace (8 columns)
│   ├── DistrictLeaderboard
│   │   ├── TopLowerTabs (CPI / Event / News)
│   │   ├── PerformanceChart (ECharts bar chart)
│   │   ├── DistrictTableControls (SearchInput + Select)
│   │   └── DistrictTable (TanStack Table)
│   └── ScoreDecomposition
│       ├── DistrictHeader (name + rank + CPI)
│       └── ComponentBar × 4 (Volume, TAT, Sentiment, Crisis SLA)
├── RightWorkspace (4 columns)
│   ├── EmergencyAlert
│   │   ├── PrimaryIncident
│   │   │   ├── SLACountdown
│   │   │   ├── ViewEvidence (Button)
│   │   │   ├── ViewTimeline (Button)
│   │   │   └── AuthorizeRebuttal (Button, role-gated)
│   │   └── SecondaryIncident × N
│   └── OCRFeed
│       ├── FeedHeader (refresh + insert sample)
│       ├── SentimentFilter
│       └── FeedItem × N
└── LeadershipOverview (2-col grid)
    ├── TopLowerMatrix
    │   ├── TabGroup (Event Coverage / Specific News)
    │   └── ExtremesTable × 2 (Top 5 / Lower 5)
    ├── SocialMediaAnalysis
    │   ├── PlatformTabs
    │   ├── EngagementMetrics (4 metric cards)
    │   └── TalukaEngagement (ECharts horizontal bar)
    ├── GISMap
    │   ├── MapView (D3/Leaflet)
    │   ├── DivisionFilter (Select)
    │   └── DistrictTooltip
    └── LiveStreaming
        ├── StreamTabs (YouTube/FB/IG/TV)
        └── StreamPlayer or EmptyStreamState
```

---

## 3. State Management Architecture (Zustand)

### Store: `dashboardStore`

```typescript
interface DashboardState {
  // Geographic scope
  selectedScope: 'all' | 'division' | 'district';
  selectedDivision: string | null;
  selectedDistrict: string | null;

  // User role
  currentRole: 'dg_admin' | 'collector' | 'dio_desk';

  // Language
  locale: 'en' | 'mr';

  // Reporting period
  reportingPeriod: '7d' | '30d' | '90d';

  // Sync status
  lastSyncTime: Date | null;
  syncStatus: 'synced' | 'syncing' | 'error';

  // Actions
  setSelectedDistrict: (district: string | null) => void;
  setSelectedDivision: (division: string | null) => void;
  setCurrentRole: (role: string) => void;
  setLocale: (locale: 'en' | 'mr') => void;
  // ...
}
```

### Cross-Zone Synchronization

```
User selects district in Zone 2 (Leaderboard)
  → dashboardStore.setSelectedDistrict(districtId)
  → Zone 2: Highlights selected row in table
  → Zone 3: Updates CPI decomposition for selected district
  → Zone 5: Filters incidents for selected district (if applicable)
  → Zone 4: Filters OCR feed for selected district (if applicable)
  → GIS Map: Highlights selected district on map
```

---

## 4. ECharts Integration Points

| Zone | Chart Type | Library | Data Source |
|---|---|---|---|
| Zone 2 | Top 5 vertical bar chart | echarts-for-react | District CPI scores |
| Zone 3 | 4× horizontal progress bars | Custom CSS (no ECharts needed) | CPI component scores |
| Social Media | Horizontal bar chart (Taluka engagement) | echarts-for-react | Taluka engagement data |
| GIS Map | SVG/Canvas map | react-simple-maps or d3-geo | GeoJSON boundaries |

### ECharts Theme (Monochrome)

```javascript
const monochromeTheme = {
  color: ['#303134', '#5F6368', '#80868B', '#DADCE0', '#E8EAED'],
  backgroundColor: '#FFFFFF',
  textStyle: { color: '#202124', fontFamily: 'Noto Sans' },
  // ... grayscale-only series
};
```

---

## 5. Responsive Strategy

### Breakpoint System (Tailwind)

```
sm: 640px    — Mobile landscape
md: 768px    — Tablet portrait  
lg: 1024px   — Tablet landscape
xl: 1280px   — Desktop
2xl: 1440px  — Desktop full
```

### Layout Transformations

| Viewport | KPI Ribbon | Main Workspace | Leadership |
|---|---|---|---|
| ≥1440px | 4 cols | 8:4 split | 2 cols |
| 1024-1439px | 4 cols (compressed) | 8:4 split | 2 cols |
| 768-1023px | 2×2 grid | Stacked (full width) | 2 cols |
| <768px | 1 col stacked | Stacked (full width) | 1 col stacked |

### Sidebar Behavior

| Viewport | Behavior |
|---|---|
| ≥1024px | Persistent, 208-224px |
| 768-1023px | Collapsed, icon-only (~56px) |
| <768px | Hidden, hamburger menu overlay |
