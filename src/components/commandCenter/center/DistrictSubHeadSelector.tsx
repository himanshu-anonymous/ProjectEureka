'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MapPin } from 'lucide-react';

export const DistrictSubHeadSelector: React.FC = () => {
  const { districts, selectedDistrictId, setSelectedDistrictId } = useDashboardStore();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-content-primary flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>District Sub-heads (36 Districts Network)</span>
        </span>
        <span className="text-[11px] text-content-muted">Click to switch sub-head</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {districts.map((d) => {
          const isSelected = d.id === selectedDistrictId;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDistrictId(d.id)}
              className={`p-2 rounded text-left border transition-all text-xs flex flex-col justify-between ${
                isSelected
                  ? 'bg-action-primary text-content-inverse border-borderLine-strong shadow-sm'
                  : 'bg-surface border-borderLine-standard hover:bg-surface-secondary text-content-primary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold truncate">{d.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-content-inverse/80' : 'text-content-muted'}`}>
                  #{d.rank}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1">
                <span className={isSelected ? 'text-content-inverse/80' : 'text-content-secondary'}>
                  {d.division}
                </span>
                <span className="font-mono font-bold">
                  {d.cpi} CPI
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
