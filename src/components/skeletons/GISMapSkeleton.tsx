import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const GISMapSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton variant="subtle" className="h-3 w-20 rounded" />
        </div>
      </div>

      {/* Main Body: Full-Width Map Canvas with Telemetry Strip Below */}
      <div className="p-4 sm:p-5 flex flex-col gap-4 min-w-0">
        {/* Map Canvas (100% width) */}
        <div className="w-full flex flex-col gap-2 min-w-0">
          <div className="relative w-full aspect-[800/664] min-h-[300px] sm:min-h-[360px] max-h-[440px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-6">
            <Skeleton className="w-64 h-56 rounded-xl" />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
            </div>
            <Skeleton variant="subtle" className="h-2.5 w-24 rounded" />
          </div>
        </div>

        {/* District Live State Telemetry Sub-Panel (Horizontal Info Strip directly below map) */}
        <div className="w-full border border-gov-blue/20 p-3.5 sm:p-4 rounded-xl bg-slate-50/80 shadow-xs flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-20 rounded" />
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-20 rounded" />
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          </div>

          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};
