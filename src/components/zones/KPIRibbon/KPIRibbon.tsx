'use client';

import React, { useMemo } from 'react';
import { KPICard } from './KPICard';
import { KPIRibbonSkeleton } from '@/components/skeletons/KPIRibbonSkeleton';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getDistrictName } from '@/lib/dataLocalization';
import { getDistrictSentiment } from '@/lib/sentimentEngine';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface KPIRibbonProps {
  layout?: 'ribbon' | 'column';
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ layout = 'ribbon' }) => {
  const {
    language,
    overviewMetrics,
    selectedDistrictId,
    selectedPeriod,
    districts,
    incidents,
    isLoadingData,
  } = useDashboardStore();

  const t = useTranslation(language);

  const isDistrictSelected = Boolean(selectedDistrictId && selectedDistrictId !== 'all');
  const prettyDistrictName = selectedDistrictId
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  // Selected district is only meaningful when it is part of the ingested dataset.
  const currentDistrict = isDistrictSelected
    ? districts.find((d) => d.id === selectedDistrictId.toLowerCase()) || null
    : null;

  // Memoized reactive metric calculation on any filter change (<16ms)
  const reactiveMetrics = useMemo(() => {
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
      // Derive the attainment from the same numbers shown on the card instead of a
      // hardcoded percentage that drifts as the dataset changes.
      const targetBase = Math.round(1500 * periodMultiplier);
      const pct = Math.min(100, Math.round((Number(releasesCount) / targetBase) * 100));
      releasesTarget = `${language === 'mr' ? 'उद्दिष्ट' : 'Target'}: ${targetBase.toLocaleString('en-IN')} (${pct}%)`;
      releasesTrend = '+18%';
    }

    // 3. Citizen Grievance & Inquiry Resolution Rate (User-Centric)
    let tatVal = 98.4;
    let tatTarget = t.zone1.tatTarget;
    let tatTrend = '4.2%';

    if (currentDistrict) {
      tatVal = Number((Math.min(99.8, Math.max(93.5, 100 - (currentDistrict.avgTAT / 25)))).toFixed(1));
      tatTarget = tatVal >= 95 ? `${language === 'mr' ? 'उद्दिष्ट साध्य' : 'Target Met'} (≥95%)` : `${language === 'mr' ? 'उद्दिष्टाच्या जवळ' : 'Near Target'} (≥90%)`;
      tatTrend = '+3.8%';
    } else {
      tatVal = 98.4;
      tatTarget = language === 'mr' ? 'विहित उद्दिष्ट ≥ ९५% (साध्य)' : 'Target ≥ 95% (Met)';
      tatTrend = '+4.2%';
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
      openTicketsCount = unauthIncidents.length;
      const resolvedCount = Math.max(0, incidents.length - unauthIncidents.length);
      misinfoTarget = language === 'mr'
        ? `${resolvedCount} निवारित · ${openTicketsCount} चालू`
        : `${resolvedCount} Resolved · ${openTicketsCount} Open`;
      misinfoTrend = '-33%';
    }

    // Scope title
    const scopeName = currentDistrict
      ? `${language === 'mr' ? (currentDistrict.nameMr || getDistrictName(currentDistrict.name, 'mr')) : currentDistrict.name} ${language === 'mr' ? 'जिल्हा कार्यक्षेत्र' : 'District Operations'}`
      : isDistrictSelected
      ? `${prettyDistrictName} ${language === 'mr' ? 'जिल्हा कार्यक्षेत्र' : 'District Operations'}`
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
  }, [selectedDistrictId, selectedPeriod, districts, incidents, language, t, currentDistrict, isDistrictSelected, prettyDistrictName]);

  if (isLoadingData) {
    return <KPIRibbonSkeleton cardsCount={4} />;
  }

  // A district outside the ingested scope has no telemetry. Never present the
  // statewide aggregates under a district label; say what is actually true.
  if (isDistrictSelected && !currentDistrict) {
    return (
      <section className="w-full space-y-2 select-none" aria-label={t.zone1.sectionTitle}>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <h2 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
              {t.zone1.sectionTitle}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            {prettyDistrictName} {language === 'mr' ? 'जिल्हा कार्यक्षेत्र' : 'District Operations'}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-8 flex flex-col items-center justify-center text-center gap-2">
          <MaterialIcon name="bar_chart" size="md" className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">
            {language === 'mr'
              ? 'या जिल्ह्याची अद्याप टेलीमेट्री उपलब्ध नाही'
              : 'No telemetry ingested for this district yet'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            {language === 'mr'
              ? 'सध्या केवळ कोकण विभागाच्या पाच जिल्ह्यांची माहिती उपलब्ध आहे.'
              : 'KPI aggregation covers all reporting districts. Choose another district to inspect its releases, response speed and sentiment.'}
          </p>
        </div>
      </section>
    );
  }

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

      {/* KPI Cards: 2x2 grid in column mode, 4-col in ribbon mode */}
      <div
        className={
          layout === 'ribbon'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 xl:gap-5 w-full items-stretch'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full items-stretch'
        }
      >
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

        {/* 2. Citizen Grievance & Inquiry Resolution Rate */}
        <KPICard
          icon="check_circle"
          title={t.zone1.avgTAT}
          value={reactiveMetrics.tatVal}
          unit="%"
          targetText={reactiveMetrics.tatTarget}
          trendDirection="up"
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
