import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const MediaMonitoringSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-32 rounded" />
      </div>

      {/* Media Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-md" />
        ))}
      </div>

      {/* Media Feed Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-24 rounded font-mono" />
              <Skeleton variant="subtle" className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <Skeleton variant="subtle" className="h-3 w-28 rounded" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
