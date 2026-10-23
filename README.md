# Maha-Command Center (महा-कमांड सेंटर)
### Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra

[![Next.js](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown?style=flat)](https://github.com/pmndrs/zustand)
[![ECharts](https://img.shields.io/badge/Apache_ECharts-6.1-red?style=flat&logo=apache-echarts)](https://echarts.apache.org/)
[![GIGW 3.0](https://img.shields.io/badge/Compliance-GIGW_3.0_%26_UX4G-orange?style=flat)](https://guidelines.india.gov.in/)
[![Tests](https://img.shields.io/badge/Test_Suite-77%2F77_Passing_(100%25)-brightgreen?style=flat)](https://nodejs.org/api/test.html)
[![Routes](https://img.shields.io/badge/App_Routes-31_Routes_(Static_%26_Dynamic)-blue?style=flat)](https://nextjs.org/)

---

## 1. Project Overview & Mission

The **Maha-Command Center** is a high-density, government-grade operational command deck and web portal engineered for the **Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra**.

The platform serves as the central nervous system for statewide media intelligence, crisis response orchestration, departmental public communications, and standardized district performance benchmarking across all **36 administrative districts** and **6 revenue divisions** (Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, and Nagpur).

### Core Problem Statements Addressed
1. **Siloed Media Ingestion**: Unifies print newspaper clippings, TV broadcast channels, OCR feeds, and social listening into a single real-time stream with automated sentiment scoring.
2. **Delayed Misinformation Countermeasures**: Implements a dedicated Crisis War Room enforcing a strict **90-minute Service Level Agreement (SLA)** for District Collector-authorized rebuttals.
3. **Decentralized Departmental Media Archives**: Provides a structured digital asset vault for press releases, high-resolution photographs, event video reels, and Government Resolutions (GRs).
4. **Lack of Standardized Public Relations Metrics**: Evaluates every district through the **Communication Performance Index (CPI)**:
   $$\text{CPI} = \text{Volume Score (25)} + \text{TAT Dispatch Score (25)} + \text{Sentiment Score (25)} + \text{Crisis SLA Score (25)}$$
5. **Zero Layout Shift & Persistent App Shell**: Implements precision component-wise skeleton shimmer loaders across all 15 route segments and in-card loading states, eliminating full-screen blocking modals and layout jumps.
6. **Responsive Breathing Room Executive Cockpit (v5.0)**: Provides a progressive 3-stage responsive grid scaling from mobile handsets (320px) up to 4K executive command walls (1920px+), with natural card heights, zero text collision, and baseline vertical alignment.

### 24-Hour PR & Communications Operational Lifecycle
* **06:00 – 08:30 AM (Ingestion)**: Scraping and OCR analysis of 18 regional newspapers, 4 TV news channels, and social media channels.
* **08:30 – 10:00 AM (Verification & Sentiment)**: Field DIO verification, sentiment tagging, and rumor classification.
* **10:00 – 01:00 PM (Departmental Dispatch)**: Drafting, bilingual English-Marathi translation, and dissemination of press releases.
* **01:00 – 04:30 PM (Crisis SLA Monitoring)**: Tracking viral misinformation with mandatory 90-minute SLA countdown and Collector sign-off.
* **04:30 – 07:00 PM (Live Briefings & Relays)**: Relaying live CMO/Cabinet hall video streams and district media pools.
* **07:00 – 09:30 PM (Leadership Briefing)**: Compiling automated executive summaries and daily performance dossiers.

---

## 2. Test Login Credentials & Personas

The platform features an enterprise-grade government authentication gateway supporting **dual-mode authentication**:
* **Security PIN Authentication**: Officer ID / Email + 4-digit Security PIN (`8842`).
* **Official Password Authentication**: Officer ID / Email + official secure password.
* **Evaluation Quick-Auth**: A sliding demo drawer in the bottom right corner with one-click credential pre-filling for all 5 authorized personas.
* **Anti-Automation CAPTCHA**: Security math challenge (auto-refreshed, click-to-solve supported for authorized testing).
* **Session Persistence & Redirection Guards**: Cryptographically signed HMAC-SHA256 JWT tokens with a strict 12-hour Time-to-Live (TTL) stored in HTTP-only cookies (`maha_auth_token`), backed by automated `/login` route interception in Next.js middleware and server-side redirects.

### Authorized Test Personas Table

| # | Officer Name & Designation | Role ID | Username / Officer ID | Official Gov Email Alias | Security PIN / Password | Clearance Tier & Scope | Rebuttal Authority |
|---|----------------------------|---------|-----------------------|--------------------------|-------------------------|------------------------|--------------------|
| **1** | **Dr. Arvind M. Gokhale**<br>*(डॉ. अरविंद एम. गोखले)*<br>Director General, DGIPR | `dg_admin` | `admin` *(or `mh-state-dg-01`)* | `dg.gokhale@maharashtra.gov.in` | **PIN:** `8842`<br>**Pass:** *(any)* | **Tier 1 — Full State Command**<br>All 6 Revenue Divisions & 36 Districts | **Yes** (State-wide) |
| **2** | **Rudresh Kumar Sawant**<br>*(रुद्रेश कुमार सावंत)*<br>Divisional Deputy Director | `director_konkan` | `director_konkan` *(or `mh-dgipr-dir-01`)* | `director.konkan@maharashtra.gov.in` | **PIN:** `8842`<br>**Pass:** *(any)* | **Tier 2 — Divisional Command**<br>Konkan Division (Palghar, Thane, Raigad, Ratnagiri, Sindhudurg) | **No** (Divisional Review) |
| **3** | **Vikram S. Mahajan, IAS**<br>*(विक्रम एस. महाजन, भा.प्र.से.)*<br>District Magistrate & Collector, Palghar | `collector` | `collector_palghar` *(or `mh-dm-palghar-01`)* | `collector.palghar@maharashtra.gov.in` | **PIN:** `8842`<br>**Pass:** *(any)* | **Tier 2 — District Command**<br>Palghar District Desk | **Yes** (Palghar SLA Sign-off) |
| **4** | **Nilesh R. Kelkar, IAS**<br>*(निलेश आर. केळकर, भा.प्र.से.)*<br>District Magistrate & Collector, Thane | `collector` | `collector_thane` *(or `mh-dm-thane-01`)* | `collector.thane@maharashtra.gov.in` | **PIN:** `8842`<br>**Pass:** *(any)* | **Tier 2 — District Command**<br>Thane District Desk (Rank #1 Benchmark) | **Yes** (Thane SLA Sign-off) |
| **5** | **Mandar S. Nerurkar**<br>*(मंदार एस. नेरुरकर)*<br>DIO Desk Operator, Konkan Division | `dio_desk` | `operator_konkan` *(or `operator1`, `mh-dgipr-konkan-04`)* | `operator_konkan@dgipr.maharashtra.gov.in` | **PIN:** `8842`<br>**Pass:** *(any)* | **Tier 3 — Field Desk**<br>Palghar & Konkan Field Desk | **No** (Drafting & Ingestion Only) |

> **Quick Access Tip:** Any of the five personas can be populated into the login form instantly by clicking the **"Evaluation / Demo Quick-Auth (5 Personas)"** floating bar at the bottom right of `/login`.

---

## 3. Complete File Structure & Functional Descriptions

```
maha-command-center/
├── .eslintrc.json                          # ESLint configuration (Next.js core-web-vitals)
├── .gitignore                              # Git exclusion rules
├── .npmrc                                  # NPM runtime configuration
├── MAHAGOV_ICON.svg                        # Government of Maharashtra high-resolution emblem SVG
├── next.config.mjs                         # Next.js 16 configuration (Webpack bundling & optimization)
├── package.json                            # Project dependencies and operational scripts
├── postcss.config.mjs                      # PostCSS plugins configuration
├── tailwind.config.ts                      # Tailwind CSS design tokens, institutional palette, shimmer keyframes
├── tsconfig.json                           # TypeScript strict compiler configuration
│
├── scripts/
│   └── build-maharashtra-geo.mjs           # CLI script to parse & compile TopoJSON to SVG map coordinates
│
├── tests/
│   ├── suite.test.mjs                      # Core portal suite (Personas, light theme, Konkan data, navigation)
│   ├── jwt.test.mjs                        # JWT authentication, HMAC-SHA256 signing, 12-hour TTL security suite
│   ├── skeleton_loaders.test.mjs           # Component-wise skeletons, persistent app shell, loading boundaries suite
│   ├── three_column_dashboard.test.mjs     # Executive 3-column workspace & responsive breathing room (v5.0) suite
│   ├── auth_redirect.test.mjs              # Authenticated session & /login redirection guard suite
│   └── ai_assistant.test.mjs               # Route-aware morphing AI Assistant widget & hybrid pipeline suite
│
├── public/                                 # Static public assets, icons, and emblems
│
└── src/
    ├── middleware.ts                       # Next.js Edge middleware for active session interception & /login redirect
    ├── symbols.jsx                         # Centralized Solid Heroicons pure SVG component pack
    │
    ├── types/
    │   └── dashboard.ts                    # Core TypeScript models (AuthUser, DistrictData, IncidentData, OCRRecord)
    │
    ├── lib/
    │   ├── ai/
    │   │   └── route-prompts.ts            # Route prompt pools (6-8/route), local government FAQ & Fisher-Yates shuffle
    │   ├── dataLocalization.ts            # Dynamic bilingual Marathi/English number and string formatting helpers
    │   ├── jwt.ts                         # Edge-compatible HMAC-SHA256 JWT signing, validation, and 12-hr TTL
    │   ├── sentimentEngine.ts             # Multi-factor sentiment evaluation and scoring engine
    │   ├── serverData.ts                  # In-memory mock server database, officer registry, and mutation APIs
    │   └── translations.ts                # Full English & Marathi (मराठी) localization dictionary
    │
    ├── stores/
    │   └── dashboardStore.ts              # Global Zustand state (auth, filters, debounced transitions, crisis state)
    │
    ├── data/
    │   ├── dashboardData.ts               # District baseline metrics, incident records, and OCR stream seed data
    │   ├── dioDirectory.ts                # Statewide directory of District Information Officers (contacts & status)
    │   ├── maharashtraGeo.generated.ts    # Pre-calculated SVG district vector boundary coordinates
    │   ├── newsQueueData.ts               # Live ingested news stories with sentiment metrics
    │   └── telemetryLogsAndAuditData.ts   # System audit ledger, latency logs, and network traffic records
    │
    ├── components/
    │   ├── ai/                            # Floating AI Command Assistant Widget
    │   │   └── ai-assistant-widget.tsx    # Route-aware morphing widget with spring physics, FAB & outside collapse
    │   │
    │   ├── shared/                        # Reusable core primitive UI components
    │   │   ├── GovEmblem.tsx              # Scalable SVG Government of Maharashtra emblem
    │   │   ├── MaterialIcon.tsx           # Material Symbol icon bridge
    │   │   ├── Panel.tsx                  # Accessible container card with header actions
    │   │   ├── Skeleton.tsx               # Base accessible animated shimmer skeleton primitive
    │   │   └── symbols.jsx                # Re-exported SVG icon definitions
    │   │
    │   ├── layout/                        # Application layout shells & navigation
    │   │   ├── DashboardLayout.tsx        # Persistent app shell with 2px saffron progress line & route-aware skeletons
    │   │   ├── Header.tsx                 # GIGW-compliant top bar (emblem, breadcrumbs, search, user menu)
    │   │   ├── Sidebar.tsx                # Collapsible navigation drawer with role-based visibility & dropdowns
    │   │   ├── DashboardToolbar.tsx       # Division/district filter bar, export triggers, and time range
    │   │   └── GlobalSearchBar.tsx        # Modal quick-search with keyboard shortcuts and entity indexing
    │   │
    │   ├── portal/                        # Primary application route screen views
    │   │   ├── LoginScreen.tsx            # Split-card login portal with animated auth handshake & session guards
    │   │   ├── ActivitiesScreen.tsx       # Daily ministerial itineraries, press pool, and 24-hr PR workflow
    │   │   ├── CrisisScreen.tsx           # Misinformation War Room with 90-min SLA timer and rebuttal approval
    │   │   ├── DistrictsScreen.tsx        # Comprehensive 36-district registry, rankings, and CPI breakdown
    │   │   ├── MediaScreen.tsx            # Multi-media vault (print clippings, TV airtime, OCR, social feeds)
    │   │   ├── NotificationsScreen.tsx    # Operational alert center with SLA urgencies and DIO field queries
    │   │   ├── PressReleasesScreen.tsx    # Bilingual press release drafting, editorial review, and PDF release
    │   │   ├── ProfileScreen.tsx          # Officer credentials dossier, clearance tier, and language toggles
    │   │   └── ReportsScreen.tsx          # Automated intelligence report generator with CSV/PDF exports
    │   │
    │   ├── dashboard/                     # Core executive cockpit components
    │   │   ├── ThreeColumnDashboard.tsx   # Executive 3-column command cockpit with 3-stage progressive scaling (v5.0)
    │   │   ├── MainDashboard.tsx          # Preserved intact legacy/fallback dashboard orchestrator
    │   │   ├── BreakingNewsTicker.tsx     # High-contrast solid red wire banner with white text (`rounded-xl px-4 py-2`)
    │   │   ├── KeyMetricsTrends.tsx       # 4-metric trend analysis card with Apache ECharts visualization
    │   │   ├── LiveNewsQueue.tsx          # Real-time media & news ingestion wirefeed capped at `max-h-[210px]`
    │   │   ├── OperationsWorkspace.tsx    # Multi-column fallback workspace grid
    │   │   ├── CrisisOperationsColumn.tsx # Fallback crisis operations wrapper
    │   │   └── DistrictOperationsColumn.tsx # Fallback district operations wrapper
    │   │
    │   ├── skeletons/                     # Precision component-wise skeleton loaders (Zero Cumulative Layout Shift)
    │   │   ├── DashboardPageSkeleton.tsx  # Executive 3-column dashboard page skeleton with ribbon, ticker & map
    │   │   ├── GISMapSkeleton.tsx         # 100% width map canvas skeleton with 4-column telemetry sub-grid
    │   │   ├── KPIRibbonSkeleton.tsx      # 4-card KPI ribbon shimmer skeleton
    │   │   ├── LeaderboardSkeleton.tsx    # Searchable 36-district table skeleton
    │   │   ├── ScoreDecompositionSkeleton.tsx # CPI 4-pillar score decomposition skeleton
    │   │   ├── EmergencyAlertSkeleton.tsx # Emergency alert skeleton preserving operator collapsed state
    │   │   ├── LiveNewsQueueSkeleton.tsx  # Real-time news queue shimmer skeleton
    │   │   ├── TopLowerMatrixSkeleton.tsx # Top & bottom district matrix table skeleton
    │   │   ├── LiveStreamingSkeleton.tsx  # Video stream and 2x2 channel relay buttons skeleton
    │   │   ├── SocialMediaSkeleton.tsx    # Dual-stream social media analysis skeleton
    │   │   ├── LeadershipOverviewSkeleton.tsx # Leadership overview metrics skeleton
    │   │   ├── ActivitiesSkeleton.tsx     # Activities page skeleton
    │   │   ├── CommandCenterSkeleton.tsx  # Command center view skeleton
    │   │   ├── CrisisPageSkeleton.tsx     # Crisis War Room page skeleton
    │   │   ├── DistrictsPageSkeleton.tsx  # 36-District registry page skeleton
    │   │   ├── MediaMonitoringSkeleton.tsx # Media vault page skeleton
    │   │   ├── NotificationsSkeleton.tsx  # Notifications page skeleton
    │   │   ├── PipelineFlowSkeleton.tsx   # Pipeline flowchart skeleton
    │   │   ├── PressReleasesSkeleton.tsx  # Press releases page skeleton
    │   │   ├── ProfileSkeleton.tsx        # Officer profile page skeleton
    │   │   ├── RawIngestionSkeleton.tsx   # Raw ingestion view skeleton
    │   │   ├── ReportsSkeleton.tsx        # Intelligence reports page skeleton
    │   │   └── SystemMonitoringSkeleton.tsx # System monitoring view skeleton
    │   │
    │   ├── commandCenter/                 # 3-Column Command Control Deck (`/command-center`)
    │   │   ├── CommandCenterView.tsx      # Composite 3-column live command view
    │   │   ├── CommandCenterNavHeader.tsx # Sub-navigation bar across Command Deck, Ingestion, and Pipeline
    │   │   ├── RawIngestionView.tsx       # Real-time multi-channel media ingestion stream view
    │   │   ├── PipelineFlowView.tsx       # End-to-end data processing flowchart view
    │   │   ├── TelemetryOperationsView.tsx # System health, latency, queue throughput, and error rates view
    │   │   ├── AnimatedTelemetryMesh.tsx  # Light-themed nodal network telemetry visualization
    │   │   ├── AnimatedPipelineDiagram.tsx # SVG animated pipeline data packet flow diagram
    │   │   ├── center/
    │   │   │   ├── CommandCenterCenterSection.tsx # Orchestrator for center column
    │   │   │   ├── MaharashtraMapTopology.tsx   # Interactive SVG topology of 36 Maharashtra districts
    │   │   │   ├── DistrictSubHeadSelector.tsx  # Quick selector for district sub-heads with CPI badges
    │   │   │   └── DIODataDrawer.tsx            # Slide-out telemetry drawer for District Information Officers
    │   │   ├── left/
    │   │   │   ├── CommandCenterLeftSection.tsx  # Orchestrator for left media column
    │   │   │   ├── NewspaperDataSection.tsx     # Print clippings metrics and stacked sentiment EChart
    │   │   │   ├── TVChannelDataSection.tsx     # Broadcast TV airtime distribution chart
    │   │   │   └── SocialMediaDataSection.tsx   # Social listening velocity graph and platform breakdown
    │   │   └── right/
    │   │       ├── CommandCenterRightSection.tsx # Orchestrator for right leadership column
    │   │       ├── LeadershipMessagesSection.tsx # Verified leadership directives feed with urgency tags
    │   │       └── LiveStreamingLinkSection.tsx # Live video broadcast player with multi-source switch
    │   │
    │   ├── departments/                   # Department-Wise Public Relations Vault
    │   │   ├── DepartmentWiseDataView.tsx # Main departmental hub orchestrator
    │   │   ├── DepartmentSelector.tsx     # Dropdown/pill selector for state ministries
    │   │   ├── DepartmentPressReleases.tsx # Departmental press releases ledger
    │   │   ├── DepartmentPhotographs.tsx  # High-resolution photographic archive with photographer credits
    │   │   ├── DepartmentVideos.tsx       # Official video broadcast archive
    │   │   ├── DepartmentSocialAnalysis.tsx # Real-time social handle metrics, followers, and sentiment
    │   │   └── DepartmentEmptySlot.tsx    # Extensible modular slot for Government Resolutions (GRs)
    │   │
    │   ├── leadership/                    # Executive State Leadership Module
    │   │   ├── LeadershipOverview.tsx     # Executive briefing cards and statewide CPI overview
    │   │   ├── GISMap/GISMap.tsx          # District geographic performance heatmap (100% width + sub-strip)
    │   │   ├── LiveStreaming/LiveStreaming.tsx # 16:9 video player with 2x2 relay selector buttons
    │   │   ├── SocialMediaAnalysis/SocialMediaAnalysis.tsx # Social listening analyzer with tab pills & stacked feeds
    │   │   └── TopLowerMatrix/TopLowerMatrix.tsx # Top vs. bottom performing district comparison matrix
    │   │
    │   ├── workflow/                      # Operational PR Lifecycle Visualizers
    │   │   ├── DailyWorkFlowchart.tsx     # Interactive 6-stage 24-hour PR operational workflow chart
    │   │   └── WorkflowStepCard.tsx       # Milestone stage card with hours and duties
    │   │
    │   ├── zones/                         # Analytical Dashboard Widgets
    │   │   ├── KPIRibbon/                 # Top headline metrics (CPI Avg, SLA Compliance, TAT, Sentiment)
    │   │   │   ├── KPIRibbon.tsx          # Full-width responsive 4-card KPI ribbon
    │   │   │   └── KPICard.tsx            # Individual metric card with trend indicator and sparkline
    │   │   ├── DistrictLeaderboard/       # Searchable 36-district ranking table with sorting & charts
    │   │   │   ├── DistrictLeaderboard.tsx # Leaderboard orchestrator with bottom-docked pagination
    │   │   │   ├── DistrictPerformanceChart.tsx # Top 5 districts 4-pillar index EChart with clean legend
    │   │   │   ├── DistrictTable.tsx      # Table with horizontal containment (`overflow-x-auto`) & `py-3` cells
    │   │   │   ├── DistrictSearchBar.tsx  # Quick filter search input
    │   │   │   └── LeaderboardTabs.tsx    # Division tab filter pills
    │   │   ├── EmergencyAlert/            # High-priority crisis alert card with 90-min SLA timer
    │   │   │   ├── EmergencyAlert.tsx     # Collapsible crisis alert card with collapsed-state skeleton
    │   │   │   ├── PrimaryIncidentCard.tsx # Active incident card with evidence and rebuttal triggers
    │   │   │   ├── IncidentList.tsx       # Secondary queued crisis alerts
    │   │   │   └── SLACountdown.tsx       # Real-time countdown timer to 90-minute deadline
    │   │   ├── OCRFeed/                   # Live OCR optical text recognition feed from regional dailies
    │   │   │   ├── OCRFeed.tsx            # OCR stream orchestrator
    │   │   │   ├── OCRFeedItem.tsx        # Individual newspaper OCR clipping card
    │   │   │   └── OCRFilterPills.tsx     # Category and verification filter pills
    │   │   └── ScoreDecomposition/        # Visual breakdown of 4 sub-scores comprising district CPI
    │   │       ├── ScoreDecomposition.tsx # CPI breakdown card with 2x2 weighted mix sub-grid
    │   │       └── ScoreMetricBar.tsx     # Animated progress bar with numeric breakdown
    │   │
    │   └── notFound/                      # Institutional 404 Error Components
    │       ├── NotFoundDisplay.tsx        # Main 404 display container
    │       ├── NotFoundMessage.tsx        # Government guidance message
    │       └── NotFoundActions.tsx        # Quick navigation return buttons
    │
    └── app/                               # Next.js 16 App Router (30 Static & Dynamic Routes)
        ├── layout.tsx                     # Root HTML shell, fonts, and global metadata
        ├── page.tsx                       # Root route rendering ThreeColumnDashboard
        ├── loading.tsx                    # Root segment loading skeleton wrapped in DashboardLayout
        ├── globals.css                    # Tailwind utilities, design tokens, and shimmer animation keyframes
        ├── not-found.tsx                  # Application-wide 404 error page
        ├── login/page.tsx                 # `/login` Authentication Gateway with server-side session redirect
        ├── dashboard/page.tsx             # `/dashboard` Executive Command Cockpit (ThreeColumnDashboard)
        ├── districts/
        │   ├── page.tsx                   # `/districts` 36-District Registry & Leaderboard
        │   └── loading.tsx                # Dedicated districts route skeleton boundary
        ├── press-releases/
        │   ├── page.tsx                   # `/press-releases` Press Releases Lifecycle & Drafting
        │   └── loading.tsx                # Dedicated press releases route skeleton boundary
        ├── media/
        │   ├── page.tsx                   # `/media` Media Intelligence & Archives
        │   └── loading.tsx                # Dedicated media route skeleton boundary
        ├── activities/
        │   ├── page.tsx                   # `/activities` Daily Itineraries & PR Workflow
        │   └── loading.tsx                # Dedicated activities route skeleton boundary
        ├── crisis/
        │   ├── page.tsx                   # `/crisis` Misinformation War Room & SLA Actions
        │   └── loading.tsx                # Dedicated crisis route skeleton boundary
        ├── reports/
        │   ├── page.tsx                   # `/reports` Intelligence Reports & Dossier Exports
        │   └── loading.tsx                # Dedicated reports route skeleton boundary
        ├── notifications/
        │   ├── page.tsx                   # `/notifications` Operational Alerts & Dispatch
        │   └── loading.tsx                # Dedicated notifications route skeleton boundary
        ├── profile/
        │   ├── page.tsx                   # `/profile` Officer Dossier & Security Clearance
        │   └── loading.tsx                # Dedicated profile route skeleton boundary
        ├── command-center/
        │   ├── page.tsx                   # `/command-center` Telemetry Operations Command Deck
        │   ├── loading.tsx                # Dedicated command center route skeleton boundary
        │   ├── raw-ingestion/
        │   │   ├── page.tsx               # `/command-center/raw-ingestion` Media Ingestion Stream
        │   │   └── loading.tsx            # Dedicated raw ingestion route skeleton boundary
        │   └── pipeline-flow/
        │       ├── page.tsx               # `/command-center/pipeline-flow` Data Pipeline Flowchart
        │       └── loading.tsx            # Dedicated pipeline flow route skeleton boundary
        ├── system-monitoring/
        │   ├── page.tsx                   # `/system-monitoring` System Health & Telemetry View
        │   ├── loading.tsx                # Dedicated system monitoring route skeleton boundary
        │   ├── raw-ingestion/
        │   │   ├── page.tsx               # `/system-monitoring/raw-ingestion` System Ingestion Stream
        │   │   └── loading.tsx            # Dedicated system raw ingestion route skeleton boundary
        │   └── pipeline-flow/
        │       ├── page.tsx               # `/system-monitoring/pipeline-flow` System Pipeline Flowchart
        │       └── loading.tsx            # Dedicated system pipeline flow route skeleton boundary
        │
        └── api/                           # Backend API Route Handlers
            ├── ai/
            │   └── chat/route.ts          # State intelligence AI assistant endpoint with local fallback & error handling
            ├── auth/
            │   ├── login/route.ts         # Authenticates credentials/PIN, generates 12-hr JWT session cookie
            │   ├── logout/route.ts        # Clears active session cookie
            │   └── me/route.ts            # Returns currently authenticated user context
            ├── crisis/
            │   └── incidents/
            │       ├── route.ts           # Fetches active crisis incidents filtered by role/district
            │       └── [id]/action/route.ts # Dispatches official rebuttal or dismisses false alarms
            ├── dashboard/
            │   └── overview/route.ts      # Returns aggregate statewide CPI, SLA, and sentiment metrics
            ├── departments/
            │   └── daily-report/route.ts  # Generates departmental daily dispatch metrics
            ├── districts/
            │   └── route.ts               # Delivers all 36 district records with CPI decomposition
            ├── news/
            │   └── route.ts               # Delivers live news stream with sentiment scoring
            └── ocr/
                └── stream/route.ts        # Streams real-time simulated regional newspaper OCR clippings
```

---

## 4. Key Functional Modules & Technical Details

### 4.1 Authentication & Security Architecture (`src/app/login/`, `src/lib/jwt.ts`, `src/middleware.ts`)
* **GIGW 3.0 Compliance**: Institutional dual-column split-card layout designed with high-contrast accessibility standards.
* **3-Stage Animated Handshake**: Authentication submission transitions smoothly through:
  1. *Verifying Credentials* ➔ 2. *Validating NIC Clearance* ➔ 3. *Establishing Secure Session*.
* **Session Management & 12-Hour TTL**: Cryptographically signed HMAC-SHA256 JWT tokens with a mandated 12-hour Time-to-Live (`12 * 60 * 60 * 1000 ms`) stored in an HTTP-only cookie (`maha_auth_token`), backed by client state synchronization in the Zustand store and `/api/auth/me` verification.
* **Redirection Guards**: Next.js Edge Middleware (`src/middleware.ts`) and Server Component `page.tsx` intercept `/login` requests and redirect users with active, unexpired sessions directly to `/`, preventing accidental re-authentication loops.
* **Access Control**: Features 3 clearance tiers ensuring District Collectors can only authorize rebuttals within their assigned jurisdiction, while the Director General maintains full statewide purview.

### 4.2 Interactive Maharashtra GIS Map Topology (`src/components/leadership/GISMap/`, `src/components/commandCenter/center/`)
* **Zero Hydration Mismatch**: Vector district boundaries rendered cleanly from `maharashtraGeo.generated.ts`.
* **100% Width Canvas with Sub-Grid Telemetry**: The GIS heatmap canvas occupies 100% card width (`min-h-[300px] sm:min-h-[360px] max-h-[440px]`), eliminating horizontal squeezing. Operational telemetry details are positioned directly below the map in a responsive 4-column horizontal info strip (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5`), eliminating internal dead white voids.
* **State Synchronization**: Selecting any district dynamically updates the DIO Telemetry Drawer, District Leaderboard, and regional news stream across the application.

### 4.3 Crisis Management & 90-Minute SLA Engine (`src/components/portal/CrisisScreen.tsx`, `src/components/zones/EmergencyAlert/`)
* **Real-Time Countdown Timer**: Calculates remaining time against the mandated 90-minute government refutation deadline.
* **Evidence Ledger**: Side-by-side verification comparing the viral claim against verified ground facts provided by the field DIO.
* **Official Rebuttal Dispatch**: Authorized Collectors can draft, verify, and broadcast official press refutations directly to regional media desks.
* **Collapsible Operator State**: The Emergency Alert card supports operator collapsing, with state preserved across filter changes and skeleton shimmer states.

### 4.4 Communication Performance Index (CPI) Engine (`src/components/zones/ScoreDecomposition/`)
* Computes an objective composite index out of 100 for all 36 districts based on:
  * **Volume Score (25 pts)**: Daily count of verified clippings and briefings handled.
  * **TAT Dispatch Score (25 pts)**: Average speed from incident occurrence to press issuance (Target $\le 45$ min).
  * **Sentiment Score (25 pts)**: Percentage of favorable public sentiment across print, TV, and digital.
  * **Crisis SLA Score (25 pts)**: Percentage of viral rumors refuted within the 90-minute window.
* **2x2 Weighted Mix Sub-Grid**: Displays the four component weights cleanly in a balanced grid (`grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-lg border border-slate-100`).

### 4.5 Executive Three-Column Cockpit Architecture (v5.0) (`src/components/dashboard/ThreeColumnDashboard.tsx`)
* **Full-Width Headline Elements**:
  * `KPIRibbon` renders across 100% workspace width immediately beneath `DashboardToolbar`, highlighting statewide Total Releases, Avg. TAT, Sentiment Index, and Active Crises.
  * `BreakingNewsTicker` renders as an executive solid red wire banner (`bg-red-600 text-white rounded-xl px-4 py-2`).
* **Progressive 3-Stage Responsive Grid**:
  1. **Mobile (< 768px)**: Single-column linear layout (`grid-cols-1 gap-4`) with natural card heights.
  2. **Tablet / Compact Laptop (768px – 1279px)**: 2-column balanced layout (`md:grid-cols-12 gap-5 items-start`):
     * *Primary Column (`lg:col-span-7`)*: GIS Map, Breaking News Ticker, State Leaderboard, Key Metrics Trends.
     * *Secondary Column (`lg:col-span-5`)*: Social Media Analysis, Emergency Alert, Live Streaming, Score Decomposition, Top/Lower Matrix, Live News Queue.
  3. **Wide Desktop / Command Wall (≥ 1280px)**: 3-column executive layout (`lg:grid-cols-12 gap-5 xl:gap-6 items-stretch`) with baseline stretches (`[&>*]:flex-1 [&>*]:h-full`):
     * *Left Column (`xl:col-span-3`)*: `ScoreDecomposition`, `TopLowerMatrix`, `KeyMetricsTrends`.
     * *Center Column (`xl:col-span-5`)*: `GISMap`, `BreakingNewsTicker`, `DistrictLeaderboard` (with bottom-docked pagination).
     * *Right Column (`xl:col-span-4`)*: `SocialMediaAnalysis`, `EmergencyAlert`, `LiveStreaming`, `LiveNewsQueue`.
* **Zero Text Collision & Decongested Feeds**:
  * `SocialMediaAnalysis`: Feeds stack vertically on desktop and split on 2xl (`grid-cols-1 2xl:grid-cols-2 gap-4`) with dedicated filter pills (`All`, `X`, `Meta/DD`).
  * `LiveStreaming`: Generous 16:9 responsive video canvas with 2x2 channel selector buttons (`grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2.5`), preventing label truncation (`"YouTube • Active"`).
  * `DistrictTable` & `TopLowerMatrix`: Wrapped in `overflow-x-auto -mx-1 px-1` with standardized `py-3 px-3` cell padding.
* **Backward Compatibility**: `MainDashboard.tsx` is preserved 100% intact as the fallback implementation.

### 4.6 Precision Component-Wise Skeleton Loaders & Persistent App Shell (`src/components/skeletons/`, `src/components/layout/DashboardLayout.tsx`)
* **Persistent App Shell**: Eliminates full-screen blocking spinners and modal overlays. The outer navigation shell (Header, Sidebar, Toolbar) stays fully mounted and interactive during data fetches.
* **Subtle Saffron Route Indicator**: A 2px high-contrast saffron line (`bg-[#FF9933]`) shimmers across the top during asynchronous route transitions.
* **15 Segment `loading.tsx` Boundaries**: Dedicated route loading boundaries wrap corresponding page skeletons inside `DashboardLayout` for zero layout shift during navigation.
* **In-Card Direct Root Returns**: Components (`KPIRibbon`, `DistrictLeaderboard`, `ScoreDecomposition`, `EmergencyAlert`, `LiveNewsQueue`, `TopLowerMatrix`, `GISMap`) directly return their dedicated skeletons at the root level during `isLoadingData`, eliminating double card borders and nested frames.
* **Store Filter Debounce Safeguard**: Rapid filter toggling is debounced with cancellation of pending timer tasks, preventing overlapping loading states.

### 4.7 Global Route-Aware Morphing AI Assistant Widget (`src/components/ai/`, `src/lib/ai/`, `src/app/api/ai/`)
* **Persistent Root Mount**: Mounted globally inside `src/app/layout.tsx` so conversation history, scroll position, and open/closed state persist seamlessly across soft route navigations.
* **Route Visibility Guard**: Strictly hidden and unmounted on Login and Account routes: `if (!pathname || pathname.startsWith('/account') || pathname.startsWith('/login')) return null;`.
* **Zero Hardcoded Colors**: Bound dynamically to semantic design tokens (`bg-primary`, `text-primary-foreground`, `bg-background/95`, `border-border`, `bg-muted/70`, `bg-secondary/60`) linked to institutional CSS variables.
* **Spring-Physics Animation Choreography**:
  * *FAB Idle & Hover*: Spring physics (`stiffness: 400, damping: 25`) with hover scale (`1.07`, `y: -2px`) and 12° icon rotation.
  * *Morphing Expansion*: Shared layout projection (`layoutId="ai-assistant-container"`, spring `stiffness: 350, damping: 28, mass: 0.8`) smoothly morphing from a 56x56px circular button to a 400x580px executive card (78vh on mobile).
  * *Outside Click Collapse*: Listens to `pointerdown` and `Escape` key events, reverse-morphing with spring physics (`stiffness: 380, damping: 30`) while preserving conversation in React state.
* **Route-Aware Dynamic Prompts**: Dynamically matches routes against `ROUTE_PROMPT_POOL` (6–8 prompts per route) and applies a client-side Fisher-Yates shuffle to display 3–4 randomized suggestion chips.
* **Hybrid Resolution Pipeline**:
  1. *Local Knowledge Intercept*: Matches queries against `LOCAL_KNOWLEDGE_BASE` for instant zero-token responses after a simulated 350ms natural typing delay.
  2. *AI Endpoint Fallback*: Forwards unhandled queries to `POST /api/ai/chat` with `{ messages, currentRoute, pageContext }` for state intelligence synthesis.
  3. *In-Flight Cancellation & Retry*: Uses `AbortController` to cancel stale in-flight requests and provides inline retry on network errors.

---

## 5. Getting Started & Development Commands

### Prerequisites
* **Node.js**: `v18.18.0` or higher (compatible with Node.js 20+ and 22+)
* **NPM**: `v9.0.0` or higher

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-org/maha-command-center.git
cd maha-command-center
npm install
```

### Running Locally (Development Mode)
Launch the Next.js development server with Webpack:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The portal will automatically direct you to the authentication page or executive dashboard.

### Running Automated Test Suites
Execute the complete test suite verifying authentication, skeleton loaders, executive dashboard, personas, and system routing:
```bash
npm test
```
*Expected Result: All 77 tests across 23 suites pass with 100% success rate.*

#### Running Individual Test Suites
```bash
# Core portal verification (Personas, light theme, Konkan data, navigation)
node --test tests/suite.test.mjs

# JWT authentication & 12-hour TTL security suite
node --test tests/jwt.test.mjs

# Precision skeleton loaders & persistent app shell suite
node --test tests/skeleton_loaders.test.mjs

# Executive 3-column workspace & responsive breathing room (v5.0) suite
node --test tests/three_column_dashboard.test.mjs

# Authenticated session & /login redirection guard suite
node --test tests/auth_redirect.test.mjs

# Global route-aware morphing AI Assistant widget & hybrid pipeline suite
node --test tests/ai_assistant.test.mjs
```

### TypeScript Type Checking
Verify strict TypeScript compilation with zero type errors:
```bash
npx tsc --noEmit
```

### Production Build & Compilation
Compile and optimize the application for production:
```bash
npm run build
```
*Expected Result: All 30 static and dynamic App Router routes compile with zero TypeScript or linting errors.*

### Running Production Server
After building, start the production server:
```bash
npm run start
```

### Rebuilding Maharashtra GIS Geometry
To regenerate the SVG map boundaries from raw geographic data:
```bash
npm run build:geo
```

---

## 6. Standards Compliance & Security Posture

* **GIGW 3.0 (Guidelines for Indian Government Websites)**: Formatted with standard government headers, national/state emblem prominence, explicit breadcrumb navigation, and dual-language Marathi/English localization.
* **UX4G (User Experience for Government)**: Clean visual hierarchy, high-contrast light backgrounds (`#F4F6FA` to `#FFFFFF`), clear typography, and accessible button tap targets.
* **WCAG 2.1 AA Accessibility**: Semantic HTML5 markup, full keyboard navigation compatibility, descriptive alt tags, and screen-reader accessible forms.
* **Information Security**: Fictional dummy officer personas prevent exposure of real civil servants' credentials. CAPTCHA challenges prevent automated brute-force attacks.
* **Edge Token Verification**: HMAC-SHA256 JWT tokens with 12-hour TTL enforce session integrity across all client requests and server routes.

---

## 7. License & Rights

**Government of Maharashtra — Directorate General of Information and Public Relations (DGIPR)**  
*Developed for internal state command, district administration, and official public relations management.*
