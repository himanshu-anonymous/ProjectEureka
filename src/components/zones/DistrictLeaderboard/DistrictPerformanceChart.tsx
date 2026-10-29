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
    // Abbreviate long names so labels never collide or embed into each other
    const categories = top5.map((d) => {
      const raw = language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name;
      if (raw === 'Mumbai Suburban') return 'M. Suburban';
      if (raw === 'मुंबई उपनगर') return 'मुं. उपनगर';
      return raw;
    });

    return {
      grid: { top: 36, right: 14, bottom: 32, left: 10, containLabel: true },
      legend: {
        top: 0,
        right: 4,
        itemGap: 14,
        textStyle: { fontSize: 11, color: '#334155', fontWeight: 600 },
        itemWidth: 12,
        itemHeight: 10,
        data: [
          language === 'mr' ? 'प्रसिद्धीपत्रके (संख्या)' : 'Releases Output',
          language === 'mr' ? 'नागरिक निवारण दर (%)' : 'Resolution Rate (%)',
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ seriesName: string; value: number; name: string; color: string }>) => {
          const districtName = params[0]?.name || '';
          const currentDistrict = top5.find((d) => {
            const raw = language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name;
            return raw === districtName || raw.includes(districtName) || districtName.includes(raw);
          });
          const releases = currentDistrict ? currentDistrict.releases : params[0]?.value;
          const sla = currentDistrict ? currentDistrict.crisisSLA : params[1]?.value;

          return `<div style="font-size:12px; padding:6px 8px; min-width:200px; line-height:1.4;">
            <div style="font-weight:bold; color:#0F172A; border-bottom:1px solid #CBD5E1; padding-bottom:4px; margin-bottom:5px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px;">${districtName}</span>
              <span style="color:#20A765; font-family:monospace; font-weight:bold;">#${currentDistrict?.rank || 1} • ${currentDistrict?.cpi || 90} CPI</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:3px;">
              <span style="color:#64748B;">${language === 'mr' ? 'प्रसिद्धीपत्रके:' : 'Releases Issued:'}</span>
              <strong style="color:#20A765; font-family:monospace;">${releases} ${language === 'mr' ? 'पत्रके' : 'dispatches'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#64748B;">${language === 'mr' ? 'निवारण कार्यक्षमता:' : 'SLA Resolution:'}</span>
              <strong style="color:#0284C7; font-family:monospace;">${sla}% (<4h)</strong>
            </div>
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: {
          color: '#1E293B',
          fontSize: 11,
          fontWeight: 700,
          interval: 0,
          rotate: 15, // Prevents any collision between long district names
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: language === 'mr' ? 'संख्या' : 'Releases',
          nameTextStyle: { color: '#64748B', fontSize: 10 },
          max: 400,
          splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
          axisLabel: { color: '#64748B', fontSize: 11, fontWeight: 500 },
        },
        {
          type: 'value',
          name: '%',
          nameTextStyle: { color: '#64748B', fontSize: 10 },
          max: 100,
          min: 80,
          show: false,
        },
      ],
      series: [
        {
          name: language === 'mr' ? 'प्रसिद्धीपत्रके (संख्या)' : 'Releases Output',
          type: 'bar',
          barWidth: '32%',
          data: top5.map((d) => d.releases),
          itemStyle: {
            color: '#20A765', // Lovable Emerald
            borderRadius: [4, 4, 0, 0],
          },
          markLine: {
            symbol: 'none',
            data: [
              {
                yAxis: 300,
                name: 'Target (300)',
                lineStyle: { color: '#F2994A', type: 'dashed', width: 1.5 },
                label: {
                  formatter: language === 'mr' ? 'उद्दिष्ट ३००' : 'Tgt 300',
                  position: 'insideEndTop',
                  color: '#D97706',
                  fontSize: 10,
                  fontWeight: 700,
                },
              },
            ],
          },
        },
        {
          name: language === 'mr' ? 'नागरिक निवारण दर (%)' : 'Resolution Rate (%)',
          type: 'bar',
          barWidth: '32%',
          data: top5.map((d) => Math.round((d.crisisSLA || 98.4) * 3.5)), // Scaled for clean visual height alignment
          itemStyle: {
            color: '#0284C7', // Lovable Ocean Blue
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };
  }, [districts, language]);

  return (
    <div className="w-full">
      <div className="h-56 w-full bg-slate-50/70 rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
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
