# Maha-Command Center — Strict Minimalist Frontend Redesign

## 1. Role and Objective

Act as a Principal Frontend Architect and Senior Enterprise UI/UX Designer specializing in government administration systems, KPI dashboards, information intelligence platforms, and high-density operational interfaces.

Redesign the existing `mcc_code.html` into a professional, minimalist dashboard for the **Maha-Command Center, Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra**.

The attached Maha-Command Center Blueprint is the authoritative reference for product functionality, dashboard architecture, metrics, and role permissions. The existing HTML is the reference for the current implementation and interactions.

This is a **structured redesign of an existing product**, not an opportunity to invent a new dashboard.

### Primary objective

Build a restrained, data-first government operations dashboard that communicates:

- Statewide publicity and press-release performance.
- Comparative performance across the 36 District Information Offices.
- District-level Composite Performance Index (CPI) and score decomposition.
- Active misinformation incidents and their SLA countdowns.
- Live-updating OCR media ingestion.
- Geographic, social-media, and live-event monitoring.

The final design must feel like a mature public-sector enterprise application, not a generic AI-generated admin template, a cybersecurity terminal, or a futuristic command-center concept.

**The information architecture is fixed. Improve the visual design and implementation without changing the five-zone structure.**

---

## 2. Fixed Application Layout

Implement the following structure in the specified order. Do not invent alternative dashboard layouts.

### A. Application shell

Use a compact, persistent header and a restrained left navigation sidebar.

**Header — approximately 56–64 px high**

Left:
- Maharashtra Government / DGIPR text identity.
- Product name: Maha-Command Center.
- Optional concise subtitle: State Information Operations.

Right:
- Last successful data synchronization time.
- Manual refresh action.
- User role selector.
- English/Marathi language selector.
- User profile menu.

Do not display duplicate role labels, redundant connection indicators, or multiple rows of technical telemetry.

**Navigation — approximately 208–224 px wide on desktop**

Retain these documented operational destinations:

1. Command Overview
2. Media Surveillance
3. Narrative & Sentiment
4. Misinformation & Fact-Checking
5. District Operations
6. Press Releases & Briefings
7. Audit & Telemetry

Use small, consistent monochrome icons, concise labels, and one understated selected state. The navigation should support collapse on smaller screens.

Do not duplicate division filters in the navigation. Keep geographic scope selection in the dashboard toolbar.

### B. Dashboard toolbar

Immediately below the application header, use one compact toolbar containing:

- Page title: **Statewide Operations Overview**
- Geographic scope selector: All Maharashtra / administrative division / permitted district
- Optional supported reporting-period filter
- Last synchronization status, if not already adequately communicated in the header

Avoid a second decorative title, excessive breadcrumbs, large banners, and unnecessary system-health cards.

---

## 3. Mandatory Five-Zone Dashboard Architecture

Use a fixed 12-column desktop grid.

Zone 1 spans the full content width.

Below Zone 1, use a two-column workspace:

- **Left workspace:** 8 of 12 columns, approximately 67% width.
- **Right workspace:** 4 of 12 columns, approximately 33% width.

Keep the zone order and spatial relationships fixed.

| Position | Zone | Required content |
|---|---|---|
| Full width, top | Zone 1 — KPI Ribbon | Four statewide KPI metrics |
| Left, upper | Zone 2 — District Leaderboard | Comparative chart and ranked district table |
| Left, lower | Zone 3 — Score Decomposition | Selected district's CPI breakdown |
| Right, upper | Zone 5 — Emergency Alert | Active misinformation incidents |
| Right, lower | Zone 4 — Live Ingestion | OCR media surveillance feed |

Do not turn these zones into multiple overlapping layers of cards. Use shared surfaces, clear headings, consistent spacing, and appropriately sized internal content.

The desktop workspace should be compact enough to make the relationships between statewide KPIs, district performance, and active incidents immediately apparent.

---

## 4. Zone 1 — Four Core KPI Cards

Display exactly four primary KPI cards in a single row on sufficiently wide screens.

