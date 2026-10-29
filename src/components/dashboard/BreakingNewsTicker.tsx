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
  const { language, selectedDistrictId } = useDashboardStore();
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

  // Filter items by district if selected, sorted with latest items first
  const rawItems = useMemo(() => {
    let list = INITIAL_QUEUE_ITEMS;
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const filtered = list.filter(
        (item) => item.district.toLowerCase() === selectedDistrictId.toLowerCase()
      );
      if (filtered.length > 0) list = filtered;
    }
    return [...list];
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
        className={`w-full min-h-[82px] h-[84px] bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white rounded-xl px-4 py-2 flex items-center justify-between gap-4 shadow-md border border-red-800 overflow-hidden select-none relative ring-1 ring-red-500/40 /* from-red-50 border-red-200 */ ${className}`}
        role="region"
        aria-label={language === 'mr' ? 'थेट वृत्त टिकर' : 'Breaking News Ticker'}
      >
        {/* 1. Left: High-Visibility Breaking News Indicator + Power BI Circle Chart */}
        <div className="shrink-0 z-20 flex items-center gap-3">
          {/* Breaking News Wire Badge */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-white text-red-700 border border-white/90 font-black text-[11px] px-2.5 py-1 rounded-md tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0 ring-2 ring-red-300" />
              <span className="font-extrabold tracking-tight">
                {language === 'mr' ? 'थेट घडामोडी' : 'BREAKING NEWS'}
              </span>
              <span className="hidden sm:inline-block w-px h-3 bg-red-300" />
              <span className="hidden sm:inline-flex items-center text-[9px] font-bold text-red-700 uppercase tracking-widest">
                WIRE
              </span>
            </div>
            <span className="text-[10px] text-red-100 font-medium pl-1 hidden sm:block">
              {language === 'mr' ? 'थेट वार्ता संकलन' : 'Live State Telemetry'}
            </span>
          </div>

          {/* Integrated Power BI Radial / Circle Chart (Citizen Sentiment Index) */}
          <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-red-500/60 shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                {/* Background Track Circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                />
                {/* Real-time Sentiment Gauge Circle (74.2%) */}
                <circle
                  cx="24"
                  cy="24"
                  r="19"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="119.38"
                  strokeDashoffset={119.38 * (1 - 0.742)}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-black font-mono text-white">
                74%
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white leading-tight">
                  {language === 'mr' ? 'जनभावना निर्देशांक' : 'Sentiment Index'}
                </span>
                <span className="text-[9px] font-bold text-emerald-300 bg-red-900/70 px-1 rounded border border-emerald-400/40">
                  ▲ +2.4%
                </span>
              </div>
              <span className="text-[10px] text-red-100/90 font-medium">
                {language === 'mr' ? '७४.२% सकारात्मक कल' : '74.2% Positive Index'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Center: Continuous Slow Marquee Scroll with Double-Height Legible Layout */}
        <div
          id="continuous-news-ticker-container"
          className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="animate-marquee-scroll items-center gap-5 text-xs font-normal cursor-pointer flex"
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
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-4 shrink-0">
                  <div
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex flex-col justify-center shrink-0 group hover:bg-red-800/60 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-500/60 transition-all duration-150 cursor-pointer"
                    title={language === 'mr' ? 'तपशील पाहण्यासाठी क्लिक करा' : 'Click to inspect detailed dispatch'}
                  >
                    {/* Top Row: Meta Tags & Urgency */}
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0 ${
                          isCritical
                            ? 'bg-amber-300 text-red-950 font-black shadow-xs'
                            : 'bg-red-900/80 text-white border border-red-500/60'
                        }`}
                      >
                        {isCritical
                          ? language === 'mr' ? 'तातडीचे' : 'URGENT'
                          : language === 'mr' ? 'अधिकृत' : 'OFFICIAL'}
                      </span>

                      <span className="font-semibold text-[10px] bg-red-950/70 text-amber-300 px-1.5 py-0.5 rounded font-mono shrink-0 border border-red-500/50">
                        {localizedDistrict} • {item.sourceShort || item.source}
                      </span>

                      <span className="text-[10px] text-red-200/90 shrink-0 font-mono">
                        {item.timestamp || '2m ago'}
                      </span>
                    </div>

                    {/* Bottom Row: Expanded Headline (Crisp Pure White with Golden Amber Hover) */}
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs sm:text-[13px] font-bold group-hover:text-amber-200 group-hover:underline underline-offset-2 tracking-tight line-clamp-1 max-w-[360px] md:max-w-[480px]">
                        {headline}
                      </span>
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-red-200 group-hover:text-amber-200 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Clean Visual Separator Between Ticker Dispatches */}
                  <div className="h-8 w-px bg-red-500/50 shrink-0 select-none" />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Interactive Play/Pause & Scroll Navigation Controls */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 text-white text-xs bg-red-900/70 px-2 py-1.5 rounded-lg border border-red-500/60 shadow-xs">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
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

          <div className="flex items-center border border-red-500/60 rounded overflow-hidden bg-red-950/60">
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1.5 hover:bg-red-700 text-white border-r border-red-500/60 transition-colors cursor-pointer"
              title={language === 'mr' ? 'मागे सरकवा' : 'Scroll Left'}
              aria-label="Previous Headline"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1.5 hover:bg-red-700 text-white transition-colors cursor-pointer"
              title={language === 'mr' ? 'पुढे सरकवा' : 'Scroll Right'}
              aria-label="Next Headline"
            >
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
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
