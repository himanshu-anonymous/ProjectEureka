'use client';

import React, { useState } from 'react';
import { DepartmentPressRelease } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getLocalizedStatus } from '@/lib/dataLocalization';

interface DepartmentPressReleasesProps {
  releases: DepartmentPressRelease[];
}

export const DepartmentPressReleases: React.FC<DepartmentPressReleasesProps> = ({ releases }) => {
  const { language } = useDashboardStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedId(id);
      setTimeout(() => setDownloadedId(null), 2500);
    }, 600);
  };

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name="description" size="sm" className="text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">
            {language === 'mr' ? 'अधिकृत प्रसिद्धीपत्रके' : 'Official Press Releases'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          {releases.length} {language === 'mr' ? 'जारी केले' : 'Dispatched'}
        </span>
      </div>

      <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded">
        {releases.map((pr) => (
          <div key={pr.id} className="p-2.5 flex items-center justify-between hover:bg-surface-secondary transition-colors text-xs">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-content-muted">{pr.id}</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-content-primary whitespace-nowrap">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      pr.status === 'Published'
                        ? 'bg-emerald-600'
                        : pr.status === 'Under Review'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{getLocalizedStatus(pr.status, language)}</span>
                </span>
              </div>
              <p className="font-medium text-content-primary truncate">{pr.title}</p>
              <div className="flex items-center gap-3 text-[10px] text-content-muted">
                <span className="flex items-center gap-1 font-mono">
                  <MaterialIcon name="calendar_today" size="xs" />
                  <span>{pr.date}</span>
                </span>
                <span>{pr.downloads} {language === 'mr' ? 'डाउनलोड्स' : 'Downloads'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(pr.id)}
              disabled={downloadingId === pr.id}
              className={`p-1.5 border rounded transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                downloadedId === pr.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-borderLine-standard hover:bg-surface-selected text-content-primary'
              }`}
              title={language === 'mr' ? 'पीडीएफ डाउनलोड करा' : 'Download PDF'}
              aria-label={`Download ${pr.title}`}
            >
              {downloadingId === pr.id ? (
                <MaterialIcon name="progress_activity" size="xs" spin={true} />
              ) : downloadedId === pr.id ? (
                <>
                  <MaterialIcon name="check" size="xs" className="text-emerald-700" />
                  <span className="text-[10px] font-medium hidden sm:inline">
                    {language === 'mr' ? 'डाउनलोड झाले' : 'Downloaded'}
                  </span>
                </>
              ) : (
                <MaterialIcon name="download" size="xs" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
