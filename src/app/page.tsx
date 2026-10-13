'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardToolbar } from '@/components/layout/DashboardToolbar';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { OCRFeed } from '@/components/zones/OCRFeed/OCRFeed';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
import { LiveStreaming } from '@/components/leadership/LiveStreaming/LiveStreaming';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* 1. Header (56-64px) */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Persistent Left Navigation (208-224px) */}
        <Sidebar />

        {/* 3. Main Operational Content Workspace */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Dashboard Toolbar */}
          <DashboardToolbar />

          <div className="p-5 space-y-5 max-w-[1720px] w-full mx-auto">
            {/* ZONE 1: Full-width KPI Ribbon (4 cards) */}
            <KPIRibbon />

            {/* 12-Column Grid Workspace: Left (8 cols ~67%) | Right (4 cols ~33%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column (8 of 12 columns) */}
              <div className="lg:col-span-8 space-y-5">
                {/* ZONE 2: District Leaderboard and Comparative Chart */}
                <DistrictLeaderboard />

                {/* ZONE 3: CPI Score Decomposition */}
                <ScoreDecomposition />
              </div>

              {/* Right Column (4 of 12 columns) */}
              <div className="lg:col-span-4 space-y-5">
                {/* ZONE 5: Emergency Alert & Crisis Monitor */}
                <EmergencyAlert />

                {/* ZONE 4: OCR Media Ingestion Feed */}
                <OCRFeed />
              </div>
            </div>

            {/* SECONDARY MONITORING WORKSPACE: Leadership Overview (2-Column Grid) */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-3">
                Leadership Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Panel 1: Top / Lower Five Matrix */}
                <TopLowerMatrix />

                {/* Panel 2: Social Media Analysis */}
                <SocialMediaAnalysis />

                {/* Panel 3: Maharashtra GIS Map */}
                <GISMap />

                {/* Panel 4: Live Event Streaming */}
                <LiveStreaming />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
