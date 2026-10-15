'use client';

import React, { useState } from 'react';
import { DepartmentPressRelease } from '@/types/dashboard';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

interface DepartmentPressReleasesProps {
  releases: DepartmentPressRelease[];
}

export const DepartmentPressReleases: React.FC<DepartmentPressReleasesProps> = ({ releases }) => {
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
          <h4 className="text-xs font-bold text-content-primary">Official Press Releases</h4>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          {releases.length} Dispatched
        </span>
      </div>

      <div className="divide-y divide-borderLine-subtle border border-borderLine-subtle rounded">
        {releases.map((pr) => (
          <div key={pr.id} className="p-2.5 flex items-center justify-between hover:bg-surface-secondary transition-colors text-xs">
            <div className="space-y-0.5 max-w-[80%]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-content-muted">{pr.id}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-surface-secondary border border-borderLine-subtle rounded text-content-primary">
                  {pr.status}
                </span>
              </div>
              <p className="font-medium text-content-primary truncate">{pr.title}</p>
              <div className="flex items-center gap-3 text-[10px] text-content-muted">
                <span className="flex items-center gap-1 font-mono">
                  <MaterialIcon name="calendar_today" size="xs" />
                  <span>{pr.date}</span>
                </span>
                <span>{pr.downloads} Downloads</span>
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
              title="Download PDF"
              aria-label={`Download ${pr.title}`}
            >
              {downloadingId === pr.id ? (
                <MaterialIcon name="progress_activity" size="xs" spin={true} />
              ) : downloadedId === pr.id ? (
                <>
                  <MaterialIcon name="check" size="xs" className="text-emerald-700" />
                  <span className="text-[10px] font-medium hidden sm:inline">Downloaded</span>
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
