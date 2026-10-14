'use client';

import React from 'react';
import { IncidentData } from '@/types/dashboard';
import { SLACountdown } from './SLACountdown';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ShieldAlert, ExternalLink, History, CheckCircle2 } from 'lucide-react';

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
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="border-l-4 border-l-red-600 bg-white p-3 border border-red-200 rounded-r-lg flex flex-col gap-2.5 shadow-xs">
      {/* Top Meta Line: ID, Severity, Location */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
            {incident.id}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            ● {incident.severity} {t.zone5.threatLabel}
          </span>
          <span className="text-[11px] font-semibold text-slate-600">
            {t.zone5.districtPrefix} {incident.district}
          </span>
        </div>
      </div>

      {/* Incident Summary / Rumor Claim */}
      <div>
        <p className="text-xs font-bold text-slate-900 leading-snug">
          {incident.summary}
        </p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
          <span>Source: <strong className="text-slate-700">{incident.source}</strong></span>
          <span>•</span>
          <span>Status: <strong className="text-amber-700">{incident.verificationStatus}</strong></span>
        </p>
      </div>

      {/* Live SLA Countdown Widget per Wireframe */}
      <SLACountdown
        initialMinutes={incident.slaMinutes || 38}
        label={t.zone5.slaRemainingLabel}
      />

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">
            <ExternalLink className="w-3 h-3 text-slate-500" />
            <span>{t.zone5.evidenceBtn}</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">
            <History className="w-3 h-3 text-slate-500" />
            <span>{t.zone5.timelineBtn}</span>
          </button>
        </div>

        {canAuthorize && (
          <button
            onClick={() => onAuthorize(incident.id)}
            disabled={incident.authorized}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors shadow-xs ${
              incident.authorized
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {incident.authorized ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.zone5.authorizedBtn}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t.zone5.authorizeBtn}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
