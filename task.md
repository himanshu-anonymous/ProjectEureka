# Maha-Command Center — Project Implementation Roadmap (`task.md`)

**Client / Authority**: Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra  
**System**: State Information Operations & Crisis Command Center Portal  
**Document Mandate**: Complete Phase-by-Phase Task Breakdown for Minimal, Low-Cognitive-Load Enterprise Refinement, Google Material SVG Migration, and Accessibility Hardening  
**Status**: Ready for Execution  

---

## Completed Baseline Phases (Summary)
- [x] **Initial Foundation & Layout Scaffolding**: 11 core routes (`/`, `/command-center`, `/districts`, `/press-releases`, `/media`, `/activities`, `/crisis`, `/reports`, `/notifications`, `/profile`, `/login`) and Next.js 14 App Router setup.
- [x] **Master Audit Plan (`changes.md`)**: Comprehensive 9-section architecture, dependency graphs, and remediation register.
- [x] **Core Responsive Shell**: Slide-over mobile drawer navigation, hamburger toggle in header, and responsive breakpoint adjustments.
- [x] **Crisis Telemetry & SLA Desk**: 90-minute SLA timer, ground evidence inspection drawer, and Collector rebuttal authorization.
- [x] **Real 36-District GIS Integration**: SVG vector map powered by `maharashtraGeo.generated.ts`, division clusters, and store sync.
- [x] **Semantic Chart Palette**: ECharts bar and velocity charts aligned to institutional palette (Emerald positive, Slate neutral, Red negative).
- [x] **Dynamic Leadership Matrix & Sortable Leaderboard**: Multi-column sorting in `DistrictTable.tsx` and dynamic store computation in `TopLowerMatrix.tsx`.
- [x] **Portal Screens Polish**: Press release drafting modal, reports generator dialog, and archival vault modal.

---

## NEW IMPLEMENTATION: Enterprise UI Refinement, Information Simplification & Google Material SVG Migration

---

### Major Task 1: Wireframe Artifact De-Cluttering & Symbol Normalization
*Objective*: Eliminate all leftover AI wireframe badges (`ZONE X`), remove artificial numbered prefixes (`1. `, `2. `, `3. `, `4. `) from headings, remove ornamental border stripes, and replace raw Unicode characters with semantic SVG/HTML elements.

- [x] **Task 1.1: Remove Wireframe Zone Badges from Dashboard Headers**
  - **Files**:
    - `src/components/zones/KPIRibbon/KPIRibbon.tsx`
    - `src/components/zones/ScoreDecomposition/ScoreDecomposition.tsx`
    - `src/components/zones/OCRFeed/OCRFeed.tsx`
    - `src/components/zones/EmergencyAlert/EmergencyAlert.tsx`
    - `src/lib/translations.ts`
  - **Details**:
    - Remove `ZONE 1` badge element `<span className="...">{t.zone1.zoneLabel}</span>` from `KPIRibbon.tsx`.
    - Remove `ZONE 3` badge element `<span className="...">{t.zone3.zoneLabel}</span>` from `ScoreDecomposition.tsx`.
    - Remove `ZONE 4` badge element `<span className="...">{t.zone4.zoneLabel}</span>` from `OCRFeed.tsx`.
    - Remove `ZONE 5` badge element `<span className="...">{t.zone5.zoneLabel}</span>` from `EmergencyAlert.tsx`.
    - Elevate section titles (`Statewide Key Performance Indicators`, `Communication Performance Index (CPI) Breakdown`, `Live Media & OCR Ingestion Ticker`, `Crisis Escalation & SLA Alert Desk`) with clean, bold text.
  - **Verification**: Zero `ZONE X` badges appear anywhere on the dashboard.

- [x] **Task 1.2: Remove Artificial Numbered Prefixes from Headings**
  - **Files**:
    - `src/components/commandCenter/left/NewspaperDataSection.tsx`
    - `src/components/commandCenter/left/TVChannelDataSection.tsx`
    - `src/components/commandCenter/left/SocialMediaDataSection.tsx`
    - `src/components/departments/DepartmentPressReleases.tsx`
    - `src/components/departments/DepartmentPhotographs.tsx`
    - `src/components/departments/DepartmentVideos.tsx`
    - `src/components/departments/DepartmentEmptySlot.tsx`
  - **Details**:
    - Change `1. Newspaper Data & Print Clippings` -> `Newspaper Data & Print Clippings`.
    - Change `2. TV Channel Broadcast Data` -> `TV Broadcast Monitoring`.
    - Change `3. Social Media Data Analysis` -> `Social Media Ingestion & Velocity`.
    - Change `1. Official Press Releases` -> `Official Press Releases`.
    - Change `2. Event Photographs Gallery` -> `Event Photographs`.
    - Change `3. Official Videos & Documentaries` -> `Video Briefings & Coverage`.
    - Change `4. Government Resolutions (GR) & Gazette Archival Vault` -> `Gazette & Resolution Archival Vault`.
  - **Verification**: Headings present clear professional titles without scaffolding numbers.

