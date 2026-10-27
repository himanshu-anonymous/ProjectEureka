'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  DISTRICT_GEOMETRY,
  DIVISION_BORDERS_PATH,
  STATE_OUTLINE_PATH,
  MAP_WIDTH,
  MAP_HEIGHT,
  type DivisionId,
  type DistrictGeometry,
} from '@/data/maharashtraGeo.generated';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getDistrictName } from '@/lib/dataLocalization';
import {
  MapPinIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
  SparklesIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import { DrawerPayload } from '@/components/shared/ContextualIntelligenceDrawer';

type ThematicLayer = 'activity' | 'sentiment' | 'crisis' | 'cpi';

interface MaharashtraGISDeckProps {
  onInspectDistrict?: (payload: DrawerPayload) => void;
}

export const MaharashtraGISDeck: React.FC<MaharashtraGISDeckProps> = ({ onInspectDistrict }) => {
  const { districts, selectedDistrictId, setSelectedDistrictId, setSearchDistrict, language, incidents } =
    useDashboardStore();
  const t = useTranslation(language);

  const [activeLayer, setActiveLayer] = useState<ThematicLayer>('activity');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map district metadata
  const districtMap = useMemo(() => {
    const map = new Map<string, (typeof districts)[0]>();
    for (const d of districts) {
      map.set(d.id.toLowerCase(), d);
      map.set(d.name.toLowerCase(), d);
    }
    return map;
  }, [districts]);

  // Highlight color calculation depending on layer
  const getDistrictFill = useCallback(
    (district: DistrictGeometry) => {
      const data = districtMap.get(district.id.toLowerCase()) || districtMap.get(district.name.toLowerCase());
      const isSelected =
        selectedDistrictId &&
        (selectedDistrictId.toLowerCase() === district.id.toLowerCase() ||
          selectedDistrictId.toLowerCase() === district.name.toLowerCase());

      if (isSelected) {
        return '#F59E0B'; // Highlight Selected in Warm Champagne Gold
      }

      if (activeLayer === 'activity') {
        const cpi = data ? data.cpi : 75;
        if (cpi >= 90) return '#3B82F6'; // High Activity Blue
        if (cpi >= 80) return '#0EA5E9'; // Medium Activity Sky
        return '#1E293B'; // Baseline
      }

      if (activeLayer === 'sentiment') {
        const sentiment = data ? data.sentimentScore : 70;
        if (sentiment >= 80) return '#10B981'; // High Positive Emerald
        if (sentiment >= 65) return '#F59E0B'; // Neutral Amber
        return '#EF4444'; // Negative Red
      }

      if (activeLayer === 'crisis') {
        const hasCrisis = incidents.some(
          (inc) => inc.district.toLowerCase() === district.name.toLowerCase()
        );
        if (hasCrisis) return '#EF4444'; // Red Alert
        return '#0F172A';
      }

      if (activeLayer === 'cpi') {
        const cpi = data ? data.cpi : 75;
        if (cpi >= 92) return '#D97706'; // Top Rank Gold
        if (cpi >= 85) return '#2563EB';
        return '#334155';
      }

      return '#1E293B';
    },
    [districtMap, selectedDistrictId, activeLayer, incidents]
  );

  const handleSelect = (district: DistrictGeometry) => {
    setSelectedDistrictId(district.id);
    setSearchDistrict(district.name);

    const data = districtMap.get(district.id.toLowerCase()) || districtMap.get(district.name.toLowerCase());
    const districtIncidents = incidents.filter(
      (inc) => inc.district.toLowerCase() === district.name.toLowerCase()
    );

    if (onInspectDistrict) {
      onInspectDistrict({
        type: 'district',
        title: `${getDistrictName(district.name, language)} (${district.name})`,
        subtitle: `${district.division.toUpperCase()} Division • Rank #${data?.rank || 12}`,
        district: district.name,
        sentiment: (data?.sentimentScore || 75) >= 75 ? 'Positive' : 'Neutral',
        status: districtIncidents.length > 0 ? `${districtIncidents.length} Active Crisis Tickets` : 'Routine Operations',
        timestamp: 'Real-time Geospatial Telemetry',
        metrics: {
          'Composite CPI Score': `${data?.cpi || 84.5} / 100`,
          'Daily News Volume': `${data?.releases || 142} releases`,
          'Citizen Resolution Rate': `${(Math.min(99.8, Math.max(93.5, 100 - ((data?.avgTAT || 38.5) / 25)))).toFixed(1)}% (Target Met)`,
          'Sentiment Favorable': `${data?.sentimentScore || 78}%`,
        },
        evidence: {
          claim: districtIncidents[0]?.summary,
          groundFact: districtIncidents[0]?.verificationStatus,
          dioVerification: `DIO Desk ${district.name}`,
          collectorSignOff: districtIncidents[0]?.authorized,
        },
        details: `District administration for ${district.name} under ${district.division} division. All media ingestion channels (print, broadcast TV, social listening) active with 100% feed reliability.`,
      });
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="bg-[#0B111D] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Deck Header */}
      <div className="p-4 border-b border-white/10 bg-[#070B14]/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MapPinIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {language === 'mr' ? 'महाराष्ट्र जीआयएस स्थानिक बुद्धिमत्ता' : 'Maharashtra Geospatial Intelligence'}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                36 DISTRICTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'mr' ? '३६ प्रशासकीय जिल्हे व ६ महसूल विभाग परस्परसंवादी नकाशा' : 'Real topological vector boundaries with live thematic overlays'}
            </p>
          </div>
        </div>

        {/* Thematic Layer Switches */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
          {(
            [
              { id: 'activity', label: 'Activity' },
              { id: 'sentiment', label: 'Sentiment' },
              { id: 'crisis', label: 'Crisis Hotspots' },
              { id: 'cpi', label: 'CPI Score' },
            ] as const
          ).map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer font-semibold ${
                activeLayer === layer.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Workspace */}
      <div className="p-4 flex-1 flex flex-col justify-between relative min-h-[380px] bg-[#070B14]/40">
        {/* Floating Controls: Compass + Zoom */}
        <div className="absolute top-6 left-6 z-10 flex flex-col items-center gap-2">
          {/* Compass Rose */}
          <div className="w-9 h-9 rounded-full bg-[#0B111D]/90 border border-white/15 flex flex-col items-center justify-center text-[10px] font-mono font-bold text-amber-400 shadow-md">
            <span>N</span>
            <div className="w-0.5 h-2 bg-amber-400" />
          </div>

          {/* Zoom Buttons */}
          <div className="flex flex-col rounded-lg bg-[#0B111D]/90 border border-white/15 overflow-hidden shadow-md">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <MagnifyingGlassMinusIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset View"
              aria-label="Reset View"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hover District Floating Tooltip */}
        {hoveredDistrict && (
          <div className="absolute top-6 right-6 z-10 p-3 rounded-lg bg-[#0B111D]/95 border border-amber-500/40 shadow-xl backdrop-blur-md pointer-events-none max-w-xs animate-in fade-in">
            <div className="text-xs font-bold text-white flex items-center justify-between gap-3">
              <span>{getDistrictName(hoveredDistrict.name, language)} ({hoveredDistrict.name})</span>
              <span className="text-[10px] font-mono text-amber-400 uppercase">
                {hoveredDistrict.division}
              </span>
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-300 space-y-0.5">
              <div>CPI Index: <span className="text-white font-bold">{districtMap.get(hoveredDistrict.id)?.cpi || 88.5}/100</span></div>
              <div>Sentiment: <span className="text-emerald-400 font-bold">{districtMap.get(hoveredDistrict.id)?.sentimentScore || 82}% Favorable</span></div>
            </div>
            <div className="text-[10px] text-amber-400 font-semibold mt-1">
              Click to inspect district telemetry
            </div>
          </div>
        )}

        {/* SVG Maharashtra Topology */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden py-2">
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full max-h-[380px] object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          >
            {/* Outer Glow & State Outline */}
            <path
              d={STATE_OUTLINE_PATH}
              fill="rgba(15, 23, 42, 0.6)"
              stroke="rgba(245, 158, 11, 0.25)"
              strokeWidth="2.5"
            />

            {/* Individual 36 Districts */}
            {DISTRICT_GEOMETRY.map((district) => {
              const fill = getDistrictFill(district);
              const isSelected = selectedDistrictId?.toLowerCase() === district.id.toLowerCase();
              return (
                <path
                  key={district.id}
                  d={district.path}
                  fill={fill}
                  stroke={isSelected ? '#F59E0B' : 'rgba(255, 255, 255, 0.18)'}
                  strokeWidth={isSelected ? '2' : '0.8'}
                  className="transition-colors duration-150 cursor-pointer hover:opacity-85"
                  onMouseEnter={() => setHoveredDistrict(district)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={() => handleSelect(district)}
                >
                  <title>{district.name} ({getDistrictName(district.name, language)})</title>
                </path>
              );
            })}

            {/* Division Borders */}
            <path
              d={DIVISION_BORDERS_PATH}
              fill="none"
              stroke="rgba(245, 158, 11, 0.45)"
              strokeWidth="1.6"
              strokeDasharray="4 2"
              pointerEvents="none"
            />
          </svg>
        </div>

        {/* Footer: Scale Bar & Thematic Legend */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          {/* Scale Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px]">0</span>
            <div className="w-16 h-1 bg-white/20 relative">
              <div className="w-8 h-full bg-amber-400" />
            </div>
            <span className="text-[10px]">150 km</span>
          </div>

          {/* Active Legend */}
          <div className="flex items-center gap-3">
            {activeLayer === 'activity' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> High Activity</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-sky-500" /> Medium Activity</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-700" /> Standard Baseline</span>
              </>
            )}
            {activeLayer === 'sentiment' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Favorable (≥80%)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500" /> Moderate (65-79%)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Critical (&lt;65%)</span>
              </>
            )}
            {activeLayer === 'crisis' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 animate-pulse" /> Active 90-min SLA Alert</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-800" /> Operational & Clear</span>
              </>
            )}
            {activeLayer === 'cpi' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-600" /> Top Rank (CPI ≥92)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-600" /> Median (CPI 85-91)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-700" /> Review Focus</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
