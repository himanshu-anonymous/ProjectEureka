'use client';

import React from 'react';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';

export interface KPICardProps {
  icon: MaterialIconName;
  title: string;
  marathiTitle?: string;
  value: string | number;
  unit?: string;
  targetText: string;
  trendDirection?: 'up' | 'down';
  trendValue: string;
  positiveTrend?: boolean;
  channelBreakdown?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  marathiTitle,
  value,
  unit,
  targetText,
  trendDirection,
  trendValue,
  positiveTrend = true,
  channelBreakdown,
}) => {
  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet =
    targetText.toLowerCase().includes('met') ||
    targetText.includes('साध्य') ||
    targetText.includes('सफल') ||
    targetText.toLowerCase().includes('above');

  return (
    <div className="bg-surface border border-slate-200 rounded-lg p-3 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors h-full min-h-[114px]">
      {/* 1. Header: Icon + Title */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <MaterialIcon name={icon} size="sm" className="text-slate-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-700 leading-tight truncate">{title}</div>
            {marathiTitle && (
              <div className="text-[10px] text-slate-500 font-medium truncate">{marathiTitle}</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Primary Metric */}
      <div>
        <div className="flex items-baseline gap-1.5 text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
          <span>{value}</span>
          {unit && <span className="text-xs font-semibold font-sans text-slate-500">{unit}</span>}
        </div>

        {channelBreakdown && (
          <div className="text-[9px] font-mono text-slate-500 mt-1 truncate" title={channelBreakdown}>
            {channelBreakdown}
          </div>
        )}

        {/* 3. Supporting Context Footer */}
        <div className="flex items-center justify-between text-[11px] mt-2 pt-1.5 border-t border-slate-100">
          <span
            className={`font-medium px-1.5 py-0.5 rounded text-[10px] truncate max-w-[170px] ${
              isTargetMet
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
            title={targetText}
          >
            {targetText}
          </span>
          <div
            className={`flex items-center gap-0.5 font-mono text-[10px] font-bold shrink-0 ${
              isHealthy ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {trendDirection === 'up' && <MaterialIcon name="arrow_upward" size="xs" />}
            {trendDirection === 'down' && <MaterialIcon name="arrow_downward" size="xs" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
