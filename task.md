# Maha-Command Center — Project Implementation Roadmap (`task.md`)

## 1. Project Overview & Architectural Guidelines
- **System**: Maha-Command Center — DGIPR, Government of Maharashtra
- **Core Principle**: Strict modular isolation — every visual element, widget, infographic, and card resides in its own isolated `.tsx` component under appropriate feature directories, orchestrated through parent layout containers.
- **Design System**: High-density government command terminal, monochrome typography, data-dense infographics, and responsive grid layouts.

---

## 2. Work Breakdown Structure (WBS)

### Phase 1: Webportals — Daily Work Flowchart
- [x] **1.1 Daily Operational Workflow Diagram**
  - [x] Interactive visual flowchart for daily state information operations:
    - Stage 1: Ingestion (Newspaper scanning, TV monitoring, Social listenership)
    - Stage 2: Verification & Sentiment Tagging (DIO / State Desk)
    - Stage 3: Departmental Dispatch & Press Release Generation
    - Stage 4: Crisis Escalation & SLA Rumor Refutation
    - Stage 5: Live Press Briefings & Broadcast Relays
    - Stage 6: Leadership Briefing & Archival
  - [x] Isolated components:
    - `src/components/workflow/WorkflowStepCard.tsx`
    - `src/components/workflow/DailyWorkFlowchart.tsx`
  - [x] Supports step-by-step progress state, active timer slot, and shift task tracking.

---

### Phase 2: Command Control Center Main Page (3-Column Layout)
*Layout Architecture: 3-Column Triptych Grid (`Left: 4 cols` | `Center: 4 cols` | `Right: 4 cols`)*

#### A. Left Section — Media Monitoring & Sentiment Infographics
- [x] **2.1 Newspaper Data Component** (`src/components/commandCenter/left/NewspaperDataSection.tsx`)
  - [x] Newspaper clipping counter & circulation stats infographic (516 clippings, 6.8M circulation, 62% positive)
  - [x] ECharts stacked horizontal sentiment bar chart across publications (Lokmat, Maharashtra Times, Sakal, etc.)
  - [x] Lead headline coverage ticker
- [x] **2.2 TV Channel Data Component** (`src/components/commandCenter/left/TVChannelDataSection.tsx`)
  - [x] Broadcast airtime infographics (602m airtime, 34% prime share, 70% avg sentiment)
  - [x] Airtime distribution bar chart across ABP Majha, TV9 Marathi, Zee 24 Taas, News18 Lokmat
  - [x] Live monitoring channel topic ticker
- [x] **2.3 Social Media Data Analysis Component** (`src/components/commandCenter/left/SocialMediaDataSection.tsx`)
  - [x] Infographics metric tiles (83.6K 24h mentions, 3.3M reach, 5.0% engagement rate)
  - [x] Hourly viral velocity area trendline graph
  - [x] Platform breakdown badges (X, FB, YT, WA)
- [x] **2.4 Left Section Orchestrator** (`src/components/commandCenter/left/CommandCenterLeftSection.tsx`)

#### B. Center Section — Maharashtra GIS Topology & DIO Network
- [x] **2.5 Interactive Maharashtra Map with District Sub-heads** (`src/components/commandCenter/center/MaharashtraMapTopology.tsx`)
  - [x] High-detail interactive Maharashtra SVG vector map with clickable district polygons
  - [x] Division clusters (Konkan, Pune, Nashik, Chh. Sambhajinagar, Amravati, Nagpur)
- [x] **2.6 District Sub-head Selector** (`src/components/commandCenter/center/DistrictSubHeadSelector.tsx`)
  - [x] Quick switchers for 36 administrative district sub-heads with CPI ratings and ranks
- [x] **2.7 District Sub-head & DIO Data Drawer** (`src/components/commandCenter/center/DIODataDrawer.tsx`)
  - [x] DIO status indicator (Active / Standby / Field Operation)
  - [x] District Information Officer (DIO) direct profile: phone, email, pending releases, local alerts, last active sync
  - [x] Direct desk dispatch trigger action
- [x] **2.8 Center Section Orchestrator** (`src/components/commandCenter/center/CommandCenterCenterSection.tsx`)

#### C. Right Section — Leadership Dispatch & Live Broadcast
- [x] **2.9 DG and Director Messages Component** (`src/components/commandCenter/right/LeadershipMessagesSection.tsx`)
  - [x] Director General (DG) high-priority executive briefing feed
  - [x] Director of Information operational bulletins and directives
  - [x] Badges for Urgent, Directive, and Standard priorities with timestamps
- [x] **2.10 Live Streaming Link & Video Feed Component** (`src/components/commandCenter/right/LiveStreamingLinkSection.tsx`)
  - [x] Live press briefing HD clean video player preview
  - [x] Multi-source switcher (CMO Briefing, Cabinet Hall, Crisis Desk)
  - [x] Active broadcast status, viewer counter, and direct external streaming link
