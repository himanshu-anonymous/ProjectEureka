'use client';

import React from 'react';
import { FolderArchive, Plus, UploadCloud } from 'lucide-react';

export const DepartmentEmptySlot: React.FC = () => {
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">4. [Empty Slot] — Gazette & Archival Vault</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-muted rounded border border-borderLine-subtle">
          Extensible Slot
        </span>
      </div>

      <div className="w-full h-36 border-2 border-dashed border-borderLine-standard rounded-md flex flex-col items-center justify-center p-4 text-center bg-surface-secondary/30 hover:bg-surface-secondary/70 transition-colors">
        <UploadCloud className="w-8 h-8 text-content-muted mb-2 stroke-[1.5]" />
        <p className="text-xs font-semibold text-content-primary">
          Reserved Department Slot [Empty]
        </p>
        <p className="text-[11px] text-content-muted mt-0.5 max-w-xs">
          Modular container reserved for Departmental Government Resolutions (GR), Gazettes, or custom ingestion streams.
        </p>
        <button
          onClick={() => alert('New document attachment dialog')}
          className="mt-2.5 flex items-center gap-1 px-3 py-1 bg-action-primary text-content-inverse rounded text-[11px] font-medium hover:bg-action-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" />
          <span>Attach Departmental Asset</span>
        </button>
      </div>
    </div>
  );
};
