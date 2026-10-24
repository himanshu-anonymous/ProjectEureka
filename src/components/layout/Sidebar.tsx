'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useTranslation } from '@/lib/translations';
import {
  Squares2X2Icon,
  CpuChipIcon,
  MapPinIcon,
  ShieldExclamationIcon,
  NewspaperIcon,
  TvIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ServerStackIcon,
  BookOpenIcon,
  MegaphoneIcon,
  PhotoIcon,
  VideoCameraIcon,
  FingerPrintIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  SignalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/20/solid';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    language,
    mobileMenuOpen,
    setMobileMenuOpen,
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
    },
    {
      href: '/system-monitoring/raw-ingestion',
      label: language === 'mr' ? 'कच्चा डेटा अंतर्ग्रहण' : 'Raw Ingestion',
    },
    {
      href: '/system-monitoring/pipeline-flow',
      label: language === 'mr' ? 'पाइपलाइन व डेटा प्रवाह' : 'Pipeline & Ops Flow',
    },
  ];

  const handleDistrictSelect = (districtId: string, districtName: string) => {
    setSelectedDistrictId(districtId);
    setSearchDistrict(districtName);
    setMobileMenuOpen(false);
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
        className={`h-full shrink-0 bg-[#0B1120] border-r border-slate-800/90 flex flex-col justify-between transition-all duration-200 ease-in-out z-20 select-none box-border ${
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
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Scrollable Grouped Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5 scrollbar-none">
          {/* Top Relocated Collapse Menu Button (directly above Command & Telemetry) */}
          <div className="hidden md:block mb-2">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`w-full flex items-center ${
                sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
              } text-xs rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer`}
              title={
                sidebarCollapsed
                  ? (language === 'mr' ? 'मेन्यू विस्तार करा' : 'Expand Menu (Ctrl+B)')
                  : (language === 'mr' ? 'मेन्यू संक्षिप्त करा' : 'Collapse Menu (Ctrl+B)')
              }
              aria-label={sidebarCollapsed ? 'Expand Menu' : 'Collapse Menu'}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                {sidebarCollapsed ? (
                  <ChevronDoubleRightIcon className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors shrink-0" />
                ) : (
                  <ChevronDoubleLeftIcon className="w-5 h-5 text-amber-400 group-hover:text-amber-300 transition-colors shrink-0" />
                )}
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <span className="truncate font-medium text-slate-300">
                  {language === 'mr' ? 'मेन्यू संक्षिप्त करा' : 'Collapse Menu'}
                </span>
              )}
            </button>
          </div>

          {/* 0. EXECUTIVE DASHBOARD - Always visible, collapsed & expanded */}
          <div className="mb-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'मुख्य डॅशबोर्ड' : 'Dashboard') : undefined}
              className={`w-full flex items-center overflow-hidden ${
                sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
              } text-xs transition-all ${
                pathname === '/' || pathname === '/dashboard'
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Squares2X2Icon
                  className={`w-5 h-5 ${
                    pathname === '/' || pathname === '/dashboard' ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate font-semibold">{language === 'mr' ? 'मुख्य डॅशबोर्ड' : 'Dashboard'}</span>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">Live</span>
                </div>
              )}
            </Link>
          </div>

          {/* GROUP 1: DGPR PORTALS (DGPR) */}
          <div className="pt-2 border-t border-slate-800/70">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                <span>{language === 'mr' ? 'डीजीपीआर दालने' : 'DGPR Portals'}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  DGPR
                </span>
              </div>
            )}

            <div className="space-y-1">
              {/* TAB: Newspaper (Static Reader & Multiple Editions) */}
              <Link
                href="/newspaper"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'वृत्तपत्र (Newspaper)' : 'Newspaper') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/newspaper' || pathname === '/media'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <NewspaperIcon
                    className={`w-5 h-5 ${pathname === '/newspaper' || pathname === '/media' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'वृत्तपत्र (Newspaper)' : 'Newspaper'}</span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30 shrink-0 ml-1">
                      516
                    </span>
                  </div>
                )}
              </Link>

              {/* TAB: Live News (Broadcast & Transcripts) */}
              <Link
                href="/live-news"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'थेट वृत्त (Live News)' : 'Live News') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/live-news' || pathname === '/live-events'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <TvIcon
                    className={`w-5 h-5 ${pathname === '/live-news' || pathname === '/live-events' ? 'text-rose-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'थेट वृत्त (Live News)' : 'Live News'}</span>
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 shrink-0 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
                      LIVE
                    </span>
                  </div>
                )}
              </Link>

              {/* TAB: Advertisements & Campaigns */}
              <Link
                href="/advertisements"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.advertisements : 'Advertisements') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/advertisements'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <MegaphoneIcon
                    className={`w-5 h-5 ${pathname === '/advertisements' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'जाहिरात (Advertisements)' : 'Advertisements'}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">42 ROs</span>
                  </div>
                )}
              </Link>

              {/* TAB: Outdoor Hoardings & Displays */}
              <Link
                href="/advertisements?tab=hoardings"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'होर्डिंग्ज व फलक (Hoardings)' : 'Hoardings & Billboards') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/advertisements' && typeof window !== 'undefined' && window.location.search.includes('hoardings')
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <PhotoIcon
                    className="w-5 h-5 text-slate-400"
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'होर्डिंग्ज व फलक (Hoardings)' : 'Outdoor Hoardings'}</span>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0 ml-1">140 Sites</span>
                  </div>
                )}
              </Link>

              {/* TAB: Fact-Check & Verification Desk (FLAGSHIP 1) */}
              <Link
                href="/fact-check"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'तथ्य पडताळणी कक्ष (Fact-Check)' : 'DGPR Fact-Check Desk') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/fact-check'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ShieldCheckIcon
                    className={`w-5 h-5 ${pathname === '/fact-check' ? 'text-emerald-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'तथ्य पडताळणी कक्ष (Fact-Check)' : 'Fact-Check Desk'}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30 shrink-0 ml-1">
                      Live 24x7
                    </span>
                  </div>
                )}
              </Link>

              {/* TAB: Media Sentiment & Narrative Radar (FLAGSHIP 2) */}
              <Link
                href="/media-intelligence"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'माध्यम संवेदनशीलता व रडार (Media Radar)' : 'Media Sentiment Radar') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/media-intelligence'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <SignalIcon
                    className={`w-5 h-5 ${pathname === '/media-intelligence' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'माध्यम संवेदनशीलता (Sentiment Radar)' : 'Media Sentiment Radar'}</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0 ml-1">
                      08:00 AM
                    </span>
                  </div>
                )}
              </Link>

              {/* TAB: Publications (लोकराज्य) */}
              <Link
                href="/publications"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.publications : 'Publications') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/publications'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <BookOpenIcon
                    className={`w-5 h-5 ${pathname === '/publications' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'प्रसिद्धी व मासिक (Publications)' : 'Publications'}</span>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0 ml-1">लोकराज्य</span>
                  </div>
                )}
              </Link>

              {/* TAB: Press Releases & Dispatches */}
              <Link
                href="/press-releases"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.pressReleases : 'Press Releases & Dispatches') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/press-releases'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <DocumentTextIcon
                    className={`w-5 h-5 ${pathname === '/press-releases' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'प्रसिद्धीपत्रके (Press Releases)' : 'Press Releases'}</span>
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/20 px-1.5 py-0.2 rounded border border-blue-500/30 shrink-0 ml-1">142</span>
                  </div>
                )}
              </Link>

              {/* TAB: Field Activities & IEC */}
              <Link
                href="/activities"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.activities : 'Field Activities & IEC') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/activities'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <CalendarDaysIcon
                    className={`w-5 h-5 ${pathname === '/activities' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? 'क्षेत्रीय उपक्रम (Field Activities)' : 'Field Activities'}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">Active</span>
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* GROUP 2: COMMAND CENTRE & STATEWIDE OPERATIONS */}
          <div className="pt-2 border-t border-slate-800/70">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                <span>{language === 'mr' ? 'कमांड सेंटर व जिल्हे' : 'Command Centre & Districts'}</span>
              </div>
            )}

            <div className="space-y-1">
              {/* TAB: Command Centre */}
              <Link
                href="/command-center"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.commandCenter : 'Command Centre') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  isCommandCenterRoute
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <CpuChipIcon
                    className={`w-5 h-5 ${isCommandCenterRoute ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? t.sidebar.commandCenter : 'Command Centre'}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">Live</span>
                  </div>
                )}
              </Link>

              {/* TAB: 36 Districts & Hoardings */}
              <div>
                <div className="flex items-center">
                  <Link
                    href="/districts"
                    onClick={() => setMobileMenuOpen(false)}
                    title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.districts : '36 Districts & Hoardings') : undefined}
                    className={`flex-1 flex items-center overflow-hidden ${
                      sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                    } text-xs transition-all ${
                      pathname === '/districts'
                        ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <MapPinIcon
                        className={`w-5 h-5 ${pathname === '/districts' ? 'text-amber-400' : 'text-slate-400'}`}
                      />
                    </div>
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="truncate">{language === 'mr' ? t.sidebar.districts : '36 Districts & Hoardings'}</span>
                    )}
                  </Link>

                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <button
                      type="button"
                      onClick={() => setDistrictsParentOpen(!districtsParentOpen)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg cursor-pointer shrink-0 ml-0.5"
                      title={districtsParentOpen ? 'Collapse district list' : 'Expand district list'}
                      aria-label="Toggle district sub-list"
                    >
                      {districtsParentOpen ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

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

                    <Link
                      href="/konkan-index"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        pathname === '/konkan-index'
                          ? 'text-amber-400 font-bold'
                          : 'text-slate-300 hover:text-amber-300'
                      }`}
                    >
                      {language === 'mr' ? '• कोकण १००-गुणांक गुणवत्ता निर्देशांक' : '• Konkan 100-Point Quality Index'}
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
                              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-rose-400 shrink-0 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                <span>{dist.crisisCount}</span>
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

              {/* TAB: Biometrics Attendance */}
              <Link
                href="/attendance"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.attendance : 'Biometrics Attendance') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/attendance'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <FingerPrintIcon
                    className={`w-5 h-5 ${pathname === '/attendance' ? 'text-emerald-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{language === 'mr' ? t.sidebar.attendance : 'Biometrics Attendance'}</span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-1">94.2%</span>
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* GROUP 3: OPERATIONS & ADMINISTRATION */}
          <div className="pt-2 border-t border-slate-800/70">
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-1.5">
                {language === 'mr' ? 'प्रशासन व ऑपरेशन्स' : 'Operations & Admin'}
              </div>
            )}

            <div className="space-y-1">
              {/* Crisis Response */}
              <Link
                href="/crisis"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.crisis : 'Crisis Response') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/crisis'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ShieldExclamationIcon
                    className={`w-5 h-5 ${pathname === '/crisis' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.crisis : 'Crisis Response'}</span>
                )}
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="ml-auto text-[11px] font-mono font-semibold text-rose-400 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-pulse shrink-0" />
                    <span>{language === 'mr' ? '१ सक्रिय' : '1 Active'}</span>
                  </span>
                )}
              </Link>

              {/* Reports & Analytics */}
              <Link
                href="/reports"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? t.sidebar.reports : 'Reports & Analytics') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/reports'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <ChartBarIcon
                    className={`w-5 h-5 ${pathname === '/reports' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">{language === 'mr' ? t.sidebar.reports : 'Reports & Analytics'}</span>
                )}
              </Link>

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
                  className={`w-full flex items-center overflow-hidden ${
                    sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'justify-between px-3 py-2'
                  } text-xs transition-all cursor-pointer ${
                    isSystemMonitoringRoute
                      ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <ServerStackIcon
                        className={`w-5 h-5 ${isSystemMonitoringRoute ? 'text-amber-400' : 'text-slate-400'}`}
                      />
                    </div>
                    {(!sidebarCollapsed || mobileMenuOpen) && (
                      <span className="truncate">
                        {language === 'mr' ? 'प्रणाली निरीक्षण' : 'System Monitoring'}
                      </span>
                    )}
                  </div>
                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      {systemMonitoringParentOpen ? (
                        <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
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
                          className={`w-full block px-2.5 py-1.5 rounded-md text-xs transition-colors truncate ${
                            isSubActive
                              ? 'bg-slate-800 text-amber-300 font-semibold'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Settings (Separate Tab from Monitoring) */}
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed && !mobileMenuOpen ? (language === 'mr' ? 'प्रणाली सेटिंग्ज' : 'Settings') : undefined}
                className={`w-full flex items-center overflow-hidden ${
                  sidebarCollapsed && !mobileMenuOpen ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
                } text-xs transition-all ${
                  pathname === '/settings'
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-semibold rounded-r-lg'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <AdjustmentsHorizontalIcon
                    className={`w-5 h-5 ${pathname === '/settings' ? 'text-amber-400' : 'text-slate-400'}`}
                  />
                </div>
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="truncate">
                    {language === 'mr' ? 'प्रणाली सेटिंग्ज' : 'Settings'}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
