'use client';

import React, { useState, useMemo } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { PUBLICATIONS_DATA, PublicationIssue } from '@/data/publicationsData';

export const PublicationsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingIssue, setReadingIssue] = useState<PublicationIssue | null>(null);

  const filteredIssues = useMemo(() => {
    return PUBLICATIONS_DATA.filter((pub) => {
      const matchesType = selectedType === 'all' || pub.type === selectedType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        pub.title.toLowerCase().includes(q) ||
        pub.titleMr.toLowerCase().includes(q) ||
        pub.editorialTheme.toLowerCase().includes(q) ||
        pub.editorialThemeMr.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  const handleDownload = (pub: PublicationIssue) => {
    setToast({
      message:
        language === 'mr'
          ? `"${pub.titleMr}" डाउनलोड सुरू झाले आहे (${pub.fileSizeBytes}).`
          : `Downloading "${pub.title}" (${pub.fileSizeBytes})...`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1720px] w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-slate-700/80 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <MaterialIcon name="menu_book" size="xs" />
              <span>{language === 'mr' ? 'माहिती व जनसंपर्क महासंचालनालय' : 'DGIPR Maharashtra Publications'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{language === 'mr' ? 'लोकराज्य व शासकीय प्रकाशने' : 'Lokrajya & State Publications Portal'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {language === 'mr'
                ? 'शासनाच्या विकास योजना, धोरणे, सांस्कृतिक वारसा आणि लोककल्याणाचे अधिकृत मुखपत्र "लोकराज्य" व संदर्भ पुस्तिका दालन.'
                : 'Official repository of DGIPR flagship monthly magazine "Lokrajya", special editions, gazettes, and citizen scheme handbooks.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {language === 'mr' ? 'डिजिटल आवृत्त्या' : 'Total Issues'}
              </span>
              <span className="text-lg font-bold text-amber-400">80+ Years</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {language === 'mr' ? 'मासिक वाचक' : 'Monthly Readers'}
              </span>
              <span className="text-lg font-bold text-emerald-400">2.4M+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Power BI Interactive Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: language === 'mr' ? 'सर्व प्रकाशने' : 'All Publications', icon: 'auto_stories' as MaterialIconName },
            { id: 'magazine', label: language === 'mr' ? 'लोकराज्य मासिक' : 'Lokrajya Monthly', icon: 'menu_book' as MaterialIconName },
            { id: 'booklet', label: language === 'mr' ? 'माहिती पुस्तिका' : 'State Booklets', icon: 'library_books' as MaterialIconName },
            { id: 'gazette', label: language === 'mr' ? 'शासन राजपत्र' : 'Official Gazette', icon: 'gavel' as MaterialIconName },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedType === cat.id
                  ? 'bg-gov-primary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <MaterialIcon name={cat.icon} size="xs" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'अंक, विषय किंवा लेख शोधा...'
                : 'Search issues by title or theme...'
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gov-blue"
          />
          <MaterialIcon
            name="search"
            size="xs"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Featured Cover Hero Showcase */}
      {selectedType === 'all' && !searchQuery && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-bold text-gov-primary uppercase tracking-wider">
                {language === 'mr' ? 'ताज्या अंकाचे मुखपृष्ठ व प्रमुख लेख' : 'Current Featured Issue — Editor\'s Choice'}
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {language === 'mr' ? 'ऑक्टोबर २०२६ नुकताच प्रकाशित' : 'October 2026 Edition'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Realistic Magazine Cover Display */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 aspect-[3/4] bg-gradient-to-br from-amber-700 via-amber-800 to-slate-900 rounded-xl shadow-xl overflow-hidden border-2 border-amber-400/40 p-4 flex flex-col justify-between text-white group cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">DGIPR MAHARASHTRA</span>
                    <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">VOL. 80</span>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-white font-serif mt-2">लोकराज्य</h3>
                  <p className="text-[11px] text-amber-200 font-medium">LOKRAJYA MONTHLY</p>
                </div>

                <div className="my-auto py-4 text-center">
                  <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 mb-2">
                    <MaterialIcon name="auto_stories" size="lg" className="text-amber-300" />
                  </div>
                  <h4 className="text-sm font-bold text-white px-2">
                    {language === 'mr' ? 'महाराष्ट्र विकास संकल्प' : 'Maharashtra Vikas Sankalp'}
                  </h4>
                  <p className="text-[10px] text-amber-200/90 mt-1">दिवाळी महाविशेषांक २०२६</p>
                </div>

                <div className="pt-2 border-t border-white/20 flex justify-between items-center text-[10px] text-slate-300">
                  <span>९६ पृष्ठे • १८.४ MB</span>
                  <span className="font-semibold text-amber-300">मराठी आवृत्ती</span>
                </div>
              </div>
            </div>

            {/* Featured Article Highlights */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                  {PUBLICATIONS_DATA[0].issueNumber}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {language === 'mr' ? PUBLICATIONS_DATA[0].titleMr : PUBLICATIONS_DATA[0].title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'mr' ? PUBLICATIONS_DATA[0].subTitleMr : PUBLICATIONS_DATA[0].subTitle}
                </p>
              </div>

              {/* Articles List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  {language === 'mr' ? 'या अंकातील प्रमुख लेख:' : 'Featured Articles in this Issue:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PUBLICATIONS_DATA[0].featuredArticles.map((art, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-amber-50/40 hover:border-amber-200 transition-colors flex items-start justify-between gap-2"
                    >
                      <div>
                        <strong className="text-slate-800 block text-xs leading-snug">{art.title}</strong>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">{art.author}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">p. {art.page}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setReadingIssue(PUBLICATIONS_DATA[0])}
                  className="px-4 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <MaterialIcon name="visibility" size="xs" />
                  <span>{language === 'mr' ? 'ऑनलाइन अंक वाचा' : 'Read Issue Online'}</span>
                </button>
                <button
                  onClick={() => handleDownload(PUBLICATIONS_DATA[0])}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MaterialIcon name="download" size="xs" />
                  <span>{language === 'mr' ? 'पीडीएफ डाउनलोड करा (१८.४ MB)' : 'Download PDF (18.4 MB)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Issues Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gov-primary tracking-tight flex items-center gap-2">
            <MaterialIcon name="grid_view" size="xs" />
            <span>
              {language === 'mr'
                ? `उपलब्ध अंक व प्रकाशने (${filteredIssues.length})`
                : `Available Publications Archive (${filteredIssues.length})`}
            </span>
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'mr' ? 'सर्व फाइल्स अधिकृत पीडीएफ स्वरूपात उपलब्ध' : 'Verified official publications'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between h-full group"
            >
              {/* Card Header Tag */}
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {issue.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{issue.fileSizeBytes}</span>
                </div>

                <div className="min-h-[44px]">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-gov-blue transition-colors line-clamp-2 leading-snug">
                    {language === 'mr' ? issue.titleMr : issue.title}
                  </h4>
                </div>

                <div className="min-h-[34px]">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {language === 'mr' ? issue.subTitleMr : issue.subTitle}
                  </p>
                </div>

                {/* Theme Pill */}
                <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5 min-h-[46px]">
                  <MaterialIcon name="lightbulb" size="xs" className="text-amber-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 font-medium">
                    {language === 'mr' ? issue.editorialThemeMr : issue.editorialTheme}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between pt-2 border-t border-slate-100 mt-auto">
                  <span>{issue.totalPages} {language === 'mr' ? 'पृष्ठे' : 'Pages'}</span>
                  <span className="font-medium text-slate-600">{issue.language}</span>
                  <span className="font-semibold text-slate-700">{issue.editionMonth} {issue.editionYear}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 mt-auto">
                <button
                  onClick={() => setReadingIssue(issue)}
                  className="flex-1 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <MaterialIcon name="visibility" size="xs" />
                  <span>{language === 'mr' ? 'वाचा' : 'Read'}</span>
                </button>
                <button
                  onClick={() => handleDownload(issue)}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs transition-colors cursor-pointer"
                  title="Download PDF"
                >
                  <MaterialIcon name="download" size="xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Online Reader Modal */}
      {readingIssue && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gov-primary text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <MaterialIcon name="menu_book" size="sm" className="text-amber-300" />
                <div>
                  <h3 className="text-sm font-bold truncate">
                    {language === 'mr' ? readingIssue.titleMr : readingIssue.title}
                  </h3>
                  <span className="text-[11px] text-slate-300">
                    {readingIssue.issueNumber} • {readingIssue.totalPages} Pages • PDF Reader
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReadingIssue(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated Reader Canvas */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100">
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8 space-y-6">
                <div className="text-center space-y-2 border-b border-slate-200 pb-6">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest font-mono">
                    DGIPR MAHARASHTRA OFFICIAL PUBLICATION
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900">
                    {language === 'mr' ? readingIssue.titleMr : readingIssue.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {language === 'mr' ? readingIssue.subTitleMr : readingIssue.subTitle}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 text-sm">
                    {language === 'mr' ? 'संपादकीय मनोगत:' : 'Editorial Overview:'}
                  </p>
                  <p>
                    {language === 'mr'
                      ? 'महाराष्ट्राच्या सर्वांगीण विकासाची वाटचाल गतीने सुरू आहे. या विशेषांकात राज्यातील शेतकरी सन्मान निधी, महिलांचे आर्थिक सक्षमीकरण, अत्याधुनिक मेट्रो व रस्ते पायाभूत सुविधा, तसेच ग्रामीण आरोग्यासाठी राबविण्यात येणाऱ्या ऐतिहासिक योजनांचा सविस्तर आढावा प्रस्तुत करण्यात आला आहे.'
                      : 'Maharashtra continues its trailblazing journey of equitable growth and civic empowerment. This edition presents a comprehensive review of state-wide welfare dispatches, direct farmer cash transfers, landmark transport corridors, and healthcare access initiatives.'}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <strong className="text-xs font-bold text-gov-primary block">
                      {language === 'mr' ? 'या अंकातील प्रमुख लेख व सूची:' : 'Table of Contents & Key Articles:'}
                    </strong>
                    <ul className="space-y-2">
                      {readingIssue.featuredArticles.map((art, i) => (
                        <li key={i} className="flex justify-between items-center text-xs border-b border-slate-100 pb-1">
                          <span className="font-medium text-slate-800">{art.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono">p. {art.page}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500">
                {language === 'mr' ? 'अधिकृत शासकीय प्रकाशन प्रत' : 'Verified government electronic publication'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(readingIssue)}
                  className="px-4 py-2 bg-gov-primary text-white rounded-lg text-xs font-bold hover:bg-gov-primary-dark transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MaterialIcon name="download" size="xs" />
                  <span>{language === 'mr' ? 'पीडीएफ सेव्ह करा' : 'Save PDF'}</span>
                </button>
                <button
                  onClick={() => setReadingIssue(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
