import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const TopLowerMatrixSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-full min-h-[380px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton variant="subtle" className="h-6 w-12 rounded" />
          <Skeleton variant="subtle" className="h-6 w-12 rounded" />
        </div>
      </div>

      {/* Table Representation */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-2 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2 px-3"><Skeleton className="h-3 w-24 rounded" /></th>
                <th className="py-2 px-3"><Skeleton className="h-3 w-20 rounded" /></th>
                <th className="py-2 px-3 text-right"><Skeleton className="h-3 w-24 ml-auto rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton variant="subtle" className="h-2.5 w-14 rounded mt-0.5" />
                  </td>
                  <td className="py-2 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-2.5 w-10 rounded font-mono" />
                        <Skeleton className="h-2.5 w-8 rounded font-mono" />
                      </div>
                      <div className="h-1.5 w-28 bg-slate-100 rounded-full overflow-hidden">
                        <Skeleton className="h-full rounded-full" style={{ width: `${80 - i * 12}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Skeleton variant="subtle" className="h-3 w-20 rounded" />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Skeleton className="h-5 w-18 ml-auto rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
