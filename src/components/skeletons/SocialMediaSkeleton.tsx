import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const SocialMediaSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-full min-h-[380px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded" />
        </div>
        <Skeleton variant="subtle" className="h-3 w-28 rounded" />
      </div>

      {/* Split Stream Layout */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          {/* Stream 1: Twitter / X */}
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-14 rounded" />
            </div>
            <div className="space-y-2 max-h-[220px]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-2 bg-white rounded border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton variant="subtle" className="h-2.5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                  <Skeleton variant="subtle" className="h-2 w-28 rounded pt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Stream 2: FB / Insta / YouTube */}
          <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
            </div>
            <div className="space-y-2 max-h-[220px]">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-2 bg-white rounded border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton variant="subtle" className="h-2.5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                  <Skeleton variant="subtle" className="h-2 w-28 rounded pt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
