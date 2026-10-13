'use client';

import React from 'react';
import { LucideIcon, ArrowDown, ArrowUp } from 'lucide-react';

export interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string;
  targetText: string;
  trendDirection?: 'up' | 'down';
  trendValue: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon: Icon,
  title,
  value,
  unit,
  targetText,
  trendDirection,
  trendValue,
}) => {
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-content-secondary mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-content-primary" />
          <span className="text-xs font-medium text-content-primary">{title}</span>
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-content-primary">
          {value}
          {unit && <span className="text-sm font-normal text-content-secondary ml-1">{unit}</span>}
        </div>
        <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
          <span>{targetText}</span>
          <div className="flex items-center gap-0.5 text-content-secondary font-medium">
            {trendDirection === 'up' && <ArrowUp className="w-3.5 h-3.5" />}
            {trendDirection === 'down' && <ArrowDown className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
