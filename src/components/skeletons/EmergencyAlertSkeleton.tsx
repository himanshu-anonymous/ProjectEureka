import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

interface EmergencyAlertSkeletonProps {
  isCollapsed?: boolean;
  isCrisisRoute?: boolean;
}

export const EmergencyAlertSkeleton: React.FC<EmergencyAlertSkeletonProps> = ({
  isCollapsed = false,
  isCrisisRoute = false,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm border-t-2 border-t-rose-600 flex flex-col">
      {/* Sleek Dark-Slate Command Bar */}
      <div className="bg-slate-900 px-3.5 py-2.5 rounded-t-[10px] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <Skeleton variant="dark" className="w-4 h-4 rounded shrink-0" />
          <Skeleton
            variant="dark"
            className={`h-3.5 ${isCrisisRoute ? 'w-48 sm:w-60' : 'w-44'} rounded`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="dark" className="h-3 w-16 rounded" />
          {!isCrisisRoute && <Skeleton variant="dark" className="w-6 h-6 rounded-md" />}
        </div>
      </div>

      {/* Collapsed State Summary Strip (Dashboard when isCollapsed=true) */}
      {!isCrisisRoute && isCollapsed && (
        <div className="px-3.5 py-2.5 bg-rose-50/40 rounded-b-xl border-b border-rose-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton variant="amber" className="w-2 h-2 rounded-full shrink-0" />
            <Skeleton className="h-3 w-28 rounded font-mono" />
            <Skeleton variant="subtle" className="h-3 w-40 rounded" />
          </div>
          <Skeleton variant="subtle" className="h-3 w-20 rounded" />
        </div>
      )}

      {/* Expanded Alert Body (or Crisis Route) */}
      {(isCrisisRoute || !isCollapsed) && (
        <div className="flex flex-col divide-y divide-slate-100">
          {/* Primary Incident Card Skeleton */}
          <div className="p-3.5 sm:p-4">
            {isCrisisRoute ? (
              // 12-Column Split on /crisis
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                <div className="lg:col-span-8 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 rounded font-mono" />
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton variant="subtle" className="h-3.5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton variant="subtle" className="h-3 w-48 rounded" />
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <Skeleton className="h-8 w-full rounded-lg" />
                  <div className="grid grid-cols-3 gap-1.5">
                    <Skeleton variant="subtle" className="h-7 rounded" />
                    <Skeleton variant="subtle" className="h-7 rounded" />
                    <Skeleton variant="subtle" className="h-7 rounded" />
                  </div>
                </div>
              </div>
            ) : (
              // Compact Stack on Dashboard (/)
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-24 rounded font-mono" />
                    <Skeleton className="h-3.5 w-16 rounded" />
                  </div>
                  <Skeleton variant="subtle" className="h-3 w-14 rounded" />
                </div>
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-3.5 w-5/6 rounded" />
                <Skeleton variant="subtle" className="h-3 w-44 rounded" />
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <Skeleton variant="subtle" className="h-7 flex-1 rounded" />
                  <Skeleton variant="subtle" className="h-7 flex-1 rounded" />
                  <Skeleton variant="subtle" className="h-7 flex-1 rounded" />
                  <Skeleton className="h-7 flex-1 rounded" />
                </div>
              </div>
            )}
          </div>

          {/* Active Incidents Queue Skeleton */}
          <div className="p-3.5">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-36 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
            </div>
            <div
              className={`grid ${
                isCrisisRoute ? 'grid-cols-1 lg:grid-cols-2 gap-3' : 'grid-cols-1 divide-y divide-slate-100'
              }`}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="py-2 space-y-1.5 border-l-2 border-slate-200 pl-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-20 rounded font-mono" />
                      <Skeleton variant="subtle" className="h-2.5 w-14 rounded" />
                    </div>
                    <Skeleton variant="subtle" className="h-2.5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton variant="subtle" className="h-2.5 w-36 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar on Dashboard */}
          {!isCrisisRoute && (
            <div className="px-3.5 py-2 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between rounded-b-xl">
              <Skeleton variant="subtle" className="h-3 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
