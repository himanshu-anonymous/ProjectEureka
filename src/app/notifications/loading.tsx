'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NotificationsSkeleton } from '@/components/skeletons/NotificationsSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <NotificationsSkeleton />
    </DashboardLayout>
  );
}
