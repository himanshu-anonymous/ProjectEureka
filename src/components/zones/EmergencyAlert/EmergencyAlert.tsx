'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ShieldAlert } from 'lucide-react';
import { PrimaryIncidentCard } from './PrimaryIncidentCard';
import { IncidentList } from './IncidentList';

export const EmergencyAlert: React.FC = () => {
  const { incidents, authorizeRebuttal, userRole } = useDashboardStore();

  const primaryIncident = incidents[0];
  const secondaryIncidents = incidents.slice(1);

  // Collector & DG Admin can authorize
  const canAuthorize = userRole === 'dg_admin' || userRole === 'collector';

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-content-primary" />
          <h3 className="text-sm font-semibold text-content-primary">
            Emergency Alert & Crisis Monitor
          </h3>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 bg-surface-secondary text-content-primary rounded border border-borderLine-standard">
          {incidents.length} Active
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Primary Monitored Incident */}
        {primaryIncident && (
          <PrimaryIncidentCard
            incident={primaryIncident}
            canAuthorize={canAuthorize}
            onAuthorize={authorizeRebuttal}
          />
        )}

        {/* Secondary Incidents List */}
        <IncidentList incidents={secondaryIncidents} />
      </div>
    </div>
  );
};
