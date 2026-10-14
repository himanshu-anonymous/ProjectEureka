import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MainDashboard } from '@/components/dashboard/MainDashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <MainDashboard />
    </DashboardLayout>
  );
}
