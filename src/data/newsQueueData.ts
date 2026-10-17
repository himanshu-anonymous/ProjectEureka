import { NewsQueueItem } from '@/types/dashboard';

export interface NewsChannelSource {
  name: string;
  nameMr: string;
  short: string;
  shortMr: string;
  type: 'TV' | 'Print' | 'Digital' | 'Wire';
  credibility: number;
  tier: 'Tier-1 Accredited' | 'Verified Regional' | 'Digital Wire' | 'Pending Audit';
}

export const NEWS_CHANNELS: NewsChannelSource[] = [
  { name: 'ABP Majha', nameMr: 'एबीपी माझा', short: 'ABP Majha', shortMr: 'एबीपी', type: 'TV', credibility: 96, tier: 'Tier-1 Accredited' },
  { name: 'TV9 Marathi', nameMr: 'टीव्ही९ मराठी', short: 'TV9 Marathi', shortMr: 'टीव्ही९', type: 'TV', credibility: 94, tier: 'Tier-1 Accredited' },
  { name: 'Lokmat', nameMr: 'लोकमत', short: 'Lokmat', shortMr: 'लोकमत', type: 'Print', credibility: 95, tier: 'Tier-1 Accredited' },
  { name: 'Zee 24 Taas', nameMr: 'झी २४ तास', short: 'Zee 24 Taas', shortMr: 'झी २४', type: 'TV', credibility: 93, tier: 'Tier-1 Accredited' },
  { name: 'Saam TV', nameMr: 'साम टीव्ही', short: 'Saam TV', shortMr: 'साम', type: 'TV', credibility: 91, tier: 'Verified Regional' },
  { name: 'Maharashtra Times', nameMr: 'महाराष्ट्र टाइम्स', short: 'Maha Times', shortMr: 'मटा', type: 'Print', credibility: 97, tier: 'Tier-1 Accredited' },
  { name: 'Pudhari', nameMr: 'पुढारी', short: 'Pudhari', shortMr: 'पुढारी', type: 'Print', credibility: 92, tier: 'Verified Regional' },
  { name: 'News18 Lokmat', nameMr: 'न्यूज१८ लोकमत', short: 'News18', shortMr: 'न्यूज१८', type: 'TV', credibility: 94, tier: 'Tier-1 Accredited' },
  { name: 'Sakal', nameMr: 'सकाळ', short: 'Sakal', shortMr: 'सकाळ', type: 'Print', credibility: 95, tier: 'Tier-1 Accredited' },
  { name: 'PTI Bhasha', nameMr: 'पीटीआय भाषा', short: 'PTI Bhasha', shortMr: 'पीटीआय', type: 'Wire', credibility: 98, tier: 'Tier-1 Accredited' },
  { name: 'Regional Digital Wire', nameMr: 'प्रादेशिक डिजिटल वृत्त', short: 'Digital Wire', shortMr: 'डिजिटल वृत्त', type: 'Digital', credibility: 88, tier: 'Digital Wire' },
  { name: 'Navakal', nameMr: 'नवाकाळ', short: 'Navakal', shortMr: 'नवाकाळ', type: 'Print', credibility: 89, tier: 'Verified Regional' },
];

export interface HeadlineTemplate {
  district: string;
  newsMr: string;
  newsEn: string;
  baseScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Critical';
  verification: 'Verified' | 'Fact-Check Passed' | 'Under Review' | 'Flagged Misinfo';
  baseReach: number;
}

