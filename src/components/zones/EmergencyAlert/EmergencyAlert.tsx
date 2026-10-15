'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { PrimaryIncidentCard } from './PrimaryIncidentCard';
import { IncidentList } from './IncidentList';

export const EmergencyAlert: React.FC = () => {
  const { incidents, authorizeRebuttalApi, userRole, language } = useDashboardStore();
  const t = useTranslation(language);

  const primaryIncident = incidents[0];
  const secondaryIncidents = incidents.slice(1);

  // Collector & DG Admin can authorize rebuttals
  const canAuthorize = userRole === 'dg_admin' || userRole === 'collector';

  return (
    <div className="bg-surface border border-red-300 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Institutional Red Alert Header */}
      <div className="px-3.5 py-2.5 bg-red-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-white/15 text-white">
            <MaterialIcon name="gpp_bad" size="sm" className="text-amber-300" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white">
              {t.zone5.title}
            </h3>
            <p className="text-[10px] text-red-100/90 font-medium hidden sm:block">
              {t.zone5.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-white text-red-800 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>
              {incidents.length} {t.zone5.pendingCount}
            </span>
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3 bg-red-50/20">
        {/* Primary Monitored Warning Card with Live Countdown */}
        {primaryIncident && (
          <PrimaryIncidentCard
            incident={primaryIncident}
            canAuthorize={canAuthorize}
            onAuthorize={(id) => authorizeRebuttalApi(id, 'authorize')}
          />
        )}

        {/* Secondary Rumor & Incident Feeds */}
        <IncidentList incidents={secondaryIncidents} />
      </div>
    </div>
  );
};
