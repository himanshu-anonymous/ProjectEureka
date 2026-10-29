# Maha-Command Center — Prioritized Frontend Improvement Plan (`changes.md`)

> **Verification Note on Repository Paths:** `Maha_Command_Center_Blueprint.pdf` defines the technology stack (`Next.js 15`, `Tailwind CSS`, `ECharts`, `FastAPI`, `PostgreSQL 16 + TimescaleDB`, `NextAuth / JWT`) and database schema (`districts`, `admin_departments`, `press_releases`, `media_clippings`, `fact_check_tickets`, `mv_district_daily_scores`) without specifying exact `.tsx` file paths[cite: 1, 5, 6, 12]. Components and routes below are referenced by their documented UI names and Next.js App Router conventions (marked for repository path verification).

---

## Priority 1: Critical Changes (Data Integrity, Blueprint Alignment, RBAC & Security)

### 1.1 Restore Documented `Field Publicity & IEC` Module on `Field Activities`
* **What Should Change:**
  * Remove the simulated 5-second `Webportals — Daily Operations Workflow` auto-carousel timer (`Timeline Timer: 5s Active` and `Next Sequence ->` button) on the `Field Activities` page[cite: 29].
  * Implement the Blueprint's Pillar 4 (`फिल्ड पब्लिसिटी आणि IEC`) operational modules: Mobile Van GPS Route Tracking, Street Play (पथनाट्य) Coverage Counts, and Taluka/Block-level IEC outreach logs[cite: 2, 3].
  * Relocate `Today's High-Level Public Schedules & VIP Itinerary` to `Command Centre` or `Reports & Analytics`[cite: 27, 29, 34].
* **Why It Should Change:** Blueprint Slide 3 explicitly defines Pillar 4 as `GPS logs, mobile van routes, street play (पथनाट्य) coverage counts`[cite: 3]. Currently, this entire data pillar is absent from the frontend[cite: 29].
* **Affected Modules / Data Sources:** `Field Activities` route view (`app/field-activities/page.tsx` — *verify path*), `DailyOperationsWorkflow` component, `VIPItinerary` component[cite: 3, 29].
* **How to Improve:**
  1. Clear the 5-second `setInterval` auto-stepper and bind workflow stages to actual IST operational timestamps[cite: 29].
  2. Add three structured sub-views: (a) **IEC Summary Counters** (Active Mobile Vans, Street Plays Conducted, Talukas Reached), (b) **Mobile Van GPS Route & Status Map/Table**, and (c) **Taluka-Level IEC Activity Ledger**[cite: 2, 3].

### 1.2 Fix Mathematical & Data-Binding Defects in the 100-Point CPI Engine
* **What Should Change:**
  * Update the `Division` column in `District Leaderboard` and `Top/Lower Five Matrix` on `Districts` and `Dashboard` so `Thane`, `Raigad`, `Palghar`, `Ratnagiri`, and `Sindhudurg` display `Konkan` instead of `State Command`[cite: 9, 33, 35].
  * Synchronize `Media Sentiment Score` in `CPI Score Decomposition` with the Blueprint formula $((\text{Net Sentiment Index} + 1.0) / 2) \times 25$ from `mv_district_daily_scores` so that Thane's score (`21.75 / 25`) and displayed percentage (`87%` / `+0.740` Net Index, rather than `82%`) are mathematically consistent[cite: 6, 7, 9, 33].
  * Reconcile the `District: Pune` GIS map selection with the `Showing: 5 / 5 Active Reporting Districts` table state and fix `Suhas R. Bhalerao, IAS` being simultaneously assigned to `Pune` (on `Districts`) and `Thane` (on `Command Centre`)[cite: 33, 34].
* **Why It Should Change:** Hardcoded and contradictory numbers undermine executive confidence in the 100-Point Composite Performance Index[cite: 7, 9, 33, 34].
* **Affected Modules / Data Sources:** `Districts` route (`app/districts/page.tsx`), `Dashboard` route (`app/dashboard/page.tsx`), `Command Centre` route (`app/command-centre/page.tsx`), `mv_district_daily_scores` view integration[cite: 6, 33, 34, 35].
* **How to Improve:** Derive all four CPI sub-scores (`Volume`, `Speed/TAT`, `Sentiment`, `Crisis SLA`) dynamically from `mv_district_daily_scores` rather than mixing hardcoded Blueprint values (`21.75 / 25`) with altered static percentages (`82%`)[cite: 6, 7, 9, 33].

