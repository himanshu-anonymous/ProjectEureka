'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  ShieldExclamationIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { DrawerPayload } from '@/components/shared/ContextualIntelligenceDrawer';

interface CrisisWarRoomBannerProps {
  onInspectCrisis?: (payload: DrawerPayload) => void;
}

export const CrisisWarRoomBanner: React.FC<CrisisWarRoomBannerProps> = ({ onInspectCrisis }) => {
  const { language, incidents, userRole, setToast } = useDashboardStore();
  const t = useTranslation(language);

  // Active 90-minute SLA countdown timer (simulating remaining seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(1460); // ~24 min remaining

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const rawIncident = incidents[0];
  const activeCrisis = rawIncident ? {
    id: rawIncident.id,
    title: rawIncident.summary,
    district: rawIncident.district,
    severity: rawIncident.severity,
    source: rawIncident.source,
    claim: rawIncident.summary,
    evidence: rawIncident.verificationStatus,
    timeRemaining: rawIncident.slaRemaining,
    authorized: rawIncident.authorized,
  } : {
    id: 'INC-2026-804',
    title: 'Viral misinformation claiming 5-day total shutdown of Ulhas River drinking water supply in Thane & Dombivli',
    district: 'Thane',
    severity: 'High',
    source: 'Viral WhatsApp Audio • Regional Facebook Group',
    claim: 'Viral audio alleging water pumps failed and total water cutoff across Thane metropolitan region for 5 days.',
    evidence: 'Field inspection by Executive Engineer & DIO Thane verified all 4 treatment plants functioning at normal pressure; FIR lodged against rumor mongers.',
    timeRemaining: '24m 20s',
    authorized: false,
  };

  const handleAuthorize = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'ठाणे जिल्हाधिकारी अधिकृत खंडन यशस्वीरित्या जारी करण्यात आले.'
        : 'Official Rebuttal signed off by District Magistrate and dispatched to all 42 media desks.',
    });
  };

  const handleInspect = () => {
    if (onInspectCrisis) {
      onInspectCrisis({
        type: 'crisis',
        title: activeCrisis.title,
        subtitle: `Incident ID: ${activeCrisis.id} • ${activeCrisis.district} District`,
        district: activeCrisis.district,
        sentiment: 'Critical',
        status: 'Active 90-Min SLA Countdown',
        timestamp: `${timeFormatted} remaining before SLA breach`,
        metrics: {
          'SLA Window': '90 Minutes Mandatory',
          'Time Remaining': timeFormatted,
          'Responsible Authority': 'Collector Nilesh R. Kelkar, IAS',
          'Severity Tier': activeCrisis.severity || 'High',
        },
        evidence: {
          claim: activeCrisis.claim,
          groundFact: activeCrisis.evidence,
          dioVerification: `DIO Desk ${activeCrisis.district} (Verified)`,
          collectorSignOff: false,
        },
        details: `Under Government of Maharashtra circular DGIPR/2026/SLA-90, District Collectors have sole statutory authority to review ground evidence and approve public rebuttals.`,
      });
    }
  };

  return (
    <div className="w-full rounded-xl bg-gradient-to-r from-[#170B11] via-[#1A0E18] to-[#120B16] border border-rose-500/30 shadow-2xl p-4 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Ambient Pulsing Glow Background */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left: SLA Urgency Badge + Incident Info */}
      <div className="flex items-start gap-3.5 min-w-0 z-10">
        <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 shadow-lg">
          <ShieldExclamationIcon className="w-6 h-6 animate-pulse" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-500/25 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              CRISIS WAR ROOM • 90-MIN SLA
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
              {activeCrisis.district} DISTRICT
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Incident {activeCrisis.id}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
            {activeCrisis.title}
          </h3>

          <p className="text-xs text-rose-200/80 mt-1 line-clamp-1">
            <span className="font-semibold text-rose-300">Ground Reality: </span>
            {activeCrisis.evidence}
          </p>
        </div>
      </div>

      {/* Right: Real-time Countdown Timer + Action Controls */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center z-10 w-full sm:w-auto justify-between sm:justify-end">
        {/* Live Countdown Box */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-rose-500/30 text-rose-400">
          <ClockIcon className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="text-left font-mono">
            <div className="text-[9px] uppercase tracking-wider text-rose-300/80 font-bold">
              SLA TIME REMAINING
            </div>
            <div className="text-sm font-black text-white tracking-widest">
              {timeFormatted}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleInspect}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Evidence Ledger
          </button>

          <button
            type="button"
            onClick={handleAuthorize}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-lg shadow-rose-900/30 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <CheckBadgeIcon className="w-4 h-4" />
            <span>Authorise Rebuttal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
