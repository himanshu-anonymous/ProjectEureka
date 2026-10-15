'use client';

import React, { useState } from 'react';
import { IncidentData } from '@/types/dashboard';
import { SLACountdown } from './SLACountdown';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

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
  const [showEvidence, setShowEvidence] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthorizeClick = async () => {
    setIsSubmitting(true);
    await onAuthorize(incident.id);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-3.5 border border-red-200 rounded-lg flex flex-col gap-2.5 shadow-2xs">
      {/* 1. Header: Condensed ID, Severity, Location */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            {incident.id}
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold border border-red-200 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
            <span>
              {incident.severity} {t.zone5.threatLabel}
            </span>
          </span>
          <span className="text-[11px] font-semibold text-slate-700">
            {t.zone5.districtPrefix} {incident.district}
          </span>
        </div>
      </div>

      {/* 2. Primary Claim / Incident Summary */}
      <div>
        <p className="text-xs font-bold text-slate-900 leading-snug">{incident.summary}</p>
        <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
          <span>
            Source: <strong className="text-slate-800">{incident.source}</strong>
          </span>
          <span>•</span>
          <span>
            Status:{' '}
            <strong
              className={`font-semibold ${
                incident.authorized ? 'text-emerald-700 font-bold' : 'text-amber-800'
              }`}
            >
              {incident.verificationStatus}
            </strong>
          </span>
        </p>
      </div>

      {/* 3. Live SLA Countdown Widget */}
      <SLACountdown
        initialMinutes={incident.slaMinutes || 38}
        label={t.zone5.slaRemainingLabel}
      />

      {/* Evidence Drawer */}
      {showEvidence && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span className="flex items-center gap-1">
              <MaterialIcon name="description" size="xs" />
              <span>Media Monitoring Ingestion Evidence</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">OCR Hash: #78a9c2</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            WhatsApp viral forward claiming water supply contamination in Palghar tribal school.
            Identified by OCR surveillance from regional press clipping and verified as unfounded by
            District Public Health Laboratory report #PH-2026-904.
          </p>
          <div className="text-[10px] font-semibold text-gov-blue">
            Verified by: DIO Palghar Field Office • Lab Certificate Attached
          </div>
        </div>
      )}

      {/* Timeline Drawer */}
      {showTimeline && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
          <div className="text-slate-700 font-bold flex items-center gap-1">
            <MaterialIcon name="history" size="xs" />
            <span>Escalation Timeline & 90-min SLA Milestones</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">10:14 IST</span>
              <span className="text-slate-700">Rumor scraped & flagged by Media Ingestion Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">10:45 IST</span>
              <span className="text-slate-700">DIO ground verification complete (Lab negative)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">11:05 IST</span>
              <span className="font-semibold text-red-700">
                {incident.authorized
                  ? 'Rebuttal Authorized & Published by District Magistrate'
                  : 'Awaiting Tier-2 Collector / DG Admin authorization signature'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setShowEvidence(!showEvidence);
              setShowTimeline(false);
            }}
            aria-expanded={showEvidence}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border rounded transition-colors cursor-pointer ${
              showEvidence
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MaterialIcon name="open_in_new" size="xs" />
            <span>{t.zone5.evidenceBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTimeline(!showTimeline);
              setShowEvidence(false);
            }}
            aria-expanded={showTimeline}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border rounded transition-colors cursor-pointer ${
              showTimeline
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MaterialIcon name="history" size="xs" />
            <span>{t.zone5.timelineBtn}</span>
          </button>
        </div>

        {canAuthorize ? (
          <button
            type="button"
            onClick={handleAuthorizeClick}
            disabled={incident.authorized || isSubmitting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded transition-colors shadow-2xs cursor-pointer ${
              incident.authorized
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                : 'bg-red-700 hover:bg-red-800 text-white'
            }`}
          >
            {incident.authorized ? (
              <>
                <MaterialIcon name="check_circle" size="xs" className="text-emerald-700" />
                <span>Rebuttal Dispatched</span>
              </>
            ) : isSubmitting ? (
              <span>Authorizing...</span>
            ) : (
              <>
                <MaterialIcon name="gpp_bad" size="xs" />
                <span>Authorize Official Rebuttal</span>
              </>
            )}
          </button>
        ) : (
          <div
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-300 rounded cursor-not-allowed"
            title="Only District Collector or DG State Admin has signing clearance"
          >
            <MaterialIcon name="lock" size="xs" className="text-slate-400" />
            <span>Collector Approval Required</span>
          </div>
        )}
      </div>
    </div>
  );
};