1. **Total Releases:** press-release volume and reach where available.
2. **Average TAT:** average turnaround time and SLA performance.
3. **Sentiment Index:** public media sentiment percentage or documented index.
4. **Misinformation Tickets:** active or pending crisis and fact-checking cases.

Each card should contain only:

- A concise metric label.
- One prominent primary value.
- One relevant target, comparison, or supporting statistic.
- A restrained indicator of performance against the applicable benchmark.

### Strict rules

- Use equal card heights and consistent internal alignment.
- Use moderate numeric typography, not oversized display numbers.
- Avoid unnecessary icons, multiple progress bars, decorative dots, and repeated subtitles.
- Show a trend only when the underlying comparison data exists.
- Identify the comparison period and applicable target.
- Do not add additional statewide KPI cards.
- Preserve the documented distinction between volume, turnaround time, sentiment, and crisis response.

The KPI ribbon is a summary, not the entire dashboard. Detailed analysis belongs in Zones 2 and 3.

---

## 5. Zone 2 — District Leaderboard and Comparative Performance

This is the primary analytical workspace and must occupy the larger left column.

### Required layout

Place a compact comparative performance chart above or alongside the ranked table, according to the available width. Keep the table as the main interaction surface.

The table should retain these data fields:

- Rank
- District
- Division
- Releases
- Average TAT
- Sentiment
- Crisis SLA
- Composite Performance Index
- Action

### Required interactions

- Search districts.
- Filter by administrative division.
- Sort supported numerical columns.
- Select a district for score inspection.
- Clearly identify the active selection.
- Display an accurate filtered-result count.
- Preserve a responsive, horizontally usable table.

Use right-aligned numerical columns, consistent units, subtle row separators, compact controls, and readable column headings.

Do not use thick borders around every cell. Avoid oversized action buttons and excessive uppercase typography.

### District extremes

Preserve the blueprint's Top/Lower Five Matrix for district ranking, event coverage, and specific-news coverage extremes.

Keep this separate from the CPI ranking conceptually, but do not create another oversized leaderboard. Use a compact comparison view, tabs, or an equivalent restrained presentation in the leadership overview.

Do not fabricate missing district records to make the table appear complete. Clearly distinguish available demonstration records from a verified 36-district dataset.

---

## 6. Zone 3 — CPI Score Decomposition

Show the selected district's Composite Performance Index, its constituent scores, and where points have been lost.

The blueprint specifies four equally weighted components:

- Volume: 25 points.
- TAT / dispatch speed: 25 points.
- Media sentiment: 25 points.
- Crisis SLA: 25 points.

### Documented scoring rules

Preserve these rules when rendering or validating existing calculations:

**Volume score**

`min(25, (Total Releases / 300) × 25)`

**Sentiment score**

`((Net Sentiment Index + 1) / 2) × 25`

**Crisis SLA score**

`(Rumors refuted within 90 minutes / Total Rumors) × 25`

**TAT score**

- 0–45 minutes: full 25 points.
- 45–120 minutes: linear score degradation.
- 120 minutes and above: 0 points.

Follow the implementation's established rounding, boundary conditions, and handling of missing values rather than silently introducing a new formula.

### Visual treatment

Use four compact horizontal bars or a restrained grouped-bar visualization.

Display:
- Component name.
- Earned points out of 25.
- Relevant raw metric.
- Applicable penalty or performance gap.

Show the selected district's name, CPI score out of 100, and rank.

Keep the diagnostic explanation concise and evidence-based. If an operational recommendation is displayed, derive it from the actual available metrics and existing rules.

Do not use four oversized circular charts or elaborate gauges.

---

## 7. Zone 5 — Emergency Alert and Crisis Monitor

Position the emergency module at the top of the right-hand column.

It must provide rapid access to the information needed to understand and manage an active misinformation incident.

### Required content

- Incident identifier.
- Incident summary.
- Source or channel, when available.
- Verification status.
- Severity.
- Remaining SLA time.
- Evidence inspection.
- Spread or timeline inspection.
- Official rebuttal authorization, subject to the documented role permissions.

