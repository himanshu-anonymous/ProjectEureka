'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { UserRole } from '@/types/dashboard';
import { GovEmblem } from '@/components/shared/GovEmblem';

interface RoleOption {
  key: UserRole;
  username: string;
  title: string;
  officer: string;
  scope: string;
  badge: string;
  icon: 'verified_user' | 'how_to_reg' | 'layers' | 'person';
}

const ROLES: RoleOption[] = [
  {
    key: 'director_konkan',
    username: 'director_konkan',
    title: 'Divisional Director',
    officer: 'Rudresh Kumar Sawant (Dy. Dir)',
    scope: 'Konkan Division (5 Districts)',
    badge: 'Division Scope',
    icon: 'layers',
  },
  {
    key: 'collector',
    username: 'collector_palghar',
    title: 'District Collector (Palghar)',
    officer: 'Vikram S. Mahajan, IAS (DM)',
    scope: 'Palghar District (Auth Rights)',
    badge: 'Collector Clearance',
    icon: 'how_to_reg',
  },
  {
    key: 'collector',
    username: 'collector_thane',
    title: 'District Collector (Thane)',
    officer: 'Nilesh R. Kelkar, IAS (DM)',
    scope: 'Thane District (#1 Ranked)',
    badge: 'Collector Clearance',
    icon: 'how_to_reg',
  },
  {
    key: 'dio_desk',
    username: 'operator_konkan',
    title: 'DIO Operator (Konkan)',
    officer: 'Mandar S. Nerurkar (DIO Desk)',
    scope: 'Konkan Desk (Read/Draft)',
    badge: 'Operator Clearance',
    icon: 'person',
  },
  {
    key: 'dg_admin',
    username: 'admin',
    title: 'State DG Observer',
    officer: 'Dr. Arvind M. Gokhale (DG)',
    scope: 'State HQ Observer',
    badge: 'State Observer',
    icon: 'verified_user',
  },
];

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useDashboardStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('director_konkan');
  const [username, setUsername] = useState('director_konkan');
  const [pin, setPin] = useState('8842');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectRole = (role: RoleOption) => {
    setSelectedRole(role.key);
    setUsername(role.username);
    setPin('8842');
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, pin }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        login(data.user);
        router.push('/');
      } else {
        setErrorMessage(data.message || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRoleData = ROLES.find((r) => r.key === selectedRole) || ROLES[0];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Emblem & Official Government Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <GovEmblem size="lg" />
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              महाराष्ट्र शासन • Government of Maharashtra
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gov-primary tracking-tight mt-0.5">
              Maha-Command Center Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              DGIPR Unified State Communications & Crisis Monitoring Gateway
            </p>
          </div>
        </div>

        {/* 4-Role Persona Selector */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 px-0.5">
            <span>Select Officer Role Persona:</span>
            <span className="text-[11px] text-amber-700 font-normal">Single-click Demo Auth</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-gov-primary bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <MaterialIcon
                      name={role.icon}
                      size="xs"
                      className={isSelected ? 'text-amber-400' : 'text-slate-500'}
                    />
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {role.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold mt-1.5 leading-tight">{role.title}</div>
                  <div
                    className={`text-[10px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {role.officer}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs flex items-center gap-2">
              <MaterialIcon name="warning" size="xs" className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">
              Officer Official ID / Username
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={username}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-800 font-bold focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                {activeRoleData.scope}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-800">सुरक्षा पिन / Security PIN</label>
              <span className="text-[10px] text-slate-400 font-mono">Demo: 8842</span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue/20 focus:border-gov-blue font-bold tracking-widest"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-md border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <MaterialIcon name="lock" size="sm" className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              Authorized Government Personnel Only. Operation clearances: <strong>{activeRoleData.scope}</strong>.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gov-accent hover:bg-gov-accent-dark disabled:opacity-60 text-white rounded-md text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <span>Authenticating Officer...</span>
            ) : (
              <>
                <span>Authenticate & Access Command Center</span>
                <MaterialIcon name="arrow_forward" size="sm" />
              </>
            )}
          </button>
        </form>

        <div className="pt-1 text-center text-[10px] font-mono text-slate-400">
          State Information Operations • NIC / DGIPR Gateway • SSL Secured
        </div>
      </div>
    </div>
  );
};
