'use client';

import React, { useState } from 'react';
import { TOP_LOWER_MATRIX } from '@/data/dashboardData';

export const TopLowerMatrix: React.FC = () => {
  const [tab, setTab] = useState<'event' | 'specific'>('event');

  const currentData =
    tab === 'event' ? TOP_LOWER_MATRIX.eventCoverage : TOP_LOWER_MATRIX.specificNews;

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col h-full">
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">Top / Lower Five Matrix</h3>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setTab('event')}
            className={`px-2 py-0.5 rounded transition-colors ${
              tab === 'event'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            Event Coverage
          </button>
          <button
            onClick={() => setTab('specific')}
            className={`px-2 py-0.5 rounded transition-colors ${
              tab === 'specific'
                ? 'bg-action-primary text-content-inverse'
                : 'text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            Specific News Coverage
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 text-xs">
        {/* Top 5 */}
        <div>
          <div className="font-semibold text-content-primary mb-2 border-b border-borderLine-subtle pb-1">
            Top 5
          </div>
          <div className="space-y-1.5 font-mono">
            {currentData.top5.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-content-primary">
                <span>
                  {item.rank}. {item.name}
                </span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lower 5 */}
        <div>
          <div className="font-semibold text-content-secondary mb-2 border-b border-borderLine-subtle pb-1">
            Lower 5
          </div>
          <div className="space-y-1.5 font-mono">
            {currentData.lower5.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-content-secondary">
                <span>
                  {item.rank}. {item.name}
                </span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-surface-secondary border-t border-borderLine-subtle text-[11px] text-content-muted flex justify-between">
        <span>Total districts: 36</span>
        <span>Standardized Reporting</span>
      </div>
    </div>
  );
};
