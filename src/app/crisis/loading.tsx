'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CrisisPageSkeleton } from '@/components/skeletons/CrisisPageSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <CrisisPageSkeleton />
    </DashboardLayout>
  );
}
