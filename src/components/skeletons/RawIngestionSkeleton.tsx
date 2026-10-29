import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const RawIngestionSkeleton: React.FC = () => {
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

      {/* Source Configuration 5-Column Table Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton variant="subtle" className="h-3 w-32 rounded" />
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-3 w-[15%]"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3 w-[30%]"><Skeleton className="h-3 w-32 rounded" /></th>
                <th className="py-2.5 px-3 w-[15%]"><Skeleton className="h-3 w-14 rounded" /></th>
                <th className="py-2.5 px-3 w-[20%]"><Skeleton className="h-3 w-24 rounded" /></th>
                <th className="py-2.5 px-3 w-[20%]"><Skeleton className="h-3 w-28 rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-20 rounded font-mono" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-40 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton variant="subtle" className="h-3.5 w-16 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton className="h-3.5 w-24 rounded" /></td>
                  <td className="py-2.5 px-3"><Skeleton variant="subtle" className="h-3 w-32 rounded font-mono" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
