'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Newspaper, Send, MessageSquare, AlertTriangle } from 'lucide-react';

export const ScoreDecomposition: React.FC = () => {
  const { districts, selectedDistrictId } = useDashboardStore();

  const selected =
    districts.find((d) => d.id === selectedDistrictId) || districts[0];

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">
          CPI Score Decomposition — {selected.name}{' '}
          <span className="text-xs font-normal text-content-muted">(Selected District)</span>
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-content-secondary font-medium">Rank #{selected.rank}</span>
          <span className="text-content-primary font-bold">CPI {selected.cpi}/100</span>
        </div>
      </div>

      {/* 4 Constituent Scores */}
      <div className="p-4 space-y-4">
        {/* 1. Volume Score */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Newspaper className="w-3.5 h-3.5 text-content-primary" />
              <span className="font-medium text-content-primary">Volume</span>
              <span className="text-content-muted">Total releases / 300</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-content-primary font-medium">
                {selected.volumeScore} / 25
              </span>
              <span className="font-mono text-content-muted w-24 text-right">
                {selected.releases} releases
              </span>
              <span className="text-[11px] text-content-muted w-16 text-right">
                Gap: {25 - selected.volumeScore} pts
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-content-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${(selected.volumeScore / 25) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 2. TAT / Dispatch Speed */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-content-primary" />
              <span className="font-medium text-content-primary">TAT / Dispatch Speed</span>
              <span className="text-content-muted">Avg. TAT (minutes)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-content-primary font-medium">
                {selected.tatScore} / 25
              </span>
              <span className="font-mono text-content-muted w-24 text-right">
                {selected.avgTAT} min
              </span>
              <span className="text-[11px] text-content-muted w-16 text-right">
                Gap: {25 - selected.tatScore} pts
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-content-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${(selected.tatScore / 25) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 3. Media Sentiment */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-content-primary" />
              <span className="font-medium text-content-primary">Media Sentiment</span>
              <span className="text-content-muted">Net Sentiment Index</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-content-primary font-medium">
                {selected.sentimentScore} / 25
              </span>
              <span className="font-mono text-content-muted w-24 text-right">
                {selected.sentiment}%
              </span>
              <span className="text-[11px] text-content-muted w-16 text-right">
                Gap: {25 - selected.sentimentScore} pts
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-content-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${(selected.sentimentScore / 25) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 4. Crisis SLA */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-content-primary" />
              <span className="font-medium text-content-primary">Crisis SLA</span>
              <span className="text-content-muted">Rumors refuted within 90 min</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-content-primary font-medium">
                {selected.crisisScore} / 25
              </span>
              <span className="font-mono text-content-muted w-24 text-right">
                {selected.crisisSLA}%
              </span>
              <span className="text-[11px] text-content-muted w-16 text-right">
                Gap: {25 - selected.crisisScore} pts
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-content-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${(selected.crisisScore / 25) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