- [x] **Task 1.3: Eliminate Raw Unicode Symbols Used as UI Elements**
  - **Files**:
    - `src/components/commandCenter/center/DIODataDrawer.tsx`
    - `src/components/commandCenter/left/SocialMediaDataSection.tsx`
    - `src/components/commandCenter/right/LeadershipMessagesSection.tsx`
    - `src/components/leadership/LiveStreaming/LiveStreaming.tsx`
    - `src/components/portal/ProfileScreen.tsx`
  - **Details**:
    - In `DIODataDrawer.tsx` line 86: Replace `● {dioInfo.localAlerts} Active` with a structured red indicator `<span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mr-1" />`.
    - In `SocialMediaDataSection.tsx` line 24: Replace `▲ Peak Surge Alert` in chart tooltip with clean text badge `[Peak Surge Alert]`.
    - In `LeadershipMessagesSection.tsx` line 47: Replace `● {msg.priority}` with a styled semantic priority pill.
    - In `LiveStreaming.tsx` line 148: Replace `● {chan.label}` with an SVG broadcast indicator.
    - In `ProfileScreen.tsx` line 233: Replace `'Preferences Saved ✓'` with a Google Material SVG checkmark icon next to `'Preferences Saved'`.
  - **Verification**: Codebase grep confirms zero non-standard Unicode symbols (`●`, `▲`, `✓`) in UI strings.

- [x] **Task 1.4: Normalize Card Borders and Remove Ornamental Stripes**
  - **Files**:
    - `src/components/zones/KPIRibbon/KPICard.tsx`
    - `src/components/zones/ScoreDecomposition/ScoreDecomposition.tsx`
    - `src/components/zones/EmergencyAlert/EmergencyAlert.tsx`
    - `src/components/zones/EmergencyAlert/PrimaryIncidentCard.tsx`
    - `src/components/portal/LoginScreen.tsx`
    - `src/components/layout/Header.tsx`
  - **Details**:
    - In `KPICard.tsx`: Remove `border-l-4 border-l-gov-primary`; replace with standard `border border-slate-200`. Remove `hover:shadow-md transition-shadow`.
    - In `ScoreDecomposition.tsx`: Remove `border-t-4 border-t-gov-accent`; standardize to `border border-slate-200`.
    - In `EmergencyAlert.tsx`: Remove `border-t-4 border-t-red-700`; standardize to `border border-red-200`.
    - In `PrimaryIncidentCard.tsx`: Remove `border-l-4 border-l-red-700`; use clean 1px border.
    - In `LoginScreen.tsx`: Remove `border-t-4 border-t-gov-accent` and heavy `shadow-lg`; standardize to `border border-slate-300 shadow-sm`.
    - In `Header.tsx`: Remove `border-b-2 border-gov-accent`; standardize to clean subtle border.
  - **Verification**: Clean, uniform 1px border language across all containers; zero decorative color bands.

---

### Major Task 2: Card Architecture & Information-Density Simplification
*Objective*: Refactor 22 card components to follow the strict 3-tier structure: (1) Short descriptive title, (2) Primary metric/status in high-contrast tabular typography, (3) Single supporting context label only when necessary. Eliminate redundant metadata and paragraphs.

- [x] **Task 2.1: Simplify Statewide KPI Cards (`KPICard.tsx`)**
  - **File**: `src/components/zones/KPIRibbon/KPICard.tsx`
  - **Details**:
    - Remove the blue background box from the icon; render icon in neutral slate with 16px size.
    - Title: Short descriptive title (e.g., `Total Dispatches`, `Average TAT`, `Net Sentiment`, `Active Rumors`).
    - Primary Metric: Large 24px font in high-contrast slate-900 with monospace numbers.
    - Supporting Label: Simplify footer to target pill (e.g. `Target Met`) and trend pill (e.g. `↓ 12%`).
  - **Verification**: Clean 3-tier hierarchy; zero shadow jumping on hover.

- [x] **Task 2.2: Simplify Crisis & SLA Incident Cards**
  - **Files**:
    - `src/components/zones/EmergencyAlert/PrimaryIncidentCard.tsx`
    - `src/components/zones/EmergencyAlert/IncidentList.tsx`
    - `src/components/portal/CrisisScreen.tsx`
  - **Details**:
    - In `PrimaryIncidentCard.tsx`: Condense header to `[INC-8841] Critical SLA — Nashik`. Keep summary claim clear. Render SLA countdown prominently. Retain expandable evidence and timeline drawers without redundant animations.
    - In `IncidentList.tsx`: Reduce secondary incident card padding from `p-3` to `p-2.5`; display single-line truncated claim and remaining SLA timer.
    - In `CrisisScreen.tsx`: Standardize the 3 top metric cards. Shrink oversized 32px icons to 20px. Condense multi-word subtitles (`Refuted within target time`) into concise 2–3 word status labels (`Within Target`, `In Triage`, `Dispatched`).
  - **Verification**: All crisis cards communicate immediate threat level, remaining SLA, and action controls within 2 seconds of scanning.

