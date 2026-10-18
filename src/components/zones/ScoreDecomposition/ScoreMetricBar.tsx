'use client';

import React from 'react';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';

interface ScoreMetricBarProps {
  icon: MaterialIconName;
  title: string;
  subtitle: string;
  score: number;
  maxScore?: number;
  valueLabel: string;
  gapLabel: string;
}

export const ScoreMetricBar: React.FC<ScoreMetricBarProps> = ({
  icon,
  title,
  subtitle,
  score,
  maxScore = 25,
  valueLabel,
  gapLabel,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  let barColorClass = 'bg-emerald-600';
  if (percentage < 60) {
    barColorClass = 'bg-rose-600';
  } else if (percentage < 80) {
    barColorClass = 'bg-amber-500';
  }

  const hasSignificantGap = maxScore - score >= 7;

  return (
    <div className="space-y-1.5 p-2 rounded-md hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between text-xs flex-wrap gap-1">
        <div className="flex items-center gap-2">
          <MaterialIcon name={icon} size="sm" className="text-slate-500" />
          <div>
            <span className="font-bold text-slate-800">{title}</span>
            <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">{subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-gov-primary font-bold">
            {score} <span className="text-slate-400 font-normal">/ {maxScore}</span>
          </span>
          <span className="font-mono text-slate-600 w-24 text-right font-medium">
            {valueLabel}
          </span>
          <span
            className={`text-[11px] font-mono w-24 text-right ${
              score >= maxScore
                ? 'text-slate-400'
                : 'text-amber-600 font-medium'
            }`}
          >
            {gapLabel}
          </span>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${barColorClass} h-full rounded-full transition-all duration-300 shadow-2xs`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
