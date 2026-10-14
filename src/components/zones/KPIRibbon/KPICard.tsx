'use client';

import React from 'react';
import { LucideIcon, ArrowDown, ArrowUp } from 'lucide-react';

export interface KPICardProps {
  icon: LucideIcon;
  title: string;
  marathiTitle?: string;
  value: string | number;
  unit?: string;
  targetText: string;
  trendDirection?: 'up' | 'down';
  trendValue: string;
  positiveTrend?: boolean; // whether "up" is desirable or "down" is desirable
}

export const KPICard: React.FC<KPICardProps> = ({
  icon: Icon,
  title,
  marathiTitle,
  value,
  unit,
  targetText,
  trendDirection,
  trendValue,
  positiveTrend = true,
}) => {
  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet = targetText.toLowerCase().includes('met');

  return (
    <div className="bg-surface border border-slate-200 border-l-4 border-l-gov-primary rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 text-gov-blue">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gov-primary leading-tight">{title}</div>
            {marathiTitle && (
              <div className="text-[10px] text-slate-500 font-medium">{marathiTitle}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-1">
        <div className="flex items-baseline gap-1 text-2xl font-bold tracking-tight text-slate-900">
          <span>{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
        </div>

        <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
          <span
            className={`font-medium ${
              isTargetMet ? 'text-emerald-700' : 'text-slate-500'
            }`}
          >
            {targetText}
          </span>
          <div
            className={`flex items-center gap-0.5 font-bold ${
              isHealthy ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {trendDirection === 'up' && <ArrowUp className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <ArrowDown className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
