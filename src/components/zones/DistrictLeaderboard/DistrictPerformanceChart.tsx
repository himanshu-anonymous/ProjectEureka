'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DistrictData } from '@/types/dashboard';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface DistrictPerformanceChartProps {
  districts: DistrictData[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
}) => {
  const chartOption = useMemo(() => {
    const top5 = districts.slice(0, 5);
    return {
      grid: { top: 25, right: 15, bottom: 25, left: 35 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `<div style="font-size:12px; font-weight:600; padding:2px 4px;">
            <span style="color:#1B2A4A;">${item.name}</span>: 
            <span style="color:#D97706; font-weight:bold;">${item.value} / 100</span> CPI
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        data: top5.map((d) => d.name),
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1B2A4A', fontSize: 11, fontWeight: 500 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series: [
        {
          data: top5.map((d) => ({
            value: d.cpi,
            itemStyle: {
              color: d.id === selectedDistrictId ? '#1B2A4A' : '#D97706',
              borderRadius: [4, 4, 0, 0],
            },
          })),
          type: 'bar',
          barWidth: '38%',
          label: {
            show: true,
            position: 'top',
            color: '#1B2A4A',
            fontSize: 11,
            fontWeight: 700,
            formatter: '{c}',
          },
        },
      ],
    };
  }, [districts, selectedDistrictId]);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>शीर्ष ५ जिल्हे - CPI निर्देशांक (Top 5 Districts by Composite Performance Index)</span>
        <div className="flex items-center gap-3 text-[11px] font-normal text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1B2A4A]"></span>
            <span>निवडलेला जिल्हा (Selected)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]"></span>
            <span>इतर शीर्ष जिल्हे (Top Quintile)</span>
          </span>
        </div>
      </div>
      <div className="h-44 w-full bg-slate-50/50 rounded-lg p-1 border border-slate-100">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          onEvents={{
            click: (params: { dataIndex: number }) => {
              const clickedDistrict = districts[params.dataIndex];
              if (clickedDistrict) onSelectDistrict(clickedDistrict.id);
            },
          }}
        />
      </div>
    </div>
  );
};
