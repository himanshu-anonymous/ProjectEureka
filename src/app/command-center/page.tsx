import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CommandCenterView } from '@/components/commandCenter/CommandCenterView';

export default function CommandCenterPage() {
  return (
    <DashboardLayout>
      <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
        <CommandCenterView />
      </div>
    </DashboardLayout>
  );
}
