import { AuthUser, DistrictData, IncidentData, OCRRecord, NewsQueueItem } from '@/types/dashboard';
import { INITIAL_DISTRICTS, INITIAL_INCIDENTS, INITIAL_OCR_FEED } from '@/data/dashboardData';
import { INITIAL_QUEUE_ITEMS } from '@/data/newsQueueData';

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
      name: 'Dr. Arvind M. Gokhale',
      marathiName: 'डॉ. अरविंद एम. गोखले',
      role: 'dg_admin',
      designation: 'Director General, DGIPR Maharashtra',
      division: 'All Maharashtra',
      district: 'All',
      avatarInitials: 'AG',
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
      name: 'Rudresh Kumar Sawant',
      marathiName: 'रुद्रेश कुमार सावंत',
      role: 'director_konkan',
      designation: 'Divisional Deputy Director',
      division: 'Konkan',
      district: 'Active Districts',
      avatarInitials: 'RS',
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
      name: 'Vikram S. Mahajan, IAS',
      marathiName: 'विक्रम एस. महाजन (भा.प्र.से.)',
      role: 'collector',
      designation: 'District Magistrate & Collector, Palghar',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'VM',
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
      name: 'Nilesh R. Kelkar, IAS',
      marathiName: 'निलेश आर. केळकर (भा.प्र.से.)',
      role: 'collector',
      designation: 'District Magistrate & Collector, Thane',
      division: 'Konkan',
      district: 'Thane',
      avatarInitials: 'NK',
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
      name: 'Mandar S. Nerurkar',
      marathiName: 'मंदार एस. नेरुरकर',
      role: 'dio_desk',
      designation: 'DIO Desk Operator',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'MN',
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
      name: 'Mandar S. Nerurkar',
      marathiName: 'मंदार एस. नेरुरकर',
      role: 'dio_desk',
      designation: 'DIO Desk Operator',
      division: 'Konkan',
      district: 'Palghar',
      avatarInitials: 'MN',
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
let serverNewsQueue: NewsQueueItem[] = [...INITIAL_QUEUE_ITEMS];

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
      scopeName: 'State Operations Command',
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
    scopeName: 'State Operations Overview',
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

export function getServerOcrFeed(sentimentFilter?: string, districtFilter?: string): OCRRecord[] {
  let feed = serverOcrFeed;
  if (sentimentFilter && sentimentFilter !== 'All') {
    feed = feed.filter((item) => item.sentiment === sentimentFilter);
  }
  if (districtFilter && districtFilter !== 'All' && districtFilter !== '') {
    feed = feed.filter((item) => item.district.toLowerCase() === districtFilter.toLowerCase());
  }
  return feed;
}

export function addServerOcrRecord(record: OCRRecord) {
  serverOcrFeed = [record, ...serverOcrFeed];
  return serverOcrFeed;
}

