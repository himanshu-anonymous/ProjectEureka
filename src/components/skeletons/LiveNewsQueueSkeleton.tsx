import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const LiveNewsQueueSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Dark Command Bar */}
      <div className="bg-slate-900 px-3.5 py-2.5 rounded-t-[10px] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <Skeleton variant="dark" className="w-4 h-4 rounded shrink-0" />
          <Skeleton variant="dark" className="h-3.5 w-48 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="dark" className="h-3 w-20 rounded" />
          <Skeleton variant="dark" className="w-5 h-5 rounded-md" />
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton variant="subtle" className="h-6 w-16 rounded-full" />
        <Skeleton variant="subtle" className="h-6 w-16 rounded-full" />
        <Skeleton variant="subtle" className="h-6 w-16 rounded-full" />
      </div>

      {/* Feed Items */}
      <div className="divide-y divide-slate-100 p-2 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-24 rounded font-mono" />
                <Skeleton variant="subtle" className="h-3 w-16 rounded" />
              </div>
              <Skeleton variant="subtle" className="h-2.5 w-14 rounded font-mono" />
            </div>
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
            <div className="flex items-center gap-3 pt-1">
              <Skeleton variant="subtle" className="h-3 w-32 rounded" />
              <Skeleton className="h-3.5 w-16 rounded-full ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between text-xs">
        <Skeleton variant="subtle" className="h-3 w-28 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
};
