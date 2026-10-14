'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { User, CheckCircle } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { userRole, setUserRole, language, setLanguage } = useDashboardStore();

  return (
    <div className="p-5 max-w-[1720px] w-full mx-auto space-y-5">
      <div>
        <h2 className="text-base font-bold text-content-primary flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Officer Profile & Access Governance</span>
        </h2>
        <p className="text-xs text-content-muted">
          Active Clearance Tier, Role Delegation & System Preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Officer Identity Card */}
        <div className="bg-surface border border-borderLine-standard rounded-md p-5 flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-secondary border border-borderLine-standard flex items-center justify-center font-bold text-lg text-content-primary">
            AS
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">Anil Sharma, IAS</h3>
            <p className="text-xs text-content-muted">Directorate General of Information & PR</p>
          </div>
          <span className="px-2.5 py-0.5 bg-action-primary text-content-inverse rounded text-[11px] font-mono">
            Clearance Level 1: State Command
          </span>
          <div className="w-full pt-3 border-t border-borderLine-subtle text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-content-muted">Officer ID:</span>
              <span className="font-mono font-bold text-content-primary">MH-DGIPR-7741</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Posting Station:</span>
              <span className="text-content-primary font-medium">Mantralaya, Mumbai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Session Status:</span>
              <span className="text-content-primary font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Encrypted & Audited</span>
              </span>
            </div>
          </div>
        </div>

        {/* Role Delegation & Preferences */}
        <div className="lg:col-span-2 bg-surface border border-borderLine-standard rounded-md p-5 space-y-5 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-content-primary block">
              Active Administrative Role Delegation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setUserRole('dg_admin')}
                className={`p-3 rounded border text-left transition-colors ${
                  userRole === 'dg_admin'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface-secondary text-content-primary border-borderLine-standard hover:bg-surface-selected'
                }`}
              >
                <div className="font-bold">DG State Admin</div>
                <div className="text-[10px] opacity-80 mt-1">State-wide full command & authorization</div>
              </button>

              <button
                onClick={() => setUserRole('collector')}
                className={`p-3 rounded border text-left transition-colors ${
                  userRole === 'collector'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface-secondary text-content-primary border-borderLine-standard hover:bg-surface-selected'
                }`}
              >
                <div className="font-bold">District Collector / DM</div>
                <div className="text-[10px] opacity-80 mt-1">District level verification & crisis rebuttals</div>
              </button>

              <button
                onClick={() => setUserRole('dio_desk')}
                className={`p-3 rounded border text-left transition-colors ${
                  userRole === 'dio_desk'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface-secondary text-content-primary border-borderLine-standard hover:bg-surface-selected'
                }`}
              >
                <div className="font-bold">DIO Desk Operator</div>
                <div className="text-[10px] opacity-80 mt-1">Local news scanning & dispatch entry</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-content-primary block">Portal Language</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded font-medium border ${
                  language === 'en'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface text-content-primary border-borderLine-standard'
                }`}
              >
                English (Default)
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-3 py-1.5 rounded font-medium border ${
                  language === 'mr'
                    ? 'bg-action-primary text-content-inverse border-borderLine-strong'
                    : 'bg-surface text-content-primary border-borderLine-standard'
                }`}
              >
                मराठी (State Official Language)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-borderLine-subtle flex justify-end">
            <button
              onClick={() => alert('Profile settings saved successfully')}
              className="px-4 py-2 bg-action-primary text-content-inverse rounded font-semibold hover:bg-action-primary-hover"
            >
              Save Officer Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