export const HEADLINE_TEMPLATES: HeadlineTemplate[] = [
  {
    district: 'Thane',
    newsMr: 'ठाणे खाडी किनारा महामार्ग कामाचा वेग वाढला; सार्वजनिक बांधकाम विभागाचा पाहणी दौरा',
    newsEn: 'Thane Coastal Ring Road accelerated; PWD Minister undertakes on-ground milestone inspection',
    baseScore: 88,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 142000,
  },
  {
    district: 'Thane',
    newsMr: 'कल्याण-डोंबिवली पालिकेकडून २ हजार मालमत्तांना पाणी गळती तातडीने दुरुस्ती नोटीस',
    newsEn: 'KDMC issues notices for water leakage rectification across 2,000 residential complexes',
    baseScore: 66,
    sentiment: 'Neutral',
    verification: 'Fact-Check Passed',
    baseReach: 58000,
  },
  {
    district: 'Thane',
    newsMr: 'घोडबंदर रोडवर अवजड वाहतूक २४ तास बंदीची अफवा; ठाणे वाहतूक पोलिसांकडून अधिकृत खंडन',
    newsEn: 'Rumor of round-the-clock heavy vehicle ban on Ghodbunder Road refuted by Traffic Police',
    baseScore: 94,
    sentiment: 'Critical',
    verification: 'Flagged Misinfo',
    baseReach: 310000,
  },
  {
    district: 'Raigad',
    newsMr: 'अलिबाग-वडखळ राष्ट्रीय महामार्गाचे रुंदीकरण अंतिम टप्प्यात; रायगड जिल्हाधिकाऱ्यांकडून आढावा',
    newsEn: 'Alibag-Wadkhal National Highway widening enters final stretch; Raigad Collector reviews progress',
    baseScore: 84,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 95000,
  },
  {
    district: 'Raigad',
    newsMr: 'रोहा औद्योगिक वसाहतीतील वायू गळती नियंत्रण कक्ष सतर्क; पर्यावरण नियमांचे तातडीने ऑडिट',
    newsEn: 'Gas emission in Roha MIDC swiftly neutralised; Pollution Board initiates environmental audit',
    baseScore: 91,
    sentiment: 'Negative',
    verification: 'Under Review',
    baseReach: 178000,
  },
  {
    district: 'Raigad',
    newsMr: 'रायगड किल्ल्यावरील रोपवे सुरक्षेसाठी नियमित तपासणी पूर्ण; पर्यटकांचा ओघ सुरळीत',
    newsEn: 'Raigad Fort ropeway cleared following routine mechanical inspection; tourist flow normal',
    baseScore: 74,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 68000,
  },
  {
    district: 'Palghar',
    newsMr: 'पालघर जिल्ह्यातील दुर्गम पाड्यांमध्ये जलजीवन मिशन अंतर्गत ९५% घरांमध्ये नळजोडणी पूर्ण',
    newsEn: 'Jal Jeevan Mission achieves 95% tap connectivity coverage across remote Palghar tribal hamlets',
    baseScore: 92,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 125000,
  },
  {
    district: 'Palghar',
    newsMr: 'डहाणू-तलासरी किनारपट्टी भागात भूकंपाच्या खोट्या अफवांवर विश्वास न ठेवण्याचे जिल्हा प्रशासनाचे आवाहन',
    newsEn: 'District Administration urges citizens not to heed baseless coastal earthquake rumors in Dahanu',
    baseScore: 96,
    sentiment: 'Critical',
    verification: 'Flagged Misinfo',
    baseReach: 420000,
  },
  {
    district: 'Palghar',
    newsMr: 'मनोर-वाडा राज्य महामार्गावरील नवीन पुलाच्या बांधकामास मंजुरी; ६५ कोटींची प्रशासकीय मान्यता',
    newsEn: 'Administrative sanction of Rs 65 Cr granted for new bridge construction on Manor-Wada corridor',
    baseScore: 81,
    sentiment: 'Positive',
    verification: 'Fact-Check Passed',
    baseReach: 74000,
  },
  {
    district: 'Ratnagiri',
    newsMr: 'रत्नागिरी हापूस आंबा थेट युरोप व आखाती देशात निर्यातीसाठी विशेष कृषी कार्गो कक्ष कार्यान्वित',
    newsEn: 'Dedicated agri-cargo facility operationalised for direct Ratnagiri Alphonso mango exports to Europe',
    baseScore: 95,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 285000,
  },
  {
    district: 'Ratnagiri',
    newsMr: 'चिपळूण पूर प्रतिबंधक संरक्षक भिंतीचे काम पूर्णत्वास; वशिष्ठी नदी पात्रातील गाळ काढणी वेगवान',
    newsEn: 'Chiplun flood protection embankment near completion; Vashishti River desiltation accelerates',
    baseScore: 87,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 154000,
  },
  {
    district: 'Ratnagiri',
    newsMr: 'गुहागर समुद्रकिनारी आंतरराष्ट्रीय दर्जाच्या पर्यावरणपूरक पर्यटन केंद्रासाठी निधी वितरित',
    newsEn: 'State Tourism disburses funds for eco-friendly coastal tourism amenities along Guhagar beach',
    baseScore: 78,
    sentiment: 'Neutral',
    verification: 'Under Review',
    baseReach: 62000,
  },
  {
    district: 'Sindhudurg',
    newsMr: 'चिपी आंतरराष्ट्रीय विमानतळावरून बंगळुरू व हैदराबाद थेट विमानसेवेची वारंवारता वाढवली',
    newsEn: 'Flight frequency expanded from Chipi Airport Sindhudurg to Bengaluru and Hyderabad IT hubs',
    baseScore: 93,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 210000,
  },
  {
    district: 'Sindhudurg',
    newsMr: 'वेंगुर्ला व कुडाळ येथील स्थानिक काजू प्रक्रिया क्लस्टर उद्योगांना ५० कोटींचे शासकीय अनुदान वितरित',
    newsEn: 'Government disburses Rs 50 Cr cluster subsidy to cashew processing micro-enterprises in Vengurla',
    baseScore: 89,
    sentiment: 'Positive',
    verification: 'Verified',
    baseReach: 115000,
  },
  {
    district: 'Sindhudurg',
    newsMr: 'मालवण समुद्रातील स्कुबा डायव्हिंग केंद्रांसाठी अत्याधुनिक जीपीएस सुरक्षा यंत्रणा बंधनकारक',
    newsEn: 'Mandatory GPS emergency telemetry standards issued for all Malvan coastal scuba operators',
    baseScore: 82,
    sentiment: 'Neutral',
    verification: 'Fact-Check Passed',
    baseReach: 88000,
  },
];

