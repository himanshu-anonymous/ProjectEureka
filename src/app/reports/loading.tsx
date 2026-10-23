'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportsSkeleton } from '@/components/skeletons/ReportsSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <ReportsSkeleton />
    </DashboardLayout>
  );
}
