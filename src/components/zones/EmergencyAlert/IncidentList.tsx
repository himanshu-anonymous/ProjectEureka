'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IncidentData } from '@/types/dashboard';

interface IncidentListProps {
  incidents: IncidentData[];
  onViewAll?: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onViewAll,
}) => {
  return (
    <>
      <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded">
        {incidents.map((incident) => (
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

      <div className="pt-1">
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-content-primary hover:underline flex items-center gap-1"
        >
          <span>View all incidents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </>
  );
};
