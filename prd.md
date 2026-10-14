# Product Requirements Document (PRD)
## Project Name: Maha-Command Center
**Client/Organization**: Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra  
**System Classification**: State Information Operations & Crisis Command Center  
**Document Version**: 1.0.0  
**Status**: Approved / Implemented  
**Date**: October 2026  

---

## 1. Executive Summary

### 1.1 Mission & Vision
The **Maha-Command Center** is a unified, high-density operational command deck and webportal built for the Government of Maharashtra (DGIPR). Its primary mission is to provide leadership, District Collectors, and District Information Officers (DIOs) with real-time media surveillance, proactive crisis refutation capabilities, multi-channel departmental dispatch mechanisms, and standardized district communication performance benchmarking across all 36 administrative districts.

### 1.2 Core Problem Statement
* **Fragmented Media Ingestion**: Traditional media monitoring across print newspapers, broadcast TV, and viral social media channels operated in silos without unified sentiment indexing.
* **Delayed Misinformation Countermeasures**: Rumors and unverified claims frequently propagated faster than standard governmental clarification protocols, creating operational risk.
* **Lack of Standardized Performance Benchmarking**: Inconsistent district-level public relations performance without objective data metrics or SLA enforcement.
* **Decentralized Departmental Media Vaults**: Press releases, high-resolution photographs, event videos, and gazette notifications lacked an integrated departmental repository.

---

## 2. Stakeholders & User Personas

| Persona | Role & Clearance Tier | Primary Needs & Workflows |
| :--- | :--- | :--- |
| **Director General (DG) / State Admin** | **Tier 1 — Full State Command** | • Statewide media intelligence & sentiment overview<br>• Issuing high-priority directives to all 6 divisions<br>• Executive briefing dossiers & live broadcast feeds |
| **District Magistrate (DM) / Collector** | **Tier 2 — District Command** | • Local district CPI rankings & TAT analysis<br>• 90-minute SLA authorization of official crisis rebuttals<br>• Monitoring local newspaper and social media feedback |
| **District Information Officer (DIO)** | **Tier 3 — Field Operations** | • Submitting daily field event coverage reports<br>• Fact-checking unverified local rumors<br>• Coordinating regional media dispatch & press conferences |
| **Departmental Liaison / Media Desk** | **Tier 3 — Editorial Desk** | • Drafting bilingual Marathi/English press releases<br>• Archiving high-resolution photos and video reels<br>• Tracking departmental social campaign metrics |

---

## 3. Product Architecture & Technical Stack

### 3.1 Architectural Philosophy: Strict Component Isolation
Every UI card, metric badge, chart container, drawer, and tabular element is isolated in its own dedicated TypeScript (`.tsx`) component file under domain-specific directories (`src/components/...`). Parent screens import and orchestrate these isolated components cleanly without monolithic code blocks.

### 3.2 Technology Stack
* **Framework**: Next.js 14.2 (App Router with Static Site Generation & React Server/Client Components)
* **Language**: TypeScript 5 (Strict mode with zero-error typing)
* **Styling & Design Tokens**: Tailwind CSS 3.4 utilizing a strict monochrome government terminal palette (`--bg-page: #F5F6F7`, `--text-primary: #202124`, `--border-standard: #DADCE0`)
* **State Management**: Zustand 5 with client persistence
* **Data Visualization**: Apache ECharts (`echarts-for-react`) for high-performance canvas/SVG charts
* **Iconography**: Lucide React
* **Typography**: Monospaced tabular figures for quantitative metrics paired with crisp sans-serif headings

---

## 4. Key Functional Modules & Specifications

### 4.1 Daily Operational Workflow (Flowchart & Lifecycle)
*Component: `DailyWorkFlowchart.tsx`*
A structured 24-hour, 6-stage operational lifecycle for government public relations and media operations:
1. **06:00 – 08:30 AM (Ingestion)**: AI-driven scraping and indexing of 18 state daily newspapers, 4 TV channels, and social listening feeds.
2. **08:30 – 10:00 AM (Verification & Sentiment)**: DIO ground verification and regional sentiment tagging.
3. **10:00 – 01:00 PM (Departmental Dispatch)**: Drafting, bilingual Marathi-English translation, and publication of press notes.
4. **01:00 – 04:30 PM (Crisis SLA Monitoring)**: Tracking viral rumors and executing the mandatory 90-minute SLA rebuttal process.
5. **04:30 – 07:00 PM (Live Briefings & Relays)**: Relaying live CMO/Cabinet briefings to regional desks and broadcast media.
6. **07:00 – 09:30 PM (Leadership Briefing)**: Generating automated executive digests for the Chief Minister and Chief Secretary.

