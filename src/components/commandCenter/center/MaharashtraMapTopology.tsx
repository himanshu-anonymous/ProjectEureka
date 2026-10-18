'use client';

import React, { useState, useMemo } from 'react';
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
import { Language } from '@/types/dashboard';
import { getDistrictName } from '@/lib/dataLocalization';

interface MaharashtraMapTopologyProps {
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

const DIVISION_FILL: Record<DivisionId, { base: string; border: string }> = {
  konkan: { base: '#C7E8E4', border: '#70AEA7' },
  nashik: { base: '#FBE8BC', border: '#D9B464' },
  pune: { base: '#CFDCF8', border: '#789BE4' },
  'chhatrapati-sambhajinagar': { base: '#F4CED8', border: '#D38096' },
  amravati: { base: '#D9F1CF', border: '#8ABF76' },
  nagpur: { base: '#FCD7C0', border: '#DCA07A' },
};

const DIVISION_NAMES: Record<Language, Record<DivisionId, string>> = {
  en: {
    konkan: 'Konkan',
    nashik: 'Nashik',
    pune: 'Pune',
    'chhatrapati-sambhajinagar': 'Chh. Sambhajinagar',
    amravati: 'Amravati',
    nagpur: 'Nagpur',
  },
  mr: {
    konkan: 'कोकण',
    nashik: 'नाशिक',
    pune: 'पुणे',
    'chhatrapati-sambhajinagar': 'छ. संभाजीनगर',
    amravati: 'अमरावती',
    nagpur: 'नागपूर',
  },
};

export const MaharashtraMapTopology: React.FC<MaharashtraMapTopologyProps> = ({
  selectedDistrictId,
  onSelectDistrict,
}) => {
  const { districts, language } = useDashboardStore();
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictGeometry | null>(null);
  const [activeDivisionFilter, setActiveDivisionFilter] = useState<string>('all');

  // Find CPI for a given district
  const getDistrictCPI = (districtId: string): number => {
    const normalized = districtId === 'aurangabad' ? 'chhatrapati-sambhajinagar' : districtId;
    const found = districts.find(
      (d) => d.id === normalized || d.id === districtId || d.name.toLowerCase() === districtId.toLowerCase()
    );
    return found ? found.cpi : 75;
  };

  const activeDivNames = DIVISION_NAMES[language] || DIVISION_NAMES.en;

  // Resolve active district geometry (either hovered or currently selected)
  const activeDistrictGeo = useMemo(() => {
    if (hoveredDistrict) return hoveredDistrict;
    const targetId = selectedDistrictId || 'sindhudurg';
    const normalized =
      targetId === 'aurangabad'
        ? 'chhatrapati-sambhajinagar'
        : targetId === 'mumbai'
        ? 'mumbai-city'
        : targetId;
    return (
      DISTRICT_GEOMETRY.find((d) => d.id === normalized || d.id === targetId) ||
      DISTRICT_GEOMETRY[0]
    );
  }, [hoveredDistrict, selectedDistrictId]);

  const activeDivisionId = activeDistrictGeo.division;
  const activeDivisionName = activeDivNames[activeDivisionId] || activeDivNames.konkan;
  const activeDistrictName = getDistrictName(activeDistrictGeo.name, language);
  const activeDistrictCPI = getDistrictCPI(activeDistrictGeo.id);

  return (
    <div className="bg-surface rounded-lg border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
      {/* Top Header & Division Filter Bar */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gov-primary">
            {language === 'mr'
              ? 'महाराष्ट्र ३६-जिल्हे जीआयएस व्हेक्टर टोपोलॉजी'
              : 'Maharashtra 36-District GIS Vector Topology'}
          </span>
          <span className="text-slate-300 font-mono select-none">|</span>
          <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wide uppercase">
            {language === 'mr' ? 'वास्तविक सीमा मॉडेल' : 'Real Boundary Model'}
          </span>
        </div>

        {/* Division Filter Badges */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] no-scrollbar">
          <button
            onClick={() => setActiveDivisionFilter('all')}
            className={`px-2 py-0.5 rounded transition-colors font-semibold cursor-pointer ${
              activeDivisionFilter === 'all'
                ? 'bg-gov-primary text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {language === 'mr' ? 'सर्व ६ विभाग' : 'All 6 Divisions'}
          </button>
          {(Object.keys(DIVISION_FILL) as DivisionId[]).map((divId) => (
            <button
              key={divId}
              onClick={() => setActiveDivisionFilter(activeDivisionFilter === divId ? 'all' : divId)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap font-medium cursor-pointer ${
                activeDivisionFilter === divId
                  ? 'bg-gov-primary text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {activeDivNames[divId]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="w-full h-72 sm:h-80 bg-slate-100/60 relative flex items-center justify-center p-2 select-none overflow-hidden">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full max-h-80 object-contain drop-shadow-xs"
          role="img"
          aria-label={language === 'mr' ? 'महाराष्ट्र ३६ प्रशासकीय जिल्हे नकाशा' : 'Interactive Maharashtra GIS Map showing 36 administrative districts'}
        >
          {/* State boundary background shadow */}
          <path
            d={STATE_OUTLINE_PATH}
            fill="#CBD5E1"
            className="translate-x-1 translate-y-1 opacity-40"
          />

          {/* State base outline */}
          <path
            d={STATE_OUTLINE_PATH}
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* 36 District Polygons */}
          {DISTRICT_GEOMETRY.map((district) => {
            const isSelected =
              district.id === selectedDistrictId ||
              (selectedDistrictId === 'aurangabad' && district.id === 'chhatrapati-sambhajinagar') ||
              (selectedDistrictId === 'mumbai' && district.id === 'mumbai-city');

            const isHovered = hoveredDistrict?.id === district.id;
            const matchesDivision =
              activeDivisionFilter === 'all' || district.division === activeDivisionFilter;

            const divStyle = DIVISION_FILL[district.division];
            const defaultFill = divStyle ? divStyle.base : '#E2E8F0';

            // High-contrast coloring
            let fill = defaultFill;
            let stroke = '#FFFFFF';
            let strokeWidth = '1.8';

            if (!matchesDivision) {
              fill = '#F1F5F9';
              stroke = '#E2E8F0';
            } else if (isSelected) {
              fill = '#1B2A4A'; // Government Navy
              stroke = '#D97706'; // Saffron accent outline
              strokeWidth = '4';
            } else if (isHovered) {
              fill = '#3B82F6'; // Blue hover
              stroke = '#FFFFFF';
              strokeWidth = '3';
            }

            const localizedName = getDistrictName(district.name, language);

            return (
              <g
                key={district.id}
                role="button"
                tabIndex={0}
                aria-label={`District ${localizedName}, ${activeDivNames[district.division]} division`}
                className="cursor-pointer transition-colors focus:outline-none"
                onClick={() => onSelectDistrict(district.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDistrict(district.id);
                  }
                }}
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onFocus={() => setHoveredDistrict(district)}
                onBlur={() => setHoveredDistrict(null)}
              >
                <path
                  d={district.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />
                {/* District Label */}
                {matchesDivision && (
                  <text
                    x={district.pin.x}
                    y={district.pin.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#FFFFFF' : isHovered ? '#FFFFFF' : '#1E293B'}
                    fontSize={isSelected || isHovered ? '11' : '8.5'}
                    fontWeight={isSelected || isHovered ? 'bold' : '600'}
                    className="pointer-events-none transition-all select-none"
                  >
                    {localizedName}
                  </text>
                )}
              </g>
            );
          })}

          {/* Division Borders Overlay */}
          <path
            d={DIVISION_BORDERS_PATH}
            fill="none"
            stroke="#1B2A4A"
            strokeWidth="3.5"
            strokeDasharray="6 3"
            strokeLinejoin="round"
            className="pointer-events-none opacity-60"
          />
        </svg>

        {/* Hover / Selection Telemetry Tooltip Overlay */}
        {(hoveredDistrict || selectedDistrictId) && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-md text-xs pointer-events-none space-y-1.5 min-w-[195px] z-10">
            <div className="font-bold text-gov-primary flex items-center justify-between gap-2">
              <span className="truncate">{activeDistrictName}</span>
              <span className="text-[11px] font-mono font-bold text-gov-accent shrink-0">
                {activeDistrictCPI} CPI
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
              <span>{language === 'mr' ? 'विभाग:' : 'Division:'}</span>
              <span className="font-semibold text-slate-700">{activeDivisionName}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="truncate">{language === 'mr' ? 'डीआयओ पाहण्यासाठी क्लिक करा' : 'Click to inspect DIO'}</span>
              <div className="flex items-center gap-1 shrink-0 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{language === 'mr' ? 'सक्रिय' : 'Active'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Bottom Legend Bar (outside map canvas so it NEVER overlaps Sindhudurg or any southern district) */}
      <div className="px-3 py-2 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#1B2A4A] border border-[#D97706] shrink-0"></span>
            <span>{language === 'mr' ? 'निवडलेला जिल्हा' : 'Selected District'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#CFDCF8] shrink-0"></span>
            <span>{language === 'mr' ? 'विभागीय गट' : 'Division Clusters'}</span>
          </span>
        </div>
        <span className="text-slate-400 hidden sm:inline">
          {language === 'mr'
            ? '• माहिती पाहण्यासाठी कोणत्याही जिल्ह्यावर क्लिक करा'
            : '• Click any district to sync telemetry'}
        </span>
      </div>
    </div>
  );
};
