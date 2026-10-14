'use client';

import React from 'react';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Building2 } from 'lucide-react';

export const DepartmentSelector: React.FC = () => {
  const { selectedDepartmentId, setSelectedDepartmentId } = useDashboardStore();

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-content-primary" />
        <div>
          <h3 className="text-xs font-bold text-content-primary">
            Department-Wise Media & Communications Hub
          </h3>
          <p className="text-[10px] text-content-muted">
            State Ministries & Administrative Directorates
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {DEPARTMENTS_DATA.map((dept) => {
          const isSelected = dept.id === selectedDepartmentId;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartmentId(dept.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                  : 'bg-surface text-content-secondary border-borderLine-standard hover:bg-surface-secondary'
              }`}
            >
              <span>{dept.name}</span>
              <span className="text-[10px] opacity-75 ml-1">({dept.marathiName})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
