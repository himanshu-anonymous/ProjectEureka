'use client';

import React, { useState, useEffect } from 'react';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import {
  getLocalizedDepartment,
  getLocalizedPressReleaseTitle,
  getLocalizedStatus,
} from '@/lib/dataLocalization';
import {
  LokrajyaIssue,
  LOKRAJYA_LANGUAGES,
  getLokrajyaIssuesForLanguage,
} from '@/data/lokrajyaArchiveData';
import { LokrajyaPDFViewerModal } from '@/components/portal/LokrajyaPDFViewerModal';

type ReleaseFilter = 'All' | 'Published' | 'Under Review' | 'Draft';

interface PressReleaseItem {
  id: string;
  title: string;
  department: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Draft';
  downloads: number;
  district?: string;
  tatMinutes?: number;
}

export const PressReleasesScreen: React.FC = () => {
  const { language, userRole } = useDashboardStore();
  const [activeSection, setActiveSection] = useState<'releases' | 'lokrajya'>('releases');
  const [selectedLokrajyaLang, setSelectedLokrajyaLang] = useState<
    'marathi' | 'english' | 'hindi' | 'urdu' | 'gujarati'
  >('marathi');
  const [previewingIssue, setPreviewingIssue] = useState<LokrajyaIssue | null>(null);

  // Sync tab and language from URL search parameters if directly navigated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab');
      if (tab === 'lokrajya') {
        setActiveSection('lokrajya');
      }
      const lang = searchParams.get('lang');
      if (lang && ['marathi', 'english', 'hindi', 'urdu', 'gujarati'].includes(lang)) {
        setSelectedLokrajyaLang(lang as any);
      }
    }
  }, []);

  const [filter, setFilter] = useState<ReleaseFilter>('All');
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  // 1 Year of Lokrajya issues for the chosen language (12 issues)
  const currentLokrajyaIssues = getLokrajyaIssuesForLanguage(selectedLokrajyaLang);

  // Draft form state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDept, setDraftDept] = useState('Agriculture Department');
  const [draftContent, setDraftContent] = useState('');
  const [draftSubmitted, setDraftSubmitted] = useState(false);

  const initialReleases: PressReleaseItem[] = DEPARTMENTS_DATA.flatMap((d) =>
    d.pressReleases.map((pr) => ({
      ...pr,
      department: d.name,
      district: pr.district || 'State HQ',
      tatMinutes: pr.tatMinutes || 30,
    }))
  );

  const [releasesList, setReleasesList] = useState<PressReleaseItem[]>(initialReleases);

  const isLeadershipRole = userRole === 'dg_admin' || userRole === 'director_konkan';

  const filtered = releasesList.filter((pr) => {
    const matchesFilter = filter === 'All' || pr.status === filter;
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()) ||
      (pr.district && pr.district.toLowerCase().includes(search.toLowerCase())) ||
      pr.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: ReleaseFilter[] = ['All', 'Published', 'Under Review', 'Draft'];

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // Increment download counter
      setReleasesList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
      );
    }, 1200);
  };

  const handleApprove = (id: string) => {
    setReleasesList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Published' as const } : r))
    );
  };

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    const newRelease: PressReleaseItem = {
      id: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: draftTitle,
      department: draftDept,
      date: language === 'mr' ? 'आज, १४:४०' : 'Today, 14:40 IST',
      status: 'Under Review',
      downloads: 0,
    };

    setReleasesList([newRelease, ...releasesList]);
    setDraftSubmitted(true);
    setTimeout(() => {
      setDraftSubmitted(false);
      setIsDraftModalOpen(false);
      setDraftTitle('');
      setDraftContent('');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="description" size="md" className="text-gov-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              {language === 'mr' ? 'राज्य प्रसिद्धीपत्रक वितरण प्रणाली' : 'State Press Release Distribution Pipeline'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'अधिकृत प्रसिद्धीपत्रके, मंत्रालयीन माहिती आणि अधिकृत माध्यम फीड'
              : 'Official Press Notes, Ministerial Dispatches & Accredited Media Feeds'}
          </p>
        </div>

        <button
          onClick={() => setIsDraftModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <MaterialIcon name="add" size="xs" className="text-amber-400" />
          <span>
            {isLeadershipRole
              ? (language === 'mr' ? 'राज्य निर्देश / प्रसिद्धी टिपण जारी करा' : 'Issue State Directive / Press Note')
              : (language === 'mr' ? '+ नवीन स्थानिक प्रसिद्धीपत्रक मसुदा' : '+ Draft Local Press Release')}
          </span>
        </button>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSection('releases')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-md font-bold text-xs transition-all cursor-pointer ${
            activeSection === 'releases'
              ? 'bg-gov-primary text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <MaterialIcon name="feed" size="xs" />
          <span>
            {language === 'mr'
              ? 'शासकीय प्रसिद्धीपत्रके (प्रेस रिलिज)'
              : 'Official Dispatches & Press Releases'}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeSection === 'releases' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {releasesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('lokrajya')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-md font-bold text-xs transition-all cursor-pointer ${
            activeSection === 'lokrajya'
              ? 'bg-gov-primary text-white shadow-2xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-t border-x border-slate-200'
          }`}
        >
          <MaterialIcon name="menu_book" size="xs" className={activeSection === 'lokrajya' ? 'text-white' : 'text-slate-500'} />
          <span>
            {language === 'mr'
              ? 'लोकराज्य मासिक — ५ भाषांचे १ वर्षाचे संग्रह'
              : 'Lokrajya Magazine — 5 Languages 1-Year Archive'}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeSection === 'lokrajya' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {language === 'mr' ? '६० अंक • ५ भाषा' : '60 Issues • 5 Langs'}
          </span>
        </button>
      </div>

      {activeSection === 'lokrajya' ? (
        /* ========================================================================= */
        /* LOKRAJYA 5-LANGUAGE 1-YEAR ARCHIVE (12 ISSUES X 5 LANGUAGES = 60 ISSUES) */
        /* ========================================================================= */
        <div className="space-y-4">
          {/* Lokrajya Banner Info - Clean Government Slate Theme */}
          <div className="bg-[#0B1120] border border-slate-800 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                    DGIPR Maharashtra Official Publication
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Est. 1947 • RNI No. 2489/57
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>लोकराज्य — महाराष्ट्र शासनाचे अधिकृत मासिक</span>
                  <span className="text-slate-400 text-sm font-normal">| Lokrajya Digital Archive</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'mr'
                    ? 'माहिती व जनसंपर्क महासंचालनालयातर्फे प्रकाशित होणारे लोकराज्य मासिक सर्व ५ अधिकृत भाषांमध्ये उपलब्ध आहे. मागील संपूर्ण एका वर्षाचे (नोव्हेंबर २०२५ ते ऑक्टोबर २०२६) सर्व १२ मासिक अंक येथे भाषावार उपलब्ध असून थेट नमुना पीडीएफ वाचन व डाउनलोड करता येईल.'
                    : 'Published by Directorate General of Information & Public Relations (DGIPR), Lokrajya monthly magazine is provided in all 5 official languages. Access complete 1-year archive (Nov 2025 – Oct 2026, 12 monthly issues per language, 60 total) with sample PDF viewer and official download.'}
                </p>
              </div>

              {/* Quick stats box */}
              <div className="grid grid-cols-3 gap-2 bg-slate-800/80 border border-slate-700 rounded-lg p-2.5 sm:p-3 text-center min-w-[280px]">
                <div>
                  <div className="text-lg font-black text-white font-mono">५</div>
                  <div className="text-[10px] text-slate-400 font-medium">{language === 'mr' ? 'भाषा' : 'Languages'}</div>
                </div>
                <div className="border-x border-slate-700">
                  <div className="text-lg font-black text-blue-400 font-mono">१२</div>
                  <div className="text-[10px] text-slate-400 font-medium">{language === 'mr' ? 'मासिक अंक/भाषा' : 'Issues/Lang'}</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-400 font-mono">६०</div>
                  <div className="text-[10px] text-slate-400 font-medium">{language === 'mr' ? 'एकूण पीडीएफ' : 'Total PDFs'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Languages Segregated Filter Tabs */}
          <div className="bg-surface border border-slate-200 rounded-lg p-3 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MaterialIcon name="language" size="xs" className="text-gov-primary" />
                <span>{language === 'mr' ? 'भाषा निवडा (५ अधिकृत भाषांमध्ये उपलब्ध)' : 'Select Language (Segregated 5 Languages)'}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {language === 'mr' ? '१ वर्षाचा संग्रह • १२ महिने उपलब्ध' : '1 Year Archive • 12 Monthly Issues'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {LOKRAJYA_LANGUAGES.map((lang) => {
                const isSelected = selectedLokrajyaLang === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLokrajyaLang(lang.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gov-primary text-white border-gov-primary shadow-sm ring-2 ring-gov-primary/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-wide">{lang.label}</span>
                    <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {lang.name}
                    </span>
                    <span
                      className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {language === 'mr' ? '१२ मासिक अंक' : '12 Monthly Issues'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1 Year Issues Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                {language === 'mr'
                  ? `${LOKRAJYA_LANGUAGES.find((l) => l.id === selectedLokrajyaLang)?.label} लोकराज्य — मागील १ वर्ष (१२ मासिक अंक)`
                  : `${LOKRAJYA_LANGUAGES.find((l) => l.id === selectedLokrajyaLang)?.name} Lokrajya — Full 1-Year Archive (12 Monthly Issues)`}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-mono text-[11px]">
                Nov 2025 — Oct 2026
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">
                {language === 'mr' ? 'सर्व अंक पीडीएफ स्वरूपात प्रमाणित' : 'All Issues Verified DGIPR Digital PDFs'}
              </span>
            </div>
          </div>

          {/* 12-Month Issues Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentLokrajyaIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Visual Magazine Cover Header */}
                <div
                  className={`bg-gradient-to-br ${issue.coverGradient} p-4 text-white relative min-h-[140px] flex flex-col justify-between overflow-hidden`}
                >
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                  <div className="flex items-center justify-between text-[10px] text-white/80 font-mono">
                    <span className="bg-black/25 px-1.5 py-0.5 rounded font-bold">
                      {issue.volume}
                    </span>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded uppercase">
                      {issue.year}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                      {language === 'mr' ? 'माहिती व जनसंपर्क महासंचालनालय' : 'Govt of Maharashtra • DGIPR'}
                    </div>
                    <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {language === 'mr' ? issue.titleMr : issue.title}
                    </h4>
                    <p className="text-[11px] text-white/90 line-clamp-1 mt-1 font-medium">
                      🎯 {language === 'mr' ? issue.themeMr : issue.theme}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/90 pt-1 border-t border-white/20">
                    <span className="font-bold">{language === 'mr' ? issue.monthMr : issue.month}</span>
                    <span className="bg-white/25 px-1.5 py-0.5 rounded font-mono">
                      {issue.pages} {language === 'mr' ? 'पृष्ठे' : 'Pages'} • {issue.fileSizeBytes}
                    </span>
                  </div>
                </div>

                {/* Issue Highlights & Articles */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MaterialIcon name="article" size="xs" className="text-gov-primary" />
                      <span>{language === 'mr' ? 'अंकातील मुख्य विशेष लेख:' : 'Key Feature Articles:'}</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {(language === 'mr' ? issue.highlightsMr : issue.highlights).slice(0, 3).map((art: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-gov-primary font-bold">•</span>
                          <span>{art}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>PDF Sample {issue.year}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                    </span>
                  </div>

                  {/* Actions: View Sample PDF & Download */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewingIssue(issue)}
                      className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <MaterialIcon name="visibility" size="xs" />
                      <span>{language === 'mr' ? 'नमुना पहा' : 'View Sample'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleDownload(issue.id);
                        // Trigger client file download simulation
                        const element = document.createElement('a');
                        const file = new Blob([
                          `MAHARASHTRA STATE DGIPR - LOKRAJYA MONTHLY ARCHIVE\nIssue: ${issue.title} (${issue.month})\nLanguage: ${issue.language}\nVolume: ${issue.volume}\nPages: ${issue.pages}\nTheme: ${issue.theme}\nHighlights:\n- ${issue.highlights.join('\n- ')}\n\nThis is the official digital sample document for Lokrajya publication.`
                        ], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = issue.downloadFileName.replace('.pdf', '.txt');
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      className="flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <MaterialIcon name="download" size="xs" className="text-slate-600" />
                      <span>{language === 'mr' ? 'डाउनलोड' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* STANDARD OFFICIAL PRESS RELEASES LEDGER TABLE                             */
        /* ========================================================================= */
        <>
          {/* Filters and Search Bar */}
          <div className="bg-surface border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    filter === tab
                      ? 'bg-gov-primary text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'All'
                    ? (language === 'mr' ? 'सर्व' : 'All')
                    : getLocalizedStatus(tab, language)}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <MaterialIcon name="search" size="xs" className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={language === 'mr' ? 'शीर्षक, विभाग किंवा आयडीने शोधा...' : 'Search by title, dept, or ID...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-gov-blue text-slate-800"
              />
            </div>
          </div>

          {/* Releases Table */}
          <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक नोंदवही' : 'Official Dispatches Ledger'}
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {language === 'mr' ? `${filtered.length} प्रसिद्धीपत्रके उपलब्ध` : `${filtered.length} Dispatches Listed`}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <MaterialIcon name="description" size="xl" className="text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              {language === 'mr' ? 'कोणतीही प्रसिद्धीपत्रके जुळत नाहीत' : 'No press releases match your filter'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'mr'
                ? 'कृपया शोध शब्द तपासा किंवा सर्व प्रसिद्धीपत्रके निवडा.'
                : 'Try adjusting your search query or switching to All dispatches.'}
            </p>
            <button
              onClick={() => {
                setFilter('All');
                setSearch('');
              }}
              className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
            >
              {language === 'mr' ? 'फिल्टर पूर्ववत करा' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'पीआर आयडी' : 'PR ID'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'शीर्षक व विषय' : 'Title & Subject'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'विभाग' : 'Department'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'जिल्हा' : 'District'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'दिनांक' : 'Release Date'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'प्रकाशन TAT (SLA)' : 'Publish TAT (SLA)'}</th>
                  <th className="py-2.5 px-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-right">{language === 'mr' ? 'डाउनलोड्स' : 'Downloads'}</th>
                  <th className="py-2.5 px-3 text-center">{language === 'mr' ? 'कृती' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map((pr) => {
                  const isDownloading = downloadingId === pr.id;
                  const localizedTitle = getLocalizedPressReleaseTitle(pr.id, pr.title, language);
                  const localizedDept = getLocalizedDepartment(pr.department, language);
                  const tat = pr.tatMinutes || 35;

                  return (
                    <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{pr.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-md">{localizedTitle}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">{localizedDept}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-medium">{pr.district || 'State HQ'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{pr.date}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-bold text-slate-900">{tat}m</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap ${
                              tat <= 45
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tat <= 120
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {tat <= 45
                              ? language === 'mr'
                                ? 'विहित वेळेत'
                                : 'SLA Met (≤45m)'
                              : tat <= 120
                              ? language === 'mr'
                                ? 'विलंबित'
                                : 'Degraded'
                              : language === 'mr'
                              ? 'उल्लंघन'
                              : 'Breached'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center justify-start gap-1.5 text-xs font-semibold whitespace-nowrap text-slate-700">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              pr.status === 'Published'
                                ? 'bg-emerald-500'
                                : pr.status === 'Under Review'
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-slate-400'
                            }`}
                          />
                          <span
                            className={
                              pr.status === 'Published'
                                ? 'text-emerald-700'
                                : pr.status === 'Under Review'
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {getLocalizedStatus(pr.status, language)}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        <div className="flex flex-col items-end gap-0.5">
                          <span>{pr.downloads}</span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.round((pr.downloads / 600) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {pr.status === 'Under Review' ? (
                          isLeadershipRole ? (
                            <button
                              onClick={() => handleApprove(pr.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border border-amber-300 bg-amber-50 text-amber-800 rounded font-semibold hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
                              title="Review and approve draft dispatch"
                            >
                              <MaterialIcon name="verified_user" size="xs" className="text-amber-600" />
                              <span>{language === 'mr' ? 'पुनरावलोकन व मंजुरी' : 'Review & Approve'}</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span>{language === 'mr' ? 'मंजुरी प्रलंबित' : 'Pending Approval'}</span>
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => handleDownload(pr.id)}
                            disabled={isDownloading}
                            aria-label={`Download PDF for ${localizedTitle}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] border rounded transition-colors shadow-2xs cursor-pointer ${
                              isDownloading
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <MaterialIcon name="check" size="xs" className="text-emerald-600" />
                                <span>{language === 'mr' ? 'डाउनलोड केले' : 'Downloaded'}</span>
                              </>
                            ) : (
                              <>
                                <MaterialIcon name="download" size="xs" className="text-slate-500" />
                                <span>{language === 'mr' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {/* Drafting Modal */}
      {isDraftModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 transition-opacity duration-150 ease-out"
        >
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-5 space-y-4 shadow-xl transition-all duration-150 ease-out">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-gov-primary" />
                <h3 className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रक मसुदा तयार करा' : 'Draft Official Press Release'}
                </h3>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'प्रसिद्धीपत्रक शीर्षक / विषय' : 'Release Headline / Subject'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'mr'
                      ? 'उदा. राज्य मंत्रिमंडळ बैठकीत महत्वपूर्ण निर्णयांना मंजुरी...'
                      : 'e.g. State cabinet approves key infrastructure initiatives...'
                  }
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संबंधित विभाग' : 'Originating Department'}
                </label>
                <select
                  value={draftDept}
                  onChange={(e) => setDraftDept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue cursor-pointer"
                >
                  <option value="Agriculture Department">
                    {language === 'mr' ? 'कृषी विभाग' : 'Agriculture Department'}
                  </option>
                  <option value="Public Health Department">
                    {language === 'mr' ? 'सार्वजनिक आरोग्य विभाग' : 'Public Health Department'}
                  </option>
                  <option value="Home Department">
                    {language === 'mr' ? 'गृह विभाग' : 'Home Department'}
                  </option>
                  <option value="Revenue & Forest Department">
                    {language === 'mr' ? 'महसूल व वन विभाग' : 'Revenue & Forest Department'}
                  </option>
                  <option value="CMO Press Wing">
                    {language === 'mr' ? 'मुख्यमंत्री कार्यालय कक्ष' : 'CMO Press Wing'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'संक्षिप्त प्रसिद्धीपत्रक सारांश' : 'Brief Dispatch Summary'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    language === 'mr'
                      ? 'तपशीलवार प्रसिद्धीपत्रक किंवा घोषणा सारांश प्रविष्ट करा...'
                      : 'Enter detailed press notes or gazette summary...'
                  }
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-gov-blue text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={draftSubmitted}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    draftSubmitted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
                  }`}
                >
                  {draftSubmitted ? (
                    <>
                      <MaterialIcon name="check" size="xs" />
                      <span>{language === 'mr' ? 'पुनरावलोकनासाठी सादर' : 'Submitted for Review'}</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="send" size="xs" />
                      <span>{language === 'mr' ? 'संपादकीय पुनरावलोकनासाठी पाठवा' : 'Submit for Editorial Review'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lokrajya PDF Interactive Viewer Modal */}
      {previewingIssue && (
        <LokrajyaPDFViewerModal
          issue={previewingIssue}
          language={language}
          onClose={() => setPreviewingIssue(null)}
        />
      )}
    </div>
  );
};
