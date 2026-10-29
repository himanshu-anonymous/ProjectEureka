'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface DepartmentMetric {
  nameEn: string;
  nameMr: string;
  slaRate: number;
  avgTatMin: number;
}

const DEPARTMENT_METRICS: DepartmentMetric[] = [
  { nameEn: 'Public Health', nameMr: 'सार्वजनिक आरोग्य', slaRate: 98.4, avgTatMin: 24 },
  { nameEn: 'Home / Police', nameMr: 'गृह व पोलीस', slaRate: 97.8, avgTatMin: 28 },
  { nameEn: 'Urban Dev', nameMr: 'नगर विकास', slaRate: 96.5, avgTatMin: 32 },
  { nameEn: 'Revenue', nameMr: 'महसूल विभाग', slaRate: 95.2, avgTatMin: 38 },
  { nameEn: 'Agriculture', nameMr: 'कृषी विभाग', slaRate: 94.6, avgTatMin: 42 },
  { nameEn: 'Public Works', nameMr: 'सार्वजनिक बांधकाम', slaRate: 93.8, avgTatMin: 46 },
];

export const DepartmentResolutionChart: React.FC = () => {
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    const categories = DEPARTMENT_METRICS.map((d) => (language === 'mr' ? d.nameMr : d.nameEn)).reverse();
    const values = DEPARTMENT_METRICS.map((d) => d.slaRate).reverse();
    const tats = DEPARTMENT_METRICS.map((d) => d.avgTatMin).reverse();

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: (params: Array<{ name: string; value: number; dataIndex: number }>) => {
          const item = params[0];
          const tat = tats[item.dataIndex];
          return `<div style="padding:2px 4px;">
            <div style="font-weight:bold; margin-bottom:2px;">${item.name}</div>
            <div style="color:#20A765;">SLA Compliance: <strong>${item.value}%</strong></div>
            <div style="color:#94A3B8; font-size:10px;">Avg Response TAT: <strong>${tat} mins</strong></div>
          </div>`;
        },
      },
      grid: {
        left: '2%',
        right: '12%',
        top: '6%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        min: 85,
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
        axisLabel: {
          color: '#64748B',
          fontSize: 9,
          formatter: '{value}%',
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#1E293B',
          fontSize: 10,
          fontWeight: 600,
        },
      },
      series: [
        {
          name: 'SLA Rate',
          type: 'bar',
          data: values,
          barWidth: 10,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: { dataIndex: number }) => {
              const palette = ['#0284C7', '#20A765', '#8B5CF6', '#F59E0B', '#10B981', '#6366F1'];
              return palette[params.dataIndex % palette.length];
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            fontSize: 10,
            color: '#1E293B',
            fontWeight: 700,
          },
        },
      ],
    };
  }, [language]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col justify-between shrink-0">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            {language === 'mr' ? 'विभागीय निवारण व एसएलए कामगिरी' : 'Departmental SLA & Resolution'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-bold">
          Avg 96.1% SLA
        </span>
      </div>
      <div className="h-48 w-full pt-2">
        <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default DepartmentResolutionChart;

