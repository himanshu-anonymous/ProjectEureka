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
type CenterDeckTab = 'leaderboard' | 'score' | 'department';

export const ThreeColumnDashboard: React.FC = () => {
  const { language, selectedDistrictId, setSelectedDistrictId, setSearchDistrict } = useDashboardStore();
  const [activeView, setActiveView] = useState<DashboardWorkspaceView>('overview');
  const [mediaTab, setMediaTab] = useState<'stream' | 'queue' | 'social' | 'all'>('stream');
  const [centerTab, setCenterTab] = useState<CenterDeckTab>('leaderboard');

  return (
    <div className="h-full max-h-full w-full max-w-[1860px] mx-auto flex flex-col gap-1 sm:gap-1.5 p-1 sm:p-1.5 xl:p-2 bg-[#f4f6fa] overflow-hidden select-none">
      {/* 0. PROMINENT TOP-OF-DASHBOARD REAL-TIME HEADLINE SCROLL TICKER (Broadcast Red, Zero-Jitter) */}
      <div className="w-full shrink-0">
        <BreakingNewsTicker speedSeconds={85} />
      </div>

      {/* 1. PERSPECTIVE SWITCHER TABS & VIEWPORT CONTROLS (Compact Executive Bar) */}
      <div className="shrink-0 flex items-center justify-between flex-wrap gap-1.5 w-full bg-white px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-[11px] font-bold text-gov-primary uppercase tracking-wider">
            {language === 'mr' ? 'कमांड सेंटर (एकल स्क्रीन)' : 'Command Center (Single Screen)'}
          </h2>
          <span className="text-[10px] font-semibold text-slate-600 font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded shadow-2xs">
            {selectedDistrictId && selectedDistrictId !== 'all'
              ? `${selectedDistrictId.charAt(0).toUpperCase() + selectedDistrictId.slice(1)} District Telemetry`
              : (language === 'mr' ? 'सर्व ३६ जिल्हे थेट' : 'Statewide 36 Districts Live')}
          </span>
        </div>

        <div className="inline-flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded border border-slate-200 overflow-x-auto text-[10px] shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView('overview')}
            className={`px-2.5 py-1 rounded font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-2.5 py-1 rounded font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-2.5 py-1 rounded font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-2.5 py-1 rounded font-semibold transition-all shrink-0 cursor-pointer ${
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
            className={`px-2.5 py-1 rounded font-semibold transition-all shrink-0 cursor-pointer ${
              activeView === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {language === 'mr' ? 'सर्व विभाग (कमांड वॉल)' : 'Command Wall (All)'}
          </button>
        </div>
      </div>

      {/* 2. FULL-WIDTH CORE KPI RIBBON (Compact High-Density State Telemetry) */}
      <section className="w-full">
        <KPIRibbon layout="ribbon" />
      </section>

      {/* 3. DYNAMIC FOCUSED WORKSPACE (100% Height Fill, Zero Page Scrolling) */}

      {/* VIEW A & E: THREE-COLUMN ENTERPRISE COMMAND COCKPIT */}
      {(activeView === 'overview' || activeView === 'all') && (
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          {/* THE 3 CORE COLUMNS — Balanced heights with flush bottom alignment */}
          <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-1.5 sm:gap-2 xl:gap-2.5 items-stretch w-full h-full min-h-0 overflow-hidden">
            {/* Column 1 — Comparative Analytics & Rankings (3/12 on XL) */}
            <div className="md:col-span-12 lg:col-span-7 xl:col-span-3 flex flex-col gap-1.5 min-w-0 h-full min-h-0 overflow-hidden [&>*]:flex-1 [&>*]:h-full">
              <div className="h-[48%] min-h-0 flex flex-col overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <TopLowerMatrix />
              </div>
              <div className="h-[52%] min-h-0 flex flex-col overflow-hidden bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <KeyMetricsTrends />
              </div>
            </div>

            {/* Column 2 — Main Interactive Intelligence Map & Score Decomposition (5/12 on XL, High Prominence) */}
            <div className="md:col-span-12 lg:col-span-5 xl:col-span-5 flex flex-col gap-1.5 min-w-0 h-full min-h-0 overflow-hidden">
              {/* Tactical 36-District GIS Map Core */}
              <div className="h-[52%] min-h-0 flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden p-1">
                <EnhancedMaharashtraGISMap
                  className="h-full w-full min-h-0 shadow-none border-0"
                  onDistrictSelect={(d) => {
                    setSelectedDistrictId(d.id);
                    setSearchDistrict(d.name);
                  }}
                />
              </div>

              {/* Center Multi-Deck Tabs: 36-District Leaderboard Table, CPI Pillars & Dept SLA */}
              <div className="h-[48%] min-h-0 flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="px-2.5 py-1 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gov-primary" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {centerTab === 'leaderboard'
                        ? (language === 'mr' ? '३६ जिल्हे क्रमवारी तक्ता' : '36-District Roster Table')
                        : centerTab === 'score'
                        ? (language === 'mr' ? 'गुण रचना (३५/३५/३०)' : 'Score Decomposition (35/35/30)')
                        : (language === 'mr' ? 'विभागीय तक्रार निवारण' : 'Department Resolution')}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-0.5 bg-slate-200/70 p-0.5 rounded text-[9px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setCenterTab('leaderboard')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        centerTab === 'leaderboard' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'जिल्हा तक्ता' : 'Leaderboard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCenterTab('score')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        centerTab === 'score' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'गुण रचना' : 'CPI Pillars'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCenterTab('department')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        centerTab === 'department' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'विभाग SLA' : 'Dept SLA'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-1">
                  {centerTab === 'leaderboard' && <DistrictLeaderboard showChart={false} />}
                  {centerTab === 'score' && <ScoreDecomposition />}
                  {centerTab === 'department' && <DepartmentResolutionChart />}
                </div>
              </div>
            </div>

            {/* Column 3 — Alerts, Real-Time News & Broadcast Intel (4/12 on XL) */}
            <div className="md:col-span-12 lg:col-span-12 xl:col-span-4 flex flex-col gap-1.5 min-w-0 h-full min-h-0 overflow-hidden">
              <div className="shrink-0">
                <EmergencyAlert />
              </div>

              {/* Dynamic Live Media Operations Console */}
              <div className="flex-1 min-h-0 bg-white rounded-xl shadow-2xs border border-slate-200/80 flex flex-col overflow-hidden">
                <div className="px-2.5 py-1 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-wrap gap-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                      {language === 'mr' ? 'थेट माहिती व प्रक्षेपण' : 'Live Media & Intel'}
                    </span>
                  </div>

                  <div className="inline-flex items-center bg-slate-200/80 p-0.5 rounded text-[9px] font-medium">
                    <button
                      type="button"
                      onClick={() => setMediaTab('stream')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                        mediaTab === 'stream' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'थेट व्हिडिओ' : 'Live Stream'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('queue')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                        mediaTab === 'queue' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'वृत्त प्रवाह' : 'News Wire'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('social')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all cursor-pointer ${
                        mediaTab === 'social' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {language === 'mr' ? 'सोशल' : 'Social'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('all')}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-semibold transition-all cursor-pointer ${
                        mediaTab === 'all' ? 'bg-blue-600 text-white shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                      title="Stack All Streams"
                    >
                      {language === 'mr' ? 'सर्व' : 'All'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-1 space-y-1">
                  {(mediaTab === 'stream' || mediaTab === 'all') && <LiveStreaming />}
                  {(mediaTab === 'queue' || mediaTab === 'all') && <LiveNewsQueue />}
                  {(mediaTab === 'social' || mediaTab === 'all') && <SocialMediaAnalysis />}
                </div>
              </div>

              {/* Bottom Micro-Analytics Strip: Sentiment Assessment & Division Benchmarks */}
              <div className="shrink-0 h-[100px] overflow-hidden flex flex-col bg-white rounded-xl border border-slate-200/90 shadow-2xs p-1">
                <SentimentAssessmentChart />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: DISTRICT PERFORMANCE & CPI MATRIX */}
      {activeView === 'performance' && (
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch w-full h-full min-h-0 overflow-hidden">
            <div className="lg:col-span-7 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-y-auto scrollbar-thin">
              <DistrictLeaderboard showChart={true} />
              <TopLowerMatrix />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-y-auto scrollbar-thin">
              <ScoreDecomposition />
              <KeyMetricsTrends />
              <DivisionBenchmarkChart />
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: MEDIA INTELLIGENCE & BROADCAST */}
      {activeView === 'media' && (
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch w-full h-full min-h-0 overflow-hidden">
            <div className="lg:col-span-6 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-y-auto scrollbar-thin">
              <LiveStreaming />
            </div>
            <div className="lg:col-span-6 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-y-auto scrollbar-thin">
              <SocialMediaAnalysis />
              <LiveNewsQueue />
            </div>
          </div>
        </div>
      )}

      {/* VIEW D: CRISIS & EMERGENCY OPERATIONS */}
      {activeView === 'crisis' && (
        <div className="flex-1 min-h-0 w-full overflow-hidden flex flex-col gap-2">
          <div className="shrink-0">
            <EmergencyAlert />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch w-full flex-1 min-h-0 overflow-hidden">
            <div className="lg:col-span-8 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-hidden">
              <EnhancedMaharashtraGISMap initialMetric="crisis" className="h-full w-full min-h-0 shadow-sm" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-2 min-w-0 h-full min-h-0 overflow-y-auto scrollbar-thin">
              <LiveNewsQueue />
              <CitizenGrievanceVelocityChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeColumnDashboard;
