'use client';

import React from 'react';
import Link from 'next/link';
import { CpuChipIcon, ServerStackIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { useDashboardStore } from '@/stores/dashboardStore';

export const OperationalCommandHeader: React.FC = React.memo(() => {
  const { language } = useDashboardStore();

  return (
    <header className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Operational Deck Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <CpuChipIcon className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr'
                  ? 'माहिती व जनसंपर्क महासंचालनालय — राज्य नियंत्रण कक्ष'
                  : 'DGIPR State Operational Command Deck'}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>{language === 'mr' ? '३६ जिल्हे थेट सक्रिय' : '36 Districts Active'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{language === 'mr' ? 'थेट ऑपरेशन्स' : 'Live Operations'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'माध्यम संनियंत्रण, जनमत कल, जिल्हा माहिती अधिकारी समन्वय व संकट व्यवस्थापन'
                : 'Executive PR, Media Intelligence, District Information Officer (DIO) Dispatch & Crisis Deck'}
            </p>
          </div>
        </div>

        {/* Right: Operational Controls + System Telemetry & Health Quick Action */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick-Action Button to Technical System Monitoring */}
          <Link
            href="/system-monitoring"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer group"
            title="Inspect DevOps Infrastructure, Socket Latencies, TimescaleDB & Audit Logs"
          >
            <ServerStackIcon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="inline-flex items-center gap-1">
              <span>
                {language === 'mr'
                  ? 'सिस्टम दूरमिती व आरोग्य तपासणी'
                  : 'System Telemetry & Health'}
              </span>
              <ArrowRightIcon className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* GIS Mesh Telemetry */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 text-xs font-mono font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>GIS Mesh: Synced</span>
          </div>
        </div>
      </div>
    </header>
  );
});

OperationalCommandHeader.displayName = 'OperationalCommandHeader';

export default OperationalCommandHeader;
