import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemMonitoringNavHeader } from '@/components/commandCenter/SystemMonitoringNavHeader';
import { RawIngestionView } from '@/components/commandCenter/RawIngestionView';

export default function SystemMonitoringRawIngestionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-4">
        {/* Dedicated System & Infrastructure Monitoring Navigation Header */}
        <SystemMonitoringNavHeader />

        {/* Technical Route: Raw Ingestion Management (Sources, NLP/OCR Pipeline, Failures & Retries, Millisecond Logs) */}
        <RawIngestionView />
      </div>
    </DashboardLayout>
  );
}
