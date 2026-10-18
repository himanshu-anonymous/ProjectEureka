'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getLocalizedStatus, getOfficerInfo } from '@/lib/dataLocalization';
import {
  DISTRICT_BY_ID,
  DISTRICT_GEOMETRY,
  DIVISIONS,
  DIVISION_BORDERS_PATH,
  DIVISION_ORDER,
  MAP_HEIGHT,
  MAP_WIDTH,
  STATE_OUTLINE_PATH,
  type DistrictGeometry,
  type DistrictId,
  type DivisionId,
} from '@/data/maharashtraGeo.generated';
import { DIO_BY_DISTRICT, type DioStatus } from '@/data/dioDirectory';

/* -------------------------------------------------------------------------- */
/* Types & constants                                                          */
/* -------------------------------------------------------------------------- */

type StatusKey = DioStatus | 'Not configured';
type ColorMode = 'division' | 'status';

/** Visible window into the map. Height is derived from width to keep the aspect ratio. */
interface ViewBox {
  x: number;
  y: number;
  w: number;
}

const COLORS = {
  selected: '#1B2A4A', // Government Navy
  inspected: '#1E40AF', // Ashoka Blue
  pin: '#D97706', // Government Saffron
  divisionBorder: '#1B2A4A',
};

const DIVISION_FILL: Record<DivisionId, string> = {
  konkan: '#9ED7D2',
  nashik: '#F3D58E',
  pune: '#A9BFF0',
  'chhatrapati-sambhajinagar': '#E9AEBE',
  amravati: '#B5DDA4',
  nagpur: '#F5BD98',
};

// Consistent semantic status badges and fills
const STATUS_FILL: Record<StatusKey, string> = {
  Active: '#6EE7B7',
  Standby: '#FCD34D',
  'Field Operation': '#93C5FD',
  'Not configured': '#E2E8F0',
};

const STATUS_BADGE: Record<StatusKey, string> = {
  Active: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Standby: 'bg-amber-50 text-amber-800 border-amber-300',
  'Field Operation': 'bg-blue-50 text-blue-800 border-blue-300',
  'Not configured': 'bg-slate-50 text-slate-600 border-slate-300',
};

const STATUS_ORDER: StatusKey[] = ['Active', 'Standby', 'Field Operation', 'Not configured'];

const DEFAULT_DISTRICT_ID: DistrictId = 'thane';

/** IDs used by previous callers or aliases, mapping to standard 36 district keys */
const LEGACY_ID_ALIASES: Record<string, DistrictId> = {
  mumbai: 'mumbai-city',
  aurangabad: 'chhatrapati-sambhajinagar',
};

const statusOf = (id: DistrictId): StatusKey => DIO_BY_DISTRICT[id]?.status ?? 'Not configured';

function resolveDistrictId(id: string | null | undefined): DistrictId | null {
  if (!id) return null;
  if (Object.prototype.hasOwnProperty.call(DISTRICT_BY_ID, id)) return id as DistrictId;
  return LEGACY_ID_ALIASES[id] ?? null;
}

// Static, computed once rather than on every render
const DISTRICTS_BY_DIVISION = DIVISION_ORDER.map((div) => ({
  div,
  districts: DISTRICT_GEOMETRY.filter((d) => d.division === div),
}));

const STATUS_COUNTS = DISTRICT_GEOMETRY.reduce(
  (acc, d) => ({ ...acc, [statusOf(d.id)]: acc[statusOf(d.id)] + 1 }),
  { Active: 0, Standby: 0, 'Field Operation': 0, 'Not configured': 0 } as Record<StatusKey, number>
);

/* -------------------------------------------------------------------------- */
/* Pan / zoom maths (pure)                                                    */
/* -------------------------------------------------------------------------- */