export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function formatVolume(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M Reach`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K Reach`;
  return `${num} Reach`;
}

export function generateRandomQueueItem(idCounter: number): NewsQueueItem {
  const channel = NEWS_CHANNELS[Math.floor(Math.random() * NEWS_CHANNELS.length)];
  const template = HEADLINE_TEMPLATES[Math.floor(Math.random() * HEADLINE_TEMPLATES.length)];

  const scoreJitter = Math.floor(Math.random() * 9) - 4; // -4 to +4
  const finalScore = Math.max(45, Math.min(99, template.baseScore + scoreJitter));

  let scoreLevel: 'Critical' | 'High' | 'Moderate' | 'Routine' = 'Moderate';
  if (finalScore >= 90) scoreLevel = 'Critical';
  else if (finalScore >= 75) scoreLevel = 'High';
  else if (finalScore >= 60) scoreLevel = 'Moderate';
  else scoreLevel = 'Routine';

  const reachJitter = Math.floor(Math.random() * 30000) - 15000;
  const finalReach = Math.max(12000, template.baseReach + reachJitter);
  const impressions = `${(finalReach * 2.8 / 1000).toFixed(1)}K views`;

  const now = new Date();

  const channelUrls: Record<string, string> = {
    'ABP Majha': 'https://marathi.abplive.com',
    'TV9 Marathi': 'https://www.tv9marathi.com',
    'Lokmat': 'https://www.lokmat.com',
    'Zee 24 Taas': 'https://zeenews.india.com/marathi',
    'Saam TV': 'https://www.saamtv.com',
    'Maharashtra Times': 'https://maharashtratimes.com',
    'Pudhari': 'https://pudhari.news',
    'News18 Lokmat': 'https://lokmat.news18.com',
    'Sakal': 'https://www.esakal.com',
    'PTI Bhasha': 'https://www.ptinews.com',
    'Regional Digital Wire': 'https://dgipr.maharashtra.gov.in',
    'Navakal': 'https://navakal.org',
  };

  const primaryUrl = channelUrls[channel.name] || 'https://dgipr.maharashtra.gov.in';

  return {
    id: `NQ-${8400 + idCounter}`,
    source: channel.name,
    sourceShort: channel.short,
    url: primaryUrl,
    sources: [
      { name: channel.name, nameMr: channel.nameMr, url: primaryUrl, type: channel.type },
      { name: 'DGIPR Wire', nameMr: 'माहिती कक्ष', url: 'https://dgipr.maharashtra.gov.in', type: 'Official' },
    ],
    channelType: channel.type,
    newsMr: template.newsMr,
    newsEn: template.newsEn,
    district: template.district,
    scoring: finalScore,
    scoreLevel,
    sentiment: template.sentiment,
    verification: template.verification,
    credibilityScore: channel.credibility,
    credibilityTier: channel.tier,
    volumes: formatVolume(finalReach),
    impressions,
    timestamp: formatTime(now),
  };
}

