'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DistrictPerformanceChart } from '@/components/zones/DistrictLeaderboard/DistrictPerformanceChart';
import { Skeleton } from '@/components/shared/Skeleton';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { ShieldCheckIcon } from '@heroicons/react/20/solid';

export const KeyMetricsTrends: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    language,
    isLoadingData,
  } = useDashboardStore();

  const sentimentData = useMemo(() => {
    return {
      positive: 74.2,
      neutral: 18.5,
      critical: 7.3,
      channelPrint: 35,
      channelTV: 25,
      channelSocial: 25,
      channelDesk: 15,
    };
  }, []);

  if (isLoadingData) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm space-y-4 min-h-[300px]">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-6 w-56 rounded" />
          <Skeleton variant="subtle" className="h-5 w-32 rounded" />
        </div>
        <div className="h-56 flex items-end justify-between gap-4 px-4 pt-4">
          {[32, 36, 28, 32, 24].map((h, i) => (
            <Skeleton key={i} className={`h-${h} w-14 rounded-t`} />
          ))}
        </div>
      </div>
    );
  }

  const [chartMode, setChartMode] = useState<'donut' | 'pie'>('pie');

  // Precision trigonometry math for clean Pie and Donut SVG slices
  const sentimentSlices = useMemo(() => {
    const total = sentimentData.positive + sentimentData.neutral + sentimentData.critical;
    const slices = [
      {
        name: language === 'mr' ? 'सकारात्मक' : 'Positive',
        value: sentimentData.positive,
        color: '#20A765', // Lovable Emerald
      },
      {
        name: language === 'mr' ? 'तटस्थ' : 'Neutral',
        value: sentimentData.neutral,
        color: '#0284C7', // Lovable Ocean Blue
      },
      {
        name: language === 'mr' ? 'गंभीर' : 'Critical',
        value: sentimentData.critical,
        color: '#E94B4B', // Lovable Alert Red
      },
    ];

    const size = 120;
    const center = size / 2; // 60
    const radius = 50;
    const innerRadius = chartMode === 'donut' ? 32 : 0;

    let cumulativeAngle = -Math.PI / 2; // Start at 12 o'clock

    return slices.map((item) => {
      const fraction = total > 0 ? item.value / total : 0;
      const sweepAngle = fraction * 2 * Math.PI;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sweepAngle;
      cumulativeAngle = endAngle;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = sweepAngle > Math.PI ? 1 : 0;

      let pathD = '';
      if (chartMode === 'donut' && innerRadius > 0) {
        const ix1 = center + innerRadius * Math.cos(endAngle);
        const iy1 = center + innerRadius * Math.sin(endAngle);
        const ix2 = center + innerRadius * Math.cos(startAngle);
        const iy2 = center + innerRadius * Math.sin(startAngle);
        pathD = [
          `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
          `L ${ix1.toFixed(2)} ${iy1.toFixed(2)}`,
          `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)}`,
          'Z',
        ].join(' ');
      } else {
        pathD = [
          `M ${center} ${center}`,
          `L ${x1.toFixed(2)} ${y1.toFixed(2)}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
          'Z',
        ].join(' ');
      }

      return {
        ...item,
        pathD,
      };
    });
  }, [sentimentData, chartMode, language]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full min-h-0">
      {/* 1. Top Header */}
      <div className="px-2 py-0.5 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-1 shrink-0">
        <div className="flex items-center gap-1">
          <div className="p-0.5 rounded-md bg-emerald-50 text-[#20A765]">
            <MaterialIcon name="bar_chart" size="xs" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none">
              {language === 'mr' ? 'प्रमुख निर्देशक व कल विश्लेषण' : 'Key Metrics & Analytics'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[8.5px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded shadow-2xs">
            {selectedDivision}
          </span>
        </div>
      </div>

      {/* Internal Scrollable Content Body (Fits in all screen sizes) */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin flex flex-col divide-y divide-slate-100">
        {/* 2. Primary Comparative Bar Chart Section */}
        <div className="p-1 shrink-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#20A765]" />
              <h4 className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wide">
                {language === 'mr' ? 'जिल्हा प्रसिद्धी व निवारण प्रमाण' : 'District Dispatches & Resolution Velocity'}
              </h4>
            </div>
            <span className="text-[8.5px] text-slate-500 font-mono font-medium">
              {language === 'mr' ? 'शीर्ष ५ जिल्हे' : 'Top 5 Districts'}
            </span>
          </div>

          <DistrictPerformanceChart
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={setSelectedDistrictId}
          />
        </div>

        {/* 3. Distinct Circle Graph: Omni-Channel Citizen Sentiment & Public Tone (Pie / Donut) */}
        <div className="p-1 flex-1 min-h-0 flex flex-col justify-between bg-slate-50/40">
          {/* Section Sub-header with Pie / Donut Toggle */}
          <div className="flex items-center justify-between pb-0.5 mb-0.5 border-b border-slate-200/80">
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#0284C7]" />
              <h4 className="text-[9.5px] font-bold text-slate-800 uppercase tracking-wide">
                {language === 'mr' ? 'राज्यव्यापी लोकभावना व सूर' : 'Statewide Sentiment Disposition'}
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Pie / Donut Toggle */}
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded text-[8.5px] font-semibold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChartMode('pie')}
                  className={`px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                    chartMode === 'pie'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="View Pie Chart"
                >
                  {language === 'mr' ? 'पाय' : 'Pie'}
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('donut')}
                  className={`px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                    chartMode === 'donut'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-label="View Donut Chart"
                >
                  {language === 'mr' ? 'डोनट' : 'Donut'}
                </button>
              </div>
              <span className="text-[8.5px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                {language === 'mr' ? 'थेट' : 'Live'}: 74.2%
              </span>
            </div>
          </div>

          {/* Unified Visual Box: Pie/Donut Graph (Left) + Breakdown (Right) */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-1.5 flex flex-row items-center justify-between gap-2 flex-1 min-h-0">
            {/* A. The Pie / Donut Chart */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 shrink-0 relative flex items-center justify-center">
              <svg
                className="w-full h-full transform-gpu overflow-visible"
                viewBox="0 0 120 120"
                aria-label="Omni-Channel Sentiment Gauge"
              >
                {sentimentSlices.map((slice) => (
                  <path
                    key={slice.name}
                    d={slice.pathD}
                    fill={slice.color}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="transition-all duration-300 hover:opacity-90"
                  >
                    <title>{`${slice.name}: ${slice.value}%`}</title>
                  </path>
                ))}
              </svg>

              {/* Center Overlay: Badge in Pie mode, Telemetry in Donut mode */}
              {chartMode === 'donut' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
                  <span className="text-sm sm:text-base font-black font-mono text-slate-900 tracking-tight leading-none">
                    74%
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-wider leading-none mt-0.5">
                    {language === 'mr' ? 'सकारात्मक' : 'Positive'}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[7.5px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-full border border-emerald-200 mt-0.5 shadow-2xs">
                    ▲ +2.4%
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <div className="bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-full shadow-xs border border-slate-200/90 flex items-center gap-1">
                    <span className="text-[10px] sm:text-xs font-black font-mono text-slate-900 leading-none">
                      74.2%
                    </span>
                    <span className="text-[7px] sm:text-[7.5px] font-bold text-emerald-600">
                      ▲+2.4%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* B. Disposition Breakdown Rows (Right Side) */}
            <div className="flex-1 w-full min-w-0 flex flex-col justify-between gap-0.5 text-xs">
              {/* Row 1: Positive */}
              <div className="px-2 py-1 rounded bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#20A765] shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    {language === 'mr' ? 'सकारात्मक / समाधान' : 'Positive Feedback'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 shrink-0">
                  74.2%
                </span>
              </div>

              {/* Row 2: Neutral */}
              <div className="px-2 py-1 rounded bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    {language === 'mr' ? 'तटस्थ / शासकीय माहिती' : 'Informative / Neutral'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-800 shrink-0">
                  18.5%
                </span>
              </div>

              {/* Row 3: Critical */}
              <div className="px-2 py-1 rounded bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#E94B4B] shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    {language === 'mr' ? 'दक्षता / तक्रार निवारण' : 'Critical / Inquiries'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-800 shrink-0">
                  7.3%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
