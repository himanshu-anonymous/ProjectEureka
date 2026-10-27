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
      {/* 0. Single Top Breaking News Ticker Skeleton (Restrained Power BI Style) */}
      <div className="w-full h-11 bg-white rounded-xl px-4 py-2 flex items-center justify-between gap-3 shadow-xs border border-slate-200/90 overflow-hidden animate-pulse">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-rose-500/80" />
          <span className="h-4 w-24 bg-rose-100 rounded" />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="h-4 w-16 bg-slate-100 rounded shrink-0" />
          <span className="h-4 w-64 bg-slate-200/60 rounded" />
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="h-4 w-12 bg-slate-100 rounded" />
        </div>
      </div>

      {/* 1. Full-Width KPI Ribbon at Top */}
      <section className="w-full">
        <KPIRibbonSkeleton cardsCount={5} />
      </section>

      {/* 2. Responsive 3-Column Workspace with Baseline Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch w-full">
        {/* Column 1: Left Rail (3/12 on XL, 4/12 on LG) - Leaderboard, Rankings & Analytics */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-5 min-w-0">
          <LeaderboardSkeleton />
          <TopLowerMatrixSkeleton />
          <ScoreDecompositionSkeleton />
        </div>

        {/* Column 2: Center Rail (5/12 on XL, 4/12 on LG) - Main Interactive Intelligence Map */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-5 min-w-0">
          <GISMapSkeleton />
        </div>

        {/* Column 3: Right Rail (4/12 on XL, 4/12 on LG) - Alerts, Live Wire & Streaming */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-5 min-w-0">
          <EmergencyAlertSkeleton isCollapsed={true} isCrisisRoute={false} />
          <LiveNewsQueueSkeleton />
          <SocialMediaSkeleton />
          <div className="flex-1 flex flex-col [&>*]:flex-1 [&>*]:h-full">
            <LiveStreamingSkeleton />
          </div>
        </div>
      </div>

      {/* 3. Lower Performance Trends Skeleton */}
      <div className="w-full bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs space-y-3 min-h-[220px]">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton variant="subtle" className="h-3 w-24 rounded" />
        </div>
        <Skeleton className="h-44 w-full rounded" />
      </div>
    </div>
  );
};

export default DashboardPageSkeleton;
