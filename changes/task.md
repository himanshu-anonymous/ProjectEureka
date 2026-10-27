# Maha-Command Center — Frontend Implementation Plan (`task.md`)

## Phase 1: Critical Defects — Data Integrity, RBAC & Blueprint Compliance (Priority: Critical)

- [ ] **TASK-01: Restore Blueprint Pillar 4 (`Field Publicity & IEC`) on `Field Activities` Page**[cite: 3, 29]
  - **Priority:** Critical | **Dependencies:** None
  - **Actions:**
    - Remove the `Timeline Timer: 5s Active` auto-carousel interval and `Next Sequence ->` button from `Webportals — Daily Operations Workflow`[cite: 29].
    - Implement the documented Field Publicity & IEC modules: Mobile Van GPS Route Tracker, Street Play (पथनाट्य) Coverage Counter, and Taluka-level IEC outreach table[cite: 2, 3].
    - Relocate `Today's High-Level Public Schedules & VIP Itinerary` to `Command Centre` or `Reports & Analytics`[cite: 27, 29, 34].
  - **Acceptance Criteria:** `Field Activities` displays GPS van routes and street play counts per Blueprint Slide 3; no 5-second auto-advancing timer exists; sequence titles wrap cleanly without ellipsis truncation[cite: 3, 29].

- [ ] **TASK-02: Fix 100-Point CPI Math, Division Mapping & District Officer Collisions**[cite: 7, 9, 33, 34, 35]
  - **Priority:** Critical | **Dependencies:** None
  - **Actions:**
    - Replace hardcoded `State Command` in the `Division` column of `District Leaderboard` and `Top/Lower Five Matrix` with `Konkan` for Thane, Raigad, Palghar, Ratnagiri, and Sindhudurg[cite: 9, 33, 35].
    - Reconcile Thane's `Media Sentiment` percentage (`82%`) and `CPI Score Decomposition` (`21.75 / 25`, `3.25 pts lost`) using the Blueprint formula $((\text{Net Sentiment Index} + 1.0) / 2) \times 25$ so the table badge, decomposition bar, and channel mix average match mathematically[cite: 7, 9, 33].
    - Fix GIS Map pin and district selection state so `Command Centre` does not show the map pin on `Pune` while the legend reads `Selected: Thane`, and resolve `Suhas R. Bhalerao, IAS` being assigned to both `Pune` and `Thane`[cite: 33, 34].
  - **Acceptance Criteria:** All 5 Konkan districts display `Konkan Division`; sentiment points out of 25 equal $\text{Displayed Sentiment \%} \times 0.25$; GIS map pin, legend, and officer details reflect the exact same selected district[cite: 7, 9, 33, 34].

- [ ] **TASK-03: Enforce RBAC Matrix & Fix Officer Identity Contradictions**[cite: 12, 16, 19, 31, 32]
  - **Priority:** Critical | **Dependencies:** None
  - **Actions:**
    - Update the top header profile pill from `State Observer • Clearance L5` to `State DG Admin • Tier 1` and unify `MH-DGIPR-ADMIN-01` across `Officer Profile`[cite: 16].
    - Correct Audit Log entry `AUD-804` (`Telemetry & Audit` -> `7. Audit`) so `Emergency Rebuttal SLA Authorization` is attributed to a `District Collector` or `State DG Admin` rather than `Mandar S. Nerurkar` (`DIO Desk Operator`)[cite: 12, 16, 19].
    - Display `collector_approval` status on `Crisis Response` incident cards and replace the raw `DG_ADMIN` enum pill with `Tier 1: State DG Admin`[cite: 6, 12, 32].
    - Enforce role-based access on `+ Draft New Press Release` (`Press Releases` page) and disable public `Download PDF` on `Under Review` drafts (`pr-ag-103`)[cite: 12, 31].
  - **Acceptance Criteria:** Header role matches `Officer Profile`; no audit log shows a DIO Operator authorizing a crisis rebuttal; `Under Review` press releases show review actions instead of public download counts[cite: 12, 16, 19, 31, 32].

