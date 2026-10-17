'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

interface NavTabItem {
  href: string;
  labelEn: string;
  labelMr: string;
  subEn: string;
  subMr: string;
  icon: MaterialIconName;
}

export const SystemMonitoringNavHeader: React.FC = React.memo(() => {
  const pathname = usePathname();
  const { language, setToast } = useDashboardStore();

  const handleExport = () => {
    setToast({
      type: 'success',
      message: 'Infrastructure audit & telemetry logs exported successfully (CSV/JSON).',
    });
  };

  const tabs: NavTabItem[] = [
    {
      href: '/system-monitoring',
      labelEn: 'Telemetry Operations & Audit',
      labelMr: 'दूरमिती ऑपरेशन्स व ऑडिट',
      subEn: '7 Modules · Telemetry, Filter, Pipeline, Monitor, DB, Logs, Audit & JSON Inspector',
      subMr: '७ अंतर्गत विभाग · दूरमिती, गाळणी, पाइपलाइन, मॉनिटरिंग, डेटाबेस, नोंदी, ऑडिट व पेलोड',
      icon: 'podcasts',
    },
    {
      href: '/system-monitoring/raw-ingestion',
      labelEn: 'Raw Ingestion',
      labelMr: 'कच्चा डेटा अंतर्ग्रहण',
      subEn: 'Sources • Pipeline Status • Failure Retries • Ingestion Logs',
      subMr: 'स्त्रोत रचना • पाइपलाइन स्थिती • त्रुटी व पुनर्प्रयत्न • अंतर्ग्रहण नोंदी',
      icon: 'dns',
    },
    {
      href: '/system-monitoring/pipeline-flow',
      labelEn: 'Pipeline & Ops Flow',
      labelMr: 'पाइपलाइन व ऑपरेशन प्रवाह',
      subEn: '6 Horizontal Stages • Animated Data Flow • Timescale & Audit',
      subMr: '६ समांतर टप्पे • ॲनिमेटेड डेटा प्रवाह • डेटाबेस व ऑडिट',
      icon: 'layers',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 shadow-2xs space-y-3.5 select-none">
      {/* Top Row: System Identity + Operations Badges + Right Side Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* Left Identity Container */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <MaterialIcon name="dns" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr'
                  ? 'माहिती व जनसंपर्क प्रणाली व पायाभूत सुविधा देखरेख'
                  : 'DGIPR System & Infrastructure Monitoring'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-300 leading-none">
                {language === 'mr' ? 'एनआयसी राज्य डेटा केंद्र' : 'NIC State Data Centre (SDC)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'एनआयसी राज्य डेटा केंद्र दूरमिती, अंतर्ग्रहण पाइपलाइन व सुरक्षा ऑडिट कक्ष'
                : 'NIC State Data Centre (SDC) Telemetry, Ingestion Pipelines & Cryptographic Audit Enclave'}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick link to pure operational command center */}
          <Link
            href="/command-center"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Return to Operational Command Deck"
          >
            <MaterialIcon name="military_tech" size="xs" className="text-amber-600" />
            <span>{language === 'mr' ? 'ऑपरेशनल कमांड डेक →' : 'Operational Command Deck →'}</span>
          </Link>

          {/* Exact District Sum Ingestion Metric Pill */}
          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs">
            <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Cluster Active: 1,480 ev/min</span>
          </div>

          {/* SLA Badge */}
          <div className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium">
            SLA: 99.98%
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export Infrastructure & Audit Dossier"
          >
            <MaterialIcon name="download" size="xs" />
            <span>{language === 'mr' ? 'निर्यात करा' : 'Export Logs'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: 3 Mode Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`p-3 rounded-xl border transition-all text-left flex items-start gap-3 cursor-pointer ${
                isActive
                  ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400/50 shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/90 text-slate-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <MaterialIcon name={tab.icon} size="xs" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {language === 'mr' ? tab.labelMr : tab.labelEn}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {language === 'mr' ? tab.subMr : tab.subEn}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

SystemMonitoringNavHeader.displayName = 'SystemMonitoringNavHeader';
