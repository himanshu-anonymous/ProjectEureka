import React from 'react';
import { KPIRibbonSkeleton } from './KPIRibbonSkeleton';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';
import { ScoreDecompositionSkeleton } from './ScoreDecompositionSkeleton';
import { EmergencyAlertSkeleton } from './EmergencyAlertSkeleton';
import { LiveNewsQueueSkeleton } from './LiveNewsQueueSkeleton';
import { GISMapSkeleton } from './GISMapSkeleton';
import { TopLowerMatrixSkeleton } from './TopLowerMatrixSkeleton';
import { SocialMediaSkeleton } from './SocialMediaSkeleton';
import { LiveStreamingSkeleton } from './LiveStreamingSkeleton';
import { Skeleton } from '@/components/shared/Skeleton';

export const DashboardPageSkeleton: React.FC = () => {
  return (
    <div className="p-3.5 sm:p-4 md:p-5 xl:p-6 max-w-[1860px] w-full mx-auto flex flex-col gap-4 sm:gap-5 xl:gap-6 bg-[#f4f6fa]">
      {/* 1. Full-Width KPI Ribbon at Top */}
      <section className="w-full">
        <KPIRibbonSkeleton cardsCount={4} />
      </section>

      {/* 2. Responsive 3-Column Workspace with Baseline Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch w-full">
        {/* Column 1: Left Rail (3/12 on XL, 4/12 on LG) - Analytics & Rankings */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-5 min-w-0">
          <ScoreDecompositionSkeleton />

          {/* Key Metrics & Trends Chart Skeleton */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 min-h-[220px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton variant="subtle" className="h-3 w-24 rounded" />
            </div>
            <div className="h-40 flex items-end justify-between gap-4 px-6 pt-4">
              <Skeleton className="h-28 w-12 rounded-t" />
              <Skeleton className="h-36 w-12 rounded-t" />
              <Skeleton className="h-24 w-12 rounded-t" />
              <Skeleton className="h-32 w-12 rounded-t" />
              <Skeleton className="h-20 w-12 rounded-t" />
            </div>
          </div>

          <div className="flex-1 flex flex-col [&>*]:flex-1 [&>*]:h-full">
            <TopLowerMatrixSkeleton />
          </div>
        </div>

        {/* Column 2: Center Rail (5/12 on XL, 4/12 on LG) - Map, Ticker & State Leaderboard */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-5 min-w-0">
          <GISMapSkeleton />

          {/* Breaking News Ticker Skeleton */}
          <div className="w-full h-11 bg-red-600/90 rounded-xl px-4 py-2 flex items-center justify-between gap-3 shadow-sm border border-red-700 overflow-hidden animate-pulse">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/80" />
              <span className="h-4 w-24 bg-white/80 rounded" />
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="h-4 w-16 bg-red-700/80 rounded shrink-0" />
              <span className="h-4 w-64 bg-white/40 rounded" />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="h-4 w-12 bg-white/60 rounded" />
            </div>
          </div>

          <div className="flex-1 flex flex-col [&>*]:flex-1 [&>*]:h-full">
            <LeaderboardSkeleton />
          </div>
        </div>

        {/* Column 3: Right Rail (4/12 on XL, 4/12 on LG) - Live Intelligence & Streaming */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-5 min-w-0">
          <SocialMediaSkeleton />
          <EmergencyAlertSkeleton isCollapsed={true} isCrisisRoute={false} />
          <LiveNewsQueueSkeleton />
          <div className="flex-1 flex flex-col [&>*]:flex-1 [&>*]:h-full">
            <LiveStreamingSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};
