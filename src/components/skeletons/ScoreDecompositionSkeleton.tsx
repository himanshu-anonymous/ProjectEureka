import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const ScoreDecompositionSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-56 rounded" />
          <Skeleton variant="subtle" className="h-3 w-48 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-16 rounded" />
          <span className="text-slate-300 font-mono">|</span>
          <Skeleton className="h-4 w-24 rounded font-mono" />
        </div>
      </div>

      {/* 4 Constituent Scores */}
      <div className="p-4 space-y-5 bg-white">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded shrink-0" />
                <Skeleton className="h-3.5 w-32 rounded" />
                <Skeleton variant="subtle" className="h-3 w-28 rounded hidden sm:inline" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-14 rounded font-mono" />
                <Skeleton variant="subtle" className="h-3 w-16 rounded font-mono" />
              </div>
            </div>

            {/* Progress bar track */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <Skeleton
                className="h-full rounded-full"
                style={{ width: `${60 + i * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
