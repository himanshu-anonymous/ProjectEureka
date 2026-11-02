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
  className?: string;
}

export const DistrictPerformanceChart: React.FC<DistrictPerformanceChartProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  className,
}) => {
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    const top5 = districts.slice(0, 5);
    // Abbreviate long names so labels never collide or embed into each other
    const categories = top5.map((d) => {
      const raw = language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name;
      if (raw === 'Mumbai Suburban' || raw === 'Mumbai Sub') return 'Suburban';
      if (raw === 'Mumbai City') return 'Mumbai';
      if (raw === 'मुंबई उपनगर') return 'उपनगर';
      if (raw === 'मुंबई शहर') return 'मुंबई';
      return raw;
    });

    return {
      grid: { top: 28, right: 12, bottom: 24, left: 12, containLabel: true },
      legend: {
        top: 0,
        right: 4,
        itemGap: 14,
        textStyle: { fontSize: 10, color: '#334155', fontWeight: 600 },
        itemWidth: 12,
        itemHeight: 7,
        borderRadius: 2,
        data: [
          language === 'mr' ? 'प्रसिद्धीपत्रके (संख्या)' : 'Releases Output',
          language === 'mr' ? 'नागरिक निवारण दर (%)' : 'Resolution Rate (%)',
        ],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(241, 245, 249, 0.6)' },
        },
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 0,
        extraCssText: 'box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: Array<{ seriesName: string; value: number; name: string; color: string }>) => {
          const districtName = params[0]?.name || '';
          const currentDistrict = top5.find((d) => {
            const raw = language === 'mr' ? (d.nameMr || getDistrictName(d.name, 'mr')) : d.name;
            return raw === districtName || raw.includes(districtName) || districtName.includes(raw);
          });
          const releases = currentDistrict ? currentDistrict.releases : params[0]?.value;
          const sla = currentDistrict ? currentDistrict.crisisSLA : params[1]?.value;

          return `<div style="font-size:12px; padding:8px 10px; min-width:210px; line-height:1.45;">
            <div style="font-weight:bold; color:#0F172A; border-bottom:1px solid #F1F5F9; padding-bottom:5px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px;">${districtName}</span>
              <span style="color:#059669; font-family:monospace; font-weight:bold; background:#ECFDF5; padding:1px 6px; border-radius:4px; font-size:11px;">#${currentDistrict?.rank || 1} • ${currentDistrict?.cpi || 90} CPI</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:4px; align-items:center;">
              <span style="color:#64748B; display:flex; align-items:center; gap:6px;">
                <span style="width:8px; height:8px; border-radius:2px; background:#10B981; display:inline-block;"></span>
                ${language === 'mr' ? 'प्रसिद्धीपत्रके:' : 'Releases Issued:'}
              </span>
              <strong style="color:#059669; font-family:monospace;">${releases} ${language === 'mr' ? 'पत्रके' : 'dispatches'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
              <span style="color:#64748B; display:flex; align-items:center; gap:6px;">
                <span style="width:8px; height:8px; border-radius:2px; background:#0284C7; display:inline-block;"></span>
                ${language === 'mr' ? 'निवारण कार्यक्षमता:' : 'SLA Resolution:'}
              </span>
              <strong style="color:#0284C7; font-family:monospace;">${sla}% (<4h)</strong>
            </div>
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: {
          color: '#334155',
          fontSize: 10.5,
          fontWeight: 700,
          interval: 0,
          rotate: 0,
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 500,
          interval: 100,
          splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } },
          axisLabel: { color: '#64748B', fontSize: 10, fontWeight: 600 },
        },
        {
          type: 'value',
          min: 80,
          max: 105,
          show: false,
        },
      ],
      series: [
        {
          name: language === 'mr' ? 'प्रसिद्धीपत्रके (संख्या)' : 'Releases Output',
          type: 'bar',
          barWidth: 14,
          barGap: '35%',
          barCategoryGap: '45%',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(241, 245, 249, 0.55)',
            borderRadius: [5, 5, 1, 1],
          },
          data: top5.map((d) => d.releases),
          itemStyle: {
            borderRadius: [5, 5, 1, 1],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#10B981' }, // Emerald-500
                { offset: 0.7, color: '#059669' }, // Emerald-600
                { offset: 1, color: '#047857' }, // Emerald-700
              ],
            },
            shadowColor: 'rgba(16, 185, 129, 0.2)',
            shadowBlur: 3,
            shadowOffsetY: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(16, 185, 129, 0.4)',
            },
          },
          markLine: {
            symbol: 'none',
            data: [
              {
                yAxis: 300,
                name: 'Target (300)',
                lineStyle: { color: '#F59E0B', type: 'dashed', width: 1.5 },
                label: {
                  formatter: language === 'mr' ? 'उद्दिष्ट ३००' : 'Tgt: 300',
                  position: 'insideStartTop',
                  color: '#D97706',
                  fontSize: 9.5,
                  fontWeight: 700,
                },
              },
            ],
          },
        },
        {
          name: language === 'mr' ? 'नागरिक निवारण दर (%)' : 'Resolution Rate (%)',
          type: 'bar',
          yAxisIndex: 1,
          barWidth: 14,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(241, 245, 249, 0.55)',
            borderRadius: [5, 5, 1, 1],
          },
          data: top5.map((d) => d.crisisSLA || 98),
          itemStyle: {
            borderRadius: [5, 5, 1, 1],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#38BDF8' }, // Sky-400
                { offset: 0.7, color: '#0284C7' }, // Sky-600
                { offset: 1, color: '#0369A1' }, // Sky-700
              ],
            },
            shadowColor: 'rgba(2, 132, 199, 0.2)',
            shadowBlur: 3,
            shadowOffsetY: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(2, 132, 199, 0.4)',
            },
          },
        },
      ],
    };
  }, [districts, language]);

  return (
    <div className={`w-full flex-1 min-h-0 h-full flex flex-col ${className || ''}`}>
      <div className="flex-1 min-h-[220px] h-full w-full bg-linear-to-b from-slate-50/70 to-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%', minHeight: '210px' }}
          opts={{ renderer: 'canvas' }}
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
