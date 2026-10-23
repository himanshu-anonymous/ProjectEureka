'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
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
  const t = useTranslation(language);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-gov-blue">
            <MaterialIcon name="bar_chart" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {language === 'mr' ? 'प्रमुख निर्देशक व कल विश्लेषण' : 'Key Metrics & Trends'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {language === 'mr'
                ? 'शीर्ष ५ जिल्ह्यांचे ४ कामगिरी घटकांनुसार तुलनात्मक विश्लेषण'
                : 'Top 5 District Comparative Breakdown (Volume, Response Speed, Sentiment, SLA)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded">
            {selectedDivision}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-5 sm:p-6">
        <DistrictPerformanceChart
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />
      </div>
    </div>
  );
};
