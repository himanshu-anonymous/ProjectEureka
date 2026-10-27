# Maha-Command Center — Principal UI/UX & Frontend Architecture Audit (`ui_audit.md`)

## 1. Executive Summary & Architectural Cross-Reference

The **Maha-Command Center** frontend (built with Next.js 15, Tailwind CSS, and ECharts) serves as the centralized operational and performance tracking gateway for the Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra[cite: 1, 5]. Cross-referencing the 22 application pages against the **Maha-Command Center Blueprint** reveals that while core concepts—the 5-Zone layout, 100-Point Composite Performance Index (CPI), 90-minute Crisis SLA tracker, and multilingual OCR/Sentiment pipelines—are visually represented[cite: 4, 7, 10, 32, 33, 35], there are critical architectural mismatches, data integrity contradictions, RBAC violations, and usability defects.

### Core Systemic Findings
* **Blueprint vs. Implementation Divergence in `Field Activities`:** Pillar 4 of the Blueprint specifies that Field Publicity & IEC must track GPS logs, mobile van routes, and street play (पथनाट्य) coverage counts[cite: 3]. The implemented `Field Activities` page omits all field publicity and IEC telemetry, replacing it with an auto-cycling 5-second workflow slideshow and a VIP meeting itinerary[cite: 29].
* **RBAC & Security Governance Contradictions:** The Blueprint RBAC Matrix and the `Officer Profile` page explicitly state that a `DIO Desk` operator has no Crisis Rebuttal authorization rights[cite: 12, 16]. However, the cryptographic Audit Log (`AUD-804`) records a `DIO Desk Operator` (`Mandar S. Nerurkar`) approving an Emergency Rebuttal SLA Authorization[cite: 19]. Conversely, the `Press Releases` page exposes a `+ Draft New Press Release` button to the `State DG Admin`, despite the Blueprint assigning `Local Entry` exclusively to the `DIO Desk` role[cite: 12, 31].
* **Mathematical & Baseline Data Inconsistencies:** On the `Districts` and `Dashboard` pages, Thane's Media Sentiment is displayed as `82%` in the table and badge, yet the `CPI Score Decomposition` awards `21.75 / 25` points (`3.25 pts lost`)[cite: 33, 35]. Mathematically, $21.75 / 25$ equals $87\%$ (derived from the Blueprint's $+0.740$ net sentiment index via $((+0.740 + 1.0) / 2) \times 25 = 21.75$)[cite: 7, 9], whereas $82\%$ would yield $20.50 / 25$[cite: 33]. Furthermore, all five Konkan division districts (`Thane`, `Raigad`, `Palghar`, `Ratnagiri`, `Sindhudurg`) have their administrative `Division` erroneously hardcoded as `State Command` instead of `Konkan`[cite: 9, 33, 35].
* **Excessive SaaS/DevOps Bloat & Navigation Duplication:** Nine out of 22 screens are dedicated to low-level infrastructure telemetry (`Zero-Copy Ring Buffer Bus`, simulated packet animations, Kafka partition offsets, and raw SHA-256 JSON inspectors) that are not part of the Blueprint's 5-Zone executive architecture and overwhelm government operators with DevOps noise[cite: 10, 14, 17, 20, 23].

---

## 2. Global Chrome, Layout & Cross-Page Defects (Pages 2–21)

### 2.1 Genuine Defects

| ID | Location | Severity | Finding & Evidence | Operational Impact | Recommended Correction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GLB-01** | Top Header Bar vs. `Officer Profile` & `Crisis Response` | **Critical** | **Conflicting Officer Role & Clearance Level:** The top-right profile pill across all authenticated views labels `Dr. Arvind M. Gokhale` as `State Observer • Clearance L5`[cite: 16, 26], whereas the `Officer Profile` and `Crisis Response` pages identify him as `Director General, DGIPR Maharashtra`, `State DG Admin`, `Clearance Tier 1: State Command Deck`[cite: 16, 32]. | Creates confusion regarding active RBAC permissions (Observer vs. Tier-1 Executive Admin) during crisis authorization workflows[cite: 12, 16, 32]. | Synchronize the global header profile component with the active session context (`State DG Admin • Tier 1`)[cite: 16]. |
| **GLB-02** | Sub-Header Filter Bar (`State Operations Overview`) | **Critical** | **Non-Functional / Decoupled Global District & Date Filters:** The secondary white sub-header displays `Thane` and `Last 7 Days` on `Officer Profile`, `System Monitoring`, `Reports & Analytics`, `Field Activities`, `Media Monitoring`, `Press Releases`, and `Crisis Response`[cite: 16, 17, 26, 29, 30, 31, 32], yet the underlying views render statewide or 5-district Konkan data (`Palghar`, `Raigad`, `Ratnagiri`, `Sindhudurg`, `Pune`, `Marathwada`) and dates outside the 7-day window (`Oct 02, 2026`, `Q3 2026`, `October 2025`)[cite: 26, 29, 31, 32]. | Misleads decision-makers into believing statewide or divisional metrics are filtered strictly to `Thane`[cite: 26, 31, 32]. | Bind the sub-header filter state (`district_id`, `date_range`) to page query parameters, and hide the operational filter bar on non-analytical pages such as `Officer Profile`[cite: 16]. |
| **GLB-03** | Top-Right Corner & Login Footer | **High** | **Framework Watermark / Dev Badge (`N`) Overlapping UI:** A circular black `N` badge appears in the bottom-right footer of the login screens and in the far top-right header next to the user profile on all authenticated pages[cite: 15, 16, 26, 36]. | Degrades visual credibility and obscures adjacent UI elements in a production government enclave[cite: 15, 16, 36]. | Disable the Next.js development indicator (`devIndicators: false` in `next.config`) or remove the unlabelled floating `N` avatar badge from the layout shell[cite: 1, 15, 16]. |
| **GLB-04** | Left Sidebar Navigation | **Medium** | **Truncated Sub-Navigation Label:** Under `SYSTEM & INFRASTRUCTURE` -> `System Monitoring`, the first child link is truncated as `Telemetry Operations & A...` even when the sidebar is fully expanded[cite: 16, 26, 32]. | Reduces scannability and looks unpolished in the primary navigation tree[cite: 16, 26]. | Shorten the navigation label to `Telemetry & Audit` (matching the top breadcrumb on those pages)[cite: 19, 20]. |
| **GLB-05** | Top Header Clock vs. Page Timestamps | **Medium** | **Unsynchronized System Clocks:** The top header clock displays `02:05 IST` to `02:09 IST`[cite: 16, 34], while `Officer Profile` lists `Last Login: Today, 14:30 IST`[cite: 16], `Audit History` logs events at `22:38 IST`[cite: 19], `Application Logs` stream at `22:40 IST`[cite: 20], and `Health Checks` log `Today at 17:02:00`[cite: 22]. | Undermines audit trail reliability when "Today" timestamps are in the future relative to the `02:08 IST` system clock[cite: 16, 19, 20, 22]. | Standardize all mocked or live timestamps to a unified UTC/IST clock source across the frontend state[cite: 16, 19, 20, 22]. |

