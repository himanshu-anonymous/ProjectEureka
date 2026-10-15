import { AuthUser, DistrictData, IncidentData, OCRRecord } from '@/types/dashboard';
import { INITIAL_DISTRICTS, INITIAL_INCIDENTS, INITIAL_OCR_FEED } from '@/data/dashboardData';

export interface UserCredential {
  user: AuthUser;
  pin: string;
}

export const MOCK_USERS: Record<string, UserCredential> = {
  admin: {
    pin: '8842',
    user: {
      id: 'user-dg-admin',
      username: 'admin',
      name: 'Dr. Rahul Patil',
      marathiName: 'डॉ. राहुल पाटील',
      role: 'dg_admin',
      designation: 'Director General, DGIPR Maharashtra',
      division: 'All Maharashtra',
      district: 'All',
      avatarInitials: 'RP',
      permittedDivisions: [
        'All Maharashtra',
        'Konkan',
        'Pune',
        'Nashik',
        'Chhatrapati Sambhajinagar',
        'Amravati',
        'Nagpur',
      ],
      permittedDistricts: ['All'],
      canAuthorizeRebuttals: true,
    },
  },
  director_konkan: {
    pin: '8842',
    user: {
      id: 'user-div-director-konkan',
      username: 'director_konkan',
      name: 'Sanjay Chavan',
      marathiName: 'संजय चव्हाण',
      role: 'director_konkan',
      designation: 'Divisional Deputy Director, Konkan Division',
      division: 'Konkan',
      district: 'All Konkan',
      avatarInitials: 'SC',
      permittedDivisions: ['Konkan'],
      permittedDistricts: ['Palghar', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg'],
      canAuthorizeRebuttals: false,
    },
  },
  collector_palghar: {
    pin: '8842',
    user: {
      id: 'user-collector-palghar',
      username: 'collector_palghar',
      name: 'Govind Bodke (IAS)',
      marathiName: 'गोविंद बोडके (भा.प्र.से.)',
      role: 'collector',
      designation: 'District Magistrate & Collector, Palghar',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'GB',
      permittedDivisions: ['Konkan'],
      permittedDistricts: ['Palghar'],
      canAuthorizeRebuttals: true,
    },
  },
  collector_thane: {
    pin: '8842',
    user: {
      id: 'user-collector-thane',
      username: 'collector_thane',
      name: 'Ashok Shingare (IAS)',
      marathiName: 'अशोक शिंगारे (भा.प्र.से.)',
      role: 'collector',
      designation: 'District Magistrate & Collector, Thane',
      division: 'Konkan',
      district: 'Thane',
      avatarInitials: 'AS',
      permittedDivisions: ['Konkan'],
      permittedDistricts: ['Thane'],
      canAuthorizeRebuttals: true,
    },
  },
  operator_konkan: {
    pin: '8842',
    user: {
      id: 'user-dio-konkan',
      username: 'operator_konkan',
      name: 'Pravin Khose',
      marathiName: 'प्रवीण खोसे',
      role: 'dio_desk',
      designation: 'DIO Desk Operator, Konkan Division',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'PK',
      permittedDivisions: ['Konkan'],
      permittedDistricts: ['Palghar'],
      canAuthorizeRebuttals: false,
    },
  },
  operator1: {
    pin: '8842',
    user: {
      id: 'user-dio-konkan',
      username: 'operator1',
      name: 'Pravin Khose',
      marathiName: 'प्रवीण खोसे',
      role: 'dio_desk',
      designation: 'DIO Desk Operator, Konkan Division',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'PK',
      permittedDivisions: ['Konkan'],
      permittedDistricts: ['Palghar'],
      canAuthorizeRebuttals: false,
    },
  },
};

// Mutable in-memory server state
let serverDistricts: DistrictData[] = [...INITIAL_DISTRICTS];
let serverIncidents: IncidentData[] = [...INITIAL_INCIDENTS];
let serverOcrFeed: OCRRecord[] = [...INITIAL_OCR_FEED];

export function getServerDistricts(role?: string, district?: string, division?: string): DistrictData[] {
  let list = [...serverDistricts];

  if (role === 'dio_desk' || role === 'collector') {
    const targetDistrict = district || 'Palghar';
    return list.map((d) => ({
      ...d,
      isAuthorizedDistrict: d.name.toLowerCase() === targetDistrict.toLowerCase(),
    }));
  }

  if (role === 'director_konkan' || division === 'Konkan') {
    return list.filter((d) => d.division.toLowerCase() === 'konkan');
  }

  if (division && division !== 'All Maharashtra') {
    return list.filter((d) => d.division.toLowerCase() === division.toLowerCase());
  }

  return list;
}

export function getServerOverviewMetrics(role?: string, district?: string, division?: string) {
  if (role === 'dio_desk' || role === 'collector' || (district && district.toLowerCase() === 'palghar')) {
    return {
      scopeName: 'Palghar District Operations',
      scopeType: 'district',
      totalReleases: {
        value: 310,
        targetText: 'Target: 300 (Met)',
        trendDirection: 'up' as const,
        trendValue: '+14%',
        positiveTrend: true,
      },
      avgTAT: {
        value: 38,
        unit: 'min',
        targetText: 'Target: ≤45m (Met)',
        trendDirection: 'down' as const,
        trendValue: '-12%',
        positiveTrend: true,
      },
      sentimentIndex: {
        value: '76%',
        targetText: 'Target: >65% (Above Target)',
        trendDirection: 'up' as const,
        trendValue: '+8%',
        positiveTrend: true,
      },
      misinformationTickets: {
        value: 1,
        unit: 'active',
        targetText: '10 Resolved · 1 In SLA',
        trendDirection: 'down' as const,
        trendValue: '-50%',
        positiveTrend: false,
      },
    };
  }

  if (role === 'director_konkan' || (division && division.toLowerCase() === 'konkan')) {
    return {
      scopeName: 'Konkan Division Operations',
      scopeType: 'division',
      totalReleases: {
        value: 1482,
        targetText: 'Thane 462 · Palghar 310 · Raigad 295 · Ratnagiri 224 · Sindhudurg 191',
        trendDirection: 'up' as const,
        trendValue: '+18%',
        positiveTrend: true,
      },
      avgTAT: {
        value: 46.6,
        unit: 'min',
        targetText: 'Near Target (≤45m)',
        trendDirection: 'down' as const,
        trendValue: '-9%',
        positiveTrend: true,
      },
      sentimentIndex: {
        value: '69.2%',
        targetText: 'Above Target (>65%)',
        trendDirection: 'up' as const,
        trendValue: '+4.2%',
        positiveTrend: true,
      },
      misinformationTickets: {
        value: 3,
        unit: 'open',
        targetText: '41 Resolved · 3 Open',
        trendDirection: 'down' as const,
        trendValue: '-33%',
        positiveTrend: false,
      },
    };
  }

  // Default Konkan Division
  return {
    scopeName: 'Konkan Division Operations Overview',
    scopeType: 'division',
    totalReleases: {
      value: 1482,
      targetText: 'Target: 1,200 (Met)',
      trendDirection: 'up' as const,
      trendValue: '+12%',
      positiveTrend: true,
    },
    avgTAT: {
      value: 46.6,
      unit: 'min',
      targetText: 'Target: ≤45m (Near Target)',
      trendDirection: 'down' as const,
      trendValue: '-18%',
      positiveTrend: true,
    },
    sentimentIndex: {
      value: '69.2%',
      targetText: 'Target: ≥65% (Met)',
      trendDirection: 'up' as const,
      trendValue: '+6%',
      positiveTrend: true,
    },
    misinformationTickets: {
      value: 3,
      unit: 'open',
      targetText: '41 Resolved · 3 In SLA',
      trendDirection: 'down' as const,
      trendValue: '-33%',
      positiveTrend: false,
    },
  };
}

export function getServerIncidents(role?: string, district?: string): IncidentData[] {
  if (role === 'dio_desk' || role === 'collector' || (district && district.toLowerCase() === 'palghar')) {
    return serverIncidents.filter((inc) => inc.district.toLowerCase() === 'palghar');
  }
  return serverIncidents;
}

export function updateServerIncidentAction(
  incidentId: string,
  action: 'authorize' | 'issue_advisory' | 'request_edits',
  authorizedBy: AuthUser
) {
  const index = serverIncidents.findIndex((inc) => inc.id === incidentId);
  if (index === -1) return null;

  const incident = serverIncidents[index];
  if (action === 'authorize') {
    incident.authorized = true;
    incident.verificationStatus = 'Rebuttal Authorized & Published';
    incident.slaRemaining = '00:00';
    incident.slaMinutes = 0;
  } else if (action === 'issue_advisory') {
    incident.authorized = true;
    incident.verificationStatus = 'Official Press Advisory Issued';
  } else if (action === 'request_edits') {
    incident.authorized = false;
    incident.verificationStatus = 'Returned to DIO for Verification';
  }

  serverIncidents[index] = { ...incident };
  return serverIncidents[index];
}

export function getServerOcrFeed(sentimentFilter?: string): OCRRecord[] {
  if (!sentimentFilter || sentimentFilter === 'All') {
    return serverOcrFeed;
  }
  return serverOcrFeed.filter((item) => item.sentiment === sentimentFilter);
}

export function addServerOcrRecord(record: OCRRecord) {
  serverOcrFeed = [record, ...serverOcrFeed];
  return serverOcrFeed;
}

// Extracted structured data from 'माहिती कार्यालय कोकण विभाग दैनदिन कामकाज अहवाल.xlsx'
export const KONKAN_DAILY_OPERATIONS_REPORT = {
  office: 'विभागीय माहिती कार्यालय कोकण (Divisional Information Office Konkan)',
  reportDate: '13 Oct 2026',
  districtsCovered: ['पालघर (Palghar)', 'ठाणे (Thane)', 'रायगड (Raigad)', 'रत्नागिरी (Ratnagiri)', 'सिंधुदुर्ग (Sindhudurg)', 'मुंबई शहर (Mumbai City)', 'मुंबई उपनगर (Mumbai Suburban)'],
  vipProgramCoverage: [
    {
      vip: 'माननीय मुख्यमंत्री (Chief Minister)',
      events: [
        'नवी मुंबई विमानतळ येथे भारत टॅक्सीची सुरूवात (Launch of Bharat Taxi at Navi Mumbai Airport)',
        'नवी मुंबई येथील डी वाय पाटील विद्यापीठात नशामुक्त अभियानाची सुरूवात (Drug-Free Campaign Inauguration)',
        'जेएनपीटी ते मध्य प्रदेश पर्यंत डबल डेकर मालगाडीला हिरवी झेंडी (Double-decker cargo train green flag from JNPT)',
        'वाशी येथील प्रदर्शन हॉल येथे पर्यावरण पूरक गणपती कार्यशाळा (Eco-friendly Ganpati workshop at Vashi)',
        'पालघर येथील आदिवासी नागरिकांना हक्काचे घर आणि जमीन (Housing and land titles to Palghar tribals)'
      ],
      socialReach: '100K+ Views · 20K Engagement · 1K Shares'
    },
    {
      vip: 'माननीय राज्यपाल (Governor)',
      events: ['लोणारे येथील डॉ. बाबासाहेब आंबेडकर तंत्रज्ञान विद्यापीठाच्या पदवीदान समारंभ (BATU Lonere Convocation)']
    },
    {
      vip: 'विभागीय आयुक्त (Divisional Commissioner)',
      events: ['विभागीय आयुक्त यांची एसआयआरसंबंधी रत्नागिरी, रायगड, ठाणे आणि पालघर जिल्हा भेट (SIR Review Visits)']
    }
  ],
  lineDepartmentsCoverage: [
    { department: 'कृषी विभाग (Agriculture)', highlight: 'कोकण विभागीय खरीप व दुष्काळ नियोजन आढावा बैठक, भात पीक कापणी सुरूवात', releases: 4 },
    { department: 'महसूल व वन विभाग (Revenue & Forest)', highlight: 'महाखनिज कमांड कंट्रोल सेंटरला मुख्य सचिव भेट; आदिवासी नागरिकांना वनपट्टे प्रदान; विशेष महसूल शिबीर', releases: 6 },
    { department: 'सार्वजनिक बांधकाम विभाग (PWD)', highlight: 'गणपती महोत्सवासाठी मुंबई-गोवा महामार्गाची आढावा बैठक; पालघर रस्ते दुरुस्ती आढावा', releases: 3 },
    { department: 'उद्योग विभाग (Industries)', highlight: 'पालघरमध्ये उद्योगांसाठी आवश्यक बाबींची पूर्तता; वाशी कामागारांसाठी आंतरराष्ट्रीय दर्जाचे मार्केट', releases: 2 },
    { department: 'पर्यावरण विभाग (Environment)', highlight: 'पर्यावरण पूरक गणपती निर्मिती कार्यशाळा; आपलं पर्यावरण जंगल विशेष दिनदर्शिकेचे प्रकाशन', releases: 3 },
    { department: 'ग्रामविकास व पंचायत राज (Rural Development)', highlight: 'पंचायत राजमध्ये पालघर जिल्ह्यातील ग्रामपंचायती अव्वल', releases: 2 },
    { department: 'महिला व बालविकास (Women & Child Dev)', highlight: 'आदिवासी महिलांच्या आरोग्यासाठी जिल्हा परिषद करणार आरोग्य सर्वे', releases: 2 },
    { department: 'सामाजिक न्याय (Social Justice)', highlight: 'एसटी समाजाच्या न्याय हक्कासाठी शासन आपल्या दारी', releases: 3 }
  ],
  socialMediaMetrics: [
    { platform: 'Twitter / X', handle: '@MahaDGIPR', posts: 14, impressions: '240K', engagement: '18.4K', status: 'Live' },
    { platform: 'Facebook', handle: 'DGIPR Maharashtra', posts: 12, impressions: '410K', engagement: '32.1K', status: 'Live' },
    { platform: 'Instagram', handle: '@mahadgipr_official', posts: 9, impressions: '520K', engagement: '48.6K', status: 'Live' },
    { platform: 'YouTube', handle: 'MahaNews DGIPR', posts: 6, impressions: '310K', engagement: '24.5K', status: 'Live' },
    { platform: 'Public App', handle: 'MahaGov Palghar', posts: 10, impressions: '85K', engagement: '9.2K', status: 'Live' }
  ]
};
