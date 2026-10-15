'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { UserRole } from '@/types/dashboard';
import { GovEmblem } from '@/components/shared/GovEmblem';
import { useTranslation } from '@/lib/translations';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    userRole,
    setUserRole,
    currentUser,
    logout,
    language,
    setLanguage,
    mobileMenuOpen,
    setMobileMenuOpen,
    fetchAllData,
  } = useDashboardStore();
  const t = useTranslation(language);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const displayName = currentUser
    ? language === 'mr'
      ? currentUser.marathiName
      : currentUser.name
    : 'Dr. Arvind M. Gokhale';

  const displayInitials = currentUser?.avatarInitials || 'AG';

  return (
    <header className="h-14 bg-gov-primary border-b border-slate-800/50 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
      {/* Left Identity — Mobile Hamburger + Government Seal & Directorate Branding */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded text-white hover:bg-white/10 md:hidden transition-colors cursor-pointer"
          aria-label="Toggle navigation drawer"
          title="Toggle Navigation Menu"
        >
          <MaterialIcon name="menu" size="md" className="text-amber-400" />
        </button>

        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <GovEmblem size="md" />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-base font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {t.header.title}
              </h1>
              <span className="text-[10px] sm:text-[11px] font-medium text-amber-400/90 border-l border-white/20 pl-1.5 sm:pl-2 hidden md:inline">
                {t.header.subGov}
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-300 hidden sm:block">
              {t.header.tagline}
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* Live Data Sync Telemetry Dot */}
        <div className="hidden lg:flex items-center gap-2 text-slate-300 bg-white/10 px-2.5 py-1 rounded border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="text-[11px] text-slate-300 font-medium">{t.header.telemetry}</span>
          <span className="font-mono text-white text-[11px] font-semibold">Live API Sync</span>
        </div>

        {/* Manual Refresh Action */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 border border-white/25 rounded text-white hover:bg-white/10 transition-colors shadow-xs cursor-pointer"
          title="Refresh Operations Data via API"
        >
          <MaterialIcon name="refresh" size="sm" spin={isRefreshing} className="text-amber-400" />
          <span className="hidden sm:inline font-medium">{t.header.refresh}</span>
        </button>

        {/* Role Selector / Identity Indicator */}
        <div className="flex items-center">
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="px-2.5 py-1.5 bg-[#0F1D35] border border-white/25 rounded text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer font-medium"
            title="Switch Officer Role for Simulation"
          >
            <option value="dg_admin">State DG Admin (All MH)</option>
            <option value="director_konkan">Divisional Director (Konkan)</option>
            <option value="collector">District Collector (Palghar)</option>
            <option value="dio_desk">DIO Operator 1 (Palghar Desk)</option>
          </select>
        </div>

        {/* Bi-Lingual Language Selector (EN / मराठी) */}
        <div className="flex items-center border border-white/25 rounded overflow-hidden">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-semibold transition-colors cursor-pointer ${
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
            className={`px-2 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              language === 'mr'
                ? 'bg-gov-accent text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
            title="मराठी (Marathi)"
          >
            मराठी
          </button>
        </div>

        {/* User Profile & Logout Action */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/20">
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            title={`Logged in as ${displayName}`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-white border border-amber-300/40 flex items-center justify-center font-bold text-xs shadow-xs">
              {displayInitials}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-semibold text-white text-xs leading-tight truncate max-w-[130px]">
                {displayName}
              </span>
              <span className="text-[10px] text-amber-300/90 font-mono">
                {userRole === 'dg_admin'
                  ? 'State Admin'
                  : userRole === 'director_konkan'
                  ? 'Konkan Dir'
                  : userRole === 'collector'
                  ? 'Collector'
                  : 'DIO Desk'}
              </span>
            </div>
          </Link>

          {/* Quick Sign Out Action */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out / Security Logout"
            aria-label="Logout"
          >
            <MaterialIcon name="vpn_key" size="sm" />
          </button>
        </div>
      </div>
    </header>
  );
};
