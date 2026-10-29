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

  let barColorClass = 'bg-[#20A765]';
  if (percentage < 60) {
    barColorClass = 'bg-[#E94B4B]';
  } else if (percentage < 80) {
    barColorClass = 'bg-[#F2994A]';
  }

  return (
    <div className="space-y-2 p-2.5 rounded-lg hover:bg-slate-50/80 transition-colors">
      <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
            <MaterialIcon name={icon} size="sm" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block sm:inline">{title}</span>
            <span className="text-xs text-slate-500 sm:ml-2 block sm:inline font-medium">{subtitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-gov-primary font-bold text-sm">
            {score} <span className="text-slate-400 font-normal text-xs">/ {maxScore}</span>
          </span>
          <span className="font-mono text-slate-700 w-28 text-right font-semibold text-xs">
            {valueLabel}
          </span>
          <span
            className={`text-xs font-mono font-bold w-24 text-right ${
              score >= maxScore
                ? 'text-slate-400'
                : 'text-amber-600'
            }`}
          >
            {gapLabel}
          </span>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
        <div
          className={`${barColorClass} h-full rounded-full transition-all duration-300 shadow-2xs`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