Keep the highest-priority incident visually prominent, with secondary monitored threads presented as compact rows underneath.

The countdown must correspond to the selected incident's actual SLA data. Do not use fabricated changing values to imitate live operations.

### Visual treatment

Use monochrome severity labels, clear typography, recognizable icons, and restrained emphasis.

A critical alert may have a strong dark border or a stronger heading, but it must not dominate the entire screen.

No red alert banners, constant flashing, pulsing graphics, or theatrical warning effects.

**Preserve the workflow defined in the blueprint.** Do not grant authorization merely because a button is visible. Where the documented role matrix specifies single-click authorization, preserve that behavior unless the existing implementation establishes a different workflow.

---

## 8. Zone 4 — OCR Media Ingestion Feed

Position the OCR feed beneath Zone 5 in the right-hand column.

Present a compact, vertically scannable stream of newspaper and electronic-media records.

Each record should display, where available:

- Publication or source.
- Timestamp.
- Extracted headline or relevant text.
- Associated district.
- Sentiment classification.
- OCR confidence.
- Processing latency.

Retain the documented sentiment filter options:

- All
- Positive
- Negative
- Neutral

Keep the feed's update state and manual refresh or OCR insertion action in a compact heading row.

New records should appear without forcing the user's current reading position to jump. Automatic scrolling should not interfere with inspection or filtering.

Clearly distinguish demonstration data from real incoming records. A manually inserted sample must not be represented as a verified live news item.

Use subtle horizontal separation between entries instead of a nested card for every item.

---

## 9. Leadership Overview — Secondary Monitoring Workspace

After the five-zone operational workspace, create one secondary section containing the four leadership-overview panels defined in the blueprint.

Use a strict two-column grid on desktop. These panels should have less visual prominence than the five primary zones.

### Panel 1 — Top/Lower Five Matrix

Summarize district extremes in event coverage and specific-news coverage.

Use a compact table or comparative visualization. Do not simply duplicate the CPI leaderboard.

### Panel 2 — Social Media Analysis

Provide separate analysis streams for the documented social-media platforms:

- X/Twitter.
- Facebook.
- Instagram.
- YouTube.
- LinkedIn.

Also retain WhatsApp-related records when supported by the existing implementation and available data.

Present available engagement, organic reach, reel completion, and taluka-level engagement measures in a compact analytical layout.

Do not create an independent oversized card for every social platform.

### Panel 3 — Maharashtra GIS Map

Provide the documented interactive Maharashtra map for all 36 District Information Offices.

Required interactions:
- District hover or selection.
- District name and DIO status.
- Access to the permitted district-level information.
- Consistent integration with geographic filters and district selection wherever supported.

Use accurate boundary data if available. If the supplied map is schematic, label it appropriately.

Do not invent district boundaries, live locations, incident markers, or statuses.

### Panel 4 — Live Event Streaming

Provide a unified monitoring area for Chief Minister's events across the documented sources:

- YouTube.
- Facebook.
- Instagram.
- Television news channels.

Use actual available stream previews, links, and source metadata. If a source is unavailable or a live integration does not exist, present a clear empty or unavailable state instead of a fake video player.

Keep this module compact and visually subordinate to the primary KPI and incident workspace.

### Four documented data pillars

Preserve the blueprint's functional categories:

1. Print and electronic media.
2. Social media and digital.
3. Fact-checking and crisis.
4. Field publicity and Information, Education and Communication (IEC), including GPS logs, mobile van routes, and street-play coverage.

Use them as meaningful categories within the relevant monitoring views. Do not convert them into another row of large dashboard cards.

---

## 10. Strict Monochrome Design System

Use a **light-first, grayscale-only interface** appropriate for a Maharashtra government administrative system.

### Design tokens

