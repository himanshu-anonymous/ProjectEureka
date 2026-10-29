'use client';

import React, { useState } from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { EnhancedMaharashtraGISMap } from '@/components/dashboard/EnhancedMaharashtraGISMap';
import { BreakingNewsTicker } from '@/components/dashboard/BreakingNewsTicker';
import { KeyMetricsTrends } from '@/components/dashboard/KeyMetricsTrends';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';
import { LiveStreaming } from '@/components/leadership/LiveStreaming/LiveStreaming';
import { DivisionBenchmarkChart } from '@/components/dashboard/DivisionBenchmarkChart';
import { SentimentAssessmentChart } from '@/components/dashboard/SentimentAssessmentChart';
import { DepartmentResolutionChart } from '@/components/dashboard/DepartmentResolutionChart';
import { CitizenGrievanceVelocityChart } from '@/components/dashboard/CitizenGrievanceVelocityChart';
import { useDashboardStore } from '@/stores/dashboardStore';

type DashboardWorkspaceView = 'overview' | 'performance' | 'media' | 'crisis' | 'all';

export const ThreeColumnDashboard: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, setSearchDistrict } = useDashboardStore();
  const [activeView, setActiveView] = useState<DashboardWorkspaceView>('overview');
  const [mediaTab, setMediaTab] = useState<'queue' | 'social' | 'stream' | 'all'>('queue');

  return (
    <div className="p-3 sm:p-4 xl:p-4 max-w-[1860px] w-full mx-auto flex flex-col gap-3 sm:gap-3.5 bg-[#f4f6fa]">
      {/* 0. PROMINENT TOP-OF-DASHBOARD REAL-TIME HEADLINE SCROLL TICKER (Single Instance, Slower & Pausable) */}
      <div className="w-full">
        <BreakingNewsTicker speedSeconds={85} />
      </div>

      {/* 1. PERSPECTIVE SWITCHER TABS & VIEWPORT CONTROLS (Fills horizontal space cleanly with zero dead space) */}
      <div className="flex items-center justify-between flex-wrap gap-2 w-full bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold text-gov-primary uppercase tracking-wider">
            {language === 'mr' ? 'कमांड सेंटर कार्यक्षेत्र' : 'State Operations Command Cockpit'}
          </h2>
          <span className="text-[11px] font-semibold text-slate-600 font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
            {selectedDistrictId && selectedDistrictId !== 'all'
              ? `${selectedDistrictId.charAt(0).toUpperCase() + selectedDistrictId.slice(1)} District Telemetry`
              : (language === 'mr' ? 'सर्व ३६ जिल्हे थेट' : 'Statewide 36 Districts Live')}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-lg border border-slate-200 overflow-x-auto text-xs shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'overview'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'कमांड सेंटर (३-स्तंभ)' : 'Command Center (3-Col)'}
          </button>

          <button
            type="button"
            onClick={() => setActiveView('performance')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-3.5 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer ${
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

      {/* 3. DYNAMIC FOCUSED WORKSPACE (Balanced Height & Zero Dead Space) */}

      {/* VIEW A & E: THREE-COLUMN ENTERPRISE COMMAND COCKPIT */}
      {(activeView === 'overview' || activeView === 'all') && (
        <div className="flex flex-col gap-3.5 xl:gap-4 w-full">
          {/* THE 3 CORE COLUMNS — Balanced heights with flush bottom alignment */}
          <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-3.5 xl:gap-4 items-stretch w-full">
            {/* Column 1 — Comparative Analytics & Rankings (3/12 on XL) */}
            <div className="md:col-span-12 lg:col-span-7 xl:col-span-3 flex flex-col gap-3.5 min-w-0 h-full [&>*]:flex-1 [&>*]:h-full">
              <KeyMetricsTrends />
              <TopLowerMatrix />
            </div>

            {/* Column 2 — Main Interactive Intelligence Map & Score Decomposition (5/12 on XL, High Prominence) */}
            <div className="md:col-span-12 lg:col-span-5 xl:col-span-5 flex flex-col gap-3.5 min-w-0">
              <EnhancedMaharashtraGISMap
                className="min-h-[480px] shadow-sm"
                onDistrictSelect={(d) => {
                  setSelectedDistrictId(d.id);
                  setSearchDistrict(d.name);
                }}
              />
              <ScoreDecomposition />
            </div>

            {/* Column 3 — Alerts, Real-Time News & Broadcast Intel (4/12 on XL) */}
            <div className="md:col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-3.5 min-w-0">
              <EmergencyAlert />

              {/* Dynamic Live Media Operations Console */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden shrink-0">
                <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {language === 'mr' ? 'थेट माहिती व प्रक्षेपण कक्ष' : 'Live Media & Intel Desk'}
                    </span>
                  </div>

                  <div className="inline-flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setMediaTab('queue')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        mediaTab === 'queue' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'वृत्त प्रवाह' : 'News Queue'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('social')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        mediaTab === 'social' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'सोशल रडार' : 'Social Radar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('stream')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        mediaTab === 'stream' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'दूरदर्शन' : 'Broadcast'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('all')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                        mediaTab === 'all' ? 'bg-blue-600 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Stack All Streams"
                    >
                      {language === 'mr' ? 'सर्व' : 'All'}
                    </button>
                  </div>
                </div>

                <div className="p-2 space-y-3">
                  {(mediaTab === 'queue' || mediaTab === 'all') && <LiveNewsQueue />}
                  {(mediaTab === 'social' || mediaTab === 'all') && <SocialMediaAnalysis />}
                  {(mediaTab === 'stream' || mediaTab === 'all') && <LiveStreaming />}
                </div>
              </div>

              {/* Regional Division Benchmark, Sentiment Assessment, Department SLA & Citizen Grievance Velocity Charts */}
              <DivisionBenchmarkChart />
              <SentimentAssessmentChart />
              <DepartmentResolutionChart />
              <CitizenGrievanceVelocityChart />
            </div>
          </div>

          {/* LOWER COMPREHENSIVE DISTRICT LEADERBOARD: Full-Width Statewide Table with Zero Clipping */}
          <div className="w-full">
            <DistrictLeaderboard showChart={false} />
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
              <EnhancedMaharashtraGISMap initialMetric="crisis" className="min-h-[480px] shadow-sm" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeColumnDashboard;
