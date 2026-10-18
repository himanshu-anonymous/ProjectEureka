'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { KONKAN_DAILY_OPERATIONS_REPORT } from '@/lib/serverData';

interface ReportItem {
  id: string;
  titleEn: string;
  titleMr: string;
  typeEn: string;
  typeMr: string;
  periodEn: string;
  periodMr: string;
  format: string;
  size: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'RPT-MAHA-2026-01',
    titleEn: 'Divisional Information Office Daily Operations Report',
    titleMr: 'विभागीय माहिती कार्यालय दैनंदिन कामकाज अहवाल',
    typeEn: 'Daily Operations Digest',
    typeMr: 'दैनंदिन कामकाज सारांश',
    periodEn: 'Oct 13, 2026',
    periodMr: '१३ ऑक्टोबर २०२६',
    format: 'PDF & XLSX',
    size: '3.8 MB',
  },
  {
    id: 'RPT-MAHA-2026-02',
    titleEn: 'State 100-Point Performance Index & SLA Audit',
    titleMr: 'राज्य १००-गुण कामगिरी निर्देशांक आणि एसएलए लेखापरीक्षण',
    typeEn: '100-Point Index',
    typeMr: '१००-गुण निर्देशांक',
    periodEn: 'Q3 2026',
    periodMr: 'तिमाही ३, २०२६',
    format: 'PDF',
    size: '4.6 MB',
  },
  {
    id: 'RPT-MAHA-2026-03',
    titleEn: 'Coastal Infrastructure Press Release Coverage Audit',
    titleMr: 'किनारपट्टी पायाभूत सुविधा प्रसिद्धीपत्रक कव्हरेज लेखापरीक्षण',
    typeEn: 'District Audit',
    typeMr: 'जिल्हा लेखापरीक्षण',
    periodEn: 'Oct 01 - Oct 12, 2026',
    periodMr: '०१ ऑक्टोबर - १२ ऑक्टोबर २०२६',
    format: 'PDF',
    size: '2.4 MB',
  },
  {
    id: 'RPT-MAHA-2026-04',
    titleEn: '21 Line Departments PR & Social Media Amplification Report',
    titleMr: '२१ संबंधित विभाग जनसंपर्क आणि सोशल मीडिया प्रसार अहवाल',
    typeEn: 'Departmental Audit',
    typeMr: 'विभागीय लेखापरीक्षण',
    periodEn: 'October 2026',
    periodMr: 'ऑक्टोबर २०२६',
    format: 'PDF & CSV',
    size: '5.1 MB',
  },
];

