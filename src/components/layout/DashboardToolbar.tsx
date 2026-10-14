'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { CheckCircle2 } from 'lucide-react';

export const DashboardToolbar: React.FC = () => {
  const { selectedDivision, setSelectedDivision, selectedPeriod, setSelectedPeriod, language } =
    useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="bg-surface border-b border-borderLine-standard px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
      {/* Page Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gov-primary tracking-tight">
            {t.toolbar.title}
          </h2>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            ({language === 'en' ? 'Statewide Operations' : language === 'mr' ? 'राज्यस्तरीय संनियंत्रण' : 'राज्यस्तरीय निगरानी'})
          </span>
        </div>
        <p className="text-[11px] text-content-muted">
          {t.toolbar.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {/* Geographic Scope Filter */}
        <div className="relative">
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="pl-3 pr-7 py-1.5 bg-surface border border-slate-300 rounded text-xs text-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue cursor-pointer font-medium shadow-2xs"
          >
            <option value="All Maharashtra">{t.toolbar.allMaha}</option>
            <option value="Pune">{t.toolbar.puneDiv}</option>
            <option value="Konkan">{t.toolbar.konkanDiv}</option>
            <option value="Nagpur">{t.toolbar.nagpurDiv}</option>
            <option value="Nashik">{t.toolbar.nashikDiv}</option>
            <option value="Aurangabad">{t.toolbar.aurangabadDiv}</option>
            <option value="Amravati">{t.toolbar.amravatiDiv}</option>
          </select>
        </div>

        {/* Reporting Period Filter */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 bg-surface border border-slate-300 rounded text-xs text-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue cursor-pointer font-medium shadow-2xs"
          >
            <option value="Last 7 days">{t.toolbar.last7d}</option>
            <option value="Last 30 days">{t.toolbar.last30d}</option>
            <option value="Last 90 days">{t.toolbar.last90d}</option>
          </select>
        </div>

        {/* Live Data Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-[11px]">{t.toolbar.syncedBadge}</span>
        </div>
      </div>
    </div>
  );
};
