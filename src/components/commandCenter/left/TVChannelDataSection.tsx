'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TV_CHANNELS_DATA } from '@/data/dashboardData';
import { Tv, Radio, Clock } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const TVChannelDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    return {
      grid: { top: 20, right: 10, bottom: 20, left: 35 },
      xAxis: {
        type: 'category',
        data: TV_CHANNELS_DATA.map((t) => t.channel.split(' ')[0]),
        axisLine: { lineStyle: { color: '#DADCE0' } },
        axisLabel: { color: '#202124', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        max: 200,
        splitLine: { lineStyle: { color: '#E8EAED', type: 'dashed' } },
        axisLabel: { color: '#80868B', fontSize: 10 },
      },
      series: [
        {
          name: 'Airtime (Min)',
          type: 'bar',
          data: TV_CHANNELS_DATA.map((t) => t.airtimeMinutes),
          barWidth: '35%',
          itemStyle: {
            color: '#303134',
            borderRadius: [2, 2, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#202124',
            fontSize: 10,
            formatter: '{c}m',
          },
        },
      ],
    };
  }, []);

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col p-4 space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2.5">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">2. TV Channel Broadcast Data</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-secondary rounded">
          4 State Channels
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Airtime Total</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">602m</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <Radio className="w-3 h-3" />
            <span>Prime Share</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">34%</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted">Avg Sentiment</div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">70%</div>
        </div>
      </div>

      {/* Broadcast Airtime Bar Chart */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-content-secondary mb-1">
          <span className="font-medium">Airtime Distribution (Minutes Monitored)</span>
          <span className="text-[10px] font-mono text-content-muted">Last 24 Hours</span>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Live Topic Ticker */}
      <div className="p-2 bg-surface-secondary border border-borderLine-subtle rounded text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-content-muted mb-0.5">
          <span className="uppercase font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-content-primary animate-ping"></span>
            Live Monitoring • ABP Majha
          </span>
          <span className="font-mono text-content-primary font-bold">74% Pos</span>
        </div>
        <p className="text-content-primary font-medium truncate">
          {TV_CHANNELS_DATA[0].currentTopic}
        </p>
      </div>
    </div>
  );
};
