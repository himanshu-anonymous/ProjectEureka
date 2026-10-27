'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPageSkeleton } from '@/components/skeletons/DashboardPageSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <DashboardPageSkeleton />
    </DashboardLayout>
  );
}
