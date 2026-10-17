import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OperationalCommandHeader } from '@/components/commandCenter/OperationalCommandHeader';
import { CommandCenterView } from '@/components/commandCenter/CommandCenterView';

export default function CommandCenterPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1720px] w-full mx-auto space-y-4">
        {/* Executive Operational Command Header with Quick Route to System Telemetry */}
        <OperationalCommandHeader />

        {/* Pure Operational 3-Column DGIPR Command Deck:
            - Left: Newspaper, TV & Social Media Sentiment Analysis
            - Center: Maharashtra 36-District Topology & DIO Data Drawer
            - Right: Leadership Directives & Live Media Broadcast Streams
        */}
        <CommandCenterView />
      </div>
    </DashboardLayout>
  );
}
