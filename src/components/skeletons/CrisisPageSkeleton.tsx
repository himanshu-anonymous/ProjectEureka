import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';
import { EmergencyAlertSkeleton } from './EmergencyAlertSkeleton';

export const CrisisPageSkeleton: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-72 rounded" />
        <Skeleton variant="subtle" className="h-3.5 w-96 rounded" />
      </div>

      {/* Role Clearance Notice Banner */}
      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <Skeleton className="w-5 h-5 rounded shrink-0" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3.5 w-64 rounded" />
            <Skeleton variant="subtle" className="h-3 w-96 rounded" />
          </div>
        </div>
        <Skeleton variant="subtle" className="h-4 w-24 rounded" />
      </div>

      {/* SLA Metric Banners (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between shadow-2xs"
          >
            <div className="space-y-1.5">
              <Skeleton variant="subtle" className="h-3 w-32 rounded" />
              <Skeleton className="h-7 w-20 rounded font-mono" />
              <Skeleton variant="subtle" className="h-2.5 w-24 rounded" />
            </div>
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        ))}
      </div>

      {/* Main Full-Width Emergency Alert Component */}
      <EmergencyAlertSkeleton isCollapsed={false} isCrisisRoute={true} />
    </div>
  );
};
