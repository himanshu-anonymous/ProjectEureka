import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const LiveStreamingSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-full min-h-[380px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded" />
        </div>
        <Skeleton variant="subtle" className="h-5 w-20 rounded-full" />
      </div>

      {/* Main Streaming Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        {/* Video Canvas Placeholder */}
        <div className="relative aspect-video min-h-[250px] xl:min-h-[300px] w-full rounded-lg bg-slate-900 overflow-hidden flex flex-col items-center justify-center p-4">
          <Skeleton variant="dark" className="w-12 h-12 rounded-full mb-2" />
          <Skeleton variant="dark" className="h-3.5 w-48 rounded" />
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Skeleton variant="dark" className="h-4 w-12 rounded" />
            <Skeleton variant="dark" className="h-4 w-16 rounded" />
          </div>
        </div>

        {/* Channel Selector Pills */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};