- [x] **Task 2.3: Streamline OCR Feed & News Clipping Cards**
  - **Files**:
    - `src/components/zones/OCRFeed/OCRFeedItem.tsx`
    - `src/components/zones/OCRFeed/OCRFeed.tsx`
  - **Details**:
    - In `OCRFeedItem.tsx`: Remove redundant string `AI Conf:` and replace with clean `92% match`. Remove `scan` suffix from latency metric.
    - Simplify sentiment pill from `Positive Sentiment` to concise `Positive` or `Negative`.
    - Truncate headlines cleanly at 2 lines with proper leading.
  - **Verification**: OCR items present clean publisher, district, timestamp, headline, and sentiment pill without visual noise.

- [x] **Task 2.4: Streamline Score Decomposition Bars (`ScoreMetricBar.tsx`)**
  - **File**: `src/components/zones/ScoreDecomposition/ScoreMetricBar.tsx`
  - **Details**:
    - Remove blue icon container; align icon cleanly with metric title.
    - Consolidate row layout: Title + Subtitle | Score `21 / 25` | Raw Value `1,248 releases` | Gap `Gap: -4`.
    - Keep progress bar track at clean 6px height with smooth rounded ends.
  - **Verification**: 4 constituent scores align into a scannable tabular progress ledger.

- [x] **Task 2.5: Streamline Workflow Checkpoint Cards (`WorkflowStepCard.tsx`)**
  - **File**: `src/components/workflow/WorkflowStepCard.tsx`
  - **Details**:
    - Header: Stage number pill `01` | Time slot `06:00 - 08:30` | Status badge (`Done`, `Active`, `Scheduled`).
    - Body: Bold stage title (e.g. `Media Ingestion`) and concise 1-line summary.
    - Footer: Shift throughput metric (e.g. `1,420 Articles Indexed`). Move verbose operational owner to drill-down panel.
  - **Verification**: All 6 workflow cards present identical vertical height and clear sequential progression.

- [x] **Task 2.6: Streamline Command Center Sub-Head Cards & Drawer**
  - **Files**:
    - `src/components/commandCenter/center/DistrictSubHeadSelector.tsx`
    - `src/components/commandCenter/center/DIODataDrawer.tsx`
    - `src/components/commandCenter/right/LeadershipMessagesSection.tsx`
  - **Details**:
    - In `DistrictSubHeadSelector.tsx`: Keep cards compact with district name, division, rank, and CPI score.
    - In `DIODataDrawer.tsx`: Simplify metric boxes to `Total Releases`, `Active Alerts`, `District CPI`.
    - In `LeadershipMessagesSection.tsx`: Render sender, structured priority tag (`Urgent`, `Directive`), timestamp, and clean directive body.
  - **Verification**: Center and right columns maintain clean visual balance with zero unnecessary metadata.

- [x] **Task 2.7: Streamline Department Workspace Asset Cards**
  - **Files**:
    - `src/components/departments/DepartmentPressReleases.tsx`
    - `src/components/departments/DepartmentPhotographs.tsx`
    - `src/components/departments/DepartmentVideos.tsx`
    - `src/components/departments/DepartmentEmptySlot.tsx`
  - **Details**:
    - In `DepartmentPressReleases.tsx`: Display Ref ID, Release Title, Date, and Download action button.
    - In `DepartmentPhotographs.tsx`: Clean image thumbnail with category pill, title, and date.
    - In `DepartmentVideos.tsx`: Clean video thumbnail with duration pill, title, view count, and date.
    - In `DepartmentEmptySlot.tsx`: Document row with Reference No, Category pill, Title, File size, and Download action.
  - **Verification**: All 4 department quadrants share consistent padding, typography, and action styling.

- [x] **Task 2.8: Streamline Portal Screen Cards (Itineraries, Notifications, Reports, Profile)**
  - **Files**:
    - `src/components/portal/ActivitiesScreen.tsx`
    - `src/components/portal/NotificationsScreen.tsx`
    - `src/components/portal/ReportsScreen.tsx`
    - `src/components/portal/ProfileScreen.tsx`
  - **Details**:
    - In `ActivitiesScreen.tsx`: Simplify itinerary cards to Time badge, Status pill, Title, Location, and Dignitary name.
    - In `NotificationsScreen.tsx`: Clear notification rows with priority tag, Title, Description, Timestamp, and Review action button.
    - In `ReportsScreen.tsx`: Report item rows with Title, Period, Format badge (PDF, CSV, XLSX), File size, and Export button.
    - In `ProfileScreen.tsx`: Officer credential card with Name, Designation, Department, Clearance tier badge, and Official ID.
  - **Verification**: Uniform card aesthetic across all portal screens.

---

### Major Task 3: Centralized Google Material SVG Icon Architecture & Migration
*Objective*: Create a centralized, zero-dependency `MaterialIcon.tsx` component that renders official Google Material SVG paths directly, and replace all 168 Lucide React icon imports across 44 files with typed Google Material SVG symbols.

