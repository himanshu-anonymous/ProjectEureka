'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardStore } from '@/stores/dashboardStore';
import { RefreshCw } from 'lucide-react';
import { UserRole } from '@/types/dashboard';
import { GovEmblem } from '@/components/shared/GovEmblem';
import { useTranslation } from '@/lib/translations';

export const Header: React.FC = () => {
  const { userRole, setUserRole, language, setLanguage } = useDashboardStore();
  const t = useTranslation(language);

  return (
    <header className="h-14 bg-gov-primary border-b-2 border-gov-accent px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
      {/* Left Identity — Government Seal & Directorate Branding */}
      <Link href="/" className="flex items-center gap-3 group">
        <GovEmblem size="md" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
              {t.header.title}
            </h1>
            <span className="text-[11px] font-medium text-amber-400/90 border-l border-white/20 pl-2 hidden md:inline">
              {t.header.subGov}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-300 hidden sm:block">
            {t.header.tagline}
          </p>
        </div>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* Live Data Sync Pulse */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300 bg-white/10 px-2.5 py-1 rounded border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-slate-300 font-medium">{t.header.telemetry}</span>
          <span className="font-mono text-white text-[11px] font-semibold">14:32 IST</span>
        </div>

        {/* Manual Refresh Action */}
        <button
          onClick={() => {}}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/25 rounded text-white hover:bg-white/10 transition-colors shadow-xs"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline font-medium">{t.header.refresh}</span>
        </button>

        {/* Role Selector */}
        <div className="flex items-center">
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="px-2.5 py-1.5 bg-[#0F1D35] border border-white/25 rounded text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer font-medium"
          >
            <option value="dg_admin">{t.header.roleAdmin}</option>
            <option value="collector">{t.header.roleCollector}</option>
            <option value="dio_desk">{t.header.roleDio}</option>
          </select>
        </div>

        {/* Tri-Lingual Language Selector (EN / मराठी / हिन्दी) */}
        <div className="flex items-center border border-white/25 rounded overflow-hidden">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-semibold transition-colors ${
              language === 'en'
                ? 'bg-gov-accent text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-2 py-1 text-xs font-semibold transition-colors ${
              language === 'mr'
                ? 'bg-gov-accent text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
            title="मराठी (Marathi)"
          >
            मराठी
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 text-xs font-semibold transition-colors ${
              language === 'hi'
                ? 'bg-gov-accent text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
            title="हिन्दी (Hindi)"
          >
            हिन्दी
          </button>
        </div>

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 border-l border-white/20 hover:opacity-90 transition-opacity"
          title="Open Officer Profile"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-white border border-amber-300/40 flex items-center justify-center font-bold text-xs shadow-xs">
            AS
          </div>
          <span className="font-semibold text-white hidden xl:inline text-xs">Admin</span>
        </Link>
      </div>
    </header>
  );
};
