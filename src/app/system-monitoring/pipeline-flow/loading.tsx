'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PipelineFlowSkeleton } from '@/components/skeletons/PipelineFlowSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <PipelineFlowSkeleton />
    </DashboardLayout>
  );
}
