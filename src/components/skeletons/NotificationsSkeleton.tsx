import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const NotificationsSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-80 rounded" />
        </div>
        <Skeleton className="h-8 w-28 rounded" />
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-2xs">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton variant="subtle" className="h-3 w-16 rounded font-mono" />
              </div>
              <Skeleton variant="subtle" className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
