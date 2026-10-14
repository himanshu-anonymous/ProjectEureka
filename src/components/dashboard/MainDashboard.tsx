'use client';

import React from 'react';
import { DailyWorkFlowchart } from '@/components/workflow/DailyWorkFlowchart';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { OperationsWorkspace } from './OperationsWorkspace';
import { DepartmentWiseDataView } from '@/components/departments/DepartmentWiseDataView';
import { LeadershipOverview } from '@/components/leadership/LeadershipOverview';

export const MainDashboard: React.FC = () => {
  return (
    <div className="p-5 space-y-6 max-w-[1720px] w-full mx-auto">
      {/* Webportals: Daily Operational Workflow Flowchart */}
      <DailyWorkFlowchart />

      {/* ZONE 1: Full-width KPI Ribbon (4 cards) */}
      <KPIRibbon />

      {/* Primary Operational Workspace: District Operations (8 cols) & Crisis Monitor (4 cols) */}
      <OperationsWorkspace />

      {/* Department-Wise Media & Communications Hub */}
      <DepartmentWiseDataView />

      {/* Secondary Operational Workspace: Leadership Overview (4 panels) */}
      <LeadershipOverview />
    </div>
  );
};