### 1.3 Enforce RBAC Matrix & Fix Officer Clearance Identity
* **What Should Change:**
  * Update the global top header profile pill from `State Observer • Clearance L5` to `State DG Admin • Tier 1` and unify `MH-DGIPR-ADMIN-01` vs. `MH-DGIPR-ADMIN-001` on `Officer Profile`[cite: 16].
  * Correct Audit Log `AUD-804` where `Mandar S. Nerurkar` (`DIO Desk Operator`) is logged as approving an `Emergency Rebuttal SLA Authorization`[cite: 12, 16, 19].
  * Add `collector_approval` status badges to `Crisis Response` incident cards and enforce role-based visibility on `+ Draft New Press Release` (`Press Releases` page) per the Blueprint RBAC Matrix[cite: 6, 12, 31, 32].
* **Why It Should Change:** Directly contradicts Blueprint Slide 12 (`सुरक्षा आणि RBAC ऑथोरायझेशन मॅट्रिक्स`) and creates governance audit discrepancies[cite: 12, 16, 19, 31, 32].
* **Affected Modules / Data Sources:** Global Header component, `Officer Profile` route, `Press Releases` route, `Crisis Response` route, `Telemetry & Audit` (`Audit History` table), NextAuth/JWT session context[cite: 12, 16, 19, 31, 32].

### 1.4 Add Missing `District` and `Output Velocity (TAT)` Columns to `Press Releases`
* **What Should Change:** Update the `Official Dispatches Ledger` table on `Press Releases` to display `District`, `Event Timestamp`, and `Publish TAT (mins)` (with 0–45m / 45–120m / 120m+ SLA status badges per Blueprint Slide 8), and restrict public `Download PDF` on `Under Review` items (`pr-ag-103`)[cite: 4, 6, 8, 31].
* **Why It Should Change:** `Output Velocity` (`< 60 mins` / `< 45 mins` SLA) is the primary KPI in the Blueprint (`press_releases.calculated_TAT`), yet it is omitted from the `Press Releases` table[cite: 4, 6, 8, 31].
* **Affected Modules / Data Sources:** `Press Releases` route (`app/press-releases/page.tsx` — *verify path*), `press_releases` schema binding[cite: 6, 31].

---

## Priority 2: High-Impact Changes (Information Architecture, De-duplication & Usability)

### 2.1 Separate `Dashboard` (Slide 10: 5-Zone View) from `Command Centre` (Slide 11: Leadership Panels)
* **What Should Change:**
  * **`Dashboard` (Page 21):** Render **only** the 5 Zones specified in Blueprint Slide 10 (`Zone 1: 4 KPI Counters`, `Zone 2: District Leaderboard`, `Zone 3: CPI Score Decomposition`, `Zone 4: Live OCR Ingestion Stream`, `Zone 5: Emergency Alert & Crisis Monitor`)[cite: 10, 14, 35]. Remove the duplicated `Main Panels: Leadership Overview` bottom half from `Dashboard`[cite: 35].
  * **`Command Centre` (Page 20):** Strip the literal `(LEFT SECTION)` and `(RIGHT SECTION)` strings from the column headings and replace the duplicated `Media Monitoring` print/TV charts on the left column with the Leadership Overview panels from Blueprint Slide 11 (`Top/Lower Five Matrix`, `Social Media Analysis`, `Maharashtra GIS Map`, `Live Event Streaming`)[cite: 11, 30, 34, 35].
* **Why It Should Change:** Eliminates 100% widget duplication across `Dashboard`, `Command Centre`, `Districts`, and `Media Monitoring`, and ensures `Dashboard` strictly matches the 5-Zone UI wireframe required by Blueprint Slide 10 & Slide 14[cite: 10, 11, 14, 30, 33, 34, 35].
* **Affected Modules / Data Sources:** `Dashboard` route, `Command Centre` route[cite: 10, 11, 34, 35].

