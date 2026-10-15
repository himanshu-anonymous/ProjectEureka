import { Language } from '@/types/dashboard';

export interface Translations {
  header: {
    title: string;
    subGov: string;
    tagline: string;
    telemetry: string;
    refresh: string;
    roleAdmin: string;
    roleCollector: string;
    roleDio: string;
  };
  sidebar: {
    title: string;
    dashboard: string;
    commandCenter: string;
    districts: string;
    pressReleases: string;
    media: string;
    activities: string;
    crisis: string;
    reports: string;
    notifications: string;
    profile: string;
    login: string;
    collapse: string;
  };
  toolbar: {
    title: string;
    subtitle: string;
    allMaha: string;
    puneDiv: string;
    konkanDiv: string;
    nagpurDiv: string;
    nashikDiv: string;
    aurangabadDiv: string;
    amravatiDiv: string;
    last7d: string;
    last30d: string;
    last90d: string;
    syncedBadge: string;
  };
  zone1: {
    zoneLabel: string;
    sectionTitle: string;
    totalReleases: string;
    avgTAT: string;
    sentimentIndex: string;
    misinformation: string;
    releasesTarget: string;
    tatTarget: string;
    sentimentTarget: string;
    misinfoTarget: string;
  };
  zone5: {
    zoneLabel: string;
    title: string;
    subtitle: string;
    pendingCount: string;
    threatLabel: string;
    districtPrefix: string;
    slaRemainingLabel: string;
    evidenceBtn: string;
    timelineBtn: string;
    authorizeBtn: string;
    authorizedBtn: string;
    activeQueue: string;
    viewAllBtn: string;
  };
  zone2: {
    zoneLabel: string;
    title: string;
    subtitle: string;
    cpiTab: string;
    eventTab: string;
    newsTab: string;
    chartTitle: string;
    selectedLabel: string;
    benchmarkLabel: string;
    searchPlaceholder: string;
    showingPrefix: string;
    districtsSuffix: string;
    rankCol: string;
    districtCol: string;
    divisionCol: string;
    releasesCol: string;
    tatCol: string;
    sentimentCol: string;
    crisisCol: string;
    cpiCol: string;
    actionCol: string;
    viewBtn: string;
    selectedBtn: string;
  };
  zone3: {
    zoneLabel: string;
    title: string;
    subtitle: string;
    rankPrefix: string;
    cpiPrefix: string;
    volumeTitle: string;
    volumeSub: string;
    tatTitle: string;
    tatSub: string;
    sentimentTitle: string;
    sentimentSub: string;
    crisisTitle: string;
    crisisSub: string;
    gapSuffix: string;
    footerLeft: string;
    footerRight: string;
  };
  zone4: {
    zoneLabel: string;
    title: string;
    subtitle: string;
    liveScanBadge: string;
    simulateBtn: string;
    filterAll: string;
    filterPositive: string;
    filterNegative: string;
    filterNeutral: string;
    footerStatus: string;
  };
  leadership: {
    mainHeader: string;
    mainSub: string;
    cmoBadge: string;
    matrixTitle: string;
    matrixSub: string;
    matrixAllBtn: string;
    matrixTopBtn: string;
    matrixLowerBtn: string;
    socialTitle: string;
    socialSub: string;
    socialStreamX: string;
    socialStreamMulti: string;
    gisTitle: string;
    gisSub: string;
    liveTitle: string;
    liveSub: string;
    liveOnAirBadge: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    header: {
      title: 'Konkan Division Command Center',
      subGov: 'Divisional Information Office, Konkan Division • DGIPR Maharashtra',
      tagline: 'Konkan Information Operations & Crisis Command',
      telemetry: 'Live Telemetry:',
      refresh: 'Refresh',
      roleAdmin: 'State DG Observer',
      roleCollector: 'District Collector',
      roleDio: 'DIO Desk',
    },
    sidebar: {
      title: 'State Portals (11)',
      dashboard: 'Dashboard',
      commandCenter: 'Command Center',
      districts: 'Districts',
      pressReleases: 'Press Release',
      media: 'Media',
      activities: 'Activities',
      crisis: 'Crisis',
      reports: 'Reports',
      notifications: 'Notification',
      profile: 'Profile',
      login: 'Logins (State/DM)',
      collapse: 'Collapse Sidebar',
    },
    toolbar: {
      title: 'Konkan Division Operations Overview',
      subtitle: 'Real-time governance telemetry across the 5 Pilot Districts of Konkan Division',
      allMaha: 'All Maharashtra',
      puneDiv: 'Pune Division',
      konkanDiv: 'Konkan Division',
      nagpurDiv: 'Nagpur Division',
      nashikDiv: 'Nashik Division',
      aurangabadDiv: 'Chhatrapati Sambhajinagar Division',
      amravatiDiv: 'Amravati Division',
      last7d: 'Last 7 days',
      last30d: 'Last 30 days',
      last90d: 'Last 90 days',
      syncedBadge: 'NIC/DGIPR Feed Synced',
    },
    zone1: {
      zoneLabel: 'Zone 1',
      sectionTitle: 'Key Performance Indicators',
      totalReleases: 'Total Releases',
      avgTAT: 'Avg TAT',
      sentimentIndex: 'Sentiment Index',
      misinformation: 'Misinformation Tickets',
      releasesTarget: 'Target 1,500 (83%)',
      tatTarget: 'Target ≤ 60 min (Met)',
      sentimentTarget: 'Target ≥ 70% (Met)',
      misinfoTarget: 'Target ≤ 15 (Met)',
    },
    zone5: {
      zoneLabel: 'Zone 5',
      title: 'Emergency Alert & Crisis Monitor',
      subtitle: 'Flashing warning cards with live countdown timers for pending rumors',
      pendingCount: 'Pending',
      threatLabel: 'Threat',
      districtPrefix: 'District:',
      slaRemainingLabel: '90-min SLA Remaining',
      evidenceBtn: 'Evidence',
      timelineBtn: 'Timeline',
      authorizeBtn: 'Authorize Rebuttal',
      authorizedBtn: 'Rebuttal Dispatched',
      activeQueue: 'Active Incidents Queue',
      viewAllBtn: 'View All Incidents',
    },
    zone2: {
      zoneLabel: 'Zone 2',
      title: 'District Leaderboard',
      subtitle: 'Stacked comparative bar charts & ranked tables',
      cpiTab: 'CPI Ranking',
      eventTab: 'Event Coverage (Top/Lower 5)',
      newsTab: 'Specific News Coverage (Top/Lower 5)',
      chartTitle: 'Top 5 Districts by CPI Score',
      selectedLabel: 'Selected District',
      benchmarkLabel: 'Top Quintile',
      searchPlaceholder: 'Search district by name...',
      showingPrefix: 'Showing:',
      districtsSuffix: 'Active Reporting Districts',
      rankCol: '#',
      districtCol: 'District',
      divisionCol: 'Division',
      releasesCol: 'Releases',
      tatCol: 'Avg. TAT',
      sentimentCol: 'Sentiment',
      crisisCol: 'Crisis SLA',
      cpiCol: 'CPI Score',
      actionCol: 'Action',
      viewBtn: 'Inspect',
      selectedBtn: 'Selected',
    },
    zone3: {
      zoneLabel: 'Zone 3',
      title: 'CPI Score Decomposition',
      subtitle: 'Grouped bar breakdown showing where points were lost (Volume vs. Speed)',
      rankPrefix: 'Rank',
      cpiPrefix: 'CPI',
      volumeTitle: 'Volume Score',
      volumeSub: 'Total releases vs target of 300',
      tatTitle: 'TAT / Speed Score',
      tatSub: 'Avg. TAT under 60-min standard',
      sentimentTitle: 'Media Sentiment Score',
      sentimentSub: 'Positive tone ratio in regional press',
      crisisTitle: 'Crisis SLA Score',
      crisisSub: 'Rumors refuted within 90-min mandate',
      gapSuffix: 'pts lost',
      footerLeft: 'Each component capped at 25 points',
      footerRight: 'Total Maximum CPI: 100 Points',
    },
    zone4: {
      zoneLabel: 'Zone 4',
      title: 'Live OCR Ingestion Stream',
      subtitle: 'Auto-scrolling feed of OCR scanned regional newspapers with Green/Red sentiment tags',
      liveScanBadge: 'Live OCR',
      simulateBtn: 'Simulate Ingest',
      filterAll: 'All',
      filterPositive: 'Positive',
      filterNegative: 'Negative',
      filterNeutral: 'Neutral',
      footerStatus: '18 Daily Newspapers Actively Monitored',
    },
    leadership: {
      mainHeader: 'Main Panels: Leadership Overview',
      mainSub: 'Comprehensive Statewide Media, GIS & Broadcast Telemetry',
      cmoBadge: 'Mantralaya CMO Command',
      matrixTitle: 'Top/Lower Five Matrix',
      matrixSub: 'District ranking, Event coverage, and specific News coverage extremes',
      matrixAllBtn: 'All (10)',
      matrixTopBtn: 'Top 5',
      matrixLowerBtn: 'Lower 5',
      socialTitle: 'Social Media Analysis',
      socialSub: 'Split streams for Twitter/X vs. FB/Insta/YouTube/LinkedIn',
      socialStreamX: 'Twitter / X Stream',
      socialStreamMulti: 'FB / Insta / YouTube / LinkedIn',
      gisTitle: 'Maharashtra GIS Map',
      gisSub: 'Interactive map with real-time hover states for all 36 District Information Offices',
      liveTitle: 'Live Event Streaming',
      liveSub: 'Unified live feed tracking CM events across YouTube, FB, Insta, and TV news channels',
      liveOnAirBadge: 'ON AIR BROADCAST',
    },
  },

