'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TV_CHANNELS_DATA } from '@/data/dashboardData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getLocalizedChannel } from '@/lib/dataLocalization';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const TVChannelDataSection: React.FC = () => {
  const { language } = useDashboardStore();

  const chartOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: Array<{ name: string; value: number }>) => {
          const item = params[0];
          const channel = TV_CHANNELS_DATA.find((c) => c.channel.startsWith(item.name)) || TV_CHANNELS_DATA[0];
          const channelName = getLocalizedChannel(channel.channel, language);
          return `<div style="font-size:11px; padding:2px;">
            <div style="font-weight:bold; color:#1B2A4A; margin-bottom:2px;">${channelName}</div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>${language === 'mr' ? 'प्रसारण वेळ:' : 'Airtime:'}</span>
              <strong style="font-family:monospace;">${item.value} ${language === 'mr' ? 'मि' : 'min'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>${language === 'mr' ? 'सरासरी सूर:' : 'Avg Sentiment:'}</span>
              <strong style="font-family:monospace; color:#15803D;">${channel.sentimentScore}%</strong>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span>${language === 'mr' ? 'प्राइम-टाइम वाटा:' : 'Prime-time Share:'}</span>
              <strong style="font-family:monospace; color:#D97706;">${channel.primeTimeShare}</strong>
            </div>
          </div>`;
        },
      },
      grid: { top: 25, right: 10, bottom: 20, left: 35 },
      xAxis: {
        type: 'category',
        data: TV_CHANNELS_DATA.map((t) => getLocalizedChannel(t.channel, language).split(' ')[0]),
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1B2A4A', fontSize: 10, fontWeight: 500 },
      },
      yAxis: {
        type: 'value',
        max: 200,
        splitLine: { lineStyle: { color: '#E2E8F0', type: 'dashed' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series: [
        {
          name: language === 'mr' ? 'प्रसारण वेळ (मि)' : 'Airtime (Min)',
          type: 'bar',
          data: TV_CHANNELS_DATA.map((t) => t.airtimeMinutes),
          barWidth: '38%',
          itemStyle: {
            color: '#1B2A4A', // Government Navy
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#1B2A4A',
            fontSize: 10,
            fontWeight: 700,
            formatter: language === 'mr' ? '{c} मि' : '{c}m',
          },
        },
      ],
    };
  }, [language]);

  return (
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col p-4 space-y-3 shadow-2xs">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name="tv" size="md" className="text-gov-primary" />
          <div>
            <h4 className="text-xs font-bold text-gov-primary">
              {language === 'mr' ? 'टीव्ही वृत्त संनियंत्रण' : 'TV Broadcast Monitoring'}
            </h4>
            <p className="text-[10px] text-slate-500">
              {language === 'mr' ? 'प्रादेशिक इलेक्ट्रॉनिक माध्यम संनियंत्रण' : 'Regional Electronic Media Surveillance'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{language === 'mr' ? '४ राज्यस्तरीय वाहिन्या' : '4 State Channels'}</span>
        </span>
      </div>

      {/* Infographics Metric Row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="schedule" size="xs" className="text-slate-400" />
            <span>{language === 'mr' ? 'एकूण वेळ' : 'Airtime Total'}</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
            602{language === 'mr' ? ' मि' : 'm'}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <MaterialIcon name="podcasts" size="xs" className="text-slate-400" />
            <span>{language === 'mr' ? 'प्राइम वाटा' : 'Prime Share'}</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">34%</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded">
          <div className="text-[10px] text-emerald-800 font-medium">
            {language === 'mr' ? 'सरासरी सूर' : 'Avg Sentiment'}
          </div>
          <div className="text-sm font-bold font-mono text-emerald-800 mt-0.5">70%</div>
        </div>
      </div>

      {/* Broadcast Airtime Bar Chart */}
      <div>
        <div className="flex justify-between items-center text-[11px] text-slate-600 mb-1">
          <span className="font-medium">
            {language === 'mr' ? 'प्रसारण वेळ वितरण (निरीक्षण केलेली मिनिटे)' : 'Airtime Distribution (Minutes Monitored)'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {language === 'mr' ? 'मागील २४ तास' : 'Last 24 Hours'}
          </span>
        </div>
        <div className="h-36 w-full">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Live Topic Ticker */}
      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px]">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
          <span className="uppercase font-mono flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {language === 'mr' ? 'थेट इलेक्ट्रॉनिक संनियंत्रण • एबीपी माझा' : 'Live Electronic Monitor • ABP Majha'}
          </span>
          <span className="font-mono text-emerald-700 font-bold">
            {language === 'mr' ? '७४% सकारात्मक सूर' : '74% Pos Tone'}
          </span>
        </div>
        <p className="text-slate-800 font-medium truncate">
          {language === 'mr'
            ? 'सिंधुदुर्ग काजू प्रक्रिया उद्योग व विशेष आर्थिक सवलती पॅकेज'
            : TV_CHANNELS_DATA[0].currentTopic}
        </p>
      </div>
    </div>
  );
};
