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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
      {/* Header matching Wireframe 2 */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {t.leadership.matrixTitle}
            </h3>
            {selectedDivision !== 'All Maharashtra' && (
              <span className="text-xs font-mono border-l-2 border-gov-blue pl-2 text-gov-blue font-semibold whitespace-nowrap">
                {language === 'mr' ? getDivisionName(selectedDivision, 'mr') : selectedDivision}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.leadership.matrixSub}
          </p>
        </div>

        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-gov-primary text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixAllBtn}
          </button>
          <button
            onClick={() => setFilterMode('top')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'top'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixTopBtn}
          </button>
          <button
            onClick={() => setFilterMode('lower')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'lower'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixLowerBtn}
          </button>
        </div>
      </div>

      {/* Wireframe Diagram Table Representation */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="overflow-x-auto -mx-1 px-1 border border-slate-200/90 rounded-lg shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-gov-primary font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-3">{language === 'mr' ? 'जिल्ह्याचे नाव' : 'District Name'}</th>
                <th className="py-3 px-3">{language === 'mr' ? 'सक्रियता व सीपीआय' : 'Activity & CPI'}</th>
                <th className="py-3 px-3">{language === 'mr' ? 'प्रमुख क्षेत्र' : 'Focus Category'}</th>
                <th className="py-3 px-3 text-right">{language === 'mr' ? 'कामगिरी गट' : 'Coverage Extreme'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
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
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-slate-400 w-5">
                          #{row.rank}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {language === 'mr' ? getDistrictName(row.name, 'mr') : row.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {language === 'mr' ? getDivisionName(row.division, 'mr') : row.division}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="hidden 2xl:inline-block w-14 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? 'bg-gov-blue' : 'bg-slate-400'
                            }`}
                            style={{ width: `${row.metricPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {row.cpi}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
                        {getLocalizedCategory(row.category, language)}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center justify-end gap-1.5 text-xs font-semibold whitespace-nowrap ${
                          isTop ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isTop ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{getLocalizedStatus(row.extreme, language)}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2.5 px-2 text-[10px] text-slate-500 flex justify-between items-center">
          <span>
            {language === 'mr'
              ? '३६ जिल्ह्यांचे सांख्यिकी संकलन — संमिश्र तफावत विश्लेषण'
              : 'Real-Time Extreme Variance Analysis Across 36 Districts'}
          </span>
          <span className="font-mono text-gov-primary font-semibold">
            {language === 'mr'
              ? `कक्षा: ${minEvent} - ${maxEvent} सक्रियता गुण`
              : `Range: ${minEvent} - ${maxEvent} Activity Score`}
          </span>
        </div>
      </div>
    </div>
  );
};