| Token | Value | Usage |
|---|---|---|
| Page background | `#F5F6F7` | Main application canvas |
| Primary surface | `#FFFFFF` | Main panels |
| Secondary surface | `#F0F1F3` | Filters and subtle grouping |
| Selected surface | `#E7E9EC` | Selected row or navigation state |
| Primary text | `#202124` | Headings and key values |
| Secondary text | `#5F6368` | Descriptions and secondary metrics |
| Muted text | `#80868B` | Supporting metadata |
| Standard border | `#DADCE0` | Controls and panel boundaries |
| Subtle divider | `#E8EAED` | Internal separation |
| Primary action | `#303134` | Main buttons and key actions |
| Inverse text | `#FFFFFF` | Text on dark surfaces |

Implement these tokens centrally using CSS custom properties or the project's existing design-token system.

### Non-negotiable visual rules

- No colored accents.
- No gradients.
- No glassmorphism.
- No neon.
- No glows or decorative grid backgrounds.
- No colored status badges.
- No excessively rounded cards.
- No excessive shadows.
- No decorative animation.
- No thick borders around every element.
- No excessive uppercase labels or letter spacing.

Use grayscale intensity, concise status text, accessible iconography, and border emphasis to communicate state.

Charts should use distinct gray shades, gridlines, marker shapes, labels, or line patterns. Do not use red/green chart series.

The UI must remain understandable without relying on color.

---

## 11. Typography, Spacing, and Component Rules

Use Noto Sans or another professional, compact sans-serif with proper Marathi glyph support.

Use monospaced typography only where it improves readability for timestamps, identifiers, or technical metadata.

### Strict spacing system

Use a consistent 4 px base spacing scale, with common intervals such as 8, 12, 16, 24, and 32 px.

Recommended defaults:

- Main content gutter: 20–24 px on desktop.
- Gap between major zones: 16 px.
- Panel padding: 16 px.
- Compact control height: 32–36 px.
- Standard button height: 36–40 px.
- Small corner radius: approximately 4–6 px.
- Table rows: approximately 40–44 px.

These are defaults, not reasons to introduce fixed dimensions that break responsive behavior.

### Component hierarchy

Use consistent styles for:
- Panel headings.
- KPI values and labels.
- Tables and table controls.
- Filters and search fields.
- Status indicators.
- Progress bars.
- Chart containers.
- Alert summaries.
- Feed records.
- Modals and notifications.

A module's structure should communicate its purpose. A data table should look like a data table; an emergency alert should look like an actionable incident summary; a chart should be presented as analytical content.

Do not wrap every element inside multiple nested background surfaces.

---

## 12. Role-Based Access and Information Architecture

Preserve the authorization matrix defined in the blueprint.

| Role | Global leaderboard | Crisis authorization | Local data entry |
|---|---|---|---|
| DG State Admin | Yes | Yes | No |
| District Collector | No unrestricted global view; permitted filtered view | Yes, single-click as documented | No |
| DIO Desk | No | No | Yes, local only |

The role selector should update the interface to reflect the permitted view and available actions.

Do not treat a hidden button or client-side role selector as genuine security enforcement. Actual authentication, district-level restrictions, and authorization must be enforced by the backend.

Use the documented authentication architecture when working inside the production application. Do not invent permissions or expose restricted district data through frontend interactions.

---

## 13. Technical Implementation

The blueprint specifies a responsive **Next.js + Tailwind CSS frontend**, ECharts integration, district-filter views, and data visualizations connected to PostgreSQL materialized views.

Apply those choices when modifying the actual Next.js application.

However, the supplied artifact is `mcc_code.html`. Inspect the existing project before selecting an implementation path:

- If the target is the standalone HTML prototype, redesign and preserve that file without forcing a framework migration.
- If working in the existing Next.js project, implement the same fixed five-zone architecture using the project's conventions, Tailwind CSS, and ECharts where appropriate.
- Do not introduce a new build system or major dependencies only to achieve a visual redesign.
- Do not recreate already-working functionality as static mockups.
- Do not replace functional charts, filters, or handlers with decorative controls.

Preserve existing DOM IDs, calculations, event handling, data structures, and dependencies where they are still relevant. Refactor when necessary, but avoid breaking functional interactions.

