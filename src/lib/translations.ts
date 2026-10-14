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
      title: 'Maha-Command Center',
      subGov: 'Government of Maharashtra • DGIPR',
      tagline: 'State Information Operations & Crisis Command',
      telemetry: 'Live Telemetry:',
      refresh: 'Refresh',
      roleAdmin: 'DG State Admin',
      roleCollector: 'District Collector',
      roleDio: 'DIO Desk',
    },
    sidebar: {
      title: 'State Portals (11)',
      dashboard: '2. Dashboard',
      commandCenter: '3. Command Center',
      districts: '4. Districts',
      pressReleases: '5. Press Release',
      media: '6. Media',
      activities: '7. Activities',
      crisis: '8. Crisis',
      reports: '9. Reports',
      notifications: '10. Notification',
      profile: '11. Profile',
      login: '1. Logins (State/DM)',
      collapse: 'Collapse Sidebar',
    },
    toolbar: {
      title: 'Statewide Operations Overview',
      subtitle: 'Real-time governance telemetry across all 36 Maharashtra Districts & 6 Administrative Divisions',
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
      sectionTitle: '4 Metric Counters (Key Performance Indicators)',
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
      title: 'महा-कमांड सेंटर',
      subGov: 'महाराष्ट्र शासन • माहिती व जनसंपर्क महासंचालनालय (DGIPR)',
      tagline: 'राज्यस्तरीय माहिती संचलन व संकट निवारण आदेश कक्ष',
      telemetry: 'थेट माहिती प्रवाह:',
      refresh: 'रिफ्रेश करा',
      roleAdmin: 'महासंचालक (राज्य प्रशासक)',
      roleCollector: 'जिल्हाधिकारी (DM)',
      roleDio: 'जिल्हा माहिती कार्यालय (DIO)',
    },
    sidebar: {
      title: 'शासकीय पोर्टल्स (११)',
      dashboard: '२. मुख्य डॅशबोर्ड',
      commandCenter: '३. कमांड सेंटर',
      districts: '४. जिल्हे व कार्यालये',
      pressReleases: '५. प्रसिद्धीपत्रके',
      media: '६. माध्यम निरीक्षण',
      activities: '७. उपक्रम व कार्यक्रम',
      crisis: '८. आपत्कालीन प्रतिसाद',
      reports: '९. सांख्यिकी अहवाल',
      notifications: '१०. शासकीय सूचना',
      profile: '११. अधिकारी प्रोफाइल',
      login: '१. प्रवेशद्वार (Logins)',
      collapse: 'पट्टी संकुचित करा',
    },
    toolbar: {
      title: 'राज्यस्तरीय माहिती व संनियंत्रण कक्ष',
      subtitle: 'सर्व ३६ जिल्हे व ६ प्रशासकीय विभागांमधील २४x७ शासन संनियंत्रण',
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
      sectionTitle: '४ मुख्य कार्यक्षमता मेट्रिक काउंटर्स (KPI)',
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

  hi: {
    header: {
      title: 'महा-कमांड सेंटर',
      subGov: 'महाराष्ट्र शासन • सूचना एवं जनसंपर्क महानिदेशालय (DGIPR)',
      tagline: 'राज्यस्तरीय सूचना संचालन एवं संकट निवारण कमांड कक्ष',
      telemetry: 'लाइव टेलीमेट्री:',
      refresh: 'रिफ्रेश करें',
      roleAdmin: 'महानिदेशक (राज्य प्रशासक)',
      roleCollector: 'जिलाधिकारी (DM)',
      roleDio: 'जिला सूचना कार्यालय (DIO)',
    },
    sidebar: {
      title: 'शासकीय पोर्टल (११)',
      dashboard: '२. मुख्य डैशबोर्ड',
      commandCenter: '३. कमांड सेंटर',
      districts: '४. जिले एवं कार्यालय',
      pressReleases: '५. प्रेस विज्ञप्तियां',
      media: '६. मीडिया निगरानी',
      activities: '७. कार्यक्रम व अभियान',
      crisis: '८. आपातकालीन कार्रवाई',
      reports: '९. सांख्यिकी रिपोर्ट',
      notifications: '१०. शासकीय सूचनाएं',
      profile: '११. अधिकारी प्रोफाइल',
      login: '१. लॉगिन पोर्टल (Logins)',
      collapse: 'साइडबार संकुचित करें',
    },
    toolbar: {
      title: 'राज्यस्तरीय सूचना एवं निगरानी कक्ष',
      subtitle: 'सभी ३६ जिलों एवं ६ प्रशासनिक संभागों में २४x७ शासकीय मॉनिटरिंग',
      allMaha: 'संपूर्ण महाराष्ट्र',
      puneDiv: 'पुणे संभाग',
      konkanDiv: 'कोंकण संभाग',
      nagpurDiv: 'नागपुर संभाग',
      nashikDiv: 'नासिक संभाग',
      aurangabadDiv: 'छत्रपति संभाजीनगर संभाग',
      amravatiDiv: 'अमरावती संभाग',
      last7d: 'पिछले ७ दिन',
      last30d: 'पिछले ३० दिन',
      last90d: 'पिछले ९० दिन',
      syncedBadge: 'एनआईसी/डीजीआईपीआर लाइव कनेक्ट',
    },
    zone1: {
      zoneLabel: 'जोन १',
      sectionTitle: '४ मुख्य कार्यक्षमता मेट्रिक काउंटर्स (KPI)',
      totalReleases: 'कुल प्रेस विज्ञप्तियां',
      avgTAT: 'औसत प्रतिक्रिया समय (TAT)',
      sentimentIndex: 'सकारात्मक भावना %',
      misinformation: 'अफवाह / फेक न्यूज मामले',
      releasesTarget: 'लक्ष्य १,५०० (८३%)',
      tatTarget: 'लक्ष्य ≤ ६० मिनट (सफल)',
      sentimentTarget: 'लक्ष्य ≥ ७०% (सफल)',
      misinfoTarget: 'लक्ष्य ≤ १५ (सफल)',
    },
    zone5: {
      zoneLabel: 'जोन ५',
      title: 'आपातकालीन सतर्कता एवं संकट प्रबंधन कक्ष',
      subtitle: 'लंबित अफवाहों के लिए लाइव काउंटडाउन टाइमर सहित चेतावनी कार्ड',
      pendingCount: 'लंबित',
      threatLabel: 'खतरा',
      districtPrefix: 'जिला:',
      slaRemainingLabel: '९० मिनट SLA शेष समय',
      evidenceBtn: 'साक्ष्य',
      timelineBtn: 'घटनाक्रम',
      authorizeBtn: 'खंडन जारी करने की अनुमति दें',
      authorizedBtn: 'खंडन जारी किया गया',
      activeQueue: 'सक्रिय मामलों की सूची',
      viewAllBtn: 'सभी आपातकालीन मामले देखें',
    },
    zone2: {
      zoneLabel: 'जोन २',
      title: 'जिलों का प्रदर्शन एवं रैंकिंग (Leaderboard)',
      subtitle: 'तुलनात्मक बार चार्ट एवं रैंकिंग तालिका',
      cpiTab: 'CPI सूचकांक रैंकिंग',
      eventTab: 'कार्यक्रम कवरेज (शीर्ष/निम्न ५)',
      newsTab: 'विशेष समाचार कवरेज (शीर्ष/निम्न ५)',
      chartTitle: 'CPI सूचकांक अनुसार शीर्ष ५ जिले',
      selectedLabel: 'चयनित जिला',
      benchmarkLabel: 'शीर्ष संवर्ग',
      searchPlaceholder: 'जिला खोजें...',
      showingPrefix: 'प्रदर्शित:',
      districtsSuffix: 'सक्रिय जिले',
      rankCol: 'क्र.',
      districtCol: 'जिला',
      divisionCol: 'संभाग',
      releasesCol: 'विज्ञप्तियां',
      tatCol: 'प्रतिक्रिया समय',
      sentimentCol: 'भावना %',
      crisisCol: 'आपदा SLA',
      cpiCol: 'CPI अंक',
      actionCol: 'कार्रवाई',
      viewBtn: 'देखें',
      selectedBtn: 'चयनित',
    },
    zone3: {
      zoneLabel: 'जोन ३',
      title: 'अंक विभाजन एवं विश्लेषण (Score Decomposition)',
      subtitle: 'अंक कहां कम हुए इसका विश्लेषण (उदा. Volume vs Speed)',
      rankPrefix: 'रैंक',
      cpiPrefix: 'CPI अंक',
      volumeTitle: 'विज्ञप्ति मात्रा (Volume)',
      volumeSub: '३०० लक्ष्य की तुलना में विज्ञप्तियां',
      tatTitle: 'वितरण गति (TAT Speed)',
      tatSub: '६० मिनट से कम औसत समय',
      sentimentTitle: 'मीडिया जनभावना (Sentiment)',
      sentimentSub: 'क्षेत्रीय समाचार पत्रों में सकारात्मक अनुपात',
      crisisTitle: 'आपदा SLA अनुपालन (Crisis SLA)',
      crisisSub: '९० मिनट के भीतर अफवाहों का खंडन',
      gapSuffix: 'अंक घटे',
      footerLeft: 'प्रत्येक घटक अधिकतम २५ अंकों का',
      footerRight: 'कुल अधिकतम CPI: १०० अंक',
    },
    zone4: {
      zoneLabel: 'जोन ४',
      title: 'लाइव समाचार पत्र ओसीआर स्कैनिंग प्रवाह',
      subtitle: 'हरे/लाल भावना टैग के साथ समाचार पत्रों का लाइव ऑटो-स्क्रॉलिंग फीड',
      liveScanBadge: 'लाइव OCR',
      simulateBtn: 'नया स्कैन जोड़ें',
      filterAll: 'सभी',
      filterPositive: 'सकारात्मक',
      filterNegative: 'नकारात्मक',
      filterNeutral: 'तटस्थ',
      footerStatus: '१८ दैनिक समाचार पत्रों की सक्रिय निगरानी जारी',
    },
    leadership: {
      mainHeader: 'मुख्य पैनल: नेतृत्व अवलोकन',
      mainSub: 'राज्यस्तरीय मीडिया, जीआईएस एवं लाइव प्रसारण निगरानी',
      cmoBadge: 'मंत्रालय सीएमओ कमांड',
      matrixTitle: 'शीर्ष व निम्न पांच मैट्रिक्स (Top/Lower 5)',
      matrixSub: 'जिला रैंकिंग, कार्यक्रम कवरेज एवं विशेष समाचार extremes',
      matrixAllBtn: 'सभी (१०)',
      matrixTopBtn: 'शीर्ष ५',
      matrixLowerBtn: 'निम्न ५',
      socialTitle: 'सोशल मीडिया विश्लेषण (Social Media Analysis)',
      socialSub: 'Twitter/X एवं FB/Insta/YouTube/LinkedIn के विभाजित प्रवाह',
      socialStreamX: 'Twitter / X प्रवाह',
      socialStreamMulti: 'FB / Insta / YouTube / LinkedIn प्रवाह',
      gisTitle: 'महाराष्ट्र जीआईएस मानचित्र (GIS Map)',
      gisSub: 'सभी ३६ जिला सूचना कार्यालयों का लाइव रियल-टाइम स्थिति मानचित्र',
      liveTitle: 'लाइव शासकीय इवेंट प्रसारण (Live Streaming)',
      liveSub: 'YouTube, FB, Insta व टीवी चैनलों पर मुख्यमंत्री का सीधा प्रसारण',
      liveOnAirBadge: 'सीधा प्रसारण जारी',
    },
  },
};

export function useTranslation(language: Language): Translations {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}
