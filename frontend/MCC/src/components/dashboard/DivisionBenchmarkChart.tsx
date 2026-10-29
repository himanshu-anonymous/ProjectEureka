'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const DivisionBenchmarkChart: React.FC = () => {
  const { districts, language } = useDashboardStore();

  const divisionData = useMemo(() => {
    const divisionMap: Record<string, { totalCpi: number; count: number }> = {};

    districts.forEach((d) => {
      const div = d.division || 'Other';
      if (!divisionMap[div]) {
        divisionMap[div] = { totalCpi: 0, count: 0 };
      }
      divisionMap[div].totalCpi += d.cpi;
      divisionMap[div].count += 1;
    });

    const entries = Object.entries(divisionMap).map(([name, val]) => ({
      name,
      avgCpi: Number((val.totalCpi / val.count).toFixed(1)),
    }));

    return entries.sort((a, b) => b.avgCpi - a.avgCpi);
  }, [districts]);

  const divisionOption = useMemo(() => {
    const categories = divisionData.map((d) => d.name);
    const scores = divisionData.map((d) => d.avgCpi);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          return `<div style="padding:2px 4px;">
            <div style="font-weight:bold; margin-bottom:2px;">${item.name} Division</div>
            <div style="color:#20A765;">Avg CPI Score: <strong>${item.value} / 100</strong></div>
          </div>`;
        },
      },
      grid: { top: 10, right: 32, bottom: 20, left: 85 },
      xAxis: {
        type: 'value',
        min: 70,
        max: 100,
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#334155', fontSize: 10, fontWeight: 600 },
      },
      series: [
        {
          type: 'bar',
          data: scores,
          barWidth: '44%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: { dataIndex: number }) => {
              const palette = ['#20A765', '#0284C7', '#F2C94C', '#F2994A', '#9BCB3C', '#64748B'];
              return palette[params.dataIndex % palette.length];
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            fontSize: 10,
            color: '#1E293B',
            fontWeight: 700,
          },
        },
      ],
    };
  }, [divisionData]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            {language === 'mr' ? 'विभागीय सीपीआय कामगिरी' : 'Division CPI Benchmark'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
          6 Divisions
        </span>
      </div>
      <div className="h-48 w-full pt-2">
        <ReactECharts option={divisionOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default DivisionBenchmarkChart;

