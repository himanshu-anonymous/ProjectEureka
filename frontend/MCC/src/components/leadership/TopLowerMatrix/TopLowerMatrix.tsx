'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import {
  getDistrictName,
  getDivisionName,
  getLocalizedCategory,
  getLocalizedStatus,
} from '@/lib/dataLocalization';
import { TopLowerMatrixSkeleton } from '@/components/skeletons/TopLowerMatrixSkeleton';

interface MatrixRow {
  id: string;
  rank: number;
  name: string;
  division: string;
  event: number;
  category: string;
  extreme: 'Top High' | 'Lower Band';
  metricPercent: number;
  cpi: number;
}

const DISTRICT_CATEGORIES: Record<string, string> = {
  pune: 'Agrarian Relief',
  nagpur: 'Metro Phase II',
  thane: 'Coastal Security',
  nashik: 'Kumbh Prep',
  'chhatrapati-sambhajinagar': 'Water Grid',
  mumbai: 'Urban Transit',
  kolhapur: 'Sugar MSP',
  amravati: 'Cotton Textile',
  gadchiroli: 'Tribal Outreach',
  nandurbar: 'Health Camp',
  sindhudurg: 'Tourism Alert',
  bhandara: 'Paddy MSP',
  washim: 'Road Works',
};

export const TopLowerMatrix: React.FC = () => {
  const { districts, selectedDivision, selectedDistrictId, setSelectedDistrictId, language, isLoadingData } =
    useDashboardStore();
  const t = useTranslation(language);
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'lower'>('all');

  // Compute dynamic top 5 and bottom 5 from live store
  const matrixData: MatrixRow[] = useMemo(() => {
    // 1. Filter by selected division if not "All Maharashtra"
    const pool = districts.filter(
      (d) => selectedDivision === 'All Maharashtra' || d.division === selectedDivision
    );

    // Sort pool by CPI descending
    const sorted = [...pool].sort((a, b) => b.cpi - a.cpi);

    if (sorted.length <= 5) {
      return sorted.map((d, index) => ({
        id: d.id,
        rank: d.rank,
        name: d.name,
        division: d.division,
        event: d.releases * 3 + Math.round(d.cpi * 1.5),
        category: DISTRICT_CATEGORIES[d.id] || 'District Dev',
        extreme: (index < Math.ceil(sorted.length / 2) ? 'Top High' : 'Lower Band') as 'Top High' | 'Lower Band',
        metricPercent: Math.round(d.cpi),
        cpi: d.cpi,
      }));
    }

    const top5 = sorted.slice(0, 5).map((d) => ({
      id: d.id,
      rank: d.rank,
      name: d.name,
      division: d.division,
      event: d.releases * 3 + Math.round(d.cpi * 1.5),
      category: DISTRICT_CATEGORIES[d.id] || 'District Dev',
      extreme: 'Top High' as const,
      metricPercent: Math.round(d.cpi),
      cpi: d.cpi,
    }));

    const bottom5 = sorted.slice(-5).reverse().map((d) => ({
      id: d.id,
      rank: d.rank,
      name: d.name,
      division: d.division,
      event: d.releases * 2 + Math.round(d.cpi * 0.8),
      category: DISTRICT_CATEGORIES[d.id] || 'Field Welfare',
      extreme: 'Lower Band' as const,
      metricPercent: Math.round(d.cpi),
      cpi: d.cpi,
    }));

    return [...top5, ...bottom5];
  }, [districts, selectedDivision]);

  const displayedRows = matrixData.filter((r) => {
    if (filterMode === 'top') return r.extreme === 'Top High';
    if (filterMode === 'lower') return r.extreme === 'Lower Band';
    return true;
  });

  const minEvent = Math.min(...matrixData.map((r) => r.event));
  const maxEvent = Math.max(...matrixData.map((r) => r.event));

  if (isLoadingData) {
    return <TopLowerMatrixSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden h-full min-h-0">
      {/* Header matching Wireframe 2 */}
      <div className="px-2 py-1 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-1 shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-gov-primary tracking-tight">
              {t.leadership.matrixTitle}
            </h3>
            {selectedDivision !== 'All Maharashtra' && (
              <span className="text-[10px] font-mono border-l-2 border-gov-blue pl-1.5 text-gov-blue font-semibold whitespace-nowrap">
                {language === 'mr' ? getDivisionName(selectedDivision, 'mr') : selectedDivision}
              </span>
            )}
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium leading-none mt-0.5">
            {t.leadership.matrixSub}
          </p>
        </div>

        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-gov-primary text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixAllBtn}
          </button>
          <button
            onClick={() => setFilterMode('top')}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'top'
                ? 'bg-[#20A765] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixTopBtn}
          </button>
          <button
            onClick={() => setFilterMode('lower')}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'lower'
                ? 'bg-[#E94B4B] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixLowerBtn}
          </button>
        </div>
      </div>

      {/* Wireframe Diagram Table Representation */}
      <div className="p-1 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="overflow-x-auto -mx-1 px-1 border border-slate-200/90 rounded-lg shadow-2xs flex-1 min-h-0 overflow-y-auto scrollbar-thin">
          <table className="w-full text-left text-xs table-fixed">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[22%]" />
              <col className="w-[26%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-slate-50 text-gov-primary font-bold border-b border-slate-200 text-xs sticky top-0 z-10">
              <tr>
                <th
                  style={{ padding: '6px 4px' }}
                  className="py-3 px-3 text-[11px] sm:text-xs font-bold text-slate-800 truncate"
                  title={language === 'mr' ? 'जिल्ह्याचे नाव' : 'District Name'}
                >
                  {language === 'mr' ? 'जिल्हा' : 'District'}
                </th>
                <th
                  style={{ padding: '6px 4px' }}
                  className="py-3 px-3 text-[11px] sm:text-xs font-bold text-slate-800 truncate"
                  title={language === 'mr' ? 'सक्रियता व सीपीआय' : 'Activity & CPI'}
                >
                  {language === 'mr' ? 'सीपीआय' : 'CPI'}
                </th>
                <th
                  style={{ padding: '6px 4px' }}
                  className="py-3 px-3 text-[11px] sm:text-xs font-bold text-slate-800 truncate"
                  title={language === 'mr' ? 'प्रमुख क्षेत्र' : 'Focus Category'}
                >
                  {language === 'mr' ? 'क्षेत्र' : 'Focus'}
                </th>
                <th
                  style={{ padding: '6px 4px' }}
                  className="py-3 px-3 text-right text-[11px] sm:text-xs font-bold text-slate-800 truncate"
                  title={language === 'mr' ? 'कामगिरी गट' : 'Coverage Extreme'}
                >
                  {language === 'mr' ? 'गट' : 'Extreme'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-800 text-xs">
              {displayedRows.map((row) => {
                const isTop = row.extreme === 'Top High';
                const isSelected = row.id === selectedDistrictId;

                return (
                  <tr
                    key={row.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedDistrictId(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedDistrictId(row.id);
                      }
                    }}
                    className={`cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-2 border-l-gov-blue font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td style={{ padding: '4px 4px' }} className="truncate">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-mono text-[10px] text-slate-400 font-bold shrink-0">
                          #{row.rank}
                        </span>
                        <div className="min-w-0 truncate">
                          <span className="font-bold text-slate-900 text-xs block leading-tight truncate">
                            {language === 'mr' ? getDistrictName(row.name, 'mr') : row.name}
                          </span>
                          <span className="text-[9.5px] text-slate-500 font-medium leading-none block truncate">
                            {language === 'mr' ? getDivisionName(row.division, 'mr') : row.division}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '4px 4px' }} className="truncate">
                      <div className="flex items-center gap-1">
                        <div className="hidden 2xl:inline-block w-8 bg-slate-200 h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? 'bg-[#20A765]' : 'bg-[#F2994A]'
                            }`}
                            style={{ width: `${row.metricPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {row.cpi}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: '4px 4px' }} className="truncate" title={getLocalizedCategory(row.category, language)}>
                      <span className="text-[11px] font-medium text-slate-700 truncate block">
                        {getLocalizedCategory(row.category, language)}
                      </span>
                    </td>

                    <td style={{ padding: '4px 4px' }} className="text-right truncate">
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[10.5px] font-bold px-1 py-0.5 rounded ${
                          isTop
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isTop ? (
                          <ArrowTrendingUpIcon className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-2.5 h-2.5 shrink-0 text-amber-600" />
                        )}
                        <span>{isTop ? 'Top' : 'Low'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-1 px-1 text-[9px] text-slate-500 flex justify-between items-center shrink-0">
          <span>
            {language === 'mr'
              ? '३६ जिल्हे संमिश्र तफावत'
              : 'Extreme Variance Across 36 Districts'}
          </span>
          <span className="font-mono text-gov-primary font-semibold">
            {language === 'mr'
              ? `कक्षा: ${minEvent} - ${maxEvent}`
              : `Range: ${minEvent} - ${maxEvent}`}
          </span>
        </div>
      </div>
    </div>
  );
};
