'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface DistrictSearchBarProps {
  searchDistrict: string;
  onSearchChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
}

export const DistrictSearchBar: React.FC<DistrictSearchBarProps> = ({
  searchDistrict,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <div className="relative flex-1 max-w-xs">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-content-muted" />
        <input
          type="text"
          placeholder="Search district..."
          value={searchDistrict}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 border border-borderLine-standard rounded text-xs bg-surface focus:outline-none focus:border-borderLine-strong"
        />
      </div>
      <div className="text-content-muted">
        Showing {filteredCount} of {totalCount} districts
      </div>
    </div>
  );
};
