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
      animation: false,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: '{b}: <strong>{d}%</strong> ({c}%)',
      },
      legend: {
        bottom: 0,
        itemWidth: 7,
        itemHeight: 7,
        itemGap: 6,
        textStyle: { fontSize: 8.5, color: '#475569', fontWeight: 600 },
      },
      series: [
        {
          name: 'Sentiment Assessment',
          type: 'pie',
          radius: ['40%', '62%'],
          center: ['50%', '48%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: `${sentimentStats.positive}%\n${language === 'mr' ? 'सकारात्मक' : 'POSITIVE'}`,
            fontSize: 11,
            fontWeight: 'bold',
            color: '#0F172A',
            lineHeight: 13,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
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
              itemStyle: { color: '#0284C7' }, // Ocean Blue
            },
            {
              value: sentimentStats.critical,
              name: language === 'mr' ? 'गंभीर / लक्षवेधी' : 'Critical',
              itemStyle: { color: '#E94B4B' }, // Alert Red
            },
          ],
        },
      ],
    };
  }, [sentimentStats, language]);

  return (
    <div className="bg-white p-2 flex flex-col justify-between h-full flex-1 min-h-0 overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md bg-emerald-50 text-[#20A765] flex items-center justify-center">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99L21.99 11C21.47 5.94 17.5 2 13 2zm0 11.01V22c4.5 0 8.47-3.94 8.99-9H13z"/>
            </svg>
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-none">
            {language === 'mr' ? 'लोकभावना व माध्यम सूर कल' : 'Sentiment Assessment'}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold leading-none">
            {sentimentStats.positive}% {language === 'mr' ? 'सकारात्मक' : 'Pos'}
          </span>
          <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100/60 px-1 py-0.2 rounded font-mono">
            ▲ +2.4%
          </span>
        </div>
      </div>

      {/* 2. Visual Body: Clean Donut Graph + Telemetry Breakdown */}
      <div className="flex-1 min-h-[110px] flex flex-col sm:flex-row items-center justify-between gap-1.5 overflow-hidden">
        {/* Expanded Circle Graph (Fills Canvas without overlapping header) */}
        <div className="w-full sm:w-1/2 h-full min-h-[110px] max-h-[160px] flex-1 relative flex items-center justify-center overflow-hidden">
          <ReactECharts
            option={sentimentOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        {/* 3 Breakdown Cards (Right Column) */}
        <div className="w-full sm:w-1/2 flex flex-col justify-center gap-1 shrink-0 text-xs">
          {/* Positive Card */}
          <div className="p-1 px-1.5 rounded-md bg-emerald-50/70 border border-emerald-100 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20A765] shrink-0" />
                <span className="text-[10px] font-bold text-slate-800">
                  {language === 'mr' ? 'सकारात्मक प्रतिसाद' : 'Positive Feedback'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800">
                {sentimentStats.positive}%
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#20A765] h-full rounded-full transition-all duration-500"
                style={{ width: `${sentimentStats.positive}%` }}
              />
            </div>
          </div>

          {/* Neutral Card */}
          <div className="p-1 px-1.5 rounded-md bg-blue-50/70 border border-blue-100 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0" />
                <span className="text-[10px] font-bold text-slate-800">
                  {language === 'mr' ? 'तटस्थ / माहितीपर' : 'Neutral / Informative'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-800">
                {sentimentStats.neutral}%
              </span>
            </div>
            <div className="w-full bg-blue-200/60 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#0284C7] h-full rounded-full transition-all duration-500"
                style={{ width: `${sentimentStats.neutral}%` }}
              />
            </div>
          </div>

          {/* Critical Card */}
          <div className="p-1 px-1.5 rounded-md bg-rose-50/70 border border-rose-100 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E94B4B] shrink-0" />
                <span className="text-[10px] font-bold text-slate-800">
                  {language === 'mr' ? 'गंभीर / दक्षता निवारण' : 'Critical / Escalations'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-rose-800">
                {sentimentStats.critical}%
              </span>
            </div>
            <div className="w-full bg-rose-200/60 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#E94B4B] h-full rounded-full transition-all duration-500"
                style={{ width: `${sentimentStats.critical}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAssessmentChart;

