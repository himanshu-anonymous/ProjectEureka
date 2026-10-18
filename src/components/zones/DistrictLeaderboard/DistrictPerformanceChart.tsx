'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DistrictData } from '@/types/dashboard';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';

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
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    const top5 = districts.slice(0, 5);
    const categories = top5.map((d) => (language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name));

    return {
      grid: { top: 32, right: 15, bottom: 25, left: 35 },
      legend: {
        top: 2,
        right: 10,
        textStyle: { fontSize: 10, color: '#475569' },
        itemWidth: 10,
        itemHeight: 10,
        data: [
          language === 'mr' ? 'प्रसिद्धी प्रमाण (२५)' : 'Volume (25)',
          language === 'mr' ? 'वितरण गती / TAT (२५)' : 'Speed / TAT (25)',
          language === 'mr' ? 'माध्यम सूर (२५)' : 'Sentiment (25)',
          language === 'mr' ? 'आपत्ती SLA (२५)' : 'Crisis SLA (25)',
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ seriesName: string; value: number; name: string }>) => {
          const districtName = params[0]?.name || '';
          const currentDistrict = top5.find((d) => (language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name) === districtName);
          const totalCpi = currentDistrict ? currentDistrict.cpi : params.reduce((acc, p) => acc + (p.value || 0), 0).toFixed(1);

          let html = `<div style="font-size:11px; padding:4px 6px; min-width:180px;">
            <div style="font-weight:bold; color:#1B2A4A; border-bottom:1px solid #E2E8F0; padding-bottom:3px; margin-bottom:4px; display:flex; justify-content:space-between;">
              <span>${districtName}</span>
              <span style="color:#D97706;">${totalCpi} / 100 CPI</span>
            </div>`;
          params.forEach((p) => {
            html += `<div style="display:flex; justify-content:space-between; gap:12px; margin-top:2px;">
              <span style="color:#64748B;">${p.seriesName}:</span>
              <strong style="font-family:monospace; color:#0F172A;">${p.value}</strong>
            </div>`;
          });
          html += '</div>';
          return html;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
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
          name: language === 'mr' ? 'प्रसिद्धी प्रमाण (२५)' : 'Volume (25)',
          type: 'bar',
          stack: 'cpi',
          barWidth: '36%',
          data: top5.map((d) => d.volumeScore),
          itemStyle: { color: '#1E3A8A' },
        },
        {
          name: language === 'mr' ? 'वितरण गती / TAT (२५)' : 'Speed / TAT (25)',
          type: 'bar',
          stack: 'cpi',
          data: top5.map((d) => d.tatScore),
          itemStyle: { color: '#0D9488' },
        },
        {
          name: language === 'mr' ? 'माध्यम सूर (२५)' : 'Sentiment (25)',
          type: 'bar',
          stack: 'cpi',
          data: top5.map((d) => d.sentimentScore),
          itemStyle: { color: '#D97706' },
        },
        {
          name: language === 'mr' ? 'आपत्ती SLA (२५)' : 'Crisis SLA (25)',
          type: 'bar',
          stack: 'cpi',
          borderRadius: [4, 4, 0, 0],
          data: top5.map((d) => d.crisisScore),
          itemStyle: { color: '#6366F1' },
        },
      ],
    };
  }, [districts, language]);

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>
          {language === 'mr'
            ? 'शीर्ष ५ जिल्हे — ४-घटक संमिश्र कामगिरी निर्देशांक (२५/२५/२५/२५)'
            : 'Top 5 Districts by 4-Pillar Composite Index (25/25/25/25)'}
        </span>
      </div>
      <div className="h-48 w-full bg-slate-50/50 rounded-lg p-1 border border-slate-100">
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