- [x] **Task 3.1: Create Centralized `MaterialIcon.tsx` Component**
  - **Target File**: `src/components/shared/MaterialIcon.tsx`
  - **Details**:
    - Build a typed component accepting `name: MaterialIconName`, `size?: 'sm' | 'md' | 'lg' | number`, `className?: string`, and `label?: string`.
    - Render an inline SVG with `viewBox="0 0 24 24"`, `fill="currentColor"`, `stroke="none"`, `xmlns="http://www.w3.org/2000/svg"`.
    - If `label` is provided, add `aria-label={label}` and `role="img"`; otherwise, set `aria-hidden="true"`.
    - Define exact SVG path data for all 73 verified Google Material Symbols (Outlined variant):
      - Alert/Notification: `error`, `warning`, `notifications`, `gpp_bad`, `verified_user`, `shield`
      - Navigation/Arrows: `arrow_back`, `arrow_forward`, `arrow_upward`, `arrow_downward`, `unfold_more`, `north_east`, `chevron_left`, `chevron_right`, `close`, `menu`
      - Actions/Controls: `search`, `download`, `open_in_new`, `refresh`, `sync`, `fullscreen`, `play_arrow`, `pause`, `play_circle`, `add`, `send`, `check`, `check_circle`, `progress_activity`
      - Audio/Visual: `videocam`, `tv`, `podcasts`, `volume_up`, `volume_off`, `photo_camera`, `image`
      - Content/Files: `description`, `insert_chart`, `bar_chart`, `fact_check`, `inventory_2`, `newspaper`, `menu_book`, `checklist`, `cloud_upload`
      - Places/Maps/People: `domain`, `location_on`, `map`, `person`, `how_to_reg`, `group`, `call`, `mail`, `language`, `lock`, `vpn_key`, `dns`, `schedule`, `history`, `alt_route`
      - Trends/Feedback: `trending_up`, `trending_down`, `sentiment_satisfied`, `chat_bubble`, `speaker_notes`, `auto_awesome`, `military_tech`, `dashboard`, `layers`
    - Export `MaterialIcon` and `MaterialIconName` type.
  - **Verification**: Component compiles cleanly with TypeScript; renders crisp SVG paths without external network requests or font dependencies.

- [x] **Task 3.2: Migrate Layout & Shell Components (4 files)**
  - **Files**:
    - `src/components/layout/Header.tsx` (`RefreshCw` -> `refresh`, `Menu` -> `menu`)
    - `src/components/layout/Sidebar.tsx` (`LayoutDashboard` -> `dashboard`, `Radio` -> `podcasts`, `MapPin` -> `location_on`, `FileText` -> `description`, `Layers` -> `layers`, `Calendar` -> `calendar_today`, `ShieldAlert` -> `gpp_bad`, `FileBarChart` -> `bar_chart`, `Bell` -> `notifications`, `User` -> `person`, `KeyRound` -> `vpn_key`, `ChevronLeft` -> `chevron_left`, `ChevronRight` -> `chevron_right`, `X` -> `close`)
    - `src/components/layout/DashboardToolbar.tsx` (`CheckCircle2` -> `check_circle`)
    - `src/components/notFound/NotFoundActions.tsx` (`ArrowLeft` -> `arrow_back`, `LayoutDashboard` -> `dashboard`)
  - **Details**: Replace Lucide imports with `<MaterialIcon name="..." size="..." />`.
  - **Verification**: Header, sidebar, and toolbar render Material SVG icons; zero Lucide imports remain in layout components.

- [x] **Task 3.3: Migrate Zone 1 to Zone 5 Components (11 files)**
  - **Files**:
    - `src/components/zones/KPIRibbon/KPICard.tsx` (`ArrowDown` -> `arrow_downward`, `ArrowUp` -> `arrow_upward`, `LucideIcon` -> `MaterialIconName`)
    - `src/components/zones/KPIRibbon/KPIRibbon.tsx` (`FileText` -> `description`, `Clock` -> `schedule`, `Smile` -> `sentiment_satisfied`, `AlertCircle` -> `error`)
    - `src/components/zones/DistrictLeaderboard/DistrictSearchBar.tsx` (`Search` -> `search`)
    - `src/components/zones/DistrictLeaderboard/DistrictTable.tsx` (`ArrowUpRight` -> `north_east`, `ArrowUpDown` -> `unfold_more`, `ArrowUp` -> `arrow_upward`, `ArrowDown` -> `arrow_downward`, `ChevronLeft` -> `chevron_left`, `ChevronRight` -> `chevron_right`)
    - `src/components/zones/ScoreDecomposition/ScoreDecomposition.tsx` (`Newspaper` -> `newspaper`, `Send` -> `send`, `MessageSquare` -> `chat_bubble`, `AlertTriangle` -> `warning`)
    - `src/components/zones/ScoreDecomposition/ScoreMetricBar.tsx` (`LucideIcon` -> `MaterialIconName`)
    - `src/components/zones/OCRFeed/OCRFeed.tsx` (`Plus` -> `add`)
    - `src/components/zones/OCRFeed/OCRFeedItem.tsx` (`MapPin` -> `location_on`)
    - `src/components/zones/EmergencyAlert/EmergencyAlert.tsx` (`ShieldAlert` -> `gpp_bad`)
    - `src/components/zones/EmergencyAlert/IncidentList.tsx` (`ArrowRight` -> `arrow_forward`, `Clock` -> `schedule`)
    - `src/components/zones/EmergencyAlert/PrimaryIncidentCard.tsx` (`ShieldAlert` -> `gpp_bad`, `ExternalLink` -> `open_in_new`, `History` -> `history`, `CheckCircle2` -> `check_circle`)
    - `src/components/zones/EmergencyAlert/SLACountdown.tsx` (`Clock` -> `schedule`)
  - **Details**: Replace all Lucide imports with `MaterialIcon`.
  - **Verification**: All 5 dashboard zones render Material SVG icons; sorting arrows and status icons display correctly.

