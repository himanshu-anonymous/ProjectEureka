'use client';

import React from 'react';
import { FileText, Clock, Smile, AlertCircle } from 'lucide-react';
import { KPICard } from './KPICard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

export const KPIRibbon: React.FC = () => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="flex flex-col gap-2">
      {/* Zone Label per Wireframe: Zone 1 (Top Ribbon) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-gov-blue">
            {t.zone1.zoneLabel}
          </span>
          <span className="text-xs font-bold text-gov-primary">
            {t.zone1.sectionTitle}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Statewide Aggregates</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* 1. Total Releases */}
        <KPICard
          icon={FileText}
          title={t.zone1.totalReleases}
          value="1,248"
          targetText={t.zone1.releasesTarget}
          trendDirection="down"
          trendValue="12%"
          positiveTrend={true}
        />

        {/* 2. Average TAT */}
        <KPICard
          icon={Clock}
          title={t.zone1.avgTAT}
          value={47}
          unit="min"
          targetText={t.zone1.tatTarget}
          trendDirection="down"
          trendValue="18%"
          positiveTrend={false}
        />

        {/* 3. Sentiment Index */}
        <KPICard
          icon={Smile}
          title={t.zone1.sentimentIndex}
          value="72%"
          targetText={t.zone1.sentimentTarget}
          trendDirection="up"
          trendValue="6%"
          positiveTrend={true}
        />

        {/* 4. Misinformation Tickets */}
        <KPICard
          icon={AlertCircle}
          title={t.zone1.misinformation}
          value={8}
          unit="active"
          targetText={t.zone1.misinfoTarget}
          trendDirection="down"
          trendValue="33%"
          positiveTrend={false}
        />
      </div>
    </div>
  );
};
