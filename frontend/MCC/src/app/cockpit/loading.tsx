import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CockpitLoading() {
  return (
    <DashboardLayout>
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-amber-400">Loading No-Scroll Executive Cockpit...</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
