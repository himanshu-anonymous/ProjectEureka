'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/20/solid';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';
import { MetricHoverDetail } from '@/components/shared/MetricHoverDetail';
import { DASHBOARD_METRIC_METHODOLOGIES } from '@/lib/sentimentEngine';
import { useDashboardStore } from '@/stores/dashboardStore';

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
  const { language } = useDashboardStore();

  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet =
    targetText.toLowerCase().includes('met') ||
    targetText.includes('साध्य') ||
    targetText.includes('सफल') ||
    targetText.toLowerCase().includes('above');

  // Subtitle localized without clutter
  const getSubLabel = () => {
    if (channelBreakdown) return channelBreakdown;
    if (title.includes('Release') || title.includes('प्रसिद्धी')) {
      return language === 'mr' ? 'अधिकृत संचालनालय प्रसिद्धी' : 'Directorate Dispatches';
    }
    if (title.includes('Resolution') || title.includes('निवारण') || title.includes('SLA')) {
      return language === 'mr' ? '४-तास आपत्कालीन खिडकी' : 'Statutory 4h SLA Window';
    }
    return language === 'mr' ? 'तथ्य पडताळणी कक्ष' : 'Fact-Check Verification Desk';
  };

  return (
    <MetricHoverDetail
      methodologyKey={methodologyKey}
      currentValue={value}
      unit={unit}
      targetText={targetText}
      position="bottom"
      className="w-full h-full"
    >
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 hover:shadow-md transition-all h-full min-h-[124px] group">
        {/* 1. Header: Icon + Title */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-gov-primary transition-colors shrink-0">
              <MaterialIcon name={icon} size="sm" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 leading-snug truncate group-hover:text-gov-primary transition-colors">
                {title}
              </h4>
              {marathiTitle && (
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{marathiTitle}</p>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400 group-hover:text-amber-600 font-bold transition-colors">
            ⓘ
          </span>
        </div>

        {/* 2. Primary Metric + Micro-Chart */}
        <div className="flex-1 flex flex-col justify-between my-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5 text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 leading-none">
              <span>{value}</span>
              {unit && <span className="text-sm font-semibold font-sans text-slate-500">{unit}</span>}
            </div>

            {/* Micro-Visualizations */}
            {chartType === 'sparkline' && (
              <div className="w-24 h-7 shrink-0 flex items-center" title="7-day velocity trajectory">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 80 24">
                  <defs>
                    <linearGradient id="kpi-spark-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#20A765" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#20A765" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,18 Q 12,14 24,16 T 48,10 T 68,6 T 80,4 L 80,24 L 0,24 Z"
                    fill="url(#kpi-spark-grad)"
                  />
                  <path
                    d="M 0,18 Q 12,14 24,16 T 48,10 T 68,6 T 80,4"
                    fill="none"
                    stroke="#20A765"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="80" cy="4" r="3" fill="#20A765" />
                </svg>
              </div>
            )}

            {chartType === 'bullet' && (
              <div className="w-24 shrink-0 flex flex-col gap-1" title={`Actual: ${progressPercent || 98.4}% vs Target: ${targetPercent || 95}%`}>
                <div className="flex justify-between text-xs font-mono font-semibold text-slate-600">
                  <span>Tgt {targetPercent || 95}%</span>
                  <span className="font-bold text-[#20A765]">{progressPercent || 98.4}%</span>
                </div>
                <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-[#20A765] rounded-full transition-all"
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
              <div className="w-24 shrink-0 flex flex-col gap-1" title="Sentiment distribution">
                <div className="flex justify-between text-xs font-mono font-semibold text-slate-600">
                  <span className="text-[#20A765] font-bold">Positive</span>
                  <span className="font-bold">{progressPercent || 78}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                  <div style={{ width: `${progressPercent || 78}%` }} className="bg-[#20A765] h-full" />
                  <div style={{ width: `${Math.max(0, 92 - (progressPercent || 78))}%` }} className="bg-[#F2C94C] h-full" />
                  <div style={{ width: '8%' }} className="bg-[#E94B4B] h-full" />
                </div>
              </div>
            )}

            {chartType === 'statusSplit' && (
              <div className="w-24 shrink-0 flex flex-col gap-1" title={`${resolvedCount || 41} Resolved, ${openCount || 3} Open`}>
                <div className="flex justify-between text-xs font-mono font-semibold text-slate-600">
                  <span className="text-[#20A765] font-bold">{resolvedCount || 41} Res</span>
                  <span className="text-[#E94B4B] font-bold">{openCount || 3} Op</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                  <div
                    style={{ width: `${Math.round(((resolvedCount || 41) / ((resolvedCount || 41) + (openCount || 3))) * 100)}%` }}
                    className="bg-[#20A765] h-full"
                  />
                  <div
                    style={{ width: `${Math.round(((openCount || 3) / ((resolvedCount || 41) + (openCount || 3))) * 100)}%` }}
                    className="bg-[#E94B4B] h-full"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-xs font-medium text-slate-500 mt-1.5 truncate" title={getSubLabel()}>
            {getSubLabel()}
          </div>
        </div>

        {/* 3. Supporting Context Footer */}
        <div className="flex items-center justify-between text-xs mt-2.5 pt-2 border-t border-slate-100">
          <span
            className={`inline-flex items-center gap-1.5 font-semibold text-xs truncate max-w-[180px] ${
              isTargetMet ? 'text-[#20A765]' : 'text-slate-600'
            }`}
            title={targetText}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isTargetMet ? 'bg-[#20A765]' : 'bg-slate-400'
              }`}
            />
            <span className="truncate">{targetText}</span>
          </span>
          <div
            className={`flex items-center gap-1 font-mono text-xs font-bold shrink-0 ${
              isHealthy ? 'text-[#20A765]' : 'text-[#E94B4B]'
            }`}
          >
            {trendDirection === 'up' && <ArrowTrendingUpIcon className="w-3.5 h-3.5 shrink-0" />}
            {trendDirection === 'down' && <ArrowTrendingDownIcon className="w-3.5 h-3.5 shrink-0" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </MetricHoverDetail>
  );
};
