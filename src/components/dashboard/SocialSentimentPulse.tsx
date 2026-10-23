'use client';

import React, { useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  InformationCircleIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { DrawerPayload } from '@/components/shared/ContextualIntelligenceDrawer';

interface SocialSentimentPulseProps {
  onInspectTopic?: (payload: DrawerPayload) => void;
}

export const SocialSentimentPulse: React.FC<SocialSentimentPulseProps> = ({ onInspectTopic }) => {
  const { language } = useDashboardStore();
  const [activeWindow, setActiveWindow] = useState<'24H' | '7D' | '30D'>('24H');

  const platforms = [
    {
      name: 'X (Twitter)',
      mentions: activeWindow === '24H' ? '12.5K' : activeWindow === '7D' ? '84.2K' : '312K',
      growth: '+12%',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      icon: '𝕏',
    },
    {
      name: 'WhatsApp',
      mentions: activeWindow === '24H' ? '8.3K' : activeWindow === '7D' ? '56.1K' : '220K',
      growth: '+8%',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: 'WA',
    },
    {
      name: 'Instagram',
      mentions: activeWindow === '24H' ? '6.7K' : activeWindow === '7D' ? '45.8K' : '185K',
      growth: '+15%',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
      icon: 'IG',
    },
    {
      name: 'Total Reach',
      mentions: activeWindow === '24H' ? '27.5K' : activeWindow === '7D' ? '186.1K' : '717K',
      growth: '+11%',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      icon: 'TR',
    },
  ];

  const trendingTopics = [
    { rank: 1, name: 'Maharashtra Development Projects', mr: 'महाराष्ट्र विकास प्रकल्प', pct: 24, velocity: '+18% velocity' },
    { rank: 2, name: 'New Infrastructure & Coastal Road', mr: 'कोस्टल रोड व पायाभूत सुविधा', pct: 18, velocity: '+14% velocity' },
    { rank: 3, name: 'Monsoon & Farmer Relief Subsidies', mr: 'पावसाळा व कृषी अनुदान वितरण', pct: 16, velocity: '+11% velocity' },
    { rank: 4, name: 'Public Health & Welfare Schemes', mr: 'आरोग्य व सामाजिक योजना', pct: 12, velocity: '+7% velocity' },
    { rank: 5, name: 'Tech, AI & Industrial Parks', mr: 'तंत्रज्ञान व औद्योगिक विकास', pct: 8, velocity: '+5% velocity' },
  ];

  const handleTopicClick = (topic: typeof trendingTopics[0]) => {
    if (onInspectTopic) {
      onInspectTopic({
        type: 'source',
        title: language === 'mr' ? topic.mr : topic.name,
        subtitle: `Trending Narrative • Rank #${topic.rank} (${topic.pct}% share)`,
        timestamp: 'Real-time Social Stream (24h)',
        sentiment: 'Positive',
        status: 'High Public Engagement',
        metrics: {
          'Topic Share': `${topic.pct}%`,
          'Velocity Rate': topic.velocity,
          'Active Channel Reach': '18.4K verified impressions',
          'Sentiment Polarity': '+0.784 Favorable',
        },
        details: `Public discussion volume around ${topic.name} reflects positive reactions to state government announcements and ministerial press conferences across Maharashtra.`,
      });
    }
  };

  return (
    <div className="bg-[#0B111D] border border-white/10 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#070B14]/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {language === 'mr' ? 'सोशल मीडिया व जनभावना विश्लेषण' : 'Social Media & Public Pulse Intelligence'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'mr' ? 'थेट जनभावना व माध्यम प्रसरण मापन' : 'Multi-platform narrative velocity & sentiment distribution'}
            </p>
          </div>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono">
          {(['24H', '7D', '30D'] as const).map((win) => (
            <button
              key={win}
              type="button"
              onClick={() => setActiveWindow(win)}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                activeWindow === win
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {win}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        {/* 4 Platform Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {platforms.map((p) => (
            <div
              key={p.name}
              className={`p-3 rounded-lg border ${p.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
                <span className="truncate">{p.name}</span>
                <span className="font-mono text-[10px] font-bold text-emerald-400">{p.growth}</span>
              </div>
              <div className="text-xl font-extrabold font-mono text-white mt-1.5">
                {p.mentions}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Mentions & Reach</span>
            </div>
          ))}
        </div>

        {/* Middle Row: Sentiment Donut & Narrative Velocity Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Sentiment Ring (5 cols) */}
          <div className="md:col-span-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-slate-300 mb-2">
              Sentiment Distribution (MuRIL Model)
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* SVG Donut Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="12"
                />
                {/* Positive (68%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="80.4"
                  strokeLinecap="round"
                />
                {/* Neutral (22%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="196"
                  strokeLinecap="round"
                />
                {/* Negative (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset="226"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black font-mono text-white">68%</span>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Favorable
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 68% Pos
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 22% Neu
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> 10% Neg
              </span>
            </div>
          </div>

          {/* Narrative Velocity Area Sparkline (7 cols) */}
          <div className="md:col-span-7 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">24-Hour Velocity Trend</span>
              <span className="font-mono text-emerald-400 font-bold">Peak: 14:00 IST</span>
            </div>

            {/* SVG Velocity Curve */}
            <div className="h-24 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 Q40,55 75,45 T150,20 T225,35 T300,10 L300,80 L0,80 Z"
                  fill="url(#velocityGrad)"
                />
                <path
                  d="M0,60 Q40,55 75,45 T150,20 T225,35 T300,10"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>06:00 (Ingestion)</span>
              <span>12:00 (Briefing)</span>
              <span>18:00 (Peak TV)</span>
              <span>22:00 (Dossier)</span>
            </div>
          </div>
        </div>

        {/* Trending Topics List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Top Statewide Discussion Clusters
            </span>
            <span className="text-[10px] text-slate-500 font-mono">By Engagement Volume</span>
          </div>

          <div className="space-y-1.5">
            {trendingTopics.map((item) => (
              <button
                key={item.rank}
                type="button"
                onClick={() => handleTopicClick(item)}
                className="w-full p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {item.rank}
                  </span>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300 transition-colors truncate">
                    {language === 'mr' ? item.mr : item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">{item.velocity}</span>
                  <span className="text-amber-400 font-bold">{item.pct}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer / Transparency Note */}
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center gap-2 text-[10px] text-slate-400">
          <InformationCircleIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Model estimates from MuRIL & StGNN semantic pipelines; not official opinion poll census data.
          </span>
        </div>
      </div>
    </div>
  );
};
