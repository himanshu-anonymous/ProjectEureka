'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { TopLowerMatrix } from './TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from './SocialMediaAnalysis/SocialMediaAnalysis';
import { GISMap } from './GISMap/GISMap';
import { LiveStreaming } from './LiveStreaming/LiveStreaming';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export interface LeadershipOverviewProps {
  /** Optional prop to enable cross-panel highlighting when a district is selected */
  highlightDistrict?: (districtId: string) => void;
}

export const LeadershipOverview: React.FC<LeadershipOverviewProps> = () => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <section className="pt-2 space-y-3" aria-label={t.leadership.mainHeader}>
      {/* Leadership Section Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-gov-primary text-amber-400 shadow-2xs">
            <MaterialIcon name="shield" size="sm" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gov-primary tracking-tight">
              {t.leadership.mainHeader}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.leadership.mainSub}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-500/15 text-amber-900 border border-amber-300 rounded">
            {t.leadership.cmoBadge}
          </span>
        </div>
      </div>

      {/* 2x2 Clean Grid matching Wireframe 2 exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Panel 1 (Top-Left): Top / Lower Five Matrix */}
        <TopLowerMatrix />

        {/* Panel 2 (Top-Right): Social Media Analysis (Split Streams) */}
        <SocialMediaAnalysis />

        {/* Panel 3 (Bottom-Left): Maharashtra GIS Map */}
        <GISMap />

        {/* Panel 4 (Bottom-Right): Live Event Streaming */}
        <LiveStreaming />
      </div>
    </section>
  );
};
