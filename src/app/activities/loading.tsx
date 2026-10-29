'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActivitiesSkeleton } from '@/components/skeletons/ActivitiesSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <ActivitiesSkeleton />
    </DashboardLayout>
  );
}
