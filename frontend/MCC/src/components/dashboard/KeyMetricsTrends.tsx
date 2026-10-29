'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { DistrictPerformanceChart } from '@/components/zones/DistrictLeaderboard/DistrictPerformanceChart';
import { Skeleton } from '@/components/shared/Skeleton';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';

type PillarKey = 'volume' | 'tat' | 'sentiment' | 'crisis';

export const KeyMetricsTrends: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    language,
    isLoadingData,
  } = useDashboardStore();
  const t = useTranslation(language);

  const [hoveredPillar, setHoveredPillar] = useState<PillarKey | null>(null);

  // Memoized 4-pillar averages computed from live district telemetry
  const pillarAverages = useMemo(() => {
    if (!districts || districts.length === 0) {
      return { volume: 22.8, tat: 22.4, sentiment: 21.6, crisis: 23.5, total: 90.3 };
    }
    const count = districts.length;
    const volSum = districts.reduce((acc, d) => acc + (d.volumeScore || 22), 0);
    const tatSum = districts.reduce((acc, d) => acc + (d.tatScore || 22), 0);
    const sentSum = districts.reduce((acc, d) => acc + (d.sentimentScore || 21), 0);
    const criSum = districts.reduce((acc, d) => acc + (d.crisisScore || 23), 0);
    const cpiSum = districts.reduce((acc, d) => acc + (d.cpi || 88), 0);

    return {
      volume: +(volSum / count).toFixed(1),
      tat: +(tatSum / count).toFixed(1),
      sentiment: +(sentSum / count).toFixed(1),
      crisis: +(criSum / count).toFixed(1),
      total: +(cpiSum / count).toFixed(1),
    };
  }, [districts]);

  // Current scope: selected district if clicked, otherwise statewide aggregate
  const currentData = useMemo(() => {
    const selected = districts.find((d) => d.id === selectedDistrictId);
    if (selected) {
      return {
        name: language === 'mr' ? (selected.nameMr || selected.name) : selected.name,
        isStatewide: false,
        volume: +(selected.volumeScore ?? 22.8).toFixed(1),
        tat: +(selected.tatScore ?? 22.4).toFixed(1),
        sentiment: +(selected.sentimentScore ?? 21.6).toFixed(1),
        crisis: +(selected.crisisScore ?? 23.5).toFixed(1),
        total: +(selected.cpi ?? 90.3).toFixed(1),
      };
    }
    return {
      name: language === 'mr' ? 'राज्य सरासरी' : 'State Average',
      isStatewide: true,
      volume: pillarAverages.volume,
      tat: pillarAverages.tat,
      sentiment: pillarAverages.sentiment,
      crisis: pillarAverages.crisis,
      total: pillarAverages.total,
    };
  }, [districts, selectedDistrictId, pillarAverages, language]);

  // Pillar configuration with matching colors and precision circular arc offsets
  // Circumference = 2 * PI * 46 = 289.03. Quadrant = 72.26.
  // Segment length with 5px inter-slice gap and round caps: dash = 58.26, gap = 230.77.
  const pillars = useMemo(
    () => [
      {
        key: 'volume' as PillarKey,
        name: language === 'mr' ? 'प्रसिद्धी (Volume)' : 'Volume',
        fullName: language === 'mr' ? 'प्रसिद्धी प्रमाण' : 'Media Volume',
        score: currentData.volume,
        max: 25,
        color: '#1E3A8A', // Deep Navy Blue
        hoverColor: '#2563EB',
        dashOffset: -7.0,
      },
      {
        key: 'tat' as PillarKey,
        name: language === 'mr' ? 'प्रतिसाद (TAT)' : 'Response TAT',
        fullName: language === 'mr' ? 'प्रतिसाद गती' : 'Resolution Speed',
        score: currentData.tat,
        max: 25,
        color: '#0D9488', // Emerald Teal
        hoverColor: '#14B8A6',
        dashOffset: -79.26,
      },
      {
        key: 'sentiment' as PillarKey,
        name: language === 'mr' ? 'लोकभावना' : 'Sentiment',
        fullName: language === 'mr' ? 'लोकभावना सूर' : 'Public Tone',
        score: currentData.sentiment,
        max: 25,
        color: '#D97706', // Warm Amber
        hoverColor: '#F59E0B',
        dashOffset: -151.51,
      },
      {
        key: 'crisis' as PillarKey,
        name: language === 'mr' ? 'आपत्ती SLA' : 'Crisis SLA',
        fullName: language === 'mr' ? 'आपत्ती निवारण' : 'Emergency SLA',
        score: currentData.crisis,
        max: 25,
        color: '#6366F1', // Royal Indigo
        hoverColor: '#818CF8',
        dashOffset: -223.77,
      },
    ],
    [currentData, language]
  );

  if (isLoadingData) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4 min-h-[240px]">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-5 w-56 rounded" />
          <Skeleton variant="subtle" className="h-4 w-32 rounded" />
        </div>
        <div className="h-48 flex items-end justify-between gap-6 px-8 pt-5">
          <Skeleton className="h-32 w-16 rounded-t" />
          <Skeleton className="h-36 w-16 rounded-t" />
          <Skeleton className="h-28 w-16 rounded-t" />
          <Skeleton className="h-32 w-16 rounded-t" />
          <Skeleton className="h-24 w-16 rounded-t" />
        </div>
      </div>
    );
  }

  const activeHoveredPillar = pillars.find((p) => p.key === hoveredPillar);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full">
      {/* 1. Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-gov-blue">
            <MaterialIcon name="bar_chart" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {language === 'mr' ? 'प्रमुख निर्देशक व कल विश्लेषण' : 'Key Metrics & Trends'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              {language === 'mr'
                ? 'शीर्ष ५ जिल्ह्यांचे ४ कामगिरी घटकांनुसार तुलनात्मक विश्लेषण'
                : 'Top 5 District Comparative Breakdown (Volume, TAT, Sentiment, SLA)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs">
            {selectedDivision}
          </span>
        </div>
      </div>

      {/* 2. Primary Stacked Bar Chart Section (Properly Fitted in Box) */}
      <div className="p-3 sm:p-3.5 shrink-0">
        <DistrictPerformanceChart
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />
      </div>

      {/* 3. Aesthetic Down Space: Circular Donut Gauge & Side-by-Side Pillar Telemetry */}
      <div className="p-3.5 pt-2 flex-1 flex flex-col justify-between border-t border-slate-100 bg-slate-50/40">
        {/* Section Sub-header with Active Context Indicator */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h4 className="text-xs font-bold text-slate-800 tracking-tight">
              {language === 'mr' ? '४-घटक समतोल व समग्र संपादन' : '4-Pillar Composite Balance & Telemetry'}
            </h4>
          </div>

          {!currentData.isStatewide ? (
            <button
              type="button"
              onClick={() => setSelectedDistrictId('')}
              title={language === 'mr' ? 'राज्य सरासरीवर परत जा' : 'Reset to State Average'}
              className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{currentData.name}: {currentData.total} / 100</span>
              <span className="text-blue-500 hover:text-blue-900 font-bold leading-none">✕</span>
            </button>
          ) : (
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
              {currentData.name}: {currentData.total} / 100
            </span>
          )}
        </div>

        {/* Unified Card: Circle Graph (Left) + 4-Pillar Telemetry (Right) Side-by-Side */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 flex-1">
          {/* A. The Circle Graph (Donut Gauge with Center Hub) */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 relative flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform-gpu"
              viewBox="0 0 120 120"
              aria-label="4-Pillar Composite Gauge"
            >
              {/* Neutral Base Track Ring */}
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="8"
                strokeOpacity="0.7"
              />

              {/* 4 Precision Rounded Non-overlapping Quadrant Arcs */}
              {pillars.map((pillar) => {
                const isHovered = hoveredPillar === pillar.key;
                return (
                  <circle
                    key={pillar.key}
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke={isHovered ? pillar.hoverColor : pillar.color}
                    strokeWidth={isHovered ? 11 : 8}
                    strokeDasharray="58.26 230.77"
                    strokeDashoffset={pillar.dashOffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredPillar(pillar.key)}
                    onMouseLeave={() => setHoveredPillar(null)}
                    className="transition-all duration-300 ease-out cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Center Content Hub: Reactive to Hover & District Selection */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-2">
              {activeHoveredPillar ? (
                <div className="flex flex-col items-center justify-center animate-fade-in">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[80px]">
                    {activeHoveredPillar.name}
                  </span>
                  <span
                    className="text-xl font-black font-mono leading-none my-0.5"
                    style={{ color: activeHoveredPillar.color }}
                  >
                    {activeHoveredPillar.score}
                  </span>
                  <span className="text-[8px] font-semibold text-slate-400">
                    / 25 max
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
                    {currentData.total}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    CPI SCORE
                  </span>
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Target 100
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* B. 4-Pillar Breakdown Rows (Telemetry Legend on Right) */}
          <div className="flex-1 w-full min-w-0 flex flex-col justify-between space-y-1.5">
            {pillars.map((pillar) => {
              const isHovered = hoveredPillar === pillar.key;
              const percent = Math.round((pillar.score / pillar.max) * 100);

              return (
                <div
                  key={pillar.key}
                  onMouseEnter={() => setHoveredPillar(pillar.key)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs transition-transform duration-200"
                        style={{
                          backgroundColor: pillar.color,
                          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {pillar.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono shrink-0">
                      <strong className="text-xs font-bold text-slate-900">{pillar.score}</strong>
                      <span className="text-[10px] text-slate-400 font-medium">/ 25</span>
                      <span className="text-[9.5px] text-slate-500 font-medium ml-1">
                        ({percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: isHovered ? pillar.hoverColor : pillar.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Bottom Aesthetic Governance Benchmark Status Strip */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/90 flex items-center justify-between text-[11px] text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {language === 'mr'
                ? 'राज्य गुणवत्ता मानक: वर्ग अ+ (उत्कृष्ट संपादन)'
                : 'State Standard: Grade A+ (Optimal Performance)'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200 shrink-0">
            99.2% Uptime
          </span>
        </div>
      </div>
    </div>
  );
};

