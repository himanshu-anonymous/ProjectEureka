'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';

interface SampleDataBadgeProps {
  className?: string;
  size?: 'xs' | 'sm';
}

export const SampleDataBadge: React.FC<SampleDataBadgeProps> = ({ className = '', size = 'xs' }) => {
  const { language } = useDashboardStore();
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono font-medium tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase select-none ${
        isSm ? 'text-[11px]' : 'text-[10px]'
      } ${className}`}
      title={
        language === 'mr'
          ? 'अधिकृत प्रात्यक्षिक / नमुना माहिती (काल्पनिक)'
          : 'Synthetic Demonstration Data (Fictional)'
      }
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      <span>{language === 'mr' ? 'नमुना माहिती' : 'Sample Data'}</span>
    </span>
  );
};
