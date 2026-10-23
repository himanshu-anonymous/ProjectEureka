'use client';

import React, { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getLocalizedStatus, getOfficerInfo } from '@/lib/dataLocalization';
import { GISMapSkeleton } from '@/components/skeletons/GISMapSkeleton';
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
import { DISTRICT_DETAILS_BY_ID, ALL_HOARDINGS, HoardingRecord } from '@/data/maharashtraDistrictsData';
import { INITIAL_DISTRICTS } from '@/data/dashboardData';
import {
  HIGHWAY_CORRIDORS,
  MAJOR_RIVERS,
  KEY_TOWNS,
  STATE_LANDMARKS,
  WATER_RESERVOIRS,
  NATURE_RESERVES,
  RAILWAY_TRUNK_LINES,
  TERRAIN_RIDGES,
  COASTAL_BATHYMETRY_PATHS,
  GIS_GRATICULE_GRID,
  type KeyTown,
  type StateLandmark,
  type HighwayCorridor,
  type WaterReservoir,
  type NatureReserve,
  type RailwayTrunkLine,
} from '@/data/maharashtraGISDetailData';

/* -------------------------------------------------------------------------- */
/* Types & Styling Constants (Google Maps Inspired Government Cartography)    */
/* -------------------------------------------------------------------------- */

type StatusKey = DioStatus | 'Not configured';

interface ViewBox {
  x: number;
  y: number;
  w: number;
}

const PALETTE = {
  water: '#CBE8FC', // Google Maps Pastel Ocean Sky
  waterGradientStart: '#BBE2FB',
  waterGradientEnd: '#D8EFFE',
  landOutline: '#CBD5E1',
  districtStroke: '#D1D5DB', // Google Maps Subtle Administrative Boundary
  divisionStroke: '#64748B', // Divisional Boundary
  selectedDistrict: '#1E293B', // Selected Executive Navy
  inspectedDistrict: '#334155', // Slate Navy
  // Google Maps Road Colors (Warm sand/cream highway, white arterial road with soft gray casing - NO bright orange!)
  highwayCasing: '#CBD5E1',
  highwayFill: '#FEEFC3', // Google Maps Signature Highway Warm Sand/Cream (#FEEFC3)
  expresswayCasing: '#CBD5E1',
  expresswayFill: '#FDE293', // Google Maps Signature Expressway Warm Amber/Gold (#FDE293)
  // Google Maps Natural Waterways (Soft realistic water - NO harsh electric cyan!)
  riverWater: '#AADAFF', // Blends seamlessly into natural waterbodies
  riverOpacity: 0.65,
  reservoirFill: '#D2E3FC', // Natural Google Maps lake fill
  reservoirBorder: '#B9D7F9', // Soft subtle lake boundary
  reserveFill: '#E6F4EA', // Google Maps Soft Park Green
  reserveBorder: '#CEEAD6',
  railwayLine: '#475569',
  railwayDashes: '#FFFFFF',
  terrainRelief: '#E2E8F0', // Soft hill shading
  terrainRidge: '#94A3B8',
  townDot: '#1E293B',
  landmarkNavy: '#0F172A',
  badgeBg: '#0F172A',
  badgeText: '#FFFFFF',
};

// Clean Google Maps-style neutral district fills (monochrome tone)
const DISTRICT_NEUTRAL_FILLS: Record<DivisionId, string> = {
  konkan: '#F8FAFC',
  nashik: '#FFFFFF',
  pune: '#F8FAFC',
  'chhatrapati-sambhajinagar': '#FFFFFF',
  amravati: '#F8FAFC',
  nagpur: '#FFFFFF',
};

const DEFAULT_DISTRICT_ID: DistrictId = 'thane';

const LEGACY_ID_ALIASES: Record<string, DistrictId> = {
  mumbai: 'mumbai-city',
  aurangabad: 'chhatrapati-sambhajinagar',
  ahmednagar: 'ahilyanagar',
  osmanabad: 'dharashiv',
};

/** Deterministic District Numbering 1 to 36 */
export const DISTRICT_NUMBERS: Record<string, number> = {
  thane: 1,
  pune: 2,
  'mumbai-city': 3,
  'mumbai-suburban': 4,
  nagpur: 5,
  'chhatrapati-sambhajinagar': 6,
  nashik: 7,
  kolhapur: 8,
  solapur: 9,
  amravati: 10,
  nanded: 11,
  jalgaon: 12,
  ahilyanagar: 13,
  sangli: 14,
  satara: 15,
  raigad: 16,
  palghar: 17,
  ratnagiri: 18,
  sindhudurg: 19,
  akola: 20,
  latur: 21,
  dhule: 22,
  chandrapur: 23,
  parbhani: 24,
  jalna: 25,
  beed: 26,
  yavatmal: 27,
  buldhana: 28,
  gondia: 29,
  wardha: 30,
  dharashiv: 31,
  bhandara: 32,
  washim: 33,
  hingoli: 34,
  nandurbar: 35,
  gadchiroli: 36,
};

const statusOf = (id: DistrictId): StatusKey => DIO_BY_DISTRICT[id]?.status ?? 'Not configured';

