'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LockClosedIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { getDistrictName } from '@/lib/dataLocalization';

export const DashboardToolbar: React.FC = () => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    userRole,
    currentUser,
    language,
    selectedDistrictId,
    searchDistrict,
    setSearchDistrict,
    setSelectedDistrictId,
    setToast,
  } = useDashboardStore();
  const t = useTranslation(language);

  const isDistrictScoped = userRole === 'collector' || userRole === 'dio_desk';
  const isDivisionScoped = userRole === 'director_konkan';

  const localizedDistrictName = getDistrictName(currentUser?.district || 'Palghar', language);

  const scopeBadgeText = isDistrictScoped
    ? (language === 'mr' ? `${localizedDistrictName} जिल्हा मंजुरी` : `${currentUser?.district || 'Palghar'} District Clearance`)
    : isDivisionScoped
    ? (language === 'mr' ? 'विभागीय मंजुरी' : 'Divisional Clearance')
    : (language === 'mr' ? 'राज्यस्तरीय मंजुरी' : 'Statewide Clearance');

  const handleExport = () => {
    setToast({
      type: 'success',
      message: language === 'mr'
        ? 'माहिती अहवाल यशस्वीरित्या निर्यात केला.'
        : 'Telemetry operations report exported successfully (CSV/PDF).',
    });
  };

  const currentDistrictValue =
    searchDistrict ||
    (selectedDistrictId && selectedDistrictId !== 'all'
      ? selectedDistrictId.charAt(0).toUpperCase() + selectedDistrictId.slice(1)
      : '');

  return (
    <div className="shrink-0 bg-white border-b border-slate-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 select-none z-10">
      {/* Left: Operations Title & Clearance Status */}
      <div className="flex items-center gap-2.5">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
          {language === 'mr' ? 'राज्य संनियंत्रण दृश्यावलोकन' : 'State Operations Overview'}
        </h2>
        <span className="text-slate-300 select-none font-mono">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
            {scopeBadgeText}
          </span>
        </div>
      </div>

      {/* Right: Pure Actionable Filter Controls Only */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* 1. District Scope Filter */}
        {isDistrictScoped ? (
          <div className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1.5">
            <LockClosedIcon className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{localizedDistrictName} {language === 'mr' ? '(बंदिस्त)' : '(Locked)'}</span>
          </div>
        ) : (
          <div className="relative flex items-center z-20">
            <select
              value={currentDistrictValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchDistrict(val);
                setSelectedDistrictId(val ? val.toLowerCase() : 'all');
              }}
              className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 cursor-pointer appearance-none"
            >
              <option value="">{language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'}</option>
              <option value="Thane">{language === 'mr' ? 'ठाणे' : 'Thane'}</option>
              <option value="Raigad">{language === 'mr' ? 'रायगड' : 'Raigad'}</option>
              <option value="Palghar">{language === 'mr' ? 'पालघर' : 'Palghar'}</option>
              <option value="Ratnagiri">{language === 'mr' ? 'रत्नागिरी' : 'Ratnagiri'}</option>
              <option value="Sindhudurg">{language === 'mr' ? 'सिंधुदुर्ग' : 'Sindhudurg'}</option>
            </select>
            <ChevronDownIcon
              className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 shrink-0"
            />
          </div>
        )}

        {/* 2. Time Range Filter */}
        <div className="relative flex items-center z-20">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 cursor-pointer appearance-none"
          >
            <option value="Last 7 days">{language === 'mr' ? 'मागील ७ दिवस' : 'Last 7 Days'}</option>
            <option value="Last 30 days">{language === 'mr' ? 'मागील ३० दिवस' : 'Last 30 Days'}</option>
            <option value="Last 90 days">{language === 'mr' ? 'मागील ९० दिवस' : 'Last 90 Days'}</option>
          </select>
          <ChevronDownIcon
            className="w-4 h-4 text-slate-400 pointer-events-none absolute right-2.5 shrink-0"
          />
        </div>

        {/* 3. Primary Export / Action Button */}
        <button
          type="button"
          onClick={handleExport}
          className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
          title={language === 'mr' ? 'माहिती अहवाल निर्यात करा' : 'Export Telemetry Report'}
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-white shrink-0" />
          <span>{language === 'mr' ? 'अहवाल निर्यात' : 'Export Telemetry Report'}</span>
        </button>
      </div>
    </div>
  );
};
