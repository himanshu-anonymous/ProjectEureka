'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';

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
        {/* Primary Monitored Incident (Highlighted) */}
        {primaryIncident && (
          <div className="border-l-4 border-l-content-primary bg-surface p-3 border border-borderLine-subtle rounded-r flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-content-primary">
                  {primaryIncident.id}
                </span>
                <span className="px-1.5 py-0.5 bg-surface-secondary text-content-primary text-[10px] font-semibold border border-borderLine-standard rounded">
                  ● {primaryIncident.severity}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-content-primary font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>SLA remaining</span>
                <span className="font-mono font-bold">{primaryIncident.slaRemaining}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-content-primary">
                {primaryIncident.summary}
              </p>
              <p className="text-[11px] text-content-muted mt-0.5">
                Source: {primaryIncident.source} | Verified: {primaryIncident.verificationStatus}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 text-xs border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary transition-colors">
                  View Evidence
                </button>
                <button className="px-2.5 py-1 text-xs border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary transition-colors">
                  View Timeline
                </button>
              </div>

              {canAuthorize && (
                <button
                  onClick={() => authorizeRebuttal(primaryIncident.id)}
                  disabled={primaryIncident.authorized}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    primaryIncident.authorized
                      ? 'bg-surface-secondary text-content-muted border border-borderLine-subtle cursor-not-allowed'
                      : 'bg-action-primary text-content-inverse hover:bg-action-primary-hover'
                  }`}
                >
                  {primaryIncident.authorized ? 'Rebuttal Authorized' : 'Authorize Rebuttal'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Secondary Incidents List */}
        <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded">
          {secondaryIncidents.map((incident) => (
            <div
              key={incident.id}
              className="p-2.5 flex items-center justify-between hover:bg-surface-secondary transition-colors text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-content-primary">
                    {incident.id}
                  </span>
                  <span className="text-[10px] text-content-secondary border border-borderLine-standard px-1.5 rounded">
                    {incident.severity}
                  </span>
                </div>
                <p className="text-content-secondary truncate max-w-[200px]">
                  {incident.summary}
                </p>
              </div>
              <div className="text-right font-mono text-content-muted text-[11px]">
                {incident.slaRemaining}
              </div>
            </div>
          ))}
        </div>

        {/* View All Action */}
        <div className="pt-1">
          <button className="text-xs font-semibold text-content-primary hover:underline flex items-center gap-1">
            <span>View all incidents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