const MIN_W = MAP_WIDTH / 16; // max zoom 16x
const FULL_VIEW: ViewBox = { x: 0, y: 0, w: MAP_WIDTH };
const viewH = (w: number) => (w * MAP_HEIGHT) / MAP_WIDTH;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function clampView(v: ViewBox): ViewBox {
  const w = clamp(v.w, MIN_W, MAP_WIDTH);
  return { w, x: clamp(v.x, 0, MAP_WIDTH - w), y: clamp(v.y, 0, MAP_HEIGHT - viewH(w)) };
}

/** Zoom by `factor`, keeping the anchor point fixed. */
function zoomView(v: ViewBox, factor: number, fx = 0.5, fy = 0.5): ViewBox {
  const w = clamp(v.w / factor, MIN_W, MAP_WIDTH);
  const anchorX = v.x + fx * v.w;
  const anchorY = v.y + fy * viewH(v.w);
  return clampView({ w, x: anchorX - fx * w, y: anchorY - fy * viewH(w) });
}

function fitView(b: DistrictGeometry['bbox']): ViewBox {
  const aspect = MAP_WIDTH / MAP_HEIGHT;
  const w = clamp(Math.max(b.w * 1.6, b.h * 1.6 * aspect), MIN_W, MAP_WIDTH);
  return clampView({ w, x: b.x + b.w / 2 - w / 2, y: b.y + b.h / 2 - viewH(w) / 2 });
}

/* -------------------------------------------------------------------------- */
/* Sub-components                                                             */
/* -------------------------------------------------------------------------- */

interface ShapeProps {
  district: DistrictGeometry;
  fill: string;
  onInspect: (id: DistrictId) => void;
  onSelect: (id: DistrictId) => void;
}

const DistrictShape = memo(function DistrictShape({ district, fill, onInspect, onSelect }: ShapeProps) {
  const isKonkan = district.division === 'konkan';
  return (
    <path
      d={district.path}
      fill={fill}
      stroke={isKonkan ? '#0F766E' : '#CBD5E1'}
      strokeWidth={isKonkan ? 1.5 : 0.75}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      opacity={isKonkan ? 1 : 0.45}
      className="cursor-pointer transition-[fill,opacity] duration-150"
      onMouseEnter={() => onInspect(district.id)}
      onClick={() => onSelect(district.id)}
    />
  );
});

const mapButton =
  'h-6 min-w-6 px-1.5 rounded border border-slate-200 bg-white/95 text-[11px] font-bold text-gov-primary shadow-2xs ' +
  'hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gov-blue transition-colors';

/* -------------------------------------------------------------------------- */
/* Main GISMap Component with Locked Safe View                                 */
/* -------------------------------------------------------------------------- */

const LABEL_PX = 9;
const LABEL_CHAR_PX = 5;

