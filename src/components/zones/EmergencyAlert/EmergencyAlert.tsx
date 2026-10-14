'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ShieldAlert } from 'lucide-react';
import { PrimaryIncidentCard } from './PrimaryIncidentCard';
import { IncidentList } from './IncidentList';

export const EmergencyAlert: React.FC = () => {
  const { incidents, authorizeRebuttal, userRole, language } = useDashboardStore();
  const t = useTranslation(language);

  const primaryIncident = incidents[0];
  const secondaryIncidents = incidents.slice(1);

  // Collector & DG Admin can authorize rebuttals
  const canAuthorize = userRole === 'dg_admin' || userRole === 'collector';

  return (
    <div className="bg-red-50/70 border-2 border-red-300 rounded-lg flex flex-col shadow-sm overflow-hidden animate-alert-pulse">
      {/* Red Alert Header per Wireframe Zone 5 */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-white/20 text-white">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/20 text-white">
                {t.zone5.zoneLabel}
              </span>
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                {t.zone5.title}
              </h3>
            </div>
            <p className="text-[10px] text-red-100 font-medium hidden sm:block">
              {t.zone5.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 bg-white text-red-700 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{incidents.length} {t.zone5.pendingCount}</span>
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        {/* Primary Monitored Warning Card with Live Countdown */}
        {primaryIncident && (
          <PrimaryIncidentCard
            incident={primaryIncident}
            canAuthorize={canAuthorize}
            onAuthorize={authorizeRebuttal}
          />
        )}

        {/* Secondary Rumor & Incident Feeds */}
        <IncidentList incidents={secondaryIncidents} />
      </div>
    </div>
  );
};
