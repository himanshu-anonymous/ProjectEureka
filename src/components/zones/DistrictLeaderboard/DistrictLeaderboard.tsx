'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LeaderboardTabs, LeaderboardTab } from './LeaderboardTabs';
import { DistrictPerformanceChart } from './DistrictPerformanceChart';
import { DistrictSearchBar } from './DistrictSearchBar';
import { DistrictTable } from './DistrictTable';

export const DistrictLeaderboard: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    searchDistrict,
    setSearchDistrict,
    language,
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

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header and Sub-tabs */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.zone2.title}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {t.zone2.subtitle}
          </span>
        </div>
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Top 5 Bar Chart */}
        <DistrictPerformanceChart
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />

        {/* Controls: Search and Division Counter */}
        <DistrictSearchBar
          searchDistrict={searchDistrict}
          onSearchChange={setSearchDistrict}
          filteredCount={filteredDistricts.length}
          totalCount={districts.length}
        />

        {/* Ranked District Table */}
        <DistrictTable
          districts={filteredDistricts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />
      </div>
    </div>
  );
};