### 2.2 Subjective Design & Usability Suggestions
* **Mac-Specific Shortcut Symbol (`⌘K`) in Global Search:** The top search input (`Search districts, alerts...`) displays a `⌘K` badge[cite: 16, 26]. Because Government of Maharashtra / NIC workstations predominantly run Windows/Linux, render `Ctrl+K` (matching the `< Collapse (Ctrl+B)` hint in the sidebar footer) or dynamically detect the OS platform[cite: 16, 26].
* **Redundant Sub-Header Chrome (`State Operations Overview`):** Repeating the static `State Operations Overview | Statewide Clearance` bar with `Export Telemetry Report` on every functional route consumes ~64px of vertical viewport height without contextual adaptation[cite: 16, 26, 31].

---

## 3. Page-by-Page Detailed Audit

### Page 1 & Page 22: Authentication Gateway (`Officer ID / PIN` & `JanParichay SSO`)[cite: 15, 36]

#### Genuine Defects
1. **[Critical | Visual Defect] Cropped State Emblem at Top Viewport Edge:** At the top-left of the browser viewport (above the main login card), the circular golden emblem is vertically cut off, leaving only the bottom crescent visible[cite: 15, 36].
   * *Recommended Correction:* Fix the top header container padding/height or remove the duplicate outer top bar so the emblem inside the card serves as the sole brand mark[cite: 15, 36].
2. **[High | Workflow Defect] Redundant Input Field on `JanParichay SSO` Tab:** When switching to the `JanParichay SSO` tab, the form still displays the local `OFFICER ID OR OFFICIAL GOV EMAIL` text input above the JanParichay informational banner[cite: 36]. JanParichay is a centralized external Single Sign-On gateway where identity is authenticated on the NIC Parichay portal[cite: 36].
   * *Recommended Correction:* Remove the `OFFICER ID OR OFFICIAL GOV EMAIL` input from the `JanParichay SSO` tab panel or clarify if pre-redirect tenant lookup is required (requires verification)[cite: 36].
3. **[Medium | Accessibility & UI Defect] Static Unstyled Text CAPTCHA & Tiny Refresh Target:** The `SECURITY VERIFICATION (CAPTCHA)` box displays plain spaced characters (`5 Z H F K`) next to a miniature refresh icon whose hit area is far below the 44x44px accessibility minimum, with no audio CAPTCHA alternative despite linking an `Accessibility Statement` in the footer[cite: 15].
   * *Recommended Correction:* Enlarge the refresh button to at least 40x40px, add an audio CAPTCHA button for GIGW compliance, and align input heights[cite: 15].
4. **[Low | Visual Inconsistency] Primary CTA Button Color Shift Across Tabs:** The primary submit button is saffron/orange (`Authenticate and continue ->`) on the `Officer ID / PIN` tab[cite: 15] but switches to dark navy (`Continue to JanParichay SSO ->`) on the `JanParichay SSO` tab[cite: 36].
   * *Recommended Correction:* Maintain a consistent primary brand button style across authentication tabs[cite: 15, 36].

---

### Page 2: Officer Profile & Access Governance[cite: 16]

#### Genuine Defects
1. **[High | Data Inconsistency] Officer ID Mismatch on the Same Screen:** In the left profile card, the Officer ID is `MH-DGIPR-ADMIN-01`, whereas in the bottom-right `Maha-Cloud Gov Infrastructure Verification` audit notice, the exact same officer's ID is written as `MH-DGIPR-ADMIN-001`[cite: 16].
   * *Recommended Correction:* Bind both fields to the same `user.officerId` property[cite: 16].
2. **[High | UX & Layout Defect] Misplaced `Save Officer Preferences` Button:** The interactive `Portal Primary Language` selector (`English` vs. `Marathi`) is located at the bottom of the left profile card, while the `Save Officer Preferences` action button is placed inside the unrelated `Maha-Cloud Gov Infrastructure Verification` informational notice at the bottom right[cite: 16].
   * *Recommended Correction:* Move `Save Officer Preferences` directly inside the left card below the `Portal Primary Language` control[cite: 16].
