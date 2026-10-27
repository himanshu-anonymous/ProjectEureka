import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceScreen } from '@/components/portal/AttendanceScreen';

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <AttendanceScreen />
    </DashboardLayout>
  );
}
