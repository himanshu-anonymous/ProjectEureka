'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
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
      <div className="flex-1 flex flex-col justify-between my-0.5">
        <div>
          <div className="flex items-baseline gap-1.5 text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
            <span>{value}</span>
            {unit && <span className="text-xs font-semibold font-sans text-slate-500">{unit}</span>}
          </div>

          <div className="text-[10px] font-sans text-slate-500 mt-1 truncate" title={channelBreakdown || targetText}>
            {channelBreakdown || (title.includes('Release') || title.includes('प्रसिद्धी') ? 'Official Directorate Dispatches' : title.includes('Resolution') || title.includes('निवारण') ? 'Citizen Charter SLA Compliance' : 'Verified Administrative Incident Desk')}
          </div>
        </div>

        {/* 3. Supporting Context Footer */}
        <div className="flex items-center justify-between text-[11px] mt-2 pt-1.5 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-1.5 font-medium text-[11px] truncate max-w-[170px] ${
              isTargetMet ? 'text-emerald-700 font-semibold' : 'text-slate-600'
            }`}
            title={targetText}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isTargetMet ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            <span className="truncate">{targetText}</span>
          </span>
          <div
            className={`flex items-center gap-0.5 font-mono text-[10px] font-bold shrink-0 ${
              isHealthy ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {trendDirection === 'up' && <ArrowTrendingUpIcon className="w-3.5 h-3.5 shrink-0" />}
            {trendDirection === 'down' && <ArrowTrendingDownIcon className="w-3.5 h-3.5 shrink-0" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