3. **[Medium | Blueprint Mismatch] Undocumented `Divisional Director` Role in Persona Switcher:** The `Switch Officer Persona / Role Delegation` card introduces a 4th role (`Divisional Director — Rudresh Kumar Sawant, Tier 2 • Konkan Division`), whereas the Blueprint RBAC Matrix defines a strict 3-tier model (`DG State Admin`, `District Collector`, `DIO Desk`)[cite: 12, 16].
   * *Recommended Correction:* Verify with backend RBAC specifications whether `Divisional Director` is an approved 4th role; if so, update the RBAC matrix documentation, and clearly label the persona switcher as an `Audit / Role Simulation Sandbox` so it is not mistaken for live delegation[cite: 12, 16].

---

### Pages 3–11: System Monitoring (`Pipeline & Ops Flow`, `Raw Ingestion`, `Telemetry Operations & Audit`)[cite: 17, 18, 19, 20, 21, 22, 23, 24, 25]

#### Genuine Defects
1. **[Critical | Security & RBAC Defect] Unauthorized Crisis Rebuttal Approval in Audit Log (`AUD-804`):** On Page 5 (`7. Configuration Changes & Audit History`), record `AUD-804` states that `Mandar S. Nerurkar` (`L3 - Desk Operator`) executed `Emergency Rebuttal SLA Authorization Approved for Coastal Rumor`[cite: 19]. Both Blueprint Slide 12 and Page 2 (`Officer Profile`) explicitly specify that `Mandar Nerurkar` (`DIO Operator`) has **`Crisis Auth = NO` / `(rebuttal authorization disabled)`**, and that final single-click rebuttal authority rests with the District Collector or State DG Admin[cite: 12, 16].
   * *Recommended Correction:* Fix the audit seed/log data and backend validation so `Emergency Rebuttal SLA Authorization` events can only be attributed to `District Collector` or `State DG Admin` roles[cite: 12, 16, 19].
2. **[Critical | Data Integrity Defect] Four Conflicting Total Record Counts Across Sibling Tabs:** Within the same `System Monitoring` module at `02:07–02:08 IST`[cite: 17, 18, 21, 25]:
   * `Pipeline & Ops Flow` (Page 3 & Page 9) displays `Total Processed: 1,428,940`[cite: 17, 23].
   * `Raw Ingestion` (Page 4) displays `REAL-TIME RAW DATA: 1,842,910`[cite: 18].
   * `5. Database` (Page 7) displays `Total Stored Records: 3,428,910`[cite: 21].
   * `1. Telemetry` (Page 11) displays `Total Ingested: 1,320,520`[cite: 25].
   * *Recommended Correction:* Source all ingestion and persistence counters from a unified telemetry state store or clearly label the time horizon (e.g., `24h Ingested` vs. `90d Hot Storage`)[cite: 17, 18, 21, 25].
3. **[Critical | UI & State Contradiction] `100% Online / 0 Degraded` vs. Active Gateway Failures on `Raw Ingestion` (Page 4):** The top KPI banner on `Raw Ingestion` reports `INGESTION STATUS: Operational • 100% Online • 0 Blocked / 0 Degraded` and `Self-Healed 100%`[cite: 18]. Directly below it, Section `3. Processing Failures & Retry` displays two active failure alerts (`ERR-4029 Ratnagiri Local Cable Feed — OCR Confidence < 45%` at `Retry Attempts: 2/3` and `ERR-4030 Palghar Tribal Community Radio — HTTP Gateway Timeout 504` at `Retry Attempts: 1/3`) requiring manual `Retry Now` clicks[cite: 18].
   * *Recommended Correction:* Compute top-level health status dynamically from active error queues (e.g., show `2 Degraded / Retrying` when unresolved `ERR-*` items exist)[cite: 18].
4. **[High | Navigation & Component Duplication] Triple-Nested Redundant Navigation & Duplicate Route (`Pipeline & Ops Flow` vs. Tab 3 `Pipelining`):**
   * The left sidebar contains links for `Telemetry Operations & A...`, `Raw Ingestion`, and `Pipeline & Ops Flow`[cite: 17].
   * Inside the page canvas, a giant 3-card header repeats the exact same links (`Telemetry Operations & Audit`, `Raw Ingestion`, `Pipeline & Ops Flow`)[cite: 17].
   * Clicking `Pipeline & Ops Flow` (Page 3) renders the exact same `3. Multi-Stage Telemetry Execution Pipeline` diagram and packet feed as `Telemetry Operations & Audit` -> Tab `3. Pipelining` (Page 9)[cite: 17, 23].
   * *Recommended Correction:* Remove the redundant 3-card in-page switcher (relying on the sidebar or a clean top tab bar) and consolidate `Pipeline & Ops Flow` with Tab 3 (`Pipelining`) so there is only one canonical route for pipeline visualization[cite: 17, 23].
