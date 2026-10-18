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
  icon: MaterialIconName;
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
      icon: 'podcasts',
    },
    {
      href: '/system-monitoring/raw-ingestion',
      labelEn: 'Raw Ingestion',
      labelMr: 'कच्चा डेटा अंतर्ग्रहण',
      icon: 'dns',
    },
    {
      href: '/system-monitoring/pipeline-flow',
      labelEn: 'Pipeline & Ops Flow',
      labelMr: 'पाइपलाइन व ऑपरेशन प्रवाह',
      icon: 'layers',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Identity and Tabs */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <MaterialIcon name="dns" size="xs" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                  {language === 'mr' ? 'प्रणाली व पायाभूत सुविधा देखरेख' : 'System & Infrastructure Monitoring'}
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-800 border border-sky-300 leading-none">
                  NIC SDC
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Strip (Pill Tabs) */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80" aria-label="System Monitoring Sub-navigation">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
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
                  <MaterialIcon
                    name={tab.icon}
                    size="xs"
                    className={isActive ? 'text-amber-600' : 'text-slate-500'}
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
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/command-center"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Return to Operational Command Deck"
          >
            <MaterialIcon name="military_tech" size="xs" className="text-amber-600" />
            <span className="hidden sm:inline">{language === 'mr' ? 'कमांड डेक →' : 'Command Deck →'}</span>
          </Link>

          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>1,480 ev/min</span>
          </div>

          <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 font-medium">
            SLA: 99.98%
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export Infrastructure & Audit Dossier"
          >
            <MaterialIcon name="download" size="xs" />
            <span>{language === 'mr' ? 'निर्यात' : 'Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

SystemMonitoringNavHeader.displayName = 'SystemMonitoringNavHeader';
