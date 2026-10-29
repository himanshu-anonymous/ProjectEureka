import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CoreOperationalSwitchDeck } from '@/components/commandCenter/CoreOperationalSwitchDeck';
import { CommandCenterView } from '@/components/commandCenter/CommandCenterView';

export default function CommandCenterPage() {
  return (
    <DashboardLayout>
      <div className="max-w-[1780px] w-full mx-auto space-y-4 p-4 sm:p-5">
        {/* Core Switcher Deck: [ Command Center | Konkan Index | Crisis Desk ] */}
        <CoreOperationalSwitchDeck currentActive="command-center" />

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
