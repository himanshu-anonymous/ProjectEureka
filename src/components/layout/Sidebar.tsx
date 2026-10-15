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
    selectedDistrictId,
    setSelectedDistrictId,
    setSearchDistrict,
  } = useDashboardStore();
  const t = useTranslation(language);

  // By default, collapse menus are collapsed
  const [districtsParentOpen, setDistrictsParentOpen] = React.useState<boolean>(false);
  const [expandedDistrictId, setExpandedDistrictId] = React.useState<string | null>(null);

  const isCommandCenterRoute = pathname.startsWith('/command-center');
  const [commandCenterParentOpen, setCommandCenterParentOpen] = React.useState<boolean>(false);

  interface KonkanDistrictItem {
    id: string;
    name: string;
    nameMr: string;
    rank: number;
    cpi: number;
    crisisCount: number;
  }

  const KONKAN_DISTRICT_LIST: KonkanDistrictItem[] = [
    { id: 'thane', name: 'Thane', nameMr: 'ठाणे', rank: 1, cpi: 96.75, crisisCount: 0 },
    { id: 'raigad', name: 'Raigad', nameMr: 'रायगड', rank: 2, cpi: 92.4, crisisCount: 1 },
    { id: 'palghar', name: 'Palghar', nameMr: 'पालघर', rank: 3, cpi: 89.15, crisisCount: 1 },
    { id: 'ratnagiri', name: 'Ratnagiri', nameMr: 'रत्नागिरी', rank: 4, cpi: 86.8, crisisCount: 1 },
    { id: 'sindhudurg', name: 'Sindhudurg', nameMr: 'सिंधुदुर्ग', rank: 5, cpi: 84.92, crisisCount: 0 },
  ];

  interface NavItem {
    href: string;
    label: string;
    icon: MaterialIconName;
    isLogout?: boolean;
  }

  const topScreens: NavItem[] = [
    { href: '/', label: t.sidebar.dashboard, icon: 'dashboard' },
  ];

  const commandCenterSubPages = [
    {
      href: '/command-center',
      label: language === 'mr' ? 'दूरमिती ऑपरेशन्स' : 'Telemetry Operations',
      icon: 'podcasts' as MaterialIconName,
    },
    {
      href: '/command-center/raw-ingestion',
      label: language === 'mr' ? 'कच्चा डेटा अंतर्ग्रहण' : 'Raw Ingestion',
      icon: 'dns' as MaterialIconName,
    },
    {
      href: '/command-center/pipeline-flow',
      label: language === 'mr' ? 'पाइपलाइन व डेटा प्रवाह' : 'Pipeline & Ops Flow',
      icon: 'layers' as MaterialIconName,
    },
  ];

  const bottomScreens: NavItem[] = [
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

  const handleDistrictSelect = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId);
    setSearchDistrict(districtName);
    setExpandedDistrictId(expandedDistrictId === districtId ? null : districtId);
  };

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
          mobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-64 flex'
            : 'fixed inset-y-0 left-0 w-64 -translate-x-full md:translate-x-0 md:static flex'
        } ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-60'
        }`}
      >
        {/* Sidebar Header with Fixed Top Collapse Toggle */}
        <div className="py-2.5 px-3 border-b border-slate-800/80 bg-[#16202E] flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
            {!sidebarCollapsed || mobileMenuOpen ? (language === 'mr' ? 'कोकण विभाग' : 'Konkan Division') : 'KD'}
          </span>

          {/* Desktop Fixed Collapse Toggle Button at the top */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1 rounded text-amber-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            aria-label="Toggle Sidebar Collapse"
          >
            <MaterialIcon name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'} size="sm" />
          </button>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
            aria-label="Close navigation drawer"
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-2.5 px-2 space-y-1 overflow-y-auto">
          {/* Top general links */}
          {topScreens.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
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

          {/* COMMAND CENTRE AS PARENT ACCORDION / DROPDOWN */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => {
                if (sidebarCollapsed && !mobileMenuOpen) {
                  setSidebarCollapsed(false);
                  setCommandCenterParentOpen(true);
                } else {
                  setCommandCenterParentOpen(!commandCenterParentOpen);
                }
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs transition-all cursor-pointer ${
                isCommandCenterRoute
                  ? 'bg-slate-800 text-amber-300 font-bold border-l-3 border-amber-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={
                sidebarCollapsed && !mobileMenuOpen
                  ? language === 'mr'
                    ? 'कमांड सेंटर'
                    : 'Command Centre'
                  : undefined
              }
            >
              <div className="flex items-center gap-2.5 truncate">
                <MaterialIcon name="podcasts" size="sm" className="text-amber-400 shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate font-semibold">
                    {language === 'mr' ? 'कमांड सेंटर (Command Centre)' : 'Command Centre'}
                  </span>
                )}
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <MaterialIcon
                  name={commandCenterParentOpen ? 'expand_less' : 'expand_more'}
                  size="xs"
                  className="text-slate-400 shrink-0"
                />
              )}
            </button>

            {/* Nested Command Centre Dropdown Items */}
            {commandCenterParentOpen && (!sidebarCollapsed || mobileMenuOpen) && (
              <div className="mt-1 pl-3 pr-1 space-y-1 border-l-2 border-amber-500/50 ml-3">
                {commandCenterSubPages.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] transition-colors ${
                        isSubActive
                          ? 'bg-amber-400 text-slate-900 font-bold shadow-2xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <MaterialIcon
                        name={sub.icon}
                        size="xs"
                        className={isSubActive ? 'text-slate-900' : 'text-slate-400'}
                      />
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* DISTRICTS AS PARENT ACCORDION / DROPDOWN */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                if (sidebarCollapsed && !mobileMenuOpen) {
                  setSidebarCollapsed(false);
                  setDistrictsParentOpen(true);
                } else {
                  setDistrictsParentOpen(!districtsParentOpen);
                }
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs transition-all cursor-pointer ${
                pathname === '/districts'
                  ? 'bg-slate-800/90 text-amber-300 font-bold border-l-3 border-amber-400'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
              title={sidebarCollapsed && !mobileMenuOpen ? 'Districts (५ जिल्हे)' : undefined}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MaterialIcon name="location_on" size="sm" className="text-amber-400 shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate font-semibold">
                    {language === 'mr' ? 'जिल्हे व कार्यालये (५)' : 'Districts (5 Konkan)'}
                  </span>
                )}
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <MaterialIcon
                  name={districtsParentOpen ? 'expand_less' : 'expand_more'}
                  size="xs"
                  className="text-slate-400 shrink-0"
                />
              )}
            </button>

            {/* Nested Districts Dropdown */}
            {districtsParentOpen && (!sidebarCollapsed || mobileMenuOpen) && (
              <div className="mt-1 pl-3 pr-1 space-y-1 border-l-2 border-slate-700/60 ml-3">
                {KONKAN_DISTRICT_LIST.map((dist) => {
                  const isDistrictActive = selectedDistrictId === dist.id;
                  const isExpanded = expandedDistrictId === dist.id;

                  return (
                    <div key={dist.id} className="rounded-md bg-slate-900/40 border border-slate-800/60 overflow-hidden">
                      {/* District Title Button */}
                      <button
                        type="button"
                        onClick={() => handleDistrictSelect(dist.id, dist.name)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 text-[11px] transition-colors cursor-pointer ${
                          isDistrictActive
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full ${isDistrictActive ? 'bg-amber-400' : 'bg-slate-500'}`} />
                          <span className="truncate">{language === 'mr' ? dist.nameMr : dist.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {dist.crisisCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-rose-600/90 text-white text-[9px] font-bold flex items-center justify-center">
                              {dist.crisisCount}
                            </span>
                          )}
                          <MaterialIcon
                            name={isExpanded ? 'expand_less' : 'expand_more'}
                            size="xs"
                            className="text-slate-400"
                          />
                        </div>
                      </button>

                      {/* District Submenu: Info & Crisis */}
                      {isExpanded && (
                        <div className="bg-slate-950/70 py-1 px-2 border-t border-slate-800/80 space-y-0.5 text-[11px]">
                          {/* 1. District Info Link */}
                          <Link
                            href="/districts"
                            onClick={() => {
                              setSelectedDistrictId(dist.id);
                              setSearchDistrict(dist.name);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-between py-1 px-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <MaterialIcon name="bar_chart" size="xs" className="text-cyan-400" />
                              <span>{language === 'mr' ? 'जिल्हा माहिती व स्कोअर' : 'District Info & Telemetry'}</span>
                            </span>
                            <span className="font-mono text-[10px] text-amber-300 font-bold">{dist.cpi}</span>
                          </Link>

                          {/* 2. District Crisis Desk Link */}
                          <Link
                            href="/crisis"
                            onClick={() => {
                              setSelectedDistrictId(dist.id);
                              setSearchDistrict(dist.name);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center justify-between py-1 px-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <MaterialIcon name="gpp_bad" size="xs" className="text-rose-400" />
                              <span>{language === 'mr' ? 'संकट निवारण कक्ष' : 'Crisis Desk & SLA'}</span>
                            </span>
                            {dist.crisisCount > 0 ? (
                              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                                1 Open
                              </span>
                            ) : (
                              <span className="text-[9px] text-emerald-400 font-semibold font-mono">
                                SLA Met
                              </span>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom general screens */}
          {bottomScreens.map((item) => {
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

        {/* Bottom fixed collapse button */}
        <div className="hidden md:block p-2 border-t border-slate-800/80 bg-[#16202E]">
          <button
            type="button"
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