---

### 4.2 Command Control Center Main Page (`/command-center`)
*Component: `CommandCenterView.tsx`*  
A 3-column command deck designed for wall displays and operational desks:

#### Section 1: Left Section — Media Ingestion & Sentiment Infographics
* **Newspaper Data (`NewspaperDataSection.tsx`)**:
  * Metrics: 516 clippings tracked, 6.8M combined circulation, 62% positive tone.
  * Graph: Horizontal stacked ECharts bar chart breaking down sentiment (Positive / Neutral / Negative) across leading newspapers (Lokmat, Maharashtra Times, Sakal, Punya Nagari, Loksatta).
  * Lead headline ticker displaying top print stories.
* **TV Channel Broadcast Data (`TVChannelDataSection.tsx`)**:
  * Metrics: 602 minutes of monitored broadcast airtime, 34% prime-time share, 70% average sentiment score.
  * Graph: Airtime distribution bar chart across ABP Majha, TV9 Marathi, Zee 24 Taas, and News18 Lokmat.
  * Live broadcast monitoring status banner.
* **Social Media Analysis (`SocialMediaDataSection.tsx`)**:
  * Metrics: 83.6K 24-hour mentions, 3.3M total reach, 5.0% engagement rate.
  * Graph: Hourly viral velocity area trendline graph showing propagation spikes.
  * Platform breakdown counters for X (Twitter), Facebook, YouTube, and WhatsApp.

#### Section 2: Center Section — Maharashtra GIS Topology & DIO Network
* **Interactive Map Topology (`MaharashtraMapTopology.tsx`)**:
  * High-precision Maharashtra SVG vector map featuring 36 administrative district boundaries and 6 divisional clusters (Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, Nagpur).
  * Clickable district polygons triggering real-time state synchronization.
* **District Sub-heads Selector (`DistrictSubHeadSelector.tsx`)**:
  * Quick-select cards for all district sub-heads with CPI rank indicators.
* **DIO Telemetry Drawer (`DIODataDrawer.tsx`)**:
  * Displays active District Information Officer details: Officer Name, Official Designation, Division, Phone, Email, Live Status (Active, Standby, Field Operation), Pending Releases, Active Local Alerts, and Last Sync timestamp.
  * Includes a direct action button: **"Dispatch Query to DIO"**.

#### Section 3: Right Section — Leadership Directives & Live Broadcast
* **DG and Director Messages (`LeadershipMessagesSection.tsx`)**:
  * Chronological official feed for the Director General (DG) and Director of Information.
  * Priority classification badges (`Urgent`, `Directive`, `Standard`) with verified timestamps.
* **Live Streaming Broadcast (`LiveStreamingLinkSection.tsx`)**:
  * Embedded clean feed video player preview with 720p HD status and live viewer counts.
  * Multi-source switcher: *CMO Press Briefing*, *Cabinet Hall Internal Telecast*, and *Crisis Command Line*.
  * External launch link to verified live streams.

---

### 4.3 Department-Wise Data Module
*Component: `DepartmentWiseDataView.tsx`*  
Dedicated media and public relations vault organized by state administrative departments (Agriculture, Public Health, Home Department, Revenue):
1. **Department Press Releases (`DepartmentPressReleases.tsx`)**: Searchable, categorized press release ledger with publication dates, download counters, and PDF export.
2. **Event Photographs (`DepartmentPhotographs.tsx`)**: High-resolution gallery with photographer attributions and event tags.
3. **Official Videos (`DepartmentVideos.tsx`)**: Broadcast video clips and documentaries with duration and viewer statistics.
4. **Extensible Storage Slot [Empty] (`DepartmentEmptySlot.tsx`)**: Modular slot reserved for Departmental Government Resolutions (GR), Gazettes, or specialized digital assets.
5. **Department Social Media Analysis (`DepartmentSocialAnalysis.tsx`)**: Real-time departmental metrics: verified handle, followers, 24h mentions, net sentiment percentage, and viral reach score.

