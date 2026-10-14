'use client';

import React from 'react';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';

export const CrisisScreen: React.FC = () => {
  const { incidents } = useDashboardStore();

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Crisis Escalation & Misinformation Rapid Response Desk</span>
        </h2>
        <p className="text-xs text-content-muted">
          Mandatory 90-Minute SLA Rumor Refutation, Collector Verification & Social Alert Countermeasures
        </p>
      </div>

      {/* SLA Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-content-muted font-medium">90-Minute Crisis SLA</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">94.2%</div>
            <div className="text-[10px] text-content-secondary mt-1">Refuted within target time</div>
          </div>
          <Clock className="w-8 h-8 text-content-primary stroke-[1.5]" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-content-muted font-medium">Active Incidents</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">{incidents.length}</div>
            <div className="text-[10px] text-content-secondary mt-1">Under multi-agency check</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-content-primary stroke-[1.5]" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-content-muted font-medium">Authorized Rebuttals</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">28</div>
            <div className="text-[10px] text-content-secondary mt-1">Dispatched to state press & viral channels</div>
          </div>
          <CheckCircle className="w-8 h-8 text-content-primary stroke-[1.5]" />
        </div>
      </div>

      {/* Main Emergency Alert Component */}
      <EmergencyAlert />
    </div>
  );
};
