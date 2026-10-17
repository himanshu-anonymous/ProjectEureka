# Maha-Command Center (महा-कमांड सेंटर)
### Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra

[![Next.js](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown?style=flat)](https://github.com/pmndrs/zustand)
[![ECharts](https://img.shields.io/badge/Apache_ECharts-6.1-red?style=flat&logo=apache-echarts)](https://echarts.apache.org/)
[![GIGW 3.0](https://img.shields.io/badge/Compliance-GIGW_3.0_%26_UX4G-orange?style=flat)](https://guidelines.india.gov.in/)
[![Tests](https://img.shields.io/badge/Test_Suite-12%2F12_Passing_(100%25)-brightgreen?style=flat)](https://nodejs.org/api/test.html)

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
├── MAHAGOV_ICON.svg                        # Government of Maharashtra high-res emblem SVG
├── next.config.mjs                         # Next.js 16 configuration (Webpack bundling)
├── package.json                            # Project dependencies and operational scripts
├── postcss.config.mjs                      # PostCSS plugins configuration
├── tailwind.config.ts                      # Tailwind CSS design tokens, institutional palette, keyframes
├── tsconfig.json                           # TypeScript strict compiler configuration
│
├── scripts/
│   └── build-maharashtra-geo.mjs           # CLI script to parse & compile TopoJSON to SVG map coordinates
│
├── tests/
│   └── suite.test.mjs                      # Automated 12-test suite (Node.js test runner)
│
├── public/                                 # Static public assets, icons, and emblems
│
└── src/
    ├── symbols.jsx                         # Centralized Solid Heroicons pure SVG component pack
    │
    ├── types/
    │   └── dashboard.ts                    # Core TypeScript models (AuthUser, DistrictData, IncidentData, OCRRecord)
    │
    ├── lib/
    │   ├── serverData.ts                   # In-memory mock server database, officer registry, and mutation APIs
    │   └── translations.ts                 # Full English & Marathi (मराठी) localization dictionary
    │
    ├── stores/
    │   └── dashboardStore.ts               # Global Zustand state (auth session, filters, crisis rebuttals, theme)
    │
    ├── data/
    │   ├── dashboardData.ts                # District baseline metrics, incident records, and OCR stream seed data
    │   ├── dioDirectory.ts                 # Statewide directory of District Information Officers (contacts & status)
    │   ├── maharashtraGeo.generated.ts     # Pre-calculated SVG district vector boundary coordinates
    │   ├── newsQueueData.ts                # Live ingested news stories with sentiment metrics
    │   └── telemetryLogsAndAuditData.ts    # System audit ledger, latency logs, and network traffic records
    │
    ├── components/
    │   ├── shared/                         # Reusable core primitive UI components
    │   │   ├── GovEmblem.tsx               # Scalable SVG Government of Maharashtra emblem
    │   │   ├── MaterialIcon.tsx            # Material Symbol icon bridge
    │   │   ├── Panel.tsx                   # Accessible container card with header actions
    │   │   └── symbols.jsx                 # Re-exported SVG icon definitions
    │   │
    │   ├── layout/                         # Application layout shells
    │   │   ├── DashboardLayout.tsx         # Responsive dashboard frame (Header + Sidebar + Content)
    │   │   ├── Header.tsx                  # GIGW-compliant top bar (emblem, breadcrumb, search, user menu)
    │   │   ├── Sidebar.tsx                 # Collapsible navigation drawer with role-based visibility
    │   │   └── DashboardToolbar.tsx        # Division/district filter bar, export triggers, and time range
    │   │
    │   ├── portal/                         # Primary application route screen views
    │   │   ├── LoginScreen.tsx             # Two-column split card login portal with animated auth handshake
    │   │   ├── ActivitiesScreen.tsx        # Daily ministerial itineraries, press pool, and 24-hr PR workflow
    │   │   ├── CrisisScreen.tsx            # Misinformation War Room with 90-min SLA timer and rebuttal approval
    │   │   ├── DistrictsScreen.tsx         # Comprehensive 36-district registry, rankings, and CPI breakdown
    │   │   ├── MediaScreen.tsx             # Multi-media vault (print clippings, TV airtime, OCR, social feeds)
    │   │   ├── NotificationsScreen.tsx     # Operational alert center with SLA urgencies and DIO field queries
    │   │   ├── PressReleasesScreen.tsx     # Bilingual press release drafting, editorial review, and PDF release
    │   │   ├── ProfileScreen.tsx           # Officer credentials dossier, clearance tier, and language toggles
    │   │   └── ReportsScreen.tsx           # Automated intelligence report generator with CSV/PDF exports
    │   │
    │   ├── dashboard/                      # Core executive cockpit components
    │   │   ├── MainDashboard.tsx           # Top-level orchestrator for home cockpit view
    │   │   ├── OperationsWorkspace.tsx     # Modular multi-column workspace grid
    │   │   ├── LiveNewsQueue.tsx           # Real-time scrolling news feed with sentiment badges
    │   │   ├── CrisisOperationsColumn.tsx  # Crisis alert widget wrapper
    │   │   └── DistrictOperationsColumn.tsx# District operations metric wrapper
    │   │
    │   ├── commandCenter/                  # 3-Column Command Control Deck (`/command-center`)
    │   │   ├── CommandCenterView.tsx       # Composite 3-column live command view
    │   │   ├── CommandCenterNavHeader.tsx  # Sub-navigation bar across Command Deck, Ingestion, and Pipeline
    │   │   ├── RawIngestionView.tsx        # Real-time multi-channel media ingestion stream view
    │   │   ├── PipelineFlowView.tsx        # End-to-end data processing flowchart view
    │   │   ├── TelemetryOperationsView.tsx # System health, latency, queue throughput, and error rates view
    │   │   ├── AnimatedTelemetryMesh.tsx   # Light-themed nodal network telemetry visualization
    │   │   ├── AnimatedPipelineDiagram.tsx # SVG animated pipeline data packet flow diagram
    │   │   ├── center/
    │   │   │   ├── CommandCenterCenterSection.tsx # Orchestrator for center column
    │   │   │   ├── MaharashtraMapTopology.tsx    # Interactive SVG topology of 36 Maharashtra districts
    │   │   │   ├── DistrictSubHeadSelector.tsx   # Quick selector for district sub-heads with CPI badges
    │   │   │   └── DIODataDrawer.tsx             # Slide-out telemetry drawer for District Information Officers
    │   │   ├── left/
    │   │   │   ├── CommandCenterLeftSection.tsx   # Orchestrator for left media column
    │   │   │   ├── NewspaperDataSection.tsx      # Print clippings metrics and stacked sentiment EChart
    │   │   │   ├── TVChannelDataSection.tsx      # Broadcast TV airtime distribution chart
    │   │   │   └── SocialMediaDataSection.tsx    # Social listening velocity graph and platform breakdown
    │   │   └── right/
    │   │       ├── CommandCenterRightSection.tsx  # Orchestrator for right leadership column
    │   │       ├── LeadershipMessagesSection.tsx # Verified leadership directives feed with urgency tags
    │   │       └── LiveStreamingLinkSection.tsx  # Live video broadcast player with multi-source switch
    │   │
    │   ├── departments/                    # Department-Wise Public Relations Vault
    │   │   ├── DepartmentWiseDataView.tsx  # Main departmental hub orchestrator
    │   │   ├── DepartmentSelector.tsx      # Dropdown/pill selector for state ministries
    │   │   ├── DepartmentPressReleases.tsx # Departmental press releases ledger
    │   │   ├── DepartmentPhotographs.tsx   # High-resolution photographic archive with photographer credits
    │   │   ├── DepartmentVideos.tsx        # Official video broadcast archive
    │   │   ├── DepartmentSocialAnalysis.tsx# Real-time social handle metrics, followers, and sentiment
    │   │   └── DepartmentEmptySlot.tsx     # Extensible modular slot for Government Resolutions (GRs)
    │   │
    │   ├── leadership/                     # Executive State Leadership Module
    │   │   ├── LeadershipOverview.tsx      # Executive briefing cards and statewide CPI overview
    │   │   ├── GISMap/GISMap.tsx           # District geographic performance heatmap
    │   │   ├── LiveStreaming/LiveStreaming.tsx # Standalone broadcast streaming player
    │   │   ├── SocialMediaAnalysis/SocialMediaAnalysis.tsx # Statewide social intelligence analyzer
    │   │   └── TopLowerMatrix/TopLowerMatrix.tsx # Top vs. bottom performing district comparison matrix
    │   │
    │   ├── workflow/                       # Operational PR Lifecycle Visualizers
    │   │   ├── DailyWorkFlowchart.tsx      # Interactive 6-stage 24-hour PR operational workflow chart
    │   │   └── WorkflowStepCard.tsx        # Milestone stage card with hours and duties
    │   │
    │   ├── zones/                          # Analytical Dashboard Widgets
    │   │   ├── KPIRibbon/                  # Top headline metrics (CPI Avg, SLA Compliance, TAT, Sentiment)
    │   │   ├── DistrictLeaderboard/        # Searchable 36-district ranking table with sorting & charts
    │   │   ├── EmergencyAlert/             # High-priority crisis alert card with 90-min SLA timer
    │   │   ├── OCRFeed/                    # Live OCR optical text recognition feed from regional dailies
    │   │   └── ScoreDecomposition/         # Visual breakdown of 4 sub-scores comprising the district CPI
    │   │
    │   └── notFound/                       # Institutional 404 Error Components
    │       ├── NotFoundDisplay.tsx         # Main 404 display container
    │       ├── NotFoundMessage.tsx         # Government guidance message
    │       └── NotFoundActions.tsx         # Quick navigation return buttons
    │
    └── app/                                # Next.js 16 App Router (Pages, Layouts & API Routes)
        ├── layout.tsx                      # Root HTML shell, fonts, and global metadata
        ├── page.tsx                        # Root route redirecting to `/dashboard`
        ├── globals.css                     # Tailwind utilities, design tokens, and animation keyframes
        ├── not-found.tsx                   # Application-wide 404 error page
        ├── login/page.tsx                  # `/login` Authentication Gateway
        ├── dashboard/page.tsx              # `/dashboard` Executive Command Cockpit
        ├── command-center/
        │   ├── page.tsx                    # `/command-center` Telemetry Operations Command Deck
        │   ├── raw-ingestion/page.tsx      # `/command-center/raw-ingestion` Media Ingestion Stream
        │   └── pipeline-flow/page.tsx      # `/command-center/pipeline-flow` Data Pipeline Flowchart
        ├── districts/page.tsx              # `/districts` 36-District Registry & Leaderboard
        ├── press-releases/page.tsx         # `/press-releases` Press Releases Lifecycle & Drafting
        ├── media/page.tsx                  # `/media` Media Intelligence & Archives
        ├── activities/page.tsx             # `/activities` Daily Itineraries & PR Workflow
        ├── crisis/page.tsx                 # `/crisis` Misinformation War Room & SLA Actions
        ├── reports/page.tsx                # `/reports` Intelligence Reports & Dossier Exports
        ├── notifications/page.tsx          # `/notifications` Operational Alerts & Dispatch
        ├── profile/page.tsx                # `/profile` Officer Dossier & Security Clearance
        │
        └── api/                            # Backend API Route Handlers
            ├── auth/
            │   ├── login/route.ts          # Authenticates credentials/PIN, sets auth cookie session
            │   ├── logout/route.ts         # Clears active session cookie
            │   └── me/route.ts             # Returns currently authenticated user context
            ├── crisis/
            │   └── incidents/
            │       ├── route.ts            # Fetches active crisis incidents filtered by role/district
            │       └── [id]/action/route.ts# Dispatches official rebuttal or dismisses false alarms
            ├── dashboard/
            │   └── overview/route.ts       # Returns aggregate statewide CPI, SLA, and sentiment metrics
            ├── departments/
            │   └── daily-report/route.ts   # Generates departmental daily dispatch metrics
            ├── districts/
            │   └── route.ts                # Delivers all 36 district records with CPI decomposition
            └── ocr/
                └── stream/route.ts         # Streams real-time simulated regional newspaper OCR clippings
```

---

## 4. Key Functional Modules & Technical Details

### 4.1 Authentication & Security Architecture (`src/app/login/`, `src/lib/serverData.ts`)
* **GIGW 3.0 Compliance**: Institutional dual-column split-card layout designed with high-contrast accessibility standards.
* **3-Stage Animated Handshake**: Authentication submission transitions smoothly through:
  1. *Verifying Credentials* ➔ 2. *Validating NIC Clearance* ➔ 3. *Establishing Secure Session*.
* **Session Management**: Cryptographically signed HMAC-SHA256 JWT tokens with a mandated 12-hour Time-to-Live (TTL) stored in an HTTP-only cookie (`maha_auth_token`), backed by client state synchronization in the Zustand store and `/api/auth/me` verification.
* **Access Control**: Features 3 clearance tiers ensuring District Collectors can only authorize rebuttals within their assigned jurisdiction, while the Director General maintains full statewide purview.

### 4.2 Interactive Maharashtra GIS Map Topology (`src/components/commandCenter/center/`)
* **Zero Hydration Mismatch**: Vector district boundaries rendered cleanly from `maharashtraGeo.generated.ts`.
* **State Synchronization**: Selecting any district dynamically updates the DIO Telemetry Drawer, District Leaderboard, and regional news stream across the application.

### 4.3 Crisis Management & 90-Minute SLA Engine (`src/components/portal/CrisisScreen.tsx`)
* **Real-Time Countdown Timer**: Calculates remaining time against the mandated 90-minute government refutation deadline.
* **Evidence Ledger**: Side-by-side verification comparing the viral claim against verified ground facts provided by the field DIO.
* **Official Rebuttal Dispatch**: Authorized Collectors can draft, verify, and broadcast official press refutations directly to regional media desks.

### 4.4 Communication Performance Index (CPI) Engine (`src/components/zones/`)
* Computes an objective composite index out of 100 for all 36 districts based on:
  * **Volume Score (25 pts)**: Daily count of verified clippings and briefings handled.
  * **TAT Dispatch Score (25 pts)**: Average speed from incident occurrence to press issuance (Target $\le 45$ min).
  * **Sentiment Score (25 pts)**: Percentage of favorable public sentiment.
  * **Crisis SLA Score (25 pts)**: Percentage of viral rumors refuted within the 90-minute window.

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

### Running Automated Test Suite
Execute the built-in Node.js test suite verifying officer personas, light-theme compliance, Konkan district models, and command center routes:
```bash
npm test
```
*Expected Result: All 12 tests across 5 suites pass with 100% success rate.*

### Production Build & Compilation
Compile and optimize the application for production:
```bash
npm run build
```
Verify that all 26 static and dynamic App Router routes compile with zero TypeScript or linting errors.

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
* **UX4G (User Experience for Government)**: Clean visual hierarchy, high-contrast light backgrounds (`#F8FAFC` to `#FFFFFF`), clear typography, and accessible button tap targets.
* **WCAG 2.1 AA Accessibility**: Semantic HTML5 markup, full keyboard navigation compatibility, descriptive alt tags, and screen-reader accessible forms.
* **Information Security**: Fictional dummy officer personas prevent exposure of real civil servants' credentials. CAPTCHA challenges prevent automated brute-force attacks.

---

## 7. License & Rights

**Government of Maharashtra — Directorate General of Information and Public Relations (DGIPR)**  
*Developed for internal state command, district administration, and official public relations management.*
