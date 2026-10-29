export interface SentimentChannelBreakdown {
  printOcr: number; // 0-100%
  broadcastTv: number; // 0-100%
  socialListening: number; // 0-100%
  userComments: number; // 0-100%
  composite: number; // 0-100%
}

export interface SentimentWeights {
  printOcr: number;
  broadcastTv: number;
  socialListening: number;
  userComments: number;
}

export const SENTIMENT_WEIGHTS: SentimentWeights = {
  printOcr: 0.35, // 35% Print Media OCR
  broadcastTv: 0.25, // 25% Broadcast TV Telemetry
  socialListening: 0.25, // 25% Social Listening Data
  userComments: 0.15, // 15% Public / Citizen Comments
};

export function computeCompositeSentiment(
  channels: Omit<SentimentChannelBreakdown, 'composite'>,
  weights: SentimentWeights = SENTIMENT_WEIGHTS
): number {
  const composite =
    channels.printOcr * weights.printOcr +
    channels.broadcastTv * weights.broadcastTv +
    channels.socialListening * weights.socialListening +
    channels.userComments * weights.userComments;
  return Number(composite.toFixed(1));
}

export const DISTRICT_SENTIMENT_DATA: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  thane: {
    printOcr: 85,
    broadcastTv: 82,
    socialListening: 81,
    userComments: 76,
  },
  raigad: {
    printOcr: 78,
    broadcastTv: 76,
    socialListening: 75,
    userComments: 73,
  },
  palghar: {
    printOcr: 74,
    broadcastTv: 71,
    socialListening: 70,
    userComments: 66,
  },
  ratnagiri: {
    printOcr: 70,
    broadcastTv: 69,
    socialListening: 67,
    userComments: 63,
  },
  sindhudurg: {
    printOcr: 76,
    broadcastTv: 74,
    socialListening: 74,
    userComments: 70,
  },
};

export const STATEWIDE_BASE_CHANNELS: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  'Last 7 days': {
    printOcr: 71.0,
    broadcastTv: 68.5,
    socialListening: 70.2,
    userComments: 64.8,
  },
  'Last 30 days': {
    printOcr: 74.2,
    broadcastTv: 71.0,
    socialListening: 72.8,
    userComments: 67.5,
  },
  'Last 90 days': {
    printOcr: 76.5,
    broadcastTv: 74.0,
    socialListening: 75.0,
    userComments: 70.2,
  },
};

export interface DynamicNewsItem {
  district?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Critical' | 'Alert' | string;
  source?: string;
  channelType?: string;
  headline?: string;
}

export interface DynamicSentimentResult extends SentimentChannelBreakdown {
  totalNewsItemsAnalyzed: number;
  positiveNewsCount: number;
  neutralNewsCount: number;
  negativeCriticalCount: number;
  newsPolarityShift: number; // Delta shift applied to historical baseline
  lastNewsAnalyzedTimestamp: string;
}

