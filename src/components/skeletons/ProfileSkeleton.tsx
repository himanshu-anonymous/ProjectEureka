import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Officer Identity Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <Skeleton className="h-5 w-52 rounded mx-auto sm:mx-0" />
          <Skeleton variant="subtle" className="h-3.5 w-64 rounded mx-auto sm:mx-0" />
          <div className="flex gap-2 justify-center sm:justify-start pt-1">
            <Skeleton variant="amber" className="h-4 w-24 rounded-full" />
            <Skeleton variant="subtle" className="h-4 w-28 rounded-full" />
          </div>
        </div>
      </div>

      {/* Role Clearance Cards Grid */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-44 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton variant="subtle" className="h-3 w-32 rounded" />
                </div>
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton variant="subtle" className="h-3 w-full rounded" />
              <Skeleton variant="subtle" className="h-3 w-4/5 rounded" />
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <Skeleton variant="subtle" className="h-3 w-28 rounded" />
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
