'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Newspaper, Send, MessageSquare, AlertTriangle } from 'lucide-react';
import { ScoreMetricBar } from './ScoreMetricBar';

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
        <ScoreMetricBar
          icon={Newspaper}
          title="Volume"
          subtitle="Total releases / 300"
          score={selected.volumeScore}
          valueLabel={`${selected.releases} releases`}
          gapLabel={`Gap: ${25 - selected.volumeScore} pts`}
        />

        {/* 2. TAT / Dispatch Speed */}
        <ScoreMetricBar
          icon={Send}
          title="TAT / Dispatch Speed"
          subtitle="Avg. TAT (minutes)"
          score={selected.tatScore}
          valueLabel={`${selected.avgTAT} min`}
          gapLabel={`Gap: ${25 - selected.tatScore} pts`}
        />

        {/* 3. Media Sentiment */}
        <ScoreMetricBar
          icon={MessageSquare}
          title="Media Sentiment"
          subtitle="Net Sentiment Index"
          score={selected.sentimentScore}
          valueLabel={`${selected.sentiment}%`}
          gapLabel={`Gap: ${25 - selected.sentimentScore} pts`}
        />

        {/* 4. Crisis SLA */}
        <ScoreMetricBar
          icon={AlertTriangle}
          title="Crisis SLA"
          subtitle="Rumors refuted within 90 min"
          score={selected.crisisScore}
          valueLabel={`${selected.crisisSLA}%`}
          gapLabel={`Gap: ${25 - selected.crisisScore} pts`}
        />
      </div>
    </div>
  );
};
