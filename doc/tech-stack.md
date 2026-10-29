# Maha-Command Center — Technology Stack & Library Reference

> **Document type:** Technology stack specification
> **Framework:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS

---

## 1. Core Framework

| Package | Version | Purpose |
|---|---|---|
| `next` | `^14.2.15` | App Router, SSR, server components |
| `react` | `^18.3.1` | UI library |
| `react-dom` | `^18.3.1` | DOM rendering |
| `typescript` | `^5.6.3` | Type safety |

---

## 2. Charting — ECharts

| Package | Version | Purpose |
|---|---|---|
| `echarts` | `^5.6.0` | Core charting engine |
| `echarts-for-react` | `^3.0.6` | React declarative wrapper |

### Why `echarts-for-react` over alternatives

- `react-echarts` is unmaintained with React 18/19 peer dependency issues.
- `echarts-for-react` is the industry standard (800k+ weekly downloads), actively maintained, provides declarative props (`option`, `theme`, `onEvents`).

### App Router Integration

ECharts accesses browser `window` and canvas APIs. Charts must be:
1. Declared with `'use client'` directive
2. Dynamically imported via `next/dynamic(() => import(...), { ssr: false })`

### Bundle Optimization

Import from `echarts-for-react/lib/core` with `echarts/core` and register only required charts:

```typescript
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);
```

This cuts bundle size by **over 60%**.

### Monochrome Theme Registration

```typescript
echarts.registerTheme('monochrome', {
  color: ['#303134', '#5F6368', '#80868B', '#DADCE0', '#E8EAED'],
  backgroundColor: '#FFFFFF',
  textStyle: { color: '#202124', fontFamily: 'Noto Sans' },
  // ... grid, axis, label styling
});
```

---

## 3. UI Primitives — Radix UI

| Package | Version | Purpose |
|---|---|---|
| `@radix-ui/react-dialog` | `^1.1.2` | Mobile nav overlay, modals |
| `@radix-ui/react-dropdown-menu` | `^2.1.2` | User profile menu |
| `@radix-ui/react-select` | `^2.1.2` | Dropdowns (role, scope, division, period) |
| `@radix-ui/react-tabs` | `^1.1.1` | Tab groups (leaderboard, social media, etc.) |
| `@radix-ui/react-tooltip` | `^1.1.4` | Info tooltips |
| `@radix-ui/react-popover` | `^1.1.2` | Popovers if needed |

### Why Radix UI

- **WCAG 2.1 AA/AAA accessible** — full keyboard navigation, focus trap, screen-reader ARIA semantics (critical for government compliance).
- **Headless** — zero opinionated styling, full control to implement strict monochrome palette.
- Headless UI has only ~10 primitives, lacking essential dashboard controls (Tooltip, Command, Separator, Tabs).

### Utility Libraries for Styling

| Package | Version | Purpose |
|---|---|---|
| `clsx` | `^2.1.1` | Conditional className joining |
| `tailwind-merge` | `^2.6.0` | Merge Tailwind classes without conflicts |
| `class-variance-authority` | `^0.7.1` | Component variant definitions |

---

## 4. Data Tables — TanStack Table v8

| Package | Version | Purpose |
|---|---|---|
| `@tanstack/react-table` | `^8.21.2` | Headless data table |

### Why TanStack Table over AG Grid

- AG Grid Community is ~150kB+ gzipped with complex internal DOM and opinionated stylesheets. Forcing it into a monochrome government design requires extensive CSS overrides.
- For exactly **36 Maharashtra district records**, AG Grid's virtualized engine is massive overkill.
- TanStack Table is **lightweight (~14kB)** and completely headless — 100% control over HTML `<table>` markup styled with Tailwind CSS monochrome utilities.
- Robust, type-safe APIs for multi-column sorting, division filtering, global search, and row selection syncing with CPI score inspection.

---

## 5. GIS Map — react-simple-maps / d3-geo

