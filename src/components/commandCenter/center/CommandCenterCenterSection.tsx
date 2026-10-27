'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaharashtraMapTopology } from './MaharashtraMapTopology';
import { DistrictSubHeadSelector } from './DistrictSubHeadSelector';
import { DIODataDrawer } from './DIODataDrawer';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const CommandCenterCenterSection: React.FC = () => {
  const { selectedDistrictId, setSelectedDistrictId, language } = useDashboardStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
          <MaterialIcon name="map" size="sm" />
          <span>
            {language === 'mr'
              ? 'राज्य जीआयएस व जिल्हा उप-मुख्यालय नेटवर्क'
              : 'State GIS & District Sub-Head Network'}
          </span>
        </h3>
        <span className="text-[10px] font-mono text-content-muted">
          {language === 'mr' ? 'व्हेक्टर टोपोलॉजी व टेलिमेट्री' : 'Vector Topology & Telemetry'}
        </span>
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
