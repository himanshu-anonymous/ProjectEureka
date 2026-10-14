'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';

interface OCRFilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters?: string[];
}

export const OCRFilterPills: React.FC<OCRFilterPillsProps> = ({
  activeFilter,
  onFilterChange,
  filters = ['All', 'Positive', 'Negative', 'Neutral'],
}) => {
  const { language } = useDashboardStore();
  const t = useTranslation(language);

  const getFilterStyles = (filter: string, isActive: boolean) => {
    if (!isActive) {
      return 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900';
    }

    switch (filter) {
      case 'Positive':
        return 'bg-emerald-700 text-white font-bold shadow-xs';
      case 'Negative':
        return 'bg-rose-700 text-white font-bold shadow-xs';
      case 'Neutral':
        return 'bg-slate-700 text-white font-bold shadow-xs';
      case 'All':
      default:
        return 'bg-gov-primary text-white font-bold shadow-xs';
    }
  };

  const getLabel = (filter: string) => {
    switch (filter) {
      case 'Positive':
        return t.zone4.filterPositive;
      case 'Negative':
        return t.zone4.filterNegative;
      case 'Neutral':
        return t.zone4.filterNeutral;
      case 'All':
      default:
        return t.zone4.filterAll;
    }
  };

  return (
    <div className="flex gap-1.5 text-xs flex-wrap">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${getFilterStyles(
              filter,
              isActive
            )}`}
          >
            {getLabel(filter)}
          </button>
        );
      })}
    </div>
  );
};
