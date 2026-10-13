# Maha-Command Center — Design System Specification

> **Document type:** Design system reference for implementation
> **Palette:** Strict monochrome (grayscale only)
> **Font:** Noto Sans (with Marathi/Devanagari support)

---

## 1. Color Tokens (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --bg-page:               #F5F6F7;
  --bg-surface:            #FFFFFF;
  --bg-surface-secondary:  #F0F1F3;
  --bg-selected:           #E7E9EC;
  --bg-hover:              #F0F1F3;

  /* Text */
  --text-primary:          #202124;
  --text-secondary:        #5F6368;
  --text-muted:            #80868B;
  --text-inverse:          #FFFFFF;

  /* Borders */
  --border-standard:       #DADCE0;
  --border-subtle:         #E8EAED;
  --border-strong:         #303134;

  /* Actions */
  --action-primary:        #303134;
  --action-primary-hover:  #202124;
  --action-secondary:      #5F6368;

  /* Chart grays (5-level scale for data series) */
  --chart-1:               #303134;
  --chart-2:               #5F6368;
  --chart-3:               #80868B;
  --chart-4:               #DADCE0;
  --chart-5:               #E8EAED;

  /* Severity (grayscale-only emphasis) */
  --severity-high:         #303134;    /* Strong dark border / heading */
  --severity-medium:       #5F6368;    /* Medium emphasis */
  --severity-low:          #80868B;    /* Subtle emphasis */
}
```

---

## 2. Typography Scale

```css
:root {
  /* Font families */
  --font-sans:  'Noto Sans', 'Noto Sans Devanagari', system-ui, -apple-system, sans-serif;
  --font-mono:  'Noto Sans Mono', 'Consolas', monospace;

  /* Font sizes */
  --text-xs:    0.75rem;    /* 12px — muted metadata */
  --text-sm:    0.8125rem;  /* 13px — table cells, captions */
  --text-base:  0.875rem;   /* 14px — body text, labels */
  --text-md:    1rem;        /* 16px — section headings */
  --text-lg:    1.125rem;   /* 18px — panel titles */
  --text-xl:    1.5rem;      /* 24px — KPI primary values */
  --text-2xl:   1.75rem;    /* 28px — Hero KPI values (moderate, not oversized) */

  /* Font weights */
  --font-normal:    400;
  --font-medium:    500;
  --font-semibold:  600;

  /* Line heights */
  --leading-tight:   1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;
}
```

### Usage Guidelines

| Element | Size | Weight | Color |
|---|---|---|---|
| App title (header) | `--text-md` | `--font-semibold` | `--text-primary` |
| App subtitle | `--text-sm` | `--font-normal` | `--text-secondary` |
| Page title | `--text-lg` | `--font-semibold` | `--text-primary` |
| Panel heading | `--text-md` | `--font-semibold` | `--text-primary` |
| KPI primary value | `--text-2xl` | `--font-semibold` | `--text-primary` |
| KPI label | `--text-sm` | `--font-medium` | `--text-secondary` |
| KPI supporting stat | `--text-xs` | `--font-normal` | `--text-muted` |
| Table heading | `--text-sm` | `--font-medium` | `--text-secondary` |
| Table cell | `--text-sm` | `--font-normal` | `--text-primary` |
| Table cell (numeric) | `--text-sm` | `--font-normal` | `--text-primary` (mono for numbers) |
| Filter/control label | `--text-sm` | `--font-normal` | `--text-secondary` |
| Badge/status text | `--text-xs` | `--font-medium` | varies |
| Incident ID | `--text-sm` | `--font-mono` | `--text-primary` |
| Timestamp | `--text-xs` | `--font-mono` | `--text-muted` |
| Body text | `--text-base` | `--font-normal` | `--text-primary` |

---

## 3. Spacing System (4px base)

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
}
```

### Application to Components

| Context | Spacing |
|---|---|
| Main content gutter (desktop) | `--space-5` to `--space-6` (20–24px) |
| Gap between major zones | `--space-4` (16px) |
| Panel internal padding | `--space-4` (16px) |
| Table cell padding (horizontal) | `--space-3` (12px) |
| Table cell padding (vertical) | `--space-2` (8px) |
| Between filter controls | `--space-2` to `--space-3` (8–12px) |
| Icon-to-label gap | `--space-2` (8px) |
| KPI card internal spacing | `--space-3` to `--space-4` (12–16px) |

---

## 4. Component Specifications

### 4.1 Panel / Card

```
┌─────────────────────────────────────────┐
│  ■ Panel Heading            Action link │  ← 16px padding
│─────────────────────────────────────────│  ← 1px --border-subtle
│                                         │
│  Panel content                          │  ← 16px padding
│                                         │
└─────────────────────────────────────────┘

Background: --bg-surface (#FFFFFF)
Border: 1px solid --border-standard (#DADCE0)
Border-radius: 4–6px
Shadow: none (or 0 1px 2px rgba(0,0,0,0.04) max)
```

### 4.2 KPI Card

```
┌──────────────────────────┐
│  🔲 Total Releases       │  ← icon (16px mono) + label (text-sm, medium, secondary)
│  1,248                   │  ← primary value (text-2xl, semibold, primary)
│  Target 1,500 (83%)      │  ← supporting stat (text-xs, normal, muted)
│                    ↓ 12% │  ← trend indicator (text-xs, normal, muted) + arrow
│        vs. previous 7 days│  ← period reference (text-xs, normal, muted)
└──────────────────────────┘

Height: Equal across all 4 cards (auto, min-height ~120px)
Internal alignment: Left-aligned, consistent vertical stacking
```

### 4.3 Data Table Row

