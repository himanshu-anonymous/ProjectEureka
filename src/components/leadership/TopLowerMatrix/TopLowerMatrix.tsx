'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MatrixRow {
  rank: number;
  name: string;
  event: number;
  category: string;
  extreme: 'Top High' | 'Lower Band';
  metricPercent: number;
}

const EXTENDED_MATRIX_DATA: MatrixRow[] = [
  { rank: 1, name: 'Pune', event: 342, category: 'Agrarian Relief', extreme: 'Top High', metricPercent: 96 },
  { rank: 2, name: 'Nagpur', event: 298, category: 'Metro Phase II', extreme: 'Top High', metricPercent: 88 },
  { rank: 3, name: 'Thane', event: 276, category: 'Coastal Security', extreme: 'Top High', metricPercent: 82 },
  { rank: 4, name: 'Nashik', event: 241, category: 'Kumbh Prep', extreme: 'Top High', metricPercent: 74 },
  { rank: 5, name: 'Chh. Sambhajinagar', event: 218, category: 'Water Grid', extreme: 'Top High', metricPercent: 68 },
  { rank: 32, name: 'Gadchiroli', event: 48, category: 'Tribal Outreach', extreme: 'Lower Band', metricPercent: 22 },
  { rank: 33, name: 'Nandurbar', event: 42, category: 'Health Camp', extreme: 'Lower Band', metricPercent: 19 },
  { rank: 34, name: 'Sindhudurg', event: 38, category: 'Tourism Alert', extreme: 'Lower Band', metricPercent: 16 },
  { rank: 35, name: 'Bhandara', event: 33, category: 'Paddy MSP', extreme: 'Lower Band', metricPercent: 14 },
  { rank: 36, name: 'Washim', event: 28, category: 'Road Works', extreme: 'Lower Band', metricPercent: 12 },
];

export const TopLowerMatrix: React.FC = () => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'lower'>('all');

  const displayedRows = EXTENDED_MATRIX_DATA.filter((r) => {
    if (filterMode === 'top') return r.extreme === 'Top High';
    if (filterMode === 'lower') return r.extreme === 'Lower Band';
    return true;
  });

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col h-full shadow-xs overflow-hidden">
      {/* Header matching Wireframe 2 */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.leadership.matrixTitle}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.leadership.matrixSub}
          </p>
        </div>

        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'all'
                ? 'bg-gov-primary text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixAllBtn}
          </button>
          <button
            onClick={() => setFilterMode('top')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'top'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixTopBtn}
          </button>
          <button
            onClick={() => setFilterMode('lower')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterMode === 'lower'
                ? 'bg-rose-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.leadership.matrixLowerBtn}
          </button>
        </div>
      </div>

      {/* Wireframe Diagram Table Representation */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-gov-primary font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2 px-3">District Name</th>
                <th className="py-2 px-3">Event Volume</th>
                <th className="py-2 px-3">Category Tag</th>
                <th className="py-2 px-3 text-right">Coverage Extreme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
              {displayedRows.map((row) => {
                const isTop = row.extreme === 'Top High';

                return (
                  <tr key={row.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500 w-5">
                          #{row.rank}
                        </span>
                        <span className="font-bold text-slate-900">{row.name}</span>
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isTop ? 'bg-gov-blue' : 'bg-slate-400'}`}
                            style={{ width: `${row.metricPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-semibold text-slate-700 text-[11px]">
                          {row.event}
                        </span>
                      </div>
                    </td>

                    <td className="py-2 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {row.category}
                      </span>
                    </td>

                    <td className="py-2 px-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isTop
                            ? 'bg-blue-50 text-gov-blue border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isTop ? (
                          <TrendingUp className="w-3 h-3 text-gov-blue" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{row.extreme}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2.5 px-2 text-[10px] text-slate-500 flex justify-between items-center">
          <span>३६ जिल्ह्यांचे सांख्यिकी संकलन (Standardized Extreme Variance Matrix)</span>
          <span className="font-mono text-gov-primary font-semibold">Variance Range: 28 - 342 Events</span>
        </div>
      </div>
    </div>
  );
};
