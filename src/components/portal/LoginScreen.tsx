'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { ShieldCheck, UserCheck, ArrowRight, Lock } from 'lucide-react';
import { UserRole } from '@/types/dashboard';
import { GovEmblem } from '@/components/shared/GovEmblem';

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-300 border-t-4 border-t-gov-accent rounded-xl p-6 sm:p-8 space-y-6 shadow-lg">
        {/* Emblem & Official Government Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <GovEmblem size="lg" />
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              महाराष्ट्र शासन • Government of Maharashtra
            </div>
            <h2 className="text-lg font-bold text-gov-primary tracking-tight mt-0.5">
              Maha-Command Center Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              DGIPR Unified State Communications & Crisis Monitoring Gateway
            </p>
          </div>
        </div>

        {/* Role Segment Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('dg_admin')}
            className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'dg_admin'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-gov-primary hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>State DG Admin</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('collector')}
            className={`py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'collector'
                ? 'bg-gov-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-gov-primary hover:bg-slate-200/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>District Collector</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">
              {selectedRole === 'dg_admin' ? 'State Officer Official ID' : 'DM / Collector Credential ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={selectedRole === 'dg_admin' ? 'MH-DGIPR-ADMIN-01' : 'PUNE-COLLECTOR-DM-04'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-800 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-800">सुरक्षा पिन / Security OTP</label>
              <span className="text-[10px] text-slate-400 font-mono">Demo: 8842</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-md border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Authorized Government Personnel Only. Sessions are encrypted and monitored under State IT Security & DGIPR Protocols.
            </span>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gov-accent hover:bg-gov-accent-dark text-white rounded-md text-xs font-bold transition-colors shadow-sm"
          >
            <span>Authenticate & Access Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] font-mono text-slate-400">
          State Information Operations • NIC / DGIPR Gateway • SSL Secured
        </div>
      </div>
    </div>
  );
};