| Package | Version | Purpose |
|---|---|---|
| `react-simple-maps` | `^3.0.0` | React SVG map rendering |
| `topojson-client` | `^3.1.0` | TopoJSON parsing |
| `d3-geo` | `^3.1.1` | Geo projection calculations |

### Alternative considered: `react-leaflet` / `mapbox-gl`

**Rejected because:**
- Tile servers require external network calls (violating air-gapped government intranet security).
- Introduce non-monochrome street/topography colors.
- Heavy WebGL/Leaflet bundle overhead.

### Why SVG-based approach

- Maharashtra has exactly **36 administrative districts** — SVG paths are perfectly adequate.
- Local GeoJSON/TopoJSON renders directly as SVG `<path>` elements.
- Direct Tailwind styling for fills and strokes.
- Zero external network dependencies.
- Instant rendering and immediate synchronization with Zustand district selection store.

### GeoJSON Source

- **DataMeet India** open datasets or similar open-source Maharashtra boundary data.
- Store locally in `public/geojson/maharashtra-districts.json`.

---

## 6. Icons — Lucide React

| Package | Version | Purpose |
|---|---|---|
| `lucide-react` | `^1.16.0` | Monochrome outline icons |

### Why Lucide

- 1,500+ clean, 24×24 outline icons with unified 2px stroke width.
- All icons inherit `stroke="currentColor"` — 100% monochrome compliant.
- Default for Next.js / shadcn ecosystem.
- Heroicons has limited vocabulary (~290 icons) lacking crisis/intelligence domain icons.
- Phosphor Icons is heavier and less aligned with the Radix/Tailwind ecosystem.

---

## 7. Internationalization — next-intl

| Package | Version | Purpose |
|---|---|---|
| `next-intl` | `^3.26.5` | English/Marathi i18n |

### Why next-intl

- Purpose-built for Next.js App Router.
- Supports Server Components (RSC) with zero client bundle overhead for static text.
- Client components via `useTranslations` hook.
- Routing middleware for locale-prefixed URLs (`/en`, `/mr`).
- Built-in Marathi formatting (`mr-IN`) for numbers, dates, currency via `Intl` APIs.
- `react-i18next` requires awkward SSR workarounds in App Router, causing hydration flashes.

---

## 8. State Management — Zustand

| Package | Version | Purpose |
|---|---|---|
| `zustand` | `^5.0.3` | Cross-zone state synchronization |

### Why Zustand

- **Lightweight (1.2kB)**, unopinionated.
- **Fine-grained selector subscriptions** — `useStore(s => s.selectedDistrict)` ensures only subscribed zones re-render.
- React Context triggers re-renders across ALL consumers on any state change (would cause unnecessary re-renders of KPI Ribbon, Crisis Monitor, OCR Feed when selecting a district).
- Jotai (atomic state) fragments related dashboard models into isolated atoms.

---

## 9. Fonts — Noto Sans + Devanagari

### Setup via `next/font/google`

```typescript
// app/layout.tsx
import { Noto_Sans, Noto_Sans_Devanagari } from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-devanagari',
  display: 'swap',
});
```

### Tailwind Config

```typescript
fontFamily: {
  sans: ['var(--font-noto-sans)', 'var(--font-noto-devanagari)', 'sans-serif'],
}
```

### Benefits

- Automatic font optimization by Next.js.
- Zero layout shift (CLS).
- Proper complex conjunct glyph rendering for Devanagari (Marathi) script.

### Air-gapped Alternative

If deploying on government intranet without Google Fonts access:
```bash
npm install @fontsource/noto-sans @fontsource/noto-sans-devanagari
```

---

