'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface DistrictSearchBarProps {
  searchDistrict: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const DistrictSearchBar: React.FC<DistrictSearchBarProps> = ({
  searchDistrict,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder={t.zone2.searchPlaceholder}
          value={searchDistrict}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue shadow-2xs"
        />
      </div>
      <div className="text-slate-500 font-medium text-[11px]">
        {t.zone2.showingPrefix} <strong className="text-gov-primary">{filteredCount}</strong> / {totalCount} {t.zone2.districtsSuffix}
      </div>
    </div>
  );
};