5. **[High | Diagram & Data Mismatch] Contradictory Pipeline Stage Numbering & Architecture Drift:**
   * On Page 3 (`Pipeline & Ops Flow`), the 6 stages are numbered: `Stage 1: Ingestion Gateways`, `Stage 2: High-Velocity Buffer`, `Stage 3: Devanagari OCR & Tokenizer`, `Stage 4: Indic-BERT NLP Classifier`, `Stage 5: Cross-Verification Desk (NIC / Fact-Check Registry)`, `Stage 6: TimescaleDB & WebSockets`[cite: 17]. However, the packet cards directly below display `PKT-9118 — Stage 4: Gov Fact-Check` and `PKT-9482 — Stage 3: Indic-BERT NLP` (off-by-one mismatch against the diagram above)[cite: 17].
   * Meanwhile, Page 4 (`Raw Ingestion`) shows a 5-stage pipeline (`1. Ingestion`, `2. Tokenize & Clean`, `3. NLP Scoring`, `4. Validation Check`, `5. DB Persistence`)[cite: 18].
   * Additionally, Page 3, Page 6, and Page 9 reference `Kafka Buffer`[cite: 17, 20, 23], whereas the Blueprint architecture specifies `FastAPI + Redis / Celery Task Queue`[cite: 5, 13].
   * *Recommended Correction:* Align stage numbers, labels, and queue nomenclature (`Redis / Celery`) across all pipeline diagrams and packet cards[cite: 5, 17, 18, 20, 23].
6. **[High | Data Defect] Corrupted JSON Inspector Payload (`RAW-9011`) Repeated Across 7 Screens:** The `TECHNICAL PAYLOAD & CHECKSUM VERIFICATION INSPECTOR` is pinned to the bottom of every sub-tab in `Telemetry Operations & Audit` (Pages 5–11)[cite: 19, 20, 21, 22, 23, 24, 25]. Its selected payload `RAW-9011` sets `"detected_language": "mr"` (Marathi), while `"headline_raw"` is English text (`"Thane creek coastal road construction accelerated; PWD inspection completed"`), and `"protocol": "RTSP-OCR"` conflates video streaming (`RTSP`) with print `OCR`[cite: 19, 21, 24].
   * *Recommended Correction:* Isolate the JSON Inspector into a slide-over drawer or dedicated modal triggered on row click rather than pinning it across all 7 tabs, and fix the payload metadata[cite: 19, 21, 24].
7. **[Medium | Defect] Duplicate Consecutive Log Entry in `Application Logs` (Page 6):** At timestamp `22:40:34.000 [Pipeline]`, the message `"Execution Stage 2 (Kafka Buffer) partition #3 balanced. Offset committed at seq #894210."` is rendered twice consecutively[cite: 20].
   * *Recommended Correction:* Deduplicate log stream state updates by event ID/sequence key[cite: 20].
8. **[Medium | Security & Truncation Defect] Exposed & Truncated Internal DB Hostnames (Page 7):** The `DATABASE TOPOLOGY & CREDENTIAL CONTEXT` panel exposes internal host strings that truncate mid-word (`timescale-primary.dgipr-m...` and `timescale-read-01.dgipr-state...`)[cite: 21].
   * *Recommended Correction:* Mask full internal host FQDNs in the frontend UI or display logical cluster aliases (`Primary Node (SDC-Mumbai-01)`) without text overflow[cite: 21].
9. **[Medium | Redundant UI Controls] Duplicate Export Buttons & Quadruple Data Representation (Pages 3–11):**
   * Every System Monitoring screen shows `Export Telemetry Report` in the white sub-header directly above `Export Logs` in the dark blue banner[cite: 17, 18, 19, 20, 21, 22, 23, 24, 25].
   * Page 11 (`1. Regional Telemetry Ingestion Flow`) displays the exact same 5 district gateway metrics four times on one screen: (1) the left node list, (2) the animated hub-and-spoke diagram, (3) the `Real-Time Ingestion Packet Feed` strip, and (4) the `ACTIVE DISTRICT TELEMETRY GATEWAYS` table[cite: 25].
   * *Recommended Correction:* Remove the redundant animated packet strip and duplicate node cards on Page 11, retaining the structured `ACTIVE DISTRICT TELEMETRY GATEWAYS` table and a single contextual export button[cite: 17, 25].

---

### Pages 12–14: Reports & Analytics (`Social Media Reach`, `VIP Event Coverage`, `21 Line Departments`)[cite: 26, 27, 28]

#### Genuine Defects
1. **[High | Incomplete Feature / Mismatch] `21 Line Departments` Tab Only Lists 8 Departments (Page 14):** The tab label, page subtitle, and archival report title all state `21 Line Departments`, and Blueprint Slide 4 mandates tracking `Inter-Departmental: सर्व विभागांचे समान कव्हरेज` (`>= 1 release/department/quarter`)[cite: 4, 28]. However, the table only renders 8 departments with no pagination, scroll bar, or search filter to view the remaining 13 departments[cite: 28].
   * *Recommended Correction:* Add pagination or virtualized scrolling for all 21 line departments and include a filter for departments with `0` releases to track the Blueprint's quarterly coverage KPI[cite: 4, 28].
2. **[High | Data Defect] Archival Report `RPT-MAHA-2026-04` Has `October 2025` Date (Pages 12–14):** In the `Archival Intelligence Dossiers` list, `RPT-MAHA-2026-04` (`21 Line Departments PR & Social Media Amplification Report`) carries a `2026` report ID alongside `2026` sibling reports (`RPT-MAHA-2026-01` to `03`), but its `Period` is listed as `October 2025`[cite: 26, 27, 28].
   * *Recommended Correction:* Correct the report period metadata to `October 2026`[cite: 26, 27, 28].
