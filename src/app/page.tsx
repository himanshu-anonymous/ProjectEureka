import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThreeColumnDashboard } from '@/components/dashboard/ThreeColumnDashboard';

export default function Home() {
  return (
    <DashboardLayout>
      <ThreeColumnDashboard />
    </DashboardLayout>
  );
}
