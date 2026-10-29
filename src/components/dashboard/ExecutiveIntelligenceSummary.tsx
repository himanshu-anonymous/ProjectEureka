'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  NewspaperIcon,
  CheckBadgeIcon,
  RadioIcon,
  ShieldExclamationIcon,
  ClockIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { DrawerPayload } from '@/components/shared/ContextualIntelligenceDrawer';

interface ExecutiveIntelligenceSummaryProps {
  onInspectKPI?: (payload: DrawerPayload) => void;
}

export const ExecutiveIntelligenceSummary: React.FC<ExecutiveIntelligenceSummaryProps> = ({
  onInspectKPI,
}) => {
  const { language, selectedPeriod, selectedDistrictId, districts, incidents } = useDashboardStore();
  const t = useTranslation(language);

  const kpis = [
    {
      id: 'kpi-news-ingested',
      title: language === 'mr' ? 'अंतर्ग्रहित वृत्त सामग्री' : 'News Items Ingested',
      value: '14,820',
      unit: 'items',
      trend: '+12.4%',
      trendDirection: 'up' as const,
      trendPositive: true,
      comparison: 'vs 7d baseline (13,180)',
      target: 'Target: >12,000 items/day',
      icon: NewspaperIcon,
      accent: 'amber',
      details: 'Comprehensive aggregation across 18 Marathi, Hindi, and English regional dailies, 4 accredited news channels, and social media handles.',
      sparkline: [35, 42, 58, 64, 72, 85, 94],
    },
    {
      id: 'kpi-verified-headlines',
      title: language === 'mr' ? 'प्रमाणित बातम्या व मथळे' : 'Verified Headlines',
      value: '1,280',
      unit: 'verified',
      trend: '+8.2%',
      trendDirection: 'up' as const,
      trendPositive: true,
      comparison: '98.6% verification accuracy',
      target: 'Cleared by Field DIO desks',
      icon: CheckBadgeIcon,
      accent: 'emerald',
      details: 'All state communications verified on the ground by District Information Officers (DIOs) and linked with Mantralaya Government Resolutions (GRs).',
      sparkline: [20, 28, 45, 52, 60, 78, 88],
    },
    {
      id: 'kpi-active-sources',
      title: language === 'mr' ? 'सक्रिय माध्यम स्रोत' : 'Active Sources Ingested',
      value: '42',
      unit: 'channels',
      trend: '100%',
      trendDirection: 'up' as const,
      trendPositive: true,
      comparison: '24 Print • 12 TV • 6 Social',
      target: 'All feeds active with 0 drops',
      icon: RadioIcon,
      accent: 'sky',
      details: 'Live continuous monitoring of print epaper OCR, live TV transcripts from DD Sahyadri/ABP Majha, and public accounts on X, Meta, and WhatsApp.',
      sparkline: [40, 41, 41, 42, 42, 42, 42],
    },
    {
      id: 'kpi-crisis-signals',
      title: language === 'mr' ? 'संकट निवारण संकेत' : 'Active Crisis SLA Signals',
      value: String(incidents.length || 3),
      unit: 'active',
      trend: '-33.3%',
      trendDirection: 'down' as const,
      trendPositive: true,
      comparison: '1 Collector Sign-off Pending',
      target: 'Mandatory 90-min SLA enforcement',
      icon: ShieldExclamationIcon,
      accent: 'rose',
      details: 'Triage room tracking viral rumors with active countdown timers requiring Collector authorization before state-wide rebuttal dissemination.',
      sparkline: [8, 6, 7, 5, 4, 3, 3],
    },
    {
      id: 'kpi-response-speed',
      title: language === 'mr' ? 'सरासरी नागरिक प्रतिसाद वेळ' : 'Avg. Public Response Time',
      value: '34.2',
      unit: 'minutes',
      trend: '-14.8%',
      trendDirection: 'down' as const,
      trendPositive: true,
      comparison: 'Target: ≤ 45 min',
      target: 'On Schedule: 94.2%',
      icon: ClockIcon,
      accent: 'emerald',
      details: 'Time from news ingestion or viral misinformation detection to verified ground advisory issuance by the responsible District Collector.',
      sparkline: [55, 48, 44, 40, 38, 35, 34],
    },
    {
      id: 'kpi-sentiment-index',
      title: language === 'mr' ? 'राज्यव्यापी जनभावना निर्देशांक' : 'State Sentiment Index',
      value: '+0.742',
      unit: 'net score',
      trend: '+6.1%',
      trendDirection: 'up' as const,
      trendPositive: true,
      comparison: '68% Pos • 22% Neu • 10% Neg',
      target: 'Target: > +0.650',
      icon: HeartIcon,
      accent: 'amber',
      details: 'Composite sentiment score derived from NLP sentiment extraction on regional print, televised feedback, and social commentary across 36 districts.',
      sparkline: [60, 62, 65, 66, 70, 71, 74],
    },
  ];

  const handleCardClick = (kpi: typeof kpis[0]) => {
    if (onInspectKPI) {
      onInspectKPI({
        type: 'source',
        title: kpi.title,
        subtitle: `${kpi.comparison} • ${kpi.target}`,
        status: 'Operational Baseline',
        timestamp: 'Live Operational Window (Real-time)',
        metrics: {
          'Current Value': `${kpi.value} ${kpi.unit}`,
          'Period Trend': kpi.trend,
          'Performance Target': kpi.target,
          'Reporting Scope': selectedDistrictId === 'all' || !selectedDistrictId ? 'Statewide (36 Districts)' : selectedDistrictId.toUpperCase(),
        },
        details: kpi.details,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 w-full">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isRose = kpi.accent === 'rose';
        const isEmerald = kpi.accent === 'emerald';
        const isSky = kpi.accent === 'sky';

        return (
          <button
            type="button"
            key={kpi.id}
            onClick={() => handleCardClick(kpi)}
            className="p-4 rounded-xl border bg-[#0B111D] border-white/10 hover:border-amber-500/40 hover:bg-[#0E1626] transition-all duration-150 text-left cursor-pointer group flex flex-col justify-between shadow-lg relative overflow-hidden"
          >
            {/* Top Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-0.5 ${
                isRose
                  ? 'bg-rose-500'
                  : isEmerald
                  ? 'bg-emerald-500'
                  : isSky
                  ? 'bg-sky-500'
                  : 'bg-amber-500'
              }`}
            />

            <div>
              {/* Header: Title + Icon */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider truncate">
                  {kpi.title}
                </span>
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    isRose
                      ? 'bg-rose-500/15 text-rose-400'
                      : isEmerald
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : isSky
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Main Number + Unit */}
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-2xl xl:text-3xl font-extrabold font-mono text-white tracking-tight">
                  {kpi.value}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">
                  {kpi.unit}
                </span>
              </div>
            </div>

            {/* Sparkline & Comparison Footer */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between mt-2 text-[10px]">
              <span className="text-slate-400 truncate max-w-[110px]" title={kpi.comparison}>
                {kpi.comparison}
              </span>

              {/* Trend Badge */}
              <div
                className={`flex items-center gap-0.5 font-mono font-bold shrink-0 ${
                  kpi.trendPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {kpi.trendDirection === 'up' ? (
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
                )}
                <span>{kpi.trend}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