export const INITIAL_QUEUE_ITEMS: NewsQueueItem[] = [
  {
    id: 'NQ-8401',
    source: 'ABP Majha',
    sourceShort: 'ABP Majha',
    url: 'https://marathi.abplive.com/maharashtra/thane-coastal-ring-road-pwd-inspection',
    sources: [
      { name: 'ABP Majha', nameMr: 'एबीपी माझा', url: 'https://marathi.abplive.com/maharashtra/thane-coastal-ring-road-pwd-inspection', type: 'TV' },
      { name: 'Lokmat', nameMr: 'लोकमत', url: 'https://www.lokmat.com/thane-coastal-road-progress', type: 'Print' },
      { name: 'Sakal', nameMr: 'सकाळ', url: 'https://www.esakal.com/thane-pwd-inspection', type: 'Print' },
    ],
    channelType: 'TV',
    newsMr: 'ठाणे खाडी किनारा महामार्ग कामाचा वेग वाढला; सार्वजनिक बांधकाम विभागाचा पाहणी दौरा',
    newsEn: 'Thane Coastal Ring Road accelerated; PWD Minister undertakes on-ground milestone inspection',
    district: 'Thane',
    scoring: 88,
    scoreLevel: 'High',
    sentiment: 'Positive',
    verification: 'Verified',
    credibilityScore: 96,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '142.5K Reach',
    impressions: '399.0K views',
    timestamp: '16:35:10',
  },
  {
    id: 'NQ-8402',
    source: 'TV9 Marathi',
    sourceShort: 'TV9 Marathi',
    url: 'https://www.tv9marathi.com/maharashtra/palghar-dahanu-earthquake-rumors-refuted',
    sources: [
      { name: 'TV9 Marathi', nameMr: 'टीव्ही९ मराठी', url: 'https://www.tv9marathi.com/maharashtra/palghar-dahanu-earthquake-rumors-refuted', type: 'TV' },
      { name: 'X / Twitter', nameMr: 'एक्स / ट्विटर', url: 'https://x.com/MahaDGIPR/status/1845423101', type: 'Social' },
      { name: 'FactCheck MH', nameMr: 'फॅक्टचेक महा', url: 'https://factcheck.maharashtra.gov.in', type: 'Official' },
    ],
    channelType: 'TV',
    newsMr: 'डहाणू-तलासरी किनारपट्टी भागात भूकंपाच्या खोट्या अफवांवर विश्वास न ठेवण्याचे आवाहन',
    newsEn: 'District Administration urges citizens not to heed baseless coastal earthquake rumors in Dahanu',
    district: 'Palghar',
    scoring: 96,
    scoreLevel: 'Critical',
    sentiment: 'Critical',
    verification: 'Flagged Misinfo',
    credibilityScore: 94,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '420.0K Reach',
    impressions: '1.1M views',
    timestamp: '16:35:42',
  },
  {
    id: 'NQ-8403',
    source: 'Lokmat',
    sourceShort: 'Lokmat',
    url: 'https://www.lokmat.com/kokan/alibag-wadkhal-highway-widening-final-phase',
    sources: [
      { name: 'Lokmat', nameMr: 'लोकमत', url: 'https://www.lokmat.com/kokan/alibag-wadkhal-highway-widening-final-phase', type: 'Print' },
      { name: 'Pudhari', nameMr: 'पुढारी', url: 'https://pudhari.news/raigad-highway-widening', type: 'Print' },
    ],
    channelType: 'Print',
    newsMr: 'अलिबाग-वडखळ राष्ट्रीय महामार्गाचे रुंदीकरण अंतिम टप्प्यात; रायगड जिल्हाधिकाऱ्यांकडून आढावा',
    newsEn: 'Alibag-Wadkhal National Highway widening enters final stretch; Raigad Collector reviews progress',
    district: 'Raigad',
    scoring: 84,
    scoreLevel: 'High',
    sentiment: 'Positive',
    verification: 'Verified',
    credibilityScore: 95,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '95.0K Reach',
    impressions: '266.0K views',
    timestamp: '16:36:15',
  },
  {
    id: 'NQ-8404',
    source: 'Zee 24 Taas',
    sourceShort: 'Zee 24 Taas',
    url: 'https://zeenews.india.com/marathi/maharashtra/ratnagiri-alphonso-mango-export-cargo-hub',
    sources: [
      { name: 'Zee 24 Taas', nameMr: 'झी २४ तास', url: 'https://zeenews.india.com/marathi/maharashtra/ratnagiri-alphonso-mango-export-cargo-hub', type: 'TV' },
      { name: 'Sakal', nameMr: 'सकाळ', url: 'https://www.esakal.com/kokan/ratnagiri-alphonso-cargo-terminal', type: 'Print' },
    ],
    channelType: 'TV',
    newsMr: 'रत्नागिरी हापूस आंबा थेट युरोप निर्यातीसाठी विशेष कृषी कार्गो कक्ष कार्यान्वित',
    newsEn: 'Dedicated agri-cargo facility operationalised for direct Ratnagiri Alphonso mango exports to Europe',
    district: 'Ratnagiri',
    scoring: 95,
    scoreLevel: 'Critical',
    sentiment: 'Positive',
    verification: 'Verified',
    credibilityScore: 93,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '285.0K Reach',
    impressions: '798.0K views',
    timestamp: '16:36:51',
  },
  {
    id: 'NQ-8405',
    source: 'News18 Lokmat',
    sourceShort: 'News18',
    url: 'https://lokmat.news18.com/news/maharashtra/chipi-airport-sindhudurg-new-flights-bengaluru-hyderabad',
    sources: [
      { name: 'News18', nameMr: 'न्यूज१८', url: 'https://lokmat.news18.com/news/maharashtra/chipi-airport-sindhudurg-new-flights-bengaluru-hyderabad', type: 'TV' },
      { name: 'Tarun Bharat', nameMr: 'तरुण भारत', url: 'https://tarunbharat.net/sindhudurg-chipi-expansion', type: 'Print' },
    ],
    channelType: 'TV',
    newsMr: 'चिपी आंतरराष्ट्रीय विमानतळावरून बंगळुरू व हैदराबाद थेट विमानसेवेची वारंवारता वाढवली',
    newsEn: 'Flight frequency expanded from Chipi Airport Sindhudurg to Bengaluru and Hyderabad IT hubs',
    district: 'Sindhudurg',
    scoring: 93,
    scoreLevel: 'Critical',
    sentiment: 'Positive',
    verification: 'Verified',
    credibilityScore: 94,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '210.0K Reach',
    impressions: '588.0K views',
    timestamp: '16:37:18',
  },
  {
    id: 'NQ-8406',
    source: 'Maharashtra Times',
    sourceShort: 'Maha Times',
    url: 'https://maharashtratimes.com/maharashtra/palghar-jal-jeevan-mission-tribal-villages',
    sources: [
      { name: 'Maharashtra Times', nameMr: 'मटा', url: 'https://maharashtratimes.com/maharashtra/palghar-jal-jeevan-mission-tribal-villages', type: 'Print' },
      { name: 'Lokmat', nameMr: 'लोकमत', url: 'https://www.lokmat.com/palghar-jal-jeevan-mission', type: 'Print' },
      { name: 'Pudhari', nameMr: 'पुढारी', url: 'https://pudhari.news/palghar-water-supply-scheme', type: 'Print' },
    ],
    channelType: 'Print',
    newsMr: 'पालघर जिल्ह्यातील दुर्गम पाड्यांमध्ये जलजीवन मिशन अंतर्गत ९५% घरांमध्ये नळजोडणी पूर्ण',
    newsEn: 'Jal Jeevan Mission achieves 95% tap connectivity coverage across remote Palghar tribal hamlets',
    district: 'Palghar',
    scoring: 92,
    scoreLevel: 'Critical',
    sentiment: 'Positive',
    verification: 'Verified',
    credibilityScore: 97,
    credibilityTier: 'Tier-1 Accredited',
    volumes: '125.0K Reach',
    impressions: '350.0K views',
    timestamp: '16:37:45',
  },
];
