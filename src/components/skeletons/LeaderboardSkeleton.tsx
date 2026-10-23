import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const LeaderboardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header and Sub-tabs */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded hidden sm:inline" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-7 w-28 rounded-md" />
          <Skeleton variant="subtle" className="h-7 w-24 rounded-md" />
          <Skeleton variant="subtle" className="h-7 w-24 rounded-md" />
          <Skeleton variant="subtle" className="h-7 w-28 rounded-md" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Top 5 Bar Chart Skeleton */}
        <div className="h-[210px] border border-slate-100 rounded-lg p-3 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton variant="subtle" className="h-3 w-20 rounded" />
          </div>
          <div className="flex-1 flex items-end justify-around gap-4 px-6 pb-2">
            {[75, 92, 60, 85, 45].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-12">
                <Skeleton
                  className="w-full rounded-t"
                  style={{ height: `${height * 1.3}px` }}
                />
                <Skeleton variant="subtle" className="h-2.5 w-10 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Controls: Search and Division Counter */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Skeleton className="h-8 w-60 rounded-lg" />
          <Skeleton variant="subtle" className="h-4 w-28 rounded" />
        </div>

        {/* Ranked District Table Skeleton */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-3 w-10"><Skeleton className="h-3 w-4 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-14 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-14 rounded" /></th>
                <th className="py-2.5 px-3 w-16"><Skeleton className="h-3 w-12 ml-auto rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3"><Skeleton variant="subtle" className="h-3 w-4 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-24 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton variant="subtle" className="h-3 w-16 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-10 rounded font-mono" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-12 rounded font-mono" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-4 w-14 rounded-full" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-12 rounded font-mono" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-4 w-12 rounded font-mono font-bold" /></td>
                  <td className="py-2.5 px-3"><Skeleton variant="subtle" className="h-6 w-14 rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
