'use client';

import React, { useEffect, useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';

interface SLACountdownProps {
  initialMinutes: number;
  label?: string;
  className?: string;
  compact?: boolean;
}

export const SLACountdown: React.FC<SLACountdownProps> = ({
  initialMinutes,
  label = 'SLA Remaining',
  className = '',
  compact = false,
}) => {
  // Convert initial minutes into total seconds
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.max(0, Math.floor(initialMinutes * 60))
  );

  useEffect(() => {
    if (secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const totalMinutesRemaining = Math.floor(secondsRemaining / 60);

  // Status colors based on SLA thresholds
  let statusColorClass = 'text-content-primary';
  let badgeColorClass = 'bg-surface-secondary text-content-secondary border-borderLine-standard';
  let isCritical = false;

  if (totalMinutesRemaining < 30) {
    statusColorClass = 'text-red-700 font-bold';
    badgeColorClass = 'bg-red-100 text-red-800 border-red-300';
    isCritical = true;
  } else if (totalMinutesRemaining < 60) {
    statusColorClass = 'text-amber-800 font-bold';
    badgeColorClass = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-xs ${statusColorClass} ${className}`}>
        <MaterialIcon
          name="schedule"
          size="xs"
          className={isCritical ? 'text-red-600' : 'text-slate-400'}
        />
        <span className="font-bold">
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded border border-red-200/80 bg-white/95 p-2 shadow-2xs ${className}`}
      aria-label={`${label}: ${hours} hours ${minutes} minutes ${seconds} seconds`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
          <MaterialIcon
            name="schedule"
            size="xs"
            className={isCritical ? 'text-red-600' : 'text-slate-500'}
          />
          <span>{label}</span>
        </div>
        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badgeColorClass}`}>
          {isCritical ? 'CRITICAL SLA' : 'LIVE TICKER'}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 font-mono py-1">
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold tracking-tight ${statusColorClass}`}>{pad(hours)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">Hrs</span>
        </div>
        <span className="text-base font-bold text-slate-400 -mt-3">:</span>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold tracking-tight ${statusColorClass}`}>{pad(minutes)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">Min</span>
        </div>
        <span className="text-base font-bold text-slate-400 -mt-3">:</span>
        <div className="flex flex-col items-center">
          <span className={`text-lg font-bold tracking-tight ${statusColorClass}`}>{pad(seconds)}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-sans">Sec</span>
        </div>
      </div>
    </div>
  );
};