3. **[Medium | Data Scope Defect] Divisional Social Media Report Scoped to `MahaGov Palghar` Only (Page 12):** On the `Social Media Reach` tab for the 5-district `Divisional Information Office` (`Palghar, Thane, Raigad, Ratnagiri, Sindhudurg`), the 5th card (`Public App`) displays handle `MahaGov Palghar` instead of a divisional or statewide aggregate, while omitting `WhatsApp API feeds` required by Blueprint Pillar 2[cite: 3, 26].
   * *Recommended Correction:* Replace `Public App (MahaGov Palghar)` with aggregated Divisional Public App / WhatsApp Business API reach metrics[cite: 3, 26].
4. **[Low | Layout & Redundancy] Unbalanced 3-Column VIP Grid (Page 13) & Redundant `Archived` Badges (Page 14):**
   * On Page 13 (`VIP Event Coverage`), the `Hon. Governor` and `Divisional Commissioner` cards contain only a single bullet point each, leaving 75% of both cards blank and lacking the engagement summary pill shown on the `Hon. Chief Minister` card[cite: 27].
   * On Page 14, every row in the current day's `OFFICIAL OPERATIONS REPORT` (`13 Oct 2026`) displays an identical grey `Archived` status pill[cite: 28].
   * *Recommended Correction:* Auto-size card heights or add summary KPI footers across all three VIP cards[cite: 27], and replace the static `Archived` column on Page 14 with actionable KPI data (e.g., `Media Uptake %` or `Avg TAT` per department)[cite: 4, 28].

---

### Page 15: Field Activities (`Government Activities & Press Coverage Itinerary`)[cite: 29]

#### Genuine Defects
1. **[Critical | Blueprint Functional Mismatch] Complete Absence of Field Publicity & IEC Telemetry:** Blueprint Slide 3 (`डॅशबोर्डचे ४ मुख्य डेटा पिलर्स`) defines Pillar 4 (`फिल्ड पब्लिसिटी आणि IEC`) as tracking **`GPS logs, mobile van routes, street play (पथनाट्य) coverage counts`**[cite: 3]. The implemented `Field Activities` screen contains zero data on mobile vans, GPS logs, or street plays; instead, it renders an internal IT/editorial workflow timeline (`Multi-Media Ingestion`, `System Monitoring`, `Departmental Dispatch`) and a ministerial meeting schedule[cite: 29].
   * *Recommended Correction:* Restore the documented Field Publicity & IEC modules (Mobile Van GPS Route Tracker, Street Play / पथनाट्य Coverage Counter, and Taluka-level IEC Camp logs) to the `Field Activities` page, moving the VIP Schedule to `Command Centre` or `Reports`[cite: 3, 29].
2. **[High | Usability & Cognitive Load Defect] Conflicting Auto-Advancing 5-Second Carousel Timer on a 6-Hour Operational Workflow:** The top card (`Webportals — Daily Operations Workflow`) displays simultaneous timer badges: `6h Status Cycle`, `Auto-Trigger: @ 50% Timeline (3h Midpoint)`, `Auto-Refresh: Every 6 Hours • Cycle Active`, and `Timeline Timer: 5s Active` with pause/reset controls and a `Next Sequence ->` button[cite: 29]. Auto-stepping through a 6-hour operational cycle every 5 seconds turns a real-time status board into a self-playing UI slideshow, making it impossible for an operator to tell whether `Sequence 03` is the actual live operational state or a 5-second animation tick[cite: 29].
   * *Recommended Correction:* Remove the `5s Active` auto-carousel timer and `Next Sequence ->` simulation button; bind the active sequence strictly to the real-time IST clock or actual workflow completion state[cite: 29].
3. **[Medium | Typography & Truncation Defect] All 6 Sequence Card Titles Truncated with Ellipses:** Every sequence card heading (`Multi-Media Ingestion & Digital...`, `System Monitoring & Automated...`, `Departmental Dispatch & Press...`, `Crisis SLA Monitoring & Rumor...`, `Live Press Briefings & Broadcast...`, `Daily Media Summary & Leadership...`) is single-line truncated (`text-overflow: ellipsis`) despite ample vertical card padding[cite: 29].
   * *Recommended Correction:* Allow 2-line wrapping (`line-clamp-2`) for sequence card titles[cite: 29].

---

### Page 16: Media Monitoring (`Unified State Media Archive & Real-Time Monitoring`)[cite: 30]

#### Genuine Defects
1. **[High | Internal Data Contradiction] `18 Dailies Tracked` vs. `4 Daily Newspapers Actively Monitored` on the Same Page:** The top-left `Newspaper Data & Print Clippings` card badge states `18 Dailies Tracked`, the stacked bar chart shows `5` publications (`Lokmat`, `Maharashtra Times`, `Sakal`, `Punya Nagari`, `Loksatta`), and the bottom-left `Live OCR Ingestion Stream` footer states `4 Daily Newspapers Actively Monitored` (while listing `Lokmat`, `Pudhari`, `Sakal`, `Tarun Bharat Konkan`)[cite: 30].
   * *Recommended Correction:* Reconcile newspaper counts across components (e.g., clearly distinguish `18 State Dailies Tracked` vs. `4 Regional Konkan Editions Filtered`)[cite: 30].
2. **[Medium | Filter State Contradiction] `Thane Wire` Header vs. `All Districts (5)` Active Scope:** The bottom-left card is titled `Live OCR Ingestion Stream • Thane Wire` with a badge `Wire: Thane`, yet the active filter pill is `Scope: All Districts (5)` and 3 of the 4 displayed clippings are from `Palghar`, `Raigad`, and `Sindhudurg`[cite: 30].
   * *Recommended Correction:* Dynamically update the card title and `Wire:` badge to match the selected scope pill (`Konkan Division Wire (5 Districts)` when `All Districts (5)` is selected)[cite: 30].