### 2.2 Streamline `System Monitoring` & Eliminate DevOps Visual Clutter
* **What Should Change:**
  * Remove the duplicate in-page 3-card navigation switcher (`Telemetry Operations & Audit`, `Raw Ingestion`, `Pipeline & Ops Flow`) on Pages 3–11 and merge `Pipeline & Ops Flow` (Page 3) with Tab 3 `Pipelining` (Page 9)[cite: 17, 23].
  * Unpin the `TECHNICAL PAYLOAD & CHECKSUM VERIFICATION INSPECTOR` from the bottom of Tabs 1–7, moving it into an on-demand slide-over drawer when an operator clicks an event/log row[cite: 19, 20, 21, 22, 23, 24, 25].
  * Replace the decorative moving packet boxes (`OPTICAL DATA CONDUIT` on Pages 3 & 9 and `Real-Time Ingestion Packet Feed` on Page 11) with clean static stage throughput metrics, fix the off-by-one stage label mismatches (`Stage 4: Gov Fact-Check` vs. `Stage 5: Cross-Verification Desk`), and align `Kafka Buffer` terminology with the Blueprint's `Redis / Celery Task Queue`[cite: 5, 17, 20, 23, 25].
  * Reconcile the four conflicting record counters (`1,428,940` vs. `1,842,910` vs. `3,428,910` vs. `1,320,520`) and make `Raw Ingestion` top status reflect active `ERR-4029` / `ERR-4030` failures[cite: 17, 18, 21, 25].
* **Why It Should Change:** Reduces cognitive load, stops unnecessary re-renders from continuous packet animations, and fixes contradictory system health indicators[cite: 17, 18, 21, 23, 25].
* **Affected Modules / Data Sources:** `System Monitoring` layout and child views (`Telemetry Operations & Audit`, `Raw Ingestion`, `Pipeline & Ops Flow`)[cite: 17, 18, 19, 23, 25].

### 2.3 Standardize Crisis SLA Countdown Timers & Sub-Header Filter Binding
* **What Should Change:**
  * On `Crisis Response` (Page 18) and `Dashboard` (`Zone 5`), change the static label `90-min SLA Remaining` to `SLA Time Remaining (90m Target)` and format all active queue countdowns (`41:07`, `63:50`) consistently as `HH:MM:SS` (`00:41:07`, `01:03:50`)[cite: 32, 35].
  * Connect the global sub-header filter (`District`, `Date Range`) to actual page data queries, and hide the sub-header on `Officer Profile`[cite: 16, 26, 31, 32].
* **Why It Should Change:** Prevents misinterpretation of remaining emergency response windows during misinformation containment[cite: 4, 32].
* **Affected Modules / Data Sources:** `Crisis Response` route, `EmergencyAlertCard` (`Zone 5`), `SubHeaderFilterBar` component[cite: 10, 32, 35].

---

## Priority 3: Medium & Low Changes (Data Completeness, Accessibility & Polish)

### 3.1 Fix `Reports & Analytics`, `Media Monitoring`, `Districts` Chart, and `Login` Defects
* **What Should Change:**
  * **`Reports & Analytics` (Pages 12–14):** Add pagination/scroll for all 21 departments on the `21 Line Departments` tab (currently capped at 8 rows), fix `RPT-MAHA-2026-04` date from `October 2025` to `October 2026`, replace the Palghar-only `Public App` card with Divisional/WhatsApp reach, and balance the 3-column `VIP Event Coverage` cards[cite: 3, 4, 26, 27, 28].
  * **`Media Monitoring` (Page 16):** Reconcile `18 Dailies Tracked` vs. `4 Daily Newspapers Actively Monitored`, sync the `Thane Wire` badge with the `All Districts (5)` filter pill, and add inline percentage labels to the `Sentiment Breakdown by Publication (%)` stacked bar chart[cite: 30].
  * **`Districts` Chart (Page 19):** Update the `Top 5 Districts by Composite Performance Index` ECharts configuration to render a 4-pillar stacked bar chart (`Volume`, `Speed/TAT`, `Sentiment`, `Crisis SLA`) matching its subtitle `Stacked comparative bar charts & ranked tables`, and fix text truncation (`DISTRICT LIVE ST...`, `Suhas R. Bhal...`) in the GIS inspector[cite: 7, 10, 33].
  * **`Login Gateway` (Pages 1 & 22) & Global Header:** Fix the cropped top emblem, remove the redundant email input on the `JanParichay SSO` tab, unify primary button colors, add audio CAPTCHA support, and remove the floating `N` watermark badge across all pages[cite: 15, 16, 36].