'use client';

import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { IncidentData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface IncidentListProps {
  incidents: IncidentData[];
  onViewAll?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onViewAll,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
        <span>{t.zone5.activeQueue}</span>
        <span className="text-[10px] text-slate-400 font-normal">Auto-Refetch: 15s</span>
      </div>

      <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
        {incidents.map((incident) => {
          const isHigh = incident.severity === 'High';
          const isMedium = incident.severity === 'Medium';

          return (
            <div
              key={incident.id}
              className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs gap-2"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 text-[11px]">
                    {incident.id}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      isHigh
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : isMedium
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 truncate">
                    {incident.district}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] truncate max-w-[240px] font-medium">
                  {incident.summary}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700">
                  <MaterialIcon name="schedule" size="xs" className="text-amber-600" />
                  <span>{incident.slaRemaining}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">SLA left</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-0.5 text-right">
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-bold text-gov-blue hover:text-gov-blue-hover hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.zone5.viewAllBtn}</span>
            <MaterialIcon name="arrow_forward" size="xs" />
          </button>
        ) : (
          <Link
            href="/crisis"
            className="text-xs font-bold text-gov-blue hover:text-gov-blue-hover hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{t.zone5.viewAllBtn}</span>
            <MaterialIcon name="arrow_forward" size="xs" />
          </Link>
        )}
      </div>
    </div>
  );
};