- [x] **Task 3.4: Migrate Command Center Components (8 files)**
  - **Files**:
    - `src/components/commandCenter/center/CommandCenterCenterSection.tsx` (`Map` -> `map`)
    - `src/components/commandCenter/center/DIODataDrawer.tsx` (`User` -> `person`, `Phone` -> `call`, `Mail` -> `mail`, `Clock` -> `schedule`, `Send` -> `send`, `Check` -> `check`)
    - `src/components/commandCenter/center/DistrictSubHeadSelector.tsx` (`MapPin` -> `location_on`, `Search` -> `search`)
    - `src/components/commandCenter/left/NewspaperDataSection.tsx` (`Newspaper` -> `newspaper`, `BookOpen` -> `menu_book`, `CheckCircle` -> `check_circle`)
    - `src/components/commandCenter/left/SocialMediaDataSection.tsx` (`Share2` -> `share`, `TrendingUp` -> `trending_up`, `Users` -> `group`, `Eye` -> `visibility`)
    - `src/components/commandCenter/left/TVChannelDataSection.tsx` (`Tv` -> `tv`, `Radio` -> `podcasts`, `Clock` -> `schedule`)
    - `src/components/commandCenter/right/LeadershipMessagesSection.tsx` (`MessageSquareText` -> `speaker_notes`, `Award` -> `military_tech`, `Clock` -> `schedule`)
    - `src/components/commandCenter/right/LiveStreamingLinkSection.tsx` (`Play` -> `play_arrow`, `Pause` -> `pause`, `Video` -> `videocam`, `ExternalLink` -> `open_in_new`, `Users` -> `group`, `Volume2` -> `volume_up`, `VolumeX` -> `volume_off`, `Maximize2` -> `fullscreen`)
  - **Details**: Replace all Lucide imports with `MaterialIcon`.
  - **Verification**: Command control room renders Material SVG icons; media player controls function seamlessly.

- [x] **Task 3.5: Migrate Leadership Overview Components (4 files)**
  - **Files**:
    - `src/components/leadership/LeadershipOverview.tsx` (`Shield` -> `shield`)
    - `src/components/leadership/LiveStreaming/LiveStreaming.tsx` (`Play` -> `play_arrow`, `Tv` -> `tv`, `Volume2` -> `volume_up`, `Maximize2` -> `fullscreen`)
    - `src/components/leadership/TopLowerMatrix/TopLowerMatrix.tsx` (`TrendingUp` -> `trending_up`, `TrendingDown` -> `trending_down`)
  - **Details**: Replace all Lucide imports with `MaterialIcon`.
  - **Verification**: 2x2 leadership grid renders Material SVG icons.

- [x] **Task 3.6: Migrate Department Workspace Components (6 files)**
  - **Files**:
    - `src/components/departments/DepartmentSelector.tsx` (`Building2` -> `domain`)
    - `src/components/departments/DepartmentPressReleases.tsx` (`FileText` -> `description`, `Download` -> `download`, `Calendar` -> `calendar_today`, `Check` -> `check`, `Loader2` -> `progress_activity`)
    - `src/components/departments/DepartmentPhotographs.tsx` (`Image` -> `image`, `Camera` -> `photo_camera`, `Calendar` -> `calendar_today`)
    - `src/components/departments/DepartmentVideos.tsx` (`Video` -> `videocam`, `PlayCircle` -> `play_circle`, `Eye` -> `visibility`)
    - `src/components/departments/DepartmentSocialAnalysis.tsx` (`Share2` -> `share`, `Users` -> `group`, `MessageSquare` -> `chat_bubble`, `TrendingUp` -> `trending_up`, `Sparkles` -> `auto_awesome`)
    - `src/components/departments/DepartmentEmptySlot.tsx` (`FolderArchive` -> `inventory_2`, `Plus` -> `add`, `FileCheck2` -> `fact_check`, `Download` -> `download`, `Search` -> `search`, `Check` -> `check`, `X` -> `close`, `Loader2` -> `progress_activity`, `Calendar` -> `calendar_today`, `ShieldCheck` -> `verified_user`, `UploadCloud` -> `cloud_upload`, `FileText` -> `description`)
  - **Details**: Replace all Lucide imports with `MaterialIcon`.
  - **Verification**: Department data views render Material SVG icons; upload and download spinners operate smoothly.

