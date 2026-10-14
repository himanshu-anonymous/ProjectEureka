'use client';

import React from 'react';
import { DepartmentPressRelease } from '@/types/dashboard';
import { FileText, Download, Calendar } from 'lucide-react';

interface DepartmentPressReleasesProps {
  releases: DepartmentPressRelease[];
}

export const DepartmentPressReleases: React.FC<DepartmentPressReleasesProps> = ({ releases }) => {
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">1. Official Press Releases</h4>
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
                  <Calendar className="w-3 h-3" />
                  <span>{pr.date}</span>
                </span>
                <span>{pr.downloads} Downloads</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading Press Release ${pr.id}`)}
              className="p-1.5 border border-borderLine-standard rounded hover:bg-surface-selected transition-colors text-content-primary"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
