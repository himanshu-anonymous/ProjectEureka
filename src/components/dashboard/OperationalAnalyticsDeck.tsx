'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

export const OperationalAnalyticsDeck: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [activeWindow, setActiveWindow] = useState<'7D' | '30D' | '90D'>('30D');

  const days = ['Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18'];

  return (
    <div className="bg-[#0B111D] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#070B14]/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ChartBarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {language === 'mr' ? 'प्रमुख कामगिरी मेट्रिक्स व ट्रेंड्स' : 'Key Operational Metrics & System Trends'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'mr' ? 'राज्यस्तरीय प्रसिद्धी, कार्यपूर्तता व प्रतिसाद गती' : 'Statewide releases, task completion & pipeline throughput over time'}
            </p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono">
          {(['7D', '30D', '90D'] as const).map((win) => (
            <button
              key={win}
              type="button"
              onClick={() => setActiveWindow(win)}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                activeWindow === win
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {win}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Multi-Series Area Chart (SVG Vector) */}
        <div className="h-44 w-full relative pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="areaProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Series 1: Tasks (Sky Blue) */}
            <path
              d="M0,90 Q80,80 160,60 T320,40 T500,20 L500,120 L0,120 Z"
              fill="url(#areaTasks)"
            />
            <path
              d="M0,90 Q80,80 160,60 T320,40 T500,20"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
            />

            {/* Series 2: Progress (Emerald Green) */}
            <path
              d="M0,105 Q80,95 160,85 T320,65 T500,45 L500,120 L0,120 Z"
              fill="url(#areaProgress)"
            />
            <path
              d="M0,105 Q80,95 160,85 T320,65 T500,45"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
            />

            {/* Series 3: Cabinet Reviews (Amber Points) */}
            {[
              { cx: 80, cy: 75 },
              { cx: 240, cy: 50 },
              { cx: 420, cy: 30 },
            ].map((pt, i) => (
              <circle
                key={i}
                cx={pt.cx}
                cy={pt.cy}
                r="4.5"
                fill="#F59E0B"
                stroke="#0B111D"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Day X-Axis Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 border-b border-white/5 pb-2">
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Releases & Clippings
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Ground Verification Rate
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Cabinet Briefings
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setToast({
                type: 'success',
                message: 'Operations analytics export generated (CSV format).',
              });
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>

        {/* 4 Bottom Telemetry Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/5">
          <div className="p-2 rounded bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block font-mono">Mean Ingestion Latency</span>
            <span className="text-sm font-bold font-mono text-emerald-400">24 ms</span>
          </div>
          <div className="p-2 rounded bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block font-mono">Pipeline Success Rate</span>
            <span className="text-sm font-bold font-mono text-white">99.98%</span>
          </div>
          <div className="p-2 rounded bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block font-mono">Human Review Backlog</span>
            <span className="text-sm font-bold font-mono text-amber-400">4 items</span>
          </div>
          <div className="p-2 rounded bg-white/[0.02]">
            <span className="text-[10px] text-slate-400 block font-mono">Channel Availability</span>
            <span className="text-sm font-bold font-mono text-emerald-400">100% (42/42)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
