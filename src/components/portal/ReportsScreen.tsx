'use client';

import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

import { KONKAN_DAILY_OPERATIONS_REPORT } from '@/lib/serverData';

interface ReportItem {
  id: string;
  title: string;
  type: string;
  period: string;
  format: string;
  size: string;
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'RPT-KONKAN-2026-01',
    title: 'विभागीय माहिती कार्यालय कोकण विभाग दैनंदिन कामकाज अहवाल (Official Konkan Daily Report)',
    type: 'Daily Report (Excel Ingested)',
    period: 'Oct 13, 2026',
    format: 'PDF & XLSX',
    size: '3.8 MB',
  },
  {
    id: 'RPT-KONKAN-2026-02',
    title: 'Konkan 5-District 100-Point Performance Index & SLA Audit',
    type: '100-Point Index',
    period: 'Q3 2026',
    format: 'PDF',
    size: '4.6 MB',
  },
  {
    id: 'RPT-KONKAN-2026-03',
    title: 'Palghar & Thane Coastal Infrastructure Press Release Coverage',
    type: 'District Audit',
    period: 'Oct 01 - Oct 12, 2026',
    format: 'PDF',
    size: '2.4 MB',
  },
  {
    id: 'RPT-KONKAN-2026-04',
    title: '21 Line Departments PR & Social Media Amplification Report',
    type: 'Departmental Audit',
    period: 'October 2026',
    format: 'PDF & CSV',
    size: '5.1 MB',
  },
];

export const ReportsScreen: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'lineDepts' | 'vip' | 'social'>('lineDepts');

  // Custom report form state
  const [reportType, setReportType] = useState('Daily Konkan Media Digest');
  const [reportDivision, setReportDivision] = useState('Konkan Division');
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
      const newReport: ReportItem = {
        id: `RPT-KONKAN-${Math.floor(105 + Math.random() * 800)}`,
        title: `${reportType} (${reportDivision})`,
        type: reportType.includes('Index') ? '100-Point Index' : 'Custom Dossier',
        period: 'Generated Just Now',
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
              Konkan Division Intelligence Reports & Executive Dossiers
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            विभागीय माहिती कार्यालय कोकण विभाग • 21 Line Departments, VIP Program Coverage, & 100-Point Index Dossiers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGenerateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-primary text-white rounded text-xs font-semibold hover:bg-gov-primary-dark transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <MaterialIcon name="add" size="xs" className="text-amber-400" />
          <span>Generate Konkan Dossier</span>
        </button>
      </div>

      {/* Official Konkan Daily Operations Card (Excel Ingested) */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-gov-primary/5 via-emerald-50/20 to-transparent flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Official Excel Ingest
              </span>
              <h3 className="font-bold text-sm text-gov-primary">
                {KONKAN_DAILY_OPERATIONS_REPORT.office}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Report Date: <strong className="text-slate-800">{KONKAN_DAILY_OPERATIONS_REPORT.reportDate}</strong> • Districts: Palghar, Thane, Raigad, Ratnagiri, Sindhudurg
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
              21 Line Departments
            </button>
            <button
              onClick={() => setActiveReportTab('vip')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeReportTab === 'vip'
                  ? 'bg-gov-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              VIP Event Coverage
            </button>
            <button
              onClick={() => setActiveReportTab('social')}
              className={`px-3 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeReportTab === 'social'
                  ? 'bg-gov-primary text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Social Media Reach
            </button>
          </div>
        </div>

        {/* Tab 1: Line Departments Table */}
        {activeReportTab === 'lineDepts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-4 w-1/4">Department (विभाग)</th>
                  <th className="py-2.5 px-4">Key Coverage Highlights & Initiatives</th>
                  <th className="py-2.5 px-4 text-center w-24">Releases</th>
                  <th className="py-2.5 px-4 text-right w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {KONKAN_DAILY_OPERATIONS_REPORT.lineDepartmentsCoverage.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-gov-primary">{dept.department}</td>
                    <td className="py-2.5 px-4 text-slate-700">{dept.highlight}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {dept.releases}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Archived
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: VIP Program Coverage */}
        {activeReportTab === 'vip' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {KONKAN_DAILY_OPERATIONS_REPORT.vipProgramCoverage.map((vipItem, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-gov-primary font-bold text-xs border-b border-slate-200 pb-2">
                    <MaterialIcon name="verified_user" size="xs" className="text-amber-600" />
                    <span>{vipItem.vip}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {vipItem.events.map((ev, eIdx) => (
                      <li key={eIdx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-gov-primary font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {vipItem.socialReach && (
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    {vipItem.socialReach}
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
                  <span className="font-bold text-xs text-gov-primary">{sm.platform}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {sm.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{sm.handle}</div>
                <div className="pt-1 border-t border-slate-200 text-xs flex justify-between text-slate-700">
                  <span>Posts: <strong>{sm.posts}</strong></span>
                  <span>Reach: <strong className="text-gov-primary">{sm.impressions}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reports Vault Card */}
      <div className="bg-surface border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Konkan Division Archival Intelligence Dossiers</span>
          <span className="font-mono text-[11px] text-slate-500">
            {reports.length} Reports Archived
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
                    <span className="text-[10px] px-2 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold">
                      {rpt.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rpt.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Period: {rpt.period}</span>
                    <span>•</span>
                    <span className="text-gov-primary font-semibold">Format: {rpt.format}</span>
                    <span>•</span>
                    <span>Size: {rpt.size}</span>
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
                  aria-label={`Export ${rpt.title}`}
                >
                  {isDownloading ? (
                    <>
                      <MaterialIcon name="check" size="xs" className="text-emerald-600" />
                      <span>Exported</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="download" size="xs" className="text-slate-500" />
                      <span>Export Dossier</span>
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
                  Generate On-Demand Intelligence Dossier
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
                <label className="font-semibold text-slate-800">Dossier Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue"
                >
                  <option value="Daily Media Summary">Daily Media Intelligence & Tone Digest</option>
                  <option value="District CPI Scorecard">Weekly 36-District CPI Composite Scorecard</option>
                  <option value="Crisis SLA Audit">Crisis Response 90-Min SLA Audit</option>
                  <option value="Departmental Media Audit">Departmental Public Relations & Airtime Audit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Administrative Division Scope</label>
                <select
                  value={reportDivision}
                  onChange={(e) => setReportDivision(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-900 focus:outline-none focus:border-gov-blue"
                >
                  <option value="All Maharashtra">All Maharashtra (36 Districts)</option>
                  <option value="Pune Division">Pune Division (5 Districts)</option>
                  <option value="Konkan Division">Konkan Division (7 Districts)</option>
                  <option value="Nashik Division">Nashik Division (5 Districts)</option>
                  <option value="Chhatrapati Sambhajinagar Division">Chhatrapati Sambhajinagar (8 Districts)</option>
                  <option value="Amravati Division">Amravati Division (5 Districts)</option>
                  <option value="Nagpur Division">Nagpur Division (6 Districts)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Export Format</label>
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
                  Cancel
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
                      <span>Compiling Dossier...</span>
                    </>
                  ) : (
                    <>
                      <MaterialIcon name="download" size="xs" />
                      <span>Generate & Compile</span>
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
