import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SystemMonitoringNavHeader } from '@/components/commandCenter/SystemMonitoringNavHeader';
import { PipelineFlowView } from '@/components/commandCenter/PipelineFlowView';

export default function SystemMonitoringPipelineFlowPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-4">
        {/* Dedicated System & Infrastructure Monitoring Navigation Header */}
        <SystemMonitoringNavHeader />

        {/* Technical Route: Pipeline & Operations Architecture Flow (Animated Data Packet Processing Flowchart) */}
        <PipelineFlowView />
      </div>
    </DashboardLayout>
  );
}
