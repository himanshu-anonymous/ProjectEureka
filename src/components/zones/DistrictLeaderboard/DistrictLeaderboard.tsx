'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LeaderboardTabs, LeaderboardTab } from './LeaderboardTabs';
import { DistrictPerformanceChart } from './DistrictPerformanceChart';
import { DistrictSearchBar } from './DistrictSearchBar';
import { DistrictTable } from './DistrictTable';
import { LeaderboardSkeleton } from '@/components/skeletons/LeaderboardSkeleton';

export interface DistrictLeaderboardProps {
  showChart?: boolean;
  /** Optional prop to enable cross-panel highlighting when a district row is clicked */
  highlightDistrict?: (districtId: string) => void;
}

export const DistrictLeaderboard: React.FC<DistrictLeaderboardProps> = (
  { showChart = true, highlightDistrict }: DistrictLeaderboardProps) => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    searchDistrict,
    setSearchDistrict,
    language,
    isLoadingData,
  } = useDashboardStore();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<LeaderboardTab>('cpi');

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivision === 'All Maharashtra' || d.division === selectedDivision;
      const matchesSearch = d.name.toLowerCase().includes(searchDistrict.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [districts, selectedDivision, searchDistrict]);

  // Safeguard #1: Return skeleton directly at root level to prevent double card wrappers
  if (isLoadingData) {
    return <LeaderboardSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
      {/* Header and Sub-tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.zone2.title}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {t.zone2.subtitle}
          </span>
        </div>
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Top 5 Bar Chart */}
        {showChart && (
          <DistrictPerformanceChart
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={setSelectedDistrictId}
          />
        )}

        {/* Controls: Search and Division Counter */}
        <DistrictSearchBar
          searchDistrict={searchDistrict}
          onSearchChange={setSearchDistrict}
          filteredCount={filteredDistricts.length}
          totalCount={districts.length}
        />

        {/* Ranked District Table - rows now support cross-panel highlighting */}
        <DistrictTable
          districts={filteredDistricts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
          highlightDistrict={highlightDistrict}
        />
      </div>
    </div>
  );
};
