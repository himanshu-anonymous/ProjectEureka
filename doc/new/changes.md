# Maha-Command Center: Comprehensive Architectural Gap Analysis, Auth RBAC, API & UI Evolution Plan (`doc/new/changes.md`)

**Client / Authority**: Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra  
**System Classification**: State Information Operations & Crisis Command Center  
**Document Location**: `/doc/new/changes.md`  
**Author**: Principal Frontend Architect & Senior UI/UX Specialist  
**Status**: Agreed & Aligned Architecture Specification — Awaiting Codebase Execution Authorization  
**Date**: October 2026  

---

## 1. Executive Summary & Core Mandate

This document serves as the master blueprint and change plan for evolving the Maha-Command Center into a production-grade, authenticated, role-gated, and dynamic API-driven government operations platform.

The implementation strictly satisfies:
1. **The 6 Target Screens** from `doc/new/DGIPR Command Center Screens (1).pdf`:
   - **Screen 1**: *All DIO Operations & Performance Command Center* (Dark theme, 36-district matrix grid with color index, Top/Lower performance cards, social media table, Thane 4-pillar bar inspection, live streaming embed + links, 3 open crisis alerts with live countdowns).
   - **Screen 2**: *Konkan Division · 100-Point Performance Index* (4 top KPI ribbon counters, ranked leaderboard with 4-pillar stacked points bars, "Points Lost per Pillar" grouped penalty bar chart across the 5 pilot districts, live OCR ingestion stream with sentiment tags, emergency alerts).
   - **Screen 3**: *Crisis & Fact-check Desk* (Pending rumors with live 90-min SLA countdowns and a 4-stage stepper lifecycle, Konkan crisis containment SLA progress bars, daily activity stream by topic, Collector 1-click action authorization console, core KPI benchmarks matrix).
   - **Screen 4**: *Command & Control Centre* (Large Maharashtra GIS vector topology with Konkan pilot badges, layer toggles for Releases/Clippings/Crisis, donut sentiment gauge, velocity threshold bar, crisis ticket tracker, release & clipping status summary).
   - **Screen 5**: *Main Dashboard* (Executive light theme overview with 4 top stat cards, sentiment donut, choropleth/pin map with side-by-side release bar chart, State Performance Achievement, District Overview drilldown list, Crisis Response overview, and pillar index stacked bars).
   - **Screen 6**: *Enterprise Navigation Drawer & Sub-menus* (Search bar, 11 enterprise departments with sub-drawers, and session controls).
2. **Authoritative Government Operational Data** from `doc/new/माहिती कार्यालय कोकण विभाग दैनदिन कामकाज अहवाल.xlsx`:
   - Ingestion of VIP event coverage (President, PMO, Governor, CMO, Divisional Commissioner).
   - Ingestion of the 21 Administrative Line Departments (Home, Revenue & Forest, Agriculture, Public Health, PWD, Urban Dev, etc.).
   - Ingestion of Journalist Welfare records (Accreditation, Awards, Honor Fund).
   - Ingestion of exact multi-channel social media metrics (Facebook, Instagram, YouTube, X/Twitter, Public App).
3. **User Authentication & Role-Based Operational Scoping**:
   - Gated entry starting at `/login` when unauthenticated.
   - 4 Role Tiers with clear operational boundaries:
     - **Tier 1 — State Admin (DG)**: Full statewide visibility across all 36 districts and 6 divisions.
     - **Tier 2 — Divisional Director (Konkan)**: Scoped to the 5 Konkan districts and Konkan 100-Point Index.
     - **Tier 3 — District Collector (Palghar)**: Scoped to Palghar district with 1-click crisis rebuttal authorization.
     - **Tier 4 — DIO Operator 1 (Palghar Desk)**: Scoped to Palghar local data, clippings, and draft submissions (crisis authorization disabled with explanatory indicator).
4. **Dynamic REST API Endpoints**:
   - Built under `src/app/api/...` serving real dynamic data filtered on the server by authenticated role and district scope.
   - Client-side hybrid dynamic fetching: Initial load via API, live SLA countdown timers, interactive mutation endpoints (`Authorize Rebuttal`, `Issue Advisory`, `Return to DIO`), and toast feedback notifications.

---

## 2. Authentication, Session & Role-Based Access Control (RBAC) Architecture

