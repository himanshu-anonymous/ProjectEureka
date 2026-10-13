'use client';

import React from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { RefreshCw } from 'lucide-react';
import { UserRole } from '@/types/dashboard';

export const Header: React.FC = () => {
  const { userRole, setUserRole, language, setLanguage } = useDashboardStore();

  return (
    <header className="h-14 bg-surface border-b border-borderLine-standard px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left Identity */}
      <div className="flex items-center gap-3">
        {/* Maharashtra Emblem Silhouette / Government Mark */}
        <div className="w-8 h-8 rounded border border-borderLine-standard bg-surface-secondary flex items-center justify-center font-bold text-xs text-content-primary">
          MH
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-content-primary tracking-tight">
              Maha-Command Center
            </h1>
            <span className="text-xs text-content-muted border-l border-borderLine-standard pl-2 hidden sm:inline">
              DGIPR, Government of Maharashtra
            </span>
          </div>
          <p className="text-[11px] text-content-muted hidden md:block">
            State Information Operations & Crisis Command
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 text-xs">
        {/* Last Data Sync */}
        <div className="hidden lg:flex items-center gap-1.5 text-content-secondary">
          <span className="text-content-muted">Last sync:</span>
          <span className="font-mono text-content-primary">Apr 27, 2025 14:32</span>
        </div>

        {/* Manual Refresh Action */}
        <button
          onClick={() => {}}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-borderLine-standard rounded text-content-primary hover:bg-surface-secondary transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-content-secondary" />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Role Selector */}
        <div className="flex items-center gap-1">
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="px-2.5 py-1.5 bg-surface border border-borderLine-standard rounded text-content-primary focus:outline-none focus:border-borderLine-strong text-xs cursor-pointer font-medium"
          >
            <option value="dg_admin">DG State Admin</option>
            <option value="collector">District Collector</option>
            <option value="dio_desk">DIO Desk</option>
          </select>
        </div>

        {/* Language Selector */}
        <div className="flex items-center border border-borderLine-standard rounded overflow-hidden">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              language === 'en'
                ? 'bg-action-primary text-content-inverse'
                : 'bg-surface text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2 py-1 text-xs font-medium transition-colors ${
              language === 'mr'
                ? 'bg-action-primary text-content-inverse'
                : 'bg-surface text-content-secondary hover:bg-surface-secondary'
            }`}
          >
            मराठी
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-borderLine-subtle">
          <div className="w-7 h-7 rounded-full bg-surface-secondary border border-borderLine-standard flex items-center justify-center font-medium text-xs text-content-primary">
            AS
          </div>
          <span className="font-medium text-content-primary hidden sm:inline">Admin User</span>
        </div>
      </div>
    </header>
  );
};
