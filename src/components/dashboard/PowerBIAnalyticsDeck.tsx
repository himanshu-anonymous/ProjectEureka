'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { getDistrictSentiment } from '@/lib/sentimentEngine';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const PowerBIAnalyticsDeck: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    selectedPeriod,
    language,
    incidents,
    overviewMetrics,
  } = useDashboardStore();
  const t = useTranslation(language);

  const isDistrictScoped = Boolean(selectedDistrictId && selectedDistrictId !== 'all');
  const currentDistrict = isDistrictScoped
    ? districts.find((d) => d.id === selectedDistrictId.toLowerCase())
    : null;

  // 1. Division Comparison Data (Aggregated from real districts dataset)
  const divisionData = useMemo(() => {
    const divisionMap: Record<string, { totalCpi: number; count: number; totalReleases: number }> = {};

    districts.forEach((d) => {
      const div = d.division || 'Other';
      if (!divisionMap[div]) {
        divisionMap[div] = { totalCpi: 0, count: 0, totalReleases: 0 };
      }
      divisionMap[div].totalCpi += d.cpi;
      divisionMap[div].totalReleases += d.releases;
      divisionMap[div].count += 1;
    });

    const entries = Object.entries(divisionMap).map(([name, val]) => ({
      name,
      avgCpi: Number((val.totalCpi / val.count).toFixed(1)),
      releases: val.totalReleases,
    }));

    return entries.sort((a, b) => b.avgCpi - a.avgCpi);
  }, [districts]);

  // 2. Dynamic Sentiment Data
  const sentimentStats = useMemo(() => {
    const raw = getDistrictSentiment(selectedDistrictId, selectedPeriod, INITIAL_QUEUE_ITEMS);
    const positive = Math.round(raw.composite);
    const critical = Math.max(5, Math.round(100 - raw.composite - (raw.composite > 75 ? 18 : 26)));
    const neutral = Math.max(0, 100 - positive - critical);

    return {
      positive,
      neutral,
      critical,
      composite: raw.composite,
      printOcr: raw.printOcr,
      broadcastTv: raw.broadcastTv,
      socialListening: raw.socialListening,
      userComments: raw.userComments,
    };
  }, [selectedDistrictId, selectedPeriod]);

  // 3. Time Series Multi-day Trend Data
  const timeSeriesOption = useMemo(() => {
    const dates = ['21 Oct', '22 Oct', '23 Oct', '24 Oct', '25 Oct', '26 Oct', '27 Oct'];
    const baseReleases = currentDistrict ? Math.round(currentDistrict.releases / 7) : 185;
    const releaseTrend = [
      Math.round(baseReleases * 0.92),
      Math.round(baseReleases * 0.96),
      Math.round(baseReleases * 1.05),
      Math.round(baseReleases * 0.98),
      Math.round(baseReleases * 1.12),
      Math.round(baseReleases * 1.08),
      Math.round(baseReleases * 1.15),
    ];
    const citizenQueries = releaseTrend.map((v) => Math.round(v * 2.8 + 45));

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        axisPointer: { type: 'cross', lineStyle: { color: '#94A3B8' } },
      },
      legend: {
        bottom: 0,
        textStyle: { fontSize: 10, color: '#64748B' },
        itemWidth: 10,
        itemHeight: 10,
        data: [
          language === 'mr' ? 'शासकीय प्रसिद्धीपत्रके' : 'Official Dispatches',
          language === 'mr' ? 'नागरिक संवाद व तक्रारी' : 'Citizen Inquiries',
        ],
      },
      grid: { top: 25, right: 20, bottom: 35, left: 45 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series: [
        {
          name: language === 'mr' ? 'शासकीय प्रसिद्धीपत्रके' : 'Official Dispatches',
          type: 'line',
          smooth: true,
          data: releaseTrend,
          color: '#1B2A4A',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(27, 42, 74, 0.28)' },
                { offset: 1, color: 'rgba(27, 42, 74, 0.01)' },
              ],
            },
          },
          lineStyle: { width: 2.5 },
        },
        {
          name: language === 'mr' ? 'नागरिक संवाद व तक्रारी' : 'Citizen Inquiries',
          type: 'line',
          smooth: true,
          data: citizenQueries,
          color: '#D97706',
          lineStyle: { width: 2, type: 'dashed' },
        },
      ],
    };
  }, [currentDistrict, language]);

  // 4. Regional Division Performance Bar Chart
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
            <div style="color:#F59E0B;">Avg CPI Score: <strong>${item.value} / 100</strong></div>
          </div>`;
        },
      },
      grid: { top: 15, right: 30, bottom: 20, left: 85 },
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
        axisLabel: { color: '#475569', fontSize: 10, fontWeight: 500 },
      },
      series: [
        {
          type: 'bar',
          data: scores,
          barWidth: '42%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: { dataIndex: number }) => {
              const palette = ['#1B2A4A', '#2563EB', '#D97706', '#059669', '#475569', '#64748B'];
              return palette[params.dataIndex % palette.length];
            },
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            fontSize: 10,
            color: '#1E293B',
            fontWeight: 600,
          },
        },
      ],
    };
  }, [divisionData]);

  // 5. Sentiment Donut Chart Option
  const sentimentOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
        formatter: '{b}: <strong>{d}%</strong> ({c} points)',
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
          radius: ['52%', '78%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          data: [
            {
              value: sentimentStats.positive,
              name: language === 'mr' ? 'सकारात्मक सूर' : 'Positive',
              itemStyle: { color: '#059669' },
            },
            {
              value: sentimentStats.neutral,
              name: language === 'mr' ? 'तटस्थ / सामान्य' : 'Neutral',
              itemStyle: { color: '#64748B' },
            },
            {
              value: sentimentStats.critical,
              name: language === 'mr' ? 'गंभीर / लक्षवेधी' : 'Critical',
              itemStyle: { color: '#DC2626' },
            },
          ],
        },
      ],
    };
  }, [sentimentStats, language]);

  // 6. Category Alert & Incident Breakdown
  const incidentOption = useMemo(() => {
    const accidentCount = incidents.filter((i) => i.severity === 'High' || i.incidentType === 'Accident').length || 2;
    const misinformationCount = overviewMetrics?.misinformationTickets ?? 4;
    const officialNotices = 18;
    const infraIssues = 5;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontSize: 11 },
      },
      grid: { top: 20, right: 15, bottom: 25, left: 35 },
      xAxis: {
        type: 'category',
        data: [
          language === 'mr' ? 'अपघात' : 'Incidents',
          language === 'mr' ? 'अफवा' : 'Debunks',
          language === 'mr' ? 'प्रसिद्धी' : 'Notices',
          language === 'mr' ? 'पायाभूत' : 'Infra',
        ],
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series: [
        {
          name: language === 'mr' ? 'सक्रिय प्रकरणे' : 'Active Items',
          type: 'bar',
          data: [accidentCount, misinformationCount, officialNotices, infraIssues],
          barWidth: '38%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: (params: { dataIndex: number }) => {
              const colors = ['#DC2626', '#D97706', '#1B2A4A', '#2563EB'];
              return colors[params.dataIndex % colors.length];
            },
          },
        },
      ],
    };
  }, [incidents, overviewMetrics, language]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Power BI Visual Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <MaterialIcon name="analytics" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{language === 'mr' ? 'पॉवर बीआय ॲनालिटिक्स व ट्रेण्ड्स' : 'Power BI Analytical Intelligence'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                Live BI Deck
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {language === 'mr'
                ? 'माहिती प्रवाह, विभागीय तुलना, लोकभावना विश्लेषण व आणीबाणी वर्गीकरण'
                : 'Statewide Volume Velocity, Division Benchmarks, Sentiment Health & Multi-Channel Feed'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentDistrict ? currentDistrict.name : (language === 'mr' ? 'सर्व ३६ जिल्हे' : 'Statewide 36 Districts')}</span>
          <span className="text-slate-300">|</span>
          <span>{selectedPeriod}</span>
        </div>
      </div>

      {/* 4-Chart Analytical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Chart 1: Volume Trend */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              {language === 'mr' ? '१. माहिती प्रसारण व पोहोच कल' : '1. Volume Velocity Trend'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">7-Day Trajectory</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ReactECharts option={timeSeriesOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 2: Division Comparison */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              {language === 'mr' ? '२. विभागीय सीपीआय कामगिरी' : '2. Division CPI Benchmark'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">6 Divisions</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ReactECharts option={divisionOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 3: Sentiment Health */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              {language === 'mr' ? '३. लोकभावना व माध्यम सूर' : '3. Sentiment Assessment'}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">{sentimentStats.positive}% Pos</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ReactECharts option={sentimentOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Chart 4: Incident & Alert Severity */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              {language === 'mr' ? '४. आणीबाणी व निवारण स्थिती' : '4. Alert Ingestion Mix'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">Category Load</span>
          </div>
          <div className="h-52 w-full pt-2">
            <ReactECharts option={incidentOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerBIAnalyticsDeck;
