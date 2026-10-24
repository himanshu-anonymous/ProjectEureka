'use client';

import React, { useState } from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
import { BreakingNewsTicker } from '@/components/dashboard/BreakingNewsTicker';
import { KeyMetricsTrends } from '@/components/dashboard/KeyMetricsTrends';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';
import { LiveStreaming } from '@/components/leadership/LiveStreaming/LiveStreaming';
import { useDashboardStore } from '@/stores/dashboardStore';

type DashboardWorkspaceView = 'overview' | 'performance' | 'media' | 'crisis' | 'all';

export const ThreeColumnDashboard: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();
  const [activeView, setActiveView] = useState<DashboardWorkspaceView>('overview');

  return (
    <div className="p-3.5 sm:p-4 md:p-5 xl:p-6 max-w-[1860px] w-full mx-auto flex flex-col gap-4 sm:gap-5 xl:gap-6 bg-[#f4f6fa]">
      {/* 0. PROMINENT TOP-OF-DASHBOARD REAL-TIME HEADLINE SCROLL TICKER */}
      <div className="w-full">
        <BreakingNewsTicker />
      </div>

      {/* 1. EXECUTIVE COMMAND BRIEFING HEADER (Humanized & Cleanly Aligned) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-slate-700/60">
            MH
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {language === 'mr'
                  ? 'महाराष्ट्र शासन — माहिती व जनसंपर्क महासंचालनालय (DGIPR) आदेश कक्ष'
                  : 'Government of Maharashtra — Central Directorate of Information & Public Relations (DGIPR)'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                {language === 'mr' ? 'थेट संनियंत्रण: महासंचालक कक्ष' : 'Supervision: Director General Desk'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              {language === 'mr'
                ? '३६ जिल्हे थेट जोडणी • नागरिक तक्रार निवारण • लोकभावना विश्लेषण • अधिकृत प्रसिद्धीपत्रके'
                : 'Statewide Operations Cockpit • 36 Districts Connected • Citizen Service Resolution • Public Media Intelligence'}
            </p>
          </div>
        </div>

        {/* WORKSPACE PERSPECTIVE SWITCHER (Clean Horizontal Pill Alignment) */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 overflow-x-auto text-xs self-start md:self-auto shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'overview'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'नकाशा व मुख्य डॅशबोर्ड' : 'GIS Map & Command'}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('performance')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'performance'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'जिल्हा कामगिरी (CPI)' : 'District Performance'}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('media')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'media'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'माध्यम व थेट प्रक्षेपण' : 'Media & Broadcast'}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('crisis')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'crisis'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'आपत्कालीन कक्ष' : 'Crisis Desk'}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'सर्व विभाग (कमांड वॉल)' : 'Command Wall (All)'}
          </button>
        </div>
      </div>

      {/* 2. FULL-WIDTH CORE KPI RIBBON (5 On-Point Metrics) */}
      <section className="w-full">
        <KPIRibbon layout="ribbon" />
      </section>

      {/* 3. DYNAMIC FOCUSED WORKSPACE (Tailored & Decluttered) */}

      {/* VIEW A: PRIMARY EXECUTIVE OVERVIEW (Hero Map + Clean 2-Column Split) */}
      {activeView === 'overview' && (
        <div className="flex flex-col gap-5 w-full">
          {/* Hero GIS Map */}
          <div className="w-full">
            <GISMap />
          </div>

          {/* Clean 2-Column Executive Operations Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
            {/* Left Deck (7/12): District Leaderboard & Ranks */}
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              <DistrictLeaderboard showChart={true} />
            </div>

            {/* Right Deck (5/12): Operational Priority Brief & Live News */}
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              <EmergencyAlert />
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: DISTRICT PERFORMANCE & CPI MATRIX */}
      {activeView === 'performance' && (
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
              <DistrictLeaderboard showChart={true} />
              <TopLowerMatrix />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
              <ScoreDecomposition />
              <KeyMetricsTrends />
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: MEDIA INTELLIGENCE & BROADCAST */}
      {activeView === 'media' && (
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
              <LiveStreaming />
            </div>
            <div className="lg:col-span-6 flex flex-col gap-5 min-w-0">
              <SocialMediaAnalysis />
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: CRISIS & EMERGENCY OPERATIONS */}
      {activeView === 'crisis' && (
        <div className="flex flex-col gap-5 w-full">
          <EmergencyAlert />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
            <div className="lg:col-span-8 flex flex-col gap-5 min-w-0">
              <GISMap />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: COMMAND WALL (CONSOLIDATED ALL-IN-ONE) */}
      {activeView === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-5 xl:gap-6 items-start w-full">
          {/* Column 1: Analytics & Rankings (3/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-7 xl:col-span-3 flex flex-col gap-5 min-w-0">
            <ScoreDecomposition />
            <KeyMetricsTrends />
            <TopLowerMatrix />
          </div>

          {/* Column 2: Map & Central Leadership (5/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-5 xl:col-span-5 flex flex-col gap-5 min-w-0">
            <GISMap />
            <BreakingNewsTicker />
            <DistrictLeaderboard showChart={false} />
          </div>

          {/* Column 3: Live Media & Emergency Action (4/12 on XL) */}
          <div className="md:col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-5 min-w-0 [&>*]:flex-1 [&>*]:h-full">
            <EmergencyAlert />
            <SocialMediaAnalysis />
            <LiveNewsQueue />
            <LiveStreaming />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeColumnDashboard;
