'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { LokrajyaIssue } from '@/data/lokrajyaArchiveData';

interface LokrajyaPDFViewerModalProps {
  issue: LokrajyaIssue | null;
  onClose: () => void;
  language: string;
}

export const LokrajyaPDFViewerModal: React.FC<LokrajyaPDFViewerModalProps> = ({
  issue,
  onClose,
  language,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'reader' | 'toc'>('reader');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!issue) return null;

  const totalPages = issue.pages;

  const sampleArticles = [
    { page: 1, titleEn: 'Editor’s Desk: Vision for a Prosperous Maharashtra', titleMr: 'संपादकीय: समृद्ध, समर्थ आणि स्वाभिमानी महाराष्ट्र' },
    { page: 4, titleEn: 'Special Feature: Chief Minister’s Flagship Welfare Directive', titleMr: 'विशेष वृत्त: मुख्यमंत्री जनकल्याणकारी योजनांचे प्रत्यक्ष फलित' },
    { page: 18, titleEn: 'Infrastructure Frontier: State Highway Network Milestone', titleMr: 'पायाभूत विकास: समृद्धी व सागरी महामार्गाचा मैलाचा दगड' },
    { page: 34, titleEn: 'Women & Child Development: Majhi Ladki Bahin Realities', titleMr: 'महिला व बालविकास: माझी लाडकी बहीण योजनेची यशस्वी वाटचाल' },
    { page: 52, titleEn: 'Agrarian Solace: Jalyukta Shivar & Micro-Irrigation Surge', titleMr: 'कृषी संजीवनी: जलयुक्त शिवार २.० आणि ठिबक सिंचन क्रांती' },
    { page: 70, titleEn: 'Heritage & Forts: Chhatrapati Shivaji Maharaj UNESCO Quest', titleMr: 'ऐतिहासिक वारसा: शिवकालीन गडकिल्ल्यांचे जागतिक नामांक' },
    { page: 86, titleEn: 'Government Resolutions (GRs) Gazette & Legal Digest', titleMr: 'महत्त्वाचे शासन निर्णय व परिपत्रके संकलन' },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      // Create sample downloadable PDF text blob
      const samplePdfContent = `%PDF-1.4
% Lokrajya Magazine DGIPR Maharashtra
% Title: ${issue.title}
% Edition: ${issue.language.toUpperCase()} - ${issue.month} ${issue.year}
% Volume: ${issue.volume}
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
50 720 Td
(GOVERNMENT OF MAHARASHTRA - DGIPR) Tj
/F1 18 Tf
0 -36 Td
(${issue.title.replace(/[()]/g, '')}) Tj
/F1 12 Tf
0 -24 Td
(Official Lokrajya Sample PDF - 1 Year Archive Sample) Tj
0 -18 Td
(Language Edition: ${issue.language.toUpperCase()} | Month: ${issue.month} ${issue.year}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000068 00000 n 
0000000125 00000 n 
0000000207 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
457
%%EOF`;

      const blob = new Blob([samplePdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = issue.downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] max-h-[880px] flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <MaterialIcon name="menu_book" size="sm" className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight truncate text-white">
                  {issue.title}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shrink-0">
                  {issue.language.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {issue.volume} • {issue.month} {issue.year} • {issue.pages} Pages • {issue.fileSizeBytes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3.5 py-1.5 bg-gov-blue hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
            >
              <MaterialIcon name="download" size="xs" />
              <span>{isDownloading ? (language === 'mr' ? 'डाउनलोड होत आहे...' : 'Downloading...') : (language === 'mr' ? 'पीडीएफ डाउनलोड' : 'Download PDF')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-lg leading-none"
              title="Close viewer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewer Sub-toolbar: Pagination, Zoom & Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0 select-none">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-gov-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? 'वाचन पृष्ठ' : 'Document Page'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('toc')}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                activeTab === 'toc'
                  ? 'bg-gov-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? 'अनुक्रमणिका' : 'Table of Contents'}
            </button>
          </div>

          {activeTab === 'reader' && (
            <div className="flex items-center gap-4">
              {/* Pagination controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs font-mono font-bold"
                >
                  &larr;
                </button>
                <span className="font-mono text-xs font-semibold px-2">
                  {language === 'mr' ? 'पृष्ठ' : 'Page'} <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs font-mono font-bold"
                >
                  &rarr;
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs font-bold"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="font-mono text-[11px] w-12 text-center text-slate-600 font-bold">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs font-bold"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Document Content Canvas */}
        <div className="flex-1 bg-slate-200/70 p-4 sm:p-6 overflow-auto flex items-center justify-center">
          {activeTab === 'reader' ? (
            <div
              className="bg-white rounded-xl shadow-xl border border-slate-300 w-full max-w-[640px] aspect-[1/1.414] p-8 flex flex-col justify-between transition-transform duration-200 select-text"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {currentPage === 1 ? (
                /* Cover Page Simulation */
                <div className={`w-full h-full rounded-lg bg-gradient-to-br ${issue.coverGradient} text-white p-6 flex flex-col justify-between border-2 border-amber-400/40 shadow-inner`}>
                  <div className="flex justify-between items-start border-b border-white/20 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                      DGIPR MAHARASHTRA • OFFICIAL MAGAZINE
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                      {issue.volume}
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center space-y-3">
                    <h2 className="text-4xl sm:text-5xl font-black font-serif tracking-tight text-white drop-shadow-md">
                      {issue.language === 'marathi' ? 'लोकराज्य' : issue.language === 'urdu' ? 'لوک راجیہ' : issue.language === 'gujarati' ? 'લોકરાજ્ય' : 'LOKRAJYA'}
                    </h2>
                    <p className="text-xs uppercase font-bold tracking-widest text-amber-300">
                      {issue.language.toUpperCase()} EDITION • {issue.month.toUpperCase()} {issue.year}
                    </p>
                    <div className="max-w-md mx-auto p-4 rounded-xl bg-black/30 backdrop-blur-xs border border-white/20 text-left space-y-2 mt-4">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        {language === 'mr' ? 'प्रमुख महाविशेषांक विषय:' : 'Lead Edition Theme:'}
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {issue.theme}
                      </h3>
                      <ul className="text-xs text-slate-200 list-disc list-inside space-y-1 pt-1">
                        {(language === 'mr' ? issue.highlightsMr : issue.highlights).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-300 border-t border-white/20 pt-2">
                    <span>{issue.pages} Pages • Sample PDF Ingestion</span>
                    <span className="font-semibold text-amber-300">Director General of Information & PR</span>
                  </div>
                </div>
              ) : (
                /* Interior Editorial Article Page */
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>LOKRAJYA • {issue.month.toUpperCase()} {issue.year}</span>
                    <span className="uppercase">{issue.language} EDITION</span>
                  </div>

                  <div className="space-y-4 my-auto py-4">
                    <span className="text-xs uppercase font-bold text-blue-700 tracking-wider block">
                      {language === 'mr' ? 'महाराष्ट्र शासन अधिकृत वृत्तांत' : 'Official State Dispatch'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {sampleArticles[(currentPage - 2) % sampleArticles.length].titleEn}
                    </h3>
                    <p className="text-xs font-serif text-slate-600 leading-relaxed text-justify">
                      {language === 'mr'
                        ? 'महाराष्ट्र शासनाच्या लोककल्याणकारी योजनांची पारदर्शक अंमलबजावणी व तळागाळातील नागरिकांपर्यंत पोहोचविणे हा लोकराज्य मासिकाचा मुख्य उद्देश आहे. या अंकातून राज्यातील सामाजिक, आर्थिक आणि पायाभूत विकासाचा समग्र आढावा अधिकृत सांख्यिकीसह मांडण्यात आला आहे.'
                        : 'The Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra presents this comprehensive monthly digest examining key governance reforms, direct benefit transfers, infrastructure achievements, and social empowerment initiatives.'}
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                      <strong className="block text-slate-900 font-sans">
                        {language === 'mr' ? 'प्रमुख सांख्यिकी ठळक मुद्दे:' : 'Key Policy Statistics:'}
                      </strong>
                      <p className="text-[11px] text-slate-600">
                        • Verified beneficiaries covered under DBT: 1.84 Crore citizens across 36 districts.
                      </p>
                      <p className="text-[11px] text-slate-600">
                        • Statutory SLA grievance redressal attainment: 98.4% resolved within 4-hour window.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>DGIPR Government of Maharashtra</span>
                    <span className="font-bold text-slate-800">Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Table of Contents View */
            <div className="bg-white rounded-xl shadow-md border border-slate-200 w-full max-w-2xl p-6 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'मासिकातील प्रमुख लेखांची अनुक्रमणिका' : 'Issue Table of Contents & Key Articles'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {issue.title} — {issue.volume}
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {sampleArticles.map((art) => (
                  <div
                    key={art.page}
                    onClick={() => {
                      setCurrentPage(art.page);
                      setActiveTab('reader');
                    }}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {art.page}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                        {language === 'mr' ? art.titleMr : art.titleEn}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono group-hover:text-blue-600 flex items-center gap-1 shrink-0">
                      <span>Jump</span>
                      <span>→</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
