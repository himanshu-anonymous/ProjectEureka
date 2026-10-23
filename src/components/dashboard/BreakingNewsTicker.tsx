'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

export const BreakingNewsTicker: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<typeof INITIAL_QUEUE_ITEMS[0] | null>(null);

  // Filter items by district if selected, sorted with latest items first
  const rawItems = useMemo(() => {
    let list = INITIAL_QUEUE_ITEMS;
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const filtered = list.filter(
        (item) => item.district.toLowerCase() === selectedDistrictId.toLowerCase()
      );
      if (filtered.length > 0) list = filtered;
    }
    // Return latest first
    return [...list];
  }, [selectedDistrictId]);

  // Double items for continuous smooth 360 loop without jitter
  const marqueeItems = useMemo(() => {
    return [...rawItems, ...rawItems];
  }, [rawItems]);

  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    const el = document.getElementById('continuous-news-ticker-container');
    if (el) {
      el.scrollBy({ left: direction === 'right' ? 300 : -300, behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <div
        className="w-full h-11 bg-red-600 text-white rounded-xl px-4 py-2 flex items-center justify-between gap-3 shadow-md border border-red-700 overflow-hidden select-none relative"
        role="region"
        aria-label={language === 'mr' ? 'थेट वृत्त टिकर' : 'Breaking News Ticker'}
      >
        {/* 1. Left: White Pill Badge with Pulsing Red Dot & LIVE Indicator */}
        <div className="shrink-0 z-20 flex items-center gap-2 bg-white text-red-600 font-extrabold text-[11px] px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0 ring-2 ring-red-200" />
          <span className="font-black">{language === 'mr' ? 'थेट घडामोड' : 'BREAKING NEWS'}</span>
          <span className="hidden sm:inline-block w-px h-3 bg-red-200" />
          <span className="hidden sm:inline-flex items-center text-[9px] font-bold text-red-500 uppercase tracking-widest">
            LIVE WIRE
          </span>
        </div>

        {/* 2. Center: Continuous Infinite Marquee Scroll with Rich Detailed Headlines */}
        <div
          id="continuous-news-ticker-container"
          className="flex-1 min-w-0 overflow-hidden relative h-full flex items-center mask-gradient"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`animate-marquee-scroll items-center gap-8 text-xs font-medium cursor-pointer ${
              isPaused ? '[animation-play-state:paused]' : ''
            }`}
          >
            {marqueeItems.map((item, idx) => {
              const localizedDistrict = getDistrictName(item.district, language);
              const headline = language === 'mr' ? item.newsMr : item.newsEn;
              const isCritical = item.sentiment === 'Critical' || item.scoreLevel === 'Critical';

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => setSelectedArticle(item)}
                  className="inline-flex items-center gap-2.5 shrink-0 group hover:bg-red-700/80 px-2 py-0.5 rounded transition-all duration-150"
                  title={language === 'mr' ? 'तपशील पाहण्यासाठी क्लिक करा' : 'Click to inspect detailed dispatch'}
                >
                  {/* Urgency Badge */}
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0 ${
                      isCritical
                        ? 'bg-amber-300 text-slate-900 animate-pulse'
                        : 'bg-red-800 text-red-100 border border-red-500/60'
                    }`}
                  >
                    {isCritical
                      ? language === 'mr' ? 'तातडीचे' : 'URGENT'
                      : language === 'mr' ? 'अधिकृत' : 'OFFICIAL'}
                  </span>

                  {/* District / Source Pill */}
                  <span className="font-bold text-[10px] bg-red-900/90 text-red-100 px-1.5 py-0.5 rounded font-mono shrink-0 border border-red-400/40">
                    {localizedDistrict} • {item.sourceShort || item.source}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[10px] text-red-200 shrink-0 font-mono">
                    {item.timestamp || '2m ago'}
                  </span>

                  {/* Headline */}
                  <span className="text-white text-xs font-semibold group-hover:underline underline-offset-2 tracking-tight line-clamp-1 max-w-[340px] md:max-w-[460px]">
                    {headline}
                  </span>

                  {/* Arrow Icon */}
                  <ArrowTopRightOnSquareIcon className="w-3 h-3 text-red-200 group-hover:text-white shrink-0 opacity-70 group-hover:opacity-100" />

                  {/* Separator Bullet */}
                  <span className="text-red-300/80 font-black ml-3 text-sm">◆</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Right: Interactive Play/Pause & Scroll Navigation Controls */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 text-white/95 text-xs bg-red-700/80 px-2 py-1 rounded-lg border border-red-500/80 shadow-xs">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-red-800 hover:text-white text-white focus-visible:outline-none transition-colors cursor-pointer"
            title={
              isPaused
                ? language === 'mr' ? 'सुरू करा' : 'Resume Scrolling'
                : language === 'mr' ? 'थांबवा' : 'Pause Scrolling'
            }
            aria-label={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
          >
            {isPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <PauseIcon className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center border border-red-500/80 rounded overflow-hidden bg-red-800/80">
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1 hover:bg-red-900 text-white border-r border-red-500/80 transition-colors cursor-pointer"
              title={language === 'mr' ? 'मागे सरकवा' : 'Scroll Left'}
              aria-label="Previous Headline"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1 hover:bg-red-900 text-white transition-colors cursor-pointer"
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
            <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <h4 className="font-bold text-sm tracking-tight">
                  {language === 'mr' ? 'थेट शासकीय वार्तापत्र तपशील' : 'DGIPR Live Wire Dispatch'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
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
                  <p className="text-xs text-slate-600 mt-2 font-sans italic border-l-2 border-red-500 pl-3">
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
                  href={selectedArticle.url || 'https://dgipR.maharashtra.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
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
