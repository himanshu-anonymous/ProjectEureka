'use client';

import React, { useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { ScoreMetricBar } from './ScoreMetricBar';
import { getDistrictName } from '@/lib/dataLocalization';
import { getDistrictSentiment } from '@/lib/sentimentEngine';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const ScoreDecomposition: React.FC = () => {
  const { districts, selectedDistrictId, selectedPeriod, language } = useDashboardStore();
  const t = useTranslation(language);

  const selected =
    districts.find((d) => d.id === selectedDistrictId?.toLowerCase()) ||
    districts[0];

  const sentimentBreakdown = useMemo(() => {
    return getDistrictSentiment(selected.id, selectedPeriod);
  }, [selected.id, selectedPeriod]);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.zone3.title} — {language === 'mr' ? (selected.nameMr || getDistrictName(selected.name, 'mr')) : selected.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            {t.zone3.subtitle}
          </p>
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
          icon="newspaper"
          title={t.zone3.volumeTitle}
          subtitle={t.zone3.volumeSub}
          score={selected.volumeScore}
          valueLabel={`${selected.releases} ${language === 'mr' ? 'पत्रके' : 'releases'}`}
          gapLabel={`${25 - selected.volumeScore} ${t.zone3.gapSuffix}`}
        />

        {/* 2. TAT / Dispatch Speed */}
        <ScoreMetricBar
          icon="send"
          title={t.zone3.tatTitle}
          subtitle={t.zone3.tatSub}
          score={selected.tatScore}
          valueLabel={`${selected.avgTAT} ${language === 'mr' ? 'मिनिटे' : 'min'}`}
          gapLabel={`${25 - selected.tatScore} ${t.zone3.gapSuffix}`}
        />

        {/* 3. Media Sentiment Score (Multi-Channel 4-Stream Composite) */}
        <div className="space-y-1.5 p-2 rounded-md hover:bg-slate-50 transition-colors">
          <ScoreMetricBar
            icon="chat_bubble"
            title={t.zone3.sentimentTitle}
            subtitle={t.zone3.sentimentSub}
            score={selected.sentimentScore}
            valueLabel={`${selected.sentiment}%`}
            gapLabel={`${25 - selected.sentimentScore} ${t.zone3.gapSuffix}`}
          />

          {/* 4-Channel Weighted Breakdown Badges */}
          <div className="mt-1 pl-7 pt-1 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
              <MaterialIcon name="bar_chart" size="xs" className="text-slate-400" />
              <span>{language === 'mr' ? '४-प्रवाह घटक:' : '4-Channel Mix:'}</span>
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200"
              title="Print Media OCR (35% weight in composite tone score)"
            >
              <span>{language === 'mr' ? 'प्रिंट ओसीआर' : 'Print OCR'}</span>
              <strong>{sentimentBreakdown.printOcr}%</strong>
              <span className="text-blue-500 text-[9px]">(35%)</span>
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-800 border border-purple-200"
              title="Broadcast TV Telemetry - DD Sahyadri & Regional News (25% weight)"
            >
              <span>{language === 'mr' ? 'टीव्ही प्रसारण' : 'Broadcast TV'}</span>
              <strong>{sentimentBreakdown.broadcastTv}%</strong>
              <span className="text-purple-500 text-[9px]">(25%)</span>
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200"
              title="Social Listening - X/Twitter, FB, Insta, YouTube (25% weight)"
            >
              <span>{language === 'mr' ? 'सोशल ऐकणे' : 'Social'}</span>
              <strong>{sentimentBreakdown.socialListening}%</strong>
              <span className="text-emerald-500 text-[9px]">(25%)</span>
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200"
              title="Citizen/User Comments & Public Feedback (15% weight)"
            >
              <span>{language === 'mr' ? 'नागरिक टिप्पण्या' : 'Comments'}</span>
              <strong>{sentimentBreakdown.userComments}%</strong>
              <span className="text-amber-500 text-[9px]">(15%)</span>
            </span>
          </div>
        </div>

        {/* 4. Crisis SLA */}
        <ScoreMetricBar
          icon="warning"
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
