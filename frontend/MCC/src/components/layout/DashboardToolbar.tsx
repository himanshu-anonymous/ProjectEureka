'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { LockClosedIcon, ChevronDownIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { getDistrictName } from '@/lib/dataLocalization';

export interface DashboardToolbarProps {
  /** Optional preset district ID to pre-select (for deep linking) */
  presetDistrictId?: string;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({ presetDistrictId }) => {
  const {
    selectedPeriod,
    setSelectedPeriod,
    userRole,
    currentUser,
    language,
    selectedDistrictId,
    districts,
    searchDistrict,
    setSearchDistrict,
    setSelectedDistrictId,
    setToast,
    isBigScreen,
    toggleBigScreen,
    setCopilotOpen,
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

  // Highlight district across all dashboard panels
  const highlightDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  // The dropdown always mirrors the store selection so cross-panel clicks stay in sync (two-way).
  const currentDistrictValue =
    selectedDistrictId && selectedDistrictId !== 'all' ? selectedDistrictId : '';

  // Options mirror the dashboard dataset, localized.
  const districtOptions = React.useMemo(() => {
    const options = [...districts]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((d) => ({
        id: d.id,
        label: language === 'mr' ? d.nameMr || getDistrictName(d.name, 'mr') : d.name,
      }));

    // A selection can come from another panel (e.g. the GIS map, which covers all 36
    // districts). Keep it representable so the dropdown never resets to "All Districts".
    if (
      selectedDistrictId &&
      selectedDistrictId !== 'all' &&
      !options.some((o) => o.id === selectedDistrictId)
    ) {
      const fallbackLabel = selectedDistrictId
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      options.push({ id: selectedDistrictId, label: fallbackLabel });
    }

    return options;
  }, [districts, language, selectedDistrictId]);

  return (
    <div className="shrink-0 bg-white border-b border-slate-200/80 px-2 sm:px-3 py-0.5 flex flex-wrap items-center justify-between gap-1.5 select-none z-10 min-h-[26px]">
      {/* Left: Operations Title & Clearance Status */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-[10px] sm:text-[11px] font-bold text-slate-900 tracking-tight leading-none">
          {language === 'mr' ? 'राज्य संनियंत्रण दृश्यावलोकन' : 'State Operations Overview'}
        </h2>
        <span className="text-slate-300 select-none font-mono text-xs">|</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
            {scopeBadgeText}
          </span>
        </div>
      </div>

      {/* Center: KRA Nodal Officer & Clearance Badge */}
      <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-200/90 rounded shadow-2xs">
        <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse shrink-0" />
        <span className="text-[8.5px] uppercase font-bold text-slate-500 tracking-wider">
          {language === 'mr' ? 'केआरए जबाबदार अधिकारी:' : 'KRA Nodal Officer:'}
        </span>
        <span className="text-[10px] font-bold text-slate-900 font-sans">
          {language === 'mr' ? 'किशोर गांगुर्डे' : 'Kishor Gangurde'}
        </span>
        <span className="text-[8px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded font-mono font-bold border border-emerald-200">
          DG Admin Tier-1
        </span>
      </div>

      {/* Right: Pure Actionable Filter Controls Only */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* 1. District Scope Filter with cross-panel highlighting */}
        {isDistrictScoped ? (
          <div className="h-5 sm:h-5.5 px-2 rounded border border-slate-200 bg-slate-50 text-[9.5px] font-medium text-slate-700 shadow-2xs flex items-center gap-1">
            <LockClosedIcon className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{localizedDistrictName} {language === 'mr' ? '(बंदिस्त)' : '(Locked)'}</span>
          </div>
        ) : (
          <div className="relative flex items-center z-20">
            <select
              value={currentDistrictValue}
              onChange={(e) => {
                const val = e.target.value;
                // Clear the text search so the table shows every district with the
                // selected one highlighted, rather than collapsing to a single row.
                setSearchDistrict('');
                // Cross-panel highlight: notify other components of district change
                highlightDistrict(val || 'all');
              }}
              className="h-5 sm:h-5.5 pl-2 pr-6 rounded border border-slate-200 bg-white text-[9.5px] font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 cursor-pointer appearance-none"
            >
              <option value="">{language === 'mr' ? 'सर्व जिल्हे' : 'All Districts'}</option>
              {districtOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              className="w-3 h-3 text-slate-400 pointer-events-none absolute right-1.5 shrink-0"
            />
          </div>
        )}

        {/* 2. Time Range Filter with dynamic updates */}
        <div className="relative flex items-center z-20">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="h-5 sm:h-5.5 pl-2 pr-6 rounded border border-slate-200 bg-white text-[9.5px] font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 cursor-pointer appearance-none"
          >
            <option value="Last 7 days">{language === 'mr' ? 'मागील ७ दिवस' : 'Last 7 Days'}</option>
            <option value="Last 30 days">{language === 'mr' ? 'मागील ३० दिवस' : 'Last 30 Days'}</option>
            <option value="Last 90 days">{language === 'mr' ? 'मागील ९० दिवस' : 'Last 90 Days'}</option>
          </select>
          <ChevronDownIcon
            className="w-3 h-3 text-slate-400 pointer-events-none absolute right-1.5 shrink-0"
          />
        </div>

        {/* 3. Primary Export / Action Button */}
        <button
          type="button"
          onClick={handleExport}
          className="h-5 sm:h-5.5 px-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-[9.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
          title={language === 'mr' ? 'माहिती अहवाल निर्यात करा' : 'Export Telemetry Report'}
        >
          <ArrowDownTrayIcon className="w-3 h-3 text-white shrink-0" />
          <span>{language === 'mr' ? 'अहवाल निर्यात' : 'Export Telemetry Report'}</span>
        </button>

        {/* 4. War Room Big Screen Fullscreen Toggle */}
        <button
          type="button"
          onClick={toggleBigScreen}
          className={`h-7 px-2.5 rounded-md text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] ${
            isBigScreen ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-700 hover:bg-emerald-600'
          }`}
          title={language === 'mr' ? 'मोठ्या स्क्रीनवर पूर्ण दृश्य' : 'War Room Big Screen Cockpit'}
        >
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
          <span className="hidden sm:inline">
            {isBigScreen
              ? (language === 'mr' ? 'सामान्य दृश्य (Esc)' : 'Exit Big Screen (Esc)')
              : (language === 'mr' ? 'वॉर रूम बिग स्क्रीन' : 'War Room Big Screen')}
          </span>
        </button>

        {/* 5. Nirdeshak AI Copilot Trigger */}
        <button
          type="button"
          onClick={() => setCopilotOpen(true)}
          className="h-7 px-2.5 rounded-md text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
          title={language === 'mr' ? 'डीजीआयपीआर निर्देशांक उघडा' : 'Open DGIPR Nirdeshak'}
        >
          <svg className="w-3.5 h-3.5 fill-current shrink-0 text-amber-200" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
          </svg>
          <span className="hidden sm:inline">
            {language === 'mr' ? 'निर्देशाक' : 'Nirdeshak'}
          </span>
        </button>
      </div>
    </div>
  );
};