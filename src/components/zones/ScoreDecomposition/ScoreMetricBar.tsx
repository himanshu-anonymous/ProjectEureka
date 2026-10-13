'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ScoreMetricBarProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  score: number;
  maxScore?: number;
  valueLabel: string;
  gapLabel: string;
}

export const ScoreMetricBar: React.FC<ScoreMetricBarProps> = ({
  icon: Icon,
  title,
  subtitle,
  score,
  maxScore = 25,
  valueLabel,
  gapLabel,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-content-primary" />
          <span className="font-medium text-content-primary">{title}</span>
          <span className="text-content-muted">{subtitle}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-content-primary font-medium">
            {score} / {maxScore}
          </span>
          <span className="font-mono text-content-muted w-24 text-right">
            {valueLabel}
          </span>
          <span className="text-[11px] text-content-muted w-16 text-right">
            {gapLabel}
          </span>
        </div>
      </div>
      <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
        <div
          className="bg-content-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
