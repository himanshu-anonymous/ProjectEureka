import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActivitiesScreen } from '@/components/portal/ActivitiesScreen';

export default function ActivitiesPage() {
  return (
    <DashboardLayout>
      <ActivitiesScreen />
    </DashboardLayout>
  );
}