- [x] **Task 3.7: Migrate Workflow & Portal Screen Components (11 files)**
  - **Files**:
    - `src/components/workflow/DailyWorkFlowchart.tsx` (`GitBranch` -> `alt_route`, `Calendar` -> `calendar_today`, `ArrowRight` -> `arrow_forward`, `ArrowLeft` -> `arrow_back`, `UserCheck` -> `how_to_reg`, `CheckCircle2` -> `check_circle`, `ExternalLink` -> `open_in_new`, `ListChecks` -> `checklist`)
    - `src/components/workflow/WorkflowStepCard.tsx` (`CheckCircle2` -> `check_circle`, `Clock` -> `schedule`, `Calendar` -> `calendar_today`, `ArrowRight` -> `arrow_forward`, `UserCheck` -> `how_to_reg`)
    - `src/components/portal/ActivitiesScreen.tsx` (`Calendar` -> `calendar_today`, `MapPin` -> `location_on`, `User` -> `person`)
    - `src/components/portal/CrisisScreen.tsx` (`ShieldAlert` -> `gpp_bad`, `AlertTriangle` -> `warning`, `CheckCircle` -> `check_circle`, `Clock` -> `schedule`)
    - `src/components/portal/DistrictsScreen.tsx` (`MapPin` -> `location_on`)
    - `src/components/portal/LoginScreen.tsx` (`ShieldCheck` -> `verified_user`, `UserCheck` -> `how_to_reg`, `ArrowRight` -> `arrow_forward`, `Lock` -> `lock`)
    - `src/components/portal/MediaScreen.tsx` (`Layers` -> `layers`)
    - `src/components/portal/NotificationsScreen.tsx` (`Bell` -> `notifications`, `AlertCircle` -> `error`, `CheckCircle2` -> `check_circle`, `ShieldAlert` -> `gpp_bad`, `Radio` -> `podcasts`, `UserCheck` -> `how_to_reg`, `Check` -> `check`, `X` -> `close`, `ArrowRight` -> `arrow_forward`)
    - `src/components/portal/PressReleasesScreen.tsx` (`FileText` -> `description`, `Plus` -> `add`, `Search` -> `search`, `Download` -> `download`, `Check` -> `check`, `X` -> `close`, `Send` -> `send`)
    - `src/components/portal/ProfileScreen.tsx` (`User` -> `person`, `Shield` -> `shield`, `Check` -> `check`, `Lock` -> `lock`, `Globe` -> `language`, `Server` -> `dns`, `CheckCircle2` -> `check_circle`)
    - `src/components/portal/ReportsScreen.tsx` (`FileBarChart` -> `bar_chart`, `Download` -> `download`, `Plus` -> `add`, `Check` -> `check`, `X` -> `close`)
  - **Details**: Replace all Lucide imports with `MaterialIcon`.
  - **Verification**: All 11 portal screens render Material SVG icons; zero Lucide React imports remain across `src/`.

- [x] **Task 3.8: Clean Up Dependency Manifest**
  - **File**: `package.json`
  - **Details**:
    - Confirm zero occurrences of `from 'lucide-react'` in `src/`.
    - Uninstall `lucide-react` via `npm uninstall lucide-react` or remove it from `package.json` dependencies.
  - **Verification**: `grep -rn "lucide-react" src/` returns 0 results; `package.json` contains no unused icon libraries.

---

### Major Task 4: Interactive Semantics, Cursor Standardization & Keyboard Navigation
*Objective*: Audit and standardize cursor states, focus rings, and keyboard interactivity across all interactive surfaces.

- [x] **Task 4.1: Standardize Table Headers & Row Interactivity (`DistrictTable.tsx`)**
  - **File**: `src/components/zones/DistrictLeaderboard/DistrictTable.tsx`
  - **Details**:
    - Add dynamic `aria-sort={sortColumn === col ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}` to all 8 sortable `<th>` elements.
    - Ensure sortable headers have `tabIndex={0}` and respond to `Enter` and `Space` keys to trigger sorting.
    - Add `tabIndex={0}` and `onKeyDown` to clickable district rows so keyboard users can navigate and select districts.
    - Add `aria-label={`Inspect ${d.name} performance metrics`}` to the "Inspect" button.
    - Ensure disabled pagination buttons apply `cursor-not-allowed` and `aria-disabled="true"`.
  - **Verification**: Table is 100% navigable and sortable via keyboard; screen reader correctly announces sort state.

