'use client';

import React from 'react';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';

export const CrisisScreen: React.FC = () => {
  const { incidents, userRole, currentUser } = useDashboardStore();

  const isCollector = userRole === 'collector';
  const isOperator = userRole === 'dio_desk';
  const isAdmin = userRole === 'dg_admin';

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <MaterialIcon name="gpp_bad" size="sm" className="text-red-700" />
          <span>Crisis Escalation & Misinformation Rapid Response Desk</span>
        </h2>
        <p className="text-xs text-content-muted">
          Mandatory 90-Minute SLA Rumor Refutation, Collector Verification & Social Alert Countermeasures
        </p>
      </div>

      {/* Role Clearance Notice Banner */}
      <div
        className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
          isCollector
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : isOperator
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <MaterialIcon
            name={isCollector ? 'verified_user' : isOperator ? 'lock' : 'shield'}
            size="sm"
            className={isCollector ? 'text-emerald-700' : isOperator ? 'text-amber-700' : 'text-blue-700'}
          />
          <div>
            <span className="font-bold">
              {isCollector
                ? `Officer Clearance: District Magistrate & Collector (${currentUser?.district || 'Palghar'})`
                : isOperator
                ? `Officer Clearance: DIO Operator 1 (${currentUser?.district || 'Palghar Desk'})`
                : isAdmin
                ? 'Officer Clearance: State DG Admin (Statewide Clearance)'
                : 'Officer Clearance: Divisional Deputy Director (Konkan Division)'}
            </span>
            <p className="text-[11px] opacity-90 mt-0.5">
              {isCollector
                ? 'You hold signing authority. 1-click official rebuttal authorization is active for your district.'
                : isOperator
                ? 'You are operating in Field Triage & Draft mode. Official rebuttal authorization requires Collector signature.'
                : 'Statewide command oversight active. Rebuttals authorized by local Collectors are indexed in real time.'}
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/70 border border-current">
          {userRole.toUpperCase()}
        </span>
      </div>

      {/* SLA Metric Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">90-Minute Crisis SLA</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">94.2%</div>
            <div className="text-[10px] text-emerald-800 font-medium mt-1">Within Target</div>
          </div>
          <MaterialIcon name="schedule" size="md" className="text-slate-500" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">Active Incidents</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">{incidents.length}</div>
            <div className="text-[10px] text-amber-800 font-medium mt-1">
              {isOperator ? 'Local Palghar Incidents' : 'In Triage'}
            </div>
          </div>
          <MaterialIcon name="warning" size="md" className="text-slate-500" />
        </div>

        <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[11px] text-content-muted font-medium">Authorized Rebuttals</div>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">
              {incidents.filter((i) => i.authorized).length + 28}
            </div>
            <div className="text-[10px] text-emerald-800 font-medium mt-1">Dispatched to Media</div>
          </div>
          <MaterialIcon name="check_circle" size="md" className="text-slate-500" />
        </div>
      </div>

      {/* Main Emergency Alert Component */}
      <EmergencyAlert />
    </div>
  );
};
