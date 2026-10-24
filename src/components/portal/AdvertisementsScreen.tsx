'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { STATE_ADVERTISEMENTS_DATA, StateAdvertisement } from '@/data/advertisementsData';
import { ALL_HOARDINGS, HoardingRecord } from '@/data/maharashtraDistrictsData';

export interface PrintInsertionRecord {
  id: string;
  publication: string;
  publicationMr: string;
  edition: string;
  editionMr: string;
  slot: string;
  slotMr: string;
  dimensions: string;
  ratePerSqCm: string;
  totalCost: string;
  insertionDate: string;
  tearSheetStatus: 'Verified by DIO' | 'Under Audit' | 'Digital Verified';
  tearSheetStatusMr: string;
}

export interface BroadcastSpotRecord {
  id: string;
  channel: string;
  channelMr: string;
  type: 'TV News Commercial' | 'Radio Jingle' | 'Digital Social Video';
  typeMr: string;
  programSlot: string;
  programSlotMr: string;
  spotsPerDay: number;
  durationSec: number;
  grossRatingPoints: string;
  complianceCert: string;
}

const PRINT_INSERTION_SCHEDULE: PrintInsertionRecord[] = [
  {
    id: 'PRN-LOK-01',
    publication: 'Loksatta (लोकसत्ता)',
    publicationMr: 'लोकसत्ता',
    edition: 'Mumbai & Konkan Mega Broadsheet',
    editionMr: 'मुंबई व कोकण महा-आवृत्ती',
    slot: 'Page 1 — Front Solus (Color)',
    slotMr: 'पान १ — मुख्य पान सोल्स (रंगीत)',
    dimensions: '24 cm × 16 cm (384 sq.cm)',
    ratePerSqCm: '₹ 620 / sq.cm',
    totalCost: '₹ 2,38,080',
    insertionDate: '24 Oct 2026',
    tearSheetStatus: 'Verified by DIO',
    tearSheetStatusMr: 'जिल्हा माहिती अधिकाऱ्यांकडून प्रमाणित',
  },
  {
    id: 'PRN-SAK-02',
    publication: 'Sakal (सकाळ)',
    publicationMr: 'सकाळ',
    edition: 'Pune & Western Maharashtra Edition',
    editionMr: 'पुणे व पश्चिम महाराष्ट्र आवृत्ती',
    slot: 'Page 3 — Governance & Mantralaya',
    slotMr: 'पान ३ — शासन निर्णय व विकास वार्ता',
    dimensions: '33 cm × 25 cm (Half Page)',
    ratePerSqCm: '₹ 540 / sq.cm',
    totalCost: '₹ 4,45,500',
    insertionDate: '24 Oct 2026',
    tearSheetStatus: 'Verified by DIO',
    tearSheetStatusMr: 'जिल्हा माहिती अधिकाऱ्यांकडून प्रमाणित',
  },
  {
    id: 'PRN-MT-03',
    publication: 'Maharashtra Times (महाराष्ट्र टाइम्स)',
    publicationMr: 'महाराष्ट्र टाइम्स',
    edition: 'Mumbai, Thane & MMR Broad Edition',
    editionMr: 'मुंबई, ठाणे व एमएमआर आवृत्ती',
    slot: 'Page 1 — Top Ear Panel + Solus',
    slotMr: 'पान १ — अग्रलेख कानपट्टी व सोल्स',
    dimensions: '20 cm × 12 cm (240 sq.cm)',
    ratePerSqCm: '₹ 580 / sq.cm',
    totalCost: '₹ 1,39,200',
    insertionDate: '24 Oct 2026',
    tearSheetStatus: 'Digital Verified',
    tearSheetStatusMr: 'डिजिटल कात्रण पडताळणी पूर्ण',
  },
  {
    id: 'PRN-LMT-04',
    publication: 'Lokmat (लोकमत)',
    publicationMr: 'लोकमत',
    edition: 'Vidarbha & Marathwada Network',
    editionMr: 'विदर्भ व मराठवाडा सर्व आवृत्त्या',
    slot: 'Page 5 — Krishi & Rural Development',
    slotMr: 'पान ५ — कृषी व ग्रामीण विकास पान',
    dimensions: '33 cm × 16 cm (528 sq.cm)',
    ratePerSqCm: '₹ 490 / sq.cm',
    totalCost: '₹ 2,58,720',
    insertionDate: '23 Oct 2026',
    tearSheetStatus: 'Verified by DIO',
    tearSheetStatusMr: 'जिल्हा माहिती अधिकाऱ्यांकडून प्रमाणित',
  },
  {
    id: 'PRN-PDH-05',
    publication: 'Pudhari (पुढारी)',
    publicationMr: 'पुढारी',
    edition: 'Kolhapur, Sangli, Satara & South Konkan',
    editionMr: 'कोल्हापूर, सांगली, सातारा व दक्षिण कोकण',
    slot: 'Page 3 — State Announcements',
    slotMr: 'पान ३ — राज्य विशेष घोषणा',
    dimensions: '24 cm × 16 cm (384 sq.cm)',
    ratePerSqCm: '₹ 380 / sq.cm',
    totalCost: '₹ 1,45,920',
    insertionDate: '24 Oct 2026',
    tearSheetStatus: 'Verified by DIO',
    tearSheetStatusMr: 'जिल्हा माहिती अधिकाऱ्यांकडून प्रमाणित',
  },
  {
    id: 'PRN-IE-06',
    publication: 'The Indian Express',
    publicationMr: 'द इंडियन एक्सप्रेस',
    edition: 'Mumbai & Pune Metro Editions',
    editionMr: 'मुंबई व पुणे मेट्रो आवृत्ती',
    slot: 'Page 4 — National & Governance',
    slotMr: 'पान ४ — राष्ट्रीय व प्रशासन',
    dimensions: '20 cm × 16 cm (320 sq.cm)',
    ratePerSqCm: '₹ 610 / sq.cm',
    totalCost: '₹ 1,95,200',
    insertionDate: '24 Oct 2026',
    tearSheetStatus: 'Digital Verified',
    tearSheetStatusMr: 'डिजिटल कात्रण पडताळणी पूर्ण',
  },
];

