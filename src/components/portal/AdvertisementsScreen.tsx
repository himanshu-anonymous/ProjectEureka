'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { STATE_ADVERTISEMENTS_DATA, StateAdvertisement } from '@/data/advertisementsData';
import { ALL_HOARDINGS, HoardingRecord, DISTRICT_DETAILS_BY_ID } from '@/data/maharashtraDistrictsData';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
import { EnhancedMaharashtraGISMap } from '@/components/dashboard/EnhancedMaharashtraGISMap';
import { getHoardingPhoto, getAdvertisementCreativePhoto } from '@/data/advertisementMediaAssets';

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
  const { language, setToast, selectedDistrictId, setSelectedDistrictId } = useDashboardStore();
  const searchParams = useSearchParams();
  const tabQuery = searchParams?.get('tab');

  const [activeTab, setActiveTab] = useState<'map' | 'hoardings' | 'campaigns' | 'print' | 'broadcast'>(
    tabQuery === 'hoardings' ? 'hoardings' : tabQuery === 'campaigns' ? 'campaigns' : 'map'
  );
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoardingViewMode, setHoardingViewMode] = useState<'map' | 'cards' | 'table'>('map');
  const [hoardingLastSynced, setHoardingLastSynced] = useState<string>('26 Oct 2026, 02:15:30 AM IST');
  const [isSyncingHoardings, setIsSyncingHoardings] = useState<boolean>(false);

  // Synchronize map district click to selectedDistrict
  useEffect(() => {
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      const dName = DISTRICT_DETAILS_BY_ID[selectedDistrictId]?.name;
      if (dName) {
        setSelectedDistrict(dName);
      }
    } else if (selectedDistrictId === 'all') {
      setSelectedDistrict('all');
    }
  }, [selectedDistrictId]);

  const handleDistrictChange = (dName: string) => {
    setSelectedDistrict(dName);
    if (dName === 'all') {
      setSelectedDistrictId('all');
    } else {
      const match = Object.values(DISTRICT_DETAILS_BY_ID).find(
        (d) => d.name.toLowerCase() === dName.toLowerCase()
      );
      if (match) {
        setSelectedDistrictId(match.id);
      }
    }
  };

  const handleSyncNightlyHoardings = () => {
    setIsSyncingHoardings(true);
    setTimeout(() => {
      const now = new Date();
      const updatedStamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST (Nightly Cron Verified)`;
      setHoardingLastSynced(updatedStamp);
      setIsSyncingHoardings(false);
      setToast({
        message:
          language === 'mr'
            ? 'राज्यव्यापी १४० होर्डिंग्जचा रात्रीचा डेटा यशस्वीरीत्या अद्ययावत झाला.'
            : 'Nightly GPS geotag audit synchronized across all 36 districts (140 Sites).',
        type: 'success',
      });
    }, 600);
  };

  // Modal inspection states
  const [selectedRO, setSelectedRO] = useState<StateAdvertisement | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<StateAdvertisement | null>(null);
  const [selectedHoarding, setSelectedHoarding] = useState<HoardingRecord | null>(null);

  // DIPR DAVP Rate Calculator state
  const [showRateCalculator, setShowRateCalculator] = useState<boolean>(false);
  const [calcMediaType, setCalcMediaType] = useState<'print' | 'hoarding' | 'tv' | 'radio'>('print');
  const [calcSize, setCalcSize] = useState<number>(384); // sq.cm or spots
  const [calcTier, setCalcTier] = useState<'A' | 'B' | 'C'>('A');
  const [hoardingLuxMode, setHoardingLuxMode] = useState<'day' | 'night'>('day');

  // Sync tab with URL if user clicked from sidebar
  useEffect(() => {
    if (tabQuery === 'hoardings') {
      setActiveTab('hoardings');
    } else if (tabQuery === 'map') {
      setActiveTab('map');
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
    <div className="p-4 sm:p-5 max-w-[1740px] w-full mx-auto space-y-4">
      {/* 1. Executive Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MaterialIcon name="newspaper" size="sm" className="text-gov-primary" />
            <span>
              {language === 'mr'
                ? 'शासकीय जाहिराती, होर्डिंग्ज व मोहीम व्यवस्थापन'
                : 'State Advertisements, Outdoor Hoardings & Campaigns'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'प्रसिद्धी आदेश (RO), १४० प्रमाणित होर्डिंग्ज व प्रत्यक्ष ऑडिट पडताळणी'
              : 'Official Release Orders (ROs), 140 GPS-geotagged hoardings, and citizen reach audit'}
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
                    ? 'सर्व ४२ सक्रिय प्रसिद्धी आदेश (DIPR-RO-Ledger-2026.csv) यशस्वीरीत्या एक्सपोर्ट झाले.'
                    : 'All 42 active Release Orders exported (DIPR-RO-Ledger-2026.csv).',
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
                message: language === 'mr' ? 'DIPR दर सूची २०२६ डाउनलोड झाली.' : 'DIPR Approved Rate Card 2026 downloaded.',
                type: 'info',
              })
            }
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <MaterialIcon name="description" size="xs" />
            <span>{language === 'mr' ? 'डीआयपीआर दर सूची' : 'DIPR Rate Card'}</span>
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
          <span className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Budget Authorized</span>
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'मंजूर मोहीम बजेट' : 'Authorized Campaign Budget'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">₹ 34.80 Cr</div>
          <span className="text-[11px] text-slate-500">DIPR Account Head 2220</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'अधिकृत वृत्तपत्रे' : 'Accredited Print Dailies'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">64 Dailies</div>
          <span className="text-[11px] text-slate-500">Marathi, Hindi, English</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'प्रमाणित होर्डिंग्ज' : 'GPS-Geotagged Hoardings'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">140 Sites</div>
          <span className="text-[11px] text-slate-600 font-semibold">100% Inspected & Fit</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            {language === 'mr' ? 'प्रमाणित पोहोच (नागरिक)' : 'Verified Citizen Reach'}
          </span>
          <div className="text-2xl font-black text-slate-900 my-1">4.24 Crore</div>
          <span className="text-[11px] text-slate-600 font-semibold">Audited Citizen Impact</span>
        </div>
      </div>

      {/* 3. OPERATIONAL NAVIGATION TABS & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'map', label: language === 'mr' ? '🗺️ परस्परसंवादी नकाशा (GIS Map)' : '🗺️ Interactive GIS Map', count: '36 Districts' },
            { id: 'hoardings', label: language === 'mr' ? 'राज्यव्यापी होर्डिंग्ज नोंदवही' : 'Outdoor Hoardings (140)', count: '140 Sites' },
            { id: 'campaigns', label: language === 'mr' ? 'प्रसिद्धी आदेश (RO) मोहिमा' : 'Campaign Release Orders', count: '6 Main' },
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

      {/* 4. TAB 0: INTERACTIVE MAHARASHTRA GIS MAP & LOCATION-SPECIFIC HOARDINGS */}
      {activeTab === 'map' && (
        <div className="space-y-5">
          {/* Map Header & Location Selector Ribbon */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>
                    {language === 'mr'
                      ? 'राज्यव्यापी परस्परसंवादी नकाशा व फलक स्थानके'
                      : 'Statewide Interactive GIS Map & Outdoor Hoardings'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold">
                    140 Sites Active
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? 'नकाशावरील कोणत्याही जिल्ह्यावर किंवा फलक क्रमांकावर क्लिक करा; त्या विशिष्ट ठिकाणचे सर्व होर्डिंग्ज, छायाचित्रे, स्थान तपशील व प्रसिद्धी आदेश त्वरित खाली प्रदर्शित होतील.'
                  : 'Click on any district (1 to 36) or hoarding marker on the map to immediately inspect all verified billboards, real photographs, GPS telemetry, and Release Orders for that location.'}
              </p>
            </div>

            {/* Selected District Badge & Dropdown */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <MaterialIcon name="location_on" size="xs" className="text-amber-600" />
                <span className="text-xs font-bold text-slate-800">
                  {selectedDistrict === 'all'
                    ? (language === 'mr' ? 'सर्व ३६ जिल्हे (महाराष्ट्र)' : 'All 36 Districts (Statewide)')
                    : `${selectedDistrict} ${language === 'mr' ? 'जिल्हा' : 'District'}`}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  {filteredHoardings.length} {language === 'mr' ? 'फलक' : 'Sites'}
                </span>
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 font-medium cursor-pointer shadow-2xs outline-none focus:ring-1 focus:ring-gov-blue"
              >
                <option value="all">
                  {language === 'mr' ? 'सर्व जिल्हे (All Districts)' : 'All Districts (36)'}
                </option>
                {distinctDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {selectedDistrict !== 'all' && (
                <button
                  type="button"
                  onClick={() => handleDistrictChange('all')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  {language === 'mr' ? 'पूर्ववत करा' : 'Reset All'}
                </button>
              )}
            </div>
          </div>

          {/* Embedded High-Fidelity 3D/2D Maharashtra GIS Command Map */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <EnhancedMaharashtraGISMap
              initialDistrictId={selectedDistrict !== 'all' ? selectedDistrict.toLowerCase() : 'all'}
              onDistrictSelect={(district) => {
                handleDistrictChange(district.name);
                const el = document.getElementById('district-hoardings-view');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="min-h-[500px] shadow-sm"
            />
            {/* GIS Map Engine Anchor: <GISMap /> */}
          </div>

          {/* LOCATION-SPECIFIC HOARDINGS LISTING ACCORDING TO CLICKED PLACE */}
          <div id="district-hoardings-view" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-3.5 sm:p-4 rounded-xl border border-slate-700 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-400 text-slate-950 rounded-lg shrink-0">
                  <MaterialIcon name="pin_drop" size="sm" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold tracking-tight text-white">
                    {selectedDistrict === 'all'
                      ? (language === 'mr'
                        ? 'महाराष्ट्र राज्य — १४० प्रमाणित फलक (सर्व ३६ जिल्हे)'
                        : 'Maharashtra State — 140 Verified Outdoor Sites (All 36 Districts)')
                      : (language === 'mr'
                        ? `${selectedDistrict} जिल्ह्यातील सर्व होर्डिंग्ज व प्रसिद्धी आदेश`
                        : `${selectedDistrict} District Verified Outdoor Hoardings & Release Orders`)}
                  </h4>
                  <span className="text-[11px] text-slate-300">
                    {language === 'mr'
                      ? `या ठिकाणी एकूण ${filteredHoardings.length} डिजिटल व प्रत्यक्ष फलक कार्यरत असून नियमित तपासणी झालेली आहे`
                      : `Currently tracking ${filteredHoardings.length} certified outdoor billboard installations with active GPS telemetry`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold bg-amber-400 text-slate-950 px-3 py-1 rounded-lg">
                  {filteredHoardings.length} {language === 'mr' ? 'स्थानके' : 'Sites'}
                </span>
              </div>
            </div>

            {filteredHoardings.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <MaterialIcon name="location_on" size="lg" className="text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {language === 'mr'
                    ? 'या ठिकाणी कोणतेही होर्डिंग्ज सापडले नाहीत'
                    : 'No outdoor hoardings found for this specific filter'}
                </p>
                <button
                  type="button"
                  onClick={() => handleDistrictChange('all')}
                  className="px-3.5 py-1.5 bg-gov-primary text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  {language === 'mr' ? 'सर्व जिल्हे दाखवा' : 'View All Districts'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredHoardings.map((h) => (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2.5">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                          {h.id}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{h.status}</span>
                        </span>
                      </div>

                      {/* District & Location */}
                      <div>
                        <strong className="text-slate-900 text-sm block">
                          📍 {h.districtName} — {language === 'mr' ? h.locationMr : h.location}
                        </strong>
                        <span className="text-xs text-slate-600 block line-clamp-1 mt-0.5 font-medium">
                          🎯 {language === 'mr' ? h.campaignMr : h.campaign}
                        </span>
                      </div>

                      {/* Real Photographic Image of Hoarding / Billboard */}
                      <div
                        onClick={() => setSelectedHoarding(h)}
                        className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative cursor-pointer bg-slate-900"
                        title="Click to inspect high-resolution site photo"
                      >
                        <img
                          src={getHoardingPhoto(h)}
                          alt={h.campaign}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== '/hoardings/default.svg') {
                              target.src = '/hoardings/default.svg';
                            }
                          }}
                        />
                        {/* Top Overlay Badge */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-white">
                          <span className="font-bold text-amber-300">MAHARASHTRA DGIPR</span>
                          <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                            ✓ PWD GEOTAG
                          </span>
                        </div>

                        {/* Bottom Info Strip */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-2.5 text-white">
                          <span className="text-[10px] text-amber-200 font-semibold block truncate">
                            {language === 'mr' ? h.departmentMr : h.department}
                          </span>
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-300 pt-0.5">
                            <span className="font-bold text-white">{h.size}</span>
                            <span className="text-emerald-300 font-bold">{h.impressionsDaily}</span>
                          </div>
                        </div>
                      </div>

                      {/* Geotag & Audit Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                        <span>
                          GPS: {h.geotag.lat.toFixed(4)}, {h.geotag.lng.toFixed(4)}
                        </span>
                        <span className="text-slate-500">{h.verifiedDate}</span>
                      </div>
                    </div>

                    {/* Inspect Action */}
                    <button
                      type="button"
                      onClick={() => setSelectedHoarding(h)}
                      className="w-full py-1.5 bg-slate-100 hover:bg-gov-primary hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <MaterialIcon name="visibility" size="xs" />
                      <span>{language === 'mr' ? 'तपशील व प्रत्यक्ष छायाचित्र पहा' : 'Inspect Site Photo & Audit'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 1: CAMPAIGN RELEASE ORDERS DOSSIER */}
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

                  {/* Miniature Campaign Creative Banner Simulation with Real Imagery */}
                  <div
                    onClick={() => setSelectedCreative(ad)}
                    className="aspect-[21/9] rounded-xl overflow-hidden relative text-white flex flex-col justify-between border border-slate-700 shadow-inner cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all group bg-slate-900"
                    title="Click to view full-size creative artwork"
                  >
                    <img
                      src={getAdvertisementCreativePhoto(ad)}
                      alt={ad.campaignTitle}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/40" />

                    <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-wider text-amber-300 p-3 pb-0">
                      <span>GOVT OF MAHARASHTRA • DGIPR</span>
                      <span className="group-hover:underline flex items-center gap-0.5">
                        <span>Creative Preview</span>
                        <MaterialIcon name="open_in_new" size="xs" />
                      </span>
                    </div>

                    <div className="relative z-10 px-3 py-1">
                      <h4 className="text-xs font-black font-serif text-white line-clamp-1 drop-shadow-md">
                        {language === 'mr' ? ad.campaignTitleMr : ad.campaignTitle}
                      </h4>
                      <p className="text-[10px] text-amber-200/90 truncate">
                        {language === 'mr' ? ad.departmentMr : ad.department} • Ref #{ad.schemeCode}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-slate-300 border-t border-white/20 p-3 pt-1">
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
          {/* Nightly Hoardings Ingestion & Synchronization Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                  {language === 'mr' ? 'नियमित रात्रीचे संकलन व जीपीएस ऑडिट' : 'Automated Nightly Synchronization Schedule'}
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  CRON: 0 2 * * * (02:00 AM IST)
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{language === 'mr' ? 'राज्यव्यापी १४० होर्डिंग्ज थेट संनियंत्रण नोंदवही' : 'Statewide 140 Geotagged Hoardings Telemetry'}</span>
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap pt-0.5">
                <span>
                  {language === 'mr' ? 'माहिती अद्यतन वेळ:' : 'Last Ingestion & Audit Sync:'}{' '}
                  <strong className="text-amber-300 font-mono font-bold">{hoardingLastSynced}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span>
                  {language === 'mr' ? 'पुढील स्वयंचलित अद्यतन:' : 'Next Scheduled Fetch:'}{' '}
                  <span className="font-mono text-slate-300">27 Oct 2026, 02:00:00 AM IST</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSyncNightlyHoardings}
                disabled={isSyncingHoardings}
                className="px-4 py-2.5 bg-gov-primary hover:bg-gov-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border border-blue-400/40 disabled:opacity-60"
              >
                <span className={`text-sm ${isSyncingHoardings ? 'animate-spin' : ''}`}>🔄</span>
                <span>
                  {isSyncingHoardings
                    ? (language === 'mr' ? 'डेटा संकलित करत आहे...' : 'Fetching Nightly Telemetry...')
                    : (language === 'mr' ? 'आता डेटा अद्ययावत करा' : 'Sync Nightly Data Now')}
                </span>
              </button>
            </div>
          </div>

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
                onClick={() => setHoardingViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hoardingViewMode === 'map'
                    ? 'bg-gov-primary text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🗺️ {language === 'mr' ? 'नकाशा व्ह्यू' : 'Map View'}
              </button>
              <button
                onClick={() => setHoardingViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hoardingViewMode === 'cards'
                    ? 'bg-gov-primary text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🖼️ {language === 'mr' ? 'कार्ड व्ह्यू' : 'Visual Cards'}
              </button>
              <button
                onClick={() => setHoardingViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  hoardingViewMode === 'table'
                    ? 'bg-gov-primary text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📋 {language === 'mr' ? 'तक्ता नोंदवही' : 'Registry Table'}
              </button>
            </div>
          </div>

          {/* Map View Mode in Hoardings Tab */}
          {hoardingViewMode === 'map' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="map" size="xs" className="text-gov-primary" />
                    <span className="font-bold text-slate-700">
                      {language === 'mr'
                        ? 'परस्परसंवादी राज्य नकाशा (जिल्हा फलक पाहण्यासाठी क्लिक करा)'
                        : 'Interactive GIS Map (Click district/marker to inspect local hoardings)'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {selectedDistrict === 'all'
                      ? (language === 'mr' ? 'सर्व जिल्हे (All)' : 'All 36 Districts')
                      : `${selectedDistrict} District`}
                  </span>
                </div>
                <div className="w-full relative">
                  <EnhancedMaharashtraGISMap
                    initialDistrictId={selectedDistrict !== 'all' ? selectedDistrict.toLowerCase() : 'all'}
                    onDistrictSelect={(district) => {
                      handleDistrictChange(district.name);
                    }}
                    className="min-h-[480px] shadow-sm"
                  />
                  {/* Map Engine Reference: <GISMap /> */}
                </div>
              </div>

              {/* Location Hoardings Grid below map */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name="pin_drop" size="xs" className="text-amber-400" />
                    <span className="text-xs font-bold">
                      {selectedDistrict === 'all'
                        ? (language === 'mr' ? 'सर्व १४० होर्डिंग्ज फलक' : 'All 140 Verified Outdoor Sites')
                        : `${selectedDistrict} ${language === 'mr' ? 'जिल्हा — फलक नोंदवही' : 'District — Hoardings Ledger'}`}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                    {filteredHoardings.length} {language === 'mr' ? 'फलक' : 'Sites'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredHoardings.map((h) => (
                    <div
                      key={h.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                            {h.id}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {h.status}
                          </span>
                        </div>

                        <div>
                          <strong className="text-slate-900 text-sm block">
                            📍 {h.districtName} — {language === 'mr' ? h.locationMr : h.location}
                          </strong>
                          <span className="text-xs text-slate-600 block line-clamp-1 mt-0.5 font-medium">
                            🎯 {language === 'mr' ? h.campaignMr : h.campaign}
                          </span>
                        </div>

                        <div
                          onClick={() => setSelectedHoarding(h)}
                          className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative cursor-pointer bg-slate-900"
                          title="Click to inspect high-resolution site photo"
                        >
                          <img
                            src={getHoardingPhoto(h)}
                            alt={h.campaign}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== '/hoardings/default.svg') {
                                target.src = '/hoardings/default.svg';
                              }
                            }}
                          />
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-white">
                            <span className="font-bold text-amber-300">MAHARASHTRA DGIPR</span>
                            <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                              ✓ PWD GEOTAG
                            </span>
                          </div>

                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-2.5 text-white">
                            <span className="text-[10px] text-amber-200 font-semibold block truncate">
                              {language === 'mr' ? h.departmentMr : h.department}
                            </span>
                            <div className="flex justify-between items-center text-[9px] font-mono text-slate-300 pt-0.5">
                              <span className="font-bold text-white">{h.size}</span>
                              <span className="text-emerald-300 font-bold">{h.impressionsDaily}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                          <span>GPS: {h.geotag.lat.toFixed(4)}, {h.geotag.lng.toFixed(4)}</span>
                          <span className="text-slate-500">{h.verifiedDate}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedHoarding(h)}
                        className="w-full py-1.5 bg-slate-100 hover:bg-gov-primary hover:text-white text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <MaterialIcon name="visibility" size="xs" />
                        <span>{language === 'mr' ? 'तपशील व प्रत्यक्ष छायाचित्र पहा' : 'Inspect Site Photo & Audit'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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

                    {/* Visual Billboard Display with Real Imagery & Fallback */}
                    <div
                      onClick={() => setSelectedHoarding(h)}
                      className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-sm relative group cursor-pointer bg-slate-900"
                      title="Click to inspect high-resolution site photo"
                    >
                      <img
                        src={getHoardingPhoto(h)}
                        alt={h.campaign}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== '/hoardings/default.svg') {
                            target.src = '/hoardings/default.svg';
                          }
                        }}
                      />
                      {/* Top Overlay Badge */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono px-2 py-1 rounded bg-slate-950/75 backdrop-blur-xs text-white">
                        <span className="font-bold text-amber-300">MAHARASHTRA GOVT</span>
                        <span className="bg-emerald-600/90 text-white px-1.5 py-0.2 rounded font-bold">VERIFIED</span>
                      </div>
                      {/* Bottom Info Strip on Hover */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-2 text-white">
                        <span className="text-[10px] text-amber-200 font-semibold block truncate">{h.department}</span>
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-300 pt-0.5">
                          <span>{h.size}</span>
                          <span>{h.impressionsDaily}</span>
                        </div>
                      </div>
                    </div>

                    {/* Geotag & Audit Info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      <span>GPS: {h.geotag.lat.toFixed(2)}, {h.geotag.lng.toFixed(2)}</span>
                      <span>Verified: {h.verifiedDate}</span>
                    </div>

                    {/* Nightly Field Audit Indicator */}
                    <div className="flex items-center justify-between text-[10px] text-purple-800 font-mono bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 inline-block" />
                        <span>{language === 'mr' ? 'रात्रीची पाहणी:' : 'Nightly Audit:'} 02:14 AM IST</span>
                      </span>
                      <span className="font-semibold text-emerald-700">✓ {language === 'mr' ? 'प्रमाणित' : 'Verified'}</span>
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block text-center mb-0.5">
                            {h.status}
                          </span>
                          <span className="text-[9px] font-mono text-purple-700 block text-center whitespace-nowrap">
                            🌙 Nightly 02:14 AM
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
                  उपरोक्त विषयासंदर्भात कळविण्यात येते की, माहिती व जनसंपर्क महासंचालनालयाच्या अधिकृत सूचीतील वृत्तपत्रे, नियतकालिके व माध्यम गृहांमध्ये सदर जाहिरात प्रसिद्ध करण्यास मंजुरी देण्यात येत आहे. सर्व बिल देयके शासकीय विहित दर (DIPR Approved Rate Card) नुसार सादर करावीत.
                </p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Authorized by: Deputy Director (Advertising), DIPR</span>
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
              <div className="rounded-2xl p-4 flex flex-col justify-between text-white border-2 border-amber-500/60 shadow-2xl relative overflow-hidden bg-slate-900 space-y-3">
                {/* Real Photographic Creative Image Header */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/20 shadow-md">
                  <img
                    src={getAdvertisementCreativePhoto(selectedCreative)}
                    alt={selectedCreative.campaignTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono">
                    <span className="font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded">
                      GOVERNMENT OF MAHARASHTRA • DGIPR
                    </span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                      APPROVED ARTWORK
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-[10px] text-white font-mono">
                    <span className="text-amber-200 font-bold">{selectedCreative.roNumber}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded">{selectedCreative.mediaType}</span>
                  </div>
                </div>

                <div className="py-2 text-center space-y-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-0.5 rounded-full border border-amber-400/40 inline-block">
                    {selectedCreative.mediaTypeMr}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black font-serif text-white drop-shadow-lg leading-tight">
                    {language === 'mr' ? selectedCreative.campaignTitleMr : selectedCreative.campaignTitle}
                  </h2>
                  <p className="text-xs text-amber-100 max-w-md mx-auto leading-relaxed">
                    {language === 'mr' ? selectedCreative.departmentMr : selectedCreative.department} • Ref #{selectedCreative.schemeCode}
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

              {/* High-Res Billboard Site Photo with Night Illumination Mode */}
              <div
                className={`aspect-[16/9] rounded-xl overflow-hidden border-2 relative shadow-md transition-all ${
                  hoardingLuxMode === 'night'
                    ? 'border-amber-400 shadow-amber-500/20 shadow-lg'
                    : 'border-slate-300'
                }`}
              >
                <img
                  src={getHoardingPhoto(selectedHoarding)}
                  alt={selectedHoarding.campaign}
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    hoardingLuxMode === 'night' ? 'brightness-110 contrast-115' : 'brightness-100'
                  }`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/hoardings/default.svg') {
                      target.src = '/hoardings/default.svg';
                    }
                  }}
                />
                <div className="absolute top-2.5 inset-x-2.5 flex justify-between items-start pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest text-white font-bold bg-slate-950/80 px-2 py-0.5 rounded uppercase">
                    GOVERNMENT OF MAHARASHTRA • DIPR
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold shadow-xs">
                    {hoardingLuxMode === 'night' ? '248 LUX ILLUMINATED' : 'GPS VERIFIED'}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 text-white pointer-events-none">
                  <div className="flex justify-between text-[10px] text-slate-300">
                    <span className="font-bold text-amber-300">{selectedHoarding.size}</span>
                    <span>{selectedHoarding.location}</span>
                  </div>
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

      {/* 11. MODAL 4: INTERACTIVE DIPR DAVP RATE ESTIMATOR CALCULATOR */}
      {showRateCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 border border-slate-300">
            <div className="p-4 bg-gov-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="table_chart" size="sm" className="text-amber-300" />
                <span className="font-bold text-sm">
                  {language === 'mr' ? 'डीआयपीआर डीएव्हीपी दर गणक (Rate Calculator)' : 'DIPR DAVP Sanction Rate Estimator'}
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
                const davpDiscount = gross * 0.15; // 15% DIPR DAVP Concession
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
