'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { Newspaper, Send, MessageSquare, AlertTriangle } from 'lucide-react';
import { ScoreMetricBar } from './ScoreMetricBar';

export const ScoreDecomposition: React.FC = () => {
  const { districts, selectedDistrictId, language } = useDashboardStore();
  const t = useTranslation(language);

  const selected =
    districts.find((d) => d.id === selectedDistrictId) || districts[0];

  return (
    <div className="bg-surface border border-slate-200 border-t-4 border-t-gov-accent rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
            {t.zone3.zoneLabel}
          </span>
          <div>
            <h3 className="text-sm font-bold text-gov-primary tracking-tight">
              {t.zone3.title} — {selected.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {t.zone3.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-gov-primary rounded border border-slate-300">
            {t.zone3.rankPrefix} #{selected.rank}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 bg-gov-primary text-white rounded shadow-2xs">
            {t.zone3.cpiPrefix} {selected.cpi} / 100
          </span>
        </div>
      </div>

      {/* 4 Constituent Scores */}
      <div className="p-4 space-y-4 bg-white">
        {/* 1. Volume Score */}
        <ScoreMetricBar
          icon={Newspaper}
          title={t.zone3.volumeTitle}
          subtitle={t.zone3.volumeSub}
          score={selected.volumeScore}
          valueLabel={`${selected.releases} ${language === 'en' ? 'releases' : language === 'mr' ? 'पत्रके' : 'विज्ञप्तियां'}`}
          gapLabel={`${25 - selected.volumeScore} ${t.zone3.gapSuffix}`}
        />

        {/* 2. TAT / Dispatch Speed */}
        <ScoreMetricBar
          icon={Send}
          title={t.zone3.tatTitle}
          subtitle={t.zone3.tatSub}
          score={selected.tatScore}
          valueLabel={`${selected.avgTAT} ${language === 'en' ? 'min' : language === 'mr' ? 'मिनिटे' : 'मिनट'}`}
          gapLabel={`${25 - selected.tatScore} ${t.zone3.gapSuffix}`}
        />

        {/* 3. Media Sentiment */}
        <ScoreMetricBar
          icon={MessageSquare}
          title={t.zone3.sentimentTitle}
          subtitle={t.zone3.sentimentSub}
          score={selected.sentimentScore}
          valueLabel={`${selected.sentiment}%`}
          gapLabel={`${25 - selected.sentimentScore} ${t.zone3.gapSuffix}`}
        />

        {/* 4. Crisis SLA */}
        <ScoreMetricBar
          icon={AlertTriangle}
          title={t.zone3.crisisTitle}
          subtitle={t.zone3.crisisSub}
          score={selected.crisisScore}
          valueLabel={`${selected.crisisSLA}% SLA`}
          gapLabel={`${25 - selected.crisisScore} ${t.zone3.gapSuffix}`}
        />
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
        <span>{t.zone3.footerLeft}</span>
        <span className="font-semibold text-gov-primary">{t.zone3.footerRight}</span>
      </div>
    </div>
  );
};
