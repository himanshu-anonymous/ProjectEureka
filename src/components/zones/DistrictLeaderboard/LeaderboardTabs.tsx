'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

export type LeaderboardTab = 'cpi' | 'event' | 'specific';

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <div className="flex gap-4 text-xs border-b border-slate-200 -mb-3 pb-2 pt-1 overflow-x-auto">
      <button
        onClick={() => onTabChange('cpi')}
        className={`font-semibold pb-1.5 transition-colors whitespace-nowrap ${
          activeTab === 'cpi'
            ? 'text-gov-primary border-b-2 border-gov-accent'
            : 'text-slate-500 hover:text-gov-primary'
        }`}
      >
        {t.zone2.cpiTab}
      </button>
      <button
        onClick={() => onTabChange('event')}
        className={`font-semibold pb-1.5 transition-colors whitespace-nowrap ${
          activeTab === 'event'
            ? 'text-gov-primary border-b-2 border-gov-accent'
            : 'text-slate-500 hover:text-gov-primary'
        }`}
      >
        {t.zone2.eventTab}
      </button>
      <button
        onClick={() => onTabChange('specific')}
        className={`font-semibold pb-1.5 transition-colors whitespace-nowrap ${
          activeTab === 'specific'
            ? 'text-gov-primary border-b-2 border-gov-accent'
            : 'text-slate-500 hover:text-gov-primary'
        }`}
      >
        {t.zone2.newsTab}
      </button>
    </div>
  );
};
