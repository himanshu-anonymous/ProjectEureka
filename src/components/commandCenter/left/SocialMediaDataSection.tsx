'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Share2, TrendingUp, Users, Eye } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const SocialMediaDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const mentions = [3200, 5400, 9800, 14200, 11500, 8900, 6200];

    return {
      grid: { top: 15, right: 10, bottom: 20, left: 35 },
      xAxis: {
        type: 'category',
        data: hours,
        axisLine: { lineStyle: { color: '#DADCE0' } },
        axisLabel: { color: '#5F6368', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#E8EAED', type: 'dashed' } },
        axisLabel: { color: '#80868B', fontSize: 9 },
      },
      series: [
        {
          name: 'Mentions Velocity',
          type: 'line',
          smooth: true,
          data: mentions,
          itemStyle: { color: '#202124' },
          lineStyle: { width: 2, color: '#202124' },
          areaStyle: {
            color: 'rgba(32, 33, 36, 0.08)',
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
          <Share2 className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">3. Social Media Data Analysis</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-secondary rounded">
          X • FB • YT • WA
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>24h Mentions</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">83.6K</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Total Reach</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">3.3M</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Eng. Rate</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">5.0%</div>
        </div>
      </div>

      {/* Viral Velocity Graph */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-content-secondary mb-1">
          <span className="font-medium">Hourly Viral Velocity (Mentions / Hour)</span>
          <span className="text-[10px] font-mono text-content-primary font-bold">+12% surge</span>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Platform Breakdown Mini-Pills */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center font-mono">
        <div className="p-1.5 bg-surface-secondary rounded border border-borderLine-subtle">
          <span className="text-content-muted block">X</span>
          <span className="font-bold text-content-primary">48.2K</span>
        </div>
        <div className="p-1.5 bg-surface-secondary rounded border border-borderLine-subtle">
          <span className="text-content-muted block">FB</span>
          <span className="font-bold text-content-primary">35.4K</span>
        </div>
        <div className="p-1.5 bg-surface-secondary rounded border border-borderLine-subtle">
          <span className="text-content-muted block">YT</span>
          <span className="font-bold text-content-primary">28.1K</span>
        </div>
        <div className="p-1.5 bg-surface-secondary rounded border border-borderLine-subtle">
          <span className="text-content-muted block">WA</span>
          <span className="font-bold text-content-primary">12.5K</span>
        </div>
      </div>
    </div>
  );
};
