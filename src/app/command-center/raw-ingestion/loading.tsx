'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RawIngestionSkeleton } from '@/components/skeletons/RawIngestionSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <RawIngestionSkeleton />
    </DashboardLayout>
  );
}
