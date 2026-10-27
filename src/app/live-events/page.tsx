import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LiveEventsScreen } from '@/components/portal/LiveEventsScreen';

export default function LiveEventsPage() {
  return (
    <DashboardLayout>
      <LiveEventsScreen />
    </DashboardLayout>
  );
}
