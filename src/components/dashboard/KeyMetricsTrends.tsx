'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { DistrictPerformanceChart } from '@/components/zones/DistrictLeaderboard/DistrictPerformanceChart';
import { Skeleton } from '@/components/shared/Skeleton';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const KeyMetricsTrends: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    language,
    isLoadingData,
  } = useDashboardStore();

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full min-h-0">
      {/* 1. Top Header */}
      <div className="px-2.5 py-1 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-emerald-50 text-[#20A765]">
            <MaterialIcon name="bar_chart" size="xs" />
          </div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none">
              {language === 'mr' ? 'प्रमुख निर्देशक व कल विश्लेषण' : 'Key Metrics & Analytics'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            {selectedDivision}
          </span>
        </div>
      </div>

      {/* Internal Content Body - Expanded District Performance Bar Chart occupying full height */}
      <div className="flex-1 min-h-0 p-2 flex flex-col">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20A765]" />
            <h4 className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wide">
              {language === 'mr' ? 'जिल्हा प्रसिद्धी व निवारण प्रमाण' : 'District Dispatches & Resolution Velocity'}
            </h4>
          </div>
          <span className="text-[9px] text-slate-500 font-mono font-medium">
            {language === 'mr' ? 'शीर्ष ५ जिल्हे' : 'Top 5 Districts'}
          </span>
        </div>

        {/* Fully Expanded Performance Chart */}
        <div className="flex-1 min-h-0 w-full h-full flex flex-col">
          <DistrictPerformanceChart
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={setSelectedDistrictId}
            className="flex-1 h-full min-h-0"
          />
        </div>
      </div>
    </div>
  );
};
