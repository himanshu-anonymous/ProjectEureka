'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemMonitoringSkeleton } from '@/components/skeletons/SystemMonitoringSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <SystemMonitoringSkeleton />
    </DashboardLayout>
  );
}
