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

export const CommandCenterNavHeader: React.FC = () => {
  const pathname = usePathname();
  const { language } = useDashboardStore();

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
      subEn: 'Sources · Status · Live Stream · Failure Retries · Raw Preview',
      subMr: 'स्त्रोत रचना · पाइपलाइन स्थिती · थेट प्रवाह · त्रुटी व पुनर्प्रयत्न · पूर्वावलोकन',
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
    <div className="bg-surface border border-borderLine-standard rounded-lg p-4 shadow-2xs space-y-3">
      {/* Top Banner / Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine-subtle pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gov-primary flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <MaterialIcon name="military_tech" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-gov-primary tracking-tight">
                {language === 'mr' ? 'कमांड सेंटर (Command Centre)' : 'DGIPR Command Centre'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                {language === 'mr' ? 'कोकण विभाग थेट नियंत्रण' : 'Konkan Division Operations'}
              </span>
            </div>
            <p className="text-xs text-content-secondary">
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय — राज्य माहिती ऑपरेशन्स व डेटा प्रवाह कक्ष'
                : 'State Information Operations & Real-Time Intelligence Control Centre'}
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{language === 'mr' ? 'थेट डेटा प्रवाह कार्यरत (14.2K ev/s)' : 'Pipeline Ingestion Active: 14.2K ev/s'}</span>
          </div>
          <div className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
            SLA: 99.98%
          </div>
        </div>
      </div>

      {/* Suggested Navigation: 3 Distinct Pages under Command Centre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 cursor-pointer ${
                isActive
                  ? 'bg-gov-primary text-white border-gov-primary shadow-sm ring-2 ring-gov-accent/30'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <MaterialIcon name={tab.icon} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? 'text-white' : 'text-gov-primary'
                    }`}
                  >
                    {language === 'mr' ? tab.labelMr : tab.labelEn}
                  </h3>
                  {isActive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-900 shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 font-medium ${
                    isActive ? 'text-slate-300' : 'text-slate-600'
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
};

export default CommandCenterNavHeader;
