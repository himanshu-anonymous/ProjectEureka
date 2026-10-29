'use client';

import React from 'react';
import {
  LovableBreakingTicker,
  LovableTopKPIRibbon,
  LovableCrisisRumorTracking,
} from './LovableComponents';
import { EnhancedMaharashtraGISMap } from './EnhancedMaharashtraGISMap';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { useDashboardStore } from '@/stores/dashboardStore';

export const LovableCommandDashboard: React.FC = () => {
  const { language, selectedDistrictId } = useDashboardStore();

  return (
    <div className="space-y-4 max-w-[1920px] mx-auto w-full pb-8">
      {/* 0. Top Breaking News Ticker */}
      <LovableBreakingTicker />

      {/* 1. Clean Command Header */}
      <div className="flex items-center justify-between px-1 py-0.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
            {language === 'mr' ? 'महाराष्ट्र ऑपरेशन्स कमांड' : 'Maharashtra Operations Command'}
          </h1>
          <span className="rounded bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 border border-slate-200">
            {selectedDistrictId && selectedDistrictId !== 'all'
              ? `${selectedDistrictId.toUpperCase()}`
              : (language === 'mr' ? 'सर्व ३६ जिल्हे' : 'Statewide 36 Districts')}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          ● Live Telemetry
        </span>
      </div>

      {/* 2. Top 5 Executive KPI Ribbon */}
      <LovableTopKPIRibbon />

      {/* 3. Executive Command Cockpit (Spacious 2-Zone Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Main Zone (8 of 12 cols): 3D Model Map & Score Decomposition */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
          <EnhancedMaharashtraGISMap className="min-h-[520px] shadow-sm" />
          <ScoreDecomposition />
        </div>

        {/* Operational Intel Zone (4 of 12 cols): Performance Rankings & Active Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
          <TopLowerMatrix />
          <EmergencyAlert />
          <LovableCrisisRumorTracking />
        </div>
      </div>
    </div>
  );
};

export default LovableCommandDashboard;
