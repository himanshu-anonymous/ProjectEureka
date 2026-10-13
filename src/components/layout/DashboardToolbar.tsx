'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

export const DashboardToolbar: React.FC = () => {
  const { selectedDivision, setSelectedDivision, selectedPeriod, setSelectedPeriod } =
    useDashboardStore();

  return (
    <div className="bg-surface border-b border-borderLine-standard px-6 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Page Title */}
      <div>
        <h2 className="text-base font-semibold text-content-primary tracking-tight">
          Statewide Operations Overview
        </h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Geographic Scope Filter */}
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="px-3 py-1.5 bg-surface border border-borderLine-standard rounded text-xs text-content-primary focus:outline-none focus:border-borderLine-strong cursor-pointer font-medium"
        >
          <option value="All Maharashtra">All Maharashtra</option>
          <option value="Pune">Pune Division</option>
          <option value="Konkan">Konkan Division</option>
          <option value="Nagpur">Nagpur Division</option>
          <option value="Nashik">Nashik Division</option>
          <option value="Aurangabad">Aurangabad Division</option>
          <option value="Amravati">Amravati Division</option>
        </select>

        {/* Reporting Period Filter */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1.5 bg-surface border border-borderLine-standard rounded text-xs text-content-primary focus:outline-none focus:border-borderLine-strong cursor-pointer font-medium"
        >
          <option value="Last 7 days">Last 7 days</option>
          <option value="Last 30 days">Last 30 days</option>
          <option value="Last 90 days">Last 90 days</option>
        </select>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-content-muted pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-content-muted"></span>
          <span>Data synced • Apr 27, 2025 14:32</span>
        </div>
      </div>
    </div>
  );
};
