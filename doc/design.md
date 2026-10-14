Build a full, production-quality OFFICIAL GOVERNMENT PORTAL for the Maharashtra Directorate General of Information and Public Relations (DGIPR). It must look and feel like india.gov.in (the National Portal of India): formal, trustworthy, accessible, and bilingual (English + Marathi). The portal has a public-facing homepage AND a secured "DGIPR Command Center Dashboard" for officials.

=====================================================
PART 1: OFFICIAL PORTAL LOOK & FEEL (india.gov.in style)
=====================================================

- Top strip: Government of Maharashtra identity bar with the Ashoka emblem placeholder, "महाराष्ट्र शासन | Government of Maharashtra", language toggle (English / मराठी), text-size controls (A- A A+), high-contrast toggle, "Skip to main content" link, and a screen-reader access link.
- Header: DGIPR logo placeholder + title "Directorate General of Information & Public Relations, Maharashtra" + a search bar.
- Main navigation (mega-menu): Home | About DGIPR | Press Releases | Media Gallery | Schemes & Publicity | Fact Check | District Offices (DIO) | RTI & Citizen Charter | Contact | Officer Login.
- Hero section: rotating banner carousel of government announcements, with a "Latest Press Releases" ticker beside it.
- Quick-links grid of icon tiles: Press Releases, Fact Check, Flagship Schemes, District Information Offices, Media Accreditation, Tenders, Downloads, Helpline.
- "Citizen Services" and "Latest Updates" tabbed sections.
- A "Fact Check / Rumour Buster" public section listing official rebuttals.
- An interactive Maharashtra district map with all 34 districts, grouped into 6 divisions (Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, Nagpur), clickable to open a district page.
- Footer: Policies (Terms, Privacy, Accessibility Statement, Copyright, Hyperlinking policy), Help, Feedback, Sitemap, Visitor counter, "Last Updated" date, and the usual note on the website being owned by DGIPR.
- Design system:
  - Colours: deep navy (#1F2A44), government saffron accent (#FF9933), India green (#138808) for positive, ochre (#CC8A00) for processing/warning, red (#C0392B) for alerts, off-white background (#F6F5F0). Use sage green for positive indicators and ochre for processing states.
  - Fonts: Noto Sans + Noto Sans Devanagari (for Marathi). Use a clean, official typographic scale.
  - WCAG 2.1 AA accessible: keyboard navigation, ARIA labels, visible focus rings, alt text, sufficient contrast.
  - Fully responsive (mobile, tablet, desktop).
- All text must be available in English and Marathi (i18n with a language switcher).

=====================================================
PART 2: THE COMMAND CENTER DASHBOARD (secured, /command-center)
=====================================================
Purpose: shift DGIPR from scattered manual silos to centralized automated intelligence. It ingests regional media, extracts sentiment via OCR/NLP, and enforces crisis-response times for the Directorate General, Divisional Commissioners, and District Collectors.

Four core capability quadrants (show these as module cards/tabs):

1. MEDIA OPERATIONS: time-stamped logs of press releases, e-Paper clipping OCR tracking, press-briefing attendance.
2. SOCIAL MEDIA & DIGITAL: feeds from X, Facebook, Instagram and WhatsApp mapping output vs reach down to the taluka level.
3. FACT-CHECKING & CRISIS: ingest viral misinformation and log the precise Turnaround Time (TAT) from detection to publication of the official rebuttal.
4. FIELD PUBLICITY & IEC: GPS logs, photo proofs and coverage counts for mobile publicity vans and flagship scheme exhibitions.

KPI FRAMEWORK & TARGETS (show as gauge cards):

- Output Velocity: press releases issued within 60 min of an event. Target > 90% of events. (Source: DIO Portal / CMS logs)
- Media Uptake: share of releases printed by the top 5 dailies. Target > 70% placement rate. (Source: e-Paper OCR)
- Sentiment Index: ratio of positive to adverse news. Target Net Positive (> 65%). (Source: media monitoring engine)
- Crisis Response: time to issue a rebuttal on viral misinformation. Target < 90 minutes. (Source: verification workflow system)
  Gauge colours: green when the target is met, red when breached.

THE 100-POINT COMPOSITE DISTRICT INDEX (implement EXACTLY):

1. Volume (25 pts) = min(25, (Total Releases / 300) \* 25)
2. Speed / TAT (25 pts) = 25 if avg TAT <= 45 min; linear decrease to 0 at 120 min. Formula: 25 \* (120 - TAT) / 75, clamped to 0..25.
3. Media Sentiment (25 pts) = ((Net Sentiment Index + 1.0) / 2) \* 25, where sentiment is scored -1.0 to +1.0.
4. Crisis Containment SLA (25 pts) = (Rumors Refuted in < 90 mins / Total Rumors Ingested) \* 25
   Total Index = sum of the four pillars (0-100). Put this in a reusable, unit-tested scoring function. Make the SLA thresholds configurable by the State Admin.

PILOT SEED DATA (Konkan Division, Q3 2026). Seed the app with this exactly, so the index reproduces:
| Rank | District | Releases | Avg TAT | Sentiment | Crisis SLA | Index |
| 1 | Thane | 462 | 38.0m | +0.740 | 12/12 (100%) | 96.75 |
| 2 | Raigad | 295 | 46.2m | +0.710 | 8/9 (88.9%) | 92.78 |
| 5 | Ratnagiri | 224 | 53.0m | +0.660 | 6/7 (85.7%) | 83.18 |
Also generate realistic mock data for the remaining Konkan districts (ranks 3 and 4: e.g., Palghar, Sindhudurg, Mumbai City, Mumbai Suburban) and sample data for the other 5 divisions, so the leaderboard is fully populated. Add a "Why this district wins/loses" explanation panel (e.g., "Thane's sub-45-minute TAT captures the full 25 Speed points while maintaining a flawless 100% Crisis SLA. Ratnagiri loses points on a 53-minute average TAT and missing the 90-minute crisis window on 1 incident.").

THE 5 UI ZONES (one-page responsive layout, built with Tailwind + ECharts):

- ZONE 1, METRICS RIBBON: 4 live counters: Total Releases (462), Div Avg TAT (38.0m), Net Sentiment % (+0.740), Misinfo Tickets (12). Animate count-up, with a small trend arrow.
- ZONE 2, LEADERBOARD: stacked comparative bar chart (one stack segment per pillar) plus a ranked table (Rank, District, Score, Status, chevron). Clicking a row opens a drill-down modal with the pillar breakdown and historical trend chart.
- ZONE 3, PILLAR SCORE: grouped bar chart isolating point losses per pillar (Volume vs Speed vs Sentiment vs Crisis) for a selected district, to identify areas of improvement.
- ZONE 4, LIVE INGESTION STREAM: auto-scrolling feed of OCR newspaper clippings in Marathi/English with headline, source, timestamp (e.g., 03-2023, 3:33 AM) and a sentiment tag: green "+ Positive", grey "Neutral", red "- Negative". Simulate new items arriving every few seconds. Pause on hover.
- ZONE 5, EMERGENCY ALERTS: flashing high-priority cards for pending rumours: "Pending Rumor: District B, 00:02:34, HIGH PRIORITY", each with a live countdown timer toward the 90-minute SLA, and an action button ("Draft Rebuttal" / "Approve").
  Global filters: Division, District, Date range, Source (Print / Social / Field).

ROLE-BASED ACCESS CONTROL (mock login with 3 demo users and JWT-style sessions):
| Capability | DG State Admin | District Collector | DIO Desk |
| Global view | All 34 districts | District only | District only |
| Configure SLAs | Yes | No | No |
| Authorize rebuttals | Yes | Single-click approve | Submit for approval |
| Data entry | Read-only | Read-only | Full entry and photo uploads |
Enforce district-boundary validation on all create/update actions. Hide or disable the UI per role.

DATA MODEL (PostgreSQL / Supabase tables):

- districts & administrative_departments (geographic and hierarchical metadata: division, district, taluka)
- press_releases (draft, event timestamp, publish time, turnaround_time_minutes)
- media_clippings (FK to district/release, OCR text, URL, source, sentiment_score -1.0 to +1.0)
- fact_check_tickets (incident log, verification status, collector approval flag, resolution_time_minutes, detected_at, rebutted_at)
- Materialized view mv_district_daily_scores: aggregates daily scores across districts, releases, clippings and fact checks, refreshed every 15 minutes so the dashboard loads instantly with no runtime table scans.

SYSTEM ARCHITECTURE (5 layers):

1. Ingestion: DIO CMS / field mobile entry form, regional e-Paper scrapers (simulated), social media API connectors (simulated).
2. API & Queue: async REST API + a task queue.
3. Processing & Intelligence: OCR (Marathi + Hindi + English) and a multilingual sentiment pipeline (simulate with a mock service if real models are not available).
4. Persistence & State: Postgres with time-series tables, plus pub/sub for real-time alerts over WebSockets/realtime subscriptions.
5. Presentation: the dashboard UI.

DIO DATA-ENTRY SCREENS (for the DIO Desk role):

- "New Press Release" form (event time, publish time, auto-calculated TAT)
- "Upload Clipping" form (image upload, OCR text preview, sentiment auto-suggest)
- "Log Rumour" form (source URL, detected time) and a "Publish Rebuttal" action that stops the SLA timer
- "Field Publicity" form (GPS location, photo proof, coverage count)

EXTRAS:

- "Download Weekly Briefing PDF" button that generates a formatted PDF of the leaderboard, KPIs and alerts.
- Dark/light toggle inside the dashboard only; the public site stays light.
- Loading skeletons, empty states, and error states throughout.
- Tooltips explaining each score formula.

=====================================================
DELIVERABLES / DEFINITION OF DONE
=====================================================

- Public portal pages + secured Command Center fully navigable and responsive.
- Marathi/English switch works on all pages.
- Scoring function reproduces 96.75 / 92.78 / 83.18 for Thane / Raigad / Ratnagiri.
- All 5 zones working with live-simulated data and filters.
- RBAC demonstrably different across the 3 demo roles.
- Clean, commented code and a README with setup steps and demo credentials.
  Build it in stages: (1) public portal shell, (2) database and seed data, (3) scoring engine, (4) dashboard zones, (5) auth/RBAC, (6) PDF export. Ask me before making any big assumption.
