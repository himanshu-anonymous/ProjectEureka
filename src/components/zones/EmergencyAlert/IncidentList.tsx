'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRightIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/20/solid';
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
  onSelectIncident?: (id: string) => void;
  onViewAll?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const pathname = usePathname();
  const isCrisisRoute = pathname === '/crisis';
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="bg-white">
      {/* Active Incidents Queue Sub-Header */}
      <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider select-none">
        <span className="flex items-center gap-1.5">
          <ClipboardDocumentCheckIcon className="w-4 h-4 text-gov-primary shrink-0" />
          <span>{t.zone5.activeQueue}</span>
        </span>
        <span className="text-[11px] text-slate-500 font-mono font-medium">
          {incidents.length} {language === 'mr' ? 'प्रकरणे' : 'queued'}
        </span>
      </div>

      {/* Responsive Queued Incident Items Grid/List (Zero height caps or inner overflow-hidden) */}
      <div
        className={
          isCrisisRoute
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-3 p-4 bg-slate-50/30'
            : 'divide-y divide-slate-100 px-3.5 py-2'
        }
      >
        {incidents.map((incident) => {
          const isHigh = incident.severity === 'High';
          const isMedium = incident.severity === 'Medium';
          const localizedSummary = getLocalizedIncidentSummary(incident, language);
          const localizedDistrict = getDistrictName(incident.district, language);
          const defaultUrl = incident.url || 'https://x.com/MahaDGIPR';

          // Safeguard #1: Left severity border + status dot supporting High, Medium, and Low
          let severityBorder = 'border-l-2 border-slate-400';
          let severityDot = 'bg-slate-400';
          let severityTextColor = 'text-slate-600';

          if (isHigh) {
            severityBorder = 'border-l-2 border-rose-500';
            severityDot = 'bg-rose-500 animate-pulse';
            severityTextColor = 'text-rose-700';
          } else if (isMedium) {
            severityBorder = 'border-l-2 border-amber-500';
            severityDot = 'bg-amber-500';
            severityTextColor = 'text-amber-800';
          }

          return (
            <div
              key={incident.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectIncident?.(incident.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectIncident?.(incident.id);
                }
              }}
              className={`pl-3 py-2.5 rounded-r-lg hover:bg-slate-50 transition-colors cursor-pointer group flex items-start justify-between gap-3 ${severityBorder} ${
                isCrisisRoute ? 'border border-slate-200/80 bg-white p-3 shadow-2xs' : ''
              }`}
              title={
                language === 'mr'
                  ? `${incident.id} मुख्य कार्डवर तपासा`
                  : `Promote ${incident.id} into Primary Triage Card`
              }
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                {/* 1. Top line: Incident ID + severity status dot & label + District */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {incident.id}
                  </span>
                  <span className="text-slate-300 select-none">•</span>
                  <span
                    className={`text-[11px] font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap ${severityTextColor}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDot}`} />
                    <span>{getLocalizedStatus(incident.severity, language)}</span>
                  </span>
                  <span className="text-slate-300 select-none">•</span>
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {localizedDistrict}
                  </span>
                </div>

                {/* 2. Middle line: Full rumor headline with relaxed line-height (no truncate, descenders safe) */}
                <a
                  href={defaultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Stop propagation
                  className="text-slate-900 text-xs font-semibold block hover:text-gov-blue hover:underline leading-relaxed"
                  title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open publisher link'}
                >
                  {localizedSummary}
                </a>

                {/* 3. Bottom line: Full inline coverage source links */}
                {incident.sources && incident.sources.length > 0 && (
                  <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                    <span className="font-medium text-slate-500">
                      {language === 'mr' ? 'स्त्रोत:' : 'Sources:'}
                    </span>
                    {incident.sources.map((src, idx) => (
                      <React.Fragment key={src.name}>
                        {idx > 0 && <span className="text-slate-300 select-none">·</span>}
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Stop propagation
                          className="font-medium text-slate-700 hover:text-rose-600 inline-flex items-center gap-0.5 transition-colors whitespace-nowrap"
                          title={`${src.name} coverage`}
                        >
                          <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
                          <ArrowUpRightIcon className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Clean Triage Action Link */}
              <div className="shrink-0 pt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-rose-600 transition-colors whitespace-nowrap">
                  <span>{language === 'mr' ? 'छाननी' : 'Triage'}</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentList;
