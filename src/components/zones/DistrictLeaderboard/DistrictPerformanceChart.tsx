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
      grid: { top: 20, right: 10, bottom: 25, left: 35 },
      xAxis: {
        type: 'category',
        data: top5.map((d) => d.name),
        axisLine: { lineStyle: { color: '#DADCE0' } },
        axisLabel: { color: '#5F6368', fontSize: 11 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#E8EAED', type: 'dashed' } },
        axisLabel: { color: '#80868B', fontSize: 10 },
      },
      series: [
        {
          data: top5.map((d) => ({
            value: d.cpi,
            itemStyle: {
              color: d.id === selectedDistrictId ? '#202124' : '#5F6368',
              borderRadius: [2, 2, 0, 0],
            },
          })),
          type: 'bar',
          barWidth: '40%',
          label: {
            show: true,
            position: 'top',
            color: '#202124',
            fontSize: 11,
            fontWeight: 500,
          },
        },
      ],
    };
  }, [districts, selectedDistrictId]);

  return (
    <div>
      <div className="text-xs font-medium text-content-secondary mb-1">Top 5 Districts by CPI</div>
      <div className="h-44 w-full">
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
