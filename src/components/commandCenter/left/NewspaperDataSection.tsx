'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { NEWSPAPER_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const NewspaperDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ seriesName: string; value: number; marker: string; name: string }>) => {
          const title = params[0]?.name || '';
          let html = `<div style="font-size:11px; font-weight:bold; margin-bottom:4px; color:#1B2A4A;">${title}</div>`;
          params.forEach((p) => {
            html += `<div style="font-size:11px; display:flex; justify-content:space-between; gap:12px;">
              <span>${p.marker} ${p.seriesName}</span>
              <strong style="font-family:monospace;">${p.value}%</strong>
            </div>`;
          });
          return html;
        },
      },
      grid: { top: 10, right: 10, bottom: 20, left: 80 },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: NEWSPAPER_DATA.map((n) => n.name).reverse(),
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1B2A4A', fontSize: 10, fontWeight: 500 },
      },
      series: [
        {
          name: 'Positive',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.positive).reverse(),
          itemStyle: { color: '#15803D' }, // Semantic Emerald
          barWidth: '45%',
        },
        {
          name: 'Neutral',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.neutral).reverse(),
          itemStyle: { color: '#94A3B8' }, // Semantic Slate
        },
        {
          name: 'Negative',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.negative).reverse(),
          itemStyle: { color: '#DC2626' }, // Semantic Red
        },
      ],
    };
  }, []);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col p-4 space-y-3 shadow-2xs">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name="newspaper" size="md" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">Newspaper Data & Print Clippings</h4>
            <p className="text-[10px] text-slate-500">Regional & Statewide Dailies</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
          18 Dailies Tracked
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="menu_book" size="xs" className="text-slate-400" />
            <span>Clippings</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">516</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded">
          <div className="text-[10px] text-emerald-800 flex items-center gap-1 font-medium">
            <MaterialIcon name="check_circle" size="xs" className="text-emerald-600" />
            <span>Tone Pos.</span>
          </div>
          <div className="text-sm font-bold font-mono text-emerald-800 mt-0.5">62%</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 font-medium">Circulation</div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">6.8M</div>
        </div>
      </div>

      {/* Infographic Graph */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
          <span className="font-medium">Sentiment Breakdown by Publication (%)</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-600 rounded-xs"></span>
              <span>Pos</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-xs"></span>
              <span>Neu</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-600 rounded-xs"></span>
              <span>Neg</span>
            </span>
          </div>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Featured Headline */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
        <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">
          Lead Headline • Lokmat
        </span>
        <p className="text-slate-800 font-medium truncate mt-0.5">
          {NEWSPAPER_DATA[0].topStory}
        </p>
      </div>
    </div>
  );
};
