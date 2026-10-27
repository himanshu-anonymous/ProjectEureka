import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const PipelineFlowSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1720px] w-full mx-auto space-y-4">
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

      {/* Main Pipeline Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Module Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-md shrink-0" />
          ))}
        </div>

        {/* Animated Diagram Canvas Placeholder */}
        <div className="h-[360px] bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-40 rounded" />
            <Skeleton variant="subtle" className="h-3 w-28 rounded font-mono" />
          </div>
          {/* Node connections */}
          <div className="flex justify-around items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <Skeleton variant="subtle" className="h-2.5 w-14 rounded" />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
            <Skeleton variant="subtle" className="h-3 w-32 rounded" />
            <Skeleton variant="amber" className="h-3 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
