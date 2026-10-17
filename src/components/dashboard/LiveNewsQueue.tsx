'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { NewsQueueItem } from '@/types/dashboard';
import { INITIAL_QUEUE_ITEMS, generateRandomQueueItem } from '@/data/newsQueueData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName, getLocalizedChannel } from '@/lib/dataLocalization';

export const LiveNewsQueue: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeSentimentFilter, setActiveSentimentFilter] = useState<string>('All');
  const [queueItems, setQueueItems] = useState<NewsQueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [counter, setCounter] = useState<number>(7);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastAddedId, setLastAddedId] = useState<string>('NQ-8406');

  // Manual wire simulation (no unrequested background polling interval)
  const handleManualIngest = useCallback(() => {
    const nextItem = generateRandomQueueItem(counter);
    setCounter((prev) => prev + 1);
    setLastAddedId(nextItem.id);
    setQueueItems((prev) => [nextItem, ...prev]);
  }, [counter]);

  // Reactive filtering with zero UI lag (<16ms)
  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      // 1. Sentiment filter
      const matchesSentiment =
        activeSentimentFilter === 'All'
          ? true
          : activeSentimentFilter === 'Critical'
          ? item.sentiment === 'Critical' || item.scoreLevel === 'Critical'
          : item.sentiment === activeSentimentFilter;

      // 2. District filter (when a specific district is selected)
      const matchesDistrict =
        !selectedDistrictId || selectedDistrictId === 'all'
          ? true
          : item.district.toLowerCase() === selectedDistrictId.toLowerCase();

      return matchesSentiment && matchesDistrict;
    });
  }, [queueItems, activeSentimentFilter, selectedDistrictId]);

  // Color helpers
  const getSentimentBadge = (sentiment: NewsQueueItem['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{language === 'mr' ? 'सकारात्मक' : 'Positive'}</span>
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>{language === 'mr' ? 'गंभीर' : 'Critical'}</span>
          </span>
        );
      case 'Negative':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>{language === 'mr' ? 'नकारात्मक' : 'Negative'}</span>
          </span>
        );
      case 'Neutral':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>{language === 'mr' ? 'तटस्थ' : 'Neutral'}</span>
          </span>
        );
    }
  };

  const getVerificationBadge = (verification: NewsQueueItem['verification']) => {
    switch (verification) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
            <span>{language === 'mr' ? 'प्रमाणित' : 'Verified'}</span>
          </span>
        );
      case 'Fact-Check Passed':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-300">
            <MaterialIcon name="verified_user" size="xs" className="text-blue-600" />
            <span>{language === 'mr' ? 'तपासणी पूर्ण' : 'Fact-Checked'}</span>
          </span>
        );
      case 'Flagged Misinfo':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <MaterialIcon name="warning" size="xs" className="text-rose-600" />
            <span>{language === 'mr' ? 'अफवा / खंडन' : 'Flagged Misinfo'}</span>
          </span>
        );
      case 'Under Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <MaterialIcon name="dns" size="xs" className="text-gov-primary" />
            <span>{language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring'}</span>
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-700 bg-purple-50 border-purple-300';
    if (score >= 75) return 'text-rose-700 bg-rose-50 border-rose-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-emerald-700 bg-emerald-50 border-emerald-300';
  };

  const latestItem = filteredQueue[0] || queueItems[0];

  return (
    <div className="bg-surface rounded-lg border border-slate-200 shadow-xs overflow-hidden transition-all duration-200 flex flex-col h-full">
      {/* 
        HEADER / CONTROLS BAR:
        Contains status, queue metrics, manual simulation trigger, and collapse toggle
      */}
      <div className="px-3.5 py-2.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <MaterialIcon name="sync" size="xs" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                {language === 'mr'
                  ? 'थेट माध्यम व वृत्त अंतर्ग्रहण'
                  : 'Live Media & News Ingestion'}
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>{language === 'mr' ? 'थेट दूरमिती समक्रमित' : 'Pipeline Synced'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Ingest Wire Button + Collapse Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleManualIngest}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-colors text-[11px] font-semibold cursor-pointer shadow-2xs"
            title={language === 'mr' ? 'नवीन थेट वृत्त समाविष्ट करा' : 'Simulate incoming wire wirefeed item'}
          >
            <MaterialIcon name="add" size="xs" />
            <span>{language === 'mr' ? '+ वृत्त जोडा' : '+ Ingest Wire'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer text-[11px] font-semibold"
            aria-label={isCollapsed ? 'Expand news queue' : 'Collapse news queue'}
          >
            <MaterialIcon
              name={isCollapsed ? 'expand_more' : 'expand_less'}
              size="xs"
              className="text-slate-400"
            />
          </button>
        </div>
      </div>

      {/* Sentiment Filter Pills Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Positive', 'Critical', 'Negative', 'Neutral'].map((filter) => {
            const isActive = activeSentimentFilter === filter;
            const filterLabel =
              filter === 'All'
                ? (language === 'mr' ? 'सर्व' : 'All')
                : filter === 'Positive'
                ? (language === 'mr' ? 'सकारात्मक' : 'Positive')
                : filter === 'Critical'
                ? (language === 'mr' ? 'गंभीर' : 'Critical')
                : filter === 'Negative'
                ? (language === 'mr' ? 'नकारात्मक' : 'Negative')
                : (language === 'mr' ? 'तटस्थ' : 'Neutral');

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSentimentFilter(filter)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gov-primary text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filterLabel}
              </button>
            );
          })}
        </div>

        <span className="text-[10px] font-mono text-slate-500">
          {filteredQueue.length} {language === 'mr' ? 'बातम्या' : 'items'}
        </span>
      </div>

      {/* 
        WHEN COLLAPSED:
        Sleek one-line preview ticker showing the latest item
      */}
      {isCollapsed && latestItem && (
        <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {latestItem.id}
            </span>
            <span className="font-semibold text-gov-primary text-[11px] truncate">
              {getLocalizedChannel(latestItem.sourceShort, language)}:
            </span>
            <a
              href={latestItem.url || 'https://dgipr.maharashtra.gov.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-slate-700 hover:text-gov-blue hover:underline text-[11px]"
            >
              {language === 'mr' ? latestItem.newsMr : latestItem.newsEn}
            </a>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gov-blue hover:underline font-semibold text-[10px] shrink-0 ml-2"
          >
            {language === 'mr' ? 'विस्तार करा' : 'Expand'}
          </button>
        </div>
      )}

      {/* 
        EXPANDED HIGH-DENSITY FEED:
        Renders item cards with direct clickable publisher URLs and multi-source coverage badges
      */}
      {!isCollapsed && (
        <div
          ref={containerRef}
          className="overflow-y-auto divide-y divide-slate-100 max-h-[380px] flex-1 bg-white"
        >
          {filteredQueue.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              <MaterialIcon name="newspaper" size="md" className="mx-auto text-slate-400 mb-1" />
              <p>{language === 'mr' ? 'कोणतीही बातमी उपलब्ध नाही' : 'No items matching filter'}</p>
            </div>
          ) : (
            filteredQueue.map((item, index) => {
              const isNew = item.id === lastAddedId;
              const publisherUrl = item.url || 'https://dgipr.maharashtra.gov.in';

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`p-2.5 transition-colors duration-150 hover:bg-slate-50/80 ${
                    isNew ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-[11px]">
                        {getLocalizedChannel(item.source, language)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {getDistrictName(item.district, language)}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {item.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {getSentimentBadge(item.sentiment)}
                      {getVerificationBadge(item.verification)}
                    </div>
                  </div>

                  {/* Clickable Headline with Direct Link */}
                  <a
                    href={publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-800 hover:text-gov-blue hover:underline leading-snug line-clamp-2 inline-flex items-center gap-1 group block"
                    title={language === 'mr' ? 'मूळ स्त्रोत उघडा' : 'Open original publisher wire'}
                  >
                    <span>{language === 'mr' ? item.newsMr : item.newsEn}</span>
                    <MaterialIcon
                      name="north_east"
                      size="xs"
                      className="text-slate-400 group-hover:text-gov-blue shrink-0 w-3 h-3"
                    />
                  </a>

                  {/* Multi-Source Coverage Badges */}
                  <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-slate-500 flex-wrap">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-medium text-slate-400">
                        {language === 'mr' ? 'स्त्रोत:' : 'Sources:'}
                      </span>
                      {item.sources && item.sources.length > 0 ? (
                        item.sources.map((src) => (
                          <a
                            key={src.name}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                          >
                            <span>{language === 'mr' ? (src.nameMr || src.name) : src.name}</span>
                            <MaterialIcon name="north_east" size="xs" className="w-2 h-2 text-slate-400" />
                          </a>
                        ))
                      ) : (
                        <a
                          href={publisherUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        >
                          <span>{item.sourceShort}</span>
                          <MaterialIcon name="north_east" size="xs" className="w-2 h-2 text-slate-400" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[9px] text-slate-400">
                      <span>{item.volumes}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Status Ticker Bar */}
      <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>{language === 'mr' ? 'थेट मुद्रित व डिजिटल प्रवाह' : 'Live Print & Digital Ingestion Active'}</span>
        </span>
        <span className="font-mono text-slate-600 font-semibold">
          {language === 'mr' ? 'अचूकता: ९६%' : 'AI Credibility: 96%'}
        </span>
      </div>
    </div>
  );
};

export default LiveNewsQueue;
