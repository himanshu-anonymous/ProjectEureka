'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaharashtraMapTopology } from './MaharashtraMapTopology';
import { DistrictSubHeadSelector } from './DistrictSubHeadSelector';
import { DIODataDrawer } from './DIODataDrawer';
import { Map } from 'lucide-react';

export const CommandCenterCenterSection: React.FC = () => {
  const { selectedDistrictId, setSelectedDistrictId } = useDashboardStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5" />
          <span>Maharashtra State GIS & DIO Sub-Head Network (Center Section)</span>
        </h3>
        <span className="text-[10px] font-mono text-content-muted">Vector Topology & Telemetry</span>
      </div>

      <div className="bg-surface border border-borderLine-standard rounded-md p-4 space-y-4">
        {/* Interactive Map */}
        <MaharashtraMapTopology
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />

        {/* District Sub-heads Selector */}
        <DistrictSubHeadSelector />

        {/* DIO Data Drawer for Selected Sub-head */}
        <DIODataDrawer />
      </div>
    </div>
  );
};
