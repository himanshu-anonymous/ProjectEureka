'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DistrictsPageSkeleton } from '@/components/skeletons/DistrictsPageSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <DistrictsPageSkeleton />
    </DashboardLayout>
  );
}
