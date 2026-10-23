import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const CommandCenterSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1720px] w-full mx-auto space-y-4">
      {/* Top Nav Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton variant="subtle" className="h-3 w-64 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton variant="subtle" className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* 3-Column Operational Command Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Media Sentiment Rail */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton variant="subtle" className="h-3 w-16 rounded" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton variant="subtle" className="h-3 w-12 rounded" />
                </div>
                <Skeleton className="h-3.5 w-full rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: District Topology & Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton variant="subtle" className="h-3 w-20 rounded" />
            </div>
            <div className="aspect-[4/3] bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center justify-center">
              <Skeleton className="w-36 h-36 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton variant="subtle" className="h-7 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Right Column: Directives & Live Broadcast Rail */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton variant="subtle" className="h-3 w-16 rounded" />
            </div>
            <div className="aspect-video bg-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">
              <Skeleton variant="dark" className="w-10 h-10 rounded-full mb-2" />
              <Skeleton variant="dark" className="h-3 w-32 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton variant="subtle" className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