3. **[Medium | Accessibility Defect] Color-Only Sentiment Differentiation & Missing Percentage Labels on Stacked Bar Chart:** The `Sentiment Breakdown by Publication (%)` chart relies solely on green (`Pos`), grey (`Neu`), and red (`Neg`) bars without inline percentage labels, patterns, or visible numeric values[cite: 30].
   * *Recommended Correction:* Add inline percentage labels inside the horizontal bar segments and use colorblind-safe contrast/patterns[cite: 30].

---

### Page 17: Press Releases (`State Press Release Distribution Pipeline`)[cite: 31]

#### Genuine Defects
1. **[Critical | Blueprint KPI Omission] Missing `District` and `Output Velocity (TAT)` Columns in Dispatches Ledger:** Blueprint Slide 4 and Slide 6 establish that `press_releases` must track district mapping and `calculated_TAT` (`published_timestamp - event_timestamp`, benchmark `< 60 mins` / `< 45 mins` for SLA)[cite: 4, 6, 8]. The `Official Dispatches Ledger` table omits both `District` and `TAT / SLA Status`, displaying a non-blueprint `Downloads` counter instead[cite: 31].
   * *Recommended Correction:* Add `District` and `Publish TAT (mins)` columns (with SLA status badges per Blueprint Slide 8) to the `Official Dispatches Ledger` table[cite: 6, 8, 31].
2. **[High | Workflow Logic Defect] `Under Review` Draft (`pr-ag-103`) Publicly Downloadable with `140` Downloads:** Row `pr-ag-103` (`Draft guideline on organic produce certification framework`) has status `Under Review`, yet it records `140` downloads and offers the exact same `Download PDF` action button as `Published` releases, with no `Review / Approve` workflow action[cite: 31].
   * *Recommended Correction:* Replace `Download PDF` with `Review & Approve` for items in `Under Review` or `Draft` status, and restrict public download counts to `Published` releases[cite: 31].
3. **[Medium | RBAC Mismatch] `+ Draft New Press Release` Shown to `State DG Admin`:** Blueprint Slide 12 specifies that `DG State Admin` has `डेटा एंट्री (Local Entry) = NO`[cite: 12].
   * *Recommended Correction:* Conditionally render `+ Draft New Press Release` based on RBAC permissions (or relabel as `Issue Statewide Directive / Press Note` if State DG Admin drafting is intended — requires verification)[cite: 12, 31].

---

### Page 18: Crisis Response (`Crisis Escalation & Misinformation Rapid Response Desk`)[cite: 32]

#### Genuine Defects
1. **[High | Usability & Timer Formatting Defect] Confusing `90-min SLA Remaining` Label & Inconsistent `HH:MM:SS` vs. `MM:SS` Countdown Formats:**
   * On the primary card (`INC-2026-PALGHAR-01`), the left label reads `90-min SLA Remaining` while the live timer reads `00 : 17 : 57` (`HRS : MIN : SEC`)[cite: 32]. Labeling the field "90-min SLA Remaining" makes it appear that 90 minutes remain[cite: 32].
   * In the `ACTIVE INCIDENTS QUEUE` directly below, `INC-2026-RAIGAD-02` displays `41:07 SLA REM.` and `INC-2026-RATNAGIRI-03` displays `63:50 SLA REM.` (`MM:SS` format exceeding 60 minutes, instead of `01:03:50`)[cite: 32].
   * *Recommended Correction:* Rename the label to `Remaining SLA Window (90-Min Target)` and standardize all countdown timers across the page to `HH:MM:SS` (e.g., `00:17:57`, `00:41:07`, `01:03:50`)[cite: 32].
2. **[Medium | UI Defect] Raw Database Enum Badge (`DG_ADMIN`) Exposed in Banner:** The top blue clearance banner displays a monospace code pill `DG_ADMIN` on the right[cite: 32].
   * *Recommended Correction:* Format role badges using human-readable labels (`Tier 1: State DG Admin`) consistent with `Officer Profile`[cite: 16, 32].
3. **[Medium | RBAC Workflow Ambiguity] Collector Approval Sync Not Indicated on Rebuttal Card:** Blueprint Slide 6 (`fact_check_tickets: collector_approval`) and Slide 12 state that the District Collector (`District Collector, Palghar`) holds single-click rebuttal authority for district rumors, and the blue banner on Page 18 states *"Rebuttals authorized by local Collectors are indexed in real time"*[cite: 6, 12, 32]. However, `INC-2026-PALGHAR-01` shows `Authorize Official Rebuttal` without showing `Collector Approval Status` (e.g., `Pending Palghar Collector Approval` vs. `State DG Override`)[cite: 6, 12, 32].
   * *Recommended Correction:* Display the `collector_approval` status field from `fact_check_tickets` explicitly on each incident card[cite: 6, 32].

---

### Page 19: Districts (`36 Districts Administration & Performance Matrix`)[cite: 33]

#### Genuine Defects
1. **[Critical | Data Binding Defect] `Division` Column Hardcoded to `State Command` Instead of `Konkan`:** In both the `District Leaderboard` table and the `Top/Lower Five Matrix`, all five districts (`Thane`, `Raigad`, `Palghar`, `Ratnagiri`, `Sindhudurg`) have their `Division` listed as `State Command`[cite: 33, 35]. Per Blueprint Slide 9 (`कोकण विभाग बेसलाइन`) and the GIS map filter (`Konkan (5)`), these districts belong to `Konkan Division`[cite: 9, 33].
   * *Recommended Correction:* Map the `Division` column to the district's actual administrative division (`Konkan`) from the `districts` table[cite: 6, 9, 33].