const BROADCAST_SPOTS_SCHEDULE: BroadcastSpotRecord[] = [
  {
    id: 'BC-TV-01',
    channel: 'DD Sahyadri (दूरदर्शन सह्याद्री)',
    channelMr: 'दूरदर्शन सह्याद्री',
    type: 'TV News Commercial',
    typeMr: 'दूरचित्रवाणी जाहिरात',
    programSlot: 'Special Prime Time (19:00 - 21:00)',
    programSlotMr: 'प्राईम टाईम वृत्त बुलेटिन',
    spotsPerDay: 16,
    durationSec: 30,
    grossRatingPoints: '8.4 GRP',
    complianceCert: 'CERT-DIPR-TV-842',
  },
  {
    id: 'BC-TV-02',
    channel: 'ABP Majha (एबीपी माझा)',
    channelMr: 'एबीपी माझा',
    type: 'TV News Commercial',
    typeMr: 'दूरचित्रवाणी जाहिरात',
    programSlot: 'Maha-Fast 50 & 9 PM Prime Debate',
    programSlotMr: 'फास्ट ५० व रात्री ९ ची विशेष चर्चा',
    spotsPerDay: 12,
    durationSec: 25,
    grossRatingPoints: '11.2 GRP',
    complianceCert: 'CERT-DIPR-TV-843',
  },
  {
    id: 'BC-TV-03',
    channel: 'TV9 Marathi (टीव्ही ९ मराठी)',
    channelMr: 'टीव्ही ९ मराठी',
    type: 'TV News Commercial',
    typeMr: 'दूरचित्रवाणी जाहिरात',
    programSlot: 'Morning 8 AM & Evening 7 PM Despatch',
    programSlotMr: 'सकाळचे ८ व सायंकाळी ७ चे वार्तापत्र',
    spotsPerDay: 14,
    durationSec: 30,
    grossRatingPoints: '9.8 GRP',
    complianceCert: 'CERT-DIPR-TV-844',
  },
  {
    id: 'BC-RD-04',
    channel: 'All India Radio (आकाशवाणी मुंबई व ३६ रिले)',
    channelMr: 'आकाशवाणी केंद्र जाळे',
    type: 'Radio Jingle',
    typeMr: 'रेडिओ जिंगल व उद्घोषणा',
    programSlot: 'Morning Rural Farm Broadcast & Evening News',
    programSlotMr: 'प्रभात वृत्त व शेतकी वार्ता',
    spotsPerDay: 24,
    durationSec: 20,
    grossRatingPoints: '14.5 GRP',
    complianceCert: 'CERT-AIR-MUM-991',
  },
  {
    id: 'BC-DIG-05',
    channel: 'DGIPR Maha-Social Digital Network',
    channelMr: 'महा-सोशल डिजिटल नेटवर्क',
    type: 'Digital Social Video',
    typeMr: 'डिजिटल व्हिडिओ व रील्स',
    programSlot: 'YouTube Pre-roll, Meta Reels & X Promoted',
    programSlotMr: 'यूट्यूब, मेटा व एक्स प्रायोजित रील्स',
    spotsPerDay: 48,
    durationSec: 45,
    grossRatingPoints: '2.4M Views / Day',
    complianceCert: 'CERT-SOC-2026-X1',
  },
];