### 2.1 Route Protection & Landing Flow
- **Unauthenticated Users**: Visiting `/` or any internal route immediately redirects to `/login`.
- **Login Gateway (`/login`)**:
  - Official Government of Maharashtra & DGIPR header and emblem.
  - Role switcher with 4 pre-configured demo personas:
    1. **State DG Admin** (`admin` / `MH-DGIPR-ADMIN-01`)
    2. **Divisional Director (Konkan)** (`director_konkan` / `KONKAN-DIV-DIR-01`)
    3. **District Collector (Palghar)** (`collector_palghar` / `PALGHAR-DM-COLLECTOR-01`)
    4. **DIO Operator 1 (Palghar Desk)** (`operator1` / `PALGHAR-DIO-DESK-01`)
  - Quick-fill credential buttons for instant review and demonstration.
  - 4-digit security PIN / OTP authentication.
  - Post-login role-tailored routing:
    - State Admin -> Redirects to `/command-center` or `/` (Executive Statewide Overview).
    - Divisional Director -> Redirects to `/konkan-index` (Konkan Division 100-Point Index).
    - District Collector -> Redirects to `/crisis` (Crisis Desk with Palghar 1-click action box).
    - DIO Operator 1 -> Redirects to `/districts` or local OCR feed scoped strictly to Palghar.

### 2.2 Operational Scoping Matrix

| Role Tier | Geographic Scope | Command Center (Screen 1 & 4) | Konkan Index (Screen 2) | Crisis Desk (Screen 3) | Rebuttal Authorization |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **State Admin (DG)** | All Maharashtra (36 Districts / 6 Divisions) | ✅ Full Access (All 36 Districts) | ✅ Full Access (All 5 Pilot Districts) | ✅ Statewide Monitoring & Directives | ✅ Full Clearance |
| **Divisional Director** | Konkan Division (5 Districts) | ⚠️ Scoped to Konkan Division | ✅ Primary Focus (Full 100-Point Index) | ⚠️ Division-level Monitoring | ❌ Read-only across districts |
| **District Collector** | Palghar District Only | 🔒 Locked to Palghar | 🔒 Locked to Palghar row | ✅ Primary Focus: Palghar Rumors | ✅ **Authorized 1-Click Approval** |
| **DIO Operator 1** | Palghar District Only | 🔒 Locked to Palghar | 🔒 Locked to Palghar row | ⚠️ View Palghar Rumors | ❌ **Disabled** ("Collector Approval Required") |

### 2.3 UI Lock & Boundary Enforcement
- **Geographic Selector**: For Collector and Operator 1, the dropdown is locked to `"Palghar"`, disabling statewide or other division options.
- **District Tables & Matrices**: For scoped users, out-of-scope districts are either filtered out or visually dimmed with a badge `"Restricted to Assigned District"`.
- **Collector Action Box**:
  - When logged in as **District Collector (Palghar)**: Buttons `[ Authorize Rebuttal ]`, `[ Issue Press Advisory ]`, and `[ Return to DIO for Edits ]` are active, clickable, and execute immediate state mutations.
  - When logged in as **DIO Operator 1**: The authorization button is disabled, displaying: `"Awaiting Collector Approval · Operator Clearance Insufficient"`.

---

## 3. Dedicated REST API Endpoint Architecture (`src/app/api/...`)

All endpoints are implemented as Next.js Route Handlers (`route.ts`) returning standard JSON responses with HTTP status codes and role-filtering logic.

### 3.1 Authentication & Session Endpoints
- `POST /api/auth/login`:
  - Request: `{ username, pin, role }`
  - Response: `{ success: true, token: string, user: { id, name, role, division, district, designation } }`
- `GET /api/auth/me`:
  - Validates session from cookie or authorization header; returns current user profile and permission scope.
- `POST /api/auth/logout`:
  - Clears session cookies and active token.

### 3.2 Dashboard & Performance Endpoints
- `GET /api/dashboard/overview`:
  - Parameters: `?scope=all|division|district&districtId=...`
  - Returns top KPI ribbon metrics (Total Releases, Avg TAT, Net Sentiment, Misinformation Tickets) computed dynamically for the requested scope.
