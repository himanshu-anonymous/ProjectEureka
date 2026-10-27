'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { CpuChipIcon, ChartBarIcon, ShieldExclamationIcon } from '@heroicons/react/20/solid';

interface CoreOperationalSwitchDeckProps {
  currentActive: 'command-center' | 'konkan-index' | 'crisis';
}

export const CoreOperationalSwitchDeck: React.FC<CoreOperationalSwitchDeckProps> = ({ currentActive }) => {
  const { language, userRole, currentUser } = useDashboardStore();

  const getRoleDisplayName = () => {
    if (userRole === 'dg_admin') {
      return language === 'mr' ? 'महासंचालक (DG) · राज्य मुख्यालय' : 'DG · State Admin View';
    }
    if (userRole === 'director_konkan') {
      return language === 'mr' ? 'विभागीय उपसंचालक · कोकण' : 'Divisional Director View (Konkan)';
    }
    if (userRole === 'collector') {
      return language === 'mr' ? 'जिल्हाधिकारी (पालघर)' : 'Palghar Collector View';
    }
    return language === 'mr' ? 'डीआयओ ऑपरेटर १ (पालघर डेस्क)' : 'DIO Operator 1 (Palghar Desk)';
  };

  const tabs = [
    {
      id: 'command-center',
      href: '/command-center',
      labelEn: 'Command Center',
      labelMr: '१. कमांड सेंटर',
      subEn: 'All 36 DIOs & Media Desk',
      subMr: 'सर्व ३६ जिल्हे व माध्यम कक्ष',
      icon: CpuChipIcon,
    },
    {
      id: 'konkan-index',
      href: '/konkan-index',
      labelEn: 'Konkan Index',
      labelMr: '२. कोकण १००-गुणांक निर्देशांक',
      subEn: 'Pilot 100-Point Index',
      subMr: '५ पायलट जिल्हे विश्लेषण',
      icon: ChartBarIcon,
    },
    {
      id: 'crisis',
      href: '/crisis',
      labelEn: 'Crisis Desk',
      labelMr: '३. आपत्कालीन कक्ष',
      subEn: '90-min SLA & Action Console',
      subMr: '९०-मि. एसएलए व कृती मंच',
      icon: ShieldExclamationIcon,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-4 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            MH
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                {language === 'mr'
                  ? 'महाराष्ट्र शासन — मुख्य माहिती व संप्रेषण आदेश कक्ष (DGIPR)'
                  : 'Government of Maharashtra — Central Command & Public Relations (DGIPR)'}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'mr' ? 'थेट डेटा सक्रिय' : 'Live Operations Active'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय — केंद्रीय नियंत्रण व कृती मंच'
                : 'Central Operations Command, Performance Benchmarking & Crisis Desk'}
            </p>
          </div>
        </div>

        {/* Officer Active Badge */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="font-semibold text-slate-800">{getRoleDisplayName()}</span>
          <span className="text-slate-400 font-mono text-[11px]">| IST Live</span>
        </div>
      </div>

      {/* 3 Core Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
        {tabs.map((tab) => {
          const isActive = currentActive === tab.id;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'mr' ? tab.labelMr : tab.labelEn}
                  </h3>
                  {isActive && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Active
                    </span>
                  )}
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
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

export default CoreOperationalSwitchDeck;
