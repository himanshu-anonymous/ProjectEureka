'use client';

import React from 'react';

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
  return (
    <div className="flex gap-1.5 text-xs">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            activeFilter === filter
              ? 'bg-action-primary text-content-inverse'
              : 'bg-surface-secondary text-content-secondary hover:bg-surface-selected hover:text-content-primary'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
