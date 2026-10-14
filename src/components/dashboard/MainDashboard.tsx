'use client';

import React from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { OCRFeed } from '@/components/zones/OCRFeed/OCRFeed';
import { LeadershipOverview } from '@/components/leadership/LeadershipOverview';

export const MainDashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-[1720px] w-full mx-auto">
      {/* 
        ROW 1 (per Wireframe 1):
        Zone 1 (Top Ribbon 4 KPI Counters, 8 cols) 
        + Zone 5 (Emergency Alert Flashing Warning Cards & SLA Countdown, 4 cols)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col justify-between">
          <KPIRibbon />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <EmergencyAlert />
        </div>
      </div>

      {/* 
        ROW 2 (per Wireframe 1):
        Left (8 cols): Zone 2 (District Leaderboard) + Zone 3 (Score Decomposition)
        Right (4 cols): Zone 4 (Live Ingestion Stream / OCR Feed with Green/Red Tags)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Zone 2 & Zone 3 */}
        <div className="lg:col-span-8 space-y-5">
          <DistrictLeaderboard />
          <ScoreDecomposition />
        </div>

        {/* Right Column: Zone 4 */}
        <div className="lg:col-span-4 h-full">
          <OCRFeed />
        </div>
      </div>

      {/* 
        ROW 3 (per Wireframe 2):
        मुख्य पॅनेल: नेतृत्व दृश्यावलोकन (Leadership Overview)
        2x2 Matrix: Top/Lower Five Matrix, Social Media Split Streams, Maharashtra GIS Map, Live Event Streaming
      */}
      <LeadershipOverview />
    </div>
  );
};
