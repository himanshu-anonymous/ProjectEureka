'use client';

import React from 'react';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

export const DistrictsScreen: React.FC = () => {
  const { language } = useDashboardStore();

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
            <MaterialIcon name="location_on" size="sm" />
            <span>
              {language === 'mr'
                ? '३६ जिल्हे प्रशासन व कामगिरी मॅट्रिक्स'
                : '36 Districts Administration & Performance Matrix'}
            </span>
          </h2>
          <p className="text-xs text-content-muted">
            {language === 'mr'
              ? 'राज्यव्यापी सीपीआय मूल्यमापन, विभागीय केंद्र व रिअल-टाइम कामकाज एसएलए'
              : 'State-wide CPI Evaluation, Division Hubs & Real-time Operational SLAs'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-5">
          <DistrictLeaderboard />
          <ScoreDecomposition />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <GISMap />
          <TopLowerMatrix />
        </div>
      </div>
    </div>
  );
};
