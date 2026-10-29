import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterNavHeader } from '@/components/commandCenter/CommandCenterNavHeader';
import { PipelineFlowView } from '@/components/commandCenter/PipelineFlowView';

export default function PipelineFlowPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-4">
        {/* Canonical Command Center Navigation Header */}
        <CommandCenterNavHeader />

        {/* Canonical Shared Pipeline & Operations Architecture Flow */}
        <PipelineFlowView />
      </div>
    </DashboardLayout>
  );
}
