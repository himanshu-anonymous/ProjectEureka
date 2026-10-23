'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  XMarkIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  MapPinIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { getDistrictName } from '@/lib/dataLocalization';

export interface DrawerPayload {
  type: 'district' | 'news' | 'crisis' | 'pipeline' | 'source';
  title: string;
  subtitle?: string;
  district?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Critical';
  status?: string;
  timestamp?: string;
  metrics?: Record<string, string | number>;
  evidence?: {
    claim?: string;
    groundFact?: string;
    dioVerification?: string;
    collectorSignOff?: boolean;
  };
  details?: string;
  pipelineStage?: {
    name: string;
    latency: string;
    throughput: string;
    errorRate: string;
    model: string;
    status: 'Operational' | 'Degraded' | 'Healthy';
  };
}

interface ContextualIntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrawerPayload | null;
}

export const ContextualIntelligenceDrawer: React.FC<ContextualIntelligenceDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { language, authorizeRebuttalApi, setToast, userRole } = useDashboardStore();
  const t = useTranslation(language);

  if (!isOpen || !data) return null;

  const handleAuthorize = async () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'अधिकृत खंडन राज्यव्यापी प्रसिद्धीसाठी जारी केले.'
        : 'Official rebuttal successfully authorized and broadcast to state media channels.',
    });
    onClose();
  };

  const handleAssign = () => {
    setToast({
      type: 'info',
      message: language === 'mr'
        ? 'संबंधित जिल्हा माहिती अधिकाऱ्यास (DIO) तात्काळ चौकशीचे आदेश पाठवले.'
        : 'Dispatched priority ground-verification directive to Field DIO desk.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0B111D] border-l border-white/10 shadow-2xl flex flex-col text-slate-100">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 bg-[#070B14]/90 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {data.type.toUpperCase()} INTELLIGENCE
                </span>
                {data.status && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {data.status}
                  </span>
                )}
                {data.sentiment && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      data.sentiment === 'Positive'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : data.sentiment === 'Critical' || data.sentiment === 'Negative'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                    }`}
                  >
                    {data.sentiment} Sentiment
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
                {data.title}
              </h2>
              {data.subtitle && (
                <p className="text-xs text-slate-400 mt-1">{data.subtitle}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close Drawer (Esc)"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
            {/* Timestamp & Location Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{data.timestamp || 'Real-time Telemetry Stream'}</span>
              </div>
              {data.district && (
                <div className="flex items-center gap-1.5 font-medium text-slate-300">
                  <MapPinIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{getDistrictName(data.district, language)}</span>
                </div>
              )}
            </div>

            {/* Metrics Grid */}
            {data.metrics && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Operational Metrics & Indicators
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(data.metrics).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-lg bg-white/[0.03] border border-white/5 flex flex-col"
                    >
                      <span className="text-[11px] text-slate-400 truncate font-medium">
                        {key}
                      </span>
                      <span className="text-lg font-bold font-mono text-white mt-1">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crisis / Evidence Ledger */}
            {data.evidence && (
              <div className="space-y-3 p-4 rounded-xl bg-rose-500/[0.06] border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldExclamationIcon className="w-4 h-4" />
                  <span>90-Minute SLA Verification Ledger</span>
                </div>

                {data.evidence.claim && (
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">
                      Viral Claim / Allegation:
                    </span>
                    <p className="text-xs text-rose-200 bg-rose-950/40 p-2.5 rounded border border-rose-500/20 leading-relaxed font-serif">
                      "{data.evidence.claim}"
                    </p>
                  </div>
                )}

                {data.evidence.groundFact && (
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">
                      Field DIO Verified Facts:
                    </span>
                    <p className="text-xs text-emerald-200 bg-emerald-950/40 p-2.5 rounded border border-emerald-500/20 leading-relaxed">
                      {data.evidence.groundFact}
                    </p>
                  </div>
                )}

                {data.evidence.dioVerification && (
                  <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified by: {data.evidence.dioVerification}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pipeline Stage Details */}
            {data.pipelineStage && (
              <div className="space-y-3 p-4 rounded-xl bg-sky-500/[0.06] border border-sky-500/20">
                <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <SparklesIcon className="w-4 h-4" />
                  <span>EUREKA Architecture Telemetry</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-slate-400 block text-[10px]">Processing Model</span>
                    <span className="font-mono text-white font-semibold">
                      {data.pipelineStage.model}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-slate-400 block text-[10px]">Throughput</span>
                    <span className="font-mono text-white font-semibold">
                      {data.pipelineStage.throughput}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-slate-400 block text-[10px]">Latency (p95)</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {data.pipelineStage.latency}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-white/[0.03]">
                    <span className="text-slate-400 block text-[10px]">Error Rate</span>
                    <span className="font-mono text-white font-semibold">
                      {data.pipelineStage.errorRate}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* General Description / Summary */}
            {data.details && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Detailed Operational Dossier
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  {data.details}
                </p>
              </div>
            )}

            {/* Authority Chain */}
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <UserCircleIcon className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Dr. Arvind M. Gokhale
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Director General, DGIPR Maharashtra • Clearance Tier 1
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-white/10 bg-[#070B14] flex items-center justify-between gap-3">
            {data.type === 'crisis' ? (
              <>
                <button
                  onClick={handleAssign}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Direct Field DIO
                </button>
                <button
                  onClick={handleAuthorize}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer text-center"
                >
                  Sign Off Rebuttal
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setToast({
                      type: 'success',
                      message: 'Telemetry dossier exported as signed PDF.',
                    });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Export Dossier
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
