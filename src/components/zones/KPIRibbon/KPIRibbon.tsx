'use client';

import React from 'react';
import { KPICard } from './KPICard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

export const KPIRibbon: React.FC = () => {
  const { language, overviewMetrics } = useDashboardStore();
  const t = useTranslation(language);

  // Dynamic values with baseline fallbacks
  const releasesVal = overviewMetrics?.totalReleases.value ?? '1,482';
  const releasesTarget = overviewMetrics?.totalReleases.targetText ?? t.zone1.releasesTarget;
  const releasesTrend = overviewMetrics?.totalReleases.trendValue ?? '12%';

  const tatVal = overviewMetrics?.avgTAT.value ?? 46.6;
  const tatTarget = overviewMetrics?.avgTAT.targetText ?? t.zone1.tatTarget;
  const tatTrend = overviewMetrics?.avgTAT.trendValue ?? '18%';

  const sentimentVal = overviewMetrics?.sentimentIndex.value ?? '69.2%';
  const sentimentTarget = overviewMetrics?.sentimentIndex.targetText ?? t.zone1.sentimentTarget;
  const sentimentTrend = overviewMetrics?.sentimentIndex.trendValue ?? '6%';

  const misinfoVal = overviewMetrics?.misinformationTickets.value ?? 3;
  const misinfoTarget = overviewMetrics?.misinformationTickets.targetText ?? '41 Resolved · 3 Open';
  const misinfoTrend = overviewMetrics?.misinformationTickets.trendValue ?? '33%';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-gov-primary">
          {t.zone1.sectionTitle}
        </h2>
        <span className="text-[10px] text-slate-500 font-medium">
          {overviewMetrics?.scopeName || 'Statewide Aggregates'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Total Releases */}
        <KPICard
          icon="description"
          title={t.zone1.totalReleases}
          value={releasesVal}
          targetText={releasesTarget}
          trendDirection={overviewMetrics?.totalReleases.trendDirection || 'up'}
          trendValue={releasesTrend}
          positiveTrend={true}
        />

        {/* Average TAT */}
        <KPICard
          icon="schedule"
          title={t.zone1.avgTAT}
          value={tatVal}
          unit="min"
          targetText={tatTarget}
          trendDirection={overviewMetrics?.avgTAT.trendDirection || 'down'}
          trendValue={tatTrend}
          positiveTrend={true}
        />

        {/* Sentiment Index */}
        <KPICard
          icon="sentiment_satisfied"
          title={t.zone1.sentimentIndex}
          value={sentimentVal}
          targetText={sentimentTarget}
          trendDirection={overviewMetrics?.sentimentIndex.trendDirection || 'up'}
          trendValue={sentimentTrend}
          positiveTrend={true}
        />

        {/* Misinformation Tickets */}
        <KPICard
          icon="error"
          title={t.zone1.misinformation}
          value={misinfoVal}
          unit="open"
          targetText={misinfoTarget}
          trendDirection={overviewMetrics?.misinformationTickets.trendDirection || 'down'}
          trendValue={misinfoTrend}
          positiveTrend={false}
        />
      </div>
    </div>
  );
};
