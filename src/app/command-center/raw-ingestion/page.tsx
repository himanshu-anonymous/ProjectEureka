import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterNavHeader } from '@/components/commandCenter/CommandCenterNavHeader';
import { RawIngestionView } from '@/components/commandCenter/RawIngestionView';

export default function RawIngestionPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
        {/* Command Centre 2-Page Top Navigation */}
        <CommandCenterNavHeader />

        {/* Page 2: Raw Ingestion Management (with 4 KPI cards and 6 operational sections) */}
        <RawIngestionView />
      </div>
    </DashboardLayout>
  );
}
