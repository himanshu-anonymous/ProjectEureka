'use client';

import React from 'react';
import { DEPARTMENTS_DATA } from '@/data/dashboardData';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

export const DepartmentSelector: React.FC = () => {
  const { selectedDepartmentId, setSelectedDepartmentId, language } = useDashboardStore();

  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <MaterialIcon name="domain" size="sm" className="text-content-primary" />
        <div>
          <h3 className="text-xs font-bold text-content-primary">
            {language === 'mr'
              ? 'मंत्रालय विभागनिहाय माध्यम व जनसंपर्क कक्ष'
              : 'Department-Wise Media & Communications Hub'}
          </h3>
          <p className="text-[10px] text-content-muted">
            {language === 'mr'
              ? 'राज्य मंत्रालये व प्रशासकीय संचालनालये'
              : 'State Ministries & Administrative Directorates'}
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
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                isSelected
                  ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                  : 'bg-surface text-content-secondary border-borderLine-standard hover:bg-surface-secondary'
              }`}
            >
              <span>{language === 'mr' ? dept.marathiName : dept.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
