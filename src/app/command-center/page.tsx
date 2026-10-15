import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterNavHeader } from '@/components/commandCenter/CommandCenterNavHeader';
import { TelemetryOperationsView } from '@/components/commandCenter/TelemetryOperationsView';

export default function CommandCenterPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
        {/* Command Centre 2-Page Top Navigation */}
        <CommandCenterNavHeader />

        {/* Page 1: Telemetry Operations (with 7 in-page tab modules) */}
        <TelemetryOperationsView />
      </div>
    </DashboardLayout>
  );
}