2. **[Critical | Mathematical & Data Integrity Defect] Thane Sentiment Score (`21.75 / 25`) Contradicts Displayed `82%` Sentiment:**
   * Blueprint Slide 7 defines Media Sentiment points as $((\text{Net Sentiment Index} + 1.0) / 2) \times 25$, and Slide 9 gives Thane a Net Sentiment of $+0.740$, yielding $((0.740 + 1.0)/2) \times 25 = 0.87 \times 25 = 21.75$ points (which equals $87\%$)[cite: 7, 9].
   * On Page 19, the `CPI Score Decomposition — Thane` panel displays `21.75 / 25` (`3.25 pts lost`) alongside an `82%` badge and `82%` in the leaderboard table[cite: 33]. Furthermore, the decomposition footnote claims `4-Channel Mix: Print OCR 84% • Broadcast TV 82% • Twitter/X 79% • Social Relays 76%` (whose average is $80.25\%$, matching neither $82\%$ nor $21.75/25 = 87\%$)[cite: 33].
   * *Recommended Correction:* Reconcile the sentiment percentage and score calculation directly from `mv_district_daily_scores` so the displayed percentage and points out of 25 are mathematically consistent[cite: 6, 7, 33].
3. **[High | Chart Implementation Defect] Single-Series Bar Chart & Broken Legend Instead of Documented Stacked Bar Chart:**
   * Blueprint Slide 10 (`Zone 2`) and the card's own top-right subtitle specify `Stacked comparative bar charts & ranked tables`[cite: 10, 33]. Instead, the chart renders unstacked solid orange bars displaying only total CPI[cite: 33].
   * The legend displays `[Dark Blue] Selected District` and `[Orange] Top Quintile Districts`, but no bar is colored dark blue even though `Thane` is decomposed below and `Pune` is selected on the map[cite: 33].
   * *Recommended Correction:* Convert the ECharts instance into a 4-component stacked bar chart (`Volume`, `Speed/TAT`, `Sentiment`, `Crisis SLA` stacking up to `100`) or highlight the actively selected district bar in dark blue[cite: 7, 10, 33].
4. **[High | State & Scope Contradiction] `Showing: 5 / 5 Active Reporting Districts` While GIS Map Shows `Pune (DIO: Active)`:** The leaderboard table states `Showing: 5 / 5 Active Reporting Districts` (`Page 1 of 1`) containing only the 5 Konkan districts, while the adjacent `Maharashtra GIS Map` is focused on `District: Pune` with badge `DIO: Active` and `DIO Gateway: 24x7 Connected`[cite: 33]. Additionally, the `Top/Lower Five Matrix` tab `All (10)` only shows 5 rows, labeling `Ratnagiri` (`86.8` CPI) and `Sindhudurg` (`84.92` CPI) as `Lower Band`[cite: 33].
   * *Recommended Correction:* Synchronize the GIS Map selection with the Leaderboard/Decomposition selection, and if operating in Konkan Pilot Mode (5 districts), label the view `Konkan Division Pilot (5/36 Districts Active)` rather than claiming `5/5 Active` alongside an active Pune card[cite: 9, 33].
5. **[Medium | Text Truncation Defect] Truncated Labels in GIS Inspector Card:** Inside the `Maharashtra GIS Map` detail panel, the top label truncates as `DISTRICT LIVE ST...` and the officer name truncates as `Suhas R. Bhal...`[cite: 33].
   * *Recommended Correction:* Widen the right inspector column or stack label/value pairs vertically[cite: 33].

---

### Page 20: Command Centre (`DGIPR State Operational Command Deck`)[cite: 34]

#### Genuine Defects
1. **[Critical | Developer Artifact Leak] Wireframe Layout Instructions Rendered as Visible Section Headings:** The left and right column headers literally output **`MEDIA INGESTION & SENTIMENT (LEFT SECTION)`** and **`EXECUTIVE DIRECTIVES & BROADCAST (RIGHT SECTION)`** in the live UI[cite: 34].
   * *Recommended Correction:* Strip `(LEFT SECTION)` and `(RIGHT SECTION)` from the heading strings immediately[cite: 34].
2. **[High | Data & GIS Mismatch] Map Pin on `Pune`, Legend Says `Selected: Thane`, Officer `Suhas R. Bhalerao` Assigned to Both `Pune` and `Thane`:**
   * On the GIS map in the center column of `Command Centre`, the orange location pin is placed on **Pune** (shaded grey), while the map footer legend reads `Selected: Thane`[cite: 34].
   * In the `District Sub-Heads & Collectorates` card below the map, `Suhas R. Bhalerao, IAS` is listed as `District Collector & Magistrate` for **`Thane • Konkan Division`** (`+91 22 2534 4000`, `dio.thane@maharashtra.gov.in`)[cite: 34], whereas on Page 19 (`Districts`) `Suhas R. Bhalerao` was listed as the Liaison Officer for **`District: Pune`**[cite: 33].
   * *Recommended Correction:* Fix the GIS SVG pin coordinates for Thane and correct the district officer mapping table so each District Collector/DIO is mapped to a single accurate district[cite: 33, 34].
