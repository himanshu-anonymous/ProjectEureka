'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useDashboardStore } from '@/stores/dashboardStore';
import { getDistrictName } from '@/lib/dataLocalization';
import { LiveNewsQueueSkeleton } from '@/components/skeletons/LiveNewsQueueSkeleton';
import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

export type MediaPlatform = 'all' | 'twitter' | 'newspaper' | 'whatsapp' | 'facebook' | 'reddit';

export interface OmniChannelItem {
  id: string;
  platform: 'twitter' | 'newspaper' | 'whatsapp' | 'facebook' | 'reddit';
  author: string;
  handle: string;
  district: string;
  timeEn: string;
  timeMr: string;
  textEn: string;
  textMr: string;
  engagement: string;
  engagementMr: string;
  sentiment: 'Positive' | 'Critical' | 'Neutral' | 'Alert';
  verified: boolean;
  factChecked?: boolean;
  url: string;
}

const OMNI_CHANNEL_DATA: OmniChannelItem[] = [
  // 1. Twitter / X
  {
    id: 'TW-9821',
    platform: 'twitter',
    author: 'CMO Maharashtra',
    handle: '@CMOMaharashtra',
    district: 'Mumbai City',
    timeEn: '2m ago',
    timeMr: '२ मि पूर्वी',
    textEn: 'Direct DBT subsidy release for micro-irrigation initiated across all 36 districts of Maharashtra. ₹1,240 Cr disbursed directly to farmer accounts.',
    textMr: 'महाराष्ट्रातील सर्व ३६ जिल्ह्यांतील शेतकऱ्यांना ठिबक व तुषार सिंचन अनुदानाचे थेट बँक खात्यात वितरण सुरू. ₹१,२४० कोटी थेट हस्तांतरित.',
    engagement: '1.8K Reposts • 8.4K Likes',
    engagementMr: '१.८ हजार पुनपोस्ट • ८.४ हजार लाईक्स',
    sentiment: 'Positive',
    verified: true,
    url: 'https://twitter.com/CMOMaharashtra',
  },
  {
    id: 'TW-9819',
    platform: 'twitter',
    author: 'DGIPR Maharashtra',
    handle: '@MahaDGIPR',
    district: 'Statewide',
    timeEn: '8m ago',
    timeMr: '८ मि पूर्वी',
    textEn: 'Statewide DIO telemetric command network online. All 36 District Information Offices now publishing verified press bulletins in real-time.',
    textMr: 'राज्यव्यापी माहिती अधिकारी टेलीमेट्री कक्ष कार्यरत. सर्व ३६ जिल्हा माहिती कार्यालयांकडून अधिकृत प्रसिद्धीपत्रके थेट प्रकाशित.',
    engagement: '920 Reposts • 4.1K Likes',
    engagementMr: '९२० पुनपोस्ट • ४.१ हजार लाईक्स',
    sentiment: 'Positive',
    verified: true,
    url: 'https://twitter.com/MahaDGIPR',
  },
  {
    id: 'TW-9812',
    platform: 'twitter',
    author: 'Maharashtra Cyber',
    handle: '@MahaCyber1',
    district: 'Statewide',
    timeEn: '22m ago',
    timeMr: '२२ मि पूर्वी',
    textEn: 'ADVISORY: Beware of fraudulent electricity disconnection SMS. Maharashtra State Electricity Board will never ask for APK installations.',
    textMr: 'दक्षता इशारा: वीज बिल थकबाकीच्या बनावट मेसेजवर विश्वास ठेवू नका. महावितरण कधीही APK डाउनलोड करण्यास सांगत नाही.',
    engagement: '3.4K Reposts • 12K Likes',
    engagementMr: '३.४ हजार पुनपोस्ट • १२ हजार लाईक्स',
    sentiment: 'Alert',
    verified: true,
    factChecked: true,
    url: 'https://twitter.com/MahaCyber1',
  },

  // 2. Newspaper / Broadsheet
  {
    id: 'NP-4401',
    platform: 'newspaper',
    author: 'Loksatta (लोकसत्ता)',
    handle: 'Front Page Lead • Pune Edition',
    district: 'Pune',
    timeEn: '14m ago',
    timeMr: '१४ मि पूर्वी',
    textEn: 'Cabinet approves Pune Metro Line 3 extension and underground tunnel connectivity to Hinjewadi IT Park.',
    textMr: 'पुणे मेट्रो टप्पा ३ हिंजवडी आयटी पार्क भूमिगत बोगदा मार्गाला राज्य मंत्रिमंडळाची अंतिम प्रशासकीय मंजुरी.',
    engagement: '48K Print Reach • Verified E-Paper',
    engagementMr: '४८ हजार वाचक • प्रमाणित ई-पेपर',
    sentiment: 'Positive',
    verified: true,
    url: 'https://www.loksatta.com',
  },
  {
    id: 'NP-4398',
    platform: 'newspaper',
    author: 'Maharashtra Times (मटा)',
    handle: 'Regional Page 3 • Konkan Desk',
    district: 'Ratnagiri',
    timeEn: '30m ago',
    timeMr: '३० मि पूर्वी',
    textEn: 'Konkan Coastal Ring Road: 92% land compensation disbursed directly to local landowners with zero litigation.',
    textMr: 'कोकण सागरी महामार्ग: ९२% भूसंपादन मोबदला थेट शेतकऱ्यांच्या खात्यात जमा. प्रकल्प वेगाने पूर्णत्वाकडे.',
    engagement: '62K Readers • Lead Column',
    engagementMr: '६२ हजार वाचक • मुख्य अग्रलेख',
    sentiment: 'Positive',
    verified: true,
    url: 'https://maharashtratimes.com',
  },
  {
    id: 'NP-4392',
    platform: 'newspaper',
    author: 'The Indian Express',
    handle: 'Governance & State Policy',
    district: 'Mumbai Suburban',
    timeEn: '1h ago',
    timeMr: '१ तास पूर्वी',
    textEn: 'Maharashtra records highest GST revenue collection in Q3, buoyed by industrial manufacturing hubs in Chhatrapati Sambhajinagar & Nashik.',
    textMr: 'महाराष्ट्रात तिसऱ्या तिमाहीत विक्रमी जीएसटी संकलन; छत्रपती संभाजीनगर व नाशिक औद्योगिक पट्ट्यातील उत्पादनाला मोठी गती.',
    engagement: '110K Digital Readers',
    engagementMr: '११० हजार डिजिटल वाचक',
    sentiment: 'Positive',
    verified: true,
    url: 'https://indianexpress.com',
  },

  // 3. WhatsApp / Community Feeds
  {
    id: 'WA-2104',
    platform: 'whatsapp',
    author: 'MahaFactCheck Channel',
    handle: 'Official Gov Broadcast (WhatsApp)',
    district: 'Thane',
    timeEn: '5m ago',
    timeMr: '५ मि पूर्वी',
    textEn: 'FACT-CHECK VERIFIED: Viral WhatsApp voice note claiming bridge closure at Ghodbunder Road is FALSE. Traffic flow is entirely normal.',
    textMr: 'तथ्य पडताळणी: घोडबंदर रोडवरील पूल बंद असल्याचा व्हायरल ऑडिओ मेसेज पूर्णपणे बनावट व अफवा आहे. वाहतूक सुरळीत सुरू आहे.',
    engagement: 'Forwarded 14.5K times • Debunked',
    engagementMr: '१४.५ हजार वेळा फॉरवर्ड • खंडन प्रसिद्ध',
    sentiment: 'Critical',
    verified: true,
    factChecked: true,
    url: 'https://dgipr.maharashtra.gov.in',
  },
  {
    id: 'WA-2101',
    platform: 'whatsapp',
    author: 'Collector Office Raigad',
    handle: 'District Citizen Broadcast',
    district: 'Raigad',
    timeEn: '18m ago',
    timeMr: '१८ मि पूर्वी',
    textEn: 'High Tide Warning: Fishermen advised not to venture beyond 5 nautical miles. Emergency coastal helplines activated: 1077.',
    textMr: 'भरतीचा इशारा: मच्छिमारांनी समुद्रात ५ सागरी मैलांच्या पुढे जाऊ नये. जिल्हा आपत्कालीन नियंत्रण कक्ष २४x७ सुरू: १०७७.',
    engagement: 'Official Broadcast Channel • 120K Subscribed',
    engagementMr: 'अधिकृत चॅनेल • १२० हजार नागरिक जोडले',
    sentiment: 'Alert',
    verified: true,
    url: 'https://raigad.gov.in',
  },

  // 4. Facebook / Meta Page
  {
    id: 'FB-5510',
    platform: 'facebook',
    author: 'Government of Maharashtra',
    handle: 'Official Facebook Page • Live Broadcast',
    district: 'Mumbai City',
    timeEn: '12m ago',
    timeMr: '१२ मि पूर्वी',
    textEn: 'Live Press Briefing: Minister of Agriculture announces insurance claim disbursement timeline under Pradhan Mantri Fasal Bima Yojana.',
    textMr: 'थेट वार्तालाप: प्रधानमंत्री पीक विमा योजनेअंतर्गत मंजूर नुकसानभरपाई वाटपाचे वेळापत्रक जाहीर. थेट फेसबुक प्रक्षेपण.',
    engagement: '18K Views • 1.2K Shares • 980 Comments',
    engagementMr: '१८ हजार दृश्ये • १.२ हजार शेअर्स',
    sentiment: 'Positive',
    verified: true,
    url: 'https://facebook.com',
  },
  {
    id: 'FB-5507',
    platform: 'facebook',
    author: 'Aaple Sarkar (आपले सरकार)',
    handle: 'Civic Services & Grievance Portal',
    district: 'Nagpur',
    timeEn: '45m ago',
    timeMr: '४५ मि पूर्वी',
    textEn: 'Public Service Guarantee Act: 99.1% revenue services issued within statutory timeline of 7 working days in Nagpur division.',
    textMr: 'लोकसेवा हक्क कायदा: नागपूर विभागातील ९९.१% महसूल दाखले विहित मुदतीत ७ दिवसांत नागरिकांना थेट घरपोच.',
    engagement: '6.4K Reactions • 850 Shares',
    engagementMr: '६.४ हजार प्रतिक्रिया • ८५० शेअर्स',
    sentiment: 'Positive',
    verified: true,
    url: 'https://facebook.com',
  },

  // 5. Reddit / Community Discussions
  {
    id: 'RD-7703',
    platform: 'reddit',
    author: 'r/Maharashtra',
    handle: 'Community Pulse • u/MahaCitizen',
    district: 'Kolhapur',
    timeEn: '25m ago',
    timeMr: '२५ मि पूर्वी',
    textEn: '[Civic Thread] Panchganga river water treatment plant upgrade is showing noticeable water quality improvements in city wards.',
    textMr: '[नागरिक चर्चा] पंचगंगा नदी जलशुद्धीकरण प्रकल्पामुळे कोल्हापूर शहरातील पिण्याच्या पाण्याच्या दर्जात लक्षणीय सुधारणा.',
    engagement: '520 Upvotes (97% Upvoted) • 84 Comments',
    engagementMr: '५२० पसंती (९७%) • ८४ टिप्पण्या',
    sentiment: 'Positive',
    verified: false,
    url: 'https://reddit.com/r/Maharashtra',
  },
  {
    id: 'RD-7701',
    platform: 'reddit',
    author: 'r/mumbai',
    handle: 'Urban Transit Thread • u/NaviMumbaikar',
    district: 'Thane',
    timeEn: '50m ago',
    timeMr: '५० मि पूर्वी',
    textEn: '[Travel Time Audit] Navi Mumbai Metro to Belapur link is saving over 40 minutes per commuter on daily peak hour routes.',
    textMr: '[प्रवास वेळ पाहणी] नवी मुंबई मेट्रोमुळे बेलापूर मार्गावर दररोज प्रत्येक प्रवाशाची ४० मिनिटांची बचत होत आहे.',
    engagement: '1.2K Upvotes • 230 Comments',
    engagementMr: '१.२ हजार पसंती • २३० टिप्पण्या',
    sentiment: 'Positive',
    verified: false,
    url: 'https://reddit.com/r/mumbai',
  },
];

