'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { LeadershipOverview } from '@/components/leadership/LeadershipOverview';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';

/**
 * MainDashboard - State Operations Overview Dashboard
 *
 * Layout structure:
 * - Row 1: KPI Ribbon (4-column) - Total Releases, Avg TAT, Sentiment Index, Misinformation Tickets
 * - Row 2: Operational Grid (2-column on lg):
 *   Left: District Leaderboard + Score Decomposition
 *   Right: Emergency Alert + Live News Queue
 * - Row 3: Leadership Overview (2x2 Matrix with cross-panel highlighting)
 *
 * Cross-panel highlighting: When a district is selected via toolbar or any widget,
 * the store's selectedDistrictId is updated, causing all other widgets to re-read
 * from the store and highlight the corresponding district data.
 */
export const MainDashboard: React.FC = () => {
  const {
    selectedDistrictId,
    setSelectedDistrictId,
    language,
    isLoadingData,
  } = useDashboardStore();
  const t = useTranslation(language);

  // Highlight district across all dashboard panels
  // This synchronizes selection from toolbar or any widget
  const highlightDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 space-y-6 max-w-[1720px] w-full mx-auto">
      {/* 
        1. CORE KPI RIBBON (Full-Width Single Horizontal Line directly below Subheader):
        Render all 4 KPI cards (Total Releases, Avg. TAT, Sentiment Index, Misinformation Tickets)
        in a full-width 4-column row, eliminating the previous ~280px left-column dead void.
      */}
      <div className="w-full py-3">
        <KPIRibbon />
      </div>

      {/* 
        2. MAIN OPERATIONAL GRID (Balanced 2-Column Executive Interface):
        Left Column (8 cols): Zone 2 (District Leaderboard) + Zone 3 (CPI Score Decomposition)
        Right Column (4 cols): Zone 5 (Emergency Alert & Crisis Monitor) + Unified Live Media Ingestion Feed
        Cleanly aligned with items-stretch and matching heights with zero whitespace voids.
        District selection flows from toolbar → highlights here.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: District Performance & Score Decomposition */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DistrictLeaderboard highlightDistrict={highlightDistrict} />
          <ScoreDecomposition highlightDistrict={highlightDistrict} />
        </div>

        {/* Right Column: Emergency Alert & Crisis Monitor + Consolidated Live Ingestion Feed */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <EmergencyAlert highlightDistrict={highlightDistrict} />
          <LiveNewsQueue highlightDistrict={highlightDistrict} />
        </div>
      </div>

      {/* 
        3. LEADERSHIP OVERVIEW (2x2 Matrix):
        Top/Lower Five Matrix, Social Media Split Streams, Maharashtra GIS Map, Live Event Streaming
        Cross-panel: selected district highlights on map and matrix.
      */}
      <div className="w-full pt-4">
        <LeadershipOverview highlightDistrict={highlightDistrict} />
      </div>
    </div>
  );
};

export default MainDashboard;