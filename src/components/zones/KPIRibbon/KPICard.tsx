'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { MetricHoverDetail } from '@/components/shared/MetricHoverDetail';
import { DASHBOARD_METRIC_METHODOLOGIES } from '@/lib/sentimentEngine';

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
  methodologyKey?: keyof typeof DASHBOARD_METRIC_METHODOLOGIES;
  chartType?: 'sparkline' | 'bullet' | 'sentimentBar' | 'statusSplit';
  progressPercent?: number;
  targetPercent?: number;
  resolvedCount?: number;
  openCount?: number;
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
  methodologyKey,
  chartType,
  progressPercent,
  targetPercent,
  resolvedCount,
  openCount,
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
    <MetricHoverDetail
      methodologyKey={methodologyKey}
      currentValue={value}
      unit={unit}
      targetText={targetText}
      position="bottom"
      className="w-full h-full"
    >
      <div className="bg-surface border border-slate-200 rounded-lg p-3 flex flex-col justify-between shadow-xs hover:border-slate-300 hover:shadow-md transition-all h-full min-h-[114px] group">
        {/* 1. Header: Icon + Title */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <MaterialIcon name={icon} size="sm" className="text-slate-500 group-hover:text-gov-primary transition-colors shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-700 leading-tight truncate group-hover:text-slate-900">{title}</div>
              {marathiTitle && (
                <div className="text-[10px] text-slate-500 font-medium truncate">{marathiTitle}</div>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-amber-600 font-bold transition-colors">
            ⓘ
          </span>
        </div>

        {/* 2. Primary Metric with Power BI Inline Micro-Chart */}
        <div className="flex-1 flex flex-col justify-between my-0.5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1.5 text-2xl font-bold font-mono tracking-tight text-slate-900 leading-none">
                <span>{value}</span>
                {unit && <span className="text-xs font-semibold font-sans text-slate-500">{unit}</span>}
              </div>

              {/* Power BI Inline Micro-Visualizations */}
              {chartType === 'sparkline' && (
                <div className="w-20 h-6 shrink-0 flex items-center" title="7-day velocity trajectory">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
                    <defs>
                      <linearGradient id="kpi-spark-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,18 Q 12,14 24,16 T 48,10 T 68,6 T 80,4 L 80,24 L 0,24 Z"
                      fill="url(#kpi-spark-grad)"
                    />
                    <path
                      d="M 0,18 Q 12,14 24,16 T 48,10 T 68,6 T 80,4"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <circle cx="80" cy="4" r="2.5" fill="#0284C7" />
                  </svg>
                </div>
              )}

              {chartType === 'bullet' && (
                <div className="w-20 shrink-0 flex flex-col gap-0.5" title={`Actual: ${progressPercent || 98.4}% vs Target: ${targetPercent || 95}%`}>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>Tgt {targetPercent || 95}%</span>
                    <span className="font-bold text-emerald-700">{progressPercent || 98.4}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, progressPercent || 98.4)}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                      style={{ left: `${targetPercent || 95}%` }}
                    />
                  </div>
                </div>
              )}

              {chartType === 'sentimentBar' && (
                <div className="w-20 shrink-0 flex flex-col gap-0.5" title="Multi-channel sentiment distribution">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span className="text-emerald-700 font-bold">Positive</span>
                    <span>{progressPercent || 78}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                    <div style={{ width: `${progressPercent || 78}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${Math.max(0, 92 - (progressPercent || 78))}%` }} className="bg-slate-400 h-full" />
                    <div style={{ width: '8%' }} className="bg-rose-500 h-full" />
                  </div>
                </div>
              )}

              {chartType === 'statusSplit' && (
                <div className="w-20 shrink-0 flex flex-col gap-0.5" title={`${resolvedCount || 41} Resolved, ${openCount || 3} Open`}>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span className="text-emerald-700 font-bold">{resolvedCount || 41} Res</span>
                    <span className="text-rose-600 font-bold">{openCount || 3} Op</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                    <div
                      style={{ width: `${Math.round(((resolvedCount || 41) / ((resolvedCount || 41) + (openCount || 3))) * 100)}%` }}
                      className="bg-emerald-500 h-full"
                    />
                    <div
                      style={{ width: `${Math.round(((openCount || 3) / ((resolvedCount || 41) + (openCount || 3))) * 100)}%` }}
                      className="bg-rose-500 h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-sans text-slate-500 mt-1 truncate" title={channelBreakdown || targetText}>
              {channelBreakdown || (title.includes('Release') || title.includes('प्रसिद्धी') ? 'Official Directorate Dispatches' : title.includes('Resolution') || title.includes('निवारण') || title.includes('SLA') ? 'Crisis SLA Window Compliance (<4h)' : 'Verified Administrative Incident Desk')}
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
    </MetricHoverDetail>
  );
};

