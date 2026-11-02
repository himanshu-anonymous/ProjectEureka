'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  DISTRICT_GEOMETRY,
  DIVISION_BORDERS_PATH,
  STATE_OUTLINE_PATH,
  MAP_WIDTH,
  MAP_HEIGHT,
  type DistrictGeometry,
  type DivisionId,
} from '@/data/maharashtraGeo.generated';
import {
  LOVABLE_DISTRICTS,
  findDistrictMetricData,
  getDistrictMetricNormalizedScore,
  getBandFromScore,
  getDistrictFillColor,
  METRIC_LABELS,
  METRIC_LEGENDS,
  BAND_COLORS,
  BAND_BG_CLASSES,
  type MapThematicMetric,
  type DistrictMetricData,
} from '@/data/lovableDashboardData';
import {
  HIGHWAY_CORRIDORS,
  MAJOR_RIVERS,
  WATER_RESERVOIRS,
  NATURE_RESERVES,
  RAILWAY_TRUNK_LINES,
  TERRAIN_RIDGES,
  KEY_TOWNS,
  STATE_LANDMARKS,
  COASTAL_BATHYMETRY_PATHS,
  GIS_GRATICULE_GRID,
} from '@/data/maharashtraGISDetailData';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  PlusIcon,
  MinusIcon,
  ArrowPathIcon,
  Square3Stack3DIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DistrictLabelConfig {
  xOffset?: number;
  yOffset?: number;
  anchor?: 'start' | 'middle' | 'end';
  fontSize?: number;
  hasLeaderLine?: boolean;
}

const DISTRICT_LABEL_CONFIGS: Record<string, DistrictLabelConfig> = {
  'mumbai-city': {
    xOffset: -16,
    yOffset: 12,
    anchor: 'end',
    fontSize: 11.5,
    hasLeaderLine: true,
  },
  'mumbai-suburban': {
    xOffset: -16,
    yOffset: -6,
    anchor: 'end',
    fontSize: 11.5,
    hasLeaderLine: true,
  },
  'chhatrapati-sambhajinagar': {
    fontSize: 11.5,
  },
  'bhandara': {
    xOffset: -4,
    fontSize: 12,
  },
  'gondia': {
    xOffset: 4,
    fontSize: 12,
  },
  'hingoli': {
    fontSize: 12,
  },
  'washim': {
    fontSize: 12.5,
  },
};

/**
 * Robust district matching helper that resolves official names, IDs, legacy aliases,
 * and dual English/Marathi scripts seamlessly.
 */
export function isDistrictSelected(
  district: DistrictGeometry,
  selectedId?: string,
  selectedName?: string
): boolean {
  const target = (selectedId && selectedId !== 'all') ? selectedId : (selectedName || '');
  if (!target) return false;

  const q = target.toLowerCase().trim().replace(/[\s_]+/g, '-');
  const dId = district.id.toLowerCase().trim().replace(/[\s_]+/g, '-');
  const dName = district.name.toLowerCase().trim().replace(/[\s_]+/g, '-');

  // Exact match
  if (q === dId || q === dName || target === district.nameMr) return true;

  // Normalized legacy / bifurcation alias mappings
  if ((q === 'ahmednagar' || q === 'ahilyanagar') && (dId === 'ahilyanagar' || dName === 'ahilyanagar')) return true;
  if ((q === 'aurangabad' || q === 'chhatrapati-sambhajinagar' || q === 'chh.-sambhajinagar') &&
      (dId === 'chhatrapati-sambhajinagar' || dName === 'chhatrapati-sambhajinagar')) return true;
  if ((q === 'osmanabad' || q === 'dharashiv') && (dId === 'dharashiv' || dName === 'dharashiv')) return true;
  if ((q === 'mumbai' || q === 'mumbai-city') && (dId === 'mumbai-city' || dId === 'mumbai-suburban')) return true;
  if (q === 'mumbai-suburban' && dId === 'mumbai-suburban') return true;

  return false;
}

interface EnhancedMaharashtraGISMapProps {
  onDistrictSelect?: (district: DistrictMetricData) => void;
  className?: string;
  initialDistrictId?: string;
  initialMetric?: MapThematicMetric;
  initialDivisionFilter?: string;
  initial3DMode?: boolean;
}

