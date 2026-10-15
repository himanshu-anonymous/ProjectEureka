'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    language,
    mobileMenuOpen,
    setMobileMenuOpen,
    isAuthenticated,
    logout,
  } = useDashboardStore();
  const t = useTranslation(language);

  interface NavItem {
    href: string;
    label: string;
    icon: MaterialIconName;
    isLogout?: boolean;
  }

  const portalScreens: NavItem[] = [
    { href: '/', label: t.sidebar.dashboard, icon: 'dashboard' },
    { href: '/command-center', label: t.sidebar.commandCenter, icon: 'podcasts' },
    { href: '/districts', label: t.sidebar.districts, icon: 'location_on' },
    { href: '/press-releases', label: t.sidebar.pressReleases, icon: 'description' },
    { href: '/media', label: t.sidebar.media, icon: 'layers' },
    { href: '/activities', label: t.sidebar.activities, icon: 'calendar_today' },
    { href: '/crisis', label: t.sidebar.crisis, icon: 'gpp_bad' },
    { href: '/reports', label: t.sidebar.reports, icon: 'bar_chart' },
    { href: '/notifications', label: t.sidebar.notifications, icon: 'notifications' },
    { href: '/profile', label: t.sidebar.profile, icon: 'person' },
    isAuthenticated
      ? { href: '/login', label: 'Sign Out / Logout', icon: 'vpn_key', isLogout: true }
      : { href: '/login', label: t.sidebar.login, icon: 'vpn_key' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar: Drawer on Mobile, Rail/Expanded on Desktop */}
      <aside
        className={`bg-[#1E293B] border-r border-slate-800 flex flex-col z-50 select-none shadow-md transition-all duration-200 ${
          /* Mobile styles: fixed drawer */
          mobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-64 flex'
            : 'fixed inset-y-0 left-0 w-64 -translate-x-full md:translate-x-0 md:static flex'
        } ${
          /* Desktop width when not in drawer mode */
          sidebarCollapsed ? 'md:w-16' : 'md:w-56'
        }`}
      >
        {/* Sidebar Header */}
        <div className="py-2.5 px-3 border-b border-slate-800/80 bg-[#16202E] flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {!sidebarCollapsed || mobileMenuOpen ? t.sidebar.title : 'MH'}
          </span>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
            aria-label="Close navigation drawer"
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-2.5 px-2 space-y-1 overflow-y-auto">
          {portalScreens.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={async () => {
                  setMobileMenuOpen(false);
                  if (item.isLogout) {
                    await logout();
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-all ${
                  isActive
                    ? 'bg-gov-accent text-white font-bold shadow-xs border-l-3 border-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={sidebarCollapsed && !mobileMenuOpen ? item.label : undefined}
              >
                <MaterialIcon
                  name={item.icon}
                  size="sm"
                  className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Collapse Action */}
        <div className="hidden md:block p-2 border-t border-slate-800/80 bg-[#16202E]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <MaterialIcon name="chevron_right" size="sm" className="mx-auto text-amber-400" />
            ) : (
              <>
                <MaterialIcon name="chevron_left" size="sm" className="text-amber-400" />
                <span className="font-medium">{t.sidebar.collapse}</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
