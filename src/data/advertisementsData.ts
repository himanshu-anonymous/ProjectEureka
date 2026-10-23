export interface StateAdvertisement {
  id: string;
  roNumber: string; // Release Order number e.g. "RO-DGIPR-2026-842"
  campaignTitle: string;
  campaignTitleMr: string;
  department: string;
  departmentMr: string;
  mediaType: 'Print Newspaper' | 'Outdoor Hoarding' | 'Digital & Social' | 'Radio & Audio' | 'TV Commercial';
  mediaTypeMr: string;
  releaseDate: string;
  endDate: string;
  budgetAllocated: string;
  targetReach: string;
  publicationsCount: number;
  status: 'Approved & Released' | 'Active On Display' | 'Verification Completed' | 'Under Audit';
  statusMr: string;
  creativeSampleUrl: string;
  verifiedImpressions: string;
  schemeCode: string;
}

export const STATE_ADVERTISEMENTS_DATA: StateAdvertisement[] = [
  {
    id: 'AD-2026-001',
    roNumber: 'RO-DGIPR-2026-1042',
    campaignTitle: 'Mukhyamantri Majhi Ladki Bahin Yojana — State-wide Awareness Campaign',
    campaignTitleMr: 'मुख्यमंत्री माझी लाडकी बहीण योजना — राज्यव्यापी जनजागृती मोहीम',
    department: 'Women & Child Development Department',
    departmentMr: 'महिला व बालविकास विभाग',
    mediaType: 'Print Newspaper',
    mediaTypeMr: 'वृत्तपत्र जाहिरात',
    releaseDate: '12 Oct 2026',
    endDate: '31 Oct 2026',
    budgetAllocated: '₹4.85 Crore',
    targetReach: '3.2 Crore Citizens',
    publicationsCount: 64,
    status: 'Active On Display',
    statusMr: 'सक्रिय प्रसिद्धी',
    creativeSampleUrl: '/ads/ladki-bahin-print.png',
    verifiedImpressions: '2.85 Crore Verified',
    schemeCode: 'SCH-WCD-88',
  },
  {
    id: 'AD-2026-002',
    roNumber: 'RO-DGIPR-2026-1043',
    campaignTitle: 'Namo Shetkari Mahasanman Nidhi — Direct Agri Relief Disbursement',
    campaignTitleMr: 'नमो शेतकरी महासन्मान निधी — थेट शेतकरी सन्मान वितरण',
    department: 'Agriculture Department',
    departmentMr: 'कृषी विभाग',
    mediaType: 'Outdoor Hoarding',
    mediaTypeMr: 'होर्डिंग व फलक',
    releaseDate: '14 Oct 2026',
    endDate: '15 Nov 2026',
    budgetAllocated: '₹3.20 Crore',
    targetReach: '1.8 Crore Citizens',
    publicationsCount: 140, // 140 billboard sites
    status: 'Active On Display',
    statusMr: 'सक्रिय प्रसिद्धी',
    creativeSampleUrl: '/ads/shetkari-hoarding.png',
    verifiedImpressions: '1.42 Crore Verified',
    schemeCode: 'SCH-AGR-12',
  },
  {
    id: 'AD-2026-003',
    roNumber: 'RO-DGIPR-2026-1044',
    campaignTitle: 'Maha Metro Expansion & Underground Connectivity Dedication',
    campaignTitleMr: 'महा मेट्रो विस्तार व भूमिगत मेट्रो समर्पित सोहळा',
    department: 'Urban Development Department',
    departmentMr: 'नगर विकास विभाग',
    mediaType: 'Digital & Social',
    mediaTypeMr: 'डिजिटल व सोशल मीडिया',
    releaseDate: '16 Oct 2026',
    endDate: '05 Nov 2026',
    budgetAllocated: '₹1.50 Crore',
    targetReach: '85 Lakh Citizens',
    publicationsCount: 12,
    status: 'Verification Completed',
    statusMr: 'पडताळणी पूर्ण',
    creativeSampleUrl: '/ads/metro-digital.png',
    verifiedImpressions: '92 Lakh Verified',
    schemeCode: 'SCH-UDD-04',
  },
  {
    id: 'AD-2026-004',
    roNumber: 'RO-DGIPR-2026-1045',
    campaignTitle: 'Jalyukta Shivar Abhiyan 2.0 — Water Harvesting Mass Participation',
    campaignTitleMr: 'जलयुक्त शिवार अभियान २.० — जलसंधारण लोकचळवळ',
    department: 'Water Conservation Department',
    departmentMr: 'मृद व जलसंधारण विभाग',
    mediaType: 'Print Newspaper',
    mediaTypeMr: 'वृत्तपत्र जाहिरात',
    releaseDate: '18 Oct 2026',
    endDate: '10 Nov 2026',
    budgetAllocated: '₹2.10 Crore',
    targetReach: '1.4 Crore Citizens',
    publicationsCount: 48,
    status: 'Approved & Released',
    statusMr: 'मंजूर व वितरित',
    creativeSampleUrl: '/ads/jalyukta-print.png',
    verifiedImpressions: '1.10 Crore Verified',
    schemeCode: 'SCH-WTR-21',
  },
  {
    id: 'AD-2026-005',
    roNumber: 'RO-DGIPR-2026-1046',
    campaignTitle: 'Mukhyamantri Yuva Karyaprashikshan Internship Scheme',
    campaignTitleMr: 'मुख्यमंत्री युवा कार्यप्रशिक्षण विद्यावेतन योजना',
    department: 'Skill Development & Entrepreneurship',
    departmentMr: 'कौशल्य विकास विभाग',
    mediaType: 'Radio & Audio',
    mediaTypeMr: 'रेडिओ जिंगल व एफएम',
    releaseDate: '20 Oct 2026',
    endDate: '20 Nov 2026',
    budgetAllocated: '₹85 Lakh',
    targetReach: '95 Lakh Listeners',
    publicationsCount: 22,
    status: 'Active On Display',
    statusMr: 'सक्रिय प्रसिद्धी',
    creativeSampleUrl: '/ads/yuva-audio.png',
    verifiedImpressions: '78 Lakh Verified',
    schemeCode: 'SCH-SKL-09',
  },
  {
    id: 'AD-2026-006',
    roNumber: 'RO-DGIPR-2026-1047',
    campaignTitle: 'Maharashtra Tourism — Forts & Heritage UNESCO Circuit',
    campaignTitleMr: 'महाराष्ट्र पर्यटन — शिवकालीन गडकिल्ले जागतिक वारसा मोहीम',
    department: 'Tourism & Cultural Affairs',
    departmentMr: 'पर्यटन व सांस्कृतिक कार्य विभाग',
    mediaType: 'TV Commercial',
    mediaTypeMr: 'दूरचित्रवाणी जाहिरात',
    releaseDate: '21 Oct 2026',
    endDate: '30 Nov 2026',
    budgetAllocated: '₹3.60 Crore',
    targetReach: '4.5 Crore Viewers',
    publicationsCount: 18,
    status: 'Approved & Released',
    statusMr: 'मंजूर व वितरित',
    creativeSampleUrl: '/ads/tourism-tv.png',
    verifiedImpressions: '3.9 Crore Verified',
    schemeCode: 'SCH-TRM-05',
  },
];
