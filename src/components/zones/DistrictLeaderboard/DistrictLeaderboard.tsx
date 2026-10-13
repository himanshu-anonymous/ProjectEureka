'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Search } from 'lucide-react';

// SSR-safe dynamic import for ECharts
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export const DistrictLeaderboard: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    searchDistrict,
    setSearchDistrict,
  } = useDashboardStore();

  const [activeTab, setActiveTab] = React.useState<'cpi' | 'event' | 'specific'>('cpi');

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivision === 'All Maharashtra' || d.division === selectedDivision;
      const matchesSearch = d.name.toLowerCase().includes(searchDistrict.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [districts, selectedDivision, searchDistrict]);

  // ECharts Bar Chart Configuration
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
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header and Sub-tabs */}
      <div className="px-4 py-3 border-b border-borderLine-subtle">
        <h3 className="text-sm font-semibold text-content-primary mb-2">
          District Performance & Leaderboard
        </h3>
        <div className="flex gap-4 text-xs border-b border-borderLine-subtle -mb-3 pb-2">
          <button
            onClick={() => setActiveTab('cpi')}
            className={`font-medium pb-1 transition-colors ${
              activeTab === 'cpi'
                ? 'text-content-primary border-b-2 border-action-primary'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            CPI Ranking
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`font-medium pb-1 transition-colors ${
              activeTab === 'event'
                ? 'text-content-primary border-b-2 border-action-primary'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Event Coverage (Top/Lower 5)
          </button>
          <button
            onClick={() => setActiveTab('specific')}
            className={`font-medium pb-1 transition-colors ${
              activeTab === 'specific'
                ? 'text-content-primary border-b-2 border-action-primary'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Specific News Coverage (Top/Lower 5)
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Top 5 Bar Chart */}
        <div>
          <div className="text-xs font-medium text-content-secondary mb-1">Top 5 Districts by CPI</div>
          <div className="h-44 w-full">
            <ReactECharts
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              onEvents={{
                click: (params: { dataIndex: number }) => {
                  const clickedDistrict = districts[params.dataIndex];
                  if (clickedDistrict) setSelectedDistrictId(clickedDistrict.id);
                },
              }}
            />
          </div>
        </div>

        {/* Controls: Search and Division Counter */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-content-muted" />
            <input
              type="text"
              placeholder="Search district..."
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-borderLine-standard rounded text-xs bg-surface focus:outline-none focus:border-borderLine-strong"
            />
          </div>
          <div className="text-content-muted">
            Showing {filteredDistricts.length} of 36 districts
          </div>
        </div>

        {/* Ranked District Table */}
        <div className="overflow-x-auto border border-borderLine-subtle rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-content-secondary border-b border-borderLine-subtle font-medium">
              <tr>
                <th className="py-2.5 px-3 w-8">#</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Division</th>
                <th className="py-2.5 px-3 text-right">Releases</th>
                <th className="py-2.5 px-3 text-right">Avg. TAT</th>
                <th className="py-2.5 px-3 text-right">Sentiment</th>
                <th className="py-2.5 px-3 text-right">Crisis SLA</th>
                <th className="py-2.5 px-3 text-right font-semibold">CPI</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLine-subtle text-content-primary">
              {filteredDistricts.map((d) => {
                const isSelected = d.id === selectedDistrictId;
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDistrictId(d.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-surface-selected font-medium'
                        : 'hover:bg-surface-secondary'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-content-muted">{d.rank}</td>
                    <td className="py-2.5 px-3 font-semibold">{d.name}</td>
                    <td className="py-2.5 px-3 text-content-secondary">{d.division}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.releases}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.avgTAT}m</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.sentiment}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">{d.crisisSLA}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">{d.cpi}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrictId(d.id);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-action-primary text-content-inverse rounded hover:bg-action-primary-hover transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
