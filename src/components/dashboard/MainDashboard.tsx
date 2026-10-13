'use client';

import React from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { OperationsWorkspace } from './OperationsWorkspace';
import { LeadershipOverview } from '@/components/leadership/LeadershipOverview';

export const MainDashboard: React.FC = () => {
  return (
    <div className="p-5 space-y-5 max-w-[1720px] w-full mx-auto">
      {/* ZONE 1: Full-width KPI Ribbon (4 cards) */}
      <KPIRibbon />

      {/* Primary Operational Workspace: District Operations (8 cols) & Crisis Monitor (4 cols) */}
      <OperationsWorkspace />

      {/* Secondary Operational Workspace: Leadership Overview (4 panels) */}
      <LeadershipOverview />
    </div>
  );
};
