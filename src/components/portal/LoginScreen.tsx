'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ShieldCheck, UserCheck, Building, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types/dashboard';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { setUserRole } = useDashboardStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('dg_admin');
  const [pin, setPin] = useState('8842');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(selectedRole);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-borderLine-standard rounded-md p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Emblem & Portal Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded border border-borderLine-standard bg-surface-secondary items-center justify-center font-bold text-sm text-content-primary mb-1">
            MH
          </div>
          <h2 className="text-base font-bold text-content-primary">
            Maha-Command Center Login
          </h2>
          <p className="text-xs text-content-muted">
            DGIPR, Government of Maharashtra • Unified State Portal
          </p>
        </div>

        {/* Role Segment Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary rounded border border-borderLine-subtle">
          <button
            type="button"
            onClick={() => setSelectedRole('dg_admin')}
            className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              selectedRole === 'dg_admin'
                ? 'bg-action-primary text-content-inverse shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>State Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('collector')}
            className={`py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              selectedRole === 'collector'
                ? 'bg-action-primary text-content-inverse shadow-sm'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>District Magistrate</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-content-primary">
              {selectedRole === 'dg_admin' ? 'State Officer ID' : 'DM / Collector Credential'}
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={selectedRole === 'dg_admin' ? 'MH-DGIPR-ADMIN-01' : 'PUNE-COLLECTOR-DM-04'}
                className="w-full px-3 py-2 bg-surface-secondary border border-borderLine-standard rounded font-mono text-content-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-content-primary">Security PIN / OTP</label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full px-3 py-2 bg-surface border border-borderLine-standard rounded font-mono text-content-primary focus:outline-none focus:border-borderLine-strong"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-secondary rounded border border-borderLine-subtle text-[11px] text-content-secondary flex items-start gap-2">
            <Building className="w-4 h-4 text-content-muted shrink-0 mt-0.5" />
            <span>
              Authorized government access only. All operational dispatch sessions are audited under State Information Security protocols.
            </span>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-action-primary text-content-inverse rounded text-xs font-semibold hover:bg-action-primary-hover transition-colors shadow-sm"
          >
            <span>Authenticate & Access Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] font-mono text-content-muted">
          State Information Operations • NIC / DGIPR Gateway
        </div>
      </div>
    </div>
  );
};