export const ReportsScreen: React.FC = () => {
  const { language } = useDashboardStore();
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'lineDepts' | 'vip' | 'social'>('lineDepts');
  const [deptSearch, setDeptSearch] = useState('');
  const [deptPage, setDeptPage] = useState(1);
  const DEPT_PAGE_SIZE = 7;

  const filteredDepts = KONKAN_DAILY_OPERATIONS_REPORT.lineDepartmentsCoverage.filter((dept) => {
    if (!deptSearch.trim()) return true;
    const q = deptSearch.toLowerCase();
    return (
      dept.department.toLowerCase().includes(q) ||
      dept.departmentMr.toLowerCase().includes(q) ||
      dept.highlight.toLowerCase().includes(q) ||
      dept.highlightMr.toLowerCase().includes(q)
    );
  });

  const totalDeptPages = Math.ceil(filteredDepts.length / DEPT_PAGE_SIZE) || 1;
  const currentDeptPage = Math.min(deptPage, totalDeptPages);
  const pagedDepts = filteredDepts.slice(
    (currentDeptPage - 1) * DEPT_PAGE_SIZE,
    currentDeptPage * DEPT_PAGE_SIZE
  );

  const getDeptStatus = (releases: number) => {
    if (releases >= 4) {
      return {
        labelEn: 'Live Published',
        labelMr: 'थेट प्रकाशित',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-700',
      };
    }
    if (releases === 3) {
      return {
        labelEn: 'Dispatched',
        labelMr: 'वितरित',
        dotClass: 'bg-sky-500',
        textClass: 'text-sky-700',
      };
    }
    return {
      labelEn: 'Under Synthesis',
      labelMr: 'संश्लेषणाधीन',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-700',
    };
  };

  // Custom report form state
  const [reportType, setReportType] = useState('Daily Media Summary');
  const [reportDivision, setReportDivision] = useState('All Maharashtra');
  const [reportFormat, setReportFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const handleGenerateDossier = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const idNum = Math.floor(105 + Math.random() * 800);
      const newReport: ReportItem = {
        id: `RPT-MAHA-${idNum}`,
        titleEn: `${reportType} (${reportDivision})`,
        titleMr: `${reportType === 'Daily Media Summary' ? 'दैनंदिन प्रसारमाध्यम सारांश' : reportType === 'District CPI Scorecard' ? 'जिल्हा सीपीआय गुणपत्रिका' : reportType === 'Crisis SLA Audit' ? 'आपत्कालीन एसएलए लेखापरीक्षण' : 'विभागीय मीडिया लेखापरीक्षण'} (${reportDivision})`,
        typeEn: reportType.includes('Index') || reportType.includes('Scorecard') ? '100-Point Index' : 'Custom Dossier',
        typeMr: reportType.includes('Index') || reportType.includes('Scorecard') ? '१००-गुण निर्देशांक' : 'सानुकूल डॉसियर',
        periodEn: 'Generated Just Now',
        periodMr: 'आत्ताच तयार केले',
        format: reportFormat,
        size: '5.2 MB',
      };

      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setIsGenerateModalOpen(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="bar_chart" size="sm" className="text-gov-primary" />
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              {language === 'mr'
                ? 'प्रशासकीय गुप्तवार्ता अहवाल व कार्यकारी डॉसियर'
                : 'Intelligence Reports & Executive Dossiers'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'विभागीय माहिती कार्यालय • २१ संबंधित विभाग, व्हीआयपी कार्यक्रम कव्हरेज आणि १००-गुण निर्देशांक डॉसियर'
              : 'Divisional Information Office • 21 Line Departments, VIP Program Coverage, & 100-Point Index Dossiers'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <MaterialIcon name="add" size="xs" className="text-amber-400" />
          <span>{language === 'mr' ? 'नवीन डॉसियर तयार करा' : 'Generate Dossier'}</span>
        </button>
      </div>

      {/* Official Daily Operations Card (Excel Ingested) */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-gov-primary/5 via-emerald-50/20 to-transparent flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>{language === 'mr' ? 'अधिकृत अहवाल संकलन' : 'Official Operations Report'}</span>
              </span>
              <h3 className="font-bold text-sm text-gov-primary">
                {language === 'mr' ? KONKAN_DAILY_OPERATIONS_REPORT.officeMr : KONKAN_DAILY_OPERATIONS_REPORT.office}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {language === 'mr' ? (
                <>
                  अहवाल दिनांक: <strong className="text-slate-800">{KONKAN_DAILY_OPERATIONS_REPORT.reportDateMr}</strong> • जिल्हे: पालघर, ठाणे, रायगड, रत्नागिरी, सिंधुदुर्ग
                </>
              ) : (
                <>
                  Report Date: <strong className="text-slate-800">{KONKAN_DAILY_OPERATIONS_REPORT.reportDate}</strong> • Districts: Palghar, Thane, Raigad, Ratnagiri, Sindhudurg
                </>
              )}
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setActiveReportTab('lineDepts')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeReportTab === 'lineDepts'
                  ? 'bg-gov-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? '२१ संबंधित विभाग' : '21 Line Departments'}
            </button>
            <button
              onClick={() => setActiveReportTab('vip')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeReportTab === 'vip'
                  ? 'bg-gov-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? 'व्हीआयपी कार्यक्रम कव्हरेज' : 'VIP Event Coverage'}
            </button>
            <button
              onClick={() => setActiveReportTab('social')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeReportTab === 'social'
                  ? 'bg-gov-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'mr' ? 'सोशल मीडिया पोहोच' : 'Social Media Reach'}
            </button>
          </div>
        </div>

        {/* Tab 1: Line Departments Table */}
        {activeReportTab === 'lineDepts' && (
          <div className="space-y-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-2.5 px-4 w-1/4">{language === 'mr' ? 'विभाग' : 'Department'}</th>
                    <th className="py-2.5 px-4">{language === 'mr' ? 'प्रमुख कव्हरेज आणि उपक्रम' : 'Key Coverage Highlights & Initiatives'}</th>
                    <th className="py-2.5 px-4 text-center w-24">{language === 'mr' ? 'प्रसिद्धीपत्रके' : 'Releases'}</th>
                    <th className="py-2.5 px-4 text-left w-36">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedDepts.map((dept, idx) => {
                    const status = getDeptStatus(dept.releases);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-gov-primary">
                          {language === 'mr' ? dept.departmentMr : dept.department}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {language === 'mr' ? dept.highlightMr : dept.highlight}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                          {dept.releases}
                        </td>
                        <td className="py-2.5 px-4 text-left">
                          <span className={`inline-flex items-center justify-start gap-1.5 text-xs font-semibold whitespace-nowrap ${status.textClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dotClass}`} />
                            <span>{language === 'mr' ? status.labelMr : status.labelEn}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Filter Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="relative w-full sm:w-64">
                <MaterialIcon name="search" size="xs" className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={language === 'mr' ? '२१ विभागांमध्ये शोधा...' : 'Search 21 departments...'}
                  value={deptSearch}
                  onChange={(e) => {
                    setDeptSearch(e.target.value);
                    setDeptPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-800 focus:outline-none focus:border-gov-blue"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {language === 'mr'
                    ? `पृष्ठ ${currentDeptPage} / ${totalDeptPages} (एकूण ${filteredDepts.length} विभाग)`
                    : `Page ${currentDeptPage} of ${totalDeptPages} (${filteredDepts.length} total depts)`}
                </span>

                <div className="inline-flex items-center rounded border border-slate-300 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                    disabled={currentDeptPage <= 1}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous page"
                  >
                    <MaterialIcon name="chevron_left" size="xs" />
                  </button>

                  {Array.from({ length: totalDeptPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setDeptPage(pg)}
                      className={`px-2.5 py-1 text-xs font-semibold cursor-pointer border-l border-slate-200 ${
                        currentDeptPage === pg
                          ? 'bg-gov-primary text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setDeptPage((p) => Math.min(totalDeptPages, p + 1))}
                    disabled={currentDeptPage >= totalDeptPages}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-l border-slate-200"
                    aria-label="Next page"
                  >
                    <MaterialIcon name="chevron_right" size="xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: VIP Program Coverage */}
        {activeReportTab === 'vip' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {KONKAN_DAILY_OPERATIONS_REPORT.vipProgramCoverage.map((vipItem, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-3 h-full shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-gov-primary font-bold text-xs border-b border-slate-200 pb-2">
                    <MaterialIcon name="verified_user" size="xs" className="text-amber-600" />
                    <span>{language === 'mr' ? vipItem.vipMr : vipItem.vip}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(language === 'mr' ? vipItem.eventsMr : vipItem.events).map((ev, eIdx) => (
                      <li key={eIdx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-gov-primary font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {vipItem.socialReach && (
                  <div className="text-xs font-semibold text-emerald-800 border-l-2 border-emerald-400 pl-2">
                    {language === 'mr' ? (vipItem.socialReachMr || vipItem.socialReach) : vipItem.socialReach}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Social Media Reach */}
        {activeReportTab === 'social' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {KONKAN_DAILY_OPERATIONS_REPORT.socialMediaMetrics.map((sm, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gov-primary">
                    {language === 'mr' ? (sm.platformMr || sm.platform) : sm.platform}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{language === 'mr' ? sm.statusMr : sm.status}</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{sm.handle}</div>
                <div className="pt-1 border-t border-slate-200 text-xs flex justify-between text-slate-700">
                  <span>{language === 'mr' ? 'पोस्ट:' : 'Posts:'} <strong>{sm.posts}</strong></span>
                  <span>{language === 'mr' ? 'पोहोच:' : 'Reach:'} <strong className="text-gov-primary">{language === 'mr' ? (sm.impressionsMr || sm.impressions) : sm.impressions}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reports Vault Card */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {language === 'mr' ? 'अभिलेखागार गुप्तवार्ता डॉसियर' : 'Archival Intelligence Dossiers'}
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {language === 'mr' ? `${reports.length} अहवाल अभिलेखित` : `${reports.length} Reports Archived`}
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {reports.map((rpt) => {
            const isDownloading = downloadingId === rpt.id;

            return (
              <div
                key={rpt.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700 text-[11px]">
                      {rpt.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      • {language === 'mr' ? rpt.typeMr : rpt.typeEn}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {language === 'mr' ? rpt.titleMr : rpt.titleEn}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>{language === 'mr' ? 'कालावधी:' : 'Period:'} {language === 'mr' ? rpt.periodMr : rpt.periodEn}</span>
                    <span>•</span>
                    <span className="text-gov-primary font-semibold">{language === 'mr' ? 'स्वरूप:' : 'Format:'} {rpt.format}</span>
                    <span>•</span>
                    <span>{language === 'mr' ? 'आकार:' : 'Size:'} {rpt.size}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleExport(rpt.id)}
                  disabled={isDownloading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-xs font-semibold transition-colors shadow-2xs self-start sm:self-center cursor-pointer ${
                    isDownloading
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label={`Export ${language === 'mr' ? rpt.titleMr : rpt.titleEn}`}
                >
                  {isDownloading ? (
                    <>
                      <MaterialIcon name="check" size="xs" className="text-emerald-600" />
                      <span>{language === 'mr' ? 'निर्यात पूर्ण' : 'Exported'}</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="download" size="xs" className="text-slate-500" />
                      <span>{language === 'mr' ? 'डॉसियर निर्यात' : 'Export Dossier'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate Custom Dossier Modal */}
      {isGenerateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
        >
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MaterialIcon name="bar_chart" size="sm" className="text-gov-primary" />
                <h3 id="report-modal-title" className="text-sm font-bold text-gov-primary">
                  {language === 'mr' ? 'मागणीनुसार गुप्तवार्ता डॉसियर तयार करा' : 'Generate On-Demand Intelligence Dossier'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Close dialog"
              >
                <MaterialIcon name="close" size="sm" />
              </button>
            </div>

            <form onSubmit={handleGenerateDossier} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'डॉसियर अहवाल प्रकार' : 'Dossier Report Type'}
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue"
                >
                  <option value="Daily Media Summary">
                    {language === 'mr' ? 'दैनंदिन माध्यम गुप्तवार्ता आणि टोन सारांश' : 'Daily Media Intelligence & Tone Digest'}
                  </option>
                  <option value="District CPI Scorecard">
                    {language === 'mr' ? 'साप्ताहिक ३६-जिल्हा सीपीआय संमिश्र गुणपत्रिका' : 'Weekly 36-District CPI Composite Scorecard'}
                  </option>
                  <option value="Crisis SLA Audit">
                    {language === 'mr' ? 'आपत्कालीन प्रतिसाद ९०-मिनिट एसएलए लेखापरीक्षण' : 'Crisis Response 90-Min SLA Audit'}
                  </option>
                  <option value="Departmental Media Audit">
                    {language === 'mr' ? 'विभागीय जनसंपर्क आणि एअरटाईम लेखापरीक्षण' : 'Departmental Public Relations & Airtime Audit'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'प्रशासकीय विभाग व्याप्ती' : 'Administrative Division Scope'}
                </label>
                <select
                  value={reportDivision}
                  onChange={(e) => setReportDivision(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue"
                >
                  <option value="All Maharashtra">
                    {language === 'mr' ? 'संपूर्ण महाराष्ट्र (३६ जिल्हे)' : 'All Maharashtra (36 Districts)'}
                  </option>
                  <option value="Pune Division">
                    {language === 'mr' ? 'पुणे विभाग (५ जिल्हे)' : 'Pune Division (5 Districts)'}
                  </option>
                  <option value="Konkan Division">
                    {language === 'mr' ? 'कोकण विभाग (७ जिल्हे)' : 'Konkan Division (7 Districts)'}
                  </option>
                  <option value="Nashik Division">
                    {language === 'mr' ? 'नाशिक विभाग (५ जिल्हे)' : 'Nashik Division (5 Districts)'}
                  </option>
                  <option value="Chhatrapati Sambhajinagar Division">
                    {language === 'mr' ? 'छत्रपती संभाजीनगर (८ जिल्हे)' : 'Chhatrapati Sambhajinagar (8 Districts)'}
                  </option>
                  <option value="Amravati Division">
                    {language === 'mr' ? 'अमरावती विभाग (५ जिल्हे)' : 'Amravati Division (5 Districts)'}
                  </option>
                  <option value="Nagpur Division">
                    {language === 'mr' ? 'नागपूर विभाग (६ जिल्हे)' : 'Nagpur Division (6 Districts)'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">
                  {language === 'mr' ? 'निर्यात स्वरूप' : 'Export Format'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['PDF', 'PDF & CSV', 'XLSX'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setReportFormat(fmt)}
                      className={`py-1.5 px-2 rounded border text-center font-mono font-bold transition-colors cursor-pointer ${
                        reportFormat === fmt
                          ? 'bg-gov-primary text-white border-gov-primary shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-colors shadow-2xs cursor-pointer ${
                    isGenerating
                      ? 'bg-gov-accent text-white'
                      : 'bg-gov-primary hover:bg-gov-primary-dark text-white'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <MaterialIcon name="progress_activity" size="xs" spin={true} />
                      <span>{language === 'mr' ? 'डॉसियर संकलित करत आहे...' : 'Compiling Dossier...'}</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="download" size="xs" />
                      <span>{language === 'mr' ? 'तयार करा आणि संकलित करा' : 'Generate & Compile'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