function resolveDistrictId(id: string | null | undefined): DistrictId | null {
  if (!id) return null;
  if (Object.prototype.hasOwnProperty.call(DISTRICT_BY_ID, id)) return id as DistrictId;
  return LEGACY_ID_ALIASES[id] ?? null;
}

const DISTRICTS_BY_DIVISION = DIVISION_ORDER.map((div) => ({
  div,
  districts: DISTRICT_GEOMETRY.filter((d) => d.division === div),
}));

/* -------------------------------------------------------------------------- */
/* Pure Math & View Bounds                                                    */
/* -------------------------------------------------------------------------- */

const MIN_W = MAP_WIDTH / 10; // Max zoom 10x
const FULL_VIEW: ViewBox = { x: 0, y: 0, w: MAP_WIDTH };
const viewH = (w: number) => (w * MAP_HEIGHT) / MAP_WIDTH;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function clampView(v: ViewBox): ViewBox {
  const w = clamp(v.w, MIN_W, MAP_WIDTH);
  return { w, x: clamp(v.x, 0, MAP_WIDTH - w), y: clamp(v.y, 0, MAP_HEIGHT - viewH(w)) };
}

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

function getDivisionBbox(div: DivisionId) {
  const dList = DISTRICT_GEOMETRY.filter((d) => d.division === div);
  if (dList.length === 0) return { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  dList.forEach((d) => {
    minX = Math.min(minX, d.bbox.x);
    minY = Math.min(minY, d.bbox.y);
    maxX = Math.max(maxX, d.bbox.x + d.bbox.w);
    maxY = Math.max(maxY, d.bbox.y + d.bbox.h);
  });
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/* -------------------------------------------------------------------------- */
/* Sub-component: District Polygon Shape                                      */
/* -------------------------------------------------------------------------- */

interface DistrictShapeProps {
  district: DistrictGeometry;
  isSelected: boolean;
  isInspected: boolean;
  isDimmed: boolean;
  onInspect: (id: DistrictId) => void;
  onSelect: (id: DistrictId) => void;
  onHoverState: (d: DistrictGeometry | null, pos: { x: number; y: number } | null) => void;
}

const DistrictShape = memo(function DistrictShape({
  district,
  isSelected,
  isInspected,
  isDimmed,
  onInspect,
  onSelect,
  onHoverState,
}: DistrictShapeProps) {
  const fill = isSelected
    ? PALETTE.selectedDistrict
    : isInspected
    ? PALETTE.inspectedDistrict
    : DISTRICT_NEUTRAL_FILLS[district.division];

  return (
    <path
      d={district.path}
      fill={fill}
      stroke={isSelected ? '#F59E0B' : isInspected ? '#38BDF8' : PALETTE.districtStroke}
      strokeWidth={isSelected ? 3 : isInspected ? 2 : 0.8}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      opacity={isDimmed ? 0.3 : 1}
      className="cursor-pointer transition-colors duration-150 hover:brightness-95"
      onMouseEnter={(e) => {
        onHoverState(district, { x: e.clientX, y: e.clientY });
      }}
      onMouseMove={(e) => {
        onHoverState(district, { x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => onHoverState(null, null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(district.id);
        onInspect(district.id);
      }}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* Main GISMap Component                                                      */
/* -------------------------------------------------------------------------- */

export const GISMap: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, isLoadingData } = useDashboardStore();
  const t = useTranslation(language);
  const selectedId = resolveDistrictId(selectedDistrictId);

  const [inspectedId, setInspectedId] = useState<DistrictId>(selectedId ?? DEFAULT_DISTRICT_ID);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  
  // Layer Toggles
  const [showDistrictNumbers, setShowDistrictNumbers] = useState<boolean>(true);
  const [showHighways, setShowHighways] = useState<boolean>(true);
  const [showRailways, setShowRailways] = useState<boolean>(true);
  const [showWaterAndTerrain, setShowWaterAndTerrain] = useState<boolean>(true);
  const [showTowns, setShowTowns] = useState<boolean>(true);
  const [showHoardings, setShowHoardings] = useState<boolean>(false);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);

  const [view, setView] = useState<ViewBox>(FULL_VIEW);
  const [pxWidth, setPxWidth] = useState(700);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [hoveredTown, setHoveredTown] = useState<KeyTown | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<StateLandmark | null>(null);
  const [hoveredHoarding, setHoveredHoarding] = useState<HoardingRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ x: number; y: number; origin: ViewBox; moved: boolean; pointerId: number } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    if (selectedId && selectedId !== inspectedId) {
      setInspectedId(selectedId);
    }
  }, [selectedId, inspectedId]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const update = () => setPxWidth(el.clientWidth || 700);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Smooth wheel zoom
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      const factor = e.deltaY < 0 ? 1.25 : 1 / 1.25;
      setView((v) => zoomView(v, factor, fx, fy));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Drag-to-pan handlers
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      origin: view,
      moved: false,
      pointerId: e.pointerId,
    };
    setIsDragging(true);
    suppressClickRef.current = false;
  }, [view]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 10) {
      d.moved = true;
      suppressClickRef.current = true;
    }
    if (!d.moved) return;
    const unit = d.origin.w / pxWidth;
    setView(clampView({ ...d.origin, x: d.origin.x - dx * unit, y: d.origin.y - dy * unit }));
  }, [pxWidth]);

  const endDrag = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    setView((v) => zoomView(v, 1.8, fx, fy));
  }, []);

  const inspectDistrict = useCallback((id: DistrictId) => {
    setInspectedId(id);
  }, []);

  const selectDistrict = useCallback((id: DistrictId) => {
    if (suppressClickRef.current) return;
    setSelectedDistrictId(id);
    setInspectedId(id);
  }, [setSelectedDistrictId]);

  const handleHoverState = useCallback(
    (d: DistrictGeometry | null, pos: { x: number; y: number } | null) => {
      setHoveredDistrict(d);
      setTooltipPos(pos);
    },
    []
  );

  const zoomFactor = MAP_WIDTH / view.w;
  const isZoomed = view.w < MAP_WIDTH - 1;
  const unit = view.w / pxWidth;

  // Progressive Level of Detail (Google Maps LOD thresholds)
  const isLOD2 = zoomFactor >= 1.35; // Highways, major rivers, and reservoirs appear
  const isLOD3 = zoomFactor >= 2.4;  // Sub-district talukas, landmarks, and fine details appear

  // Dynamic Google Maps scale bar calculation
  const kmPerSvgUnit = 1.05;
  const targetKm = zoomFactor > 3 ? 20 : zoomFactor > 1.8 ? 50 : 100;
  const scalePxWidth = targetKm / kmPerSvgUnit;
  const scaleKm = targetKm;

  const inspected = DISTRICT_BY_ID[inspectedId] ?? DISTRICT_BY_ID[DEFAULT_DISTRICT_ID];
  const inspectedStatus = statusOf(inspected.id);
  const officerName = getOfficerInfo(inspected.id, language)?.name || (language === 'mr' ? 'माहिती अधिकारी' : 'District Information Officer');
  const inspectedDetails = DISTRICT_DETAILS_BY_ID[inspected.id];
  const divisionName = DIVISIONS[inspected.division]?.name || 'Maharashtra';
  const storeDistrict = INITIAL_DISTRICTS.find((d) => d.id === inspected.id);

  // Count active hoardings across state
  const totalStateHoardings = ALL_HOARDINGS.length;

  if (isLoadingData) {
    return <GISMapSkeleton />;
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
      {/* 1. Header Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col gap-3 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {language === 'mr'
                  ? 'महाराष्ट्र राज्य जीआयएस नकाशा (प्रशासकीय व भौगोलिक माहिती)'
                  : 'Maharashtra State Geographic Information System (GIS)'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? '३६ जिल्हे, महामार्ग, जलसंपदा व तालुका संपर्क जाळे (गुगल मॅप्स शैली)'
                : '36 Districts, Highway Network, Water Reservoirs & Sub-District Talukas (Google Maps Style)'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-[11px]">
              Zoom: {Math.round(zoomFactor * 100)}%
            </span>
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-[11px]">
              36 Districts (#1 to #36)
            </span>
          </div>
        </div>

        {/* Division Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium shrink-0 mr-1 text-[11px]">
            {language === 'mr' ? 'विभाग निवडा:' : 'Division:'}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedDivisionFilter('all');
              setView(FULL_VIEW);
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedDivisionFilter === 'all'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {language === 'mr' ? 'सर्व ३६ जिल्हे' : 'All 36 Districts'}
          </button>

          {DIVISION_ORDER.map((divId) => {
            const isCurrent = selectedDivisionFilter === divId;
            const divLabel = language === 'mr' ? DIVISIONS[divId].nameMr : DIVISIONS[divId].name;
            return (
              <button
                key={divId}
                type="button"
                onClick={() => {
                  setSelectedDivisionFilter(divId);
                  const bbox = getDivisionBbox(divId);
                  setView(fitView(bbox));
                }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {divLabel}
              </button>
            );
          })}
        </div>

        {/* Quick District Index Selector Ribbon (#1 to #36) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-2">
          <span className="text-slate-500 font-bold shrink-0 mr-1 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {language === 'mr' ? 'जिल्हा क्रमांक (#१-३६):' : 'Districts (#1-36):'}
          </span>
          {DISTRICT_GEOMETRY.map((d) => {
            const num = DISTRICT_NUMBERS[d.id] ?? 0;
            const isSelected = d.id === selectedId;
            const isInspected = d.id === inspectedId;
            const active = isSelected || isInspected;
            return (
              <button
                key={`ribbon-${d.id}`}
                type="button"
                onClick={() => {
                  selectDistrict(d.id);
                  setView(fitView(d.bbox));
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title={`#${num} ${d.name} (${d.nameMr})`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                    active ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {num}
                </span>
                <span className="truncate">{language === 'mr' ? d.nameMr : d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Map Canvas (Google Maps Progressive Rendering) */}
      <div className="p-3 sm:p-4 bg-[#F8FAFC]">
        <div className="relative w-full aspect-[800/664] min-h-[300px] sm:min-h-[360px] max-h-[640px] flex items-center justify-center bg-[#F1F5F9] rounded-xl border border-slate-300 overflow-hidden shadow-inner">
          <svg
            ref={svgRef}
            viewBox={`${view.x} ${view.y} ${view.w} ${viewH(view.w)}`}
            role="img"
            aria-label="Interactive map of Maharashtra with progressive Google Maps detail."
            className={`absolute inset-0 w-full h-full select-none ${
              isDragging ? 'cursor-grabbing' : isZoomed ? 'cursor-grab' : 'cursor-default'
            }`}
            style={{ touchAction: isZoomed ? 'none' : 'auto' }}
            onDoubleClick={handleDoubleClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <defs>
              {/* Realistic Google Maps Sea Water Gradient */}
              <linearGradient id="gmap-sea" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBE8FC" />
                <stop offset="65%" stopColor="#D9EEFD" />
                <stop offset="100%" stopColor="#F8FAFC" />
              </linearGradient>

              {/* Terrain Hill Shading Pattern */}
              <pattern id="terrain-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.25" />
              </pattern>
            </defs>

            {/* Ocean Coastline (Arabian Sea Background - Clean Google Maps Water) */}
            <rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gmap-sea)" />

            {/* GIS Lat/Long Graticule Grid */}
            {showGraticule && (
              <g pointerEvents="none" opacity={0.35}>
                {GIS_GRATICULE_GRID.map((grid, idx) => (
                  <g key={`grid-${idx}`}>
                    <line
                      x1={grid.x1}
                      y1={grid.y1}
                      x2={grid.x2}
                      y2={grid.y2}
                      stroke="#94A3B8"
                      strokeWidth={0.7 * unit}
                      strokeDasharray="3 4"
                    />
                    <text
                      x={grid.type === 'lat' ? 104 : grid.x1}
                      y={grid.type === 'lat' ? grid.y1 - 2 : 65}
                      fontSize={7 * unit}
                      fill="#64748B"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {grid.label}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* State Outer Outline Landmass Base */}
            <path
              d={STATE_OUTLINE_PATH}
              fill="#FFFFFF"
              stroke="#64748B"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />

            {/* Nature Reserves & Forest Biospheres (Soft Green) */}
            {showWaterAndTerrain &&
              NATURE_RESERVES.map((res) => (
                <g key={`res-${res.id}`} pointerEvents="none">
                  <path
                    d={res.path}
                    fill={PALETTE.reserveFill}
                    stroke={PALETTE.reserveBorder}
                    strokeWidth={0.8 * unit}
                    strokeDasharray="2 2"
                    opacity={0.85}
                  />
                  {isLOD2 && (
                    <text
                      x={res.labelX}
                      y={res.labelY}
                      fontSize={4 * unit}
                      fill="#15803D"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {language === 'mr' ? res.nameMr : res.name}
                    </text>
                  )}
                </g>
              ))}

            {/* Sahyadri Western Ghats Mountain Ridges */}
            {showWaterAndTerrain &&
              TERRAIN_RIDGES.map((ridge) => (
                <g key={`ridge-${ridge.id}`} pointerEvents="none">
                  {/* Soft elevation relief band */}
                  <path
                    d={ridge.path}
                    fill="none"
                    stroke="#D6D3D1"
                    strokeWidth={10 * unit}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.5}
                  />
                  {/* Sharp Ridge Crest */}
                  <path
                    d={ridge.path}
                    fill="none"
                    stroke={PALETTE.terrainRidge}
                    strokeWidth={1.6 * unit}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.7}
                  />
                </g>
              ))}

            {/* All 36 Districts with Clean Geometry */}
            {DISTRICT_GEOMETRY.map((d) => {
              const isSelected = d.id === selectedId;
              const isInspected = d.id === inspectedId;
              const isDimmed = selectedDivisionFilter !== 'all' && d.division !== selectedDivisionFilter;
              return (
                <DistrictShape
                  key={d.id}
                  district={d}
                  isSelected={isSelected}
                  isInspected={isInspected}
                  isDimmed={isDimmed}
                  onInspect={inspectDistrict}
                  onSelect={selectDistrict}
                  onHoverState={handleHoverState}
                />
              );
            })}

            {/* Division Boundaries */}
            <g fill="none" stroke={PALETTE.divisionStroke} strokeLinejoin="round" pointerEvents="none">
              <path
                d={DIVISION_BORDERS_PATH}
                strokeWidth={1.8}
                strokeOpacity={0.7}
                strokeDasharray="5 3"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* Water Reservoirs & Dam Lakes (Clean Google Maps Lake Shading) */}
            {showWaterAndTerrain &&
              WATER_RESERVOIRS.map((res) => (
                <g key={`resv-${res.id}`} pointerEvents="none">
                  <path
                    d={res.path}
                    fill={PALETTE.reservoirFill}
                    stroke={PALETTE.reservoirBorder}
                    strokeWidth={0.9 * unit}
                    opacity={0.92}
                  />
                  {isLOD2 && (
                    <text
                      x={res.labelX}
                      y={res.labelY}
                      fontSize={4 * unit}
                      fill="#1E40AF"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {language === 'mr' ? res.nameMr : res.name}
                    </text>
                  )}
                </g>
              ))}

            {/* Major Rivers (Natural Soft Water Blue - Seamless Google Maps Cartography) */}
            {showWaterAndTerrain && isLOD2 && (
              <g fill="none" stroke={PALETTE.riverWater} strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
                {MAJOR_RIVERS.map((river) => (
                  <path
                    key={`river-${river.id}`}
                    d={river.path}
                    strokeWidth={2.4 * unit}
                    strokeOpacity={PALETTE.riverOpacity}
                  />
                ))}
              </g>
            )}

            {/* Railway Trunk Lines (Indian Railways Central & Western) */}
            {showRailways && isLOD2 && (
              <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
                {RAILWAY_TRUNK_LINES.map((rail) => (
                  <g key={`rail-${rail.id}`}>
                    {/* Dark track casing */}
                    <path
                      d={rail.path}
                      stroke="#475569"
                      strokeWidth={2.2 * unit}
                      strokeOpacity={0.75}
                    />
                    {/* Railway cross-tie dash effect */}
                    <path
                      d={rail.path}
                      stroke="#FFFFFF"
                      strokeWidth={1.4 * unit}
                      strokeDasharray="4 4"
                      strokeOpacity={0.9}
                    />
                  </g>
                ))}
              </g>
            )}

            {/* National Highways & Expressways (Google Maps Signature Warm Sand & Gold - No Harsh Orange) */}
            {showHighways && isLOD2 && (
              <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
                {HIGHWAY_CORRIDORS.map((hwy) => {
                  const isExpressway = hwy.type === 'expressway';
                  return (
                    <g key={`hwy-${hwy.id}`}>
                      {/* Subtle gray outer road casing */}
                      <path
                        d={hwy.path}
                        stroke={isExpressway ? PALETTE.expresswayCasing : PALETTE.highwayCasing}
                        strokeWidth={(isExpressway ? 3.6 : 2.6) * unit}
                        strokeOpacity={0.95}
                      />
                      {/* Google Maps Primary Highway Core: Warm Sand/Gold */}
                      <path
                        d={hwy.path}
                        stroke={isExpressway ? PALETTE.expresswayFill : PALETTE.highwayFill}
                        strokeWidth={(isExpressway ? 2.4 : 1.6) * unit}
                        strokeOpacity={1}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Highway Route Shields (Google Maps Style Badges) */}
            {showHighways && zoomFactor >= 1.6 && (
              <g pointerEvents="none">
                {[
                  { code: 'ME-01', x: 275, y: 236 },
                  { code: 'NH-48', x: 195, y: 440 },
                  { code: 'NH-53', x: 435, y: 175 },
                  { code: 'NH-65', x: 285, y: 410 },
                  { code: 'NH-52', x: 330, y: 260 },
                  { code: 'NH-66', x: 146, y: 460 },
                  { code: 'MTHL', x: 135, y: 316 },
                ].map((shield) => (
                  <g key={`shield-${shield.code}`} transform={`translate(${shield.x} ${shield.y}) scale(${unit})`}>
                    <rect
                      x={-10}
                      y={-4.5}
                      width={20}
                      height={9}
                      rx={2.5}
                      fill="#FFFFFF"
                      stroke="#64748B"
                      strokeWidth={0.8}
                    />
                    <text
                      x={0}
                      y={0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={3.8}
                      fontWeight="bold"
                      fill="#1E293B"
                      fontFamily="monospace"
                    >
                      {shield.code}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* Sub-District Talukas & Major Towns (LOD3: Zoom >= 2.4x) */}
            {showTowns && isLOD3 && (
              <g pointerEvents="none">
                {KEY_TOWNS.map((town) => {
                  const isMetro = town.importance === 'metro';
                  return (
                    <g key={`town-${town.id}`} transform={`translate(${town.x} ${town.y}) scale(${unit})`}>
                      {isMetro ? (
                        <>
                          <circle r={3.8} fill="#FFFFFF" stroke="#0F172A" strokeWidth={1.2} />
                          <circle r={2.2} fill="#EA580C" />
                        </>
                      ) : (
                        <>
                          <circle r={2.2} fill="#FFFFFF" stroke="#334155" strokeWidth={1} />
                          <circle r={1.2} fill="#0F172A" />
                        </>
                      )}
                      <text
                        x={isMetro ? 5 : 3.5}
                        y={0.5}
                        fill="#0F172A"
                        fontSize={isMetro ? 4.8 : 3.8}
                        fontWeight={isMetro ? 'bold' : '600'}
                        dominantBaseline="central"
                      >
                        {language === 'mr' ? town.nameMr : town.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Strategic State Landmarks (LOD3: Zoom >= 2.4x) */}
            {isLOD3 && (
              <g pointerEvents="none">
                {STATE_LANDMARKS.map((lm) => {
                  return (
                    <g key={`lm-${lm.id}`} transform={`translate(${lm.x} ${lm.y}) scale(${unit})`}>
                      <circle r={3} fill="#0F172A" stroke="#FFFFFF" strokeWidth={1} />
                      <text
                        x={4.5}
                        y={0.5}
                        fill="#0F172A"
                        fontSize={3.8}
                        fontWeight="700"
                        dominantBaseline="central"
                      >
                        {language === 'mr' ? lm.nameMr : lm.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* DISTRICT NUMBER BADGES (1 TO 36) - READABLE HIGH-CONTRAST */}
            {showDistrictNumbers &&
              DISTRICT_GEOMETRY.map((d) => {
                const num = DISTRICT_NUMBERS[d.id] ?? 0;
                const isSelected = d.id === selectedId;
                const isInspected = d.id === inspectedId;
                const isHovered = hoveredDistrict?.id === d.id;
                
                // Clear, prominent scale so numbers 1-36 are immediately legible
                const baseRadius = isSelected ? 8.5 : isHovered || isInspected ? 7.5 : 6.2;
                const badgeRadius = baseRadius * Math.max(0.85, Math.min(1.3, unit));
                const fill = isSelected ? '#D97706' : isInspected || isHovered ? '#1E40AF' : '#0F172A';
                const strokeColor = isSelected ? '#FFFFFF' : '#FFFFFF';
                const strokeWidth = isSelected ? 2 : 1.2;
                const fontSize = badgeRadius * 1.05;

                return (
                  <g
                    key={`badge-${d.id}`}
                    transform={`translate(${d.pin.x} ${d.pin.y})`}
                    className="cursor-pointer select-none transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectDistrict(d.id);
                    }}
                    onMouseEnter={() => {
                      setHoveredDistrict(d);
                    }}
                    onMouseLeave={() => {
                      setHoveredDistrict(null);
                    }}
                  >
                    {/* Outer high-contrast shadow/halo */}
                    <circle r={badgeRadius + 2} fill="#FFFFFF" opacity={0.95} />
                    {/* Badge circle */}
                    <circle
                      r={badgeRadius}
                      fill={fill}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    {/* Readable bold number */}
                    <text
                      x={0}
                      y={0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize={fontSize}
                      fontWeight="bold"
                      fontFamily="monospace"
                      letterSpacing="-0.5"
                    >
                      {num}
                    </text>
                  </g>
                );
              })}

            {/* DISTRICT LABELS (Dual Script with High-Contrast White Halo) */}
            {DISTRICT_GEOMETRY.map((d) => {
              const isSelected = d.id === selectedId;
              const isInspected = d.id === inspectedId;
              const labelText = language === 'en' ? d.label : d.nameMr;
              const labelY = d.pin.y + 6.8 * unit;

              if (!isLOD2 && !isSelected && !isInspected && d.bbox.w / unit < 35) return null;

              return (
                <g key={`lbl-${d.id}`} pointerEvents="none">
                  {/* Halo stroke */}
                  <text
                    x={d.pin.x}
                    y={labelY}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.4 * unit}
                    strokeLinejoin="round"
                    fontSize={10 * unit}
                    fontWeight={700}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {labelText}
                  </text>
                  {/* Foreground text */}
                  <text
                    x={d.pin.x}
                    y={labelY}
                    fill={isSelected ? '#1B2A4A' : isInspected ? '#1E40AF' : '#0F172A'}
                    fontSize={10 * unit}
                    fontWeight={700}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {labelText}
                  </text>
                </g>
              );
            })}

            {/* OUTDOOR HOARDINGS PIN LAYER (Toggleable) */}
            {showHoardings &&
              DISTRICT_GEOMETRY.map((d) => {
                const hCount = DISTRICT_DETAILS_BY_ID[d.id]?.hoardings?.length ?? 0;
                if (hCount === 0) return null;
                const pinX = d.pin.x + 7.5 * unit;
                const pinY = d.pin.y - 6.5 * unit;

                return (
                  <g
                    key={`hoard-${d.id}`}
                    transform={`translate(${pinX} ${pinY}) scale(${unit})`}
                    pointerEvents="none"
                  >
                    <rect
                      x={-4}
                      y={-3}
                      width={8}
                      height={6}
                      rx={1.5}
                      fill="#0F172A"
                      stroke="#FFFFFF"
                      strokeWidth={0.8}
                    />
                    <text
                      x={0}
                      y={0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#F59E0B"
                      fontSize={4.2}
                      fontWeight="bold"
                    >
                      {hCount}
                    </text>
                  </g>
                );
              })}

            {/* Arabian Sea Watermark */}
            <text
              x={55}
              y={440}
              fontSize={14 * unit}
              fontWeight="bold"
              fill="#94A3B8"
              opacity={0.35}
              letterSpacing={4}
              pointerEvents="none"
              transform={`rotate(-75 55 440)`}
            >
              ARABIAN SEA (अरबी समुद्र)
            </text>

            {/* DYNAMIC GOOGLE MAPS SCALE BAR (Bottom-Left) */}
            <g
              transform={`translate(${view.x + 20 * unit} ${view.y + viewH(view.w) - 18 * unit}) scale(${unit})`}
              pointerEvents="none"
            >
              <rect x={0} y={0} width={scalePxWidth} height={3} fill="#0F172A" />
              <line x1={0} y1={-2} x2={0} y2={5} stroke="#0F172A" strokeWidth={1} />
              <line x1={scalePxWidth} y1={-2} x2={scalePxWidth} y2={5} stroke="#0F172A" strokeWidth={1} />
              <text x={0} y={-3} fontSize={5} fontWeight="bold" fill="#0F172A">
                0
              </text>
              <text x={scalePxWidth} y={-3} textAnchor="end" fontSize={5} fontWeight="bold" fill="#0F172A">
                {scaleKm} km
              </text>
            </g>
          </svg>

          {/* GOOGLE MAPS STYLE FLOATING CONTROL STACK (Bottom Right) */}
          <div className="absolute bottom-4 right-4 flex flex-col rounded-lg bg-white shadow-md border border-slate-200 overflow-hidden z-10">
            <button
              type="button"
              onClick={() => setView((v) => zoomView(v, 1.45))}
              className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 active:bg-slate-200 text-base font-bold transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              +
            </button>
            <div className="h-[1px] bg-slate-200 w-full" />
            <button
              type="button"
              disabled={!isZoomed}
              onClick={() => setView((v) => zoomView(v, 1 / 1.45))}
              className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 active:bg-slate-200 text-base font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              −
            </button>
            <div className="h-[1px] bg-slate-200 w-full" />
            <button
              type="button"
              onClick={() => setView(fitView(inspected.bbox))}
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              title={`Recenter on #${DISTRICT_NUMBERS[inspected.id]} ${inspected.name}`}
              aria-label="Recenter on inspected district"
            >
              ◎
            </button>
            <div className="h-[1px] bg-slate-200 w-full" />
            <button
              type="button"
              disabled={!isZoomed}
              onClick={() => {
                setView(FULL_VIEW);
                setSelectedDivisionFilter('all');
              }}
              className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:bg-slate-200 text-[10px] font-mono font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Reset to 100% full view"
              aria-label="Reset view"
            >
              1x
            </button>
          </div>

          {/* MAP LAYER BUTTONS (Top Left) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[85%]">
            <button
              type="button"
              onClick={() => setShowDistrictNumbers(!showDistrictNumbers)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showDistrictNumbers
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'क्रमांक (#१-३६)' : 'Numbers (#1-36)'}
            </button>

            <button
              type="button"
              onClick={() => setShowHighways(!showHighways)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showHighways
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'महामार्ग' : 'Highways'}
            </button>

            <button
              type="button"
              onClick={() => setShowRailways(!showRailways)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showRailways
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'रेल्वे लाईन' : 'Railways'}
            </button>

            <button
              type="button"
              onClick={() => setShowWaterAndTerrain(!showWaterAndTerrain)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showWaterAndTerrain
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'सह्याद्री व धरणे' : 'Terrain & Water'}
            </button>

            <button
              type="button"
              onClick={() => setShowTowns(!showTowns)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showTowns
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'तालुके / शहरे' : 'Talukas / Towns'}
            </button>

            <button
              type="button"
              onClick={() => setShowGraticule(!showGraticule)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showGraticule
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'अक्षांश-रेखांश' : 'GIS Grid'}
            </button>

            <button
              type="button"
              onClick={() => setShowHoardings(!showHoardings)}
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                showHoardings
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {language === 'mr' ? 'होर्डिंग्ज' : 'Hoardings'}
            </button>
          </div>

          {/* FLOATING HOVER CARD */}
          {hoveredDistrict && tooltipPos && (
            <div
              className="fixed z-50 pointer-events-none bg-slate-900 text-white rounded-lg p-3 shadow-xl border border-slate-700 max-w-xs transition-opacity duration-75 text-xs flex flex-col gap-1.5"
              style={{
                left: typeof window !== 'undefined' ? Math.min(window.innerWidth - 280, tooltipPos.x + 14) : tooltipPos.x + 14,
                top: Math.max(10, tooltipPos.y - 100),
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-slate-100 text-slate-900 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                    #{DISTRICT_NUMBERS[hoveredDistrict.id]}
                  </span>
                  <div>
                    <h5 className="font-bold text-white text-xs">{hoveredDistrict.name}</h5>
                    <span className="text-[10px] text-slate-400">{hoveredDistrict.nameMr}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  {DIVISIONS[hoveredDistrict.division].name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Collector:</span>
                  <span className="text-slate-200 font-medium truncate block">
                    {DISTRICT_DETAILS_BY_ID[hoveredDistrict.id]?.dioOffice.collectorName || 'Collector Desk'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">DIO Officer:</span>
                  <span className="text-slate-200 font-medium truncate block">
                    {DIO_BY_DISTRICT[hoveredDistrict.id]?.officer || 'DIO Officer'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Citizen Resolution:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {hoveredDistrict ? (Math.min(99.8, Math.max(93.5, 100 - ((DISTRICT_DETAILS_BY_ID[hoveredDistrict.id]?.quickStats ? 35 : 38) / 25)))).toFixed(1) : '98.4'}% (Met)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Public Sentiment:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {DISTRICT_DETAILS_BY_ID[hoveredDistrict.id]?.sentiment || 76}% Favorable
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Hoardings:</span>
                  <span className="text-amber-300 font-mono font-semibold">
                    {DISTRICT_DETAILS_BY_ID[hoveredDistrict.id]?.hoardings?.length || 0} Locations
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. District Live State Telemetry Sub-Panel (Clean Monochromatic Layout) */}
        <div className="w-full border border-slate-200 p-3.5 sm:p-4 rounded-xl bg-white shadow-xs flex flex-col gap-2.5 mt-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                #{DISTRICT_NUMBERS[inspected.id]}
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {inspected.name} ({inspected.nameMr})
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {divisionName} Division • Census Code: {inspected.censusCode} • LGD: {inspected.lgdCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border ${
                  inspectedStatus === 'Active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : inspectedStatus === 'Standby'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    inspectedStatus === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {language === 'mr' ? 'माहिती अधिकारी:' : 'DIO:'} {getLocalizedStatus(inspectedStatus, language)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-stretch">
            {/* Box 1: Administrative Leadership */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {language === 'mr' ? 'प्रशासकीय नेतृत्व:' : 'Administrative Leadership:'}
                </span>
                <div className="truncate">
                  <span className="text-[10px] text-slate-500 block">{language === 'mr' ? 'जिल्हाधिकारी:' : 'Collector & DM:'}</span>
                  <strong className="text-slate-900 truncate text-xs block font-bold" title={inspectedDetails?.dioOffice.collectorName}>
                    {inspectedDetails?.dioOffice.collectorName || 'District Collector, IAS'}
                  </strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 truncate border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block">{language === 'mr' ? 'माहिती अधिकारी:' : 'Information Officer:'}</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate block">{officerName}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 ml-1">
                  {inspectedDetails?.dioOffice.staffPresentToday || 8} on duty
                </span>
              </div>
            </div>

            {/* Box 2: Composite Performance Index */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {language === 'mr' ? 'कामगिरी निर्देशांक (CPI):' : 'Composite Index (CPI):'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                    {inspectedDetails?.cpi || storeDistrict?.cpi || 88.5}{' '}
                    <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-amber-500/10 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                    Rank #{DISTRICT_NUMBERS[inspected.id]}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>{language === 'mr' ? 'दर्जा:' : 'Governance Grade:'} <strong className="text-emerald-700">A+ High Compliance</strong></span>
                <span className="text-slate-400 font-mono text-[10px]">Top Quintile</span>
              </div>
            </div>

            {/* Box 3: Citizen Services & Resolution Rate */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {language === 'mr' ? 'नागरिक सेवा व तक्रार निवारण:' : 'Citizen Services & Resolution:'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {inspectedDetails?.releases || storeDistrict?.releases || 142}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">{language === 'mr' ? 'सेवा प्रसिद्धी' : 'Notices'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-emerald-600">
                      {storeDistrict ? (Math.min(99.8, Math.max(93.5, 100 - (storeDistrict.avgTAT / 25)))).toFixed(1) : '98.4'}%
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">{language === 'mr' ? 'निवारण' : 'Resolved'}</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>{language === 'mr' ? 'तक्रार निवारण दर्जा:' : 'Citizen Charter:'}</span>
                <span className="font-bold text-emerald-700 font-mono text-[11px]">
                  ≥ 95% ({language === 'mr' ? 'साध्य' : 'Met'})
                </span>
              </div>
            </div>

            {/* Box 4: Hoardings & Demographics */}
            <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
                  {language === 'mr' ? 'होर्डिंग्ज व भौगोलिक व्याप्ती:' : 'Hoardings & Demographics:'}
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-bold font-mono text-slate-900">
                    {inspectedDetails?.hoardings?.length || 0}{' '}
                    <span className="text-[10px] font-normal text-slate-500">Hoardings</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                    {inspectedDetails?.quickStats.talukasCount || 8} Talukas
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-1.5 mt-2 flex items-center justify-between">
                <span>Area: {inspectedDetails?.quickStats.areaKm2 || '8,420 km²'}</span>
                <span>Pop: {inspectedDetails?.quickStats.population || '2.4M'}</span>
              </div>
            </div>
          </div>

          {/* 4-Pillar Breakdown Strip */}
          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 uppercase tracking-wide">
                {language === 'mr' ? '४-स्तंभ गुणवत्ता निर्देशांक:' : '4-Pillar Quality Scorecard (25 pts each):'}
              </span>
              <span className="font-mono text-slate-500 text-[10px]">
                Headquarters: {inspectedDetails?.quickStats.headquarters || inspected.name} • Literacy: {inspectedDetails?.quickStats.literacyRate || '84%'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">1. Volume:</span>
                <span className="font-bold font-mono text-slate-900">{storeDistrict?.volumeScore?.toFixed(1) || '24.2'} / 25</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">2. Citizen Resolution:</span>
                <span className="font-bold font-mono text-slate-900">{storeDistrict?.tatScore?.toFixed(1) || '23.8'} / 25</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">3. Sentiment:</span>
                <span className="font-bold font-mono text-slate-900">{storeDistrict?.sentimentScore?.toFixed(1) || '21.5'} / 25</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">4. Crisis SLA:</span>
                <span className="font-bold font-mono text-slate-900">{storeDistrict?.crisisScore?.toFixed(1) || '25.0'} / 25</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => selectDistrict(inspected.id)}
              className="flex-1 h-8.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            >
              {language === 'mr'
                ? `#${DISTRICT_NUMBERS[inspected.id]} ${inspected.nameMr} जिल्हा डॅशबोर्डवर निवडा`
                : `Select #${DISTRICT_NUMBERS[inspected.id]} ${inspected.name} for Analysis`}
            </button>

            <button
              onClick={() => setView(fitView(inspected.bbox))}
              className="h-8.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
            >
              {language === 'mr' ? 'झूम करा' : 'Zoom In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
