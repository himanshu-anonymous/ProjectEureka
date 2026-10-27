'use client';

import React from 'react';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';

export const DistrictOperationsColumn: React.FC = () => {
  return (
    <div className="lg:col-span-8 space-y-5">
      {/* ZONE 2: District Leaderboard and Comparative Chart */}
      <DistrictLeaderboard />

      {/* ZONE 3: CPI Score Decomposition */}
      <ScoreDecomposition />
    </div>
  );
};
