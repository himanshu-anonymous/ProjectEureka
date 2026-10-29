import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThreeColumnDashboard } from '@/components/dashboard/ThreeColumnDashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ThreeColumnDashboard />
    </DashboardLayout>
  );
}