## 10. CSS — Tailwind CSS v3

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^3.4.17` | Utility-first CSS |
| `postcss` | `^8.4.49` | CSS processing |
| `autoprefixer` | `^10.4.20` | Vendor prefixes |

### Why v3 over v4

- v3.4.17 is rock-solid, production standard for Next.js 14 and the Radix/shadcn ecosystem.
- Zero breaking changes or plugin incompatibilities.
- v4 is still emerging with potential instability.

### Design Token Integration

```css
/* globals.css */
:root {
  --bg-page: #F5F6F7;
  --bg-surface: #FFFFFF;
  --bg-surface-secondary: #F0F1F3;
  --bg-selected: #E7E9EC;
  --text-primary: #202124;
  --text-secondary: #5F6368;
  --text-muted: #80868B;
  --border-standard: #DADCE0;
  --border-subtle: #E8EAED;
  --action-primary: #303134;
  --text-inverse: #FFFFFF;
}
```

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      page: 'var(--bg-page)',
      surface: { DEFAULT: 'var(--bg-surface)', secondary: 'var(--bg-surface-secondary)' },
      selected: 'var(--bg-selected)',
      // ... mapped to CSS custom properties
    }
  }
}
```

---

## 11. Virtual Scroll — react-virtuoso

| Package | Version | Purpose |
|---|---|---|
| `react-virtuoso` | `^4.12.5` | OCR feed virtual scrolling |

### Why react-virtuoso over @tanstack/react-virtual

- `@tanstack/react-virtual` is headless — requires manual calculation of dynamic heights, scroll container refs, and absolute transform styling.
- `react-virtuoso` handles **variable, dynamic item heights automatically**.
- Crucially for Zone 4 (OCR Feed), supports `firstItemIndex` and prepending without scroll jumping — satisfying the spec requirement: *"New records should appear without forcing the user's current reading position to jump."*
- Built-in "stick to bottom" mode for live feeds.

---

## 12. Date/Time Utilities

| Package | Version | Purpose |
|---|---|---|
| `date-fns` | `^4.1.0` | Date formatting, SLA calculations |

### Usage

- SLA countdown calculations
- Timestamp formatting for sync status, feed items
- Relative time display ("2h 14m remaining")
- Lightweight, tree-shakeable (no moment.js-style monolith)

---

## 13. Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@types/d3-geo` | `^3.1.0` | TypeScript types for d3-geo |
| `@types/topojson-client` | `^3.1.4` | TypeScript types for topojson |
| `eslint` | (bundled with create-next-app) | Linting |
| `eslint-config-next` | (bundled) | Next.js ESLint rules |

---

## 14. Complete `package.json` Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.15",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "echarts": "^5.6.0",
    "echarts-for-react": "^3.0.6",
    "@tanstack/react-table": "^8.21.2",
    "react-simple-maps": "^3.0.0",
    "topojson-client": "^3.1.0",
    "d3-geo": "^3.1.1",
    "lucide-react": "^1.16.0",
    "next-intl": "^3.26.5",
    "zustand": "^5.0.3",
    "react-virtuoso": "^4.12.5",
    "date-fns": "^4.1.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@radix-ui/react-popover": "^1.1.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "class-variance-authority": "^0.7.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "@types/d3-geo": "^3.1.0",
    "@types/topojson-client": "^3.1.4",
    "typescript": "^5.6.3"
  }
}
```

---

## 15. Libraries Explicitly NOT Used (and Why)

| Library | Reason for exclusion |
|---|---|
| AG Grid | Overkill for 36 rows, opinionated styling conflicts with monochrome |
| Chart.js | Less capable than ECharts for complex government dashboards |
| Mapbox GL | Requires tile server, non-monochrome, external network dependency |
| React-Leaflet | Same tile server issues, heavy bundle |
| Material UI (MUI) | Opinionated Google Material design, extremely difficult to strip to pure monochrome |
| Ant Design | Opinionated Chinese enterprise design, colored by default |
| Moment.js | Massive bundle, deprecated in favor of date-fns |
| Redux / MobX | Overkill boilerplate for this dashboard's state needs |
| Framer Motion | The spec forbids decorative animation; minimal transitions are CSS-only |
| Styled Components / Emotion | Tailwind CSS is the spec requirement |