```
┌─────┬───────────┬──────────┬──────────┬──────────┬───────────┬──────────┬──────┬────────┐
│  #  │ District  │ Division │ Releases │ Avg TAT  │ Sentiment │ Crisis   │ CPI  │ Action │
│     │           │          │   (R)    │   (R)    │    (R)    │ SLA (R)  │ (R)  │        │
├─────┼───────────┼──────────┼──────────┼──────────┼───────────┼──────────┼──────┼────────┤
│  1  │ Pune      │ Pune     │   248    │   42m    │    78%    │   100%   │  88  │ [View] │
└─────┴───────────┴──────────┴──────────┴──────────┴───────────┴──────────┴──────┴────────┘

Row height: 40-44px
(R) = Right-aligned numeric columns
Header: text-sm, font-medium, --text-secondary, uppercase OFF
Cell: text-sm, font-normal, --text-primary
Border: 1px --border-subtle between rows only (no cell borders)
Selected row: --bg-selected background
Hover: --bg-hover background
```

### 4.4 Button Variants

```
Primary (dark):
  Background: --action-primary (#303134)
  Text: --text-inverse (#FFFFFF)
  Height: 36-40px
  Border-radius: 4px
  Hover: --action-primary-hover (#202124)

Secondary (outline):
  Background: transparent
  Border: 1px solid --border-standard (#DADCE0)
  Text: --text-primary (#202124)
  Height: 32-36px

Ghost (text only):
  Background: transparent
  Text: --text-secondary (#5F6368)
  Hover: --bg-hover background
```

### 4.5 Select / Dropdown

```
┌──────────────────── ▾ ─┐
│  All Maharashtra       │
└────────────────────────┘

Height: 32-36px
Background: --bg-surface
Border: 1px solid --border-standard
Border-radius: 4px
Text: text-sm, --text-primary
Padding: 8px 12px
```

### 4.6 Badge / Status Indicator

```
┌───────────┐
│  ● High   │  (monochrome — NO color)
└───────────┘

Background: --bg-surface-secondary or transparent
Border: 1px solid --border-standard
Text: text-xs, font-medium, --text-primary
Dot: filled circle in --severity-high/medium/low
No colored backgrounds. Use border weight and text darkness for emphasis.
```

### 4.7 Search Input

```
┌─ 🔍 ───────────────────────┐
│  Search district...         │
└─────────────────────────────┘

Height: 32-36px
Background: --bg-surface
Border: 1px solid --border-standard
Icon: 16px, --text-muted
Placeholder: --text-muted
```

### 4.8 Tab Group

```
  ┌─────────────┐  ┌───────────────┐  ┌─────────────┐
  │ CPI Ranking │  │ Event Coverage │  │ Specific News│
  └─────────────┘  └───────────────┘  └─────────────┘
       ▬▬▬▬▬

Active: text-sm, font-medium, --text-primary, bottom border 2px --action-primary
Inactive: text-sm, font-normal, --text-secondary
No background pills. Underline indicator only.
```

---

## 5. Iconography

- **Style:** Monochrome outline icons (Lucide React recommended)
- **Sizes:**
  - Navigation: 20px
  - KPI card: 16-20px
  - Inline/table: 16px
  - Small indicators: 12px
- **Color:** `--text-secondary` default, `--text-primary` on active/hover
- **Stroke width:** 1.5–2px

### Required Icons (mapping)

| Context | Icon |
|---|---|
| Command Overview | `LayoutDashboard` |
| Media Surveillance | `Monitor` |
| Narrative & Sentiment | `MessageCircle` |
| Misinformation | `AlertTriangle` |
| District Operations | `Building2` |
| Press Releases | `FileText` |
| Audit & Telemetry | `Activity` |
| Refresh | `RefreshCw` |
| Search | `Search` |
| User profile | `User` |
| Settings | `Settings` |
| Total Releases | `FileText` |
| Average TAT | `Clock` |
| Sentiment Index | `TrendingUp` |
| Misinformation Tickets | `AlertCircle` |
| Collapse sidebar | `ChevronLeft` |
| Expand sidebar | `ChevronRight` |

---

## 6. Chart Design Rules (ECharts)

### Monochrome Series Colors
```
Series 1: #303134 (darkest)
Series 2: #5F6368
Series 3: #80868B
Series 4: #DADCE0
Series 5: #E8EAED (lightest)
```

### Grid & Axis
- Grid lines: `#E8EAED` (subtle)
- Axis line: `#DADCE0`
- Axis labels: `#5F6368`, text-xs
- No colored backgrounds in chart area

### Bar Charts
- Bar border radius: 2px (top only)
- Bar gap: 30%
- Labels on top of bars when space permits

### No Red/Green
- Use grayscale intensity to show performance
- Use marker shapes (▲ ▼ ●) for trend direction
- Use labels ("Above target", "Below target") for context

---

## 7. Severity & Status Communication (Without Color)

| Severity | Visual Treatment |
|---|---|
| High/Critical | 2px left border `--severity-high`, bold heading, filled dot |
| Medium | 1px left border `--severity-medium`, medium weight, half-filled dot |
| Low | Standard border, normal weight, outline dot |
| Met/On-Track | "Met" label, `--text-primary` |
| At Risk | "At Risk" label, semibold |
| Critical | "Critical" label, semibold, strong border |

---

## 8. Animation & Transitions

### Allowed
- Opacity transitions: 150ms ease
- Background-color transitions on hover: 150ms ease
- Sidebar collapse/expand: 200ms ease-in-out
- Tooltip fade-in: 100ms

### Forbidden
- No pulsing effects
- No flashing alerts
- No bouncing animations
- No auto-scrolling that disrupts reading
- No loading spinners that rotate continuously (use static progress bars)
- No decorative entrance animations
