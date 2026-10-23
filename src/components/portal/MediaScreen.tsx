'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import {
  NEWSPAPER_CLIPPINGS,
  NewspaperClipping,
  TV_CHANNELS_DATA,
  SOCIAL_MEDIA_ANALYSIS,
} from '@/data/newspaperClippingsData';

export const MediaScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [activeMediaTab, setActiveMediaTab] = useState<'clippings' | 'tv' | 'social'>('clippings');
  const [selectedPublication, setSelectedPublication] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inspectingClipping, setInspectingClipping] = useState<NewspaperClipping | null>(null);

  const ITEMS_PER_PAGE = 12;

  // Publications List for Filter
  const uniquePublications = useMemo(() => {
    return Array.from(new Set(NEWSPAPER_CLIPPINGS.map((c) => c.publication)));
  }, []);

  // Filtered 516 Clippings
  const filteredClippings = useMemo(() => {
    return NEWSPAPER_CLIPPINGS.filter((item) => {
      const matchPub = selectedPublication === 'all' || item.publication === selectedPublication;
      const matchSent = selectedSentiment === 'all' || item.sentiment === selectedSentiment;
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.headline.toLowerCase().includes(q) ||
        item.headlineMr.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.districtMr.toLowerCase().includes(q) ||
        item.publication.toLowerCase().includes(q) ||
        item.publicationMr.toLowerCase().includes(q);
      return matchPub && matchSent && matchCat && matchSearch;
    });
  }, [selectedPublication, selectedSentiment, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredClippings.length / ITEMS_PER_PAGE) || 1;
  const paginatedClippings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClippings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClippings, currentPage]);

  const handleShareClipping = (clipping: NewspaperClipping) => {
    setToast({
      message:
        language === 'mr'
          ? `कात्रण (${clipping.id}) लिंक कॉपी झाली.`
          : `Clipping (${clipping.id}) share link copied.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Communication Centre Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {language === 'mr'
                ? '५१६ वृत्तपत्र कात्रणे • २४x७ थेट माध्यम कक्ष'
                : '516 Verified Newspaper Clippings • 24x7 Media Command'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gov-primary flex items-center gap-2">
            <MaterialIcon name="newspaper" size="md" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? 'माध्यम व संवाद कक्ष (Communication Centre)'
                : 'Communication Centre — Multi-Media Intelligence'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'राज्यातील ३६ जिल्ह्यांमधून दररोज संकलित ५१६ वृत्तपत्र कात्रणे, ६ प्रादेशिक वृत्तवाहिन्यांचे थेट विश्लेषण आणि सोशल मीडिया जनभावना.'
              : 'Continuous indexing of 516 daily regional press clippings, accredited TV news broadcast monitors, and social sentiment pulse.'}
          </p>
        </div>

        {/* Media Selector Tabs (Power BI Styled) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => {
              setActiveMediaTab('clippings');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMediaTab === 'clippings'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MaterialIcon name="article" size="xs" />
            <span>{language === 'mr' ? 'वृत्तपत्र कात्रणे (५१६)' : 'Newspaper Clippings (516)'}</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('tv')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMediaTab === 'tv'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MaterialIcon name="tv" size="xs" />
            <span>{language === 'mr' ? 'टीव्ही वाहिन्या (६)' : 'TV Channels (6)'}</span>
          </button>
          <button
            onClick={() => setActiveMediaTab('social')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMediaTab === 'social'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <MaterialIcon name="forum" size="xs" />
            <span>{language === 'mr' ? 'सोशल मीडिया विश्लेषण' : 'Social Media Pulse'}</span>
          </button>

          <a
            href="/newspaper"
            className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs"
            title="Open Interactive Broadsheet E-Paper Reader"
          >
            <MaterialIcon name="newspaper" size="xs" />
            <span>{language === 'mr' ? 'दैनिक ई-पेपर वाचक ↗' : 'E-Paper Reader ↗'}</span>
          </a>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'एकूण स्कॅन केलेली कात्रणे' : 'Total Ingested Clippings'}
          </span>
          <div className="text-2xl font-black text-slate-900">516 Clippings</div>
          <span className="text-xs text-emerald-700 font-semibold">100% OCR Processed & Tagged</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'सकारात्मक प्रसिद्धी प्रमाण' : 'Positive Coverage Index'}
          </span>
          <div className="text-2xl font-black text-emerald-700">82.4%</div>
          <span className="text-xs text-slate-500">Welfare & Infrastructure Lead</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'कव्हरेज असलेले जिल्हे' : 'District Reach'}
          </span>
          <div className="text-2xl font-black text-gov-primary">All 36 Districts</div>
          <span className="text-xs text-slate-500">State-wide Grassroots Ingestion</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">
            {language === 'mr' ? 'एकूण वाचक पोहोच' : 'Estimated Print Reach'}
          </span>
          <div className="text-2xl font-black text-amber-700">3.8 Crore</div>
          <span className="text-xs text-slate-500">Across 12 Major State Dailies</span>
        </div>
      </div>

      {/* TAB 1: 516 NEWSPAPER CLIPPINGS */}
      {activeMediaTab === 'clippings' && (
        <div className="space-y-4">
          {/* Power BI Slicers & Interactive Filters */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Publication Dropdown Slicer */}
              <select
                value={selectedPublication}
                onChange={(e) => {
                  setSelectedPublication(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-blue"
              >
                <option value="all">
                  {language === 'mr' ? 'सर्व वृत्तपत्रे (१२)' : 'All Newspapers (12)'}
                </option>
                {uniquePublications.map((pub) => (
                  <option key={pub} value={pub}>
                    {pub}
                  </option>
                ))}
              </select>

              {/* Sentiment Slicer */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                {(['all', 'Positive', 'Neutral', 'Negative'] as const).map((sent) => (
                  <button
                    key={sent}
                    onClick={() => {
                      setSelectedSentiment(sent);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      selectedSentiment === sent
                        ? 'bg-gov-primary text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sent === 'all'
                      ? language === 'mr' ? 'सर्व' : 'All'
                      : sent === 'Positive'
                      ? language === 'mr' ? 'सकारात्मक' : 'Positive'
                      : sent === 'Neutral'
                      ? language === 'mr' ? 'तटस्थ' : 'Neutral'
                      : language === 'mr' ? 'नकारात्मक' : 'Negative'}
                  </button>
                ))}
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-blue"
              >
                <option value="all">{language === 'mr' ? 'सर्व विषय' : 'All Categories'}</option>
                <option value="Welfare Schemes">{language === 'mr' ? 'कल्याणकारी योजना' : 'Welfare Schemes'}</option>
                <option value="Agriculture">{language === 'mr' ? 'कृषी व शेतकरी' : 'Agriculture'}</option>
                <option value="Infrastructure">{language === 'mr' ? 'पायाभूत सुविधा' : 'Infrastructure'}</option>
                <option value="Public Health">{language === 'mr' ? 'सार्वजनिक आरोग्य' : 'Public Health'}</option>
                <option value="Education">{language === 'mr' ? 'शिक्षण' : 'Education'}</option>
                <option value="Industry & Jobs">{language === 'mr' ? 'उद्योग व रोजगार' : 'Industry & Jobs'}</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  language === 'mr'
                    ? 'कात्रण, जिल्हा किंवा मथळा शोधा...'
                    : 'Search 516 clippings...'
                }
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-blue"
              />
              <MaterialIcon
                name="search"
                size="xs"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* Active Results Counter & Reset Filter Pill */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {language === 'mr'
                ? `एकूण ५१६ पैकी ${filteredClippings.length} कात्रणे आढळली (पृष्ठ ${currentPage} / ${totalPages})`
                : `Showing ${filteredClippings.length} of 516 clippings (Page ${currentPage} of ${totalPages})`}
            </span>
            {(selectedPublication !== 'all' || selectedSentiment !== 'all' || selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedPublication('all');
                  setSelectedSentiment('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer text-xs"
              >
                {language === 'mr' ? 'सर्व फिल्टर्स रीसेट करा' : 'Reset All Filters'}
              </button>
            )}
          </div>

          {/* Clippings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedClippings.map((clipping) => (
              <div
                key={clipping.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 group cursor-pointer"
                onClick={() => setInspectingClipping(clipping)}
                style={{ backgroundColor: clipping.clippingColor }}
              >
                <div className="space-y-2.5">
                  {/* Top Bar: Publication & Page Badge */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gov-primary font-serif">
                        {language === 'mr' ? clipping.publicationMr : clipping.publication}
                      </span>
                      <span className="text-[10px] text-slate-400">• p. {clipping.pageNumber}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        clipping.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : clipping.sentiment === 'Negative'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {clipping.sentiment}
                    </span>
                  </div>

                  {/* Headline */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-gov-blue transition-colors leading-snug line-clamp-2">
                      {language === 'mr' ? clipping.headlineMr : clipping.headline}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {language === 'mr' ? clipping.summaryMr : clipping.summary}
                    </p>
                  </div>

                  {/* Metadata Tag */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="font-medium text-slate-700 bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded">
                      {clipping.category}
                    </span>
                    <span className="font-mono text-slate-400">{clipping.date}</span>
                  </div>
                </div>

                {/* Bottom District & Reach */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gov-primary flex items-center gap-1">
                    <MaterialIcon name="location_on" size="xs" />
                    <span>{language === 'mr' ? clipping.districtMr : clipping.district}</span>
                  </span>
                  <span className="font-mono text-slate-500 text-[10px]">{clipping.reach}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold cursor-pointer"
            >
              ← {language === 'mr' ? 'मागील' : 'Previous'}
            </button>
            <span className="font-mono font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold cursor-pointer"
            >
              {language === 'mr' ? 'पुढील' : 'Next'} →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: TV NEWS CHANNELS MONITORING */}
      {activeMediaTab === 'tv' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-gov-primary uppercase tracking-wider flex items-center gap-2">
              <MaterialIcon name="live_tv" size="xs" className="text-rose-600" />
              <span>
                {language === 'mr'
                  ? '६ प्रादेशिक वृत्तवाहिन्या २४x७ थेट विश्लेषण'
                  : '6 Regional TV News Channels 24x7 Broadcast Analysis'}
              </span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              All 6 Feeds Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TV_CHANNELS_DATA.map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="text-base">{ch.logo}</span>
                      <span>{language === 'mr' ? ch.nameMr : ch.name}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                      <span>{ch.liveStatus}</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      {language === 'mr' ? 'सध्या सुरू असलेला कार्यक्रम' : 'Current Program'}
                    </span>
                    <strong className="text-slate-800 text-xs mt-0.5 block">
                      {language === 'mr' ? ch.currentShowMr : ch.currentShow}
                    </strong>
                  </div>

                  {/* Live Headline Ticker */}
                  <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[10px] uppercase">
                      <MaterialIcon name="feed" size="xs" />
                      <span>{language === 'mr' ? 'थेट मथळा टिकर' : 'Live Broadcast Ticker'}</span>
                    </div>
                    <p className="text-slate-900 font-medium text-xs leading-relaxed">
                      "{language === 'mr' ? ch.headlineTickerMr : ch.headlineTicker}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Govt Share: <strong className="text-gov-primary">{ch.govtCoverageShare}</strong>
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">{ch.viewerRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA ANALYSIS */}
      {activeMediaTab === 'social' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-gov-primary uppercase tracking-wider flex items-center gap-2">
              <MaterialIcon name="analytics" size="xs" className="text-blue-600" />
              <span>
                {language === 'mr'
                  ? 'सोशल मीडिया जनभावना व नागरिक संवाद विश्लेषण'
                  : 'Social Media Sentiment Breakdown & Citizen Engagement'}
              </span>
            </span>
            <span className="text-xs text-slate-500">
              {language === 'mr' ? 'अद्ययावत: आज दुपारी' : 'Live Social Listening Ingestion'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOCIAL_MEDIA_ANALYSIS.map((platform) => (
              <div
                key={platform.platform}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{platform.platform}</h4>
                    <span className="text-xs text-slate-500 font-mono">{platform.handle}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-gov-primary block">{platform.monthlyReach}</span>
                    <span className="text-[10px] text-slate-400">Monthly Reach</span>
                  </div>
                </div>

                {/* Sentiment Distribution Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-700">{platform.positiveSentimentPercent}% Positive</span>
                    <span className="text-slate-500">{platform.neutralSentimentPercent}% Neutral</span>
                    <span className="text-rose-700">{platform.negativeSentimentPercent}% Negative</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${platform.positiveSentimentPercent}%` }}
                    />
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${platform.neutralSentimentPercent}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${platform.negativeSentimentPercent}%` }}
                    />
                  </div>
                </div>

                {/* Trending Hashtags */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    {language === 'mr' ? 'ट्रेंडिंग विषय व मोहिमा:' : 'Top Trending Topics & Mentions:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {platform.trendingTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>{topic.tag}</span>
                        <span className="text-[10px] font-mono text-blue-600 font-normal">
                          ({topic.mentions})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Realistic Newspaper Clipping Inspector Modal */}
      {inspectingClipping && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gov-primary text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm font-mono">
                  {inspectingClipping.id} — {inspectingClipping.publication} ({inspectingClipping.district})
                </span>
              </div>
              <button
                onClick={() => setInspectingClipping(null)}
                className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Clipping Content Canvas */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-50">
              {/* Simulated Newspaper Paper Clipping */}
              <div
                className="p-6 rounded-xl border border-slate-300 shadow-md space-y-4"
                style={{ backgroundColor: inspectingClipping.clippingColor }}
              >
                {/* Paper Header Masthead */}
                <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-baseline">
                  <div>
                    <h2 className="text-2xl font-black font-serif text-slate-900 tracking-tight">
                      {language === 'mr' ? inspectingClipping.publicationMr : inspectingClipping.publication}
                    </h2>
                    <span className="text-[11px] text-slate-600 font-serif italic">
                      {inspectingClipping.edition} • Page {inspectingClipping.pageNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 block">{inspectingClipping.date}</span>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      DIO Verified
                    </span>
                  </div>
                </div>

                {/* Article Headline */}
                <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug">
                  {language === 'mr' ? inspectingClipping.headlineMr : inspectingClipping.headline}
                </h3>

                {/* Article Columns */}
                <div className="text-xs text-slate-800 font-serif leading-relaxed space-y-2 border-t border-slate-200 pt-3">
                  <p className="first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1">
                    {language === 'mr' ? inspectingClipping.summaryMr : inspectingClipping.summary}
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    {language === 'mr'
                      ? 'स्थानिक जिल्हा माहिती कार्यालयाने या वृत्ताची तात्काळ नोंद घेतली असून आवश्यक वस्तुस्थितीदर्शक माहिती व शासकीय निर्णयांची प्रत स्थानिक संपादकीय मंडळाकडे अग्रेषित केली आहे.'
                      : 'The District Information Office has archived and cross-referenced this report against state database metrics. Fact-check score verified at 94.2%.'}
                  </p>
                </div>

                {/* Clipping Footer */}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Category: {inspectingClipping.category}</span>
                  <span>Estimated Readers: {inspectingClipping.reach}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500 font-mono">
                Sentiment Score: {inspectingClipping.sentimentScore} / 100
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareClipping(inspectingClipping)}
                  className="px-3.5 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MaterialIcon name="share" size="xs" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setInspectingClipping(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
