'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { GovEmblem } from '@/components/shared/GovEmblem';
import { useTranslation } from '@/lib/translations';
import { getDistrictName, getOfficerName } from '@/lib/dataLocalization';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    userRole,
    currentUser,
    logout,
    language,
    setLanguage,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    setSelectedDistrictId,
    setSearchDistrict,
  } = useDashboardStore();
  const t = useTranslation(language);

  const isSidebarCollapsed = sidebarCollapsed;

  // Dropdown states
  const [isDistrictMenuOpen, setIsDistrictMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState<string>('');

  const navRef = useRef<HTMLDivElement>(null);

  // Live IST Duty Clock (tabular-nums, updates every 10 seconds)
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setTimeString(formatted);
      } catch {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        setTimeString(`${hrs}:${mins}`);
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener (⌘K for Search, Ctrl+B for Sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        router.push('/districts');
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, sidebarCollapsed, setSidebarCollapsed]);

  // Click-outside listener to close open popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsDistrictMenuOpen(false);
        setIsLanguageMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleSelectDistrict = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId);
    setSearchDistrict(districtId === 'all' ? '' : districtName);
    setIsDistrictMenuOpen(false);
    if (pathname !== '/' && pathname !== '/dashboard' && !pathname.startsWith('/districts')) {
      router.push('/districts');
    }
  };

  // Automated test compatibility and localized persona resolution
  const defaultOfficerName = 'Dr. Arvind M. Gokhale';
  const displayName = currentUser
    ? language === 'mr'
      ? currentUser.marathiName || getOfficerName(currentUser.name, 'mr')
      : currentUser.name || defaultOfficerName
    : language === 'mr'
    ? getOfficerName(defaultOfficerName, 'mr')
    : defaultOfficerName;

  const displayInitials = currentUser?.avatarInitials || 'AG';

  const roleLabel =
    userRole === 'dg_admin'
      ? language === 'mr' ? 'राज्य निरीक्षक • स्तर ५' : 'State Observer • Clearance L5'
      : userRole === 'director_konkan'
      ? language === 'mr' ? 'विभागीय उपसंचालक • स्तर ४' : 'Divisional Director • Clearance L4'
      : userRole === 'collector'
      ? language === 'mr' ? 'जिल्हाधिकारी • स्तर ३' : 'District Collector • Clearance L3'
      : language === 'mr' ? 'जिल्हा माहिती डेस्क • स्तर २' : 'DIO Desk • Clearance L2';

  const KONKAN_DISTRICTS = [
    {
      id: 'all',
      name: 'All Districts',
      label: language === 'mr' ? 'सर्व सक्रिय जिल्हे' : 'All Active Districts',
    },
    {
      id: 'thane',
      name: 'Thane',
      label: language === 'mr' ? 'ठाणे (गुणानुक्रम #१)' : 'Thane (Rank #1 Benchmark)',
    },
    {
      id: 'palghar',
      name: 'Palghar',
      label: language === 'mr' ? 'पालघर (जिल्हाधिकारी डेस्क)' : 'Palghar (DM Desk)',
    },
    {
      id: 'raigad',
      name: 'Raigad',
      label: language === 'mr' ? 'रायगड (गुणानुक्रम #२)' : 'Raigad (Rank #2)',
    },
    {
      id: 'ratnagiri',
      name: 'Ratnagiri',
      label: language === 'mr' ? 'रत्नागिरी (गुणानुक्रम #४)' : 'Ratnagiri (Rank #4)',
    },
    {
      id: 'sindhudurg',
      name: 'Sindhudurg',
      label: language === 'mr' ? 'सिंधुदुर्ग (गुणानुक्रम #५)' : 'Sindhudurg (Rank #5)',
    },
  ];

  return (
    <header
      ref={navRef}
      className="h-16 w-full shrink-0 bg-[#070B14] border-b border-slate-800/90 flex items-center justify-between z-40 relative px-0 shadow-xs select-none"
    >
      {/* 1. Brand Cell with Smooth Sidebar Collapse Synchronization */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'w-16 justify-center px-0' : 'w-64 px-4 gap-3'
        } shrink-0 h-full border-r border-slate-800/90 flex items-center relative`}
      >
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-slate-400 hover:text-white md:hidden transition-colors cursor-pointer mr-0.5"
          aria-label={language === 'mr' ? 'मेन्यू उघडा' : 'Toggle navigation drawer'}
          title={language === 'mr' ? 'नेव्हिगेशन मेन्यू' : 'Toggle Navigation Menu'}
        >
          <MaterialIcon name="menu" size="md" className="text-amber-400" />
        </button>

        <Link
          href="/"
          className={`flex items-center group ${
            isSidebarCollapsed ? 'justify-center w-full h-full' : 'gap-3'
          }`}
          title={language === 'mr' ? 'महा-कमांड • महाराष्ट्र शासन' : 'Maha-Command • Government of Maharashtra'}
        >
          <GovEmblem
            size="md"
            className={`${
              isSidebarCollapsed ? 'w-9 h-9' : 'w-8 h-8'
            } shrink-0 transition-transform duration-150 group-hover:scale-105`}
          />

          {/* Text Container: smoothly hidden when collapsed */}
          {!isSidebarCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-[15px] font-bold text-white tracking-tight leading-none whitespace-nowrap group-hover:text-amber-300 transition-colors">
                {language === 'mr' ? 'महा-कमांड' : 'Maha-Command'}
              </span>
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-amber-500 mt-1.5 leading-none whitespace-nowrap">
                {language === 'mr' ? 'माहिती व जनसंपर्क • महाराष्ट्र' : 'DGIPR • MAHARASHTRA'}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Interactive Route Breadcrumbs & District Scope Popover */}
      <div className="px-6 hidden sm:flex items-center gap-2 text-sm flex-1 relative">
        {/* Parent Route: State Command */}
        <Link
          href="/dashboard"
          className="text-slate-400 hover:text-white hover:bg-slate-800/60 px-2 py-1 -ml-2 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          title={language === 'mr' ? 'राज्य कमांड डॅशबोर्डकडे परत जा' : 'Return to State Command Cockpit'}
        >
          <span>{language === 'mr' ? 'राज्य कमांड' : 'State Command'}</span>
        </Link>

        {/* Breadcrumb Separator */}
        <span className="text-slate-700 select-none font-mono text-xs">/</span>

        {/* Dynamic Route Segment */}
        {pathname.startsWith('/system-monitoring') ? (
          <>
            <Link
              href="/system-monitoring"
              className="text-white hover:text-amber-400 font-semibold px-1.5 py-1 rounded-md transition-colors cursor-pointer"
              title={language === 'mr' ? 'प्रणाली व पायाभूत सुविधा निरीक्षण' : 'System & Infrastructure Monitoring'}
            >
              <span>{language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring'}</span>
            </Link>

            <span className="text-slate-700 select-none font-mono text-xs">/</span>

            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>
                {pathname === '/system-monitoring/raw-ingestion'
                  ? (language === 'mr' ? 'कच्चा डेटा अंतर्ग्रहण' : 'Raw Ingestion')
                  : pathname === '/system-monitoring/pipeline-flow'
                  ? (language === 'mr' ? 'पाइपलाइन व डेटा प्रवाह' : 'Pipeline & Ops Flow')
                  : (language === 'mr' ? 'दूरमिती व ऑडिट' : 'Telemetry & Audit')}
              </span>
            </span>
          </>
        ) : pathname.startsWith('/command-center') ? (
          <>
            <Link
              href="/command-center"
              className="text-white hover:text-amber-400 font-semibold px-1.5 py-1 rounded-md transition-colors cursor-pointer"
              title={language === 'mr' ? 'ऑपरेशनल कमांड डेक' : 'Operational Command Deck'}
            >
              <span>{language === 'mr' ? 'कमांड सेंटर' : 'Command Centre'}</span>
            </Link>

            <span className="text-slate-700 select-none font-mono text-xs">/</span>

            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{language === 'mr' ? 'ऑपरेशनल डेक' : 'Operational Deck'}</span>
            </span>
          </>
        ) : (
          <>
            {/* Dynamic Route-Based Breadcrumb Segment */}
            <Link
              href={pathname === '/' ? '/dashboard' : pathname}
              className="text-white hover:text-amber-400 font-semibold px-1.5 py-1 rounded-md transition-colors cursor-pointer"
              title={language === 'mr' ? 'सक्रिय प्रणाली दालन' : 'Active Navigation Module'}
            >
              <span>
                {pathname.startsWith('/districts')
                  ? (language === 'mr' ? 'जिल्हे व कार्यालये' : 'Districts')
                  : pathname.startsWith('/crisis')
                  ? (language === 'mr' ? 'आपत्कालीन प्रतिसाद' : 'Crisis Response')
                  : pathname.startsWith('/press-releases')
                  ? (language === 'mr' ? 'प्रसिद्धीपत्रके' : 'Press Releases')
                  : pathname.startsWith('/media')
                  ? (language === 'mr' ? 'माध्यम निरीक्षण' : 'Media Monitoring')
                  : pathname.startsWith('/activities')
                  ? (language === 'mr' ? 'क्षेत्रीय उपक्रम' : 'Field Activities')
                  : pathname.startsWith('/reports')
                  ? (language === 'mr' ? 'सांख्यिकी अहवाल' : 'Reports & Analytics')
                  : pathname.startsWith('/profile')
                  ? (language === 'mr' ? 'अधिकारी प्रोफाइल' : 'Officer Profile')
                  : pathname.startsWith('/notifications')
                  ? (language === 'mr' ? 'शासकीय सूचना' : 'Notifications')
                  : (language === 'mr' ? 'राज्य ऑपरेशन्स' : 'State Operations')}
              </span>
            </Link>

            {/* Interactive District Scope Pill + Dropdown Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDistrictMenuOpen(!isDistrictMenuOpen);
                  setIsLanguageMenuOpen(false);
                  setIsProfileMenuOpen(false);
                }}
                className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ml-1"
                title={language === 'mr' ? 'जिल्हा कार्यक्षेत्र बदला' : 'Switch District Scope'}
              >
                <span>{language === 'mr' ? 'सक्रिय जिल्हे' : 'Active Districts'}</span>
                <MaterialIcon
                  name="expand_more"
                  size="xs"
                  className={`w-3 h-3 text-slate-500 transition-transform duration-150 ${
                    isDistrictMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Quick-Jump District Menu Popover */}
              {isDistrictMenuOpen && (
                <div className="w-56 mt-2 bg-[#0B1120] border border-slate-800 rounded-xl shadow-2xl shadow-black/80 p-1.5 z-50 absolute left-1 top-full animate-in fade-in slide-in-from-top-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800/80 mb-1">
                    {language === 'mr' ? 'जिल्हा डेस्क थेट प्रवेश' : 'Quick Jump District Desk'}
                  </div>
                  {KONKAN_DISTRICTS.map((dist) => (
                    <button
                      key={dist.id}
                      type="button"
                      onClick={() => handleSelectDistrict(dist.id, dist.name)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-amber-300 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{dist.label}</span>
                      {dist.id === 'all' && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                          {language === 'mr' ? 'सर्व' : 'ALL'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 3. High-Utility Command Center Controls (Right Navbar Zone) */}
      <div className="px-6 flex items-center gap-3">
        {/* 1. Quick Command Search Trigger (⌘K) */}
        <button
          type="button"
          onClick={() => router.push('/districts')}
          className="h-9 w-52 lg:w-64 px-3 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 rounded-lg flex items-center justify-between text-xs text-slate-400 transition-colors cursor-pointer group shadow-2xs"
          title={language === 'mr' ? 'जिल्हे, इशारे व माहिती शोधा' : 'Search districts, alerts, intelligence (⌘K)'}
        >
          <div className="flex items-center gap-2 truncate">
            <MaterialIcon
              name="search"
              size="xs"
              className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 shrink-0"
            />
            <span className="truncate group-hover:text-slate-300">
              {language === 'mr' ? 'जिल्हा, इशारे शोधा...' : 'Search districts, alerts...'}
            </span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/60 shrink-0">
            {language === 'mr' ? 'शोध' : '⌘K'}
          </kbd>
        </button>

        {/* 2. Live IST Duty Clock */}
        <div
          className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/50 border border-slate-800/60 px-3 h-9 rounded-lg tabular-nums"
          title={language === 'mr' ? 'भारतीय प्रमाणवेळ कर्तव्य घड्याळ' : 'Indian Standard Time (IST) Active Duty Clock'}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
          <span>{timeString ? (language === 'mr' ? timeString : `${timeString} IST`) : (language === 'mr' ? '१८:२५' : '18:25 IST')}</span>
        </div>

        {/* 3. Themed Dark Language Dropdown (ONLY place where inactive language name appears) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLanguageMenuOpen(!isLanguageMenuOpen);
              setIsDistrictMenuOpen(false);
              setIsProfileMenuOpen(false);
            }}
            className="h-9 px-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title={language === 'mr' ? 'भाषा निवडा' : 'Select Language'}
          >
            <MaterialIcon name="language" size="xs" className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{language === 'mr' ? 'मराठी' : 'English'}</span>
            <MaterialIcon
              name="expand_more"
              size="xs"
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-150 shrink-0 ${
                isLanguageMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Language Menu Popover */}
          {isLanguageMenuOpen && (
            <div className="w-40 mt-1.5 bg-[#0B1120] border border-slate-800 rounded-xl shadow-2xl shadow-black/80 p-1 z-50 absolute right-0 top-full animate-in fade-in slide-in-from-top-1">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  setIsLanguageMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span>English (EN)</span>
                {language === 'en' && (
                  <MaterialIcon name="check" size="xs" className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('mr');
                  setIsLanguageMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  language === 'mr'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <span>मराठी (MR)</span>
                {language === 'mr' && (
                  <MaterialIcon name="check" size="xs" className="w-3.5 h-3.5 text-amber-400" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* 4. Notification Bell Button */}
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 relative flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title={language === 'mr' ? 'शासकीय सूचना (२ न वाचलेले इशारे)' : 'Operational Notifications (2 Unread Alerts)'}
          aria-label={language === 'mr' ? 'सूचना' : 'Notifications'}
        >
          <MaterialIcon name="notifications" size="sm" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </Link>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* 5. Officer Profile Menu Trigger & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsDistrictMenuOpen(false);
              setIsLanguageMenuOpen(false);
            }}
            className="hover:bg-slate-900/80 px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2.5 select-none"
            title={`${language === 'mr' ? 'अधिकारी प्रोफाइल:' : 'Officer Profile:'} ${displayName}`}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
              {displayInitials}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 leading-none mt-0.5">
                {roleLabel}
              </span>
            </div>
            <MaterialIcon
              name="expand_more"
              size="xs"
              className={`w-3.5 h-3.5 text-slate-500 hidden sm:inline transition-transform duration-150 ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Menu Popover */}
          {isProfileMenuOpen && (
            <div className="w-64 mt-2 bg-[#0B1120] border border-slate-800 rounded-xl shadow-2xl shadow-black/80 p-2 z-50 absolute right-0 top-full animate-in fade-in slide-in-from-top-1">
              <div className="p-2 border-b border-slate-800/80 mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {language === 'mr' ? 'प्रवेश केलेले अधिकारी:' : 'Signed in as:'}
                </span>
                <span className="text-xs font-bold text-white block mt-0.5">{displayName}</span>
                <span className="text-[10px] text-amber-400 font-medium block">{roleLabel}</span>
              </div>

              <div className="p-2 space-y-1 text-slate-400 text-[11px] font-mono border-b border-slate-800/80">
                <div className="flex justify-between">
                  <span>{language === 'mr' ? 'संवर्ग:' : 'CADRE:'}</span>
                  <span className="text-slate-200">
                    {userRole === 'dg_admin'
                      ? (language === 'mr' ? 'भा.प्र.से. (महाराष्ट्र: २००८)' : 'IAS (MH: 2008)')
                      : userRole === 'collector'
                      ? (language === 'mr' ? 'भा.प्र.से. (महाराष्ट्र: २०१२)' : 'IAS (MH: 2012)')
                      : (language === 'mr' ? 'राज्य माहिती सेवा' : 'State Information Service')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'mr' ? 'स्थान:' : 'Posting:'}</span>
                  <span className="text-slate-200">
                    {userRole === 'dg_admin'
                      ? (language === 'mr' ? 'मंत्रालय, मुंबई' : 'Mantralaya, Mumbai')
                      : (language === 'mr' ? 'जिल्हाधिकारी संकुल' : 'Collectorate Complex')}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MaterialIcon name="person" size="xs" className="text-slate-400" />
                  <span>{language === 'mr' ? 'संपूर्ण अधिकारी प्रोफाइल' : 'Full Officer Profile'}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MaterialIcon name="arrow_forward" size="xs" className="text-rose-400" />
                  <span>{language === 'mr' ? 'सत्र समाप्त करा व बाहेर पडा' : 'Sign Out Session'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