export interface LiveNewsQueueProps {
  highlightDistrict?: (districtId: string) => void;
}

export const LiveNewsQueue: React.FC<LiveNewsQueueProps> = () => {
  const { language, selectedDistrictId, isLoadingData } = useDashboardStore();
  const [activePlatform, setActivePlatform] = useState<MediaPlatform>('all');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<OmniChannelItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDistrictFiltered = Boolean(selectedDistrictId && selectedDistrictId !== 'all');
  const districtLabel = isDistrictFiltered
    ? getDistrictName(selectedDistrictId, language)
    : '';

  // Filtered feeds by platform, district, and search query
  const filteredFeed = useMemo(() => {
    return OMNI_CHANNEL_DATA.filter((item) => {
      // 1. Platform filter
      const matchesPlatform = activePlatform === 'all' || item.platform === activePlatform;

      // 2. District filter
      const matchesDistrict =
        !selectedDistrictId || selectedDistrictId === 'all'
          ? true
          : item.district.toLowerCase().includes(selectedDistrictId.toLowerCase()) ||
            item.district === 'Statewide';

      // 3. Search query
      const matchesSearch =
        !searchQuery ||
        item.textEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.textMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPlatform && matchesDistrict && matchesSearch;
    });
  }, [activePlatform, selectedDistrictId, searchQuery]);

  const getPlatformIcon = (platform: OmniChannelItem['platform']) => {
    switch (platform) {
      case 'twitter':
        return (
          <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            𝕏
          </span>
        );
      case 'newspaper':
        return (
          <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            📰
          </span>
        );
      case 'whatsapp':
        return (
          <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            💬
          </span>
        );
      case 'facebook':
        return (
          <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            📘
          </span>
        );
      case 'reddit':
        return (
          <span className="w-5 h-5 rounded-md bg-orange-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
            🔴
          </span>
        );
    }
  };

  const getPlatformLabel = (platform: MediaPlatform) => {
    switch (platform) {
      case 'all':
        return language === 'mr' ? 'सर्व प्रवाह' : 'All Updates';
      case 'twitter':
        return 'Twitter / X';
      case 'newspaper':
        return language === 'mr' ? 'वृत्तपत्रे' : 'Newspaper';
      case 'whatsapp':
        return 'WhatsApp';
      case 'facebook':
        return 'Facebook';
      case 'reddit':
        return 'Reddit';
    }
  };

  const getSentimentPill = (sentiment: OmniChannelItem['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {language === 'mr' ? 'सकारात्मक' : 'Positive'}
          </span>
        );
      case 'Alert':
      case 'Critical':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            {language === 'mr' ? 'दक्षता इशारा' : 'Advisory / Alert'}
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {language === 'mr' ? 'तटस्थ' : 'Neutral'}
          </span>
        );
    }
  };

  if (isLoadingData) {
    return <LiveNewsQueueSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-200">
      {/* 1. Header Bar with Real-time Status */}
      <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between gap-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xs shrink-0">
            ⚡
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
              {language === 'mr'
                ? 'थेट माध्यम प्रवाह (ट्विटर, वृत्तपत्रे, व्हॉट्सॲप, फेसबुक, रेडिट)'
                : 'Omni-Channel Media Pulse (Twitter, Newspapers, WhatsApp, Facebook, Reddit)'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer text-xs"
            aria-label={isCollapsed ? 'Expand news queue' : 'Collapse news queue'}
          >
            <MaterialIcon
              name={isCollapsed ? 'expand_more' : 'expand_less'}
              size="xs"
              className="text-slate-400"
            />
          </button>
        </div>
      </div>

      {/* 2. Omni-Channel Category Switcher Ribbon */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          {(['all', 'twitter', 'newspaper', 'whatsapp', 'facebook', 'reddit'] as MediaPlatform[]).map(
            (p) => {
              const isActive = activePlatform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePlatform(p)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>
                    {p === 'twitter'
                      ? '𝕏'
                      : p === 'newspaper'
                      ? '📰'
                      : p === 'whatsapp'
                      ? '💬'
                      : p === 'facebook'
                      ? '📘'
                      : p === 'reddit'
                      ? '🔴'
                      : '🌐'}
                  </span>
                  <span>{getPlatformLabel(p)}</span>
                </button>
              );
            }
          )}
        </div>

        <span className="text-[10px] font-mono text-slate-500 shrink-0 hidden md:inline">
          {filteredFeed.length} {language === 'mr' ? 'अपडेट्स' : 'items'}
        </span>
      </div>

      {/* 3. Feed List (Bounded at max-h-[210px] for Test & Zero-Clipping Compliance) */}
      {!isCollapsed && (
        <div
          ref={containerRef}
          className="overflow-y-auto divide-y divide-slate-100 max-h-[210px] flex-1 bg-white"
        >
          {filteredFeed.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              <p>
                {isDistrictFiltered
                  ? language === 'mr'
                    ? `${districtLabel} साठी अद्याप अपडेट आले नाही`
                    : `No items found for ${districtLabel}`
                  : language === 'mr'
                  ? 'कोणतेही अपडेट उपलब्ध नाही'
                  : 'No items matching filter'}
              </p>
            </div>
          ) : (
            filteredFeed.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-2.5 transition-colors duration-150 hover:bg-slate-50/90 cursor-pointer group flex flex-col gap-1.5"
              >
                {/* Channel & Author Meta */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {getPlatformIcon(item.platform)}
                    <span className="font-bold text-slate-900 text-[11px] truncate">
                      {item.author}
                    </span>
                    {item.verified && (
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    )}
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-[10px] text-slate-500 font-mono truncate">
                      {item.handle}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-mono shrink-0">
                      {item.district}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.factChecked && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                        <ShieldCheckIcon className="w-3 h-3 text-blue-600" />
                        Fact-Check
                      </span>
                    )}
                    {getSentimentPill(item.sentiment)}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {language === 'mr' ? item.timeMr : item.timeEn}
                    </span>
                  </div>
                </div>

                {/* Message Excerpt */}
                <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed group-hover:text-blue-700">
                  {language === 'mr' ? item.textMr : item.textEn}
                </p>

                {/* Engagement Metrics & Source Link */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className="font-medium text-slate-500">
                    {language === 'mr' ? item.engagementMr : item.engagement}
                  </span>
                  <span className="text-blue-600 group-hover:underline inline-flex items-center gap-1 font-semibold">
                    <span>{language === 'mr' ? 'तपशील' : 'View Wire'}</span>
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Full Post Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 px-5 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPlatformIcon(selectedItem.platform)}
                <span className="font-bold text-sm tracking-tight">
                  {selectedItem.author} ({getPlatformLabel(selectedItem.platform)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-white/80 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4 text-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 flex-wrap gap-2">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">
                  {selectedItem.handle}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {selectedItem.timeEn} • {selectedItem.district}
                </span>
                {getSentimentPill(selectedItem.sentiment)}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {language === 'mr' ? selectedItem.textMr : selectedItem.textEn}
                </p>
                {language === 'mr' && (
                  <p className="text-xs text-slate-500 mt-2 font-sans italic border-l-2 border-amber-500 pl-3">
                    {selectedItem.textEn}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {language === 'mr' ? 'नागरिक संवाद / प्रभाव:' : 'Public Engagement:'}
                </span>
                <span className="font-bold text-slate-800">
                  {language === 'mr' ? selectedItem.engagementMr : selectedItem.engagement}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{language === 'mr' ? 'मूळ पोस्ट पहा' : 'Open Channel Post'}</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'बंद करा' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveNewsQueue;
