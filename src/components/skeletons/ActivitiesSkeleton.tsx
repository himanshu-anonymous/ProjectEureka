import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const ActivitiesSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-72 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-96 rounded" />
        </div>
      </div>

      {/* Workflow Step Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton variant="subtle" className="h-2 w-14 rounded" />
          </div>
        ))}
      </div>

      {/* Itinerary & GPS Field Vans Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
        <div className="p-3 border-b border-slate-100 flex justify-between">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-24 rounded" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-2.5 px-3 w-16"><Skeleton className="h-3 w-8 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-40 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-28 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-24 rounded" /></th>
                <th className="py-2.5 px-3"><Skeleton className="h-3 w-28 rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3"><Skeleton className="h-3 w-8 rounded font-mono" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-3.5 w-60 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton variant="subtle" className="h-3.5 w-36 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton variant="subtle" className="h-3.5 w-28 rounded" /></td>
                  <td className="py-3 px-3"><Skeleton className="h-4 w-32 rounded-full" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