export const GISMap: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId } = useDashboardStore();
  const t = useTranslation(language);
  const selectedId = resolveDistrictId(selectedDistrictId);

  // "Inspected" is sticky: stays during cursor travel to buttons
  const [inspectedId, setInspectedId] = useState<DistrictId>(selectedId ?? DEFAULT_DISTRICT_ID);
  const [colorMode, setColorMode] = useState<ColorMode>('division');
  const [view, setView] = useState<ViewBox>(FULL_VIEW);
  const [pxWidth, setPxWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ x: number; y: number; origin: ViewBox; moved: boolean; pointerId: number } | null>(null);
  const suppressClickRef = useRef(false);

  // Sync with store when other widgets change district selection
  useEffect(() => {
    if (selectedId) setInspectedId(selectedId);
  }, [selectedId]);

  // Keep screen-constant label and marker scaling
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setPxWidth(w);
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Ctrl/Cmd + wheel zoom
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      setView((v) => zoomView(v, Math.exp(-e.deltaY * 0.0025), fx, fy));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const inspectDistrict = useCallback((id: DistrictId) => setInspectedId(id), []);
  const selectDistrict = useCallback(
    (id: DistrictId) => {
      if (suppressClickRef.current) return;
      setInspectedId(id);
      setSelectedDistrictId(id);
    },
    [setSelectedDistrictId]
  );

  /* Drag to pan when zoomed in */
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 || view.w >= MAP_WIDTH) return;
    dragRef.current = { x: e.clientX, y: e.clientY, origin: view, moved: false, pointerId: e.pointerId };
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
    }
    const unit = d.origin.w / pxWidth;
    setView(clampView({ ...d.origin, x: d.origin.x - dx * unit, y: d.origin.y - dy * unit }));
  };

  const endDrag = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.moved) {
      suppressClickRef.current = true;
      setTimeout(() => (suppressClickRef.current = false), 0);
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  /* Derived values */
  const inspected = DISTRICT_BY_ID[inspectedId] ?? DISTRICT_BY_ID[DEFAULT_DISTRICT_ID];
  const inspectedDio = DIO_BY_DISTRICT[inspectedId];
  const inspectedStatus = statusOf(inspectedId);
  const isZoomed = view.w < MAP_WIDTH - 0.5;
  const unit = view.w / pxWidth;

  const fillFor = (d: DistrictGeometry): string => {
    if (d.id === selectedId) return COLORS.selected;
    if (d.id === inspectedId) return COLORS.inspected;
    const isKonkan = d.division === 'konkan';
    if (!isKonkan) {
      return '#E2E8F0';
    }
    return colorMode === 'division' ? '#14B8A6' : STATUS_FILL[statusOf(d.id)];
  };

  // Only label districts large enough on screen
  const labelled = DISTRICT_GEOMETRY.filter((d) => {
    if (d.id === inspectedId) return false;
    const widthPx = d.bbox.w / unit;
    const heightPx = d.bbox.h / unit;
    return widthPx * 0.85 >= d.label.length * LABEL_CHAR_PX && heightPx >= LABEL_PX * 1.6;
  });

  const legend = {
    division: DISTRICTS_BY_DIVISION.map(({ div, districts }) => ({
      key: div,
      label: language === 'en' ? DIVISIONS[div].name : DIVISIONS[div].nameMr,
      color: DIVISION_FILL[div],
      count: districts.length,
    })),
    status: STATUS_ORDER.map((s) => ({
      key: s,
      label:
        language === 'en'
          ? s
          : s === 'Active'
          ? 'सक्रिय'
          : s === 'Standby'
          ? 'प्रतीक्षारत'
          : s === 'Field Operation'
          ? 'क्षेत्रीय मोहीम'
          : 'कॉन्फिगर नाही',
      color: STATUS_FILL[s],
      count: STATUS_COUNTS[s],
    })),
  };

  const divisionName = language === 'en' ? DIVISIONS[inspected.division].name : DIVISIONS[inspected.division].nameMr;
  const districtTitle =
    language === 'en'
      ? `District: ${inspected.name}`
      : `जिल्हा: ${inspected.nameMr}`;

  const districtSub = language === 'en' ? `${divisionName} Division` : `${divisionName} विभाग`;
  const officerName = inspectedDio
    ? (language === 'mr' ? (getOfficerInfo(inspectedDio.officer, 'mr')?.name || inspectedDio.officer) : inspectedDio.officer)
    : (language === 'en' ? 'Not assigned' : 'नियुक्त नाही');

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col h-full shadow-xs overflow-hidden">
      {/* 1. Locked Safe Header (Fixed 52px height) */}
      <div className="px-4 py-2 border-b border-slate-200 bg-surface flex items-center justify-between gap-3 h-[52px] min-h-[52px] max-h-[52px] shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-gov-primary tracking-tight truncate" title={t.leadership.gisTitle}>
            {t.leadership.gisTitle}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium truncate" title={t.leadership.gisSub}>
            {t.leadership.gisSub}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="gis-district-select" className="sr-only">
            {language === 'en' ? 'Select a district' : 'जिल्हा निवडा'}
          </label>
          <select
            id="gis-district-select"
            value={selectedId ?? ''}
            onChange={(e) => selectDistrict(e.target.value as DistrictId)}
            className="text-[11px] font-semibold text-gov-primary bg-white border border-slate-200 rounded px-2 py-1 max-w-[150px] truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gov-blue"
          >
            {!selectedId && (
              <option value="" disabled>
                {language === 'en' ? 'Select district…' : 'जिल्हा निवडा…'}
              </option>
            )}
            {DISTRICTS_BY_DIVISION.map(({ div, districts }) => (
              <optgroup
                key={div}
                label={
                  language === 'en'
                    ? `${DIVISIONS[div].name} division`
                    : `${DIVISIONS[div].nameMr} विभाग`
                }
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {language === 'en' ? d.name : d.nameMr}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap shrink-0">
            {DISTRICT_GEOMETRY.length} {language === 'mr' ? 'माहिती नेटवर्क' : 'DIO Network'}
          </span>
        </div>
      </div>

      {/* 2. Main Safe Body (Columns with Locked Geometry) */}
      <div className="p-3 flex-1 flex flex-col md:flex-row gap-3.5 items-stretch min-w-0">
        {/* Left: Map Canvas Column (58% width, aspect locked) */}
        <div className="w-full md:w-[58%] flex flex-col justify-between gap-2 min-w-0">
          <div
            className="relative w-full aspect-[800/664] bg-gradient-to-b from-slate-50 to-blue-50/30 rounded-lg border border-slate-200 overflow-hidden shadow-inner shrink-0"
          >
            <svg
              ref={svgRef}
              viewBox={`${view.x} ${view.y} ${view.w} ${viewH(view.w)}`}
              role="img"
              aria-label={`Interactive map of Maharashtra with all ${DISTRICT_GEOMETRY.length} districts.`}
              className={`absolute inset-0 w-full h-full ${
                isDragging ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : ''
              }`}
              style={{ touchAction: isZoomed ? 'none' : 'auto' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {/* All 36 Districts */}
              {DISTRICT_GEOMETRY.map((d) => (
                <DistrictShape
                  key={d.id}
                  district={d}
                  fill={fillFor(d)}
                  onInspect={inspectDistrict}
                  onSelect={selectDistrict}
                />
              ))}

              {/* Division borders and state outline */}
              <g fill="none" stroke={COLORS.divisionBorder} strokeLinejoin="round" pointerEvents="none">
                <path d={DIVISION_BORDERS_PATH} strokeWidth={1.5} strokeOpacity={0.55} vectorEffect="non-scaling-stroke" />
                <path d={STATE_OUTLINE_PATH} strokeWidth={1.75} vectorEffect="non-scaling-stroke" />
              </g>

              {/* Highlight outlines on top */}
              {inspectedId !== selectedId && inspected && (
                <path
                  d={inspected.path}
                  fill="none"
                  stroke={COLORS.inspected}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              )}
              {selectedId && DISTRICT_BY_ID[selectedId] && (
                <path
                  d={DISTRICT_BY_ID[selectedId].path}
                  fill="none"
                  stroke={COLORS.selected}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                />
              )}

              {/* District names */}
              <g
                className="select-none"
                pointerEvents="none"
                fontSize={LABEL_PX * unit}
                fontWeight={600}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {labelled.map((d) => {
                  const isSelected = d.id === selectedId;
                  const labelText = language === 'en' ? d.label : d.nameMr;
                  return (
                    <g key={d.id}>
                      <text
                        x={d.pin.x}
                        y={d.pin.y}
                        fill="none"
                        stroke={isSelected ? COLORS.selected : '#FFFFFF'}
                        strokeWidth={LABEL_PX * unit * 0.28}
                        strokeLinejoin="round"
                      >
                        {labelText}
                      </text>
                      <text x={d.pin.x} y={d.pin.y} fill={isSelected ? '#FFFFFF' : '#0F172A'}>
                        {labelText}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Marker pin on inspected district */}
              {inspected && (
                <g transform={`translate(${inspected.pin.x} ${inspected.pin.y}) scale(${unit})`} pointerEvents="none">
                  <circle
                    r={7}
                    fill={COLORS.pin}
                    opacity={0.25}
                  />
                  <circle r={5} fill={COLORS.pin} stroke="#FFFFFF" strokeWidth={1.5} />
                  <circle r={2} fill="#FFFFFF" />
                </g>
              )}
            </svg>

            {/* Interactive Zoom controls */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <button
                type="button"
                className={mapButton}
                aria-label="Zoom out"
                disabled={!isZoomed}
                onClick={() => setView((v) => zoomView(v, 1 / 1.6))}
                title="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                className={mapButton}
                aria-label="Zoom in"
                disabled={view.w <= MIN_W + 0.01}
                onClick={() => setView((v) => zoomView(v, 1.6))}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                className={mapButton}
                aria-label={`Zoom to ${inspected.name}`}
                onClick={() => setView(fitView(inspected.bbox))}
                title={`Zoom to ${inspected.name}`}
              >
                {language === 'en' ? 'Zoom to district' : language === 'mr' ? 'जिल्हा झूम' : 'ज़िला ज़ूम'}
              </button>
              <button
                type="button"
                className={mapButton}
                disabled={!isZoomed}
                onClick={() => setView(FULL_VIEW)}
                title="Reset View"
              >
                {language === 'en' ? 'Reset' : language === 'mr' ? 'मूळ स्थिती' : 'रीसेट'}
              </button>
            </div>
          </div>

          {/* Safe View: Fixed Legend Bar (34px invariant height) */}
          <div className="h-[34px] min-h-[34px] max-h-[34px] flex items-center justify-between gap-2 overflow-hidden shrink-0">
            <div
              role="group"
              aria-label="Colour the map by"
              className="inline-flex rounded border border-slate-200 overflow-hidden text-[10px] font-semibold shrink-0"
            >
              {(['division', 'status'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={colorMode === mode}
                  onClick={() => setColorMode(mode)}
                  className={`px-2 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gov-blue ${
                    colorMode === mode ? 'bg-gov-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode === 'division'
                    ? language === 'en' ? 'Division' : language === 'mr' ? 'विभाग' : 'प्रभाग'
                    : language === 'en' ? 'Status' : language === 'mr' ? 'स्थिती' : 'स्थिति'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-x-2.5 text-[10px] text-slate-600 whitespace-nowrap">
              {legend[colorMode].map((item) => (
                <span key={item.key} className="inline-flex items-center gap-1 shrink-0" title={`${item.label} (${item.count})`}>
                  <span
                    className="h-2 w-2 rounded-xs border border-slate-300 shrink-0"
                    style={{ background: item.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                  <span className="text-slate-400">({item.count})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Safe View: Fixed Single-Line Helper Note (16px invariant height) */}
          <p
            className="text-[10px] text-slate-400 truncate h-4 min-h-4 shrink-0 leading-none"
            title={
              language === 'mr'
                ? 'समक्रमित करण्यासाठी जिल्ह्यावर क्लिक करा. नकाशा झूम व पॅन करण्यासाठी स्क्रोल करा.'
                : 'Click district to sync. Ctrl/⌘+scroll to zoom, drag to pan. Census 2011/2014 topology.'
            }
          >
            {language === 'mr'
              ? 'समक्रमित करण्यासाठी जिल्ह्यावर क्लिक करा. नकाशा झूम व पॅन करण्यासाठी स्क्रोल करा.'
              : 'Click district to sync. Ctrl/⌘+scroll to zoom, drag to pan. Census 2011/2014 topology.'}
          </p>
        </div>

        {/* Right: Locked Safe Hover Card (42% width, invariant height and row bounds) */}
        <div className="w-full md:w-[42%] border-2 border-gov-blue/30 p-3 rounded-lg bg-white shadow-xs flex flex-col justify-between h-full min-h-[280px] max-h-[380px] overflow-hidden min-w-0">
          {/* Card Header (Fixed bounds with truncation) */}
          <div className="pb-2 border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                {language === 'mr' ? 'जिल्हा थेट स्थिती' : 'District Live State'}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    inspectedStatus === 'Active'
                      ? 'bg-emerald-500 animate-pulse'
                      : inspectedStatus === 'Standby'
                      ? 'bg-amber-500'
                      : inspectedStatus === 'Field Operation'
                      ? 'bg-blue-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold ${
                    inspectedStatus === 'Active'
                      ? 'text-emerald-600'
                      : inspectedStatus === 'Standby'
                      ? 'text-amber-600'
                      : inspectedStatus === 'Field Operation'
                      ? 'text-blue-600'
                      : 'text-slate-500'
                  }`}
                >
                  {language === 'mr' ? 'माहिती अधिकारी:' : 'DIO:'} {getLocalizedStatus(inspectedStatus, language)}
                </span>
              </div>
            </div>
            <h4
              className="text-sm font-bold text-gov-primary truncate"
              title={language === 'mr' ? inspected.nameMr : inspected.name}
            >
              {districtTitle}
            </h4>
            <p lang={language} className="text-[11px] text-slate-500 truncate" title={districtSub}>
              {districtSub}
            </p>
          </div>

          {/* Card Data Rows: 4 Invariant Height Rows (24px each with truncation) */}
          <div className="py-2 space-y-1.5 text-xs text-slate-700 shrink-0">
            <div className="flex items-center justify-between gap-2 h-6 border-b border-slate-100 pb-1">
              <span className="text-slate-500 shrink-0 text-[11px]">
                {language === 'en' ? 'Liaison Officer:' : 'संपर्क अधिकारी:'}
              </span>
              <strong
                className="text-slate-900 text-right truncate flex-1 min-w-0 text-[11px]"
                title={officerName}
              >
                {officerName}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-2 h-6 border-b border-slate-100 pb-1">
              <span className="text-slate-500 shrink-0 text-[11px]">
                {language === 'mr' ? 'प्रशासकीय विभाग:' : 'Administrative Division:'}
              </span>
              <strong
                className="text-slate-900 text-right truncate flex-1 min-w-0 text-[11px]"
                title={divisionName}
              >
                {divisionName}
              </strong>
            </div>

            <div className="flex items-center justify-between gap-2 h-6 border-b border-slate-100 pb-1">
              <span className="text-slate-500 shrink-0 text-[11px]">
                {language === 'mr' ? 'माहिती गेटवे:' : 'DIO Gateway:'}
              </span>
              {inspectedDio ? (
                <span className="font-mono text-emerald-700 font-semibold text-[10px]">
                  {language === 'mr' ? '२४x७ जोडलेले' : '24x7 Connected'}
                </span>
              ) : (
                <span className="font-mono text-slate-400 font-semibold text-[10px]">
                  {language === 'mr' ? 'कॉन्फिगर नाही' : 'Not configured'}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 h-6">
              <span className="text-slate-500 shrink-0 text-[11px]">
                {language === 'mr' ? 'जनगणना / एलजीडी कोड:' : 'Census / LGD Code:'}
              </span>
              <span className="font-mono text-slate-600 text-[10px]">
                {inspected.censusCode} / {inspected.lgdCode}
              </span>
            </div>
          </div>

          {/* Card Action Button (Fixed 32px height) */}
          <button
            onClick={() => selectDistrict(inspectedId)}
            className="w-full h-8 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-[11px] font-bold transition-colors shadow-2xs truncate px-2 shrink-0 flex items-center justify-center mt-1"
            title={language === 'mr' ? 'तपशीलवार जिल्हा डॅशबोर्ड उघडा' : 'View Full District Telemetry'}
          >
            {language === 'mr' ? 'तपशीलवार जिल्हा डॅशबोर्ड उघडा' : 'View Full District Telemetry'}
          </button>
        </div>
      </div>
    </div>
  );
};
