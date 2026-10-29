'use client';

import React from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

export type DistrictViewScope = 'topBottom5' | 'top5' | 'low5' | 'all36';

interface DistrictSearchBarProps {
  searchDistrict: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
  viewScope: DistrictViewScope;
  onViewScopeChange: (scope: DistrictViewScope) => void;
}

export const DistrictSearchBar: React.FC<DistrictSearchBarProps> = ({
  searchDistrict,
  onSearchChange,
  filteredCount,
  totalCount,
  viewScope,
  onViewScopeChange,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs flex-wrap bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
      {/* 1. Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <MaterialIcon name="search" size="sm" className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={t.zone2.searchPlaceholder}
          value={searchDistrict}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue shadow-2xs"
        />
      </div>

      {/* 2. User-Requested Dropdown: Top 5 and Low 5 only not all 36 */}
      <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
        <div className="flex items-center gap-1.5">
          <label htmlFor="district-view-scope" className="text-[11px] font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
            <MaterialIcon name="layers" size="xs" className="text-gov-primary" />
            <span>{language === 'mr' ? 'रोस्टर व्याप्ती:' : 'Scope Dropdown:'}</span>
          </label>
          <select
            id="district-view-scope"
            value={viewScope}
            onChange={(e) => onViewScopeChange(e.target.value as DistrictViewScope)}
            className="bg-white border-2 border-amber-400 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 shadow-xs outline-none cursor-pointer"
          >
            <option value="topBottom5">
              {language === 'mr' ? '⭐ शीर्ष ५ व तळ ५ (१० जिल्हे - मुख्य)' : '⭐ Top 5 & Low 5 Only (Priority 10) [Default]'}
            </option>
            <option value="top5">
              {language === 'mr' ? '🏆 शीर्ष ५ जिल्हे (सर्वोत्कृष्ट)' : '🏆 Top 5 Districts Only (Best)'}
            </option>
            <option value="low5">
              {language === 'mr' ? '⚠️ तळ ५ जिल्हे (तात्काळ लक्ष)' : '⚠️ Low 5 Districts Only (Need Help)'}
            </option>
            <option value="all36">
              {language === 'mr' ? '📋 सर्व ३६ जिल्हे (संपूर्ण यादी)' : '📋 All 36 Districts (Full Roster)'}
            </option>
          </select>
        </div>

        <div className="text-slate-500 font-medium text-[11px] shrink-0 font-mono">
          {t.zone2.showingPrefix} <strong className="text-gov-primary font-bold">{filteredCount}</strong> / {totalCount} {t.zone2.districtsSuffix}
        </div>
      </div>
    </div>
  );
};

