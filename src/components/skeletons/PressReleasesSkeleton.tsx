import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const PressReleasesSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-48 rounded" />
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded" />
          ))}
        </div>
        <Skeleton className="h-8 w-60 rounded" />
      </div>

      {/* Releases Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 flex justify-between">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-28 rounded" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="py-2.5 px-3 w-[40%]"><Skeleton className="h-3 w-40 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-28 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-16 rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-20 rounded font-mono" /></td>
                  <td className="py-3 px-3">
                    <Skeleton className="h-3.5 w-full rounded" />
                    <Skeleton variant="subtle" className="h-2.5 w-2/3 rounded mt-1" />
                  </td>
                  <td className="py-3 px-3"><Skeleton variant="subtle" className="h-3.5 w-28 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton variant="subtle" className="h-3 w-16 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-4 w-20 rounded-full" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-6 w-16 rounded ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
