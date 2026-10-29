'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ServerStackIcon,
  SignalIcon,
  CircleStackIcon,
  CpuChipIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/20/solid';
import { useDashboardStore } from '@/stores/dashboardStore';

interface NavTabItem {
  href: string;
  labelEn: string;
  labelMr: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SystemMonitoringNavHeader: React.FC = React.memo(() => {
  const pathname = usePathname();
  const { language, setToast } = useDashboardStore();

  const handleExport = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'माहिती व ऑडिट नोंदी यशस्वीरित्या निर्यात केल्या.'
        : 'Infrastructure audit & telemetry logs exported successfully (CSV/JSON).',
    });
  };

  const tabs: NavTabItem[] = [
    {
      href: '/system-monitoring',
      labelEn: 'Telemetry Operations & Audit',
      labelMr: 'दूरमिती ऑपरेशन्स व ऑडिट',
      icon: SignalIcon,
    },
    {
      href: '/system-monitoring/raw-ingestion',
      labelEn: 'Raw Ingestion',
      labelMr: 'कच्चा डेटा अंतर्ग्रहण',
      icon: ServerStackIcon,
    },
    {
      href: '/system-monitoring/pipeline-flow',
      labelEn: 'Pipeline & Ops Flow',
      labelMr: 'पाइपलाइन व ऑपरेशन प्रवाह',
      icon: CircleStackIcon,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Identity and Tabs */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <ServerStackIcon className="w-4 h-4 text-amber-400 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  {language === 'mr' ? 'प्रणाली व पायाभूत सुविधा देखरेख' : 'System & Infrastructure Monitoring'}
                </h1>
                <span className="border-l-2 border-sky-400 pl-1.5 text-sky-700 font-mono text-xs font-semibold whitespace-nowrap">
                  NIC SDC
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Strip (Pill Tabs) */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80" aria-label="System Monitoring Sub-navigation">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const TabIcon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <TabIcon
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-500'}`}
                  />
                  <span>{language === 'mr' ? tab.labelMr : tab.labelEn}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Operational Badges and Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/command-center"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer group"
            title="Return to Operational Command Deck"
          >
            <CpuChipIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline-flex items-center gap-1">
              <span>{language === 'mr' ? 'कमांड डेक' : 'Command Deck'}</span>
              <ArrowRightIcon className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          <div className="text-emerald-700 text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shrink-0" />
            </span>
            <span>1,480 ev/min</span>
          </div>

          <div className="font-mono text-xs text-slate-600 border-l-2 border-slate-300 pl-2 font-medium whitespace-nowrap">
            SLA: 99.98%
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export Infrastructure & Audit Dossier"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{language === 'mr' ? 'निर्यात' : 'Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

SystemMonitoringNavHeader.displayName = 'SystemMonitoringNavHeader';