  mr: {
    header: {
      title: 'कोकण विभाग माहिती व जनसंपर्क कक्ष',
      subGov: 'विभागीय माहिती कार्यालय, कोकण विभाग • माहिती व जनसंपर्क महासंचालनालय',
      tagline: 'कोकण विभाग माहिती संचालन व संकट निवारण कक्ष',
      telemetry: 'थेट माहिती प्रवाह:',
      refresh: 'रिफ्रेश करा',
      roleAdmin: 'राज्य निरीक्षक (DG)',
      roleCollector: 'जिल्हाधिकारी (DM)',
      roleDio: 'जिल्हा माहिती कार्यालय (DIO)',
    },
    sidebar: {
      title: 'शासकीय पोर्टल्स (११)',
      dashboard: 'मुख्य डॅशबोर्ड',
      commandCenter: 'कमांड सेंटर',
      districts: 'जिल्हे व कार्यालये',
      pressReleases: 'प्रसिद्धीपत्रके',
      media: 'माध्यम निरीक्षण',
      activities: 'उपक्रम व कार्यक्रम',
      crisis: 'आपत्कालीन प्रतिसाद',
      reports: 'सांख्यिकी अहवाल',
      notifications: 'शासकीय सूचना',
      profile: 'अधिकारी प्रोफाइल',
      login: 'प्रवेशद्वार (Logins)',
      collapse: 'पट्टी संकुचित करा',
    },
    toolbar: {
      title: 'कोकण विभाग माहिती व संनियंत्रण कक्ष',
      subtitle: 'कोकण विभागातील ५ प्रायोगिक जिल्ह्यांमधील २४x७ थेट शासन संनियंत्रण',
      allMaha: 'सर्व महाराष्ट्र',
      puneDiv: 'पुणे विभाग',
      konkanDiv: 'कोकण विभाग',
      nagpurDiv: 'नागपूर विभाग',
      nashikDiv: 'नाशिक विभाग',
      aurangabadDiv: 'छत्रपती संभाजीनगर विभाग',
      amravatiDiv: 'अमरावती विभाग',
      last7d: 'मागील ७ दिवस',
      last30d: 'मागील ३० दिवस',
      last90d: 'मागील ९० दिवस',
      syncedBadge: 'एनआयसी/डीजीआयपीआर थेट जोडणी',
    },
    zone1: {
      zoneLabel: 'विभाग १',
      sectionTitle: 'मुख्य कार्यक्षमता निर्देशांक (KPI)',
      totalReleases: 'एकूण प्रसिद्धीपत्रके',
      avgTAT: 'सरासरी प्रतिसाद वेळ (TAT)',
      sentimentIndex: 'सकारात्मक भावना %',
      misinformation: 'अफवा / तक्रारी',
      releasesTarget: 'उद्दिष्ट १,५०० (८३%)',
      tatTarget: 'उद्दिष्ट ≤ ६० मिनिटे (साध्य)',
      sentimentTarget: 'उद्दिष्ट ≥ ७०% (साध्य)',
      misinfoTarget: 'उद्दिष्ट ≤ १५ (साध्य)',
    },
    zone5: {
      zoneLabel: 'विभाग ५',
      title: 'आपत्कालीन सतर्कता व संकट निवारण कक्ष',
      subtitle: 'प्रलंबित अफवांसाठी थेट काउंटडाउन टाइमरसह तातडीच्या इशारे कार्ड्स',
      pendingCount: 'प्रलंबित',
      threatLabel: 'धोका',
      districtPrefix: 'जिल्हा:',
      slaRemainingLabel: '९० मिनिटे SLA उर्वरित वेळ',
      evidenceBtn: 'पुरावा',
      timelineBtn: 'घटनाक्रम',
      authorizeBtn: 'खंडन प्रसिद्धी अधिकृत करा',
      authorizedBtn: 'खंडन जारी झाले',
      activeQueue: 'सक्रिय प्रकरणांची यादी',
      viewAllBtn: 'सर्व आपत्कालीन नोंदी पहा',
    },
    zone2: {
      zoneLabel: 'विभाग २',
      title: 'जिल्ह्यांची कामगिरी व क्रमवारी (Leaderboard)',
      subtitle: 'तौलनिक आलेख व क्रमवारी तक्ता',
      cpiTab: 'CPI निर्देशांक क्रमवारी',
      eventTab: 'कार्यक्रम कव्हरेज (शीर्ष/तळ ५)',
      newsTab: 'विशेष बातमी कव्हरेज (शीर्ष/तळ ५)',
      chartTitle: 'CPI निर्देशांकानुसार शीर्ष ५ जिल्हे',
      selectedLabel: 'निवडलेला जिल्हा',
      benchmarkLabel: 'शीर्ष गट',
      searchPlaceholder: 'जिल्हा शोधा...',
      showingPrefix: 'दर्शविले:',
      districtsSuffix: 'सक्रिय जिल्हे',
      rankCol: 'क्र.',
      districtCol: 'जिल्हा',
      divisionCol: 'विभाग',
      releasesCol: 'पत्रके',
      tatCol: 'प्रतिसाद वेळ',
      sentimentCol: 'भावना %',
      crisisCol: 'आपत्ती SLA',
      cpiCol: 'CPI गुण',
      actionCol: 'कृती',
      viewBtn: 'तपासा',
      selectedBtn: 'निवडले',
    },
    zone3: {
      zoneLabel: 'विभाग ३',
      title: 'गुण विभागणी व विश्लेषण (Score Decomposition)',
      subtitle: 'गुण कुठे कमी झाले याचे विश्लेषण (उदा. Volume vs Speed)',
      rankPrefix: 'क्रमांक',
      cpiPrefix: 'CPI गुण',
      volumeTitle: 'प्रसिद्धीपत्रक प्रमाण (Volume)',
      volumeSub: '३०० उद्दिष्टाच्या तुलनेत प्रसिद्धी',
      tatTitle: 'वितरण गती (TAT Speed)',
      tatSub: '६० मिनिटांपेक्षा कमी सरासरी वेळ',
      sentimentTitle: 'माध्यम लोकभावना (Sentiment)',
      sentimentSub: 'प्रादेशिक वृत्तपत्रांमधील अनुकूल प्रमाण',
      crisisTitle: 'आपत्ती SLA अनुपालन (Crisis SLA)',
      crisisSub: '९० मिनिटांच्या आत अफवांचे खंडन',
      gapSuffix: 'गुण घट',
      footerLeft: 'प्रत्येक घटक कमाल २५ गुणांचा',
      footerRight: 'एकूण कमाल CPI: १०० गुण',
    },
    zone4: {
      zoneLabel: 'विभाग ४',
      title: 'थेट वर्तमानपत्र OCR स्कॅनिंग प्रवाह',
      subtitle: 'हिरव्या/लाल भावना टॅगसह वर्तमानपत्रांचा थेट स्वयं-स्क्रोलिंग फीड',
      liveScanBadge: 'थेट OCR',
      simulateBtn: 'नवीन स्कॅन जोडा',
      filterAll: 'सर्व',
      filterPositive: 'सकारात्मक',
      filterNegative: 'नकारात्मक',
      filterNeutral: 'तटस्थ',
      footerStatus: '१८ दैनिक वृत्तपत्रे सक्रिय स्कॅनिंग चालू',
    },
    leadership: {
      mainHeader: 'मुख्य पॅनेल: नेतृत्व दृश्यावलोकन',
      mainSub: 'राज्यस्तरीय माध्यम, जीआयएस व थेट प्रक्षेपण संनियंत्रण',
      cmoBadge: 'मंत्रालय सीएमओ कमांड',
      matrixTitle: 'शीर्ष व तळ पाच मॅट्रिक्स (Top/Lower 5)',
      matrixSub: 'जिल्हा क्रमवारी, कार्यक्रम कव्हरेज व विशेष बातमी extremes',
      matrixAllBtn: 'सर्व (१०)',
      matrixTopBtn: 'शीर्ष ५',
      matrixLowerBtn: 'तळ ५',
      socialTitle: 'सोशल मीडिया विश्लेषण (Social Media Analysis)',
      socialSub: 'Twitter/X आणि FB/Insta/YouTube/LinkedIn चे स्वतंत्र प्रवाह',
      socialStreamX: 'Twitter / X प्रवाह',
      socialStreamMulti: 'FB / Insta / YouTube / LinkedIn प्रवाह',
      gisTitle: 'महाराष्ट्र जीआयएस नकाशा (GIS Map)',
      gisSub: 'सर्व ३६ जिल्हा माहिती कार्यालयांचे थेट रिअल-टाइम स्थिती नकाशा',
      liveTitle: 'थेट शासकीय इव्हेंट प्रक्षेपण (Live Streaming)',
      liveSub: 'YouTube, FB, Insta व टीव्ही वाहिन्यांवरील मुख्यमंत्री वार्तालाप',
      liveOnAirBadge: 'थेट प्रक्षेपण सुरू',
    },
  },
};

export function useTranslation(language: Language): Translations {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}