- `GET /api/districts`:
  - Returns ranked list of districts, releases, TAT, sentiment, crisis SLA, and 4-pillar scores (Volume, Speed, Sentiment, Crisis).
  - Automatically filtered by user role (State Admin gets 36 districts; Divisional Director gets Konkan's 5; Collector/Operator gets Palghar).
- `GET /api/districts/points-lost`:
  - Returns the penalty breakdown data ("Points Lost per Pillar") for the Screen 2 grouped bar chart.

### 3.3 Crisis Management & SLA Endpoints
- `GET /api/crisis/incidents`:
  - Returns active rumors, SLA seconds remaining, urgency badges (`AT RISK`, `WATCH`, `ON TRACK`), and the 4-stage stepper state:
    1. Rumor detected (`DONE`)
    2. Collectorate verification (`DONE` / `IN PROGRESS`)
    3. Collector approval (`IN PROGRESS` / `PENDING`)
    4. Rebuttal published (`PENDING` / `DONE`)
- `POST /api/crisis/incidents/[id]/action`:
  - Request: `{ action: 'authorize' | 'issue_advisory' | 'request_edits', notes?: string }`
  - Server-side check: Verifies user role is `collector` (matching incident district) or `dg_admin`.
  - Effect: Updates step 3 to `DONE`, step 4 to `DONE`, stops countdown timer, marks ticket as `RESOLVED`, and recalculates division crisis SLA percentage.

### 3.4 Media Ingestion & Government Reports Endpoints
- `GET /api/ocr/stream`:
  - Returns live scanned clippings with sentiment distribution (`POS`, `NEU`, `NEG`), topic tags, and misinfo flags.
  - Filterable by district and sentiment.
- `POST /api/ocr/stream/simulate`:
  - Inserts a newly scanned newspaper clipping into the active stream to demonstrate real-time dynamic rendering.
- `GET /api/departments/daily-report`:
  - Exposes the structured Excel data from `माहिती कार्यालय कोकण अहवाल.xlsx` covering the 21 line departments, VIP visits, and journalist welfare.

---

## 4. Screen-by-Screen UI Layout & Component Plan

### Screen 1: All DIO Operations & Performance Command Center (`/command-center`)
* **Header / Switcher**:
  - Tabs: `[ Command Center (Active) | Konkan Index | Crisis Desk ]`.
  - Officer badge: Shows active role name (e.g. `DG · State Admin view` or `Palghar Collector view`), live indicator, and time.
* **Left Section**:
  - `PERFORMANCE (Pilot · 5 of 36 DIOs)`:
    - 4 Ranking blocks: (1) DIO Performance Index, (2) District Release Volume, (3) Event by Scheme/Topic, (4) News Coverage.
  - `SOCIAL MEDIA ANALYSIS (API feeds pending)`:
    - Table with Twitter/X, Facebook, Instagram, YouTube, LinkedIn tracking Output, Impressions, Engagement/1K, Video Completion.
* **Center Section**:
  - `MAHARASHTRA · 36 DISTRICT INFORMATION OFFICES`:
    - 36-District Matrix Map with color-coded score thresholds (`≥95`, `90-95`, `80-90`, `Pilot not started`).
  - `SELECTED DIO · THANE` (or Palghar when clicked/scoped):
    - 4 progress bars: Volume (25/25), Speed/TAT (25/25), Sentiment (21.75/25), Crisis SLA (25/25).
* **Right Section**:
  - `LIVE STREAMING`: Stream embed preview + launch buttons (YouTube, Facebook, Instagram, TV news).
  - `CRISIS ALERTS · 3 OPEN`: Palghar (`AT RISK`, 18:32), Raigad (`WATCH`, 41:07), Ratnagiri (`ON TRACK`, 63:50).

### Screen 2: Konkan Division · 100-Point Performance Index (`/konkan-index`)
* **Header / Switcher**: `[ Command Center | Konkan Index (Active) | Crisis Desk ]`.
* **Top Ribbon**: 4 KPI cards (Total Releases: 1,482; Division Avg TAT: 46.6m; Net Sentiment: 69.2%; Misinfo Tickets: 44 raised, 41 resolved, 3 open).
* **Left (8 cols)**:
  - `LEADERBOARD · TOTAL INDEX`: Table with columns `RANK | DISTRICT | RELEASES | AVG TAT | SENTIMENT | CRISIS SLA | PILLAR POINTS (OF 100) | INDEX | DRILL DOWN`. Pillar points rendered as stacked multi-colored horizontal bars.
  - `PILLAR SCORE DECOMPOSITION · POINTS LOST PER PILLAR`: Grouped bar chart comparing points lost across Thane, Raigad, Palghar, Sindhudurg, Ratnagiri (highlighting Sindhudurg volume loss -9.08).
* **Right (4 cols)**:
  - `LIVE INGESTION STREAM`: OCR clippings with auto-scroll and sentiment breakdown bars.
  - `EMERGENCY ALERTS`: 3 pending rumors with countdown timers.

### Screen 3: Crisis & Fact-check Desk (`/crisis`)
* **Header / Switcher**: `[ Command Center | Konkan Index | Crisis Desk (Active) ]`.
* **Top Left**: `PENDING RUMORS · LIVE COUNTDOWN TO 90-MINUTE SLA`:
  - 4-Stage Stepper for Palghar, Raigad, Ratnagiri (`1. Rumor detected -> 2. Collectorate verification -> 3. Collector approval -> 4. Rebuttal published`).
* **Top Right**: `CRISIS CONTAINMENT SLA · KONKAN (Q3 2026)`:
  - 93.2% containment gauge + district progress bars (Thane 100%, Sindhudurg 100%, Palghar 90.9%, Raigad 88.9%, Ratnagiri 85.7%).
* **Bottom Left**: `DAILY ACTIVITY STREAM (01 Oct 2026)`: Table tracking releases, scanned clippings, and misinfo flags per topic.
* **Bottom Middle**: `COLLECTOR ACTION (Role · District Collector)`:
  - 1-click decision console with `[ Authorize rebuttal ]`, `[ Issue press advisory ]`, `[ Return to DIO for edits ]`.
  - Connected to `POST /api/crisis/incidents/[id]/action` with dynamic feedback and disabled states for unauthorized operators.
* **Bottom Right**: `CORE KPI BENCHMARKS`: Division benchmark table (`MET`, `NO FEED`, `3 OPEN`).

### Screen 4: Wall Display Command & Control Centre (`/command-control`)
* High-density command deck with large Maharashtra GIS vector map, Konkan pilot bubble badges, layer toggles (`Releases | Clippings | Crisis`), output velocity bar (45m target threshold), and release & clipping status summary.

### Screen 5: Executive Main Dashboard (`/` & `/dashboard`)
* Executive light theme dashboard with 4 top stat cards, sentiment donut, vector map with bar chart, State Performance Achievement, District Overview drilldown list, Crisis Response overview, and pillar index stacked bars.

### Screen 6: Enterprise Navigation Drawer
* Expandable left navigation drawer with search bar, 11 official DGIPR destinations with sub-drawers, active session indicator, and logout action.

---

## 5. Phased Implementation Roadmap (Pending User Permission)

| Phase | Milestone | Scope | Codebase Changes |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Auth Gateway & Session Middleware** | Implement `/login` page with 4 role personas, credential quick-fill, PIN check, session state in store and cookies, and redirect middleware for unauthenticated routes. | `src/app/login/page.tsx`, `src/stores/authStore.ts`, middleware/redirect logic. |
| **Phase 2** | **REST API Handlers (`src/app/api/...`)** | Create dedicated Next.js route handlers for `/api/auth/*`, `/api/dashboard/*`, `/api/districts/*`, `/api/crisis/*`, and `/api/ocr/*` with role & district scoping logic. | `src/app/api/.../route.ts` |
| **Phase 3** | **Data Ingestion & Store Sync** | Ingest Excel dataset (`माहिती कार्यालय कोकण अहवाल.xlsx`) into typed mock repository; wire frontend components to fetch from API endpoints dynamically. | `src/data/...`, `src/hooks/useDashboardData.ts` |
| **Phase 4** | **Screen 1, 2, 3 Switcher Deck** | Build persistent `[ Command Center | Konkan Index | Crisis Desk ]` switcher; build Screen 1 36-district matrix grid & Top/Lower lists; build Screen 2 points lost grouped bar chart; build Screen 3 4-stage stepper and Collector action console. | `src/components/commandCenter/...`, `src/components/zones/...` |
| **Phase 5** | **Screen 4 & Screen 5 Refinements** | Polish Screen 4 wall display GIS map deck and Screen 5 light executive dashboard. | `src/components/dashboard/...` |
| **Phase 6** | **Navigation Drawer & Verification** | Update `Sidebar.tsx` to match Screen 6 (search, 11 enterprise items, sub-drawers, logout); conduct end-to-end testing across all 4 roles. | `src/components/layout/Sidebar.tsx` |

---

## 6. Execution Safeguard Reminder
**Strict Rule Observed**: No modifications have been made to the `src/` codebase. Execution will only begin once explicit permission is provided by the user.
