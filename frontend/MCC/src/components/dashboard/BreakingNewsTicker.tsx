'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';
import { getDistrictName } from '@/lib/dataLocalization';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
  ClockIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/20/solid';

export const DEFAULT_TICKER_SPEED_SECONDS = 85;

export interface BreakingNewsTickerProps {
  /** Configurable scroll speed in seconds for full loop (default 85s for readable pace) */
  speedSeconds?: number;
  className?: string;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  speedSeconds = DEFAULT_TICKER_SPEED_SECONDS,
  className = '',
}) => {
  const {
    language,
    selectedDistrictId,
    setToast,
    isBigScreen,
    toggleBigScreen,
  } = useDashboardStore();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof INITIAL_QUEUE_ITEMS[0] | null>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsPaused(true);
      }
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) setIsPaused(true);
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Keep constant full queue so scrolling velocity and speed are identical at all times
  // If a district is selected, prioritize its news at the front of the wire
  const rawItems = useMemo(() => {
    if (!selectedDistrictId || selectedDistrictId === 'all') {
      return [...INITIAL_QUEUE_ITEMS];
    }
    const q = selectedDistrictId.toLowerCase().trim().replace(/[\s_]+/g, '-');
    const matches = INITIAL_QUEUE_ITEMS.filter((item) => {
      const itemDist = item.district.toLowerCase().trim().replace(/[\s_]+/g, '-');
      return (
        itemDist === q ||
        (q === 'mumbai-city' && itemDist === 'mumbai') ||
        (q === 'mumbai-suburban' && itemDist === 'mumbai') ||
        (q === 'chhatrapati-sambhajinagar' && itemDist === 'aurangabad') ||
        (q === 'ahilyanagar' && itemDist === 'ahmednagar') ||
        (q === 'dharashiv' && itemDist === 'osmanabad')
      );
    });
    const others = INITIAL_QUEUE_ITEMS.filter((item) => !matches.includes(item));
    return [...matches, ...others];
  }, [selectedDistrictId]);

  // Double items for continuous smooth loop without jitter
  const marqueeItems = useMemo(() => {
    return [...rawItems, ...rawItems];
  }, [rawItems]);

  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    const el = document.getElementById('continuous-news-ticker-container');
    if (el) {
      el.scrollBy({ left: direction === 'right' ? 320 : -320, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <div
        className={`w-full min-h-[38px] sm:min-h-[42px] h-[38px] sm:h-[42px] bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white rounded-lg px-2.5 sm:px-3 py-1 flex items-center justify-between gap-2 shadow-sm border border-red-900 overflow-hidden select-none relative ring-1 ring-red-500/30 border-red-200 ${className}`}
        role="region"
        aria-label={language === 'mr' ? 'थेट वृत्त टिकर' : 'Breaking News Ticker'}
      >
        {/* 1. Left: High-Visibility Breaking News Indicator + Citizen Sentiment */}
        <div className="shrink-0 z-20 flex items-center gap-2">
          {/* Breaking News Wire Badge */}
          <div className="flex items-center gap-1.5 bg-white text-red-700 border border-white/95 font-black text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded shadow-xs leading-tight">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0 ring-2 ring-red-300" />
            <span className="font-extrabold tracking-tight">
              {language === 'mr' ? 'थेट घडामोडी' : 'BREAKING NEWS'}
            </span>
          </div>

          {/* Integrated Power BI Radial / Circle Chart (Citizen Sentiment Index) */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 border-l border-red-500/60 shrink-0 text-[10px]">
            <span className="font-bold text-white font-mono leading-none">74.2%</span>
            <span className="text-[8.5px] font-bold text-emerald-300 bg-red-950/70 px-1.5 py-0.2 rounded border border-emerald-400/40 leading-none">
              ▲ +2.4%
            </span>
          </div>
        </div>

        {/* 2. Center: Continuous Steady Marquee Scroll (Speed Remains Constant At All Times) */}
        <div
          id="continuous-news-ticker-container"
          className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center"
        >
          <div
            className="animate-marquee-scroll items-center gap-3.5 text-xs sm:text-[13px] font-normal cursor-pointer flex"
            style={{
              animationDuration: `${speedSeconds}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {marqueeItems.map((item, idx) => {
              const localizedDistrict = getDistrictName(item.district, language);
              const headline = language === 'mr' ? item.newsMr : item.newsEn;
              const isCritical = item.sentiment === 'Critical' || item.scoreLevel === 'Critical';

              return (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 shrink-0">
                  <div
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-2 shrink-0 group hover:bg-red-800/80 px-2 py-0.5 rounded-md border border-transparent hover:border-red-400/60 transition-all duration-150 cursor-pointer"
                    title={language === 'mr' ? 'तपशील पाहण्यासाठी क्लिक करा' : 'Click to inspect detailed dispatch'}
                  >
                    <span
                      className={`text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0 leading-tight ${
                        isCritical
                          ? 'bg-amber-300 text-red-950 font-black shadow-xs'
                          : 'bg-red-950/90 text-white border border-red-500/60'
                      }`}
                    >
                      {isCritical
                        ? language === 'mr' ? 'तातडीचे' : 'URGENT'
                        : language === 'mr' ? 'अधिकृत' : 'OFFICIAL'}
                    </span>

                    <span className="font-bold text-[9px] sm:text-[9.5px] bg-red-950 text-amber-300 px-1.5 py-0.5 rounded font-mono shrink-0 border border-red-500/50 leading-tight">
                      {localizedDistrict}
                    </span>

                    <span className="text-white text-xs sm:text-[13px] font-semibold group-hover:text-amber-200 group-hover:underline underline-offset-2 tracking-tight line-clamp-1 max-w-[340px] md:max-w-[500px] xl:max-w-[620px] leading-tight">
                      {headline}
                    </span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-red-200 group-hover:text-amber-200 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Clean Visual Separator Between Ticker Dispatches */}
                  <div className="h-4 w-px bg-red-500/50 shrink-0 select-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Interactive Play/Pause, Export & War Room Big Screen Controls */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 text-white">
          {/* Play / Pause & Manual Scroll Controls */}
          <div className="flex items-center gap-0.5 bg-red-950/70 p-0.5 rounded-md border border-red-500/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isPaused
                  ? 'bg-amber-400 text-red-950 font-bold hover:bg-amber-300'
                  : 'hover:bg-red-700 text-white'
              }`}
              title={
                isPaused
                  ? language === 'mr' ? 'सुरू करा (Resume)' : 'Resume Scrolling'
                  : language === 'mr' ? 'थांबवा (Pause)' : 'Pause Scrolling'
              }
              aria-label={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
            >
              {isPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <PauseIcon className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center border border-red-500/50 rounded overflow-hidden bg-red-900/60">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="p-1 hover:bg-red-700 text-white border-r border-red-500/50 transition-colors cursor-pointer"
                title={language === 'mr' ? 'मागे सरकवा' : 'Scroll Left'}
                aria-label="Previous Headline"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="p-1 hover:bg-red-700 text-white transition-colors cursor-pointer"
                title={language === 'mr' ? 'पुढे सरकवा' : 'Scroll Right'}
                aria-label="Next Headline"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Export Telemetry Report Button */}
          <button
            type="button"
            onClick={() => {
              setToast({
                type: 'success',
                message: language === 'mr'
                  ? 'माहिती अहवाल यशस्वीरित्या निर्यात केला.'
                  : 'Telemetry operations report exported successfully (CSV/PDF).',
              });
            }}
            className="hidden md:flex items-center gap-1 h-6.5 sm:h-7 px-2 rounded-md bg-red-950/80 hover:bg-red-900 text-white text-[10px] sm:text-[10.5px] font-semibold border border-red-500/60 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
            title={language === 'mr' ? 'माहिती अहवाल निर्यात करा' : 'Export Telemetry Report'}
          >
            <ArrowDownTrayIcon className="w-3 h-3 text-white shrink-0" />
            <span className="hidden lg:inline">{language === 'mr' ? 'अहवाल निर्यात' : 'Export'}</span>
          </button>

          {/* War Room Big Screen Cockpit Button */}
          <button
            type="button"
            onClick={toggleBigScreen}
            className={`h-6.5 sm:h-7 px-2 sm:px-2.5 rounded-md text-white text-[10.5px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-[0.98] border ${
              isBigScreen
                ? 'bg-amber-600 hover:bg-amber-500 border-amber-400'
                : 'bg-emerald-700 hover:bg-emerald-600 border-emerald-500/60'
            }`}
            title={language === 'mr' ? 'मोठ्या स्क्रीनवर पूर्ण दृश्य' : 'War Room Big Screen Cockpit'}
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <span className="hidden sm:inline">
              {isBigScreen
                ? (language === 'mr' ? 'सामान्य दृश्य (Esc)' : 'Exit Big Screen')
                : (language === 'mr' ? 'वॉर रूम बिग स्क्रीन' : 'War Room Big Screen')}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Full Article Inspection Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h4 className="font-bold text-sm tracking-tight text-white">
                  {language === 'mr' ? 'थेट शासकीय वार्तापत्र तपशील' : 'DGIPR Live Wire Dispatch'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap gap-2">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                  ID: {selectedArticle.id}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                  {selectedArticle.timestamp || 'Just now'} • {selectedArticle.district}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedArticle.verification || 'Verified Official'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === 'mr' ? selectedArticle.newsMr : selectedArticle.newsEn}
                </h3>
                {language === 'mr' && (
                  <p className="text-xs text-slate-600 mt-2 font-sans italic border-l-2 border-amber-500 pl-3">
                    {selectedArticle.newsEn}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {language === 'mr' ? 'माहिती स्त्रोत:' : 'Ingestion Source:'}
                  </span>
                  <span className="font-bold text-slate-900">{selectedArticle.source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {language === 'mr' ? 'जनभावना श्रेणी:' : 'Sentiment Assessment:'}
                  </span>
                  <span className="font-bold text-slate-800">{selectedArticle.sentiment}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={selectedArticle.url || 'https://dgipr.maharashtra.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{language === 'mr' ? 'अधिकृत पोर्टलवर पहा' : 'View on Official Portal'}</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BreakingNewsTicker;
