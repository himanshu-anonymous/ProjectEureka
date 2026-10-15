import { NewsQueueItem } from '@/types/dashboard';

export interface NewsChannelSource {
  name: string;
  short: string;
  type: 'TV' | 'Print' | 'Digital' | 'Wire';
  credibility: number;
  tier: 'Tier-1 Accredited' | 'Verified Regional' | 'Digital Wire' | 'Pending Audit';
}

export const NEWS_CHANNELS: NewsChannelSource[] = [
  { name: 'ABP Majha (एबीपी माझा)', short: 'ABP Majha', type: 'TV', credibility: 96, tier: 'Tier-1 Accredited' },
  { name: 'TV9 Marathi (टीव्ही९ मराठी)', short: 'TV9 Marathi', type: 'TV', credibility: 94, tier: 'Tier-1 Accredited' },
  { name: 'Lokmat (लोकमत)', short: 'Lokmat', type: 'Print', credibility: 95, tier: 'Tier-1 Accredited' },
  { name: 'Zee 24 Taas (झी २४ तास)', short: 'Zee 24 Taas', type: 'TV', credibility: 93, tier: 'Tier-1 Accredited' },
  { name: 'Saam TV (साम टीव्ही)', short: 'Saam TV', type: 'TV', credibility: 91, tier: 'Verified Regional' },
  { name: 'Maharashtra Times (मटा)', short: 'Maha Times', type: 'Print', credibility: 97, tier: 'Tier-1 Accredited' },
  { name: 'Pudhari (पुढारी कोकण)', short: 'Pudhari', type: 'Print', credibility: 92, tier: 'Verified Regional' },
  { name: 'News18 Lokmat (न्यूज१८ लोकमत)', short: 'News18', type: 'TV', credibility: 94, tier: 'Tier-1 Accredited' },
  { name: 'Sakal (सकाळ कोकण)', short: 'Sakal', type: 'Print', credibility: 95, tier: 'Tier-1 Accredited' },
  { name: 'PTI Bhasha (पीटीआय वृत्तसंस्था)', short: 'PTI Bhasha', type: 'Wire', credibility: 98, tier: 'Tier-1 Accredited' },
  { name: 'Konkan Today Digital', short: 'Konkan Today', type: 'Digital', credibility: 88, tier: 'Digital Wire' },
  { name: 'Navakal (नवाकाळ मुंबई/कोकण)', short: 'Navakal', type: 'Print', credibility: 89, tier: 'Verified Regional' },
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

  return {
    id: `NQ-${8400 + idCounter}`,
    source: channel.name,
    sourceShort: channel.short,
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
    source: 'ABP Majha (एबीपी माझा)',
    sourceShort: 'ABP Majha',
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
    source: 'TV9 Marathi (टीव्ही९ मराठी)',
    sourceShort: 'TV9 Marathi',
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
    source: 'Lokmat (लोकमत)',
    sourceShort: 'Lokmat',
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
    source: 'Zee 24 Taas (झी २४ तास)',
    sourceShort: 'Zee 24 Taas',
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
    source: 'News18 Lokmat (न्यूज१८ लोकमत)',
    sourceShort: 'News18',
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
    source: 'Maharashtra Times (मटा)',
    sourceShort: 'Maha Times',
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
