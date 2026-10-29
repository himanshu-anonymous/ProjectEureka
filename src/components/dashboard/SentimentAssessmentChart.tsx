'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictSentiment } from '@/lib/sentimentEngine';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const SentimentAssessmentChart: React.FC = () => {
  const { selectedDistrictId, selectedPeriod, language } = useDashboardStore();

  const sentimentStats = useMemo(() => {
    const raw = getDistrictSentiment(selectedDistrictId, selectedPeriod, INITIAL_QUEUE_ITEMS);
    const positive = Math.round(raw.composite);
    const critical = Math.max(5, Math.round(100 - raw.composite - (raw.composite > 75 ? 18 : 26)));
    const neutral = Math.max(0, 100 - positive - critical);

    return {
      positive,
      neutral,
      critical,
    };
  }, [selectedDistrictId, selectedPeriod]);

  const sentimentOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: '{b}: <strong>{d}%</strong> ({c}%)',
      },
      legend: {
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 10, color: '#64748B' },
      },
      series: [
        {
          name: 'Sentiment Health',
          type: 'pie',
          radius: ['52%', '76%'],
          center: ['50%', '44%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          data: [
            {
              value: sentimentStats.positive,
              name: language === 'mr' ? 'सकारात्मक सूर' : 'Positive',
              itemStyle: { color: '#20A765' }, // Lovable Emerald
            },
            {
              value: sentimentStats.neutral,
              name: language === 'mr' ? 'तटस्थ / सामान्य' : 'Neutral',
              itemStyle: { color: '#64748B' }, // Slate
            },
            {
              value: sentimentStats.critical,
              name: language === 'mr' ? 'गंभीर / लक्षवेधी' : 'Critical',
              itemStyle: { color: '#E94B4B' }, // Lovable Alert Red
            },
          ],
        },
      ],
    };
  }, [sentimentStats, language]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#20A765]" />
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            {language === 'mr' ? 'लोकभावना व माध्यम सूर कल' : 'Sentiment Health Assessment'}
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
          {sentimentStats.positive}% Pos
        </span>
      </div>
      <div className="h-48 w-full pt-2">
        <ReactECharts option={sentimentOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default SentimentAssessmentChart;

