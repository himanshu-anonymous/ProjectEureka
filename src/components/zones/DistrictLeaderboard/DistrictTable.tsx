'use client';

import React from 'react';
import { DistrictData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ArrowUpRight } from 'lucide-react';

interface DistrictTableProps {
  districts: DistrictData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const DistrictTable: React.FC<DistrictTableProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-2xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-gov-primary text-white font-semibold border-b border-gov-primary-dark">
          <tr>
            <th className="py-2.5 px-3 w-10 text-center">{t.zone2.rankCol}</th>
            <th className="py-2.5 px-3">{t.zone2.districtCol}</th>
            <th className="py-2.5 px-3">{t.zone2.divisionCol}</th>
            <th className="py-2.5 px-3 text-right">{t.zone2.releasesCol}</th>
            <th className="py-2.5 px-3 text-right">{t.zone2.tatCol}</th>
            <th className="py-2.5 px-3 text-right">{t.zone2.sentimentCol}</th>
            <th className="py-2.5 px-3 text-right">{t.zone2.crisisCol}</th>
            <th className="py-2.5 px-3 text-right font-bold">{t.zone2.cpiCol}</th>
            <th className="py-2.5 px-3 text-center">{t.zone2.actionCol}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
          {districts.map((d) => {
            const isSelected = d.id === selectedDistrictId;

            // Semantic color scoring for CPI
            let cpiColorClass = 'text-slate-900';
            if (d.cpi >= 80) cpiColorClass = 'text-emerald-700 font-bold';
            else if (d.cpi >= 70) cpiColorClass = 'text-amber-800 font-bold';
            else cpiColorClass = 'text-rose-700 font-bold';

            return (
              <tr
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-500/10 border-l-4 border-l-gov-accent font-medium'
                    : 'hover:bg-slate-50'
                }`}
              >
                <td className="py-2.5 px-3 font-mono text-center text-slate-500 font-semibold">
                  {d.rank}
                </td>
                <td className="py-2.5 px-3 font-bold text-gov-primary">
                  {d.name}
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">{d.division}</td>
                <td className="py-2.5 px-3 text-right font-mono font-medium">{d.releases}</td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className={d.avgTAT <= 45 ? 'text-emerald-700 font-semibold' : 'text-slate-700'}>
                    {d.avgTAT}m
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className={d.sentiment >= 70 ? 'text-emerald-700 font-semibold' : 'text-slate-700'}>
                    {d.sentiment}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className={d.crisisSLA >= 85 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                    {d.crisisSLA}%
                  </span>
                </td>
                <td className={`py-2.5 px-3 text-right font-mono text-sm ${cpiColorClass}`}>
                  {d.cpi}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDistrict(d.id);
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded transition-colors shadow-2xs ${
                      isSelected
                        ? 'bg-gov-accent text-white font-bold'
                        : 'bg-gov-blue hover:bg-gov-blue-hover text-white font-medium'
                    }`}
                  >
                    <span>{isSelected ? t.zone2.selectedBtn : t.zone2.viewBtn}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
