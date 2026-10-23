'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldExclamationIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
} from '@heroicons/react/20/solid';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  getDistrictName,
  getLocalizedStatus,
  getLocalizedIncidentSummary,
} from '@/lib/dataLocalization';
import { PrimaryIncidentCard } from './PrimaryIncidentCard';
import { IncidentList } from './IncidentList';
import { EmergencyAlertSkeleton } from '@/components/skeletons/EmergencyAlertSkeleton';

export interface EmergencyAlertProps {
  /** Optional prop to enable cross-panel highlighting when a district is selected */
  highlightDistrict?: (districtId: string) => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = () => {
  const pathname = usePathname();
  const isCrisisRoute = pathname === '/crisis';
  const { incidents, authorizeRebuttalApi, userRole, language, isLoadingData, selectedDistrictId } =
    useDashboardStore();
  const t = useTranslation(language);

  // State to support promoting any queued incident into the Primary Incident Card slot
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Collapse / Uncollapse state for Dashboard vertical real estate
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isDistrictScoped = Boolean(selectedDistrictId && selectedDistrictId !== 'all');
  const districtLabel = isDistrictScoped
    ? getDistrictName(
        selectedDistrictId
          .split(/[-\s]+/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        language
      )
    : '';

  // Cross-panel highlight: the monitor only lists incidents for the selected district.
  const scopeIncidents = useMemo(() => {
    if (!isDistrictScoped) return incidents;
    const wanted = selectedDistrictId.replace(/-/g, ' ').trim().toLowerCase();
    return incidents.filter((i) => i.district.trim().toLowerCase() === wanted);
  }, [incidents, isDistrictScoped, selectedDistrictId]);

  const primaryIncident =
    (selectedIncidentId && scopeIncidents.find((i) => i.id === selectedIncidentId)) ||
    scopeIncidents[0];

  const secondaryIncidents = scopeIncidents.filter(
    (i) => i.id !== primaryIncident?.id
  );

  // Collector & DG Admin can authorize rebuttals
  const canAuthorize = userRole === 'dg_admin' || userRole === 'collector';

  // Safeguards #1 & #3: Return skeleton directly at root level, preserving collapsed state
  if (isLoadingData) {
    return <EmergencyAlertSkeleton isCollapsed={isCollapsed} isCrisisRoute={isCrisisRoute} />;
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm border-t-2 border-t-rose-600 flex flex-col">
      {/* Sleek Dark-Slate Institutional Command Bar (Single Axis) */}
      <div className="bg-slate-900 px-4 py-3 rounded-t-[10px] flex items-center justify-between gap-3 select-none">
        {/* Left Side: Solid ShieldExclamationIcon, Title (no wrap, text-xs on Dashboard), Subtitle on /crisis */}
        <div className="flex items-center gap-2 min-w-0">
          <ShieldExclamationIcon className="w-4 h-4 text-rose-500 shrink-0" />
          <h3
            className={`font-semibold text-white whitespace-nowrap ${
              isCrisisRoute ? 'text-xs sm:text-sm' : 'text-xs'
            }`}
          >
            {t.zone5.title}
          </h3>
          {isCrisisRoute && (
            <span className="hidden 2xl:inline text-xs text-slate-400 whitespace-nowrap">
              {t.zone5.subtitle}
            </span>
          )}
        </div>

        {/* Right Side: Unboxed Pulsing Status Dot + Count + Divider + Tactile Toggle Button */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400 shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0 inline-block" />
            <span>
              {scopeIncidents.length} {t.zone5.pendingCount}
            </span>
          </div>

          {!isCrisisRoute && (
            <>
              <div className="h-4 w-px bg-slate-700/80 mx-1 shrink-0" />
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-expanded={!isCollapsed}
                aria-label={
                  isCollapsed
                    ? (language === 'mr' ? 'संकट संनियंत्रण कक्ष विस्तृत करा' : 'Expand Crisis Monitor')
                    : (language === 'mr' ? 'संकट संनियंत्रण कक्ष संक्षिप्त करा' : 'Collapse Crisis Monitor')
                }
                title={
                  isCollapsed
                    ? (language === 'mr' ? 'विस्तृत करा' : 'Expand Crisis Monitor')
                    : (language === 'mr' ? 'संक्षिप्त करा' : 'Collapse Crisis Monitor')
                }
                className="h-6 px-2 2xl:px-3 flex items-center justify-center gap-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
              >
                <span className="hidden 2xl:inline text-[11px] font-medium">
                  {isCollapsed
                    ? (language === 'mr' ? 'विस्तार' : 'Expand')
                    : (language === 'mr' ? 'संक्षिप्त' : 'Collapse')}
                </span>
                {isCollapsed ? (
                  <ChevronDownIcon className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronUpIcon className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Selected district has no open incident in the queue */}
      {scopeIncidents.length === 0 && (
        <div className="px-4 py-5 flex flex-col items-center justify-center text-center gap-1">
          <p className="text-xs font-semibold text-slate-700">
            {language === 'mr'
              ? `${districtLabel} साठी कोणतीही सक्रिय घटना नाही`
              : `No active incidents for ${districtLabel}`}
          </p>
          <p className="text-[11px] text-slate-500 max-w-sm">
            {language === 'mr'
              ? 'कोकण विभागातील सक्रिय प्रकरणेच येथे दाखवली जातात.'
              : 'Active incidents are reported by the Konkan district desks.'}
          </p>
        </div>
      )}

      {/* Professional Collapsed State (Tactical Live Summary Strip) */}
      {!isCrisisRoute && isCollapsed && primaryIncident && (
        <div
          onClick={() => setIsCollapsed(false)}
          className="px-4 py-3 rounded-b-xl border-b border-rose-100 flex items-center justify-between gap-3 cursor-pointer hover:bg-rose-50/70 transition-colors select-none"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse shrink-0" />
            <span className="font-mono font-bold text-slate-800 text-xs shrink-0">
              {primaryIncident.id}
            </span>
            <span className="text-slate-300 select-none shrink-0">•</span>
            <span className="text-[11px] font-semibold text-rose-700 whitespace-nowrap shrink-0">
              {getLocalizedStatus(primaryIncident.severity, language)} {t.zone5.threatLabel}
            </span>
            <span className="text-slate-300 select-none shrink-0">•</span>
            <span className="text-xs text-slate-700 truncate min-w-0 font-medium">
              {getLocalizedIncidentSummary(primaryIncident, language)}
            </span>
          </div>

          <div className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap shrink-0">
            {language === 'mr'
              ? `विस्तृत करा (+${secondaryIncidents.length} रांग)`
              : `Expand (+${secondaryIncidents.length} Queue)`}
          </div>
        </div>
      )}

      {/* Main Alert Body (Expanded or Crisis Route) */}
      {(isCrisisRoute || !isCollapsed) && scopeIncidents.length > 0 && (
        <div className="flex flex-col divide-y divide-slate-100">
          {/* Primary Monitored Warning Card */}
          {primaryIncident && (
            <PrimaryIncidentCard
              incident={primaryIncident}
              canAuthorize={canAuthorize}
              onAuthorize={(id) => authorizeRebuttalApi(id, 'authorize')}
            />
          )}

          {/* Active Rumors & Incident Feeds Queue */}
          <IncidentList
            incidents={secondaryIncidents}
            onSelectIncident={(id) => setSelectedIncidentId(id)}
          />

          {/* Dashboard Card Footer */}
          {!isCrisisRoute && (
            <div className="px-4 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs rounded-b-xl">
              <span className="text-slate-600 font-medium font-mono text-[11px]">
                {language === 'mr'
                  ? `एकूण सक्रिय प्रकरणे: ${scopeIncidents.length}`
                  : `Total Active Incidents: ${scopeIncidents.length}`}
              </span>
              <Link
                href="/crisis"
                className="text-xs font-bold text-gov-blue hover:text-gov-blue-hover hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t.zone5.viewAllBtn}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;
