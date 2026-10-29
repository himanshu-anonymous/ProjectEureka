import { NoScrollExecutiveCockpit } from '@/components/dashboard/NoScrollExecutiveCockpit';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = {
  title: 'Executive No-Scroll Cockpit | Maha Connect Centre',
  description: 'Single-screen full-viewport executive operations wall with live broadcast streaming and 36-district GIS intelligence.',
};

export default function CockpitPage() {
  return (
    <DashboardLayout>
      <NoScrollExecutiveCockpit />
    </DashboardLayout>
  );
}

