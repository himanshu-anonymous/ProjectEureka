'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MediaMonitoringSkeleton } from '@/components/skeletons/MediaMonitoringSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <MediaMonitoringSkeleton />
    </DashboardLayout>
  );
}