- [ ] **TASK-04: Add `District` and `Output Velocity (TAT)` Columns to `Press Releases` Ledger**[cite: 4, 6, 8, 31]
  - **Priority:** Critical | **Dependencies:** None
  - **Actions:**
    - Add `District` and `Publish TAT` (`calculated_TAT` in minutes) columns to the `Official Dispatches Ledger` table on `Press Releases`[cite: 6, 31].
    - Apply Blueprint Slide 8 SLA badges (`0–45m: SLA Met`, `45–120m: Degraded`, `120m+: Breached`) to each release row[cite: 8, 31].
  - **Acceptance Criteria:** Every press release row displays its originating district and TAT in minutes with corresponding SLA status[cite: 4, 6, 8, 31].

---

## Phase 2: High-Impact Improvements — Architecture, Filters & System Monitoring (Priority: High)

- [ ] **TASK-05: Bind Global Sub-Header Filters to Page Queries & Hide on Non-Analytical Views**[cite: 16, 26, 31, 32]
  - **Priority:** High | **Dependencies:** TASK-02
  - **Actions:**
    - Connect the `State Operations Overview` district dropdown (`Thane` / `All Districts`) and date range selector (`Last 7 Days`) to filter the active page's dataset, or update the dropdown label to reflect when `Konkan Division (5 Districts)` / `All 36 Districts` is displayed[cite: 26, 31, 32].
    - Hide the `State Operations Overview` sub-header bar on `Officer Profile`[cite: 16].
    - Relocate the `Save Officer Preferences` button on `Officer Profile` into the left profile card directly beneath `Portal Primary Language`[cite: 16].
  - **Acceptance Criteria:** Selecting `Thane` filters the active view exclusively to Thane records; `Officer Profile` no longer shows `Export Telemetry Report` or district filters[cite: 16, 26].

- [ ] **TASK-06: De-duplicate `Dashboard` (5-Zone View) and `Command Centre` (Leadership Overview)**[cite: 10, 11, 30, 33, 34, 35]
  - **Priority:** High | **Dependencies:** TASK-02
  - **Actions:**
    - Remove the `Main Panels: Leadership Overview` bottom section from `Dashboard` (Page 21) so `Dashboard` strictly implements the 5-Zone architecture from Blueprint Slide 10[cite: 10, 14, 35].
    - Remove `(LEFT SECTION)` and `(RIGHT SECTION)` from the column headings on `Command Centre` (Page 20) and replace the duplicated `Media Monitoring` charts on the left with the Leadership Overview panels from Blueprint Slide 11[cite: 11, 30, 34].
  - **Acceptance Criteria:** `Dashboard` renders Zones 1–5 cleanly without duplicating child pages; `Command Centre` contains zero wireframe parenthetical labels[cite: 10, 11, 34, 35].

- [ ] **TASK-07: Standardize `Crisis Response` SLA Countdown Timers**[cite: 32, 35]
  - **Priority:** High | **Dependencies:** TASK-03
  - **Actions:**
    - Rename `90-min SLA Remaining` on `INC-2026-PALGHAR-01` to `SLA Time Remaining (90-Min Target)`[cite: 32].
    - Format all countdown timers in `ACTIVE INCIDENTS QUEUE` (`41:07`, `63:50`) to `HH:MM:SS` (`00:41:07`, `01:03:50`) to match the primary card (`00:17:57`)[cite: 32].
  - **Acceptance Criteria:** All crisis timers use `HH:MM:SS` formatting and clearly distinguish the 90-minute benchmark from the remaining countdown time[cite: 4, 32].

