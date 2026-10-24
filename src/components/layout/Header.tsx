'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { GovEmblem } from '@/components/shared/GovEmblem';
import { useTranslation } from '@/lib/translations';
import { getOfficerName } from '@/lib/dataLocalization';
import { GlobalSearchBar } from './GlobalSearchBar';
import {
  Bars3Icon,
  GlobeAltIcon,
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';

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
  } = useDashboardStore();
  const t = useTranslation(language);

  const isSidebarCollapsed = sidebarCollapsed;

  // Dropdown states
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

  const officerEmail =
    currentUser?.username === 'admin' || currentUser?.username === 'mh-state-dg-01'
      ? 'dg.gokhale@maharashtra.gov.in'
      : currentUser?.username === 'director_konkan' || currentUser?.username === 'mh-dgipr-dir-01'
      ? 'director.konkan@maharashtra.gov.in'
      : currentUser?.username === 'collector_thane' || currentUser?.username === 'mh-dm-thane-01'
      ? 'collector.thane@maharashtra.gov.in'
      : currentUser?.username === 'collector_palghar' || currentUser?.username === 'mh-dm-palghar-01'
      ? 'collector.palghar@maharashtra.gov.in'
      : currentUser?.username === 'operator_konkan' || currentUser?.username === 'operator1' || currentUser?.username === 'mh-dgipr-konkan-04'
      ? 'operator_konkan@dgipr.maharashtra.gov.in'
      : 'dg.gokhale@maharashtra.gov.in';

  const roleLabel =
    userRole === 'dg_admin'
      ? language === 'mr' ? 'राज्य डीजी प्रशासन • स्तर १' : 'State DG Admin • Tier 1'
      : userRole === 'director_konkan'
      ? language === 'mr' ? 'विभागीय उपसंचालक • स्तर २' : 'Divisional Director • Tier 2'
      : userRole === 'collector'
      ? language === 'mr' ? 'जिल्हाधिकारी • स्तर ३' : 'District Collector • Tier 3'
      : language === 'mr' ? 'जिल्हा माहिती डेस्क • स्तर ४' : 'DIO Desk • Tier 4';

  return (
    <header
      ref={navRef}
      className="h-16 w-full shrink-0 bg-[#070B14] border-b border-slate-800/90 flex items-center justify-between z-40 relative px-0 shadow-xs select-none"
    >
      {/* 1. Brand Cell with Smooth Sidebar Collapse Synchronization */}
      <div
        className={`transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? 'w-16 justify-center px-0' : 'w-64 px-4 gap-3'
        } shrink-0 h-full border-r border-slate-800/90 flex items-center relative box-border`}
      >
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-slate-400 hover:text-white md:hidden transition-colors cursor-pointer mr-0.5"
          aria-label={language === 'mr' ? 'मेन्यू उघडा' : 'Toggle navigation drawer'}
          title={language === 'mr' ? 'नेव्हिगेशन मेन्यू' : 'Toggle Navigation Menu'}
        >
          <Bars3Icon className="w-5 h-5 text-amber-400" />
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
                {language === 'mr' ? 'माहिती व जनसंपर्क (DGPR) • महाराष्ट्र' : 'DGPR • MAHARASHTRA'}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Interactive Route Breadcrumbs */}
      <div className="px-4 sm:px-6 hidden sm:flex items-center gap-2 text-sm shrink-0 relative">
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

            <span className="text-amber-300 text-xs font-mono flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
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
          <Link
            href="/command-center"
            className="text-white hover:text-amber-400 font-semibold px-1.5 py-1 rounded-md transition-colors cursor-pointer"
            title={language === 'mr' ? 'ऑपरेशनल कमांड डेक' : 'Operational Command Deck'}
          >
            <span>{language === 'mr' ? 'कमांड सेंटर' : 'Command Centre'}</span>
          </Link>
        ) : (
          <Link
            href={pathname === '/' ? '/dashboard' : pathname}
            className="text-white hover:text-amber-400 font-semibold px-1.5 py-1 rounded-md transition-colors cursor-pointer"
            title={language === 'mr' ? 'सक्रिय प्रणाली दालन' : 'Active Navigation Module'}
          >
            <span>
              {pathname.startsWith('/newspaper')
                ? (language === 'mr' ? 'वृत्तपत्र कात्रणे व विश्लेषण' : 'Newspaper Clippings (516 Daily)')
                : pathname.startsWith('/live-news')
                ? (language === 'mr' ? 'थेट प्रक्षेपण व बातम्या' : 'Live News & Broadcast Desk')
                : pathname.startsWith('/advertisements')
                ? (language === 'mr' ? 'शासकीय जाहिराती व होर्डिंग्ज' : 'Advertisements & Hoardings')
                : pathname.startsWith('/publications')
                ? (language === 'mr' ? 'लोकराज्य मासिक' : 'Publications (लोकराज्य)')
                : pathname.startsWith('/settings')
                ? (language === 'mr' ? 'प्रणाली संरचना व सेटिंग्ज' : 'Institutional Settings')
                : pathname.startsWith('/attendance')
                ? (language === 'mr' ? 'बायोमेट्रिक उपस्थिती' : 'Biometrics Attendance')
                : pathname.startsWith('/districts')
                ? (language === 'mr' ? '३६ जिल्हे व कार्यालये' : '36 Districts & DIO Offices')
                : pathname.startsWith('/crisis')
                ? (language === 'mr' ? 'आपत्कालीन प्रतिसाद' : 'Crisis Response')
                : pathname.startsWith('/press-releases')
                ? (language === 'mr' ? 'प्रसिद्धीपत्रके' : 'Press Releases')
                : pathname.startsWith('/media')
                ? (language === 'mr' ? 'माध्यम कक्ष' : 'Communication Centre')
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
        )}
      </div>

      {/* 3. Search Bar spanning the full width of available free space */}
      <div className="flex-1 min-w-0 px-3 sm:px-6 flex items-center">
        <GlobalSearchBar />
      </div>

      {/* 4. High-Utility Command Center Controls (Right Navbar Zone) */}
      <div className="px-4 sm:px-6 flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Live IST Duty Clock — Clean borderless element */}
        <div
          className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-400 px-2 h-9 tabular-nums"
          title={language === 'mr' ? 'भारतीय प्रमाणवेळ कर्तव्य घड्याळ' : 'Indian Standard Time (IST) Active Duty Clock'}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
          <span>{timeString ? (language === 'mr' ? timeString : `${timeString} IST`) : (language === 'mr' ? '१८:२५' : '18:25 IST')}</span>
        </div>

        {/* Themed Dark Language Dropdown — Clean borderless element */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLanguageMenuOpen(!isLanguageMenuOpen);
              setIsProfileMenuOpen(false);
            }}
            className="h-9 px-2.5 hover:bg-slate-800/60 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title={language === 'mr' ? 'भाषा निवडा' : 'Select Language'}
          >
            <GlobeAltIcon className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{language === 'mr' ? 'मराठी' : 'English'}</span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
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
                  <CheckIcon className="w-4 h-4 text-amber-400" />
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
                  <CheckIcon className="w-4 h-4 text-amber-400" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell Button — Clean borderless element */}
        <Link
          href="/notifications"
          className="w-9 h-9 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white relative flex items-center justify-center transition-colors cursor-pointer"
          title={language === 'mr' ? 'शासकीय सूचना (२ न वाचलेले इशारे)' : 'Operational Notifications (2 Unread Alerts)'}
          aria-label={language === 'mr' ? 'सूचना' : 'Notifications'}
        >
          <BellIcon className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </Link>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Officer Profile Menu Trigger & Dropdown — Retains subtle gray border */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsLanguageMenuOpen(false);
            }}
            className="hover:bg-slate-900/80 border border-slate-700/60 hover:border-slate-600/70 bg-slate-900/40 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 select-none shadow-2xs"
            title={`${language === 'mr' ? 'अधिकारी प्रोफाइल:' : 'Officer Profile:'} ${displayName}`}
          >
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-700/80 animate-shimmer-dark shrink-0" />
                <div className="w-20 h-3.5 rounded bg-slate-700/80 animate-shimmer-dark hidden sm:inline" />
              </div>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {displayInitials}
                </div>
                <div className="flex flex-col text-left hidden sm:flex">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono leading-none mt-0.5 truncate max-w-[140px]">
                    {userRole === 'dg_admin'
                      ? 'State DG Admin • Tier 1'
                      : userRole === 'director_konkan'
                      ? 'Divisional Director • Tier 2'
                      : userRole === 'collector'
                      ? 'District Collector • Tier 3'
                      : 'DIO Desk Operator • Tier 4'}
                  </span>
                </div>
              </>
            )}
            <ChevronDownIcon
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Profile Menu Popover with Subtle Gray Border */}
          {isProfileMenuOpen && (
            <div className="w-72 mt-2 bg-[#0B1120] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/90 p-2 z-50 absolute right-0 top-full animate-in fade-in slide-in-from-top-1">
              {/* Unique Top Section: Official Email & Session Status Badge */}
              <div className="p-2.5 border-b border-slate-800/80 mb-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    {language === 'mr' ? 'प्रवेश केलेले अधिकारी' : 'Signed in as'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{language === 'mr' ? 'सक्रिय सत्र' : 'Active Session'}</span>
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate font-sans">{displayName}</div>
                <div className="text-[11px] text-slate-400 truncate font-mono select-all">
                  {officerEmail}
                </div>
              </div>

              {/* Cadre & Posting Section: matching Title Case, no colons, clean UI font */}
              <div className="p-2.5 space-y-2 text-xs border-b border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">{language === 'mr' ? 'संवर्ग' : 'Cadre'}</span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    {userRole === 'dg_admin'
                      ? (language === 'mr' ? 'भा.प्र.से. (महाराष्ट्र: २००८)' : 'IAS (MH: 2008)')
                      : userRole === 'collector'
                      ? (language === 'mr' ? 'भा.प्र.से. (महाराष्ट्र: २०१२)' : 'IAS (MH: 2012)')
                      : (language === 'mr' ? 'राज्य माहिती सेवा' : 'State Information Service')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">{language === 'mr' ? 'स्थान' : 'Posting'}</span>
                  <span className="text-slate-200 font-sans font-medium text-xs">
                    {userRole === 'dg_admin'
                      ? (language === 'mr' ? 'मंत्रालय, मुंबई' : 'Mantralaya, Mumbai')
                      : (language === 'mr' ? 'जिल्हाधिकारी संकुल' : 'Collectorate Complex')}
                  </span>
                </div>
              </div>

              {/* Navigation & Logout Links */}
              <div className="pt-1.5 space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer font-sans"
                >
                  <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{language === 'mr' ? 'संपूर्ण अधिकारी प्रोफाइल' : 'Full Officer Profile'}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer font-sans"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{language === 'mr' ? 'बाहेर पडा' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
