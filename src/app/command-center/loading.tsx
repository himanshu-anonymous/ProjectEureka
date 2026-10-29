'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterSkeleton } from '@/components/skeletons/CommandCenterSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <CommandCenterSkeleton />
    </DashboardLayout>
  );
}