### Data-integrity rules

The dashboard may contain demonstration data.

- Do not invent the missing districts in a partial dataset.
- Do not fabricate live telemetry, incidents, news, geographic events, or performance improvements.
- Do not claim actual NIC integration, secure connectivity, or successful backend synchronization without evidence.
- Do not silently change score formulas or operational thresholds.
- Clearly label simulated or unavailable feeds.
- Preserve the distinction between actual measurements and TAT simulation results.

---

## 14. Responsive Behavior

Follow the same five-zone information hierarchy across viewport sizes.

**Desktop — 1440 px and above**

- Compact navigation and header.
- Four KPI cards in a single row.
- Two-column workspace with the prescribed zone arrangement.
- Secondary leadership panels in a two-column grid.

**Tablet — around 768–1024 px**

- Reduce unnecessary sidebar width.
- Keep KPI cards in a two-column grid when needed.
- Stack or rebalance the main zones when the prescribed 8:4 desktop split becomes too narrow.
- Retain the importance hierarchy and clear zone headings.

**Mobile — around 390 px**

- Use compact navigation or an accessible menu.
- Stack the KPI cards.
- Stack the five zones in a logical sequence while keeping the emergency alert easy to access.
- Make dense tables horizontally scrollable within their own container.
- Keep actions, filters, and incident details usable without horizontal page overflow.

Do not make the header, navigation, or panel widths collide. Avoid excessive use of fixed positioning.

---

## 15. Anti-Patterns: Explicitly Forbidden

Do not:

- Rearrange the dashboard into a different architecture.
- Add KPI cards beyond the four documented primary counters.
- Add large decorative headers or welcome banners.
- Turn every metric into a circular gauge.
- Use terminal-style uppercase labels throughout.
- Add arbitrary charts without clear units or analytical value.
- Add artificial real-time timestamps.
- Add excessive status LEDs and animated indicators.
- Add multiple layers of cards within each panel.
- Repeat the same data in multiple large components.
- Add fake streaming video, invented social-media posts, or fictional live incidents.
- Invent government seals or claim official certification.
- Introduce new modules not supported by the blueprint or existing implementation.
- Remove required blueprint modules merely to simplify the design.

**Minimalism must come from a strict hierarchy, restrained typography, consistent spacing, and purposeful component design—not from removing required functionality.**

---

## 16. Implementation and Validation Checklist

Work in this order:

1. Inspect the complete existing source and identify all functional controls and calculations.
2. Map existing elements to the five prescribed zones and the four leadership overview panels.
3. Define and apply the monochrome design tokens.
4. Redesign the application shell and dashboard toolbar.
5. Implement the four-card KPI ribbon.
6. Refine the district leaderboard and comparative chart.
7. Synchronize district selection with CPI score decomposition.
8. Refine crisis monitoring and the OCR feed.
9. Implement the secondary leadership panels.
10. Apply the documented role-based interface permissions.
11. Test layout responsiveness and all retained interactions.
12. Remove obsolete styling, duplicate controls, misleading statuses, and unnecessary decorative markup.

### Final acceptance criteria

The implementation is complete only when:

- The exact five-zone desktop structure is followed.
- The four primary KPI cards are preserved.
- The four leadership overview panels remain available.
- The interface uses the prescribed monochrome palette.
- District selection, ranking, filtering, and score decomposition remain synchronized.
- TAT scoring follows the documented thresholds.
- The crisis monitor and OCR feed preserve their functional behavior.
- Role-based views reflect the documented permission matrix.
- The interface works on desktop, tablet, and mobile.
- Existing functionality is preserved or explicitly identified as unavailable.
- The layout contains no overlapping panels, accidental horizontal page overflow, or excessive nested containers.

**Modify the existing frontend and deliver the finished implementation. Do not return only a design proposal, wireframe, or list of recommendations.**

The desired outcome is a disciplined, minimal, and credible Maharashtra government KPI dashboard whose structure follows the blueprint exactly.