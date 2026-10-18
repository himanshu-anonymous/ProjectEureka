'use client';

import React from 'react';

export interface SLACountdownProps {
  initialMinutes?: number;
  label?: string;
  className?: string;
  compact?: boolean;
}

/**
 * SLACountdown - Safe no-op null component.
 * Retained for backward-compatibility with zero runtime overhead and no timer intervals.
 */
export const SLACountdown: React.FC<SLACountdownProps> = () => null;

export default SLACountdown;
