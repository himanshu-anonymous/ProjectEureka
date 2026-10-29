import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';
import { TopLowerMatrixSkeleton } from './TopLowerMatrixSkeleton';
import { SocialMediaSkeleton } from './SocialMediaSkeleton';
import { GISMapSkeleton } from './GISMapSkeleton';
import { LiveStreamingSkeleton } from './LiveStreamingSkeleton';

export const LeadershipOverviewSkeleton: React.FC = () => {
  return (
    <section className="pt-2 space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton variant="subtle" className="h-3 w-64 rounded" />
          </div>
        </div>
        <Skeleton variant="amber" className="h-6 w-28 rounded hidden sm:inline" />
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <TopLowerMatrixSkeleton />
        <SocialMediaSkeleton />
        <GISMapSkeleton />
        <LiveStreamingSkeleton />
      </div>
    </section>
  );
};