export const AdvertisementsScreen: React.FC = () => {
  const { language, setToast } = useDashboardStore();
  const searchParams = useSearchParams();
  const tabQuery = searchParams?.get('tab');

  const [activeTab, setActiveTab] = useState<'campaigns' | 'hoardings' | 'print' | 'broadcast'>(
    tabQuery === 'hoardings' ? 'hoardings' : 'campaigns'
  );
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoardingViewMode, setHoardingViewMode] = useState<'cards' | 'table'>('cards');

  // Modal inspection states
  const [selectedRO, setSelectedRO] = useState<StateAdvertisement | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<StateAdvertisement | null>(null);
  const [selectedHoarding, setSelectedHoarding] = useState<HoardingRecord | null>(null);

  // DGPR DAVP Rate Calculator state
  const [showRateCalculator, setShowRateCalculator] = useState<boolean>(false);
  const [calcMediaType, setCalcMediaType] = useState<'print' | 'hoarding' | 'tv' | 'radio'>('print');
  const [calcSize, setCalcSize] = useState<number>(384); // sq.cm or spots
  const [calcTier, setCalcTier] = useState<'A' | 'B' | 'C'>('A');
  const [hoardingLuxMode, setHoardingLuxMode] = useState<'day' | 'night'>('day');

  // Sync tab with URL if user clicked from sidebar
  useEffect(() => {
    if (tabQuery === 'hoardings') {
      setActiveTab('hoardings');
    }
  }, [tabQuery]);

  const filteredAds = useMemo(() => {
    return STATE_ADVERTISEMENTS_DATA.filter((ad) => {
      const matchesMedia = selectedMediaType === 'all' || ad.mediaType === selectedMediaType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        ad.campaignTitle.toLowerCase().includes(q) ||
        ad.campaignTitleMr.toLowerCase().includes(q) ||
        ad.department.toLowerCase().includes(q) ||
        ad.departmentMr.toLowerCase().includes(q) ||
        ad.roNumber.toLowerCase().includes(q);
      return matchesMedia && matchesSearch;
    });
  }, [selectedMediaType, searchQuery]);

  const filteredHoardings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ALL_HOARDINGS.filter((h) => {
      const matchesDistrict = selectedDistrict === 'all' || h.districtName.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        h.districtName.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.campaign.toLowerCase().includes(q) ||
        h.department.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q);
      return matchesDistrict && matchesSearch;
    });
  }, [selectedDistrict, searchQuery]);

  const filteredPrint = useMemo(() => {
    if (!searchQuery) return PRINT_INSERTION_SCHEDULE;
    const q = searchQuery.toLowerCase();
    return PRINT_INSERTION_SCHEDULE.filter(
      (p) =>
        p.publication.toLowerCase().includes(q) ||
        p.edition.toLowerCase().includes(q) ||
        p.slot.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const distinctDistricts = useMemo(() => {
    const set = new Set<string>();
    ALL_HOARDINGS.forEach((h) => set.add(h.districtName));
    return Array.from(set).sort();
  }, []);

  const handleExportRO = (roNumber: string) => {
    setToast({
      message:
        language === 'mr'
          ? `प्रसिद्धी आदेश (${roNumber}) अधिकृत शासन आदेश प्रत डाउनलोड झाली.`
          : `Official Release Order (${roNumber}) Sanction PDF exported.`,
      type: 'success',
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1740px] w-full mx-auto space-y-6">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold mb-2">
            <MaterialIcon name="campaign" size="xs" />
            <span>
              {language === 'mr'
                ? 'माहिती व जनसंपर्क महासंचालनालय (DGPR) • जाहिरात व मोहीम नियंत्रण कक्ष'
                : 'DGPR Advertising & Media Campaign Management Wing'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <MaterialIcon name="newspaper" size="md" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? 'शासकीय जाहिराती, होर्डिंग्ज व मोहीम व्यवस्थापन दालन'
                : 'State Advertisements, Outdoor Hoardings & Campaign Releases'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'वर्तमानपत्र जाहिराती, १४० प्रमाणित होर्डिंग्ज, टीव्ही स्पॉट्स व डिजिटल मोहिमांचे अधिकृत प्रसिद्धी आदेश (RO) आणि प्रत्यक्ष ऑडिट पडताळणी.'
              : 'Official Release Orders (ROs), 140 GPS-geotagged hoardings, accredited print dailies, TV commercials, and citizen reach audit.'}
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowRateCalculator(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-amber-300 shadow-2xs"
          >
            <MaterialIcon name="description" size="xs" />
            <span>{language === 'mr' ? 'डीएव्हीपी दर गणक' : 'DAVP Rate Calculator'}</span>
          </button>

          <button
            onClick={() =>
              setToast({
                message:
                  language === 'mr'
                    ? 'सर्व ४२ सक्रिय प्रसिद्धी आदेश (DGPR-RO-Ledger-2026.csv) यशस्वीरीत्या एक्सपोर्ट झाले.'
                    : 'All 42 active Release Orders exported (DGPR-RO-Ledger-2026.csv).',
                type: 'success',
              })
            }
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MaterialIcon name="download" size="xs" />
            <span>{language === 'mr' ? 'सर्व RO एक्सपोर्ट (CSV)' : 'Export ROs'}</span>
          </button>

          <button
            onClick={() =>
              setToast({
                message: language === 'mr' ? 'DGPR दर सूची २०२६ डाउनलोड झाली.' : 'DGPR Approved Rate Card 2026 downloaded.',
                type: 'info',
              })
            }
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MaterialIcon name="description" size="xs" />
            <span>{language === 'mr' ? 'डीजीपीआर दर सूची' : 'DGPR Rate Card'}</span>
          </button>

          <button
            onClick={() =>
              setToast({
                message: language === 'mr' ? 'नवीन प्रसिद्धी आदेश मसुदा तयार.' : 'New Release Order drafting wizard initiated.',
                type: 'info',
              })
            }
            className="px-3.5 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <MaterialIcon name="campaign" size="xs" />
            <span>{language === 'mr' ? 'नवीन प्रसिद्धी आदेश (RO)' : 'Issue Release Order'}</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME FISCAL & REACH METRIC RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'सक्रिय प्रसिद्धी आदेश' : 'Active Release Orders'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">42 Orders</div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Budget Authorized</span>
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'मंजूर मोहीम बजेट' : 'Authorized Campaign Budget'}
          </span>
          <div className="text-2xl font-black text-amber-700 my-1">₹ 34.80 Cr</div>
          <span className="text-[11px] text-slate-500">DGPR Account Head 2220</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'अधिकृत वृत्तपत्रे' : 'Accredited Print Dailies'}
          </span>
          <div className="text-2xl font-black text-blue-700 my-1">64 Dailies</div>
          <span className="text-[11px] text-slate-500">Marathi, Hindi, English</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'प्रमाणित होर्डिंग्ज' : 'GPS-Geotagged Hoardings'}
          </span>
          <div className="text-2xl font-black text-purple-700 my-1">140 Sites</div>
          <span className="text-[11px] text-purple-700 font-semibold">100% Inspected & Fit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'प्रमाणित पोहोच (नागरिक)' : 'Verified Citizen Reach'}
          </span>
          <div className="text-2xl font-black text-emerald-700 my-1">4.24 Crore</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Audited Citizen Impact</span>
        </div>
      </div>

      {/* 3. OPERATIONAL NAVIGATION TABS & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'campaigns', label: language === 'mr' ? 'प्रसिद्धी आदेश (RO) मोहिमा' : 'Campaign Release Orders', count: '6 Main' },
            { id: 'hoardings', label: language === 'mr' ? 'राज्यव्यापी होर्डिंग्ज नोंदवही' : 'Outdoor Hoardings (140)', count: '140 Sites' },
            { id: 'print', label: language === 'mr' ? 'वृत्तपत्र प्रसिद्धी वेळापत्रक' : 'Print Media Insertion Matrix', count: '6 Dailies' },
            { id: 'broadcast', label: language === 'mr' ? 'टीव्ही व रेडिओ ब्रॉडकास्ट' : 'TV & Radio Broadcast Spots', count: '5 Feeds' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gov-primary text-white border-gov-primary shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Keyword Search */}
        <div className="relative min-w-[260px] max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'मोहीम, विभाग, होर्डिंग किंवा RO शोधा...'
                : 'Search campaign, department, RO #...'
            }
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-blue focus:bg-white transition-all"
          />
          <MaterialIcon
            name="search"
            size="xs"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      {/* 4. TAB 1: CAMPAIGN RELEASE ORDERS DOSSIER */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Media Format Filter Ribbon */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: language === 'mr' ? 'सर्व माध्यमे' : 'All Formats' },
              { id: 'Print Newspaper', label: language === 'mr' ? 'वृत्तपत्र जाहिराती' : 'Print Newspapers' },
              { id: 'Outdoor Hoarding', label: language === 'mr' ? 'होर्डिंग्ज व फलक' : 'Outdoor Hoardings' },
              { id: 'Digital & Social', label: language === 'mr' ? 'डिजिटल व सोशल' : 'Digital & Social' },
              { id: 'Radio & Audio', label: language === 'mr' ? 'रेडिओ जिंगल' : 'Radio Jingles' },
              { id: 'TV Commercial', label: language === 'mr' ? 'टीव्ही जाहिराती' : 'TV Commercials' },
            ].map((media) => (
              <button
                key={media.id}
                onClick={() => setSelectedMediaType(media.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  selectedMediaType === media.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {media.label}
              </button>
            ))}
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between h-full space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Card Top Pill Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-300">
                      {ad.roNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{language === 'mr' ? ad.statusMr : ad.status}</span>
                    </span>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {language === 'mr' ? ad.campaignTitleMr : ad.campaignTitle}
                    </h3>
                    <span className="text-xs text-slate-500 block mt-1">
                      {language === 'mr' ? ad.departmentMr : ad.department}
                    </span>
                  </div>

                  {/* Miniature Campaign Creative Banner Simulation */}
                  <div
                    onClick={() => setSelectedCreative(ad)}
                    className="aspect-[21/9] rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-3 text-white flex flex-col justify-between border border-slate-700 shadow-inner cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all group"
                    title="Click to view full-size creative artwork"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono tracking-wider text-amber-300">
                      <span>GOVT OF MAHARASHTRA • DGIPR</span>
                      <span className="group-hover:underline flex items-center gap-0.5">
                        <span>Creative Preview</span>
                        <MaterialIcon name="open_in_new" size="xs" />
                      </span>
                    </div>

                    <div className="py-1">
                      <h4 className="text-xs font-black font-serif text-white line-clamp-1 drop-shadow-md">
                        {language === 'mr' ? ad.campaignTitleMr : ad.campaignTitle}
                      </h4>
                      <p className="text-[10px] text-amber-200/90 truncate">
                        {language === 'mr' ? ad.departmentMr : ad.department} • Ref #{ad.schemeCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 border-t border-white/20 pt-1">
                      <span>Format: {ad.mediaType}</span>
                      <span className="text-emerald-400 font-bold">100% Verified</span>
                    </div>
                  </div>

                  {/* Operational Metrics Sub-Grid */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {language === 'mr' ? 'माध्यम प्रकार' : 'Format'}
                      </span>
                      <strong className="text-slate-800 text-xs">
                        {language === 'mr' ? ad.mediaTypeMr : ad.mediaType}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {language === 'mr' ? 'मंजूर बजेट' : 'Budget'}
                      </span>
                      <strong className="text-amber-800 font-mono text-xs">{ad.budgetAllocated}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {language === 'mr' ? 'कालावधी' : 'Duration'}
                      </span>
                      <span className="text-slate-700 text-[11px] font-mono">
                        {ad.releaseDate} – {ad.endDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        {language === 'mr' ? 'पडताळणी पोहोच' : 'Citizen Reach'}
                      </span>
                      <span className="text-emerald-700 font-bold text-xs">{ad.verifiedImpressions}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <button
                    onClick={() => setSelectedRO(ad)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <MaterialIcon name="description" size="xs" />
                    <span>{language === 'mr' ? 'RO आदेश पहा' : 'View RO'}</span>
                  </button>

                  <button
                    onClick={() => handleExportRO(ad.roNumber)}
                    className="px-3 py-1.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <MaterialIcon name="download" size="xs" />
                    <span>{language === 'mr' ? 'डाउनलोड' : 'Export'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 2: OUTDOOR HOARDINGS & DIGITAL DISPLAYS LEDGER */}
      {activeTab === 'hoardings' && (
        <div className="space-y-4">
          {/* Hoardings Filter & View Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-600">
                {language === 'mr' ? 'जिल्हा निवडा:' : 'Filter District:'}
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 outline-none"
              >
                <option value="all">{language === 'mr' ? 'सर्व ३६ जिल्हे (All Districts)' : 'All 36 Districts'}</option>
                {distinctDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {filteredHoardings.length} Sites Verified
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHoardingViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hoardingViewMode === 'cards'
                    ? 'bg-gov-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🖼️ {language === 'mr' ? 'कार्ड व्ह्यू' : 'Visual Cards'}
              </button>
              <button
                onClick={() => setHoardingViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hoardingViewMode === 'table'
                    ? 'bg-gov-primary text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📋 {language === 'mr' ? 'तक्ता नोंदवही' : 'Registry Table'}
              </button>
            </div>
          </div>

          {/* Visual Cards View */}
          {hoardingViewMode === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHoardings.slice(0, 36).map((h) => (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4.5 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    {/* Site Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {h.id}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {h.status}
                      </span>
                    </div>

                    {/* District & Location */}
                    <div>
                      <strong className="text-slate-900 text-sm block">{h.districtName}</strong>
                      <span className="text-xs text-slate-600 block line-clamp-1">{h.location}</span>
                    </div>

                    {/* Visual Billboard Display Representation */}
                    <div
                      onClick={() => setSelectedHoarding(h)}
                      className="aspect-[16/9] rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-slate-900 p-3.5 text-white flex flex-col justify-between border border-amber-600/40 shadow-inner cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all"
                      title="Click to view full inspection photo"
                    >
                      <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-amber-300">
                        <span>MAHARASHTRA GOVT • OUTDOOR</span>
                        <span className="bg-emerald-500/90 text-white px-1.5 py-0.2 rounded font-bold">VERIFIED</span>
                      </div>
                      <div className="py-1 text-center">
                        <h4 className="text-xs font-black font-serif text-white line-clamp-2 drop-shadow-md">
                          {h.campaign}
                        </h4>
                        <span className="text-[10px] text-amber-200 block mt-0.5">{h.department}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-300 border-t border-white/20 pt-1">
                        <span>{h.size}</span>
                        <span>{h.impressionsDaily} / day</span>
                      </div>
                    </div>

                    {/* Geotag & Audit Info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      <span>GPS: {h.geotag.lat.toFixed(2)}, {h.geotag.lng.toFixed(2)}</span>
                      <span>Verified: {h.verifiedDate}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setSelectedHoarding(h)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-gov-primary hover:text-white text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MaterialIcon name="image" size="xs" />
                    <span>{language === 'mr' ? 'तपशील व छायाचित्र पहा' : 'Inspect Geotag Site'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {hoardingViewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">{language === 'mr' ? 'आयडी व जिल्हा' : 'Site ID & District'}</th>
                      <th className="px-3 py-3">{language === 'mr' ? 'स्थान व चौक' : 'Location & Landmark'}</th>
                      <th className="px-3 py-3">{language === 'mr' ? 'मोहीम व विभाग' : 'Campaign & Dept'}</th>
                      <th className="px-3 py-3">{language === 'mr' ? 'आकारमान' : 'Dimensions'}</th>
                      <th className="px-3 py-3">{language === 'mr' ? 'दैनिक पोहोच' : 'Daily Reach'}</th>
                      <th className="px-3 py-3">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                      <th className="px-4 py-3 text-right">{language === 'mr' ? 'कृती' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHoardings.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-amber-700 block">{h.id}</span>
                          <span className="text-slate-900 font-semibold">{h.districtName}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-slate-800 block">{h.location}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            GPS: {h.geotag.lat.toFixed(3)}, {h.geotag.lng.toFixed(3)}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <strong className="text-slate-900 block">{h.campaign}</strong>
                          <span className="text-[11px] text-slate-500">{h.department}</span>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-700">{h.size}</td>
                        <td className="px-3 py-3 font-mono text-emerald-700 font-semibold">{h.impressionsDaily}</td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {h.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedHoarding(h)}
                            className="px-2.5 py-1 bg-gov-primary hover:bg-gov-primary-dark text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                          >
                            {language === 'mr' ? 'पहा' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: PRINT NEWSPAPER INSERTION MATRIX & DGIPR RATES */}
      {activeTab === 'print' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'mr'
                  ? 'वृत्तपत्र प्रसिद्धी वेळापत्रक व डीजीआयपीआर दर लेखापरीक्षण'
                  : 'Print Media Insertion Matrix & DGIPR Approved Rates Schedule'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? 'सर्व वृत्तपत्रांमधील पानांचे स्थान, आकारमान व अधिकृत जिल्हा माहिती अधिकारी कात्रण पडताळणी.'
                  : 'Accredited newsprint insertions with certified rate cards, page slots, and DIO verification.'}
              </p>
            </div>

            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              DAVP & DGIPR 2026 Audit Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">{language === 'mr' ? 'वृत्तपत्र व आवृत्ती' : 'Publication & Edition'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'पानाचे स्थान (Slot)' : 'Page Slot & Placement'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'आकारमान (Dimensions)' : 'Dimensions (sq.cm)'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'डीजीआयपीआर दर' : 'Approved Rate'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'एकूण रक्कम' : 'Total Cost'}</th>
                  <th className="px-3 py-3">{language === 'mr' ? 'कात्रण पडताळणी' : 'Tear-sheet Status'}</th>
                  <th className="px-4 py-3 text-right">{language === 'mr' ? 'कृती' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrint.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <strong className="text-slate-900 text-xs block">{p.publication}</strong>
                      <span className="text-[11px] text-slate-500">{p.edition}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="font-semibold text-slate-800 block">{p.slot}</span>
                      <span className="text-[10px] font-mono text-slate-400">Date: {p.insertionDate}</span>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-slate-700">{p.dimensions}</td>
                    <td className="px-3 py-3.5 font-mono text-slate-800 font-semibold">{p.ratePerSqCm}</td>
                    <td className="px-3 py-3.5 font-mono text-emerald-800 font-bold">{p.totalCost}</td>
                    <td className="px-3 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.tearSheetStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() =>
                          setToast({
                            message: `Tear-sheet voucher for ${p.publication} verified and archived.`,
                            type: 'success',
                          })
                        }
                        className="px-2.5 py-1 bg-slate-100 hover:bg-gov-primary hover:text-white text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {language === 'mr' ? 'कात्रण पहा' : 'View Voucher'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 4: TV COMMERCIALS, RADIO JINGLES & DIGITAL SOCIAL BROADCAST */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BROADCAST_SPOTS_SCHEDULE.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {b.id}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {b.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{b.channel}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{b.programSlot}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">दैनिक स्पॉट्स</span>
                    <strong className="text-slate-800 font-mono">{b.spotsPerDay} Spots/Day</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">कालावधी</span>
                    <strong className="text-slate-800 font-mono">{b.durationSec} Seconds</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">टीआरपी / रीच</span>
                    <strong className="text-emerald-700 font-mono">{b.grossRatingPoints}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">प्रमाणपत्र</span>
                    <span className="text-slate-600 font-mono text-[10px]">{b.complianceCert}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setToast({
                    message: `Broadcast compliance audit certified for ${b.channel}.`,
                    type: 'success',
                  })
                }
                className="w-full py-2 bg-slate-100 hover:bg-gov-primary hover:text-white text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <MaterialIcon name="tv" size="xs" />
                <span>{language === 'mr' ? 'प्रक्षेपण अहवाल पहा' : 'View Broadcast Telecast Log'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 8. MODAL 1: AUTHENTIC GOVERNMENT RELEASE ORDER (RO) SANCTION DOSSIER */}
      {selectedRO && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 border border-slate-300">
            {/* Sanction Header */}
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="description" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm font-mono">
                  RELEASE ORDER: {selectedRO.roNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedRO(null)}
                className="text-slate-300 hover:text-white cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            {/* Official Gazette Style Content */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-sans text-xs text-slate-800">
              {/* Official Seal Banner */}
              <div className="text-center border-b border-slate-200 pb-3 space-y-1">
                <div className="font-serif font-black text-sm tracking-wider text-slate-900 uppercase">
                  महाराष्ट्र शासन — माहिती व जनसंपर्क महासंचालनालय
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  मंत्रालय, मुंबई - ४०० ०३२ • जाहिरात व माध्यम प्रसिद्धी शाखा
                </div>
                <div className="font-mono text-[10px] text-amber-800 font-bold">
                  जा.क्र. मजनसं/जाहिरात-शाखा/२०२६/प्र.क्र.{selectedRO.roNumber.slice(-4)}
                </div>
              </div>

              {/* Sanction Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">प्रायोजक विभाग</span>
                  <strong className="text-slate-900">{selectedRO.departmentMr} ({selectedRO.department})</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">योजना संकेतांक</span>
                  <strong className="text-slate-900 font-mono">{selectedRO.schemeCode}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">मंजूर वित्तीय तरतूद</span>
                  <strong className="text-amber-800 font-mono text-sm">{selectedRO.budgetAllocated}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">प्रसिद्धी कालावधी</span>
                  <span className="text-slate-700 font-mono">{selectedRO.releaseDate} – {selectedRO.endDate}</span>
                </div>
              </div>

              {/* Text of Order */}
              <div className="space-y-2 border border-slate-200 p-3.5 rounded-xl bg-amber-50/20">
                <strong className="text-slate-900 block font-serif">विषय: {selectedRO.campaignTitleMr}</strong>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  उपरोक्त विषयासंदर्भात कळविण्यात येते की, माहिती व जनसंपर्क महासंचालनालयाच्या अधिकृत सूचीतील वृत्तपत्रे, नियतकालिके व माध्यम गृहांमध्ये सदर जाहिरात प्रसिद्ध करण्यास मंजुरी देण्यात येत आहे. सर्व बिल देयके शासकीय विहित दर (DGPR Approved Rate Card) नुसार सादर करावीत.
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Authorized by: Deputy Director (Advertising), DGPR</span>
                  <span className="text-emerald-700 font-bold">✓ Digitally Signed</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedRO(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  बंद करा (Close)
                </button>
                <button
                  onClick={() => handleExportRO(selectedRO.roNumber)}
                  className="px-4 py-2 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MaterialIcon name="download" size="xs" />
                  <span>अधिकृत प्रत डाउनलोड (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL 2: FULL-SIZE ADVERTISEMENT CREATIVE ARTWORK */}
      {selectedCreative && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 border border-slate-300">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="image" size="sm" className="text-amber-400" />
                <span className="font-bold text-sm">
                  {selectedCreative.campaignTitle}
                </span>
              </div>
              <button
                onClick={() => setSelectedCreative(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Creative Graphic Frame */}
              <div className="aspect-[16/10] bg-gradient-to-br from-amber-600 via-amber-700 to-slate-900 rounded-2xl p-6 flex flex-col justify-between text-white border-4 border-amber-500/60 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-white/20 pb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest text-amber-200 font-bold uppercase block">
                      GOVERNMENT OF MAHARASHTRA • DGIPR
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {selectedCreative.departmentMr}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold font-mono">
                    APPROVED ARTWORK
                  </span>
                </div>

                <div className="py-4 text-center space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/40 inline-block">
                    {selectedCreative.mediaTypeMr}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-white drop-shadow-lg leading-tight">
                    {selectedCreative.campaignTitleMr}
                  </h2>
                  <p className="text-xs text-amber-100 max-w-md mx-auto leading-relaxed">
                    सर्व पात्र नागरिकांना थेट लाभ मिळण्यासाठी शासनाचा ऐतिहासिक निर्णय. अधिक माहितीसाठी संपर्क: १८००-१२०-८०४०
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-white/20 pt-2 text-[10px] text-slate-300 font-mono">
                  <span>RO Ref: {selectedCreative.roNumber}</span>
                  <span>Verified Citizen Reach: {selectedCreative.verifiedImpressions}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  Dimensions: 33cm × 25cm • Color CMYK
                </span>
                <button
                  onClick={() => setSelectedCreative(null)}
                  className="px-4 py-2 bg-gov-primary text-white rounded-lg text-xs font-bold hover:bg-gov-primary-dark cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL 3: OUTDOOR HOARDING INSPECTION PHOTO & GEOTAG DOSSIER */}
      {selectedHoarding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 border border-slate-300">
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="pin_drop" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm">
                  {selectedHoarding.id} — {selectedHoarding.districtName}
                </span>
              </div>
              <button
                onClick={() => setSelectedHoarding(null)}
                className="text-slate-300 hover:text-white cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Day / Night Proof of Performance Inspection View */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setHoardingLuxMode('day')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    hoardingLuxMode === 'day' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {language === 'mr' ? 'दैनिक तपासणी (Day Clear)' : 'Daytime Inspection'}
                </button>
                <button
                  onClick={() => setHoardingLuxMode('night')}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    hoardingLuxMode === 'night' ? 'bg-slate-900 text-amber-400 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {language === 'mr' ? 'रात्रीची प्रकाश तपासणी (248 Lux)' : 'Night Illumination (248 Lux)'}
                </button>
              </div>

              {/* Simulated High-Res Billboard Photo */}
              <div
                className={`aspect-[16/9] rounded-xl p-4 flex flex-col justify-between text-white border-2 shadow-inner transition-all ${
                  hoardingLuxMode === 'night'
                    ? 'bg-slate-950 border-amber-400/80 shadow-amber-500/20 shadow-lg'
                    : 'bg-linear-to-br from-amber-700 via-amber-800 to-slate-900 border-amber-500/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                    GOVERNMENT OF MAHARASHTRA • DGPR
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">
                    {hoardingLuxMode === 'night' ? '248 LUX ILLUMINATED' : 'GPS VERIFIED'}
                  </span>
                </div>

                <div className="text-center py-2">
                  <h3 className="text-lg font-black font-serif text-white drop-shadow-md">
                    {language === 'mr' ? selectedHoarding.campaignMr : selectedHoarding.campaign}
                  </h3>
                  <p className="text-xs text-amber-200 mt-1">
                    {language === 'mr' ? selectedHoarding.departmentMr : selectedHoarding.department}
                  </p>
                </div>

                <div className="flex justify-between text-[10px] text-slate-300 border-t border-white/20 pt-1">
                  <span>{selectedHoarding.size}</span>
                  <span>{selectedHoarding.location}</span>
                </div>
              </div>

              {/* Geotag Coordinates & Stability Certificate */}
              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-semibold text-slate-900">{selectedHoarding.location}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Daily Traffic Reach:</span>
                  <span className="font-semibold text-emerald-700">{selectedHoarding.impressionsDaily}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Structural Stability Audit:</span>
                  <span className="font-semibold text-slate-900">Certified by PWD (Valid till 2027)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-500">Light Meter Lux Rating:</span>
                  <span className="font-semibold text-emerald-700">248 Lux (Standard &gt;= 200 Lux PASS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {selectedHoarding.geotag.lat.toFixed(4)}, {selectedHoarding.geotag.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHoarding(null)}
                className="w-full py-2 bg-gov-primary text-white rounded-lg text-xs font-bold hover:bg-gov-primary-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. MODAL 4: INTERACTIVE DGPR DAVP RATE ESTIMATOR CALCULATOR */}
      {showRateCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 border border-slate-300">
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="table_chart" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm">
                  {language === 'mr' ? 'डीजीपीआर डीएव्हीपी दर गणक (Rate Calculator)' : 'DGPR DAVP Sanction Rate Estimator'}
                </span>
              </div>
              <button
                onClick={() => setShowRateCalculator(false)}
                className="text-slate-300 hover:text-white cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-800">
              {/* Media Type Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                  {language === 'mr' ? 'माध्यम प्रकार निवडा' : 'Select Media Category'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'print', label: language === 'mr' ? 'वृत्तपत्र' : 'Print' },
                    { id: 'hoarding', label: language === 'mr' ? 'होर्डिंग' : 'Hoarding' },
                    { id: 'tv', label: language === 'mr' ? 'टीव्ही' : 'TV News' },
                    { id: 'radio', label: language === 'mr' ? 'रेडिओ' : 'Radio FM' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setCalcMediaType(m.id as typeof calcMediaType)}
                      className={`py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        calcMediaType === m.id
                          ? 'bg-gov-primary text-white border-gov-primary shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier / Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                  {language === 'mr' ? 'सर्क्युलेशन / प्रसार श्रेणी' : 'Circulation Tier'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'A', label: 'Tier A (State Mega)' },
                    { id: 'B', label: 'Tier B (Divisional)' },
                    { id: 'C', label: 'Tier C (District)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCalcTier(t.id as typeof calcTier)}
                      className={`py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                        calcTier === t.id
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Units / Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    {calcMediaType === 'print'
                      ? (language === 'mr' ? 'जाहिरात आकार (चौ. सेंमी.)' : 'Ad Size (sq. cm)')
                      : calcMediaType === 'hoarding'
                      ? (language === 'mr' ? 'कालावधी (दिवस)' : 'Display Days')
                      : (language === 'mr' ? '१० सेकंद स्पॉट्स संख्या' : '10-Sec Commercial Spots')}
                  </span>
                  <span className="font-mono font-bold text-gov-primary text-sm">{calcSize}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={calcSize}
                  onChange={(e) => setCalcSize(Number(e.target.value))}
                  className="w-full accent-gov-primary cursor-pointer"
                />
              </div>

              {/* Live Calculation Output */}
              {(() => {
                const baseUnitRate =
                  calcMediaType === 'print'
                    ? (calcTier === 'A' ? 620 : calcTier === 'B' ? 380 : 210)
                    : calcMediaType === 'hoarding'
                    ? (calcTier === 'A' ? 2800 : calcTier === 'B' ? 1500 : 850)
                    : calcMediaType === 'tv'
                    ? (calcTier === 'A' ? 12000 : calcTier === 'B' ? 6500 : 3200)
                    : (calcTier === 'A' ? 800 : calcTier === 'B' ? 450 : 250);

                const gross = baseUnitRate * calcSize;
                const davpDiscount = gross * 0.15; // 15% DGPR DAVP Concession
                const taxable = gross - davpDiscount;
                const gst = taxable * 0.05; // 5% GST
                const netPayable = taxable + gst;

                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>{language === 'mr' ? 'मुळ दर (Base Card Rate):' : 'Gross Card Rate:'}</span>
                      <span className="font-mono">₹ {gross.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>{language === 'mr' ? 'डीएव्हीपी शासकीय सवलत (१५%):' : 'DAVP Govt Concession (15%):'}</span>
                      <span className="font-mono">- ₹ {davpDiscount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>{language === 'mr' ? 'जीएसटी (५%):' : 'GST (5%):'}</span>
                      <span className="font-mono">+ ₹ {gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-sm font-black text-slate-900">
                      <span>{language === 'mr' ? 'अंतिम देय प्रशासकीय मान्यता:' : 'Net Sanction Payable:'}</span>
                      <span className="text-gov-primary font-mono text-base">₹ {netPayable.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  onClick={() => setShowRateCalculator(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    setShowRateCalculator(false);
                    setToast({
                      message:
                        language === 'mr'
                          ? 'डीएव्हीपी दर पत्रक व शासकीय अंदाज मसुदा यशस्वीरीत्या तयार झाला.'
                          : 'Official DAVP rate estimate draft generated successfully.',
                      type: 'success',
                    });
                  }}
                  className="px-4 py-2 bg-gov-primary text-white rounded-xl font-bold hover:bg-gov-primary-dark transition-all shadow-xs cursor-pointer"
                >
                  {language === 'mr' ? 'अंदाजपत्रक मसुदा तयार करा' : 'Generate Sanction Estimate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementsScreen;