export function getServerNewsQueue(
  district?: string,
  sentiment?: string,
  channel?: string,
  verification?: string,
  search?: string
): NewsQueueItem[] {
  let items = [...serverNewsQueue];
  if (district && district.toLowerCase() !== 'all') {
    items = items.filter((i) => i.district.toLowerCase() === district.toLowerCase());
  }
  if (sentiment && sentiment !== 'All') {
    items = items.filter((i) => i.sentiment.toLowerCase() === sentiment.toLowerCase());
  }
  if (channel && channel.toLowerCase() !== 'all') {
    items = items.filter((i) => i.channelType.toLowerCase() === channel.toLowerCase());
  }
  if (verification && verification !== 'All') {
    items = items.filter((i) => i.verification.toLowerCase() === verification.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.newsEn.toLowerCase().includes(q) ||
        i.newsMr.includes(q) ||
        i.source.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }
  return items;
}

export function addServerNewsItem(item: NewsQueueItem) {
  serverNewsQueue = [item, ...serverNewsQueue];
  return serverNewsQueue;
}

// Extracted structured data from daily operations reports
export const KONKAN_DAILY_OPERATIONS_REPORT = {
  office: 'Divisional Information Office',
  officeMr: 'विभागीय माहिती कार्यालय',
  reportDate: '13 Oct 2026',
  reportDateMr: '१३ ऑक्टोबर २०२६',
  districtsCovered: ['Palghar', 'Thane', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Mumbai City', 'Mumbai Suburban'],
  districtsCoveredMr: ['पालघर', 'ठाणे', 'रायगड', 'रत्नागिरी', 'सिंधुदुर्ग', 'मुंबई शहर', 'मुंबई उपनगर'],
  vipProgramCoverage: [
    {
      vip: 'Hon. Chief Minister',
      vipMr: 'मा. मुख्यमंत्री',
      events: [
        'Launch of Bharat Taxi at Navi Mumbai Airport',
        'Drug-Free Campaign Inauguration at DY Patil University, Navi Mumbai',
        'Double-decker cargo train green flag from JNPT to Madhya Pradesh',
        'Eco-friendly Ganpati workshop at Vashi Exhibition Hall',
        'Housing and land titles to Palghar tribals'
      ],
      eventsMr: [
        'नवी मुंबई विमानतळ येथे भारत टॅक्सीची सुरूवात',
        'नवी मुंबई येथील डी वाय पाटील विद्यापीठात नशामुक्त अभियानाची सुरूवात',
        'जेएनपीटी ते मध्य प्रदेश पर्यंत डबल डेकर मालगाडीला हिरवी झेंडी',
        'वाशी येथील प्रदर्शन हॉल येथे पर्यावरण पूरक गणपती कार्यशाळा',
        'पालघर येथील आदिवासी नागरिकांना हक्काचे घर आणि जमीन'
      ],
      socialReach: '100K+ Views · 20K Engagement · 1K Shares',
      socialReachMr: '१०० हजार+ व्ह्यूज · २० हजार प्रतिबद्धता · १ हजार शेअर्स'
    },
    {
      vip: 'Hon. Governor',
      vipMr: 'मा. राज्यपाल',
      events: [
        'BATU Lonere Convocation Ceremony at Dr. Babasaheb Ambedkar Technological University',
        'Interaction with tribal students and felicitation of gold medalists in engineering',
        'Review of state skill incubation centre and vocational training programs',
        'State Raj Bhavan media briefing on tribal education upliftment initiatives'
      ],
      eventsMr: [
        'लोणारे येथील डॉ. बाबासाहेब आंबेडकर तंत्रज्ञान विद्यापीठाच्या पदवीदान समारंभ',
        'आदिवासी विद्यार्थ्यांशी संवाद व अभियांत्रिकी सुवर्णपदक विजेत्यांचा सत्कार',
        'राज्य कौशल्य उष्मायन केंद्र व व्यावसायिक प्रशिक्षण कार्यक्रमांचा आढावा',
        'आदिवासी शिक्षण विकासासंबंधी राजभवन अधिकृत माध्यम संवाद'
      ],
      socialReach: '42K+ Views · 8.5K Engagement · 420 Shares',
      socialReachMr: '४२ हजार+ व्ह्यूज · ८.५ हजार प्रतिबद्धता · ४२० शेअर्स'
    },
    {
      vip: 'Divisional Commissioner',
      vipMr: 'विभागीय आयुक्त',
      events: [
        'Divisional Commissioner SIR Review Visits to Ratnagiri, Raigad, Thane and Palghar',
        'Inter-district revenue resolution camp and digital land records progress meet',
        'Disaster management mock drill coordination for coastal districts',
        'Review of 21 line departments citizen service delivery metrics'
      ],
      eventsMr: [
        'विभागीय आयुक्त यांची एसआयआरसंबंधी रत्नागिरी, रायगड, ठाणे आणि पालघर जिल्हा भेट',
        'आंतर-जिल्हा महसूल निवारण शिबीर आणि डिजिटल भूमी अभिलेख आढावा',
        'किनारपट्टी जिल्ह्यांसाठी आपत्ती व्यवस्थापन सराव समन्वय',
        '२१ संबंधित विभागांच्या नागरिक सेवा वितरण निर्देशांकाचा आढावा'
      ],
      socialReach: '28K+ Views · 4.8K Engagement · 210 Shares',
      socialReachMr: '२८ हजार+ व्ह्यूज · ४.८ हजार प्रतिबद्धता · २१० शेअर्स'
    }
  ],
  lineDepartmentsCoverage: [
    {
      department: 'Agriculture Department',
      departmentMr: 'कृषी विभाग',
      highlight: 'Divisional Kharif and drought contingency review meeting, commencement of paddy harvesting',
      highlightMr: 'कोकण विभागीय खरीप व दुष्काळ नियोजन आढावा बैठक, भात पीक कापणी सुरूवात',
      releases: 4
    },
    {
      department: 'Revenue & Forest Department',
      departmentMr: 'महसूल व वन विभाग',
      highlight: 'Chief Secretary visit to MahaKhanij Command Control Center; distribution of forest titles to tribals; special revenue camp',
      highlightMr: 'महाखनिज कमांड कंट्रोल सेंटरला मुख्य सचिव भेट; आदिवासी नागरिकांना वनपट्टे प्रदान; विशेष महसूल शिबीर',
      releases: 6
    },
    {
      department: 'Public Works Department (PWD)',
      departmentMr: 'सार्वजनिक बांधकाम विभाग',
      highlight: 'Review meeting for Mumbai-Goa Highway for Ganeshotsav; Palghar road repairs progress',
      highlightMr: 'गणपती महोत्सवासाठी मुंबई-गोवा महामार्गाची आढावा बैठक; पालघर रस्ते दुरुस्ती आढावा',
      releases: 3
    },
    {
      department: 'Industries Department',
      departmentMr: 'उद्योग विभाग',
      highlight: 'Fulfillment of essential infrastructure for industries in Palghar; international standard market for Vashi workers',
      highlightMr: 'पालघरमध्ये उद्योगांसाठी आवश्यक बाबींची पूर्तता; वाशी कामागारांसाठी आंतरराष्ट्रीय दर्जाचे मार्केट',
      releases: 2
    },
    {
      department: 'Environment Department',
      departmentMr: 'पर्यावरण विभाग',
      highlight: 'Eco-friendly Ganpati idol making workshop; release of our environment special forest calendar',
      highlightMr: 'पर्यावरण पूरक गणपती निर्मिती कार्यशाळा; आपलं पर्यावरण जंगल विशेष दिनदर्शिकेचे प्रकाशन',
      releases: 3
    },
    {
      department: 'Rural Development & Panchayati Raj',
      departmentMr: 'ग्रामविकास व पंचायत राज',
      highlight: 'Palghar Gram Panchayats top performance ranking in Panchayati Raj',
      highlightMr: 'पंचायत राजमध्ये पालघर जिल्ह्यातील ग्रामपंचायती अव्वल',
      releases: 2
    },
    {
      department: 'Women & Child Development',
      departmentMr: 'महिला व बालविकास',
      highlight: 'Zilla Parishad health survey for tribal women and child nutrition',
      highlightMr: 'आदिवासी महिलांच्या आरोग्यासाठी जिल्हा परिषद करणार आरोग्य सर्वे',
      releases: 2
    },
    {
      department: 'Social Justice Department',
      departmentMr: 'सामाजिक न्याय विभाग',
      highlight: 'Government at your doorstep initiative for legal and welfare rights of marginalized communities',
      highlightMr: 'वंचित घटकांच्या न्याय हक्कासाठी शासन आपल्या दारी विशेष मोहीम',
      releases: 3
    },
    {
      department: 'Public Health & Family Welfare',
      departmentMr: 'सार्वजनिक आरोग्य व कुटुंब कल्याण',
      highlight: 'Mahatma Jyotirao Phule Jan Arogya Yojana ₹5 Lakh coverage drive & 24x7 automated diagnostic suites',
      highlightMr: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना ₹५ लाख कवच विस्तार व २४x७ निदान केंद्र',
      releases: 5
    },
    {
      department: 'Home Department',
      departmentMr: 'गृह विभाग',
      highlight: 'State Cyber Command Center achieves 98.4% portal take-down rate and smart policing review',
      highlightMr: 'सायबर कमांड सेंटर ९८.४% पोर्टल कारवाई आणि स्मार्ट पोलिसिंग आढावा',
      releases: 4
    },
    {
      department: 'School Education & Sports',
      departmentMr: 'शालेय शिक्षण व क्रीडा',
      highlight: 'Digital classroom rollout across 1,200 zilla parishad schools and Taluka Krida Mahotsav schedule',
      highlightMr: '१,२०० जिल्हा परिषद शाळांमध्ये डिजिटल वर्गखोल्या व तालुका क्रीडा महोत्सव',
      releases: 3
    },
    {
      department: 'Higher & Technical Education',
      departmentMr: 'उच्च व तंत्रशिक्षण',
      highlight: 'Establishment of state AI & Semiconductor skilling center in Government Engineering Colleges',
      highlightMr: 'शासकीय अभियांत्रिकी महाविद्यालयांमध्ये एआय व सेमीकंडक्टर कौशल्य केंद्र',
      releases: 2
    },
    {
      department: 'Water Resources / Irrigation',
      departmentMr: 'जलसंपदा विभाग',
      highlight: 'Konkan irrigation dam storage review at 92.4% capacity and canal maintenance schedule',
      highlightMr: 'कोकण विभागातील जलसाठा ९२.४% आढावा आणि कालवा देखभाल नियोजन',
      releases: 3
    },
    {
      department: 'Urban Development Department',
      departmentMr: 'नगर विकास विभाग',
      highlight: 'Unified Geographic Information System zoning plan clearance for MMR and tier-2 corporations',
      highlightMr: 'एमएमआर व द्वितीय श्रेणी महानगरपालिकांसाठी युनिफाइड जीआयएस क्षेत्र विकास योजना',
      releases: 4
    },
    {
      department: 'Energy & Renewable Resources',
      departmentMr: 'ऊर्जा व नवीकरणीय ऊर्जा',
      highlight: 'PM Kusum solar agricultural feeder commissioning covering 42,000 farmers in Marathwada & Vidarbha',
      highlightMr: 'पीएम कुसुम सौर कृषी फिडरद्वारे ४२,००० शेतकऱ्यांना दिवसा अखंड वीजपुरवठा',
      releases: 3
    },
    {
      department: 'Tribal Development',
      departmentMr: 'आदिवासी विकास विभाग',
      highlight: 'DBT scholarship disbursement to 1.8 Lakh students and tribal residential school infra upgrade',
      highlightMr: '१.८ लाख विद्यार्थ्यांना डीबीटी शिष्यवृत्ती वितरण आणि आश्रमशाळा पायाभूत सुविधा सुधारणा',
      releases: 3
    },
    {
      department: 'Food, Civil Supplies & Consumer Protection',
      departmentMr: 'अन्न, नागरी पुरवठा व ग्राहक संरक्षण',
      highlight: 'One Nation One Ration Card biometrics integration achieved 99.1% verification in coastal districts',
      highlightMr: 'वन नेशन वन रेशन कार्ड बायोमेट्रिक प्रमाणीकरण किनारपट्टी जिल्ह्यांत ९९.१% पूर्ण',
      releases: 2
    },
    {
      department: 'Tourism & Cultural Affairs',
      departmentMr: 'पर्यटन व सांस्कृतिक कार्य',
      highlight: 'Coastal fort conservation corridor sanctioned for Sindhudurg, Raigad, and Ratnagiri sea forts',
      highlightMr: 'सिंधुदुर्ग, रायगड व रत्नागिरी जलदुर्ग संवर्धन कॉरिडॉर मंजुरी',
      releases: 3
    },
    {
      department: 'Transport & Ports',
      departmentMr: 'परिवहन व बंदरे विभाग',
      highlight: 'Vadhvan Port environmental mitigation tracking and eco-electric bus fleet deployment for MSRTC',
      highlightMr: 'वाढवण बंदर पर्यावरण पूरक उपाययोजना आणि एसटी महामंडळासाठी ई-बस ताफा',
      releases: 4
    },
    {
      department: 'Skill Development & Entrepreneurship',
      departmentMr: 'कौशल्य विकास व उद्योजकता',
      highlight: 'Chief Minister Maha-Kaushalya Youth Job Fair registered 14,800 youth placements',
      highlightMr: 'मुख्यमंत्री महाकौशल्य युवा रोजगार मेळाव्यात १४,८०० तरुणांची निवड',
      releases: 2
    },
    {
      department: 'Medical Education & Drugs',
      departmentMr: 'वैद्यकीय शिक्षण व औषधी द्रव्ये',
      highlight: 'Super-specialty cardiology wings inaugurated at 4 new Government Medical Colleges',
      highlightMr: '४ नवीन शासकीय वैद्यकीय महाविद्यालयांमध्ये सुपर स्पेशालिटी कार्डिओलॉजी विभागांचे उद्घाटन',
      releases: 3
    }
  ],
  socialMediaMetrics: [
    { platform: 'Twitter / X', platformMr: 'ट्विटर / एक्स', handle: '@MahaDGIPR', posts: 14, impressions: '240K', impressionsMr: '२४० हजार', engagement: '18.4K', engagementMr: '१८.४ हजार', status: 'Live', statusMr: 'थेट' },
    { platform: 'Facebook', platformMr: 'फेसबुक', handle: 'DGIPR Maharashtra', posts: 12, impressions: '410K', impressionsMr: '४१० हजार', engagement: '32.1K', engagementMr: '३२.१ हजार', status: 'Live', statusMr: 'थेट' },
    { platform: 'Instagram', platformMr: 'इन्स्टाग्राम', handle: '@mahadgipr_official', posts: 9, impressions: '520K', impressionsMr: '५२० हजार', engagement: '48.6K', engagementMr: '४८.६ हजार', status: 'Live', statusMr: 'थेट' },
    { platform: 'YouTube', platformMr: 'यूट्यूब', handle: 'MahaNews DGIPR', posts: 6, impressions: '310K', impressionsMr: '३१० हजार', engagement: '24.5K', engagementMr: '२४.५ हजार', status: 'Live', statusMr: 'थेट' },
    { platform: 'WhatsApp Channel', platformMr: 'व्हॉट्सॲप चॅनल', handle: 'MahaGov Direct Bulletins', posts: 18, impressions: '680K', impressionsMr: '६८० हजार', engagement: '94.2K', engagementMr: '९४.२ हजार', status: 'Live', statusMr: 'थेट' },
    { platform: 'Public App', platformMr: 'पब्लिक ॲप', handle: 'MahaGov Palghar', posts: 10, impressions: '85K', impressionsMr: '८५ हजार', engagement: '9.2K', engagementMr: '९.२ हजार', status: 'Live', statusMr: 'थेट' }
  ]
};
