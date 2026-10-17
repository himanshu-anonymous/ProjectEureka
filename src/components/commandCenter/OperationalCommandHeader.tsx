'use client';

import React from 'react';
import Link from 'next/link';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

export const OperationalCommandHeader: React.FC = React.memo(() => {
  const { language } = useDashboardStore();

  return (
    <header className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Operational Deck Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <MaterialIcon name="military_tech" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr'
                  ? 'माहिती व जनसंपर्क महासंचालनालय — राज्य नियंत्रण कक्ष'
                  : 'DGIPR State Operational Command Deck'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 leading-none">
                {language === 'mr' ? '३६ जिल्हे थेट सक्रिय' : '36 Districts Active'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 leading-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {language === 'mr' ? 'थेट ऑपरेशन्स' : 'Live Operations'}
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
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick-Action Button to Technical System Monitoring */}
          <Link
            href="/system-monitoring"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-800 transition-all flex items-center gap-2 shadow-xs cursor-pointer group"
            title="Inspect DevOps Infrastructure, Socket Latencies, TimescaleDB & Audit Logs"
          >
            <MaterialIcon name="dns" size="xs" className="text-amber-400 group-hover:scale-110 transition-transform" />
            <span>
              {language === 'mr'
                ? 'सिस्टम दूरमिती व आरोग्य तपासणी →'
                : 'System Telemetry & Health →'}
            </span>
          </Link>

          {/* Konkan / State Status Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>GIS Mesh: Synced</span>
          </div>
        </div>
      </div>
    </header>
  );
});

OperationalCommandHeader.displayName = 'OperationalCommandHeader';

export default OperationalCommandHeader;
