'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NewsQueueItem } from '@/types/dashboard';
import { INITIAL_QUEUE_ITEMS, generateRandomQueueItem } from '@/data/newsQueueData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName, getLocalizedChannel } from '@/lib/dataLocalization';

export const LiveNewsQueue: React.FC = () => {
  const { language } = useDashboardStore();
  // By default, the collapse menu is collapsed
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [queueItems, setQueueItems] = useState<NewsQueueItem[]>(INITIAL_QUEUE_ITEMS);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastAddedId, setLastAddedId] = useState<string>('NQ-8406');

  // Automated variable timing loop simulation (2s to 5s interval)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let counter = 7;

    const scheduleNextIngestion = () => {
      // Variable timing between 2000ms and 5000ms (2s to 5s)
      const randomDelay = Math.floor(Math.random() * 3000) + 2000;

      timeoutId = setTimeout(() => {
        const newItem = generateRandomQueueItem(counter++);
        setLastAddedId(newItem.id);
        // Cells get added from bottom
        setQueueItems((prev) => [...prev, newItem]);
        scheduleNextIngestion();
      }, randomDelay);
    };

    scheduleNextIngestion();
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-scroll to bottom as new items are added from bottom
  useEffect(() => {
    if (!isCollapsed && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [queueItems.length, isCollapsed]);

  // Color helpers
  const getSentimentBadge = (sentiment: NewsQueueItem['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {language === 'mr' ? 'सकारात्मक' : 'Positive'}
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></span>
            {language === 'mr' ? 'गंभीर' : 'Critical'}
          </span>
        );
      case 'Negative':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {language === 'mr' ? 'नकारात्मक' : 'Negative'}
          </span>
        );
      case 'Neutral':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {language === 'mr' ? 'तटस्थ' : 'Neutral'}
          </span>
        );
    }
  };

  const getVerificationBadge = (verification: NewsQueueItem['verification']) => {
    switch (verification) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
            <span>{language === 'mr' ? 'प्रमाणित' : 'Verified'}</span>
          </span>
        );
      case 'Fact-Check Passed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-300">
            <MaterialIcon name="verified_user" size="xs" className="text-blue-600" />
            <span>{language === 'mr' ? 'तपासणी पूर्ण' : 'Fact-Checked'}</span>
          </span>
        );
      case 'Flagged Misinfo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-300 animate-pulse">
            <MaterialIcon name="warning" size="xs" className="text-rose-600" />
            <span>{language === 'mr' ? 'अफवा / खंडन' : 'Flagged Misinfo'}</span>
          </span>
        );
      case 'Under Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <MaterialIcon name="schedule" size="xs" className="text-amber-600" />
            <span>{language === 'mr' ? 'पडताळणी सुरू' : 'Under Review'}</span>
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

  const latestItem = queueItems[queueItems.length - 1];

  return (
    <div className="bg-surface rounded-lg border border-borderLine-standard shadow-xs overflow-hidden transition-all duration-200">
      {/* 
        HEADER / CONTROLS BAR:
        Contains status, queue metrics, and the collapse arrow button
      */}
      <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <MaterialIcon name="sync" size="sm" spin />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold tracking-tight text-white">
                {language === 'mr'
                  ? 'थेट बातमी अंतर्ग्रहण व रांग प्रणाली'
                  : 'Live News Ingestion Queue Pipeline'}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{language === 'mr' ? '२-५ से. स्वयंचलित चक्र' : '2s–5s VARIABLE LOOP'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {language === 'mr'
                ? '५ प्रायोगिक जिल्ह्यांसाठी थेट वृत्त प्रवाह, पडताळणी व विश्वासार्हता विश्लेषण'
                : 'Automated telemetry ingestion & source credibility scoring across active pilot districts'}
            </p>
          </div>
        </div>

        {/* Right Section: Telemetry counter + Arrow Collapse Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 text-xs">
            <span className="text-slate-400">{language === 'mr' ? 'एकूण समाविष्ट:' : 'Total Ingested:'}</span>
            <span className="font-mono font-bold text-amber-400">{queueItems.length}</span>
          </div>

          {/* Arrow Collapse / Expand Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors cursor-pointer text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
            aria-label={isCollapsed ? 'Expand news queue table' : 'Collapse news queue table'}
            title={isCollapsed ? 'Expand news queue' : 'Collapse news queue'}
          >
            <span className="hidden md:inline text-[11px]">
              {isCollapsed
                ? language === 'mr'
                  ? 'रांग उघडा'
                  : 'Expand Queue'
                : language === 'mr'
                ? 'रांग बंद करा'
                : 'Collapse Queue'}
            </span>
            <MaterialIcon
              name={isCollapsed ? 'expand_more' : 'expand_less'}
              size="sm"
              className="text-amber-400"
            />
          </button>
        </div>
      </div>

      {/* 
        WHEN COLLAPSED:
        Sleek one-line preview ticker showing the latest item arriving at bottom
      */}
      {isCollapsed && latestItem && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {language === 'mr' ? 'नवीनतम:' : 'LATEST:'} {latestItem.id}
            </span>
            <span className="font-semibold text-gov-primary">{getLocalizedChannel(latestItem.sourceShort, language)}:</span>
            <span className="truncate text-slate-600">
              {language === 'mr' ? latestItem.newsMr : latestItem.newsEn}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-3">
            <span className="text-[11px] font-mono text-slate-500">{latestItem.timestamp}</span>
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-amber-700 hover:text-amber-800 font-semibold text-[11px] underline cursor-pointer"
            >
              {language === 'mr' ? 'तपशील पहा' : 'View Full Queue'}
            </button>
          </div>
        </div>
      )}

      {/* 
        WHEN EXPANDED:
        Fixed 6-row height container with overflow-x-auto and sticky header row
      */}
      {!isCollapsed && (
        <div
          ref={containerRef}
          style={{ height: '330px', maxHeight: '330px' }}
          className="overflow-x-auto overflow-y-auto relative scroll-smooth no-scrollbar"
        >
          <table className="w-full min-w-[1200px] text-left border-collapse">
            {/* Sticky Table Header: Stays fixed when rows scroll */}
            <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 border-b border-slate-300 shadow-2xs select-none">
              <tr className="text-[11px] uppercase tracking-wider font-bold">
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[170px]">
                  {language === 'mr' ? 'स्त्रोत' : 'Source'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[100px]">
                  ID
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 min-w-[340px]">
                  {language === 'mr' ? 'बातम्यांचे मथळे' : 'News Headline'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[120px]">
                  {language === 'mr' ? 'गुणवत्ता स्कोअर' : 'Scoring'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[120px]">
                  {language === 'mr' ? 'सूर' : 'Sentiment'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[150px]">
                  {language === 'mr' ? 'पडताळणी' : 'Verification'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[170px]">
                  {language === 'mr' ? 'विश्वासार्हता स्कोअर' : 'Credibility Score'}
                </th>
                <th scope="col" className="py-2.5 px-3 bg-slate-100 w-[130px]">
                  {language === 'mr' ? 'प्रसार संख्या' : 'Volumes'}
                </th>
              </tr>
            </thead>

            {/* Table Body: 6 rows visible, rows get added from bottom */}
            <tbody className="divide-y divide-slate-200 text-xs text-slate-800 bg-surface">
              {queueItems.map((item, index) => {
                const isNew = item.id === lastAddedId;
                const localizedTier = language === 'mr'
                  ? (item.credibilityTier === 'Tier-1 Accredited'
                    ? 'स्तर-१ अधिकृत'
                    : item.credibilityTier === 'Verified Regional'
                    ? 'प्रमाणित प्रादेशिक'
                    : item.credibilityTier === 'Digital Wire'
                    ? 'डिजिटल वृत्त'
                    : 'लेखापरीक्षण प्रलंबित')
                  : item.credibilityTier;

                return (
                  <tr
                    key={`${item.id}-${index}`}
                    className={`transition-colors duration-300 hover:bg-slate-50 h-[48px] ${
                      isNew ? 'bg-amber-50/70 animate-in fade-in slide-in-from-bottom-2 duration-300' : ''
                    }`}
                  >
                    {/* 1. Source (News Channel) */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="font-semibold text-gov-primary truncate max-w-[130px]">
                          {getLocalizedChannel(item.source, language)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                        {language === 'mr'
                          ? (item.channelType === 'TV' ? 'टीव्ही प्रसारण' : item.channelType === 'Print' ? 'मुद्रित माध्यम' : item.channelType === 'Wire' ? 'वृत्तसंस्था' : 'डिजिटल माध्यम')
                          : `${item.channelType} Broadcast`}
                      </span>
                    </td>

                    {/* 2. ID */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                        {item.id}
                      </span>
                    </td>

                    {/* 3. News (Headline) */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-200 text-slate-700 shrink-0">
                          {getDistrictName(item.district, language)}
                        </span>
                        <p className="font-medium text-slate-900 leading-snug line-clamp-1">
                          {language === 'mr' ? item.newsMr : item.newsEn}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                    </td>

                    {/* 4. Scoring */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded border ${getScoreColor(
                            item.scoring
                          )}`}
                        >
                          {item.scoring}/100
                        </span>
                        <div className="w-10 bg-slate-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${
                              item.scoring >= 90
                                ? 'bg-purple-600'
                                : item.scoring >= 75
                                ? 'bg-rose-500'
                                : item.scoring >= 60
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.scoring}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* 5. Sentiment */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {getSentimentBadge(item.sentiment)}
                    </td>

                    {/* 6. Verification */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      {getVerificationBadge(item.verification)}
                    </td>

                    {/* 7. Source Credibility Score */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {item.credibilityScore}%
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {localizedTier}
                        </span>
                      </div>
                    </td>

                    {/* 8. Volumes */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-slate-900">
                        {item.volumes}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.impressions}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Status Ticker Bar */}
      <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            {language === 'mr'
              ? 'नवीन घटक थेट खाली जोडले जात आहेत'
              : 'Live stream: New items appending at bottom of queue'}
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          {language === 'mr'
            ? 'स्थिर उंची: ६ दृश्य पंक्ती • स्थिर शीर्षलेख सक्रिय'
            : 'Fixed Height: 6 Visible Rows • Sticky Header Active'}
        </div>
      </div>
    </div>
  );
};

export default LiveNewsQueue;
