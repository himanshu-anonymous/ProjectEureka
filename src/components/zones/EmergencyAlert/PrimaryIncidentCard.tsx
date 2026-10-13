'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { IncidentData } from '@/types/dashboard';

interface PrimaryIncidentCardProps {
  incident: IncidentData;
  canAuthorize: boolean;
  onAuthorize: (id: string) => void;
}

export const PrimaryIncidentCard: React.FC<PrimaryIncidentCardProps> = ({
  incident,
  canAuthorize,
  onAuthorize,
}) => {
  return (
    <div className="border-l-4 border-l-content-primary bg-surface p-3 border border-borderLine-subtle rounded-r flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-content-primary">
            {incident.id}
          </span>
          <span className="px-1.5 py-0.5 bg-surface-secondary text-content-primary text-[10px] font-semibold border border-borderLine-standard rounded">
            ● {incident.severity}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-content-primary font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>SLA remaining</span>
          <span className="font-mono font-bold">{incident.slaRemaining}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-content-primary">
          {incident.summary}
        </p>
        <p className="text-[11px] text-content-muted mt-0.5">
          Source: {incident.source} | Verified: {incident.verificationStatus}
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
            onClick={() => onAuthorize(incident.id)}
            disabled={incident.authorized}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              incident.authorized
                ? 'bg-surface-secondary text-content-muted border border-borderLine-subtle cursor-not-allowed'
                : 'bg-action-primary text-content-inverse hover:bg-action-primary-hover'
            }`}
          >
            {incident.authorized ? 'Rebuttal Authorized' : 'Authorize Rebuttal'}
          </button>
        )}
      </div>
    </div>
  );
};
