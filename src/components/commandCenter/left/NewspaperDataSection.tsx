'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { NEWSPAPER_DATA } from '@/data/dashboardData';
import { Newspaper, BookOpen, CheckCircle } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const NewspaperDataSection: React.FC = () => {
  const chartOption = useMemo(() => {
    return {
      grid: { top: 10, right: 10, bottom: 20, left: 70 },
      xAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#E8EAED', type: 'dashed' } },
        axisLabel: { color: '#80868B', fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: NEWSPAPER_DATA.map((n) => n.name).reverse(),
        axisLine: { lineStyle: { color: '#DADCE0' } },
        axisLabel: { color: '#202124', fontSize: 10 },
      },
      series: [
        {
          name: 'Positive %',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.positive).reverse(),
          itemStyle: { color: '#202124' },
          barWidth: '50%',
        },
        {
          name: 'Neutral %',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.neutral).reverse(),
          itemStyle: { color: '#80868B' },
        },
        {
          name: 'Negative %',
          type: 'bar',
          stack: 'total',
          data: NEWSPAPER_DATA.map((n) => n.negative).reverse(),
          itemStyle: { color: '#DADCE0' },
        },
      ],
    };
  }, []);

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col p-4 space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-borderLine-subtle pb-2.5">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-content-primary" />
          <h4 className="text-xs font-bold text-content-primary">1. Newspaper Data & Print Clippings</h4>
        </div>
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-surface-secondary text-content-secondary rounded">
          18 Dailies
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Clippings</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">516</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Tone Pos.</span>
          </div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">62%</div>
        </div>
        <div className="bg-surface-secondary border border-borderLine-subtle p-2 rounded">
          <div className="text-[10px] text-content-muted">Circulation</div>
          <div className="text-sm font-bold font-mono text-content-primary mt-0.5">6.8M</div>
        </div>
      </div>

      {/* Infographic Graph */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-content-secondary mb-1">
          <span className="font-medium">Sentiment Breakdown by Publication (%)</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#202124] rounded-sm"></span>Pos</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#80868B] rounded-sm"></span>Neu</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#DADCE0] rounded-sm"></span>Neg</span>
          </div>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Featured Headline */}
      <div className="p-2 bg-surface-secondary border border-borderLine-subtle rounded text-[11px]">
        <span className="text-[10px] text-content-muted block uppercase font-mono">Lead Headline • Lokmat</span>
        <p className="text-content-primary font-medium truncate mt-0.5">
          {NEWSPAPER_DATA[0].topStory}
        </p>
      </div>
    </div>
  );
};
