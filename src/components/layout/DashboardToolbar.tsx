'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const DashboardToolbar: React.FC = () => {
  const {
    selectedDivision,
    setSelectedDivision,
    selectedPeriod,
    setSelectedPeriod,
    userRole,
    currentUser,
    language,
    overviewMetrics,
    searchDistrict,
    setSearchDistrict,
    setSelectedDistrictId,
  } = useDashboardStore();
  const t = useTranslation(language);

  const isDistrictScoped = userRole === 'collector' || userRole === 'dio_desk';
  const isDivisionScoped = userRole === 'director_konkan';

  const scopeBadgeText = isDistrictScoped
    ? `${currentUser?.district || 'Palghar'} District Clearance`
    : isDivisionScoped
    ? 'Konkan Division Clearance'
    : 'Statewide Clearance';

  return (
    <div className="bg-surface border-b border-borderLine-standard px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
      {/* Page Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gov-primary tracking-tight">
            {overviewMetrics?.scopeName || t.toolbar.title}
          </h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            {scopeBadgeText}
          </span>
        </div>
        <p className="text-[11px] text-content-muted">
          {t.toolbar.subtitle}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        {/* Konkan Division Fixed Authority Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-semibold shadow-2xs">
          <MaterialIcon name="verified_user" size="xs" className="text-emerald-700" />
          <span>{language === 'mr' ? 'कोकण विभाग (थेट)' : 'Konkan Division (Active)'}</span>
        </div>

        {/* 5-District Drilldown Selector */}
        <div className="relative flex items-center">
          {isDistrictScoped ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs text-slate-700 font-semibold shadow-2xs">
              <MaterialIcon name="lock" size="xs" className="text-slate-500" />
              <span>{currentUser?.district || 'Palghar'} {language === 'mr' ? 'जिल्हा (लॉक)' : 'District (Locked)'}</span>
            </div>
          ) : (
            <select
              value={searchDistrict}
              onChange={(e) => {
                const val = e.target.value;
                setSearchDistrict(val);
                if (val) {
                  setSelectedDistrictId(val.toLowerCase());
                }
              }}
              className="pl-3 pr-7 py-1.5 bg-surface border border-slate-300 rounded text-xs text-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue cursor-pointer font-medium shadow-2xs"
            >
              <option value="">{language === 'mr' ? 'सर्व ५ जिल्हे (All Konkan)' : 'All 5 Konkan Districts'}</option>
              <option value="Thane">{language === 'mr' ? 'ठाणे (Thane)' : 'Thane'}</option>
              <option value="Raigad">{language === 'mr' ? 'रायगड (Raigad)' : 'Raigad'}</option>
              <option value="Palghar">{language === 'mr' ? 'पालघर (Palghar)' : 'Palghar'}</option>
              <option value="Ratnagiri">{language === 'mr' ? 'रत्नागिरी (Ratnagiri)' : 'Ratnagiri'}</option>
              <option value="Sindhudurg">{language === 'mr' ? 'सिंधुदुर्ग (Sindhudurg)' : 'Sindhudurg'}</option>
            </select>
          )}
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
          <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
          <span className="font-medium text-[11px]">Dynamic API Connected</span>
        </div>
      </div>
    </div>
  );
};
