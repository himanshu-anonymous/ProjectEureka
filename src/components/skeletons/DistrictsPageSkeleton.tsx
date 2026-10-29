import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';
import { ScoreDecompositionSkeleton } from './ScoreDecompositionSkeleton';
import { GISMapSkeleton } from './GISMapSkeleton';
import { TopLowerMatrixSkeleton } from './TopLowerMatrixSkeleton';

export const DistrictsPageSkeleton: React.FC = () => {
  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-64 rounded" />
          <Skeleton variant="subtle" className="h-3.5 w-80 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-5">
          <LeaderboardSkeleton />
          <ScoreDecompositionSkeleton />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <GISMapSkeleton />
          <TopLowerMatrixSkeleton />
        </div>
      </div>
    </div>
  );
};
