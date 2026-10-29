import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const KPIRibbonSkeleton: React.FC<{ cardsCount?: number }> = ({ cardsCount = 4 }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        cardsCount === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
      } gap-3.5 sm:gap-4 xl:gap-5`}
    >
      {Array.from({ length: cardsCount }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs h-full min-h-[114px]"
        >
          {/* 1. Header: Icon + Title */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Skeleton className="w-4 h-4 rounded shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton variant="subtle" className="h-2 w-20 rounded" />
              </div>
            </div>
          </div>

          {/* 2. Primary Metric */}
          <div>
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-20 rounded font-mono" />
              <Skeleton variant="subtle" className="h-3 w-10 rounded" />
            </div>

            {/* 3. Supporting Context Footer */}
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
                <Skeleton variant="subtle" className="h-2.5 w-24 rounded" />
              </div>
              <Skeleton className="h-2.5 w-12 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
