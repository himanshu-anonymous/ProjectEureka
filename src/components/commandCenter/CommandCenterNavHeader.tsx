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

export const CommandCenterNavHeader: React.FC = React.memo(() => {
  const pathname = usePathname();
  const { language, setToast } = useDashboardStore();

  const handleExport = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'माहिती अहवाल यशस्वीरित्या निर्यात केला.'
        : 'Telemetry operations report exported successfully (CSV/PDF).',
    });
  };

  const tabs: NavTabItem[] = [
    {
      href: '/command-center',
      labelEn: 'Telemetry Operations',
      labelMr: 'दूरमिती ऑपरेशन्स',
      subEn: '7 In-Page Modules · Telemetry, Filter, Pipeline, Monitor, DB, Logs, Audit',
      subMr: '७ अंतर्गत विभाग · दूरमिती, गाळणी, पाइपलाइन, मॉनिटरिंग, डेटाबेस, नोंदी, ऑडिट',
      icon: 'podcasts',
    },
    {
      href: '/command-center/raw-ingestion',
      labelEn: 'Raw Ingestion',
      labelMr: 'कच्चा डेटा अंतर्ग्रहण व्यवस्थापन',
      subEn: 'Sources • Pipeline Status • Failure Retries • Ingestion Logs',
      subMr: 'स्त्रोत रचना • पाइपलाइन स्थिती • त्रुटी व पुनर्प्रयत्न • अंतर्ग्रहण नोंदी',
      icon: 'dns',
    },
    {
      href: '/command-center/pipeline-flow',
      labelEn: 'Pipeline & Ops Flow',
      labelMr: 'पाइपलाइन व ऑपरेशन प्रवाह',
      subEn: '6 Horizontal Sections · Detailed Animated Pipeline · Telemetry, DB, Logs',
      subMr: '६ समांतर विभाग · सविस्तर ॲनिमेटेड पाइपलाइन प्रवाह · देखरेख, डेटाबेस व ऑडिट',
      icon: 'layers',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 shadow-2xs space-y-3.5 select-none">
      {/* Top Row: Squircle Identity + Operations Badges + Right Side Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        {/* Left Identity Container */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <MaterialIcon name="military_tech" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr' ? 'माहिती व जनसंपर्क महासंचालनालय कमांड सेंटर' : 'DGIPR Command Centre'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 leading-none">
                {language === 'mr' ? 'राज्यव्यापी थेट नियंत्रण' : 'Statewide Operations'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय — राज्य माहिती ऑपरेशन्स व डेटा प्रवाह कक्ष'
                : 'State Information Operations & Real-Time Intelligence Control Centre'}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Exact District Sum Ingestion Metric Pill */}
          <div className="bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs">
            {/* Isolated Strict 8x8 Pulsing Dot with GPU Acceleration */}
            <span className="relative flex h-2 w-2 shrink-0 will-change-transform transform-gpu">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>
              {language === 'mr'
                ? 'अंतर्ग्रहण सक्रिय: १,४८० घटना/मि (२४.७ घटना/से)'
                : 'Ingestion Active: 1,480 ev/min (24.7 ev/s)'}
            </span>
          </div>

          {/* SLA Badge */}
          <div className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium">
            {language === 'mr' ? 'सेवा हमी: ९९.९८%' : 'SLA: 99.98%'}
          </div>

          {/* Export Telemetry Report Button */}
          <button
            type="button"
            onClick={handleExport}
            className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            title={language === 'mr' ? 'माहिती अहवाल निर्यात करा' : 'Export Telemetry Report'}
          >
            <MaterialIcon name="download" size="xs" className="text-white" />
            <span>{language === 'mr' ? 'अहवाल निर्यात' : 'Export Telemetry Report'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: 3 Compact Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <MaterialIcon name={tab.icon} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {language === 'mr' ? tab.labelMr : tab.labelEn}
                  </h3>
                  {isActive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950 shrink-0">
                      {language === 'mr' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 font-medium ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
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

export default CommandCenterNavHeader;