- [x] **2.11 Right Section Orchestrator** (`src/components/commandCenter/right/CommandCenterRightSection.tsx`)
- [x] **2.12 Command Center Parent View** (`src/components/commandCenter/CommandCenterView.tsx`)

---

### Phase 3: Department-Wise Data Module
*Dedicated Workspace: `src/components/departments/`*

- [x] **3.1 Department Filter & Navigation** (`DepartmentSelector.tsx`)
  - [x] Pill selector for Key Maharashtra Departments (Agriculture, Public Health, Home Department, Revenue)
- [x] **3.2 Department Press Releases** (`DepartmentPressReleases.tsx`)
  - [x] 1. Press releases ledger with release status, download counter, and PDF download action
- [x] **3.3 Department Photographs Gallery** (`DepartmentPhotographs.tsx`)
  - [x] 2. High-resolution event image grid with metadata (Event, Date, Photographer, Category)
- [x] **3.4 Department Videos Archive** (`DepartmentVideos.tsx`)
  - [x] 3. Video repository (Docuseries, press bytes, duration, view counts)
- [x] **3.5 Media Storage / Future Ingestion Slot** (`DepartmentEmptySlot.tsx`)
  - [x] 4. [Empty] extensible slot for departmental documents, gazettes, and GR attachments
- [x] **3.6 Department-Specific Social Media Analysis** (`DepartmentSocialAnalysis.tsx`)
  - [x] Ministry/department handle, followers, 24h mentions, net sentiment, and viral reach
- [x] **3.7 Department Data Orchestrator** (`DepartmentWiseDataView.tsx`)

---

### Phase 4: Webportal's Screens Implementation (11 Core Routes)
- [x] **Screen 1: Logins (`/login`)** (`src/app/login/page.tsx` & `LoginScreen.tsx`)
  - [x] Role-based dual login: State Administrator vs. District Magistrate (DM) / Collector
  - [x] PIN verification simulation & role persistence into Zustand store
- [x] **Screen 2: Dashboard (`/` and `/dashboard`)** (`src/app/page.tsx` & `src/app/dashboard/page.tsx`)
  - [x] Executive dashboard combining Daily Workflow Flowchart, KPI Ribbon, Operations Grid, Department Data, and Leadership Overview
- [x] **Screen 3: Command Center (`/command-center`)** (`src/app/command-center/page.tsx`)
  - [x] 3-Section live control room layout (Left: Media graphs, Center: Map & DIO, Right: Leadership & Streams)
- [x] **Screen 4: Districts (`/districts`)** (`src/app/districts/page.tsx` & `DistrictsScreen.tsx`)
  - [x] 36-district registry, rankings, division filters, CPI score decomposition, and GIS map
- [x] **Screen 5: Press Release (`/press-releases`)** (`src/app/press-releases/page.tsx` & `PressReleasesScreen.tsx`)
  - [x] Release pipeline, filtering (All, Published, Under Review, Draft), search, and download actions
- [x] **Screen 6: Media (`/media`)** (`src/app/media/page.tsx` & `MediaScreen.tsx`)
  - [x] Unified media assets vault (Print scans, TV broadcast recordings, OCR live feed, and social listening)
- [x] **Screen 7: Activities (`/activities`)** (`src/app/activities/page.tsx` & `ActivitiesScreen.tsx`)
  - [x] Daily government activities calendar, ministerial itineraries, and daily workflow tracking
- [x] **Screen 8: Crisis (`/crisis`)** (`src/app/crisis/page.tsx` & `CrisisScreen.tsx`)
  - [x] Crisis escalation desk, 90-minute SLA rumor rebuttal triage, and collector authorization
- [x] **Screen 9: Reports (`/reports`)** (`src/app/reports/page.tsx` & `ReportsScreen.tsx`)
  - [x] Intelligence reports vault (Daily Media Summary, Weekly CPI Digest, Departmental Audits, PDF/CSV export)
- [x] **Screen 10: Notification (`/notifications`)** (`src/app/notifications/page.tsx` & `NotificationsScreen.tsx`)
  - [x] Real-time notification center (Urgent bulletins, SLA warnings, DIO dispatches, system logs)
- [x] **Screen 11: Profile (`/profile`)** (`src/app/profile/page.tsx` & `ProfileScreen.tsx`)
  - [x] Officer clearance details, active administrative role switcher, and bilingual language preferences

---

### Phase 5: Shared Navigation & Route Integration
- [x] Updated `src/components/layout/Sidebar.tsx` to link to all 11 Webportal screens with active route indicators and collapse state.
- [x] Updated `src/components/layout/Header.tsx` with logo link to `/` and profile link to `/profile`.
- [x] Zustand store updated with department selection and workflow step persistence across transitions.

---

### Phase 6: Testing, Polish & Build Verification
- [x] Verified full Next.js static build (`next build`) — 16 routes statically prerendered with 0 errors.
