'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { getDistrictName, getDivisionName } from '@/lib/dataLocalization';

export const DistrictSubHeadSelector: React.FC = () => {
  const { districts, selectedDistrictId, setSelectedDistrictId, language } = useDashboardStore();
  const [selectedDivisionTab, setSelectedDivisionTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const divisions = ['All', 'Thane', 'Raigad', 'Palghar', 'Ratnagiri', 'Sindhudurg'];

  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDiv =
        selectedDivisionTab === 'All' ||
        d.name.toLowerCase().includes(selectedDivisionTab.toLowerCase());
      const localizedName = getDistrictName(d.id, language);
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        localizedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiv && matchesSearch;
    });
  }, [districts, selectedDivisionTab, searchQuery, language]);

  return (
    <div className="bg-surface rounded-lg border border-slate-200 p-3 space-y-2.5 shadow-2xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="location_on" size="xs" className="text-gov-primary" />
          <span className="text-xs font-bold text-gov-primary">
            {language === 'mr'
              ? 'जिल्हा उप-मुख्यालये व जिल्हाधिकारी कार्यालये'
              : 'District Sub-Heads & Collectorates'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
            {filteredDistricts.length} {language === 'mr' ? 'जिल्हे' : 'Districts'}
          </span>
        </div>

        {/* Quick District Search Input */}
        <div className="relative w-full sm:w-44">
          <MaterialIcon name="search" size="xs" className="absolute left-2 top-2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'mr' ? 'जिल्हा शोधा...' : 'Search district...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-2 py-1 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-gov-blue text-slate-800"
          />
        </div>
      </div>

      {/* Division Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto text-[10px] no-scrollbar">
        {divisions.map((div) => {
          const tabLabel =
            div === 'All'
              ? language === 'mr'
                ? 'सर्व'
                : 'All'
              : div === 'Aurangabad'
              ? language === 'mr'
                ? 'छ. संभाजीनगर'
                : 'Chh. Sambhajinagar'
              : getDistrictName(div, language);

          return (
            <button
              type="button"
              key={div}
              onClick={() => setSelectedDivisionTab(div)}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap font-medium cursor-pointer ${
                selectedDivisionTab === div
                  ? 'bg-gov-primary text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Compact Grid with max height */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
        {filteredDistricts.map((d) => {
          const isSelected =
            d.id === selectedDistrictId ||
            (selectedDistrictId === 'aurangabad' && d.id === 'chhatrapati-sambhajinagar') ||
            (selectedDistrictId === 'mumbai' && d.id === 'mumbai-city');

          const districtDisplay = getDistrictName(d.id, language);
          const divisionDisplay = getDivisionName(d.division, language);

          return (
            <button
              type="button"
              key={d.id}
              onClick={() => setSelectedDistrictId(d.id)}
              className={`p-2 rounded text-left border transition-colors text-xs flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gov-primary text-white border-gov-primary shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold truncate text-[11px]">{districtDisplay}</span>
                <span
                  className={`text-[9px] font-mono ${
                    isSelected ? 'text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  #{d.rank}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1">
                <span className={`truncate max-w-[65px] ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                  {divisionDisplay}
                </span>
                <span
                  className={`font-mono font-bold text-[10px] ${
                    isSelected ? 'text-white' : d.cpi >= 80 ? 'text-emerald-700' : d.cpi >= 70 ? 'text-amber-700' : 'text-rose-700'
                  }`}
                >
                  {d.cpi} {language === 'mr' ? 'सीपीआय' : 'CPI'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
