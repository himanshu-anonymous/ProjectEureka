'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TV_CHANNELS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const TVChannelDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          const channel = TV_CHANNELS_DATA.find((c) => c.channel.startsWith(item.name)) || TV_CHANNELS_DATA[0];
          return `<div style="font-size:11px; padding:2px;">
            <div style="font-weight:bold; color:#1B2A4A; margin-bottom:2px;">${channel.channel}</div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>Airtime:</span>
              <strong style="font-family:monospace;">${item.value} min</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>Avg Sentiment:</span>
              <strong style="font-family:monospace; color:#15803D;">${channel.sentimentScore}%</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>Prime-time Share:</span>
              <strong style="font-family:monospace; color:#D97706;">${channel.primeTimeShare}</strong>
            </div>
          </div>`;
        },
      },
      grid: { top: 25, right: 10, bottom: 20, left: 35 },
      xAxis: {
        type: 'category',
        data: TV_CHANNELS_DATA.map((t) => t.channel.split(' ')[0]),
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1B2A4A', fontSize: 10, fontWeight: 500 },
      },
      yAxis: {
        type: 'value',
        max: 200,
        splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series: [
        {
          name: 'Airtime (Min)',
          type: 'bar',
          data: TV_CHANNELS_DATA.map((t) => t.airtimeMinutes),
          barWidth: '38%',
          itemStyle: {
            color: '#1B2A4A', // Government Navy
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#1B2A4A',
            fontSize: 10,
            fontWeight: 700,
            formatter: '{c}m',
          },
        },
      ],
    };
  }, []);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col p-4 space-y-3 shadow-2xs">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name="tv" size="md" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">TV Broadcast Monitoring</h4>
            <p className="text-[10px] text-slate-500">Regional Electronic Media Surveillance</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
          4 State Channels
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="schedule" size="xs" className="text-slate-400" />
            <span>Airtime Total</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">602m</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="podcasts" size="xs" className="text-slate-400" />
            <span>Prime Share</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">34%</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded">
          <div className="text-[10px] text-emerald-800 font-medium">Avg Sentiment</div>
          <div className="text-sm font-bold font-mono text-emerald-800 mt-0.5">70%</div>
        </div>
      </div>

      {/* Broadcast Airtime Bar Chart */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
          <span className="font-medium">Airtime Distribution (Minutes Monitored)</span>
          <span className="text-[10px] font-mono text-slate-400">Last 24 Hours</span>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Live Topic Ticker */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
          <span className="uppercase font-mono flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Live Electronic Monitor • ABP Majha
          </span>
          <span className="font-mono text-emerald-700 font-bold">74% Pos Tone</span>
        </div>
        <p className="text-slate-800 font-medium truncate">
          {TV_CHANNELS_DATA[0].currentTopic}
        </p>
      </div>
    </div>
  );
};
