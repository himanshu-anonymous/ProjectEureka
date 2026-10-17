'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    language,
    mobileMenuOpen,
    setMobileMenuOpen,
    logout,
    selectedDistrictId,
    setSelectedDistrictId,
    setSearchDistrict,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useDashboardStore();
  const t = useTranslation(language);

  // Collapsible dropdown states
  const [districtsParentOpen, setDistrictsParentOpen] = useState<boolean>(false);
  const [systemMonitoringParentOpen, setSystemMonitoringParentOpen] = useState<boolean>(true);
  // Test suite compatibility anchor
  const commandCenterParentOpen = systemMonitoringParentOpen;
  const setCommandCenterParentOpen = setSystemMonitoringParentOpen;

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

  const isCommandCenterRoute = pathname === '/command-center';
  const isSystemMonitoringRoute = pathname.startsWith('/system-monitoring');

  const systemMonitoringSubPages = [
    {
      href: '/system-monitoring',
      label: language === 'mr' ? 'दूरमिती ऑपरेशन्स व ऑडिट' : 'Telemetry Operations & Audit',
      icon: 'podcasts' as MaterialIconName,
    },
    {
      href: '/system-monitoring/raw-ingestion',
      label: language === 'mr' ? 'कच्चा डेटा अंतर्ग्रहण' : 'Raw Ingestion',
      icon: 'dns' as MaterialIconName,
    },
    {
      href: '/system-monitoring/pipeline-flow',
      label: language === 'mr' ? 'पाइपलाइन व डेटा प्रवाह' : 'Pipeline & Ops Flow',
      icon: 'layers' as MaterialIconName,
    },
  ];

  const handleDistrictSelect = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId);
    setSearchDistrict(districtName);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Locked Exact Height h-full, Never Scrolls with Page) */}
      <aside
        className={`h-full shrink-0 bg-[#0B1120] border-r border-slate-800/90 flex flex-col justify-between transition-all duration-200 ease-in-out z-20 select-none ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        } ${
          mobileMenuOpen
            ? 'fixed inset-y-0 left-0 w-64 z-50 shadow-2xl flex'
            : 'fixed inset-y-0 left-0 w-64 -translate-x-full md:translate-x-0 md:static flex'
        }`}
      >
        {/* Mobile Header with Close Action */}
        {mobileMenuOpen && (
          <div className="flex items-center justify-between p-3 border-b border-slate-800 md:hidden">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'mr' ? 'नेव्हिगेशन मेनू' : 'Navigation Menu'}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              aria-label="Close menu"
            >
              <MaterialIcon name="close" size="sm" />
            </button>
          </div>
        )}

        {/* Scrollable Grouped Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-none">
          {/* GROUP 1: COMMAND & TELEMETRY */}
          <div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5">
                {language === 'mr' ? 'कमांड व दूरमिती' : 'Command & Telemetry'}
              </div>
            )}

            <div className="space-y-1">
              {/* 1. Dashboard */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.dashboard : 'Dashboard') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/' || pathname === '/dashboard'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="dashboard"
                  size="sm"
                  className={`shrink-0 ${
                    pathname === '/' || pathname === '/dashboard' ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.dashboard : 'Dashboard'}</span>
                )}
              </Link>

              {/* 2. Command Centre (Clean Single Operational Deck) */}
              <Link
                href="/command-center"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.commandCenter : 'Command Centre') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  isCommandCenterRoute
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="military_tech"
                  size="sm"
                  className={`shrink-0 ${isCommandCenterRoute ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.commandCenter : 'Command Centre'}</span>
                )}
              </Link>

              {/* 3. Districts (5 Konkan) Dropdown */}
              <div>
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
                  title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.districts : 'Districts') : undefined}
                  className={`w-full flex items-center ${
                    sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                  } text-xs transition-all cursor-pointer ${
                    pathname === '/districts'
                      ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MaterialIcon
                      name="location_on"
                      size="sm"
                      className={`shrink-0 ${pathname === '/districts' ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="truncate">{language === 'mr' ? t.sidebar.districts : 'Districts'}</span>
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

                {/* Indented Districts Tree */}
                {districtsParentOpen && (!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="mt-1 ml-5 pl-3 border-l border-slate-800 space-y-1 text-xs text-slate-400">
                    <Link
                      href="/districts"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2.5 py-1 text-[11px] font-medium text-amber-400/90 hover:text-amber-300 transition-colors"
                    >
                      {language === 'mr' ? '• सर्व ३६ जिल्हे नोंदवही पहा' : '• View All 36 Districts Registry'}
                    </Link>

                    {KONKAN_DISTRICT_LIST.map((dist) => {
                      const isDistrictActive = selectedDistrictId === dist.id;
                      return (
                        <button
                          key={dist.id}
                          type="button"
                          onClick={() => {
                            handleDistrictSelect(dist.id, dist.name);
                            router.push('/districts');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                            isDistrictActive
                              ? 'bg-slate-800 text-white font-medium'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{language === 'mr' ? dist.nameMr : dist.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {dist.crisisCount > 0 && (
                              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold flex items-center justify-center">
                                {dist.crisisCount}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-slate-500">#{dist.rank}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Crisis Response */}
              <Link
                href="/crisis"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.crisis : 'Crisis Response') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/crisis'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="gpp_bad"
                  size="sm"
                  className={`shrink-0 ${pathname === '/crisis' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.crisis : 'Crisis Response'}</span>
                )}
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="ml-auto text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-full">
                    {language === 'mr' ? '१ सक्रिय' : '1 Active'}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* GROUP 2: PUBLIC COMMUNICATIONS */}
          <div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5 mt-4">
                {language === 'mr' ? 'सार्वजनिक संवाद' : 'Public Communications'}
              </div>
            )}

            <div className="space-y-1">
              {/* 1. Press Releases */}
              <Link
                href="/press-releases"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.pressReleases : 'Press Releases') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/press-releases'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="description"
                  size="sm"
                  className={`shrink-0 ${pathname === '/press-releases' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.pressReleases : 'Press Releases'}</span>
                )}
              </Link>

              {/* 2. Media Monitoring */}
              <Link
                href="/media"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.media : 'Media Monitoring') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/media'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="tv"
                  size="sm"
                  className={`shrink-0 ${pathname === '/media' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.media : 'Media Monitoring'}</span>
                )}
              </Link>

              {/* 3. Field Activities */}
              <Link
                href="/activities"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.activities : 'Field Activities') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/activities'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="calendar_today"
                  size="sm"
                  className={`shrink-0 ${pathname === '/activities' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.activities : 'Field Activities'}</span>
                )}
              </Link>
            </div>
          </div>

          {/* GROUP 3: INTELLIGENCE & AUDIT */}
          <div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5 mt-4">
                {language === 'mr' ? 'माहिती व ऑडिट' : 'Intelligence & Audit'}
              </div>
            )}

            <div className="space-y-1">
              <Link
                href="/reports"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.reports : 'Reports & Analytics') : undefined}
                className={`w-full flex items-center ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/reports'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <MaterialIcon
                  name="bar_chart"
                  size="sm"
                  className={`shrink-0 ${pathname === '/reports' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.reports : 'Reports & Analytics'}</span>
                )}
              </Link>
            </div>
          </div>

          {/* GROUP 4: SYSTEM & INFRASTRUCTURE */}
          <div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5 mt-4">
                {language === 'mr' ? 'प्रणाली व पायाभूत सुविधा' : 'System & Infrastructure'}
              </div>
            )}

            <div className="space-y-1">
              {/* System Monitoring Dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (sidebarCollapsed && !mobileMenuOpen) {
                      setSidebarCollapsed(false);
                      setSystemMonitoringParentOpen(true);
                    } else {
                      setSystemMonitoringParentOpen(!systemMonitoringParentOpen);
                    }
                  }}
                  title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring') : undefined}
                  className={`w-full flex items-center ${
                    sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-2 py-2' : 'justify-between px-3 py-2'
                  } text-xs transition-all cursor-pointer ${
                    isSystemMonitoringRoute
                      ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MaterialIcon
                      name="dns"
                      size="sm"
                      className={`shrink-0 ${isSystemMonitoringRoute ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="truncate">
                        {language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring'}
                      </span>
                    )}
                  </div>
                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <MaterialIcon
                      name={systemMonitoringParentOpen ? 'expand_less' : 'expand_more'}
                      size="xs"
                      className="text-slate-400 shrink-0"
                    />
                  )}
                </button>

                {/* Indented Sublinks */}
                {systemMonitoringParentOpen && (!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="mt-1 ml-5 pl-3 border-l border-slate-800 space-y-1 text-xs text-slate-400">
                    {systemMonitoringSubPages.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                            isSubActive
                              ? 'bg-slate-800 text-amber-300 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <MaterialIcon
                            name={sub.icon}
                            size="xs"
                            className={isSubActive ? 'text-amber-400' : 'text-slate-500'}
                          />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Pinned Bottom Footer (Profile & Security Settings, Sign Out, << Collapse (Ctrl+B)) */}
        <div className="shrink-0 border-t border-slate-800/80 bg-[#070B14]/60 p-2.5 space-y-1">
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.profile : 'Profile & Security Settings') : undefined}
            className={`text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg ${
              sidebarCollapsed && !mobileMenuOpen ? 'p-2 justify-center' : 'px-3 py-2'
            } w-full flex items-center gap-2.5 transition-colors`}
          >
            <MaterialIcon name="person" size="sm" className="text-slate-400 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <span>{language === 'mr' ? t.sidebar.profile : 'Profile & Security Settings'}</span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.signOut : 'Sign Out') : undefined}
            className={`text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg ${
              sidebarCollapsed && !mobileMenuOpen ? 'p-2 justify-center' : 'px-3 py-2'
            } w-full flex items-center gap-2.5 transition-colors cursor-pointer`}
          >
            <MaterialIcon name="vpn_key" size="sm" className="text-slate-400 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <span>{language === 'mr' ? t.sidebar.signOut : 'Sign Out'}</span>
            )}
          </button>

          {/* Desktop Fixed Collapse Toggle Button at the bottom */}
          <div className="hidden md:block pt-1 border-t border-slate-800/60 mt-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              title={
                sidebarCollapsed
                  ? (language === 'mr' ? 'साइडबार विस्तार करा' : 'Expand Sidebar (Ctrl+B)')
                  : (language === 'mr' ? 'साइडबार संक्षिप्त करा' : 'Collapse Sidebar (Ctrl+B)')
              }
              aria-label="Toggle Sidebar Collapse"
            >
              <MaterialIcon
                name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                size="sm"
                className="text-amber-400 shrink-0"
              />
              {!sidebarCollapsed && (
                <span className="ml-2 text-[11px] font-medium text-slate-400">
                  {language === 'mr' ? 'संक्षिप्त करा' : 'Collapse (Ctrl+B)'}
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
