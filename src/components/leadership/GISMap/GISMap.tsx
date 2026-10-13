'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

export const GISMap: React.FC = () => {
  const { districts, selectedDistrictId, setSelectedDistrictId } = useDashboardStore();

  const selected = districts.find((d) => d.id === selectedDistrictId) || districts[0];

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col h-full">
      <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between">
        <h3 className="text-sm font-semibold text-content-primary">Maharashtra GIS Map</h3>
        <span className="text-xs text-content-muted">Hover or select a district</span>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between flex-1">
        {/* Schematic Maharashtra SVG Map */}
        <div className="w-full md:w-3/5 h-48 bg-surface-secondary rounded border border-borderLine-subtle flex items-center justify-center p-2 relative overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Maharashtra Schematic District Regions */}
            <g className="cursor-pointer transition-all">
              {/* Konkan / Mumbai / Thane */}
              <path
                d="M 50 120 L 70 110 L 85 140 L 75 180 L 55 160 Z"
                fill={selectedDistrictId === 'thane' ? '#202124' : '#DADCE0'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                onClick={() => setSelectedDistrictId('thane')}
                className="hover:opacity-80"
              />
              {/* Pune */}
              <path
                d="M 85 140 L 130 135 L 145 180 L 95 190 L 75 180 Z"
                fill={selectedDistrictId === 'pune' ? '#202124' : '#5F6368'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                onClick={() => setSelectedDistrictId('pune')}
                className="hover:opacity-80"
              />
              {/* Nashik */}
              <path
                d="M 70 110 L 125 90 L 140 130 L 85 140 Z"
                fill={selectedDistrictId === 'nashik' ? '#202124' : '#80868B'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                onClick={() => setSelectedDistrictId('nashik')}
                className="hover:opacity-80"
              />
              {/* Aurangabad */}
              <path
                d="M 125 90 L 190 95 L 180 150 L 130 135 Z"
                fill={selectedDistrictId === 'aurangabad' ? '#202124' : '#DADCE0'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                onClick={() => setSelectedDistrictId('aurangabad')}
                className="hover:opacity-80"
              />
              {/* Nagpur / Vidarbha */}
              <path
                d="M 190 95 L 320 80 L 330 150 L 230 160 L 180 150 Z"
                fill={selectedDistrictId === 'nagpur' ? '#202124' : '#80868B'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                onClick={() => setSelectedDistrictId('nagpur')}
                className="hover:opacity-80"
              />
              {/* South Maharashtra */}
              <path
                d="M 95 190 L 180 150 L 210 220 L 120 230 Z"
                fill="#DADCE0"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="hover:opacity-80"
              />
            </g>
          </svg>
          <span className="absolute bottom-2 left-2 text-[10px] text-content-muted font-mono">
            36 Administrative Districts • Vector Topology
          </span>
        </div>

        {/* Selected District Info Card */}
        <div className="w-full md:w-2/5 border border-borderLine-subtle p-3 rounded bg-surface text-xs space-y-2">
          <div className="flex justify-between items-center border-b border-borderLine-subtle pb-1.5">
            <span className="font-bold text-content-primary text-sm">{selected.name}</span>
            <span className="font-mono text-content-muted text-[11px]">{selected.division} Div.</span>
          </div>
          <div className="flex justify-between text-content-secondary">
            <span>DIO Status:</span>
            <span className="font-medium text-content-primary">
              {selected.dioActive ? '● Active' : '○ Standby'}
            </span>
          </div>
          <div className="flex justify-between text-content-secondary">
            <span>Current CPI:</span>
            <span className="font-mono font-bold text-content-primary">{selected.cpi} / 100</span>
          </div>
          <div className="flex justify-between text-content-secondary">
            <span>Avg. Response Time:</span>
            <span className="font-mono text-content-primary">{selected.avgTAT} min</span>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setSelectedDistrictId(selected.id)}
              className="w-full text-center py-1 text-xs border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary transition-colors"
            >
              Inspect Score & Data →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
