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

  // Detailed GIS Cartography Layer Toggles
  const [showHighways, setShowHighways] = useState<boolean>(true);
  const [showRivers, setShowRivers] = useState<boolean>(true);
  const [showMountains, setShowMountains] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
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
    }
  }, [selectedDistrictId, districtMap]);

  // Selected district metrics
  const selectedDistrictData = useMemo(() => {
    return findDistrictMetricData(selectedDistrictName);
  }, [selectedDistrictName]);

  // Handle district selection & focus with centroid centering
  const handleSelectDistrict = useCallback(
    (name: string) => {
      setSelectedDistrictName(name);
      const data = findDistrictMetricData(name);
      if (data) {
        setSelectedDistrictId(data.id);
        setSearchDistrict(data.name);

        // Smoothly center on the district pin centroid
        const geo = DISTRICT_GEOMETRY.find(
          (g) => g.name.toLowerCase() === name.toLowerCase() || g.id.toLowerCase() === data.id.toLowerCase()
        );
        if (geo?.pin) {
          setZoomLevel((z) => Math.max(z, 1.25));
          setPanOffset({
            x: Math.round((400 - geo.pin.x) * 0.45),
            y: Math.round((332 - geo.pin.y) * 0.45),
          });
        }

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
    <section className={`panel relative flex flex-col p-0.5 sm:p-1 overflow-hidden ${className}`}>
      {/* Sleek Row 1: Title + 36 Districts + Metric Tabs + Search */}
      <div className="mb-0.5 flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-1 min-w-0">
          <h1 className="text-[11px] sm:text-xs font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
            {language === 'mr' ? 'महाराष्ट्र GIS नकाशा' : 'Maharashtra State GIS Cartography'}
          </h1>
          <span className="rounded bg-sky-100 text-sky-800 text-[8px] font-semibold px-1 py-0.2 border border-sky-200">
            36 Districts
          </span>
          <span className="hidden sm:inline rounded bg-emerald-50 text-emerald-700 text-[8px] font-semibold px-1 py-0.2 border border-emerald-200">
            Vector 2D HD
          </span>
        </div>

        {/* Thematic Metric Tabs + Search */}
        <div className="flex items-center gap-0.5 flex-wrap">
          <div className="flex items-center gap-0.2 bg-slate-100 p-0.2 rounded border border-slate-200 text-[9px]" role="tablist">
            {metricTabs.map((tab) => {
              const isActive = activeMetric === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveMetric(tab.id)}
                  className={`rounded px-1 py-0.2 font-medium transition-all cursor-pointer ${
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
            <div className="flex items-center gap-0.5 px-1 py-0 bg-white border border-slate-200 rounded text-[9px] w-24 sm:w-28 h-5">
              <MagnifyingGlassIcon className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-[9px]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <XMarkIcon className="w-2.5 h-2.5" />
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
                    className="w-full text-left px-2 py-1 text-[10px] hover:bg-slate-50 flex items-center justify-between"
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
      <div className="mb-0.5 flex flex-wrap items-center justify-between gap-0.5 text-[9px] border-b border-slate-100 pb-0.5">
        <div className="flex items-center gap-0.2 overflow-x-auto py-0.2">
          <span className="text-[8.5px] font-semibold text-slate-400 mr-0.5">Div:</span>
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
              className={`px-1 py-0.2 rounded transition-colors cursor-pointer text-[8px] sm:text-[8.5px] ${
                activeDivisionFilter === div.id
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {div.label}
            </button>
          ))}
        </div>

        {/* Cartography Layer Switchers (Highways, Rivers, Terrain, Landmarks, GRID) */}
        <div className="flex items-center gap-0.5 text-[8.5px]">
          <button
            type="button"
            onClick={() => setShowHighways(!showHighways)}
            className={`px-1 py-0.2 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
              showHighways
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Highways"
          >
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            <span>{language === 'mr' ? 'महामार्ग' : 'Highways'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRivers(!showRivers)}
            className={`px-1 py-0.2 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
              showRivers
                ? 'bg-sky-100 text-sky-900 font-bold border border-sky-300'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Rivers"
          >
            <span className="w-1 h-1 rounded-full bg-sky-500" />
            <span>{language === 'mr' ? 'नद्या' : 'Rivers'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMountains(!showMountains)}
            className={`px-1 py-0.2 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
              showMountains
                ? 'bg-stone-200 text-stone-900 font-bold border border-stone-300'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Terrain"
          >
            <span className="w-1 h-1 rounded-full bg-stone-500" />
            <span>{language === 'mr' ? 'सह्याद्री' : 'Terrain'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-1 py-0.2 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
              showLandmarks
                ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Landmarks"
          >
            <span className="w-1 h-1 rounded-full bg-purple-500" />
            <span>{language === 'mr' ? 'ठिकाणे' : 'Landmarks'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Frame (Proportional Height so Maharashtra fits 100% without vertical clipping) */}
      <div
        ref={containerRef}
        className={`relative flex-1 min-h-0 w-full h-full rounded-xl overflow-hidden transition-all duration-300 ${
          isSatelliteMode
            ? 'bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-[#091524]'
            : 'bg-gradient-to-br from-[#EBF5FE] via-[#E2F0FD] to-[#D5EBFB] border border-slate-300/80 shadow-inner'
        }`}
      >
        {/* Geographic Coordinates & Division Scope (Top Center) */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 pointer-events-none select-none z-10 hidden sm:flex items-center gap-2 bg-white/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
          <span className="font-semibold text-slate-700">18.9°N, 76.8°E</span>
          <span className="text-slate-300">·</span>
          <span className="text-gov-primary font-bold">{activeDivisionFilter.toUpperCase()}</span>
        </div>

        {/* Floating Zoom & Orientation Controls toolbar (Left Top) */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {/* Zoom Buttons Group */}
          <div className="flex flex-col overflow-hidden rounded-md border border-border bg-white shadow-card">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.8))}
              className="flex h-8 w-8 items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <div className="h-px bg-border w-full" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="flex h-8 w-8 items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-slate-700 shadow-card hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reset view"
            aria-label="Reset view"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>

          {/* Satellite Layer Toggle */}
          <button
            onClick={() => setIsSatelliteMode(!isSatelliteMode)}
            className={`flex h-8 w-8 items-center justify-center rounded-md border border-border shadow-card transition-colors cursor-pointer ${
              isSatelliteMode
                ? 'bg-slate-900 text-white font-bold border-slate-900'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle satellite aerial texture"
            aria-label="Toggle satellite aerial texture"
          >
            <Square3Stack3DIcon className="w-4 h-4" />
          </button>

          {/* Compass / Orientation indicator */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-[10px] font-bold text-slate-700 shadow-card select-none">
            <span className="text-amber-600 font-extrabold">N</span>
          </div>
        </div>

        {/* SVG Maharashtra Topology Workspace (High-Fidelity 2D Vector) */}
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className={`w-full h-full object-contain transition-transform duration-100 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              touchAction: 'none',
            }}
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
            </defs>

            {/* Ocean Base Layer (Arabian Sea Background) */}
            <rect
              x={0}
              y={0}
              width={MAP_WIDTH}
              height={MAP_HEIGHT}
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

              const isSelected =
                selectedDistrictName.toLowerCase() === district.id.toLowerCase() ||
                selectedDistrictName.toLowerCase() === district.name.toLowerCase();

              const fillColor = getDistrictFillColor(data, activeMetric);

              // Check division filter
              const isDivisionDimmed =
                activeDivisionFilter !== 'all' && district.division !== activeDivisionFilter;

              return (
                <g key={district.id} className="cursor-pointer">
                  <path
                    d={district.path}
                    fill={fillColor}
                    fillOpacity={isDivisionDimmed ? 0.3 : isSelected ? 1 : isSatelliteMode ? 0.8 : 0.88}
                    stroke={isSelected ? '#1769E0' : isSatelliteMode ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF'}
                    strokeWidth={isSelected ? '2.8' : '1'}
                    className="transition-all duration-150 hover:brightness-110"
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

                  {/* Selected District Concentric Beacon Halo */}
                  {isSelected && district.pin && (
                    <g pointerEvents="none">
                      <circle
                        cx={district.pin.x}
                        cy={district.pin.y}
                        r="14"
                        fill="#F59E0B"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                      <circle
                        cx={district.pin.x}
                        cy={district.pin.y}
                        r="6"
                        fill="#F59E0B"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                      />
                      <circle cx={district.pin.x} cy={district.pin.y} r="2" fill="#FFFFFF" />
                    </g>
                  )}

                  {/* District Center Pin Label */}
                  {district.pin && (
                    <text
                      x={district.pin.x}
                      y={district.pin.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={zoomLevel >= 1.2 ? '9.5' : '8'}
                      fontWeight={isSelected ? '700' : '600'}
                      fill={isSelected ? '#FFFFFF' : isSatelliteMode ? '#F8FAFC' : '#0F172A'}
                      pointerEvents="none"
                      className="select-none font-sans"
                      style={{
                        paintOrder: 'stroke',
                        stroke: isSelected ? '#1E40AF' : isSatelliteMode ? '#0F172A' : '#FFFFFF',
                        strokeWidth: isSatelliteMode ? '2px' : '2.5px',
                        strokeLinejoin: 'round',
                      }}
                    >
                      {language === 'mr' ? district.nameMr : district.label || district.name}
                    </text>
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
          </svg>
        </div>

        {/* Dynamic Thematic Legend (Bottom-Left) */}
        <div className="panel absolute bottom-3 left-3 p-2 text-[10px] sm:text-[11px] bg-white/95 backdrop-blur-md shadow-md border border-border z-20 max-w-[210px]">
          <div className="mb-1 font-semibold text-slate-900 flex items-center justify-between">
            <span>{METRIC_LABELS[activeMetric]}</span>
          </div>
          <ul className="space-y-0.5">
            {METRIC_LEGENDS[activeMetric].map((item) => (
              <li key={item.band} className="flex items-center gap-1.5 text-slate-700">
                <span
                  className="h-2 w-2 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: BAND_COLORS[item.band] }}
                />
                <span className="truncate">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected District Telemetry Floating Dialog (Bottom-Right) */}
        {selectedDistrictData && isTelemetryCollapsed && (
          <div
            className="panel absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 shadow-lg bg-white/95 backdrop-blur-md border border-border text-xs animate-in fade-in rounded-lg"
            role="status"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
              style={{
                backgroundColor:
                  BAND_COLORS[getBandFromScore(selectedDistrictData.performance)],
              }}
            />
            <span className="font-bold text-slate-900">{selectedDistrictData.name}</span>
            <span className="font-mono text-slate-600 font-semibold">{selectedDistrictData.performance}/100</span>
            <button
              onClick={() => setIsTelemetryCollapsed(false)}
              className="text-[10px] text-gov-primary font-bold hover:underline px-1 py-0.5 rounded cursor-pointer"
              title="Expand district telemetry"
            >
              Expand ↗
            </button>
            <button
              onClick={() => setSelectedDistrictName('')}
              aria-label="Close district card"
              className="p-0.5 rounded text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedDistrictData && !isTelemetryCollapsed && (
          <div
            className="panel absolute bottom-3 right-3 w-72 p-3 shadow-xl bg-white/95 backdrop-blur-md border border-border z-20 animate-in fade-in"
            role="dialog"
            aria-label={`${selectedDistrictData.name} details`}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {selectedDistrictData.name}
                </h3>
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                  {selectedDistrictData.division} Division · {selectedDistrictData.nameMr}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white shadow-xs"
                  style={{
                    backgroundColor:
                      BAND_COLORS[getBandFromScore(selectedDistrictData.performance)],
                  }}
                >
                  {selectedDistrictData.performance} / 100
                </span>
                <button
                  onClick={() => setIsTelemetryCollapsed(true)}
                  aria-label="Minimize district card"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Minimize card"
                >
                  <MinusIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedDistrictName('')}
                  aria-label="Close district card"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  title="Close card"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <dl className="divide-y divide-border text-[11px]">
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Press Releases (Today)</dt>
                <dd className="font-semibold tabular-nums text-slate-800">
                  {selectedDistrictData.pressReleases}
                </dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Media Placements</dt>
                <dd className="font-semibold tabular-nums text-slate-800">
                  {selectedDistrictData.placements} ({selectedDistrictData.placementPct}%)
                </dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Net Sentiment</dt>
                <dd
                  className={`font-semibold tabular-nums ${
                    selectedDistrictData.sentiment >= 20
                      ? 'text-success'
                      : selectedDistrictData.sentiment >= 0
                      ? 'text-amber-500'
                      : 'text-destructive'
                  }`}
                >
                  {selectedDistrictData.sentiment > 0
                    ? `+${selectedDistrictData.sentiment}%`
                    : `${selectedDistrictData.sentiment}%`}
                </dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted-foreground">Crisis Incident SLA</dt>
                <dd className="font-semibold tabular-nums text-slate-800">
                  {selectedDistrictData.tat}m avg TAT
                </dd>
              </div>
            </dl>

            <div className="mt-2 pt-1.5 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-mono">
                CPI: {selectedDistrictData.performance} / 100
              </span>
              <Link
                href={`/districts?id=${selectedDistrictData.id}`}
                className="text-[10px] text-primary hover:underline font-semibold"
              >
                Full Profile &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedMaharashtraGISMap;
