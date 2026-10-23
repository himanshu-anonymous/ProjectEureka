'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';
import { getDistrictName } from '@/lib/dataLocalization';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/20/solid';

export const BreakingNewsTicker: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter queue items by selected district if active
  const items = useMemo(() => {
    if (!selectedDistrictId || selectedDistrictId === 'all') {
      return INITIAL_QUEUE_ITEMS;
    }
    const filtered = INITIAL_QUEUE_ITEMS.filter(
      (item) => item.district.toLowerCase() === selectedDistrictId.toLowerCase()
    );
    return filtered.length > 0 ? filtered : INITIAL_QUEUE_ITEMS;
  }, [selectedDistrictId]);

  // Reset index if items change
  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  // Auto-cycle ticker every 6 seconds unless paused
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const currentItem = items[currentIndex] || items[0];

  const getSentimentDotColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-500';
      case 'Critical':
        return 'bg-purple-600 animate-pulse';
      case 'Negative':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const localizedDistrict = getDistrictName(currentItem.district, language);
  const headline = language === 'mr' ? currentItem.newsMr : currentItem.newsEn;

  return (
    <div
      className="w-full h-11 bg-red-600 text-white rounded-xl px-4 py-2 flex items-center justify-between gap-3 shadow-sm border border-red-700 overflow-hidden select-none"
      role="region"
      aria-label={language === 'mr' ? 'थेट वृत्त टिकर' : 'Breaking News Ticker'}
    >
      {/* 1. Left: White Pill Badge with Pulsing Red Dot */}
      <div className="shrink-0 flex items-center gap-1.5 bg-white text-red-600 font-extrabold text-[11px] px-2.5 py-1 rounded uppercase tracking-wider shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
        <span>{language === 'mr' ? 'थेट घडामोड' : 'BREAKING NEWS'}</span>
      </div>

      {/* 2. Center: District Tag + Sliding Headline + Source Attribution in Pure White */}
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap relative flex items-center gap-2">
        <span className="font-bold text-[11px] bg-red-700 text-white px-1.5 py-0.5 rounded border border-red-500/50 shrink-0 font-mono">
          {localizedDistrict}
        </span>

        <p
          key={currentItem.id}
          className="text-white font-medium text-xs sm:text-sm truncate tracking-tight animate-in fade-in slide-in-from-right-4 duration-300"
          title={headline}
        >
          {headline}
        </p>

        <a
          href={currentItem.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-red-100 hover:text-white underline decoration-red-300 shrink-0 border-l border-red-500/60 pl-2 transition-colors"
        >
          <span className="truncate max-w-[110px]">{currentItem.source}</span>
          <ArrowTopRightOnSquareIcon className="w-3 h-3 shrink-0" />
        </a>
      </div>

      {/* 3. Right: Crisp White Accessibility & Cycling Controls */}
      <div className="shrink-0 flex items-center gap-1.5 text-white/90 text-xs">
        <span className="text-[11px] font-mono font-medium text-white/80 mr-1 hidden md:inline">
          {currentIndex + 1} / {items.length}
        </span>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 rounded hover:bg-red-700 hover:text-white text-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors"
          title={isPaused ? (language === 'mr' ? 'सुरू करा' : 'Resume Ticker') : (language === 'mr' ? 'थांबवा' : 'Pause Ticker')}
          aria-label={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
        >
          {isPaused ? <PlayIcon className="w-3.5 h-3.5" /> : <PauseIcon className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center border border-red-500/80 rounded overflow-hidden bg-red-700/60">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 hover:bg-red-700 hover:text-white text-white/90 border-r border-red-500/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors"
            title={language === 'mr' ? 'मागील वार्ता' : 'Previous Headline'}
            aria-label="Previous Headline"
          >
            <ChevronLeftIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 hover:bg-red-700 hover:text-white text-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors"
            title={language === 'mr' ? 'पुढील वार्ता' : 'Next Headline'}
            aria-label="Next Headline"
          >
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