- [x] **Task 4.2: Add Keyboard Navigation to Notification List Items**
  - **File**: `src/components/portal/NotificationsScreen.tsx`
  - **Details**:
    - Add `role="button"`, `tabIndex={0}`, and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); markAsRead(n.id); } }}` to notification row items.
    - Add visible focus outline `focus-visible:ring-2 focus-visible:ring-gov-blue` on focused notification rows.
    - Ensure the "Review Action" modal traps focus and closes on `Escape` key press.
  - **Verification**: Tabbing through notifications highlights each row; pressing Enter opens/marks as read.

- [x] **Task 4.3: Add Keyboard Accessibility to GIS Map Polygons**
  - **File**: `src/components/commandCenter/center/MaharashtraMapTopology.tsx`
  - **Details**:
    - Add `role="button"`, `tabIndex={0}`, and `aria-label={`District ${district.name}, ${district.division} division`}` to district `<g>` elements.
    - Add `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectDistrict(district.id); } }}`.
    - Ensure focused district displays an amber focus outline stroke.
  - **Verification**: Keyboard users can Tab through all 36 districts and press Enter to select a district.

- [x] **Task 4.4: Enforce Global Cursor Consistency & Minimum Touch Targets**
  - **Files**: Across all button, select, and clickable card elements.
  - **Details**:
    - Ensure all clickable buttons and tabs have `cursor-pointer`.
    - Ensure non-interactive containers and text retain default `cursor-default` or `cursor-text`.
    - Ensure touch targets on mobile maintain a minimum height of 36px (`min-h-[36px]`).
    - Add `focus-visible:ring-2 focus-visible:ring-offset-1` across all buttons and inputs.
  - **Verification**: Visual inspection and keyboard tabbing confirm consistent cursor feedback and clear focus rings.

---

### Major Task 5: Motion-Minimal Refinement & Animation Elimination
*Objective*: Remove all continuous looping decorative animations (`animate-ping`, `animate-pulse`), eliminate undefined animation utility classes, and enforce a static-by-default enterprise UI that honors `prefers-reduced-motion`.

- [x] **Task 5.1: Remove Looping `animate-ping` Animations**
  - **Files**:
    - `src/components/layout/Header.tsx` (Telemetry dot)
    - `src/components/leadership/LiveStreaming/LiveStreaming.tsx` (Live channel dot)
    - `src/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis.tsx` (Sync dot)
    - `src/components/leadership/GISMap/GISMap.tsx` (District beacon)
  - **Details**:
    - Replace `<span className="animate-ping ...">` with static solid indicator `<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />`.
    - Maintain high-contrast colors without expanding or fading rings.
  - **Verification**: Zero expanding/fading ping animations appear on telemetry dots or broadcast headers.

- [x] **Task 5.2: Remove Looping `animate-pulse` Animations**
  - **Files**:
    - `src/components/zones/EmergencyAlert/SLACountdown.tsx` (Clock icon)
    - `src/components/workflow/DailyWorkFlowchart.tsx` (Active counter dot & stepper node)
    - `src/components/workflow/WorkflowStepCard.tsx` (Active shift clock icon)
    - `src/components/zones/OCRFeed/OCRFeed.tsx` (Live ticker dot)
    - `src/components/commandCenter/center/DIODataDrawer.tsx` (DIO active status dot)
  - **Details**:
    - In `SLACountdown.tsx`: Remove `animate-pulse` from clock icon; display static solid crimson icon and bold text.
    - In `DailyWorkFlowchart.tsx` and `WorkflowStepCard.tsx`: Remove `animate-pulse` from amber badges; display solid amber badge with bold ring.
    - In `OCRFeed.tsx` and `DIODataDrawer.tsx`: Remove `animate-pulse` from live dots.
  - **Verification**: Zero pulsing opacity animations remain on the screen.

- [x] **Task 5.3: Standardize Modal & Drawer Transitions**
  - **Files**:
    - `src/components/portal/NotificationsScreen.tsx`
    - `src/components/portal/PressReleasesScreen.tsx`
    - `src/components/portal/ReportsScreen.tsx`
    - `src/components/zones/EmergencyAlert/PrimaryIncidentCard.tsx`
    - `src/components/departments/DepartmentEmptySlot.tsx`
  - **Details**:
    - Replace undefined `animate-fadeIn` and `animate-in fade-in zoom-in-95` with standard Tailwind transitions:
      - Backdrop: `transition-opacity duration-150 ease-out`
      - Dialog shell: `transition-all duration-150 ease-out`
    - In `PrimaryIncidentCard.tsx`: Render evidence and timeline drawers with instant static placement to avoid layout jumps.
  - **Verification**: Dialogs open smoothly in 150ms without layout glitching or missing CSS classes.

- [x] **Task 5.4: Clean Up Animation Tokens in Global Styles & Tailwind Config**
  - **Files**:
    - `src/app/globals.css`
    - `tailwind.config.ts`
  - **Details**:
    - In `globals.css`: Remove unused `@keyframes alertPulse` and `.animate-alert-pulse`; remove unused `@keyframes countdownTick` and `.animate-countdown`.
    - In `tailwind.config.ts`: Remove `animation: { 'alert-pulse': ..., 'countdown': ... }`.
    - In `globals.css`: Ensure `@media (prefers-reduced-motion: reduce)` disables all CSS transitions globally (`* { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }`).
  - **Verification**: Clean CSS stylesheets; zero unused keyframe declarations; reduced-motion preference halts all transitions immediately.

---

### Major Task 6: Responsive Usability & Accessibility (a11y) Hardening
*Objective*: Audit and resolve device-specific layout defects across mobile (320px–430px), tablet (768px–1023px), laptop (1024px–1439px), and desktop (1440px+).

- [x] **Task 6.1: Harden Mobile Shell & Navigation Drawer (320px–430px)**
  - **Files**:
    - `src/components/layout/Header.tsx`
    - `src/components/layout/Sidebar.tsx`
    - `src/components/layout/DashboardLayout.tsx`
  - **Details**:
    - Verify that on screens under 640px, the header branding, role dropdown, and language selector do not collide or wrap onto a second line.
    - Verify that clicking anywhere on the backdrop overlay closes the mobile navigation drawer.
    - Verify that clicking any navigation link automatically closes the mobile drawer and navigates to the target route.
  - **Verification**: Mobile viewport test (360px x 640px) confirms zero horizontal overflow and seamless drawer operation.

- [x] **Task 6.2: Harden Responsive Tables & Data Density**
  - **Files**:
    - `src/components/zones/DistrictLeaderboard/DistrictTable.tsx`
    - `src/components/portal/PressReleasesScreen.tsx`
    - `src/components/portal/ReportsScreen.tsx`
  - **Details**:
    - In `DistrictTable.tsx`: Ensure table container has `overflow-x-auto` with clean scrollbar styling and sticky/frozen Rank and District columns if necessary.
    - In `PressReleasesScreen.tsx` and `ReportsScreen.tsx`: Ensure action buttons stack cleanly on mobile viewports (<640px) without text clipping.
  - **Verification**: Tables scroll horizontally on mobile without breaking page width.

- [x] **Task 6.3: Harden Command Center Triptych Stacking (Tablet & Mobile)**
  - **Files**:
    - `src/components/commandCenter/CommandCenterView.tsx`
    - `src/components/commandCenter/center/MaharashtraMapTopology.tsx`
    - `src/components/commandCenter/center/DistrictSubHeadSelector.tsx`
  - **Details**:
    - Ensure the 3 columns (`Left`, `Center`, `Right`) stack cleanly on tablet (`< lg`) into full-width sections.
    - Ensure `MaharashtraMapTopology.tsx` SVG maintains aspect ratio (`viewBox="0 0 800 664"`) and scales cleanly on mobile viewports without clipping district names.
    - Ensure `DistrictSubHeadSelector.tsx` division filter tabs scroll smoothly horizontally without hiding districts.
  - **Verification**: Full Command Center layout functions smoothly across mobile (360px), tablet (768px), and desktop (1440px).

- [x] **Task 6.4: Execute Accessibility (a11y) Verification**
  - **Details**:
    - Verify color contrast for all text against backgrounds (minimum 4.5:1 for normal text, 3:1 for large text).
    - Verify that all icon-only buttons (`Download`, `Inspect`, `Close`, `Menu`, `Refresh`) have descriptive accessible labels.
    - Verify that form inputs have associated `<label>` elements or `aria-label` attributes.
  - **Verification**: Automated accessibility scan reports zero critical or serious WCAG 2.1 AA violations.

---

### Major Task 7: Comprehensive Regression Testing & Production Build Verification
*Objective*: Execute all automated validation commands, verify complete feature retention across all 11 routes, and ensure zero build warnings or errors.

- [x] **Task 7.1: Automated TypeScript Validation**
  - **Command**: `npx tsc --noEmit`
  - **Details**: Validate strict type compliance across all 77 source files. Ensure zero type errors related to `MaterialIconProps` or removed Lucide types.
  - **Acceptance Criteria**: Command exits with code 0.

- [x] **Task 7.2: Automated ESLint Validation**
  - **Command**: `npm run lint`
  - **Details**: Verify that no unused imports, unescaped entities, or lint warnings remain in the codebase.
  - **Acceptance Criteria**: Command outputs `✔ No ESLint warnings or errors` and exits with code 0.

- [x] **Task 7.3: Next.js Static Production Build**
  - **Command**: `npm run build`
  - **Details**: Verify that all 16 static routes prerender successfully:
    - `/`
    - `/_not-found`
    - `/activities`
    - `/command-center`
    - `/crisis`
    - `/dashboard`
    - `/districts`
    - `/login`
    - `/media`
    - `/notifications`
    - `/press-releases`
    - `/profile`
    - `/reports`
  - **Acceptance Criteria**: Build compiles and outputs static HTML/JS bundles with exit code 0.

- [x] **Task 7.4: End-to-End Route & Feature Retention Check**
  - **Details**: Manually verify all 11 core routes in a browser:
    - [x] `/` — Statewide KPI ribbon, District leaderboard, CPI decomposition, Live OCR stream, Emergency alert, Leadership overview.
    - [x] `/command-center` — 3-column deck, ECharts newspaper/TV/social charts, 36-district SVG map, DIO drawer dispatch, broadcast streaming simulator.
    - [x] `/districts` — 36-district table sorting, division filter pills, CPI drill-down.
    - [x] `/press-releases` — PR search, status filtering, drafting modal dialog, PDF download.
    - [x] `/media` — Print clippings, broadcast airtime, OCR live ticker, social sentiment.
    - [x] `/activities` — VIP itinerary calendar, daily workflow stepper.
    - [x] `/crisis` — Emergency alert desk, 90-minute SLA countdown, Collector authorization.
    - [x] `/reports` — Reports vault, custom dossier generator modal dialog, format export.
    - [x] `/notifications` — Category filter tabs, unread dot indicators, mark-as-read, review action modal dialog.
    - [x] `/profile` — Officer credential card, clearance tier hierarchy, role delegation switcher, language preferences.
    - [x] `/login` — Role-based gateway (DG Admin vs. District Collector), PIN verification.
  - **Acceptance Criteria**: 100% of existing functionality, data flows, and store reactivity operate with zero regressions.
