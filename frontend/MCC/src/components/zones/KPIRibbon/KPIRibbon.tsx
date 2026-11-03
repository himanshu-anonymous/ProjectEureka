'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
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
    setSelectedDistrictId,
    selectedPeriod,
    districts,
    incidents,
    isLoadingData,
    ocrFeed,
  } = useDashboardStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [districtFilterSearch, setDistrictFilterSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDistrictList = useMemo(() => {
    if (!districtFilterSearch.trim()) return districts;
    const q = districtFilterSearch.toLowerCase().trim();
    return districts.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.nameMr && d.nameMr.includes(q)) ||
        d.division.toLowerCase().includes(q)
    );
  }, [districts, districtFilterSearch]);

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

    // 3. Crisis SLA Resolution Rate (Statutory 4-hour Emergency Window)
    let crisisSlaVal = 98.4;
    let crisisSlaTarget = t.zone1.tatTarget;
    let crisisSlaTrend = '+4.2%';

    if (currentDistrict) {
      crisisSlaVal = currentDistrict.crisisSLA || 98.4;
      crisisSlaTarget = crisisSlaVal >= 95
        ? `${language === 'mr' ? 'उद्दिष्ट साध्य' : 'Target Met'} (≥95%)`
        : `${language === 'mr' ? 'सुधारणा आवश्यक' : 'Action Needed'} (<95%)`;
      crisisSlaTrend = '+2.5%';
    } else {
      crisisSlaVal = 98.4;
      crisisSlaTarget = language === 'mr' ? 'विहित उद्दिष्ट ≥ ९५% (<४ तास साध्य)' : 'Crisis Target ≥ 95% (<4h Met)';
      crisisSlaTrend = '+4.2%';
    }

    // 4. Dynamic Multi-Channel Sentiment Calculation (Print OCR, Broadcast TV, Social Listening, User Comments + Ingested News Wires)
    const sentimentBreakdown = getDistrictSentiment(
      currentDistrict ? currentDistrict.id : undefined,
      selectedPeriod,
      ocrFeed
    );
    const sentimentVal = `${sentimentBreakdown.composite}%`;
    const sentimentTarget = sentimentBreakdown.composite >= 70
      ? (language === 'mr' ? 'उद्दिष्ट ≥ ७०% (साध्य)' : 'Target ≥ 70% (Met)')
      : (language === 'mr' ? 'उद्दिष्टापेक्षा जास्त (>६५%)' : 'Above Target (>65%)');
    const sentimentTrend = sentimentBreakdown.newsPolarityShift >= 0
      ? `+${(6 + sentimentBreakdown.newsPolarityShift).toFixed(1)}%`
      : `${(6 + sentimentBreakdown.newsPolarityShift).toFixed(1)}%`;
    const liveCountBadge = sentimentBreakdown.totalNewsItemsAnalyzed > 0
      ? ` (${sentimentBreakdown.totalNewsItemsAnalyzed} ${language === 'mr' ? 'थेट बातम्या' : 'live wires'})`
      : '';
    const sentimentChannelsText = language === 'mr'
      ? `प्रिंट ${sentimentBreakdown.printOcr}% • टीव्ही ${sentimentBreakdown.broadcastTv}% • सोशल ${sentimentBreakdown.socialListening}%`
      : `Print ${sentimentBreakdown.printOcr}% • TV ${sentimentBreakdown.broadcastTv}% • Social ${sentimentBreakdown.socialListening}%`;

    // 5. Misinformation Tickets Calculation (Reactive to current unverified / debunked incidents)
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
      crisisSlaVal,
      crisisSlaTarget,
      crisisSlaTrend,
      sentimentVal,
      sentimentTarget,
      sentimentTrend,
      sentimentChannelsText,
      openTicketsCount,
      misinfoTarget,
      misinfoTrend,
    };
  }, [selectedDistrictId, selectedPeriod, districts, incidents, ocrFeed, language, t, currentDistrict, isDistrictSelected, prettyDistrictName]);

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
    <section className="w-full space-y-0.5 select-none" aria-label={t.zone1.sectionTitle}>
      {/* Scope Sub-label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <h2 className="text-[10px] font-bold text-gov-primary uppercase tracking-wider">
            {t.zone1.sectionTitle}
          </h2>
        </div>
        {/* Interactive District Filter Tab & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs hover:border-gov-blue/50 focus:outline-none focus:ring-1 focus:ring-gov-blue transition-all cursor-pointer group"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            title={language === 'mr' ? 'जिल्हा निवडा (सर्व ३६ जिल्हे)' : 'Select District (All 36 Districts)'}
          >
            <MaterialIcon name="location_on" size="xs" className="text-gov-primary group-hover:scale-110 transition-transform" />
            <span className="max-w-[130px] sm:max-w-[160px] truncate text-slate-900 font-semibold">
              {currentDistrict
                ? (language === 'mr' ? `${currentDistrict.nameMr} (#${currentDistrict.rank})` : `${currentDistrict.name} (#${currentDistrict.rank})`)
                : (language === 'mr' ? 'सर्व ३६ जिल्हे (महाराष्ट्र)' : 'Statewide (All 36 Districts)')}
            </span>
            <MaterialIcon
              name={isDropdownOpen ? 'expand_less' : 'expand_more'}
              size="xs"
              className="text-slate-400 group-hover:text-slate-600"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 overflow-hidden">
              {/* Search Input */}
              <div className="p-1.5 border-b border-slate-100 bg-slate-50/70">
                <div className="relative">
                  <input
                    type="text"
                    value={districtFilterSearch}
                    onChange={(e) => setDistrictFilterSearch(e.target.value)}
                    placeholder={language === 'mr' ? '३६ जिल्हे शोधा...' : 'Search 36 districts...'}
                    className="w-full text-[11px] bg-white border border-slate-200 rounded px-2 py-1 pl-6 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-blue"
                    autoFocus
                  />
                  <MaterialIcon
                    name="search"
                    size="xs"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 text-[11px]">
                {/* All Districts Statewide Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrictId('');
                    setIsDropdownOpen(false);
                    setDistrictFilterSearch('');
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-gov-blue/5 transition-colors cursor-pointer ${
                    !isDistrictSelected ? 'bg-gov-blue/10 font-bold text-gov-primary' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{language === 'mr' ? 'सर्व ३६ जिल्हे (महाराष्ट्र राज्य)' : 'All Districts (Statewide)'}</span>
                  </span>
                  {!isDistrictSelected && <span className="text-[10px] text-gov-primary font-bold">✓</span>}
                </button>

                {/* 36 Districts in exact ranking order */}
                {filteredDistrictList.map((d) => {
                  const isSelected = selectedDistrictId.toLowerCase() === d.id.toLowerCase();
                  const dName = language === 'mr' ? d.nameMr : d.name;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setSelectedDistrictId(d.id);
                        setIsDropdownOpen(false);
                        setDistrictFilterSearch('');
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-gov-primary/10 font-bold text-gov-primary' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          #{d.rank}
                        </span>
                        <span className="truncate">{dName}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-[10px] text-slate-400 font-mono">
                        <span>CPI {d.cpi}</span>
                        {isSelected && <span className="text-gov-primary font-bold ml-1">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards: 2x2 grid in column mode, 4-col in ribbon mode */}
      <div
        className={
          layout === 'ribbon'
            ? 'grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-1.5 w-full items-stretch'
            : 'grid grid-cols-2 gap-1 w-full items-stretch'
        }
      >
        {/* 1. Total Releases with Power BI Sparkline */}
        <KPICard
          icon="description"
          title={t.zone1.totalReleases}
          value={reactiveMetrics.releasesVal}
          targetText={reactiveMetrics.releasesTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.releasesTrend}
          positiveTrend={true}
          methodologyKey="totalReleases"
          chartType="sparkline"
        />

        {/* 2. Crisis SLA Resolution Rate with Bullet Target Bar */}
        <KPICard
          icon="shield"
          title={t.zone1.avgTAT}
          value={reactiveMetrics.crisisSlaVal}
          unit="%"
          targetText={reactiveMetrics.crisisSlaTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.crisisSlaTrend}
          positiveTrend={true}
          methodologyKey="crisisSlaResolutionRate"
          chartType="bullet"
          progressPercent={Number(reactiveMetrics.crisisSlaVal) || 98.4}
          targetPercent={95}
        />

        {/* 3. Multi-Channel Sentiment Index with Sentiment Distribution Bar */}
        <KPICard
          icon="sentiment_satisfied"
          title={t.zone1.sentimentIndex}
          value={reactiveMetrics.sentimentVal}
          targetText={reactiveMetrics.sentimentTarget}
          trendDirection="up"
          trendValue={reactiveMetrics.sentimentTrend}
          positiveTrend={true}
          channelBreakdown={reactiveMetrics.sentimentChannelsText}
          methodologyKey="sentimentIndex"
          chartType="sentimentBar"
          progressPercent={parseFloat(String(reactiveMetrics.sentimentVal)) || 78}
        />

        {/* 4. Misinformation Tickets with Status Split Bar */}
        <KPICard
          icon="error"
          title={t.zone1.misinformation}
          value={reactiveMetrics.openTicketsCount}
          unit={language === 'mr' ? 'चालू' : 'open'}
          targetText={reactiveMetrics.misinfoTarget}
          trendDirection="down"
          trendValue={reactiveMetrics.misinfoTrend}
          positiveTrend={false}
          methodologyKey="misinformationTickets"
          chartType="statusSplit"
          resolvedCount={41}
          openCount={Number(reactiveMetrics.openTicketsCount) || 3}
        />
      </div>
    </section>
  );
};
