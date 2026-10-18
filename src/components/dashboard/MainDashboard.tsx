'use client';

import React from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { LeadershipOverview } from '@/components/leadership/LeadershipOverview';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';

export const MainDashboard: React.FC = () => {
  return (
    <div className="p-3.5 sm:p-4 md:p-5 space-y-5 max-w-[1720px] w-full mx-auto">
      {/* 
        1. CORE KPI RIBBON (Full-Width Single Horizontal Line directly below Subheader):
        Render all 4 KPI cards (Total Releases, Avg. TAT, Sentiment Index, Misinformation Tickets)
        in a full-width 4-column row, eliminating the previous ~280px left-column dead void.
      */}
      <div className="w-full">
        <KPIRibbon />
      </div>

      {/* 
        2. MAIN OPERATIONAL GRID (Balanced 2-Column Executive Interface):
        Left Column (8 cols): Zone 2 (District Leaderboard) + Zone 3 (CPI Score Decomposition)
        Right Column (4 cols): Zone 5 (Emergency Alert & Crisis Monitor) + Unified Live Media Ingestion Feed
        Cleanly aligned with items-stretch and matching heights with zero whitespace voids.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: District Performance & Score Decomposition */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <DistrictLeaderboard />
          <ScoreDecomposition />
        </div>

        {/* Right Column: Emergency Alert & Crisis Monitor + Consolidated Live Ingestion Feed */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <EmergencyAlert />
          <LiveNewsQueue />
        </div>
      </div>

      {/* 
        3. LEADERSHIP OVERVIEW (2x2 Matrix):
        Top/Lower Five Matrix, Social Media Split Streams, Maharashtra GIS Map, Live Event Streaming
      */}
      <div className="w-full pt-1">
        <LeadershipOverview />
      </div>
    </div>
  );
};

export default MainDashboard;
