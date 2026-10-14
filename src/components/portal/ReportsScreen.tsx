'use client';

import React from 'react';
import { FileBarChart, Download } from 'lucide-react';

const REPORTS = [
  {
    id: 'RPT-2026-104',
    title: 'Daily State Media Intelligence & Tone Digest',
    type: 'Daily Summary',
    period: 'Oct 13, 2026',
    format: 'PDF',
    size: '4.2 MB',
  },
  {
    id: 'RPT-2026-103',
    title: 'Weekly 36-District CPI Composite Performance Scorecard',
    type: 'Weekly Ranking',
    period: 'Oct 06 - Oct 12, 2026',
    format: 'PDF & CSV',
    size: '8.1 MB',
  },
  {
    id: 'RPT-2026-102',
    title: 'Crisis Response SLA & Misinformation Triage Audit',
    type: 'SLA Evaluation',
    period: 'September 2026',
    format: 'PDF',
    size: '2.9 MB',
  },
  {
    id: 'RPT-2026-101',
    title: 'Departmental Press Release & Media Airtime Distribution Audit',
    type: 'Departmental Audit',
    period: 'Q3 2026',
    format: 'PDF & XLSX',
    size: '12.4 MB',
  },
];

export const ReportsScreen: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
            <FileBarChart className="w-4 h-4" />
            <span>State Intelligence Reports & Executive Dossiers</span>
          </h2>
          <p className="text-xs text-content-muted">
            Daily Summaries, District CPI Scorecards, Media Audits & Exportable Data
          </p>
        </div>

        <button
          onClick={() => alert('Generating on-demand custom intelligence report')}
          className="px-3 py-1.5 bg-action-primary text-content-inverse rounded text-xs font-semibold hover:bg-action-primary-hover transition-colors shadow-sm self-start sm:self-auto"
        >
          Generate Custom Dossier
        </button>
      </div>

      <div className="bg-surface border border-borderLine-standard rounded-md overflow-hidden">
        <div className="p-3.5 border-b border-borderLine-subtle bg-surface-secondary/40 flex items-center justify-between text-xs">
          <span className="font-semibold text-content-primary">Generated Intelligence Reports</span>
          <span className="text-[11px] font-mono text-content-muted">Official Archival Vault</span>
        </div>

        <div className="divide-y divide-borderLine-subtle text-xs">
          {REPORTS.map((rpt) => (
            <div key={rpt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-content-muted">{rpt.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-surface-secondary rounded border border-borderLine-subtle font-semibold">
                    {rpt.type}
                  </span>
                </div>
                <h4 className="font-bold text-content-primary text-xs">{rpt.title}</h4>
                <div className="flex items-center gap-3 text-[11px] text-content-muted font-mono">
                  <span>Period: {rpt.period}</span>
                  <span>•</span>
                  <span>Format: {rpt.format}</span>
                  <span>•</span>
                  <span>Size: {rpt.size}</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading report ${rpt.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-borderLine-standard rounded hover:bg-surface-secondary text-content-primary font-medium text-xs self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
