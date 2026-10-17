'use client';

import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { IncidentData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  getDistrictName,
  getLocalizedIncidentSummary,
  getLocalizedStatus,
} from '@/lib/dataLocalization';

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
        <span className="flex items-center gap-1.5">
          <MaterialIcon name="checklist" size="xs" className="text-gov-primary" />
          <span>{t.zone5.activeQueue}</span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          {incidents.length} {language === 'mr' ? 'प्रकरणे' : 'records'}
        </span>
      </div>

      <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
        {incidents.map((incident) => {
          const isHigh = incident.severity === 'High';
          const isMedium = incident.severity === 'Medium';
          const localizedSummary = getLocalizedIncidentSummary(incident, language);
          const localizedDistrict = getDistrictName(incident.district, language);
          const defaultUrl = incident.url || 'https://x.com/MahaDGIPR';

          return (
            <div
              key={incident.id}
              className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs gap-2"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
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
                    {getLocalizedStatus(incident.severity, language)}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 truncate">
                    {localizedDistrict}
                  </span>
                </div>

                {/* Clickable Headline */}
                <a
                  href={defaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 text-[11px] font-medium truncate block hover:text-gov-blue hover:underline max-w-[280px]"
                  title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open publisher link'}
                >
                  {localizedSummary}
                </a>

                {/* Multi-Source Badges */}
                {incident.sources && incident.sources.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    {incident.sources.map((src) => (
                      <a
                        key={src.name}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                      >
                        <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
                        <MaterialIcon name="north_east" size="xs" className="w-2 h-2 text-slate-400" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 justify-end">
                  <MaterialIcon name="schedule" size="xs" className="text-amber-600" />
                  <span>{incident.slaRemaining}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {language === 'mr' ? 'शिल्लक एसएलए' : 'SLA left'}
                </span>
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