export const EnhancedMaharashtraGISMap: React.FC<EnhancedMaharashtraGISMapProps> = ({
  onDistrictSelect,
  className = '',
  initialDistrictId = '',
  initialMetric = 'performance',
  initialDivisionFilter = 'all',
}) => {
  const { selectedDistrictId, setSelectedDistrictId, setSearchDistrict, language } = useDashboardStore();

  const [activeMetric, setActiveMetric] = useState<MapThematicMetric>(initialMetric);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(initialDistrictId);
  const [isTelemetryCollapsed, setIsTelemetryCollapsed] = useState<boolean>(false);
  const [hoveredDistrict, setHoveredDistrict] = useState<{
    geo: DistrictGeometry;
    data: DistrictMetricData;
  } | null>(null);

  // Viewport transformations & Interactive Pan/Zoom
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Detailed GIS Cartography Layer Toggles (Default off for clean, uncluttered cartography)
  const [showHighways, setShowHighways] = useState<boolean>(false);
  const [showRivers, setShowRivers] = useState<boolean>(false);
  const [showMountains, setShowMountains] = useState<boolean>(false);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);
  const [showGraticule, setShowGraticule] = useState<boolean>(false);
  const [isSatelliteMode, setIsSatelliteMode] = useState<boolean>(false);

  const [activeDivisionFilter, setActiveDivisionFilter] = useState<string>(initialDivisionFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Map all 36 district geometries to metrics with robust alias resolution
  const districtMap = useMemo(() => {
    const map = new Map<string, DistrictMetricData>();
    for (const d of LOVABLE_DISTRICTS) {
      map.set(d.id.toLowerCase(), d);
      map.set(d.name.toLowerCase(), d);
    }
    // Index all 36 official district geometries from maharashtraGeo
    for (const geo of DISTRICT_GEOMETRY) {
      const match = findDistrictMetricData(geo.id) || findDistrictMetricData(geo.name);
      if (match) {
        map.set(geo.id.toLowerCase(), match);
        map.set(geo.name.toLowerCase(), match);
      }
    }
    return map;
  }, []);

  // Sync with global store selection
  useEffect(() => {
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const match = districtMap.get(selectedDistrictId.toLowerCase()) || findDistrictMetricData(selectedDistrictId);
      if (match) {
        setSelectedDistrictName(match.name);
      }
    } else {
      setSelectedDistrictName('');
    }
  }, [selectedDistrictId, districtMap]);

  // Handle district selection & focus without displacing full-state visibility
  const handleSelectDistrict = useCallback(
    (name: string) => {
      setSelectedDistrictName(name);
      const data = findDistrictMetricData(name);
      if (data) {
        setSelectedDistrictId(data.id);
        setSearchDistrict(data.name);

        if (onDistrictSelect) {
          onDistrictSelect(data);
        }
      }
    },
    [setSelectedDistrictId, setSearchDistrict, onDistrictSelect]
  );

  // Smooth pointer drag panning
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleDoubleClick = () => {
    setZoomLevel((z) => Math.min(z + 0.35, 2.8));
  };

  // Quick zoom to a division
  const handleFilterDivision = (divId: string) => {
    setActiveDivisionFilter(divId);
    if (divId === 'all') {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(1.35);
      const offsets: Record<string, { x: number; y: number }> = {
        konkan: { x: 120, y: 0 },
        pune: { x: 80, y: -60 },
        nashik: { x: 40, y: 80 },
        'chhatrapati-sambhajinagar': { x: -20, y: 20 },
        amravati: { x: -80, y: 100 },
        nagpur: { x: -160, y: 40 },
      };
      setPanOffset(offsets[divId] || { x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveDivisionFilter('all');
    setSearchQuery('');
  };

  // Filter district list for search dropdown
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return LOVABLE_DISTRICTS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.nameMr.includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const metricTabs: { id: MapThematicMetric; label: string }[] = [
    { id: 'performance', label: 'Performance Index' },
    { id: 'coverage', label: 'Media Coverage' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'crisis', label: 'Crisis Alerts' },
    { id: 'events', label: 'Field Events' },
  ];

  return (
    <section className={`panel relative flex flex-col p-1 sm:p-1.5 overflow-hidden ${className}`}>
      {/* Sleek Row 1: Title + 36 Districts + Metric Tabs + Search */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
            {language === 'mr' ? 'महाराष्ट्र GIS नकाशा' : 'Maharashtra State GIS Cartography'}
          </h1>
          <span className="rounded bg-sky-100 text-sky-800 text-[10px] font-semibold px-1.5 py-0.5 border border-sky-200">
            36 Districts
          </span>
        </div>

        {/* Thematic Metric Tabs + Search */}
        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs" role="tablist">
            {metricTabs.map((tab) => {
              const isActive = activeMetric === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveMetric(tab.id)}
                  className={`rounded px-1.5 py-0.5 font-semibold text-[11px] sm:text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick District Search Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs w-28 sm:w-32 h-6">
              <MagnifyingGlassIcon className="w-3 h-3 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district..."
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </div>

            {filteredList.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-md shadow-lg z-30 overflow-hidden divide-y divide-border">
                {filteredList.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      handleSelectDistrict(d.name);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{d.name}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getDistrictFillColor(d, activeMetric) }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sleek Row 2: Division quick jump & Layer toggles */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-1 text-xs border-b border-slate-100 pb-1 shrink-0">
        <div className="flex items-center gap-0.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Division:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'konkan', label: 'Konkan' },
            { id: 'pune', label: 'Pune' },
            { id: 'nashik', label: 'Nashik' },
            { id: 'chhatrapati-sambhajinagar', label: 'Chh. Sambhajinagar' },
            { id: 'amravati', label: 'Amravati' },
            { id: 'nagpur', label: 'Nagpur' },
          ].map((div) => (
            <button
              key={div.id}
              onClick={() => handleFilterDivision(div.id)}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer text-[10.5px] sm:text-[11px] ${
                activeDivisionFilter === div.id
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
              }`}
            >
              {div.label}
            </button>
          ))}
        </div>

        {/* Cartography Layer Switchers (Highways, Rivers, Terrain, Landmarks) */}
        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setShowHighways(!showHighways)}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              showHighways
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                : 'text-slate-500 hover:bg-slate-100 font-medium'
            }`}
            title="Highways"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{language === 'mr' ? 'महामार्ग' : 'Highways'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRivers(!showRivers)}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              showRivers
                ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300'
                : 'text-slate-500 hover:bg-slate-100 font-medium'
            }`}
            title="Rivers"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>{language === 'mr' ? 'नद्या' : 'Rivers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMountains(!showMountains)}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              showMountains
                ? 'bg-stone-200 text-stone-900 font-bold border border-stone-300'
                : 'text-slate-500 hover:bg-slate-100 font-medium'
            }`}
            title="Terrain"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            <span>{language === 'mr' ? 'सह्याद्री' : 'Terrain'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
              showLandmarks
                ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                : 'text-slate-500 hover:bg-slate-100 font-medium'
            }`}
            title="Landmarks"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>{language === 'mr' ? 'ठिकाणे' : 'Landmarks'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Frame (Expands vertically to fill space, high-visibility map) */}
      <div
        ref={containerRef}
        className={`relative w-full flex-1 min-h-[380px] sm:min-h-[440px] rounded-lg overflow-hidden transition-all duration-300 ${
          isSatelliteMode
            ? 'bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-[#091524]'
            : 'bg-gradient-to-br from-[#EBF5FE] via-[#E2F0FD] to-[#D5EBFB] border border-slate-300/80 shadow-inner'
        }`}
      >
        {/* Floating Zoom & Orientation Controls toolbar (Left Top, Compact) */}
        <div className="absolute left-2 top-2 z-20 flex flex-col gap-1">
          {/* Zoom Buttons Group */}
          <div className="flex flex-col overflow-hidden rounded border border-border bg-white shadow-2xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.8))}
              className="flex h-6 w-6 items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
            <div className="h-px bg-border w-full" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="flex h-6 w-6 items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <MinusIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleReset}
            className="flex h-6 w-6 items-center justify-center rounded border border-border bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset view"
            aria-label="Reset view"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
          </button>

          {/* Satellite Layer Toggle */}
          <button
            onClick={() => setIsSatelliteMode(!isSatelliteMode)}
            className={`flex h-6 w-6 items-center justify-center rounded border border-border shadow-2xs transition-colors cursor-pointer ${
              isSatelliteMode
                ? 'bg-slate-900 text-white font-bold border-slate-900'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle satellite aerial texture"
            aria-label="Toggle satellite aerial texture"
          >
            <Square3Stack3DIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Thematic Legend Overlay (Floating neatly in bottom area to maximize map size) */}
        <div className="absolute right-2 bottom-2 z-20 hidden md:flex items-center gap-1.5 px-2 py-1 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-md shadow-xs text-[10px] text-slate-700 pointer-events-auto">
          <span className="font-bold text-slate-800">{METRIC_LABELS[activeMetric]}:</span>
          <div className="flex items-center gap-2">
            {METRIC_LEGENDS[activeMetric].map((item) => (
              <span key={item.band} className="flex items-center gap-1 font-semibold text-[9.5px]">
                <span
                  className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: BAND_COLORS[item.band] }}
                />
                <span className="truncate">{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* SVG Maharashtra Topology Workspace (High-Fidelity 2D Vector - Expands 100% edge-to-edge) */}
        <div className="w-full h-full flex items-center justify-center p-0">
          <svg
            viewBox="-25 -15 825 635"
            preserveAspectRatio="xMidYMid meet"
            className={`w-full h-full object-contain ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
          >
            {/* Defs for gradients, patterns & filters */}
            <defs>
              {/* Sea Water Gradient */}
              <linearGradient id="seaWaterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBE8FC" />
                <stop offset="60%" stopColor="#D9EEFD" />
                <stop offset="100%" stopColor="#EAF4FC" />
              </linearGradient>

              {/* Satellite Deep Ocean Gradient */}
              <linearGradient id="satelliteSeaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#071527" />
                <stop offset="60%" stopColor="#0B2038" />
                <stop offset="100%" stopColor="#0f2744" />
              </linearGradient>

              {/* Golden Expressway Gradient (Samruddhi Mahamarg) */}
              <linearGradient id="expresswayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* River Water Glow Filter */}
              <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Executive Badge Pill Shadow */}
              <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.4" />
              </filter>

              {/* Hover Badge Shadow */}
              <filter id="hoverShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#0F172A" floodOpacity="0.25" />
              </filter>

              {/* District Label Text Drop Shadow */}
              <filter id="labelDropShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Transform Viewport Group for Full-State Smooth Zoom & Pan */}
            <g
              transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
              style={{
                transformOrigin: '400px 332px',
                transition: isDragging ? 'none' : 'transform 150ms ease-out',
              }}
            >
              {/* Ocean Base Layer (Arabian Sea Background) */}
              <rect
                x={-100}
                y={-100}
                width={MAP_WIDTH + 200}
                height={MAP_HEIGHT + 200}
                fill={isSatelliteMode ? 'url(#satelliteSeaGrad)' : 'url(#seaWaterGrad)'}
              />

            {/* Coastal Bathymetry Depth Contours (Arabian Sea) */}
            <g pointerEvents="none" opacity={isSatelliteMode ? 0.3 : 0.55}>
              {COASTAL_BATHYMETRY_PATHS.map((bathPath, idx) => (
                <path
                  key={`bathy-${idx}`}
                  d={bathPath}
                  fill="none"
                  stroke={isSatelliteMode ? '#38BDF8' : '#93C5FD'}
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              ))}
            </g>

            {/* GIS Lat/Long Graticule Grid */}
            {showGraticule && (
              <g pointerEvents="none" opacity={isSatelliteMode ? 0.25 : 0.35}>
                {GIS_GRATICULE_GRID.map((grid, idx) => (
                  <g key={`grid-${idx}`}>
                    <line
                      x1={grid.x1}
                      y1={grid.y1}
                      x2={grid.x2}
                      y2={grid.y2}
                      stroke={isSatelliteMode ? '#38BDF8' : '#64748B'}
                      strokeWidth="0.8"
                      strokeDasharray="3 4"
                    />
                    <text
                      x={grid.type === 'lat' ? 108 : grid.x1 + 2}
                      y={grid.type === 'lat' ? grid.y1 - 2 : 64}
                      fontSize="7.5"
                      fill={isSatelliteMode ? '#7DD3FC' : '#64748B'}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {grid.label}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* State Outline Boundary Base with Depth Shadow */}
            <path
              d={STATE_OUTLINE_PATH}
              fill={isSatelliteMode ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF'}
              stroke={isSatelliteMode ? '#38BDF8' : '#475569'}
              strokeWidth={isSatelliteMode ? '3' : '3.5'}
              strokeLinejoin="round"
            />

            {/* Sahyadri Western Ghats Mountain Ridges */}
            {showMountains && (
              <g pointerEvents="none" opacity={isSatelliteMode ? 0.45 : 0.65}>
                {TERRAIN_RIDGES.map((ridge) => (
                  <g key={`ridge-${ridge.id}`}>
                    {/* Soft elevation relief band */}
                    <path
                      d={ridge.path}
                      fill="none"
                      stroke={isSatelliteMode ? '#475569' : '#D6D3D1'}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.6"
                    />
                    {/* Sharp Ridge Crest Line */}
                    <path
                      d={ridge.path}
                      fill="none"
                      stroke={isSatelliteMode ? '#94A3B8' : '#78716C'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.85"
                    />
                  </g>
                ))}
              </g>
            )}

            {/* Individual 36 Districts with Thematic Fills */}
            {DISTRICT_GEOMETRY.map((district) => {
              const data: DistrictMetricData =
                districtMap.get(district.id.toLowerCase()) ||
                districtMap.get(district.name.toLowerCase()) ||
                findDistrictMetricData(district.id) ||
                findDistrictMetricData(district.name) || {
                  id: district.id,
                  name: district.name,
                  nameMr: district.nameMr,
                  division: district.division,
                  performance: 76,
                  pressReleases: 120,
                  placements: 40,
                  placementPct: 88,
                  sentiment: 72,
                  tat: 30,
                  crisisAlerts: 0,
                  fieldEvents: 5,
                  trend: 2.1,
                };

              const isSelected = isDistrictSelected(district, selectedDistrictId, selectedDistrictName);
              const hasAnySelection = Boolean(
                (selectedDistrictId && selectedDistrictId !== 'all') || selectedDistrictName
              );

              const fillColor = getDistrictFillColor(data, activeMetric);

              // Check division filter
              const isDivisionDimmed =
                activeDivisionFilter !== 'all' && district.division !== activeDivisionFilter;

              return (
                <g key={district.id} className="cursor-pointer">
                  <path
                    d={district.path}
                    fill={fillColor}
                    fillOpacity={
                      isDivisionDimmed
                        ? 0.22
                        : isSelected
                        ? 1.0
                        : hasAnySelection
                        ? 0.76
                        : isSatelliteMode
                        ? 0.85
                        : 0.92
                    }
                    stroke={
                      isSelected
                        ? '#F59E0B'
                        : isSatelliteMode
                        ? 'rgba(255, 255, 255, 0.6)'
                        : '#FFFFFF'
                    }
                    strokeWidth={isSelected ? '3.5' : '1.2'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className={`transition-all duration-150 ${
                      isSelected ? 'brightness-110 drop-shadow-md' : 'hover:brightness-105'
                    }`}
                    onMouseEnter={() => setHoveredDistrict({ geo: district, data })}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    onClick={() => handleSelectDistrict(data.name)}
                  >
                    <title>{`${district.name} (${district.nameMr}) — ${data.performance} CPI`}</title>
                  </path>

                  {/* Pulsing indicator for Crisis Hotspots */}
                  {activeMetric === 'crisis' && data.crisisAlerts > 0 && district.pin && (
                    <circle
                      cx={district.pin.x}
                      cy={district.pin.y}
                      r="6"
                      fill="#EF4444"
                      className="animate-ping"
                      opacity="0.85"
                    />
                  )}

                  {/* Selected District Multi-Layer Glowing Aura Highlights */}
                  {isSelected && (
                    <g pointerEvents="none">
                      {/* Deep luminous amber aura */}
                      <path
                        d={district.path}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="8"
                        strokeOpacity="0.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      {/* Sharp crisp white contour */}
                      <path
                        d={district.path}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        strokeOpacity="0.95"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Water Reservoirs & Dam Lakes (Koyna, Jayakwadi, Ujani) */}
            {showRivers && (
              <g pointerEvents="none">
                {WATER_RESERVOIRS.map((res) => (
                  <g key={`resv-${res.id}`}>
                    <path
                      d={res.path}
                      fill={isSatelliteMode ? '#0284C7' : '#38BDF8'}
                      stroke={isSatelliteMode ? '#38BDF8' : '#0284C7'}
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    {zoomLevel >= 1.2 && (
                      <text
                        x={res.labelX}
                        y={res.labelY}
                        fontSize="6"
                        fill={isSatelliteMode ? '#7DD3FC' : '#0369A1'}
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{ paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: '1.5px' }}
                      >
                        {language === 'mr' ? res.nameMr.split(' ')[0] : res.name.split(' ')[0]}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            )}

            {/* Major Rivers Network (Godavari, Krishna, Bhima, Tapi, Wainganga) */}
            {showRivers && (
              <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
                {MAJOR_RIVERS.map((river) => (
                  <path
                    key={`river-${river.id}`}
                    d={river.path}
                    stroke={isSatelliteMode ? '#38BDF8' : '#0284C7'}
                    strokeWidth="2.2"
                    strokeOpacity={isSatelliteMode ? '0.85' : '0.75'}
                  />
                ))}
              </g>
            )}

            {/* Highway Corridors & Expressways (Samruddhi Mahamarg, NE1, NH48, NH53, NH66) */}
            {showHighways && (
              <g fill="none" strokeLinejoin="round" strokeLinecap="round" pointerEvents="none">
                {HIGHWAY_CORRIDORS.map((hwy) => {
                  const isExpressway = hwy.type === 'expressway';
                  return (
                    <g key={`hwy-${hwy.id}`}>
                      {/* Casing */}
                      <path
                        d={hwy.path}
                        stroke={isExpressway ? '#78350F' : '#334155'}
                        strokeWidth={isExpressway ? '3.4' : '2.2'}
                        strokeOpacity="0.75"
                      />
                      {/* Core route */}
                      <path
                        d={hwy.path}
                        stroke={isExpressway ? 'url(#expresswayGrad)' : '#94A3B8'}
                        strokeWidth={isExpressway ? '2.2' : '1.2'}
                        strokeOpacity="0.95"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* State Strategic Landmarks (Mantralaya, JNPT, Ajanta, Deekshabhoomi, Raigad Fort) */}
            {showLandmarks && (
              <g pointerEvents="none">
                {STATE_LANDMARKS.slice(0, 8).map((landmark) => (
                  <g key={`lm-${landmark.id}`}>
                    <circle
                      cx={landmark.x}
                      cy={landmark.y}
                      r="3.5"
                      fill="#7C3AED"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                    />
                    {zoomLevel >= 1.2 && (
                      <text
                        x={landmark.x}
                        y={landmark.y - 5}
                        fontSize="6"
                        fontWeight="bold"
                        fill="#581C87"
                        textAnchor="middle"
                        style={{ paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: '2px' }}
                      >
                        {language === 'mr' ? landmark.nameMr.split(' ')[0] : landmark.name.split(' ')[0]}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            )}

            {/* Division Borders Overlay */}
            <path
              d={DIVISION_BORDERS_PATH}
              fill="none"
              stroke={isSatelliteMode ? 'rgba(245, 158, 11, 0.85)' : 'rgba(30, 41, 59, 0.55)'}
              strokeWidth="1.8"
              strokeDasharray="4 2.5"
              pointerEvents="none"
            />

            {/* Top-Level High-Contrast District Pins & Labels Layer (Layer 10: Never clipped by geography) */}
            <g pointerEvents="none">
              {DISTRICT_GEOMETRY.map((district) => {
                const data: DistrictMetricData =
                  districtMap.get(district.id.toLowerCase()) ||
                  districtMap.get(district.name.toLowerCase()) ||
                  findDistrictMetricData(district.id) ||
                  findDistrictMetricData(district.name) || {
                    id: district.id,
                    name: district.name,
                    nameMr: district.nameMr,
                    division: district.division,
                    performance: 76,
                    pressReleases: 120,
                    placements: 40,
                    placementPct: 88,
                    sentiment: 72,
                    tat: 30,
                    crisisAlerts: 0,
                    fieldEvents: 5,
                    trend: 2.1,
                  };

                const isSelected = isDistrictSelected(district, selectedDistrictId, selectedDistrictName);

                const isHovered = hoveredDistrict?.geo.id === district.id;

                const cfg = DISTRICT_LABEL_CONFIGS[district.id] || {};
                const xOffset = cfg.xOffset || 0;
                const yOffset = cfg.yOffset || 0;
                const anchor = cfg.anchor || 'middle';
                const baseFontSize = cfg.fontSize || 13.5;
                const currentFontSize =
                  baseFontSize * (zoomLevel >= 1.6 ? 1.25 : zoomLevel >= 1.2 ? 1.12 : 1);

                const labelX = district.pin ? district.pin.x + xOffset : 0;
                const labelY = district.pin ? district.pin.y + yOffset : 0;
                const labelText = language === 'mr' ? district.nameMr : district.label || district.name;

                if (!district.pin) return null;

                return (
                  <g key={`pin-label-${district.id}`} className="select-none">
                    {/* Leader Line for Congested Coastal Districts (Mumbai City & Mumbai Suburban) */}
                    {cfg.hasLeaderLine && (
                      <g opacity={isSatelliteMode ? 0.75 : 0.85}>
                        <circle
                          cx={district.pin.x}
                          cy={district.pin.y}
                          r="2.2"
                          fill={isSelected ? '#F59E0B' : '#0F172A'}
                          stroke="#FFFFFF"
                          strokeWidth="0.8"
                        />
                        <line
                          x1={labelX + (anchor === 'end' ? 2 : 0)}
                          y1={labelY}
                          x2={district.pin.x}
                          y2={district.pin.y}
                          stroke={isSelected ? '#F59E0B' : isSatelliteMode ? '#94A3B8' : '#475569'}
                          strokeWidth="1.2"
                          strokeDasharray="2.5 2"
                        />
                      </g>
                    )}

                    {/* Selected District Concentric Beacon Halo (at geographic center) */}
                    {isSelected && (
                      <g>
                        <circle
                          cx={district.pin.x}
                          cy={district.pin.y}
                          r="16"
                          fill="#F59E0B"
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                        <circle
                          cx={district.pin.x}
                          cy={district.pin.y}
                          r="7"
                          fill="#F59E0B"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <circle cx={district.pin.x} cy={district.pin.y} r="2.5" fill="#FFFFFF" />
                      </g>
                    )}

                    {/* Label Rendering: Selected Executive Pill vs Hover Highlight vs Sharp Halo Text */}
                    {isSelected ? (
                      (() => {
                        const badgeWidth = Math.max(78, labelText.length * 8.4 + 22);
                        const badgeHeight = 22;
                        const badgeY = district.pin.y > 540 ? district.pin.y - 25 : district.pin.y + 14;
                        const badgeX = district.pin.x - badgeWidth / 2;

                        return (
                          <g filter="url(#badgeShadow)">
                            <rect
                              x={badgeX}
                              y={badgeY}
                              width={badgeWidth}
                              height={badgeHeight}
                              rx={5}
                              fill="#0F172A"
                              stroke="#F59E0B"
                              strokeWidth="1.8"
                            />
                            <text
                              x={district.pin.x}
                              y={badgeY + 14.5}
                              textAnchor="middle"
                              fill="#FFFFFF"
                              fontSize={Math.max(11.5, currentFontSize - 1)}
                              fontWeight="900"
                              className="font-sans"
                              style={{ letterSpacing: '0.02em' }}
                            >
                              {labelText}
                            </text>
                          </g>
                        );
                      })()
                    ) : isHovered ? (
                      (() => {
                        const hoverBadgeW = Math.max(68, labelText.length * 8.0 + 16);
                        const hoverBadgeH = 20;
                        const hoverBadgeX =
                          anchor === 'end'
                            ? labelX - hoverBadgeW + 2
                            : anchor === 'start'
                            ? labelX - 2
                            : labelX - hoverBadgeW / 2;
                        const hoverBadgeY = labelY - hoverBadgeH / 2;

                        return (
                          <g filter="url(#hoverShadow)">
                            <rect
                              x={hoverBadgeX}
                              y={hoverBadgeY}
                              width={hoverBadgeW}
                              height={hoverBadgeH}
                              rx={4}
                              fill="#FFFFFF"
                              fillOpacity={0.95}
                              stroke="#2563EB"
                              strokeWidth="1.2"
                            />
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor={anchor}
                              dominantBaseline="central"
                              fontSize={currentFontSize}
                              fontWeight="800"
                              fill="#1E40AF"
                              className="font-sans"
                            >
                              {labelText}
                            </text>
                          </g>
                        );
                      })()
                    ) : (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor={anchor}
                        dominantBaseline="central"
                        fontSize={currentFontSize}
                        fontWeight="800"
                        fill={isSatelliteMode ? '#FFFFFF' : '#0F172A'}
                        className="font-sans tracking-tight"
                        style={{
                          stroke: isSatelliteMode ? '#0F172A' : '#FFFFFF',
                          strokeWidth: isSatelliteMode ? '2.2px' : '1.6px',
                          strokeLinejoin: 'round',
                          strokeLinecap: 'round',
                          paintOrder: 'stroke fill',
                        }}
                      >
                        {labelText}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
      </div>
    </section>
  );
};

export default EnhancedMaharashtraGISMap;
