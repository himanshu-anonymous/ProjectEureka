import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LiveNewsScreen } from '@/components/portal/LiveNewsScreen';

export default function LiveNewsPage() {
  return (
    <DashboardLayout>
      <LiveNewsScreen />
    </DashboardLayout>
  );
}
