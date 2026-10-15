import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterNavHeader } from '@/components/commandCenter/CommandCenterNavHeader';
import { PipelineFlowView } from '@/components/commandCenter/PipelineFlowView';

export default function PipelineFlowPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-5 max-w-[1720px] w-full mx-auto space-y-5">
        {/* Command Centre 3-Page Top Navigation Header */}
        <CommandCenterNavHeader />

        {/* Page 3: Pipeline & Telemetry Flow (with 6 horizontal dropdown sections & animated flow) */}
        <PipelineFlowView />
      </div>
    </DashboardLayout>
  );
}