- [ ] **TASK-08: Refactor `System Monitoring` Navigation, Animations & Contradictory Telemetry**[cite: 5, 17, 18, 19, 20, 21, 23, 25]
  - **Priority:** High | **Dependencies:** None
  - **Actions:**
    - Consolidate `Pipeline & Ops Flow` (Page 3) and `Telemetry Operations & Audit` -> Tab `3. Pipelining` (Page 9) into a single route, and remove the redundant 3-card in-page navigation switcher[cite: 17, 23].
    - Move the pinned `TECHNICAL PAYLOAD & CHECKSUM VERIFICATION INSPECTOR` into a slide-over drawer triggered by clicking a log/event row, and fix `RAW-9011` metadata (`detected_language` vs. English headline, `RTSP-OCR` protocol)[cite: 19, 21, 24].
    - Remove the decorative moving packet animations (`OPTICAL DATA CONDUIT` and `Real-Time Ingestion Packet Feed`), fix the off-by-one stage labels (`Stage 4` vs `Stage 5` Fact-Check), replace `Kafka Buffer` labels with `Redis / Celery` per Blueprint Slide 5, and deduplicate the repeated log row in `6. Logs`[cite: 5, 17, 20, 23, 25].
    - Unify the total record count across `Raw Ingestion`, `Pipeline`, `Database`, and `Telemetry`, and update `Raw Ingestion` top status to reflect active retry errors (`ERR-4029`, `ERR-4030`)[cite: 17, 18, 21, 25].
    - Remove the duplicate `Export Logs` / `Export Telemetry Report` button pair and prevent internal database hostnames (`timescale-primary...`) from truncating on `5. Database`[cite: 17, 21].
  - **Acceptance Criteria:** Record counts and health states are consistent across all tabs; no off-by-one stage mismatches exist; JSON inspector opens on demand rather than occupying 40% of all 7 tabs[cite: 17, 18, 19, 21, 25].

---

## Phase 3: Medium & Low Polish — Data Viz, Reports, Auth & Accessibility (Priority: Medium / Low)

- [ ] **TASK-09: Complete `Reports & Analytics` & `Media Monitoring` Data Views**[cite: 3, 4, 26, 27, 28, 30, 33]
  - **Priority:** Medium | **Dependencies:** None
  - **Actions:**
    - Populate all 21 line departments (with pagination/search and release velocity status instead of static `Archived` pills) on the `21 Line Departments` tab[cite: 4, 28].
    - Fix `RPT-MAHA-2026-04` period from `October 2025` to `October 2026`, balance the 3-column `VIP Event Coverage` card heights, and add Divisional/WhatsApp reach to `Social Media Reach`[cite: 3, 26, 27, 28].
    - On `Media Monitoring` (Page 16), reconcile `18 Dailies Tracked` vs. `4 Daily Newspapers Actively Monitored`, sync the `Wire: Thane` badge with the active `All Districts (5)` filter, and add inline percentage labels to the `Sentiment Breakdown by Publication (%)` stacked bars[cite: 30].
    - On `Districts` (Page 19), configure the `Top 5 Districts by Composite Performance Index` chart as a 4-pillar stacked bar chart (or highlight the selected district in dark blue per the chart legend) and fix truncated text (`DISTRICT LIVE ST...`, `Suhas R. Bhal...`) in the GIS inspector[cite: 10, 33].
  - **Acceptance Criteria:** All 21 departments are accessible; archival report dates are in 2026; stacked bar charts match their legends and subtitles; no labels truncate in the GIS card[cite: 26, 28, 30, 33].

- [ ] **TASK-10: Fix Authentication Gateway, Global Watermark & Accessibility Gaps**[cite: 15, 16, 19, 36]
  - **Priority:** Medium | **Dependencies:** None
  - **Actions:**
    - Remove the floating `N` badge/watermark from the login footer and authenticated top-right header across all pages[cite: 15, 16, 36].
    - Fix the vertically cropped Maharashtra emblem at the top of the Login Gateway (Pages 1 & 22), remove the redundant local email input from the `JanParichay SSO` tab, unify primary CTA button colors, and enlarge the CAPTCHA refresh target with an audio CAPTCHA option[cite: 15, 36].
    - Replace `⌘K` in the global search bar with `Ctrl+K` (or platform-aware shortcut text) and shorten the sidebar link `Telemetry Operations & A...` to `Telemetry & Audit`[cite: 16, 19].
  - **Acceptance Criteria:** Login emblem renders uncropped; `N` watermark is gone across all 22 views; sidebar navigation labels do not truncate; CAPTCHA controls meet 40x40px minimum target size[cite: 15, 16, 36].