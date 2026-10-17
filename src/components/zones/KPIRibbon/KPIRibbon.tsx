'use client';

import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getDistrictName } from '@/lib/dataLocalization';
import { getDistrictSentiment } from '@/lib/sentimentEngine';

export const KPIRibbon: React.FC = () => {
  const {
    language,
    overviewMetrics,
    selectedDistrictId,
    selectedPeriod,
    districts,
    incidents,
  } = useDashboardStore();
  const t = useTranslation(language);

  // Memoized reactive metric calculation on any filter change (<16ms)
  const reactiveMetrics = useMemo(() => {
    const isAll = !selectedDistrictId || selectedDistrictId === 'all';
    const currentDistrict = isAll
      ? null
      : districts.find((d) => d.id === selectedDistrictId.toLowerCase());

    // 1. Time multiplier scaling
    let periodMultiplier = 1;
    let trendPeriodText = 'vs last week';
    if (selectedPeriod === 'Last 30 days') {
      periodMultiplier = 3.8;
      trendPeriodText = 'vs last month';
    } else if (selectedPeriod === 'Last 90 days') {
      periodMultiplier = 11.2;
      trendPeriodText = 'vs last quarter';
    }

    // 2. Total Releases Calculation
    let releasesCount: number | string = 1482;
    let releasesTarget = t.zone1.releasesTarget;
    let releasesTrend = '12%';

    if (currentDistrict) {
      const base = currentDistrict.releases;
      releasesCount = Math.round(base * periodMultiplier);
      const targetBase = Math.round(300 * periodMultiplier);
      releasesTarget = `${language === 'mr' ? 'उद्दिष्ट' : 'Target'}: ${targetBase} (${Math.min(100, Math.round((Number(releasesCount) / targetBase) * 100))}%)`;
      releasesTrend = '+14%';
    } else {
      const sumBase = districts.reduce((acc, d) => acc + d.releases, 0) || 1482;
      releasesCount = Math.round(sumBase * periodMultiplier);
      releasesTarget = selectedPeriod === 'Last 7 days'
        ? (language === 'mr' ? 'उद्दिष्ट: १,५०० (८३%)' : 'Target: 1,500 (83%)')
        : `${language === 'mr' ? 'उद्दिष्ट गाठले' : 'Target Met'} (86%)`;
      releasesTrend = '+18%';
    }

    // 3. TAT Calculation
    let tatVal = 46.6;
    let tatTarget = t.zone1.tatTarget;
    let tatTrend = '18%';

    if (currentDistrict) {
      tatVal = currentDistrict.avgTAT;
      tatTarget = tatVal <= 45 ? `${language === 'mr' ? 'विहित वेळेत' : 'Target Met'} (≤45m)` : `${language === 'mr' ? 'उद्दिष्टाच्या जवळ' : 'Near Target'} (≤60m)`;
      tatTrend = '-12%';
    } else {
      tatVal = 46.6;
      tatTarget = language === 'mr' ? 'उद्दिष्ट ≤ ६० मिनिटे (साध्य)' : 'Target ≤ 60 min (Met)';
      tatTrend = '-9%';
    }

    // 4. Multi-Channel Sentiment Calculation (Print OCR, Broadcast TV, Social Listening, User Comments)
    const sentimentBreakdown = getDistrictSentiment(
      currentDistrict ? currentDistrict.id : undefined,
      selectedPeriod
    );
    const sentimentVal = `${sentimentBreakdown.composite}%`;
    const sentimentTarget = sentimentBreakdown.composite >= 70
      ? (language === 'mr' ? 'उद्दिष्ट ≥ ७०% (साध्य)' : 'Target ≥ 70% (Met)')
      : (language === 'mr' ? 'उद्दिष्टापेक्षा जास्त (>६५%)' : 'Above Target (>65%)');
    const sentimentTrend = '+6%';
    const sentimentChannelsText = `Print ${sentimentBreakdown.printOcr}% · TV ${sentimentBreakdown.broadcastTv}% · Social ${sentimentBreakdown.socialListening}% · Comments ${sentimentBreakdown.userComments}%`;

    // 5. Misinformation Tickets Calculation
    let openTicketsCount = 3;
    let misinfoTarget = '41 Resolved · 3 Open';
    let misinfoTrend = '33%';

    if (currentDistrict) {
      const districtTickets = incidents.filter(
        (inc) => inc.district.toLowerCase() === currentDistrict.name.toLowerCase() && !inc.authorized
      );
      openTicketsCount = districtTickets.length;
      misinfoTarget = `${openTicketsCount} ${language === 'mr' ? 'सक्रिय विहित वेळेत' : 'Active in SLA'}`;
      misinfoTrend = openTicketsCount === 0 ? '-100%' : '-50%';
    } else {
      const unauthIncidents = incidents.filter((inc) => !inc.authorized);
      openTicketsCount = unauthIncidents.length || 3;
      misinfoTarget = language === 'mr' ? '४१ निवारित · ३ चालू' : '41 Resolved · 3 Open';
      misinfoTrend = '-33%';
    }

    // Scope title
    const scopeName = currentDistrict
      ? `${language === 'mr' ? (currentDistrict.nameMr || getDistrictName(currentDistrict.name, 'mr')) : currentDistrict.name} ${language === 'mr' ? 'जिल्हा कार्यक्षेत्र' : 'District Operations'}`
      : `${language === 'mr' ? 'कोकण विभाग • राज्य संनियंत्रण' : 'Konkan Division • State Operations'}`;

    return {
      scopeName,
      releasesVal: typeof releasesCount === 'number' ? releasesCount.toLocaleString('en-IN') : releasesCount,
      releasesTarget,
      releasesTrend,
      tatVal,
      tatTarget,
      tatTrend,
      sentimentVal,
      sentimentTarget,
      sentimentTrend,
      sentimentChannelsText,
      openTicketsCount,
      misinfoTarget,
      misinfoTrend,
    };
  }, [selectedDistrictId, selectedPeriod, districts, incidents, language, t]);

  return (
    <section className="w-full space-y-2 select-none" aria-label={t.zone1.sectionTitle}>
      {/* Scope Sub-label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <h2 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
            {t.zone1.sectionTitle}
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          {reactiveMetrics.scopeName}
        </span>
      </div>

      {/* Single Horizontal Full-Width Ribbon: Exactly 4 Equal Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full items-stretch">
        {/* 1. Total Releases */}
        <KPICard
          icon="description"
          title={t.zone1.totalReleases}
          value={reactiveMetrics.releasesVal}
          targetText={reactiveMetrics.releasesTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.releasesTrend}
          positiveTrend={true}
        />

        {/* 2. Average TAT */}
        <KPICard
          icon="schedule"
          title={t.zone1.avgTAT}
          value={reactiveMetrics.tatVal}
          unit={language === 'mr' ? 'मि' : 'min'}
          targetText={reactiveMetrics.tatTarget}
          trendDirection="down"
          trendValue={reactiveMetrics.tatTrend}
          positiveTrend={true}
        />

        {/* 3. Multi-Channel Sentiment Index */}
        <KPICard
          icon="sentiment_satisfied"
          title={t.zone1.sentimentIndex}
          value={reactiveMetrics.sentimentVal}
          targetText={reactiveMetrics.sentimentTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.sentimentTrend}
          positiveTrend={true}
          channelBreakdown={reactiveMetrics.sentimentChannelsText}
        />

        {/* 4. Misinformation Tickets */}
        <KPICard
          icon="error"
          title={t.zone1.misinformation}
          value={reactiveMetrics.openTicketsCount}
          unit={language === 'mr' ? 'चालू' : 'open'}
          targetText={reactiveMetrics.misinfoTarget}
          trendDirection="down"
          trendValue={reactiveMetrics.misinfoTrend}
          positiveTrend={false}
        />
      </div>
    </section>
  );
};
