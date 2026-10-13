'use client';

import React from 'react';

export type LeaderboardTab = 'cpi' | 'event' | 'specific';

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-4 text-xs border-b border-borderLine-subtle -mb-3 pb-2">
      <button
        onClick={() => onTabChange('cpi')}
        className={`font-medium pb-1 transition-colors ${
          activeTab === 'cpi'
            ? 'text-content-primary border-b-2 border-action-primary'
            : 'text-content-secondary hover:text-content-primary'
        }`}
      >
        CPI Ranking
      </button>
      <button
        onClick={() => onTabChange('event')}
        className={`font-medium pb-1 transition-colors ${
          activeTab === 'event'
            ? 'text-content-primary border-b-2 border-action-primary'
            : 'text-content-secondary hover:text-content-primary'
        }`}
      >
        Event Coverage (Top/Lower 5)
      </button>
      <button
        onClick={() => onTabChange('specific')}
        className={`font-medium pb-1 transition-colors ${
          activeTab === 'specific'
            ? 'text-content-primary border-b-2 border-action-primary'
            : 'text-content-secondary hover:text-content-primary'
        }`}
      >
        Specific News Coverage (Top/Lower 5)
      </button>
    </div>
  );
};
