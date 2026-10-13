'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MainDashboard } from '@/components/dashboard/MainDashboard';

export default function Home() {
  return (
    <DashboardLayout>
      <MainDashboard />
    </DashboardLayout>
  );
}
