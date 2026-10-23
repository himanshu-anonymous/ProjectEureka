import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const ReportsSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-36 rounded" />
      </div>

      {/* 21 Line Departments Overview Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 flex justify-between">
          <Skeleton className="h-4 w-52 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-32 rounded" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-32 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-24 rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-44 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-12 rounded font-mono" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-14 rounded font-mono" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-16 rounded font-mono" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archival Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton variant="subtle" className="h-3 w-1/2 rounded" />
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <Skeleton variant="subtle" className="h-3 w-28 rounded font-mono" />
              <Skeleton className="h-7 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