---

### 4.4 Webportal's Screens (11 Core Routes)

| # | Screen | URL Route | Core Capabilities |
|---|---|---|---|
| 1 | **Logins** | `/login` | Dual role-based gateway for **State Administrator** vs. **District Magistrate (DM) / Collector** with PIN authentication and security auditing. |
| 2 | **Dashboard** | `/` & `/dashboard` | High-level executive cockpit integrating KPI Ribbon, Operations Workspace, Department Hub, and Leadership Overview. |
| 3 | **Command Center** | `/command-center` | Full 3-column live command deck (Left: Media graphs, Center: Map & DIO, Right: Messages & Streams). |
| 4 | **Districts** | `/districts` | Complete 36-district registry, rankings, division filters, CPI score decomposition, and topological map. |
| 5 | **Press Release** | `/press-releases` | Full press release lifecycle: drafting, editorial review, status filtering (`All`, `Published`, `Under Review`, `Draft`), and search. |
| 6 | **Media** | `/media` | Comprehensive media vault featuring print clippings, TV broadcast charts, real-time OCR feed, and social listening. |
| 7 | **Activities** | `/activities` | Daily public schedules, VIP ministerial itineraries, press pool assignments, and the Daily Work Flowchart. |
| 8 | **Crisis** | `/crisis` | Rapid response misinformation room with 90-minute SLA countdown timer, verified evidence review, and Collector rebuttal authorization. |
| 9 | **Reports** | `/reports` | Intelligence report generator (Daily Media Summaries, Weekly CPI Scorecards, Departmental Audits) with PDF/CSV export. |
| 10 | **Notification** | `/notifications` | Operational notification center with high-priority SLA countdown alerts and DIO field messages. |
| 11 | **Profile** | `/profile` | Officer profile, clearance level verification, administrative role switcher, and bilingual language preference (English / मराठी). |

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance & Reliability
* **Fast First Load**: First Load JS shared by all routes maintained under 90 kB.
* **Static Site Generation (SSG)**: Core operational routes statically prerendered for instant sub-second response times.
* **SSR-Safe Dynamic Imports**: Heavy visual charting engines (Apache ECharts) loaded asynchronously with zero SSR hydration mismatches.

### 5.2 Accessibility & Usability (a11y)
* Semantic HTML5 elements (`<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>`, `<section>`).
* High-contrast grayscale color ratios meeting WCAG 2.1 AA standards for prolonged monitoring in command rooms.
* Native keyboard navigation and responsive viewport scaling.

### 5.3 Data Governance & Security
* Role-based access governance distinguishing State Command, District Collectorate, and DIO Desks.
* Local state persistence utilizing encrypted store keys.
* Standardized incident references (`SEC-404-ERR-DISPATCH`, `INC-2025-0417`) for end-to-end traceability.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

* **Communication Performance Index (CPI)**: Target composite score $\ge 75/100$ across all 36 districts based on:
  $$\text{CPI} = \text{Volume Score (25)} + \text{TAT Dispatch Score (25)} + \text{Sentiment Score (25)} + \text{Crisis SLA Score (25)}$$
* **Crisis SLA Compliance**: $\ge 90\%$ of verified rumors refuted and dispatched within the 90-minute SLA window.
* **Turnaround Time (Avg TAT)**: Target $\le 45\text{ minutes}$ from event conclusion to official press release issuance.
* **Positive Media Sentiment Ratio**: Maintained above $70\%$ state-wide.

---

## 7. Verification & Sign-off

* **Build & Static Route Verification**: All 16 application routes verified via Next.js compiler (`npm run build`) with zero compile errors.
* **Code Quality & Linting**: ESLint verification (`npm run lint`) completed with 0 warnings and 0 errors.
* **Type Integrity**: Strict TypeScript check (`tsc --noEmit`) passed with zero errors.
