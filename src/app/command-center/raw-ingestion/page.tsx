import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterNavHeader } from '@/components/commandCenter/CommandCenterNavHeader';
import { RawIngestionView } from '@/components/commandCenter/RawIngestionView';

export default function RawIngestionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-4">
        {/* Canonical Command Center Navigation Header */}
        <CommandCenterNavHeader />

        {/* Canonical Shared Raw Ingestion Management */}
        <RawIngestionView />
      </div>
    </DashboardLayout>
  );
}
