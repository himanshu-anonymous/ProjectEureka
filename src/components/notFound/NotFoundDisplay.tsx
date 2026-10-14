'use client';

import React from 'react';

export const NotFoundDisplay: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Government Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-secondary border border-borderLine-standard rounded-full text-xs text-content-secondary mb-6">
        <span className="w-5 h-5 rounded bg-surface border border-borderLine-standard font-bold text-[10px] text-content-primary flex items-center justify-center">
          MH
        </span>
        <span className="font-medium">Maha-Command Center</span>
        <span className="text-content-muted">•</span>
        <span className="text-content-muted">DGIPR</span>
      </div>

      {/* Prominent Bold 404 Display */}
      <div className="relative select-none">
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-content-primary leading-none">
          404
        </h1>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-surface border border-borderLine-standard rounded text-[11px] font-mono font-semibold uppercase tracking-wider text-content-secondary shadow-sm">
          Route Not Found
        </div>
      </div>
    </div>
  );
};
