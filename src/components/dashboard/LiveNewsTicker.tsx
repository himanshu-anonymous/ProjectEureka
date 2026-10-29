'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';
import { TickerItemData } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SampleDataBadge } from '@/components/shared/SampleDataBadge';

export const LiveNewsTicker: React.FC = () => {
  const { language } = useDashboardStore();
  const [items, setItems] = useState<TickerItemData[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Fetch /api/v1/ticker and refresh every 30 seconds
  useEffect(() => {
    let isMounted = true;

    async function fetchTicker() {
      try {
        const res = await fetch('/api/v1/ticker', {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch ticker');
        const data = await res.json();
        if (isMounted) {
          setItems(data.items || []);
          setIsLive(Boolean(data.is_live));
          setError(false);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchTicker();
    const interval = setInterval(fetchTicker, 30000); // 30s refresh

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Duplicate items for continuous infinite marquee loop
  const displayItems = items.length > 0 ? [...items, ...items] : [];

  const getKindBadge = (kind: string) => {
    const k = kind?.toUpperCase();
    if (k === 'ALERT') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          {language === 'mr' ? 'इशारा' : 'ALERT'}
        </span>
      );
    }
    if (k === 'ANNOUNCEMENT') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          {language === 'mr' ? 'घोषणा' : 'NOTICE'}
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
        {language === 'mr' ? 'महत्त्वाचे' : 'NEWS'}
      </span>
    );
  };

  return (
    <div
      className="w-full bg-surface border-b border-borderLine-subtle select-none z-10 text-xs"
      aria-live="off"
    >
      <div className="flex items-center h-10 px-4 gap-3 overflow-hidden">
        {/* Left Sticky Label: LIVE / Sample & Control */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-borderLine-subtle bg-surface z-20">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-600 text-white shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </span>
          ) : (
            <SampleDataBadge size="xs" />
          )}

          <span className="text-[11px] font-bold text-content-primary uppercase tracking-wider hidden sm:inline">
            {language === 'mr' ? 'थेट वार्ता' : 'Ticker'}
          </span>

          {/* Accessible Pause / Play Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume news ticker animation' : 'Pause news ticker animation'}
            title={isPaused ? (language === 'mr' ? 'सुरू करा' : 'Play') : (language === 'mr' ? 'थांबवा' : 'Pause')}
            className="p-1 rounded hover:bg-surface-secondary text-content-muted hover:text-content-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <MaterialIcon name={isPaused ? 'play_arrow' : 'pause'} size="xs" />
          </button>
        </div>

        {/* Center: Horizontally Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative group">
          {loading && (
            <div className="flex items-center gap-3 text-content-muted text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>{language === 'mr' ? 'थेट वार्ता लोड होत आहे...' : 'Loading live news ticker...'}</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 text-content-muted text-xs">
              <MaterialIcon name="error" size="xs" className="text-amber-500" />
              <span>{language === 'mr' ? 'थेट वार्ता सध्या अनुपलब्ध आहे.' : 'Ticker feed temporarily unavailable.'}</span>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-content-muted text-xs italic">
              {language === 'mr' ? 'कोणत्याही सक्रिय सूचना उपलब्ध नाहीत.' : 'No active alert items.'}
            </div>
          )}

          {/* Ticker Items Render */}
          {!loading && !error && items.length > 0 && (
            <div
              className={`flex items-center gap-8 ${
                prefersReducedMotion
                  ? 'overflow-x-auto py-1 scrollbar-none'
                  : `animate-ticker ${isPaused ? 'animate-ticker-paused' : ''} group-hover:animate-ticker-paused group-focus-within:animate-ticker-paused`
              }`}
            >
              {(prefersReducedMotion ? items : displayItems).map((item, idx) => {
                const text = language === 'mr' ? item.text_mr : item.text_en;
                const linkHref = item.link_url || `/sources/clipping/CLIP-MH04-001`;

                return (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={linkHref}
                    className="inline-flex items-center gap-2 shrink-0 group/item hover:underline decoration-borderLine-standard transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1"
                  >
                    {getKindBadge(item.kind)}
                    <span className="text-content-primary font-medium text-xs hover:text-gov-primary transition-colors">
                      {text}
                    </span>
                    <MaterialIcon
                      name="open_in_new"
                      size="xs"
                      className="text-content-muted group-hover/item:text-content-primary shrink-0 opacity-60"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
