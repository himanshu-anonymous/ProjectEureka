import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const SystemMonitoringSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1720px] w-full mx-auto space-y-5">
      {/* Navigation Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-52 rounded" />
            <Skeleton variant="subtle" className="h-3 w-64 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton variant="subtle" className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Telemetry Operations Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
            </div>
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-20 rounded font-mono" />
              <Skeleton variant="subtle" className="h-3 w-12 rounded" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Technical Payload & Checksum Inspector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-3.5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3 w-36 rounded" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
              <Skeleton className="h-3 w-40 rounded font-mono" />
              <Skeleton variant="subtle" className="h-3 w-28 rounded font-mono" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
