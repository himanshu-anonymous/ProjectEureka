'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TOP_KPI_DATA,
  RECENT_PRESS_RELEASES,
  TODAYS_MEDIA_CLIPPINGS,
  LOVABLE_DISTRICTS,
  CRISIS_CASE_SUMMARY,
  SOCIAL_MEDIA_PLATFORMS,
  SOCIAL_ENGAGEMENT_7DAYS,
  BREAKING_NEWS_TICKER_ITEMS,
  BAND_COLORS,
  getBandFromScore,
  type DistrictMetricData,
} from '@/data/lovableDashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentTextIcon,
  NewspaperIcon,
  FaceSmileIcon,
  ClockIcon,
  MegaphoneIcon,
  PlayIcon,
  PauseIcon,
  SignalIcon,
  BuildingOffice2Icon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ShareIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  HomeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

/* ========================================================================== */
/* 1. TOP 5 EXECUTIVE KPI CARDS                                               */
/* ========================================================================== */
export const LovableTopKPIRibbon: React.FC = () => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'pr':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'mp':
        return <NewspaperIcon className="w-6 h-6" />;
      case 'ns':
        return <FaceSmileIcon className="w-6 h-6" />;
      case 'tat':
        return <ClockIcon className="w-6 h-6" />;
      case 'fe':
        return <MegaphoneIcon className="w-6 h-6" />;
      default:
        return <DocumentTextIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {TOP_KPI_DATA.map((kpi) => {
        const isPositive = kpi.goodWhenDown ? kpi.change < 0 : kpi.change > 0;
        return (
          <div key={kpi.key} className="panel flex items-center gap-3 p-3 transition-all hover:shadow-md">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                kpi.key === 'ns'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : kpi.key === 'tat'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : 'bg-primary-soft text-primary border border-blue-100'
              }`}
            >
              {getIcon(kpi.key)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-700">
                {kpi.label} {kpi.sub && <span className="text-muted-foreground font-normal">{kpi.sub}</span>}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold tabular-nums text-slate-900 tracking-tight">{kpi.value}</span>
                <span
                  className={`flex items-center text-xs font-semibold ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {kpi.change > 0 ? (
                    <ArrowUpIcon className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                  )}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ========================================================================== */
/* 2. RECENT PRESS RELEASES PANEL                                            */
/* ========================================================================== */
export const LovableRecentPressReleases: React.FC<{ limit?: number }> = ({ limit = 3 }) => {
  const items = RECENT_PRESS_RELEASES.slice(0, limit);

  return (
    <div className="panel p-3 flex flex-col justify-between h-full">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <DocumentTextIcon className="w-4 h-4 text-primary" />
            Recent Press Releases
          </h2>
          <Link
            href="/press-releases"
            className="text-xs font-medium text-primary hover:underline hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
            >
              <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary border border-blue-100">
                <DocumentTextIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-semibold text-slate-800 leading-snug">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {item.district} · {item.time}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'Scheduled'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 3. MEDIA CLIPPINGS (TODAY) PANEL                                           */
/* ========================================================================== */
export const LovableMediaClippings: React.FC<{ limit?: number }> = ({ limit = 3 }) => {
  const items = TODAYS_MEDIA_CLIPPINGS.slice(0, limit);

  return (
    <div className="panel p-3 flex flex-col justify-between h-full">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <NewspaperIcon className="w-4 h-4 text-primary" />
            Media Clippings (Today)
          </h2>
          <Link
            href="/newspaper"
            className="text-xs font-medium text-primary hover:underline hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
            >
              <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-slate-600">
                <NewspaperIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-bold text-slate-800" lang="mr">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-medium text-slate-600">
                    {item.source} · {item.date}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.sentiment === 'Positive'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.sentiment === 'Neutral'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 4. DISTRICT PERFORMANCE RANKING TABLE                                      */
/* ========================================================================== */
export const LovableDistrictRanking: React.FC<{ full?: boolean }> = ({ full = false }) => {
  const topFive = LOVABLE_DISTRICTS.slice(0, 5);
  const bottomThree = LOVABLE_DISTRICTS.slice(-3);

  const list = full ? LOVABLE_DISTRICTS : [...topFive];

  return (
    <div className="panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <ChartBarIcon className="w-4 h-4 text-primary" />
          District Performance Ranking
        </h2>
        {!full && (
          <Link
            href="/districts"
            className="text-xs font-medium text-primary hover:underline hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-muted-foreground border-b border-border text-[11px]">
            <tr>
              <th className="text-left font-semibold py-1.5 w-8">#</th>
              <th className="text-left font-semibold py-1.5">District</th>
              <th className="text-left font-semibold py-1.5 w-2/5">Index</th>
              <th className="text-right font-semibold py-1.5 w-10">Score</th>
              <th className="text-right font-semibold py-1.5 w-12">Trend</th>
            </tr>
          </thead>
          <tbody className="tabular-nums divide-y divide-slate-100">
            {list.map((d, index) => {
              const rank = index + 1;
              const color = BAND_COLORS[getBandFromScore(d.performance)];
              const isUp = d.trend > 0;
              return (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-1.5 text-slate-500 font-medium">{rank}</td>
                  <td className="py-1.5 font-bold text-slate-800">
                    {d.name} <span className="text-[10px] text-slate-400 font-normal">({d.nameMr})</span>
                  </td>
                  <td className="py-1.5 pr-2">
                    <div className="h-2.5 w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200/60">
                      <div
                        className="h-full rounded-sm transition-all duration-500"
                        style={{ width: `${d.performance}%`, backgroundColor: color }}
                      />
                    </div>
                  </td>
                  <td className="py-1.5 text-right font-bold text-slate-900">{d.performance}</td>
                  <td
                    className={`py-1.5 text-right font-semibold ${
                      isUp ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isUp ? `↑ ${d.trend}` : `↓ ${Math.abs(d.trend)}`}
                  </td>
                </tr>
              );
            })}

            {!full && (
              <>
                <tr>
                  <td colSpan={5} className="py-1 text-center text-slate-400 text-[10px]">
                    •••
                  </td>
                </tr>
                {bottomThree.map((d, i) => {
                  const rank = 36 - 2 + i;
                  const color = BAND_COLORS[getBandFromScore(d.performance)];
                  const isUp = d.trend > 0;
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-1.5 text-slate-500 font-medium">{rank}</td>
                      <td className="py-1.5 font-bold text-slate-800">
                        {d.name} <span className="text-[10px] text-slate-400 font-normal">({d.nameMr})</span>
                      </td>
                      <td className="py-1.5 pr-2">
                        <div className="h-2.5 w-full bg-slate-100 rounded-sm overflow-hidden border border-slate-200/60">
                          <div
                            className="h-full rounded-sm"
                            style={{ width: `${d.performance}%`, backgroundColor: color }}
                          />
                        </div>
                      </td>
                      <td className="py-1.5 text-right font-bold text-slate-900">{d.performance}</td>
                      <td
                        className={`py-1.5 text-right font-semibold ${
                          isUp ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isUp ? `↑ ${d.trend}` : `↓ ${Math.abs(d.trend)}`}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 5. SENTIMENT ANALYSIS (DISTRICT-WISE)                                      */
/* ========================================================================== */
export const LovableSentimentAnalysis: React.FC = () => {
  const [metricChoice, setMetricChoice] = useState<'net' | 'placement'>('net');

  // Display sample top/representative districts
  const sampleDistricts = LOVABLE_DISTRICTS.slice(0, 8);

  return (
    <div className="panel p-3 flex flex-col justify-between">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Sentiment Analysis (District-wise)</h2>
          <select
            value={metricChoice}
            onChange={(e) => setMetricChoice(e.target.value as 'net' | 'placement')}
            className="rounded border border-border bg-card px-2 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer"
            aria-label="Sentiment metric"
          >
            <option value="net">Net Sentiment</option>
            <option value="placement">Placement %</option>
          </select>
        </div>

        {/* Visual Bar Distribution Chart */}
        <div className="space-y-2 mt-3">
          {sampleDistricts.map((d) => {
            const val = metricChoice === 'net' ? d.sentiment : d.placementPct;
            const isNet = metricChoice === 'net';
            const widthPct = isNet ? Math.min(100, Math.max(10, Math.abs(val) * 1.5)) : val;

            return (
              <div key={d.id} className="flex items-center gap-2 text-xs">
                <span className="w-16 truncate font-medium text-slate-700 text-[11px]">{d.name}</span>
                <div className="flex-1 h-3.5 bg-slate-100 rounded overflow-hidden flex items-center px-1 border border-slate-200/50">
                  <div
                    className={`h-2 rounded-xs transition-all duration-300 ${
                      isNet
                        ? val >= 20
                          ? 'bg-emerald-500'
                          : val >= 0
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span
                  className={`w-12 text-right tabular-nums font-bold text-[11px] ${
                    isNet && val > 0 ? 'text-emerald-600' : isNet && val < 0 ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {isNet ? (val > 0 ? `+${val}%` : `${val}%`) : `${val}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Target benchmark: &gt; 65% favorable</span>
        <span className="text-emerald-600 font-semibold">State Net: +72%</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 6. CRISIS / RUMOR TRACKING                                                 */
/* ========================================================================== */
export const LovableCrisisRumorTracking: React.FC = () => {
  return (
    <div className="panel p-3 flex flex-col justify-between">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheckIcon className="w-4 h-4 text-rose-600" />
            Crisis / Rumor Tracking
          </h2>
          <Link
            href="/fact-check"
            className="text-xs font-medium text-primary hover:underline hover:text-blue-700 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="flex items-center gap-4 py-2">
          {/* Donut Chart representation */}
          <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
              />
              {/* Segments: High Priority (42%), Under Verification (25%), Rebuttal (16%), Closed (17%) */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E94B4B"
                strokeWidth="4.2"
                strokeDasharray="42, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F2994A"
                strokeWidth="4.2"
                strokeDasharray="25, 100"
                strokeDashoffset="-42"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F2C94C"
                strokeWidth="4.2"
                strokeDasharray="16, 100"
                strokeDashoffset="-67"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#20A765"
                strokeWidth="4.2"
                strokeDasharray="17, 100"
                strokeDashoffset="-83"
              />
            </svg>

            {/* Inner metric badge */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tabular-nums text-slate-900">12</span>
              <span className="text-[9px] font-medium text-muted-foreground uppercase">Active Cases</span>
            </div>
          </div>

          {/* Breakdown legend */}
          <ul className="space-y-2 text-xs flex-1">
            {CRISIS_CASE_SUMMARY.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground text-[11px]">{item.label}</span>
                </span>
                <span className="font-bold tabular-nums text-slate-900">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span>90-min SLA Compliance</span>
        <span className="text-emerald-600 font-semibold">94.2% on target</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 7. SOCIAL MEDIA ENGAGEMENT                                                 */
/* ========================================================================== */
export const LovableSocialMediaEngagement: React.FC = () => {
  return (
    <div className="panel p-3 flex flex-col justify-between">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Social Media Engagement</h2>
          <span className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Last 7 Days
          </span>
        </div>

        {/* 4 Mini Cards for X, FB, IG, YT */}
        <div className="grid grid-cols-4 gap-1.5">
          {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
            <div
              key={platform.key}
              className="rounded-md border border-border bg-slate-50/70 p-1.5 text-center hover:bg-slate-100 transition-colors"
            >
              <div className="truncate text-[10px] text-muted-foreground font-medium">{platform.name}</div>
              <div className="text-sm font-bold tabular-nums text-slate-900">{platform.value}</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center">
                ↑ {platform.change}%
              </div>
            </div>
          ))}
        </div>

        {/* 7-Day Trend Chart Preview */}
        <div className="mt-3 h-24 w-full flex items-end gap-1.5 pt-2 pb-1 px-1 bg-slate-50/50 rounded-md border border-slate-100">
          {SOCIAL_ENGAGEMENT_7DAYS.map((day) => {
            const total = day.x + day.fb + day.ig + day.yt;
            const heightPct = Math.min(100, Math.round((total / 65000) * 100));
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div
                  className="w-full bg-primary hover:bg-blue-600 rounded-t-xs transition-all duration-300 relative"
                  style={{ height: `${heightPct}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] px-1 py-0.5 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                    {(total / 1000).toFixed(1)}k
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{day.day.replace(' Oct', '')}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Total Reach: 1.48M Citizens</span>
        <span className="text-emerald-600 font-semibold">+18.5% WoW</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* 8. BREAKING NEWS TICKER                                                    */
/* ========================================================================== */
export const LovableBreakingTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...BREAKING_NEWS_TICKER_ITEMS, ...BREAKING_NEWS_TICKER_ITEMS];

  return (
    <div className="flex h-8 items-center gap-3 border-b border-border bg-white px-3 text-xs shadow-2xs">
      <span className="flex shrink-0 items-center gap-1.5 rounded bg-rose-600 px-2 py-0.5 font-bold text-white text-[11px] shadow-xs">
        <SignalIcon className="w-3.5 h-3.5 animate-pulse" />
        BREAKING
      </span>

      <div className="group relative flex-1 overflow-hidden" aria-live="off">
        <div
          className="flex w-max gap-10 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]"
          style={{ animationPlayState: isPaused ? 'paused' : undefined }}
        >
          {items.map((bulletin, idx) => (
            <span key={idx} className="text-slate-800 font-medium">
              <span className="mr-2 text-rose-600 font-bold">●</span>
              {bulletin}
              <span className="ml-2 rounded bg-slate-100 px-1 text-[9px] font-semibold text-slate-500 border border-slate-200">
                LIVE
              </span>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsPaused(!isPaused)}
        className="flex shrink-0 items-center gap-1 rounded border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
        aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
      >
        {isPaused ? <PlayIcon className="w-3 h-3" /> : <PauseIcon className="w-3 h-3" />}
        <span>{isPaused ? 'Resume' : 'Pause'}</span>
      </button>
    </div>
  );
};

/* ========================================================================== */
/* 9. TOP APPLICATION HEADER                                                  */
/* ========================================================================== */
export const LovableHeader: React.FC<{ onToggleMobileNav?: () => void }> = ({ onToggleMobileNav }) => {
  const pathname = usePathname();
  const [clockString, setClockString] = useState<string>('--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockString(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Media Coverage', href: '/newspaper' },
    { label: 'Social Media', href: '/media-intelligence' },
    { label: 'Fact-Check', href: '/fact-check' },
    { label: 'Field Publicity', href: '/activities' },
    { label: 'Reports', href: '/reports' },
    { label: 'Admin', href: '/settings' },
  ];

  return (
    <header className="flex items-center gap-4 border-b border-border bg-white px-4 py-2 shadow-xs z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleMobileNav}
        className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-700 cursor-pointer"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Brand & Emblem */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary border border-blue-200 shadow-2xs">
          <BuildingOffice2Icon className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Maharashtra
          </div>
          <div className="text-base font-extrabold tracking-tight text-slate-900">
            Maha-Command Center
          </div>
          <div className="hidden text-[10px] text-slate-500 font-medium sm:block">
            DGIPR Live Dashboard · All DIO Operations & Performance
          </div>
        </div>
      </Link>

      {/* Desktop Horizontal Nav Links */}
      <div className="mx-auto hidden items-stretch gap-1 xl:flex">
        {navLinks.map((tab) => {
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                isActive
                  ? 'border-b-2 border-primary bg-primary-soft text-primary'
                  : 'text-muted-foreground hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right Telemetry Controls */}
      <div className="ml-auto flex items-center gap-3 text-xs xl:ml-0">
        {/* Live IST Clock */}
        <span className="hidden items-center gap-1.5 text-slate-600 font-mono font-medium md:flex bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tabular-nums text-xs">{clockString}</span>
        </span>

        {/* LIVE Status Badge */}
        <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold text-emerald-700 text-[11px] shadow-2xs">
          ● LIVE
        </span>

        {/* Notifications Bell */}
        <button
          className="relative p-1.5 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
          aria-label="Notifications, 3 unread"
        >
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-xs">
            3
          </span>
        </button>

        {/* User Profile Avatar */}
        <button
          className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          aria-label="User menu"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft font-bold text-xs text-primary border border-blue-200">
            RK
          </span>
          <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* 36 DIO Offices Counter */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-slate-50/80 px-2.5 py-1 2xl:flex shadow-2xs">
          <BuildingOffice2Icon className="w-4 h-4 text-primary" />
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-primary tabular-nums">36</div>
            <div className="text-[9px] font-medium text-slate-500">District Offices</div>
          </div>
        </div>
      </div>
    </header>
  );
};

/* ========================================================================== */
/* 10. COLLAPSIBLE SIDEBAR                                                    */
/* ========================================================================== */
export const LovableSidebar: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}> = ({ isOpen = false, onClose, collapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();

  const links = [
    { title: 'Overview', href: '/', icon: HomeIcon },
    { title: 'District Performance', href: '/districts', icon: ChartBarIcon },
    { title: 'Press Releases', href: '/press-releases', icon: DocumentTextIcon },
    { title: 'Media Clippings', href: '/newspaper', icon: NewspaperIcon },
    { title: 'Social Media', href: '/media-intelligence', icon: ShareIcon },
    { title: 'Fact Check / Crisis', href: '/fact-check', icon: ShieldCheckIcon },
    { title: 'Field Publicity (IEC)', href: '/activities', icon: MegaphoneIcon },
    { title: 'Reports & Analytics', href: '/reports', icon: ClipboardDocumentListIcon },
    { title: 'Alerts', href: '/notifications', icon: ExclamationTriangleIcon },
    { title: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-2">
      <nav className="flex flex-col gap-1" aria-label="Main navigation">
        {links.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={item.title}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary-soft text-primary font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={onToggleCollapse}
        className="mt-auto hidden lg:flex items-center gap-2 p-2.5 text-xs text-muted-foreground hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRightIcon className="w-4 h-4" />
        ) : (
          <>
            <ChevronLeftIcon className="w-4 h-4" />
            <span>Collapse sidebar</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`sticky top-0 hidden h-[calc(100vh-80px)] shrink-0 flex-col border-r border-border bg-white lg:flex transition-all duration-200 ${
          collapsed ? 'w-14' : 'w-52'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" onClick={onClose}>
          <div
            className="w-64 bg-white shadow-2xl h-full border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">Navigation</span>
              <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
          <div className="flex-1 bg-slate-900/30 backdrop-blur-xs" />
        </div>
      )}
    </>
  );
};
