'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface IntakeChannelMetric {
  channelEn: string;
  channelMr: string;
  volume: number;
  resolvedPct: number;
  avgTatHours: number;
  color: string;
}

const INTAKE_CHANNELS: IntakeChannelMetric[] = [
  {
    channelEn: 'Aaple Sarkar Portal',
    channelMr: 'आपले सरकार पोर्टल',
    volume: 14250,
    resolvedPct: 97.4,
    avgTatHours: 18,
    color: '#0284C7',
  },
  {
    channelEn: 'CM Helpline 1800',
    channelMr: 'मुख्यमंत्री हेल्पलाईन १८००',
    volume: 8920,
    resolvedPct: 98.6,
    avgTatHours: 6,
    color: '#20A765',
  },
  {
    channelEn: 'WhatsApp Citizen Bot',
    channelMr: 'व्हॉट्सॲप बॉट',
    volume: 19840,
    resolvedPct: 96.2,
    avgTatHours: 2,
    color: '#22C55E',
  },
  {
    channelEn: 'Social Media Desk',
    channelMr: 'सोशल मीडिया डेस्क',
    volume: 6410,
    resolvedPct: 95.8,
    avgTatHours: 4,
    color: '#F59E0B',
  },
  {
    channelEn: 'CM Relief & Jan Samvaad',
    channelMr: 'जनसंवाद व सहाय्यता',
    volume: 4320,
    resolvedPct: 99.2,
    avgTatHours: 12,
    color: '#8B5CF6',
  },
];

export const CitizenGrievanceVelocityChart: React.FC = () => {
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    const categories = INTAKE_CHANNELS.map((d) => (language === 'mr' ? d.channelMr : d.channelEn)).reverse();
    const resolvedData = INTAKE_CHANNELS.map((d) => d.resolvedPct).reverse();
    const tatData = INTAKE_CHANNELS.map((d) => d.avgTatHours).reverse();
    const colors = INTAKE_CHANNELS.map((d) => d.color).reverse();

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: (params: Array<{ name: string; value: number; dataIndex: number }>) => {
          const item = params[0];
          const tat = tatData[item.dataIndex];
          return `<div style="padding:2px 4px;">
            <div style="font-weight:bold; margin-bottom:2px;">${item.name}</div>
            <div style="color:#20A765;">Resolution Rate: <strong>${item.value}%</strong></div>
            <div style="color:#94A3B8; font-size:10px;">Avg Response TAT: <strong>${tat} hrs</strong></div>
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
        min: 90,
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
          name: 'Resolution Rate',
          type: 'bar',
          data: resolvedData,
          barWidth: 10,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: { dataIndex: number }) => colors[params.dataIndex],
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
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-3 flex flex-col shrink-0">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {language === 'mr' ? 'नागरी तक्रार निवारण व चॅनेल वेग' : 'Citizen Grievance & Intake Velocity'}
          </h4>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          97.4% Avg
        </span>
      </div>

      <div className="h-44 w-full pt-1">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>{language === 'mr' ? 'विहित वेळेत निवारण उद्दिष्ट: ९५%' : 'Target Mandate: ≥95% within SLA'}</span>
        <span className="text-slate-700 font-bold font-mono">53,740 / 55,180 Closed</span>
      </div>
    </div>
  );
};

export default CitizenGrievanceVelocityChart;

