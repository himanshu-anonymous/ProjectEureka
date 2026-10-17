import { Language } from '@/types/dashboard';

export interface Translations {
  common: {
    searchPlaceholder: string;
    exportReport: string;
    exportDataset: string;
    refresh: string;
    close: string;
    save: string;
    cancel: string;
    submit: string;
    inspect: string;
    back: string;
    next: string;
    filterAll: string;
    online: string;
    offline: string;
    active: string;
    scheduled: string;
    completed: string;
    operational: string;
    verified: string;
    allDistricts: string;
    stateCommand: string;
  };
  header: {
    title: string;
    subGov: string;
    tagline: string;
    telemetry: string;
    refresh: string;
    roleAdmin: string;
    roleCollector: string;
    roleDio: string;
    brand: string;
    selectLanguage: string;
    languageTitle: string;
    districtScopeTitle: string;
    allDistricts: string;
    activeDistricts: string;
    dutyClock: string;
    notificationsTitle: string;
    profileTitle: string;
    signOut: string;
  };
  sidebar: {
    title: string;
    commandTelemetryGroup: string;
    districtGovernanceGroup: string;
    intelligenceSystemGroup: string;
    systemAdminGroup: string;
    dashboard: string;
    commandCenter: string;
    systemMonitoring: string;
    telemetryAudit: string;
    rawIngestion: string;
    pipelineFlow: string;
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
    signOut: string;
  };
  toolbar: {
    title: string;
    subtitle: string;
    allMaha: string;
    allDistricts: string;
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
    divisionalClearance: string;
    statewideClearance: string;
    districtClearance: string;
    exportBtn: string;
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
    yourDistrict: string;
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
    wireSuffix: string;
    autoStreamOn: string;
    autoStreamOff: string;
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
  districts: {
    title: string;
    subtitle: string;
    evaluationBadge: string;
  };
  commandCenter: {
    deckTitle: string;
    deckSub: string;
    activeDistrictsPill: string;
    liveOperationsPill: string;
    systemHealthBtn: string;
    gisMeshPill: string;
    tabTelemetry: string;
    tabRawIngestion: string;
    tabPipeline: string;
    subTelemetry: string;
    subRawIngestion: string;
    subPipeline: string;
  };
  systemMonitoring: {
    title: string;
    subtitle: string;
    sdcBadge: string;
    cmdDeckLink: string;
    tabTelemetryAudit: string;
    tabRawIngestion: string;
    tabPipelineFlow: string;
    subTelemetryAudit: string;
    subRawIngestion: string;
    subPipelineFlow: string;
  };
  activities: {
    title: string;
    subtitle: string;
    cycleBadge: string;
    autoRefresh: string;
    midpointTrigger: string;
    itineraryTitle: string;
    itinerarySub: string;
    trackedEvents: string;
    nextSequence: string;
    prevSequence: string;
  };
  crisis: {
    title: string;
    subtitle: string;
    slaMetricTitle: string;
    slaTargetMet: string;
    activeIncidentsTitle: string;
    inTriage: string;
    authorizedRebuttalsTitle: string;
    dispatchedToMedia: string;
    collectorClearancePrefix: string;
    operatorClearancePrefix: string;
    adminClearancePrefix: string;
  };
  pressReleases: {
    title: string;
    subtitle: string;
    createDraftBtn: string;
    filterAll: string;
    filterPublished: string;
    filterUnderReview: string;
    filterDraft: string;
    colId: string;
    colTitle: string;
    colDept: string;
    colDate: string;
    colStatus: string;
    colDownloads: string;
    colAction: string;
  };
  media: {
    title: string;
    subtitle: string;
    newspapersTitle: string;
    newspapersSub: string;
    trackedNewspapers: string;
    tvTitle: string;
    tvSub: string;
    trackedChannels: string;
  };
  reports: {
    title: string;
    subtitle: string;
    generateBtn: string;
    tabLineDepts: string;
    tabVip: string;
    tabSocial: string;
  };
  notifications: {
    title: string;
    subtitle: string;
    markAllRead: string;
    tabAll: string;
    tabSla: string;
    tabDio: string;
    tabDirectives: string;
  };
  profile: {
    title: string;
    subtitle: string;
    postingStation: string;
    cadre: string;
    clearanceTier: string;
    saveBtn: string;
  };
  login: {
    stateIdentity: string;
    deptIdentity: string;
    portalTitle: string;
    portalDescription: string;
    officerIdLabel: string;
    pinLabel: string;
    captchaLabel: string;
    submitBtn: string;
    tabCredentials: string;
    tabSso: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    common: {
      searchPlaceholder: 'Search district by name...',
      exportReport: 'Export Report',
      exportDataset: 'Export Dataset',
      refresh: 'Refresh',
      close: 'Close',
      save: 'Save Changes',
      cancel: 'Cancel',
      submit: 'Submit',
      inspect: 'Inspect',
      back: 'Back',
      next: 'Next',
      filterAll: 'All',
      online: 'Online',
      offline: 'Offline',
      active: 'Active',
      scheduled: 'Scheduled',
      completed: 'Completed',
      operational: 'Operational',
      verified: 'Verified',
      allDistricts: 'All Districts',
      stateCommand: 'State Command',
    },
    header: {
      title: 'State Operational Command Center',
      subGov: 'Directorate General of Information & Public Relations (DGIPR) • Government of Maharashtra',
      tagline: 'Statewide Information Operations & Crisis Command',
      telemetry: 'Live Telemetry:',
      refresh: 'Refresh',
      roleAdmin: 'State DG Observer',
      roleCollector: 'District Collector',
      roleDio: 'DIO Desk',
      brand: 'Maha-Command',
      selectLanguage: 'Select Language',
      languageTitle: 'Interface Language',
      districtScopeTitle: 'District Scope',
      allDistricts: 'All Active Districts',
      activeDistricts: 'Active Districts',
      dutyClock: 'IST Duty Clock',
      notificationsTitle: 'Operational Notifications',
      profileTitle: 'Officer Profile',
      signOut: 'Sign Out',
    },
    sidebar: {
      title: 'State Portals (11)',
      commandTelemetryGroup: 'Command & Telemetry',
      districtGovernanceGroup: 'District Governance',
      intelligenceSystemGroup: 'Media & Public Intelligence',
      systemAdminGroup: 'System & Administration',
      dashboard: 'Dashboard',
      commandCenter: 'Command Centre',
      systemMonitoring: 'System Monitoring',
      telemetryAudit: 'Telemetry Operations',
      rawIngestion: 'Raw Ingestion',
      pipelineFlow: 'Pipeline & Ops Flow',
      districts: 'Districts',
      pressReleases: 'Press Releases',
      media: 'Media Monitoring',
      activities: 'Field Activities',
      crisis: 'Crisis Response',
      reports: 'Reports & Analytics',
      notifications: 'Notifications',
      profile: 'Officer Profile',
      login: 'Logins (State/DM)',
      collapse: 'Collapse Sidebar',
      signOut: 'Sign Out',
    },
    toolbar: {
      title: 'State Operations Overview',
      subtitle: 'Real-time governance telemetry across the reporting districts of Maharashtra',
      allMaha: 'All Maharashtra',
      allDistricts: 'All Districts',
      puneDiv: 'Pune Division',
      konkanDiv: 'Konkan Division',
      nagpurDiv: 'Nagpur Division',
      nashikDiv: 'Nashik Division',
      aurangabadDiv: 'Chhatrapati Sambhajinagar Division',
      amravatiDiv: 'Amravati Division',
      last7d: 'Last 7 Days',
      last30d: 'Last 30 Days',
      last90d: 'Last 90 Days',
      syncedBadge: 'NIC/DGIPR Feed Synced',
      divisionalClearance: 'Divisional Clearance',
      statewideClearance: 'Statewide Clearance',
      districtClearance: 'District Clearance',
      exportBtn: 'Export Dataset',
    },
    zone1: {
      zoneLabel: 'Zone 1',
      sectionTitle: 'Key Performance Indicators',
      totalReleases: 'Total Releases',
      avgTAT: 'Avg. TAT',
      sentimentIndex: 'Sentiment Index',
      misinformation: 'Misinformation Tickets',
      releasesTarget: 'Target 1,500 (83%)',
      tatTarget: 'Target ≤ 60 min (Met)',
      sentimentTarget: 'Target ≥ 70% (Met)',
      misinfoTarget: 'Target ≤ 15 (Met)',
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
      yourDistrict: 'Your District',
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
      sentimentSub: 'Composite tone index across Print OCR, Broadcast TV, Social Listening & User Comments',
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
      wireSuffix: 'Wire Feed',
      autoStreamOn: 'Auto Stream: ON',
      autoStreamOff: 'Auto Stream: OFF',
    },
    zone5: {
      zoneLabel: 'Zone 5',
      title: 'Emergency Alert & Crisis Monitor',
      subtitle: 'Warning cards with live countdown timers for pending rumors',
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
      socialSub: 'Split streams for Twitter/X vs. Multi-Platform Channels',
      socialStreamX: 'Twitter / X Stream',
      socialStreamMulti: 'Multi-Platform Stream',
      gisTitle: 'Maharashtra GIS Map',
      gisSub: 'Interactive map with real-time hover states for all 36 District Information Offices',
      liveTitle: 'Live Event Streaming',
      liveSub: 'Unified live feed tracking CM events across broadcast channels',
      liveOnAirBadge: 'ON AIR BROADCAST',
    },
    districts: {
      title: '36 Districts Administration & Performance Matrix',
      subtitle: 'Statewide CPI Evaluation, Division Hubs & Real-time Operational SLAs',
      evaluationBadge: 'Statewide Composite Index',
    },
    commandCenter: {
      deckTitle: 'DGIPR State Operational Command Deck',
      deckSub: 'Executive PR, Media Intelligence, District Information Officer (DIO) Dispatch & Crisis Deck',
      activeDistrictsPill: '36 Districts Active',
      liveOperationsPill: 'Live Operations',
      systemHealthBtn: 'System Telemetry & Health →',
      gisMeshPill: 'GIS Mesh: Synced',
      tabTelemetry: 'Telemetry Operations',
      tabRawIngestion: 'Raw Ingestion',
      tabPipeline: 'Pipeline & Ops Flow',
      subTelemetry: '7 In-Page Modules · Telemetry, Filter, Pipeline, Monitor, DB, Logs, Audit',
      subRawIngestion: 'Sources • Pipeline Status • Failure Retries • Ingestion Logs',
      subPipeline: '6 Horizontal Sections · Detailed Animated Pipeline · Telemetry, DB, Logs',
    },
    systemMonitoring: {
      title: 'DGIPR System & Infrastructure Monitoring',
      subtitle: 'NIC State Data Centre (SDC) Telemetry, Ingestion Pipelines & Cryptographic Audit Enclave',
      sdcBadge: 'NIC State Data Centre (SDC)',
      cmdDeckLink: 'Operational Command Deck →',
      tabTelemetryAudit: 'Telemetry Operations & Audit',
      tabRawIngestion: 'Raw Ingestion',
      tabPipelineFlow: 'Pipeline & Ops Flow',
      subTelemetryAudit: '7 Modules · Telemetry, Filter, Pipeline, Monitor, DB, Logs, Audit & JSON Inspector',
      subRawIngestion: 'Sources • Pipeline Status • Failure Retries • Ingestion Logs',
      subPipelineFlow: '6 Horizontal Stages • Animated Data Flow • Timescale & Audit',
    },
    activities: {
      title: 'Government Activities & Press Coverage Itinerary',
      subtitle: 'Daily Ministerial Tours, Cabinet Briefings & Field Press Coverage',
      cycleBadge: '6h Status Cycle',
      autoRefresh: 'Auto-Refresh: Every 6 Hours • Cycle Active',
      midpointTrigger: 'Auto-Trigger: @ 50% Timeline (3h Midpoint)',
      itineraryTitle: "Today's High-Level Public Schedules & VIP Itinerary",
      itinerarySub: 'Daily Ministerial Tours and State Public Appearances',
      trackedEvents: 'Events Tracked',
      nextSequence: 'Next Sequence',
      prevSequence: 'Previous Sequence',
    },
    crisis: {
      title: 'Crisis Escalation & Misinformation Rapid Response Desk',
      subtitle: 'Mandatory 90-Minute SLA Rumor Refutation, Collector Verification & Social Alert Countermeasures',
      slaMetricTitle: '90-Minute Crisis SLA',
      slaTargetMet: 'Within Target',
      activeIncidentsTitle: 'Active Incidents',
      inTriage: 'In Triage',
      authorizedRebuttalsTitle: 'Authorized Rebuttals',
      dispatchedToMedia: 'Dispatched to Media',
      collectorClearancePrefix: 'Officer Clearance: District Magistrate & Collector',
      operatorClearancePrefix: 'Officer Clearance: DIO Desk Operator',
      adminClearancePrefix: 'Officer Clearance: State DG Admin (Statewide Clearance)',
    },
    pressReleases: {
      title: 'State Press Release Distribution Pipeline',
      subtitle: 'Departmental Policy Decisions, Ministerial Dispatches & Accredited Media Feeds',
      createDraftBtn: '+ New Press Release',
      filterAll: 'All Releases',
      filterPublished: 'Published',
      filterUnderReview: 'Under Review',
      filterDraft: 'Drafts',
      colId: 'Release ID',
      colTitle: 'Headline & Department',
      colDept: 'Department',
      colDate: 'Dispatch Timestamp',
      colStatus: 'Status',
      colDownloads: 'Downloads',
      colAction: 'Actions',
    },
    media: {
      title: 'Unified State Media Archive & Real-Time Monitoring',
      subtitle: 'Print Newspapers, TV Channels, OCR Feed, and Digital Social Listening Vault',
      newspapersTitle: 'Newspaper Data & Print Clippings',
      newspapersSub: 'Regional & Statewide Dailies',
      trackedNewspapers: '18 Dailies Tracked',
      tvTitle: 'TV Broadcast Monitoring',
      tvSub: 'Regional Electronic Media Surveillance',
      trackedChannels: '4 State Channels',
    },
    reports: {
      title: 'Intelligence Reports & Executive Dossiers',
      subtitle: 'Statewide Media Analytics, CPI Dossiers & Departmental Intelligence Syntheses',
      generateBtn: '+ Generate Custom Dossier',
      tabLineDepts: '21 Line Departments PR',
      tabVip: 'VIP Press Coverage',
      tabSocial: 'Social Sentiment Audits',
    },
    notifications: {
      title: 'Operational Notification & Alert Center',
      subtitle: 'Real-time Executive Bulletins, Urgent SLA Alerts & Regional DIO Communications',
      markAllRead: 'Mark All Read',
      tabAll: 'All Notifications',
      tabSla: 'SLA Warnings',
      tabDio: 'DIO Dispatches',
      tabDirectives: 'Directives',
    },
    profile: {
      title: 'State Information Officer Profile',
      subtitle: 'Administrative Role, Security Clearance, CADRE Profile & System Permissions',
      postingStation: 'Posting Station',
      cadre: 'Official Cadre',
      clearanceTier: 'Clearance Tier',
      saveBtn: 'Save Profile Changes',
    },
    login: {
      stateIdentity: 'Government of Maharashtra',
      deptIdentity: 'DGIPR Unified Command Gateway',
      portalTitle: 'Maha-Command Center',
      portalDescription: 'Unified state operations gateway for real-time crisis monitoring, inter-district coordination, and official communications.',
      officerIdLabel: 'OFFICER ID OR OFFICIAL GOV EMAIL',
      pinLabel: 'SECURITY PIN OR PASSWORD',
      captchaLabel: 'SECURITY VERIFICATION (CAPTCHA)',
      submitBtn: 'Authenticate and continue',
      tabCredentials: 'Officer ID / PIN',
      tabSso: 'JanParichay SSO',
    },
  },

  mr: {
    common: {
      searchPlaceholder: 'जिल्हा शोधा...',
      exportReport: 'अहवाल निर्यात करा',
      exportDataset: 'डेटा संच निर्यात करा',
      refresh: 'रिफ्रेश करा',
      close: 'बंद करा',
      save: 'बदल जतन करा',
      cancel: 'रद्द करा',
      submit: 'सादर करा',
      inspect: 'तपासा',
      back: 'मागे',
      next: 'पुढे',
      filterAll: 'सर्व',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      active: 'सक्रिय',
      scheduled: 'नियोजित',
      completed: 'पूर्ण',
      operational: 'कार्यरत',
      verified: 'प्रमाणित',
      allDistricts: 'सर्व जिल्हे',
      stateCommand: 'राज्य कमांड',
    },
    header: {
      title: 'राज्य माहिती व जनसंपर्क कक्ष',
      subGov: 'माहिती व जनसंपर्क महासंचालनालय • महाराष्ट्र शासन',
      tagline: 'राज्यस्तरीय माहिती संचालन व संकट निवारण कक्ष',
      telemetry: 'थेट माहिती प्रवाह:',
      refresh: 'रिफ्रेश करा',
      roleAdmin: 'राज्य निरीक्षक (महासंचालक)',
      roleCollector: 'जिल्हाधिकारी',
      roleDio: 'जिल्हा माहिती अधिकारी कक्ष',
      brand: 'महा-कमांड',
      selectLanguage: 'भाषा निवडा',
      languageTitle: 'प्रणाली भाषा',
      districtScopeTitle: 'जिल्हा व्याप्ती',
      allDistricts: 'सर्व सक्रिय जिल्हे',
      activeDistricts: 'सक्रिय जिल्हे',
      dutyClock: 'भारतीय प्रमाणवेळ घड्याळ',
      notificationsTitle: 'शासकीय सूचना',
      profileTitle: 'अधिकारी माहिती',
      signOut: 'बाहेर पडा',
    },
    sidebar: {
      title: 'शासकीय दालने (११)',
      commandTelemetryGroup: 'कमांड व दूरमिती',
      districtGovernanceGroup: 'जिल्हा प्रशासन व कामगिरी',
      intelligenceSystemGroup: 'माध्यम व लोकभावना विश्लेषण',
      systemAdminGroup: 'प्रणाली व प्रशासन',
      dashboard: 'मुख्य डॅशबोर्ड',
      commandCenter: 'कमांड सेंटर',
      systemMonitoring: 'प्रणाली निरीक्षण',
      telemetryAudit: 'दूरमिती ऑपरेशन्स',
      rawIngestion: 'कच्चा डेटा अंतर्ग्रहण',
      pipelineFlow: 'पाइपलाइन व डेटा प्रवाह',
      districts: 'जिल्हे व कार्यालये',
      pressReleases: 'प्रसिद्धीपत्रके',
      media: 'माध्यम निरीक्षण',
      activities: 'क्षेत्रीय उपक्रम',
      crisis: 'आपत्कालीन प्रतिसाद',
      reports: 'सांख्यिकी अहवाल',
      notifications: 'शासकीय सूचना',
      profile: 'अधिकारी प्रोफाइल',
      login: 'प्रवेशद्वार',
      collapse: 'पट्टी संकुचित करा',
      signOut: 'बाहेर पडा',
    },
    toolbar: {
      title: 'राज्य संनियंत्रण दृश्यावलोकन',
      subtitle: 'महाराष्ट्रातील संनियंत्रण जिल्ह्यांमधील थेट शासन संनियंत्रण',
      allMaha: 'सर्व महाराष्ट्र',
      allDistricts: 'सर्व जिल्हे',
      puneDiv: 'पुणे विभाग',
      konkanDiv: 'कोकण विभाग',
      nagpurDiv: 'नागपूर विभाग',
      nashikDiv: 'नाशिक विभाग',
      aurangabadDiv: 'छत्रपती संभाजीनगर विभाग',
      amravatiDiv: 'अमरावती विभाग',
      last7d: 'मागील ७ दिवस',
      last30d: 'मागील ३० दिवस',
      last90d: 'मागील ९० दिवस',
      syncedBadge: 'थेट जोडणी समक्रमित',
      divisionalClearance: 'विभागीय मंजुरी',
      statewideClearance: 'राज्यव्यापी थेट मंजुरी',
      districtClearance: 'जिल्हा मंजुरी',
      exportBtn: 'डेटा संच निर्यात करा',
    },
    zone1: {
      zoneLabel: 'विभाग १',
      sectionTitle: 'मुख्य कार्यक्षमता निर्देशांक',
      totalReleases: 'एकूण प्रसिद्धीपत्रके',
      avgTAT: 'सरासरी प्रतिसाद वेळ',
      sentimentIndex: 'सकारात्मक भावना टक्केवारी',
      misinformation: 'अफवा व तक्रारी',
      releasesTarget: 'उद्दिष्ट १,५०० (८३%)',
      tatTarget: 'उद्दिष्ट ≤ ६० मिनिटे (साध्य)',
      sentimentTarget: 'उद्दिष्ट ≥ ७०% (साध्य)',
      misinfoTarget: 'उद्दिष्ट ≤ १५ (साध्य)',
    },
    zone2: {
      zoneLabel: 'विभाग २',
      title: 'जिल्ह्यांची कामगिरी व क्रमवारी',
      subtitle: 'तौलनिक आलेख व क्रमवारी तक्ता',
      cpiTab: 'कामगिरी निर्देशांक क्रमवारी',
      eventTab: 'कार्यक्रम कव्हरेज (शीर्ष/तळ ५)',
      newsTab: 'विशेष बातमी कव्हरेज (शीर्ष/तळ ५)',
      chartTitle: 'कामगिरी निर्देशांकानुसार शीर्ष ५ जिल्हे',
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
      crisisCol: 'आपत्ती विहित वेळ',
      cpiCol: 'गुण',
      actionCol: 'कृती',
      viewBtn: 'तपासा',
      selectedBtn: 'निवडले',
      yourDistrict: 'तुमचा जिल्हा',
    },
    zone3: {
      zoneLabel: 'विभाग ३',
      title: 'कामगिरी निर्देशांक गुण विभागणी व विश्लेषण',
      subtitle: 'गुण कुठे कमी झाले याचे सविस्तर विश्लेषण',
      rankPrefix: 'क्रमांक',
      cpiPrefix: 'गुण',
      volumeTitle: 'प्रसिद्धीपत्रक प्रमाण',
      volumeSub: '३०० उद्दिष्टाच्या तुलनेत प्रसिद्धी',
      tatTitle: 'वितरण गती व कार्यक्षमता',
      tatSub: '६० मिनिटांपेक्षा कमी सरासरी वेळ',
      sentimentTitle: 'माध्यम लोकभावना',
      sentimentSub: 'प्रिंट ओसीआर, टीव्ही प्रसारण, सोशल ऐकणे व नागरिक टिप्पण्यांचा संमिश्र निर्देशांक',
      crisisTitle: 'आपत्कालीन विहित वेळ अनुपालन',
      crisisSub: '९० मिनिटांच्या आत अफवांचे खंडन',
      gapSuffix: 'गुण घट',
      footerLeft: 'प्रत्येक घटक कमाल २५ गुणांचा',
      footerRight: 'एकूण कमाल गुण: १००',
    },
    zone4: {
      zoneLabel: 'विभाग ४',
      title: 'थेट वर्तमानपत्र स्कॅनिंग प्रवाह',
      subtitle: 'हिरव्या व लाल भावना टॅगसह वर्तमानपत्रांचा थेट स्वयं-स्क्रोलिंग प्रवाह',
      liveScanBadge: 'थेट स्कॅन',
      simulateBtn: 'नवीन स्कॅन जोडा',
      filterAll: 'सर्व',
      filterPositive: 'सकारात्मक',
      filterNegative: 'नकारात्मक',
      filterNeutral: 'तटस्थ',
      footerStatus: '१८ दैनिक वृत्तपत्रे सक्रिय स्कॅनिंग चालू',
      wireSuffix: 'थेट फीड',
      autoStreamOn: 'स्वयं प्रवाह: सुरू',
      autoStreamOff: 'स्वयं प्रवाह: बंद',
    },
    zone5: {
      zoneLabel: 'विभाग ५',
      title: 'आपत्कालीन सतर्कता व संकट निवारण कक्ष',
      subtitle: 'प्रलंबित अफवांसाठी थेट काउंटडाउन टाइमरसह तातडीच्या इशारे कार्ड्स',
      pendingCount: 'प्रलंबित',
      threatLabel: 'धोका',
      districtPrefix: 'जिल्हा:',
      slaRemainingLabel: '९० मिनिटे विहित वेळेतील उर्वरित वेळ',
      evidenceBtn: 'पुरावा',
      timelineBtn: 'घटनाक्रम',
      authorizeBtn: 'खंडन प्रसिद्धी अधिकृत करा',
      authorizedBtn: 'खंडन जारी झाले',
      activeQueue: 'सक्रिय प्रकरणांची यादी',
      viewAllBtn: 'सर्व आपत्कालीन नोंदी पहा',
    },
    leadership: {
      mainHeader: 'मुख्य पॅनेल: नेतृत्व दृश्यावलोकन',
      mainSub: 'राज्यस्तरीय माध्यम, जीआयएस व थेट प्रक्षेपण संनियंत्रण',
      cmoBadge: 'मंत्रालय मुख्यमंत्री सचिवालय कमांड',
      matrixTitle: 'शीर्ष व तळ पाच जिल्हे मॅट्रिक्स',
      matrixSub: 'जिल्हा क्रमवारी, कार्यक्रम कव्हरेज व विशेष बातमी टोकाची मूल्ये',
      matrixAllBtn: 'सर्व (१०)',
      matrixTopBtn: 'शीर्ष ५',
      matrixLowerBtn: 'तळ ५',
      socialTitle: 'सोशल मीडिया विश्लेषण',
      socialSub: 'एक्स प्रवाह व विविध समाजमाध्यम वाहिन्यांचे स्वतंत्र प्रवाह',
      socialStreamX: 'एक्स प्रवाह',
      socialStreamMulti: 'विविध समाजमाध्यम प्रवाह',
      gisTitle: 'महाराष्ट्र नकाशा व भू-माहिती',
      gisSub: 'सर्व ३६ जिल्हा माहिती कार्यालयांचे थेट रिअल-टाइम स्थिती नकाशा',
      liveTitle: 'थेट शासकीय इव्हेंट प्रक्षेपण',
      liveSub: 'विविध वाहिन्यांवरील मुख्यमंत्री व मंत्रिमंडळ थेट वार्तालाप',
      liveOnAirBadge: 'थेट प्रक्षेपण सुरू',
    },
    districts: {
      title: '३६ जिल्हे प्रशासन व कामगिरी मॅट्रिक्स',
      subtitle: 'राज्यस्तरीय कामगिरी निर्देशांक मूल्यमापन, विभागीय केंद्र व थेट ऑपरेशन्स विहित वेळ',
      evaluationBadge: 'राज्यस्तरीय संमिश्र निर्देशांक',
    },
    commandCenter: {
      deckTitle: 'माहिती व जनसंपर्क महासंचालनालय — राज्य नियंत्रण कक्ष',
      deckSub: 'माध्यम संनियंत्रण, जनमत कल, जिल्हा माहिती अधिकारी समन्वय व संकट व्यवस्थापन',
      activeDistrictsPill: '३६ जिल्हे थेट सक्रिय',
      liveOperationsPill: 'थेट ऑपरेशन्स',
      systemHealthBtn: 'सिस्टम दूरमिती व आरोग्य तपासणी →',
      gisMeshPill: 'जीआयएस मेश: समक्रमित',
      tabTelemetry: 'दूरमिती ऑपरेशन्स',
      tabRawIngestion: 'कच्चा डेटा अंतर्ग्रहण व्यवस्थापन',
      tabPipeline: 'पाइपलाइन व ऑपरेशन प्रवाह',
      subTelemetry: '७ अंतर्गत विभाग · दूरमिती, गाळणी, पाइपलाइन, मॉनिटरिंग, डेटाबेस, नोंदी, ऑडिट',
      subRawIngestion: 'स्त्रोत रचना • पाइपलाइन स्थिती • त्रुटी व पुनर्प्रयत्न • अंतर्ग्रहण नोंदी',
      subPipeline: '६ समांतर विभाग · सविस्तर ॲनिमेटेड पाइपलाइन प्रवाह · देखरेख, डेटाबेस व ऑडिट',
    },
    systemMonitoring: {
      title: 'माहिती व जनसंपर्क प्रणाली व पायाभूत सुविधा देखरेख',
      subtitle: 'एनआयसी राज्य डेटा केंद्र दूरमिती, अंतर्ग्रहण पाइपलाइन व सुरक्षा ऑडिट कक्ष',
      sdcBadge: 'एनआयसी राज्य डेटा केंद्र',
      cmdDeckLink: 'ऑपरेशनल कमांड डेक →',
      tabTelemetryAudit: 'दूरमिती ऑपरेशन्स व ऑडिट',
      tabRawIngestion: 'कच्चा डेटा अंतर्ग्रहण',
      tabPipelineFlow: 'पाइपलाइन व ऑपरेशन प्रवाह',
      subTelemetryAudit: '७ अंतर्गत विभाग · दूरमिती, गाळणी, पाइपलाइन, मॉनिटरिंग, डेटाबेस, नोंदी, ऑडिट व पेलोड',
      subRawIngestion: 'स्त्रोत रचना • पाइपलाइन स्थिती • त्रुटी व पुनर्प्रयत्न • अंतर्ग्रहण नोंदी',
      subPipelineFlow: '६ समांतर टप्पे • ॲनिमेटेड डेटा प्रवाह • डेटाबेस व ऑडिट',
    },
    activities: {
      title: 'शासकीय उपक्रम व माध्यम कव्हरेज वेळापत्रक',
      subtitle: 'दैनिक मंत्री दौरे, मंत्रिमंडळ पत्रकार परिषदा व क्षेत्रीय माध्यम कव्हरेज',
      cycleBadge: '६ तास स्थिती चक्र',
      autoRefresh: 'स्वयं-रिफ्रेश: दर ६ तासांनी • चक्र सक्रिय',
      midpointTrigger: 'स्वयं-ट्रिगर: ५०% वेळेत (३ तास मध्यान्ह)',
      itineraryTitle: 'आजचे उच्चस्तरीय सार्वजनिक कार्यक्रम व अतिमहत्त्वाचे व्यक्ती वेळापत्रक',
      itinerarySub: 'दैनिक मंत्री दौरे व शासकीय उपस्थिती कार्यक्रम',
      trackedEvents: 'नोंदवलेले कार्यक्रम',
      nextSequence: 'पुढील टप्पा',
      prevSequence: 'मागील टप्पा',
    },
    crisis: {
      title: 'आपत्कालीन प्रतिसाद व अफवा निवारण कक्ष',
      subtitle: 'अनिवार्य ९० मिनिटे विहित वेळ, जिल्हाधिकारी पडताळणी व अधिकृत खंडन प्रसिद्धी',
      slaMetricTitle: '९० मिनिटे विहित वेळ अनुपालन',
      slaTargetMet: 'उद्दिष्ट साध्य',
      activeIncidentsTitle: 'सक्रिय आपत्कालीन प्रकरणे',
      inTriage: 'पडताळणी चालू',
      authorizedRebuttalsTitle: 'अधिकृत खंडने जारी',
      dispatchedToMedia: 'माध्यमांकडे पाठवले',
      collectorClearancePrefix: 'अधिकारी मंजुरी: जिल्हाधिकारी व जिल्हा दंडाधिकारी',
      operatorClearancePrefix: 'अधिकारी मंजुरी: जिल्हा माहिती अधिकारी डेस्क',
      adminClearancePrefix: 'अधिकारी मंजुरी: राज्य महासंचालक प्रशासन (राज्यव्यापी मंजुरी)',
    },
    pressReleases: {
      title: 'राज्य प्रसिद्धीपत्रक वितरण पाइपलाइन',
      subtitle: 'विभागीय धोरणात्मक निर्णय, मंत्री विधाने व अधिकृत प्रसिद्धीपत्रके',
      createDraftBtn: '+ नवीन प्रसिद्धीपत्रक तयार करा',
      filterAll: 'सर्व पत्रके',
      filterPublished: 'प्रकाशित',
      filterUnderReview: 'पुनरावलोकन चालू',
      filterDraft: 'मसुदे',
      colId: 'पत्रक क्रमांक',
      colTitle: 'शीर्षक व विभाग',
      colDept: 'विभाग',
      colDate: 'वितरण दिनांक व वेळ',
      colStatus: 'स्थिती',
      colDownloads: 'डाऊनलोड्स',
      colAction: 'कृती',
    },
    media: {
      title: 'एकात्मिक राज्य माध्यम अभिलेखागार व थेट संनियंत्रण',
      subtitle: 'वृत्तपत्रे, टीव्ही वृत्त वाहिन्या, स्कॅनिंग फीड व डिजिटल समाजमाध्यम कक्ष',
      newspapersTitle: 'वृत्तपत्र कात्रणे व डेटा संनियंत्रण',
      newspapersSub: 'प्रादेशिक व राज्यस्तरीय दैनिके',
      trackedNewspapers: '१८ दैनिके निरीक्षण चालू',
      tvTitle: 'टीव्ही प्रक्षेपण संनियंत्रण',
      tvSub: 'प्रादेशिक इलेक्ट्रॉनिक माध्यम संनियंत्रण',
      trackedChannels: '४ वृत्त वाहिन्या',
    },
    reports: {
      title: 'माहिती व सांख्यिकी अहवाल आणि कार्यकारी डॉसियर्स',
      subtitle: 'राज्यस्तरीय माध्यम विश्लेषण, कामगिरी अहवाल व विभागीय माहिती निष्कर्ष',
      generateBtn: '+ नवीन सानुकूल डॉसियर तयार करा',
      tabLineDepts: '२१ प्रशासकीय विभाग जनसंपर्क',
      tabVip: 'अतिमहत्त्वाच्या व्यक्तींचे कव्हरेज',
      tabSocial: 'समाजमाध्यम लोकभावना ऑडिट',
    },
    notifications: {
      title: 'शासकीय सूचना व सतर्कता केंद्र',
      subtitle: 'थेट शासकीय बुलेटिन्स, तातडीचे विहित वेळ इशारे व विभागीय संवाद',
      markAllRead: 'सर्व वाचले म्हणून नोंदवा',
      tabAll: 'सर्व सूचना',
      tabSla: 'विहित वेळ इशारे',
      tabDio: 'जिल्हा माहिती कार्यालये पत्रके',
      tabDirectives: 'मार्गदर्शक सूचना',
    },
    profile: {
      title: 'राज्य माहिती अधिकारी प्रोफाइल',
      subtitle: 'प्रशासकीय पद, सुरक्षा मंजुरी, संवर्ग माहिती व प्रणाली अधिकार',
      postingStation: 'नियुक्ती स्थान',
      cadre: 'अधिकारी संवर्ग',
      clearanceTier: 'मंजुरी स्तर',
      saveBtn: 'प्रोफाइल बदल जतन करा',
    },
    login: {
      stateIdentity: 'महाराष्ट्र शासन',
      deptIdentity: 'माहिती व जनसंपर्क महासंचालनालय',
      portalTitle: 'महा-कमांड सेंटर',
      portalDescription: 'थेट संकट निवारण, आंतर-जिल्हा समन्वय व अधिकृत संवादासाठी एकात्मिक राज्य संचालन प्रवेशद्वार.',
      officerIdLabel: 'अधिकारी ओळख क्रमांक किंवा अधिकृत शासकीय ईमेल',
      pinLabel: 'सुरक्षा पिन किंवा पासवर्ड',
      captchaLabel: 'सुरक्षा पडताळणी कोड (कॅप्चा)',
      submitBtn: 'प्रमाणित करा व पुढे जा',
      tabCredentials: 'अधिकारी ओळख / पिन',
      tabSso: 'जनपरिचय एकरकमी प्रवेश',
    },
  },
};

export function useTranslation(language: Language): Translations {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}
