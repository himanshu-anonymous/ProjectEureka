'use client';

import React, { useMemo } from 'react';
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

  // Precision circumference math for donut circle:
  // r = 44, circumference = 2 * PI * 44 = 276.46
  const circumference = 276.46;
  const posLength = (sentimentData.positive / 100) * circumference;
  const neuLength = (sentimentData.neutral / 100) * circumference;
  const critLength = (sentimentData.critical / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full">
      {/* 1. Top Header */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-[#20A765]">
            <MaterialIcon name="bar_chart" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
              {language === 'mr' ? 'प्रमुख निर्देशक व कल विश्लेषण' : 'Key Metrics & Analytics'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'mr'
                ? 'जिल्हा प्रसिद्धी प्रमाण व राज्यव्यापी लोकभावना कल'
                : 'District Output vs Target & Multi-Channel Sentiment'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md shadow-2xs">
            {selectedDivision}
          </span>
        </div>
      </div>

      {/* 2. Primary Comparative Bar Chart Section */}
      <div className="p-3.5 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#20A765]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {language === 'mr' ? 'जिल्हा प्रसिद्धी व निवारण प्रमाण' : 'District Dispatches & Resolution Velocity'}
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {language === 'mr' ? 'शीर्ष ५ जिल्हे' : 'Top 5 Districts'}
          </span>
        </div>

        <DistrictPerformanceChart
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />
      </div>

      {/* 3. Distinct Circle Graph: Omni-Channel Citizen Sentiment & Public Tone Donut */}
      <div className="p-4 pt-3 flex-1 flex flex-col justify-between border-t border-slate-100 bg-slate-50/40">
        {/* Section Sub-header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {language === 'mr' ? 'राज्यव्यापी लोकभावना व माध्यम सूर चक्र' : 'Statewide Sentiment & Public Tone Disposition'}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {language === 'mr' ? 'थेट कल' : 'Live Index'}: 74.2%
          </span>
        </div>

        {/* Unified Visual Box: Circle Graph (Left) + Breakdown (Right) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-1">
          {/* A. The Circle Donut Graph */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 relative flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform-gpu"
              viewBox="0 0 120 120"
              aria-label="Omni-Channel Sentiment Gauge"
            >
              {/* Background Track */}
              <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="10"
              />

              {/* Segment 1: Positive (74.2%) */}
              <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="#20A765" // Lovable Emerald
                strokeWidth="10"
                strokeDasharray={`${posLength} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Segment 2: Neutral (18.5%) */}
              <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="#0284C7" // Lovable Ocean Blue
                strokeWidth="10"
                strokeDasharray={`${neuLength} ${circumference}`}
                strokeDashoffset={-posLength}
                className="transition-all duration-500"
              />

              {/* Segment 3: Critical (7.3%) */}
              <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="#E94B4B" // Lovable Alert Red
                strokeWidth="10"
                strokeDasharray={`${critLength} ${circumference}`}
                strokeDashoffset={-(posLength + neuLength)}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Center Content Hub */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-1">
              <span className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
                74%
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                {language === 'mr' ? 'सकारात्मक' : 'Positive'}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1 shadow-2xs">
                ▲ +2.4%
              </span>
            </div>
          </div>

          {/* B. Disposition Breakdown Rows (Right Side) */}
          <div className="flex-1 w-full min-w-0 flex flex-col justify-between gap-1.5">
            {/* Row 1: Positive */}
            <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20A765] shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {language === 'mr' ? 'सकारात्मक / समाधान' : 'Positive Feedback'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 shrink-0">
                74.2%
              </span>
            </div>

            {/* Row 2: Neutral */}
            <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {language === 'mr' ? 'तटस्थ / शासकीय माहिती' : 'Informative / Neutral'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-800 shrink-0">
                18.5%
              </span>
            </div>

            {/* Row 3: Critical */}
            <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E94B4B] shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {language === 'mr' ? 'दक्षता / तक्रार निवारण' : 'Critical / Inquiries'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-800 shrink-0">
                7.3%
              </span>
            </div>

            {/* Mini Multi-Channel Origin Tags */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-medium text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-center truncate">
                {language === 'mr' ? 'प्रिंट ओसीआर: ३५%' : 'Print OCR: 35%'}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-center truncate">
                {language === 'mr' ? 'दूरदर्शन: २५%' : 'TV Broadcast: 25%'}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-center truncate">
                {language === 'mr' ? 'सोशल मीडिया: २५%' : 'Social Media: 25%'}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-center truncate">
                {language === 'mr' ? 'नागरिक अर्ज: १५%' : 'Citizen Desk: 15%'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Bottom Quality Benchmark Status Strip */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/90 flex items-center justify-between text-xs text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">
              {language === 'mr'
                ? 'राज्य संनियंत्रण मानक: वर्ग अ+ (उत्कृष्ट संपादन)'
                : 'State Standard: Grade A+ (Optimal Performance)'}
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-bold border border-emerald-200 shrink-0">
            99.2% Uptime
          </span>
        </div>
      </div>
    </div>
  );
};