3. **[High | Component Duplication] Left Column is a 100% Duplicate of `Media Monitoring`:** The entire left section (`Newspaper Data & Print Clippings` and `TV Broadcast Monitoring`) is identical to the top half of Page 16 (`Media Monitoring`)[cite: 30, 34].
   * *Recommended Correction:* See Section 4 (`Evaluation of Proposed Removals & Consolidations`) for streamlining `Dashboard` vs. `Command Centre`[cite: 30, 34, 35].

---

### Page 21: Dashboard (`State Operations Overview` — Main 5-Zone View)[cite: 35]

#### Genuine Defects
1. **[High | Blueprint Wireframe Copy Leak] Section Header Literally Named `Main Panels: Leadership Overview`:** Halfway down Page 21, a divider heading reads `Main Panels: Leadership Overview`—a literal translation of the slide title from Blueprint Slide 11 (`मुख्य पॅनेल: नेतृत्व दृश्यावलोकन`)[cite: 11, 35].
   * *Recommended Correction:* Rename to an operational heading (e.g., `Statewide Coverage, GIS & Live Broadcasts`) or integrate with `Command Centre`[cite: 11, 35].
2. **[High | Information Architecture & Duplication] 100% Widget Duplication Across Child Routes Creating Excessive Vertical Scroll:** Page 21 stacks all 5 Zones from Blueprint Slide 10 (`KPI Ribbon`, `Emergency Alert`, `District Leaderboard`, `Live Media Ingestion`, `CPI Score Decomposition`) plus all 4 panels from Blueprint Slide 11 (`Top/Lower Five Matrix`, `Maharashtra GIS Map`, `Social Media Analysis`, `Live Event Streaming`) on a single long scrolling canvas[cite: 10, 11, 35]. Every widget below the fold is duplicated verbatim on `Districts` (Page 19), `Media Monitoring` (Page 16), and `Command Centre` (Page 20)[cite: 30, 33, 34, 35].
   * *Recommended Correction:* Keep `Dashboard` strictly focused on the **Blueprint 5-Zone Architecture** (Slide 10) so it fits cleanly within a single command-center screen without deep scrolling, and house the **Leadership Overview Panels** (Slide 11) in `Command Centre`[cite: 10, 11, 14, 34, 35].
3. **[Medium | UI Defect] Simulated Static Scrubber on `Live Event Streaming` Player:** The `Live Event Streaming` video player shows a `LIVE` badge (`CM Press Conference: State Ca...` truncated) with a static blue progress bar at ~65% completion and a non-playing dark canvas[cite: 35].
   * *Recommended Correction:* Use a live stream indicator (`LIVE • 01:42:23 Elapsed`) instead of a fixed VOD scrubber bar, and fix title truncation[cite: 34, 35].

---

## 4. Evaluation of Proposed Removals & Consolidations

| UI Element / Component | Location | Serves Essential Operational Purpose? | Evaluation & Recommendation |
| :--- | :--- | :--- | :--- |
| **`N` Floating Badge / Watermark** | Login footer & Top-right header[cite: 15, 16, 36] | **No** | Framework development artifact that overlaps header/footer chrome[cite: 15, 16, 36]. **Remove completely.** |
| **`(LEFT SECTION)` / `(RIGHT SECTION)` Header Text** | `Command Centre` (Page 20)[cite: 34] | **No** | Developer wireframe notes leaked into production headings[cite: 34]. **Remove parenthetical text.** |
| **5-Second Auto-Advancing Timer (`Timeline Timer: 5s Active`) & `Next Sequence ->` Button** | `Field Activities` (Page 15)[cite: 29] | **No** | Simulates a 6-hour daily cycle by stepping every 5 seconds, actively misleading operators about real-time workflow state[cite: 29]. **Remove the 5s carousel timer; retain the 6-stage workflow tracker driven by real-time timestamps.** |
| **In-Page 3-Card Navigation Switcher in `System Monitoring`** | Pages 3–11[cite: 17, 18, 19, 20, 21, 22, 23, 24, 25] | **No (Redundant)** | Duplicates the exact 3 child items already visible under `System Monitoring` in the left sidebar[cite: 17]. **Remove the oversized 3-card switcher or replace with a compact tab strip.** |
| **Pinned `Technical Payload & Checksum Verification Inspector` Across All 7 Telemetry Tabs** | Pages 5–11[cite: 19, 20, 21, 22, 23, 24, 25] | **Yes (For System Auditors), but misplaced** | Payload inspection is useful for debugging OCR/NLP ingestion, but pinning the identical 4-row JSON inspector to the bottom of all 7 tabs (`Database`, `Health`, `Audit`, `Logs`, `Filtration`, `Pipelining`, `Telemetry`) wastes 40% of the screen[cite: 19, 20, 21, 22, 23, 24, 25]. **Consolidate into a slide-over drawer or keep only on `Raw Ingestion` / `Telemetry`.** |
| **Animated Moving Packet Boxes (`OPTICAL DATA CONDUIT` / `Packet Feed`)** | Page 3, Page 9, Page 11[cite: 17, 23, 25] | **No** | Decorative animation (`PKT-5685`) that adds CPU load and visual clutter while duplicating the stage latency metrics already shown in the pipeline cards and gateway table[cite: 17, 23, 25]. **Remove decorative moving packet strips; preserve the stage latency/rate counters and gateway table.** |
| **Sub-Header Filter Bar (`Thane`, `Last 7 Days`, `Export Telemetry Report`) on `Officer Profile`** | Page 2[cite: 16] | **No** | Filtering by district/date and exporting telemetry has zero operational relevance on an account security and role settings page[cite: 16]. **Hide the operational sub-header on `Officer Profile`.** |