export function getDistrictSentiment(
  districtId?: string,
  timeRange: string = 'Last 7 days',
  dynamicNewsItems?: DynamicNewsItem[]
): DynamicSentimentResult {
  const normId = (districtId || '').toLowerCase();
  const rawChannels =
    DISTRICT_SENTIMENT_DATA[normId] ||
    STATEWIDE_BASE_CHANNELS[timeRange] ||
    STATEWIDE_BASE_CHANNELS['Last 7 days'];

  // Apply minor temporal scaling based on period if district specified
  let scale = 1.0;
  if (timeRange === 'Last 30 days') scale = 1.02;
  else if (timeRange === 'Last 90 days') scale = 1.04;

  let printOcr = Math.min(100, Number((rawChannels.printOcr * (districtId ? scale : 1)).toFixed(1)));
  let broadcastTv = Math.min(100, Number((rawChannels.broadcastTv * (districtId ? scale : 1)).toFixed(1)));
  let socialListening = Math.min(100, Number((rawChannels.socialListening * (districtId ? scale : 1)).toFixed(1)));
  let userComments = Math.min(100, Number((rawChannels.userComments * (districtId ? scale : 1)).toFixed(1)));

  // Calculate dynamic impact from currently ingested news & telemetry items
  let totalNewsItemsAnalyzed = 0;
  let positiveNewsCount = 0;
  let neutralNewsCount = 0;
  let negativeCriticalCount = 0;
  let newsPolarityShift = 0;

  if (dynamicNewsItems && dynamicNewsItems.length > 0) {
    const relevantItems = dynamicNewsItems.filter((item) => {
      if (!districtId || districtId === 'all') return true;
      const itemDist = (item.district || '').toLowerCase().replace(/[-\s]+/g, '');
      const targetDist = normId.replace(/[-\s]+/g, '');
      return itemDist === targetDist || itemDist === 'statewide' || !item.district;
    });

    totalNewsItemsAnalyzed = relevantItems.length;

    relevantItems.forEach((item) => {
      const s = (item.sentiment || '').toLowerCase();
      if (s === 'positive') positiveNewsCount++;
      else if (s === 'neutral') neutralNewsCount++;
      else if (s === 'negative' || s === 'critical' || s === 'alert') negativeCriticalCount++;
      else neutralNewsCount++;
    });

    if (totalNewsItemsAnalyzed > 0) {
      // Net news sentiment score: (Positive*100 + Neutral*60 + Negative*10) / total
      const rawNewsScore =
        (positiveNewsCount * 100 + neutralNewsCount * 60 + negativeCriticalCount * 10) /
        totalNewsItemsAnalyzed;

      // Dynamic shift relative to base composite (75% default anchor)
      newsPolarityShift = Number(((rawNewsScore - 75) * 0.25).toFixed(1));

      // Dynamically adjust individual channels according to live telemetry
      printOcr = Math.max(30, Math.min(99, Number((printOcr + newsPolarityShift * 0.9).toFixed(1))));
      broadcastTv = Math.max(30, Math.min(99, Number((broadcastTv + newsPolarityShift * 0.85).toFixed(1))));
      socialListening = Math.max(30, Math.min(99, Number((socialListening + newsPolarityShift * 1.3).toFixed(1))));
      userComments = Math.max(30, Math.min(99, Number((userComments + newsPolarityShift * 1.1).toFixed(1))));
    }
  }

  const scaled = {
    printOcr,
    broadcastTv,
    socialListening,
    userComments,
  };

  const composite = computeCompositeSentiment(scaled);

  return {
    ...scaled,
    composite,
    totalNewsItemsAnalyzed,
    positiveNewsCount,
    neutralNewsCount,
    negativeCriticalCount,
    newsPolarityShift,
    lastNewsAnalyzedTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Transparent calculation logic and definition for all figures displayed across the dashboard
 */
export interface MetricMethodology {
  id: string;
  title: string;
  titleMr: string;
  termDefinition: string;
  termDefinitionMr: string;
  formula: string;
  weights?: string;
  calculationExplanation: string;
  calculationExplanationMr: string;
  targetBenchmark: string;
  dataSources: string[];
}

export const DASHBOARD_METRIC_METHODOLOGIES: Record<string, MetricMethodology> = {
  sentimentIndex: {
    id: 'sentimentIndex',
    title: 'Multi-Channel Sentiment Index',
    titleMr: 'बहु-माध्यम लोकभावना निर्देशांक',
    termDefinition:
      'A continuous 0-100% natural language processing (NLP) metric that aggregates public sentiment regarding government policies, governance decisions, and emergency management across Maharashtra.',
    termDefinitionMr:
      'शासकीय धोरणे, कल्याणकारी योजना आणि आणीबाणी व्यवस्थापनाबाबत नागरिकांच्या प्रतिक्रियेचे ० ते १००% मधील नैसर्गिक भाषा प्रक्रिया (NLP) आधारित एकत्रित मूल्यमापन.',
    formula: 'Composite Sentiment = (Print OCR × 35%) + (Broadcast TV × 25%) + (Social Listening × 25%) + (Citizen Comments × 15%) + Dynamic News Polarity Shift',
    weights: 'Print Media OCR: 35% | TV Broadcast Telemetry: 25% | Social Media Listening: 25% | Aaple Sarkar Public Comments: 15%',
    calculationExplanation:
      'Calculated in real time by scanning accredited Marathi, Hindi & English daily newspapers via OCR, monitoring 5 regional TV broadcast telemetry channels, streaming sentiment from verified social platforms (X, Facebook, WhatsApp Public Channels), and analyzing Aaple Sarkar citizen remarks. When breaking news is ingested, an NLP polarity weighting shift is immediately applied to all 4 channels.',
    calculationExplanationMr:
      'वर्तमानपत्रांमधील बातम्यांचे OCR स्कॅनिंग (३५%), ५ प्रादेशिक वृत्तवाहिन्यांचे थेट विश्लेषण (२५%), सोशल मीडिया प्रतिक्रिया (२५%) व आपले सरकार पोर्टलवरील शेरे (१५%) यांचे एकत्रित गुणोत्तर. नवीन बातमी आल्यास त्वरित पुनर्गणना होते.',
    targetBenchmark: 'Statutory Target: ≥ 70% Positive Public Sentiment (Green Threshold)',
    dataSources: [
      'Central Directorate of Information & Public Relations (DGIPR)',
      '64 Accredited Print Dailies (Loksatta, Sakal, Lokmat, Saamana, Pudhari, etc.)',
      'Regional Broadcast Monitoring Bureau (Doordarshan Sahyadri, ABP Majha, News18 Lokmat, TV9)',
      'Maharashtra Cyber Intelligence Wing Social Feed',
      'Aaple Sarkar Citizen Portal & 104/1077 Toll-Free Helpline Feed',
    ],
  },

  crisisSlaResolutionRate: {
    id: 'crisisSlaResolutionRate',
    title: 'Crisis SLA Resolution Rate',
    titleMr: 'आपत्कालीन SLA निवारण दर',
    termDefinition:
      'The percentage of high-severity emergency alerts, highway accidents, and viral misinformation incidents resolved with official action or rebuttal within the mandatory 4-hour statutory Crisis SLA window.',
    termDefinitionMr:
      'उच्च तीव्रतेच्या आणीबाणीच्या घटना, महामार्ग अपघात व व्हायरल खोट्या अफवांवर विहित ४ तासांच्या आत अधिकृत कारवाई किंवा खंडन प्रसिद्ध करण्याचा दर.',
    formula: 'Crisis SLA Resolution Rate = (Crisis Incidents Successfully Resolved within SLA / Total Incidents Logged) × 100%',
    calculationExplanation:
      'Every crisis alert triggers an automatic 4-hour countdown timer. Incidents are classified into accidents, natural hazards, or misinformation tickets. When District Collectors or DGIPR authorize official press releases, emergency aid dispatches, or fact-check rebuttals before timer expiry, the resolution is marked compliant. Historical resolution rate over rolling 7 days is 98.4%.',
    calculationExplanationMr:
      'प्रत्येक आणीबाणी घटनेनंतर ४ तासांचा टाइमर सुरू होतो. विहित मुदतीत जिल्हाधिकारी किंवा महासंचालकांनी अधिकृत प्रसिद्धीपत्रक किंवा मदत पाठविल्यास ते साध्य मानले जाते.',
    targetBenchmark: 'Mandated Crisis Standard: ≥ 95% Resolved in < 4 Hours (Zero Lapsed Incidents)',
    dataSources: [
      'Maharashtra State Disaster Management Authority (SDMA Control Desk)',
      'Highway Safety Patrol (HSP) & 108 Emergency Medical Services Log',
      'DGIPR Fact-Check & Verification Desk',
      'All 36 District Information Offices (DIO) Rapid Response Stream',
    ],
  },

  totalReleases: {
    id: 'totalReleases',
    title: 'Official Directorate Releases',
    titleMr: 'अधिकृत प्रसिद्धीपत्रके (DGIPR)',
    termDefinition:
      'The verifiable count of official government press communiqués, cabinet decisions, gazette notifications, and scheme updates drafted, verified by Information Officers, and distributed to media houses.',
    termDefinitionMr:
      'माहिती व जनसंपर्क महासंचालनालय व ३६ जिल्हा माहिती कार्यालयांकडून पडताळणी करून वृत्तमाध्यमांना प्रसारित केलेल्या अधिकृत प्रसिद्धीपत्रकांची संख्या.',
    formula: 'Total Releases = Sum(District Releases across reporting districts) × Period Time Multiplier',
    calculationExplanation:
      'Directly pulled from the DGIPR Central Dispatch Ledger. Each dispatch contains verified publication timestamps, ministerial authorization codes, and multi-lingual copies (Marathi primary, English & Hindi regional). Statewide monthly target is 1,500 releases.',
    calculationExplanationMr:
      'डीआयपीआर डिस्पॅच नोंदवहीतून थेट संकलित. प्रत्येक पत्रकास अधिकृत क्रमांक व वेळ असते. दरमहा १५०० प्रसिद्धीपत्रकांचे उद्दिष्ट.',
    targetBenchmark: 'Statewide Benchmark: 1,500 Dispatches / month (100% Attainment)',
    dataSources: [
      'DGIPR Central News Desk (Mantralaya, Mumbai)',
      '36 District Information Offices (DIO Regional Desks)',
      'Official Maharashtra Government Gazette (Rajpatra)',
    ],
  },

  misinformationTickets: {
    id: 'misinformationTickets',
    title: 'Misinformation & Fake News Tickets',
    titleMr: 'खोट्या बातम्या व अफवा निवारण कक्ष',
    termDefinition:
      'Real-time intelligence tickets created for false claims, doctored media, fraudulent recruitment circulars, or fabricated government orders circulating on digital platforms requiring swift fact-checking and formal debunking.',
    termDefinitionMr:
      'सोशल मीडिया व व्हॉट्सॲपवर व्हायरल होणाऱ्या खोट्या अफवा, बनावट शासन निर्णय व दिशाभूल करणाऱ्या माहितीवर सुरू करण्यात आलेले निवारण तिकीट.',
    formula: 'Open Misinformation Tickets = Total Logged False Claims - (Authorized Rebuttals + Issued Clarifications)',
    calculationExplanation:
      'Monitored 24×7 by Maharashtra Cyber and DIO intelligence desks. Once flagged with a credibility score below 40%, a ticket is opened with evidence logs. The ticket closes only after a signed rebuttal from the District Collector or Director General is issued to media and social networks.',
    calculationExplanationMr:
      'महाराष्ट्र सायबर सेल व जिल्हा माहिती अधिकारी यांच्यामार्फत २४x७ संनियंत्रण. खंडन प्रसिद्ध झाल्यानंतरच तिकीट पूर्ण मानले जाते.',
    targetBenchmark: 'Target: 0 Open Tickets over 4 hours | 100% Rebuttal within SLA',
    dataSources: [
      'Maharashtra Cyber Police Headquarters',
      'MahaFactCheck Official Gov Broadcast Wing',
      'District Collectorate Disaster Cells',
      'FactCheck India & PIB Fact Check Network',
    ],
  },

  cpiIndex: {
    id: 'cpiIndex',
    title: 'Composite Performance Index (CPI)',
    titleMr: 'एकत्रित कामगिरी निर्देशांक (CPI)',
    termDefinition:
      'A holistic 0-100 benchmark score measuring each district’s overall administrative responsiveness, communication cadence, citizen service speed, public sentiment, and crisis readiness.',
    termDefinitionMr:
      'प्रत्येक जिल्ह्याच्या प्रशासकीय कार्यक्षमता, माहिती प्रसारण, नागरी तक्रार निवारण वेग व आणीबाणी सज्जतेचे ० ते १०० दरम्यानचे एकत्रित मोजमाप.',
    formula: 'CPI Score = (Volume Score × 25%) + (TAT Score × 25%) + (Sentiment Score × 25%) + (Crisis SLA Score × 25%)',
    calculationExplanation:
      'Four equally-weighted components (25 points each): 1. Output Volume (Releases & Coverage), 2. Turnaround Time (TAT) on citizen inquiries, 3. Multi-Channel Sentiment Index, 4. Crisis & Accident Resolution SLA compliance. Top 5 districts qualify for State Excellence recognition; low 5 receive dedicated departmental handholding.',
    calculationExplanationMr:
      'चार समान घटक (प्रत्येकी २५ गुण): १. माहिती प्रसारण प्रमाण, २. तक्रार निवारण वेग, ३. लोकभावना निर्देशांक, ४. आपत्कालीन SLA पूर्तता.',
    targetBenchmark: 'Excellence Threshold: CPI ≥ 90.00 (Rank 1 to 5) | Intervention Threshold: CPI < 75.00',
    dataSources: [
      'Chief Minister’s Office (CMO) Dashboard Telemetry',
      'Planning Department, Government of Maharashtra',
      'Public Grievance Portal (Aaple Sarkar)',
      'DGIPR Telemetric Audit Ledger',
    ],
  },
};

