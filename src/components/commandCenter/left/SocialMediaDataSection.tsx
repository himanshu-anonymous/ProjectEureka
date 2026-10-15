'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const SocialMediaDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const mentions = [3200, 5400, 9800, 14200, 11500, 8900, 6200];

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `<div style="font-size:11px; padding:2px;">
            <div style="color:#64748B; font-size:10px;">Timeline: ${item.name} IST</div>
            <div style="font-weight:bold; color:#1E40AF; font-size:12px; margin-top:2px;">
              ${item.value.toLocaleString()} mentions/hr
            </div>
            ${item.value === 14200 ? '<div style="color:#D97706; font-size:10px; font-weight:bold; margin-top:2px; display:flex; items-center;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#D97706;margin-right:4px;margin-top:3px;"></span>Peak Surge Alert (Cabinet Briefing)</div>' : ''}
          </div>`;
        },
      },
      grid: { top: 15, right: 15, bottom: 20, left: 40 },
      xAxis: {
        type: 'category',
        data: hours,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 9 },
      },
      series: [
        {
          name: 'Mentions Velocity',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: mentions.map((val) => ({
            value: val,
            symbol: val === 14200 ? 'pin' : 'circle',
            symbolSize: val === 14200 ? 12 : 5,
            itemStyle: {
              color: val === 14200 ? '#D97706' : '#1E40AF',
            },
          })),
          itemStyle: { color: '#1E40AF' },
          lineStyle: { width: 2.5, color: '#1E40AF' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(30, 64, 175, 0.25)' },
                { offset: 1, color: 'rgba(30, 64, 175, 0.02)' },
              ],
            },
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
          <MaterialIcon name="share" size="md" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">Social Media Ingestion & Velocity</h4>
            <p className="text-[10px] text-slate-500">Real-Time Viral Sentiment & Velocity</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
          X • FB • YT • WA
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="trending_up" size="xs" className="text-slate-400" />
            <span>24h Mentions</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">83.6K</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="visibility" size="xs" className="text-slate-400" />
            <span>Total Reach</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">3.3M</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="group" size="xs" className="text-slate-400" />
            <span>Eng. Rate</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">5.0%</div>
        </div>
      </div>

      {/* Viral Velocity Graph */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
          <span className="font-medium">Hourly Viral Velocity (Mentions / Hour)</span>
          <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            +12% surge peak
          </span>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Platform Breakdown Mini-Pills */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center font-mono">
        <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-slate-500 block font-sans">X (Twitter)</span>
          <span className="font-bold text-slate-900">48.2K</span>
        </div>
        <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-slate-500 block font-sans">Facebook</span>
          <span className="font-bold text-slate-900">35.4K</span>
        </div>
        <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-slate-500 block font-sans">YouTube</span>
          <span className="font-bold text-slate-900">28.1K</span>
        </div>
        <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
          <span className="text-slate-500 block font-sans">WhatsApp</span>
          <span className="font-bold text-slate-900">12.5K</span>
        </div>
      </div>
    </div>
  );
};
