'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PressReleasesSkeleton } from '@/components/skeletons/PressReleasesSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <PressReleasesSkeleton />
    </DashboardLayout>
  );
}
