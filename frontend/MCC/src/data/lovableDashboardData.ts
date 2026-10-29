export interface DistrictMetricData {
  id: string;
  name: string;
  nameMr: string;
  division: 'konkan' | 'nashik' | 'pune' | 'chhatrapati-sambhajinagar' | 'amravati' | 'nagpur';
  performance: number;
  pressReleases: number;
  placements: number;
  placementPct: number;
  sentiment: number; // e.g. -100 to +100
  tat: number; // in minutes
  crisisAlerts: number;
  fieldEvents: number;
  trend: number; // positive for improvement, negative for decline
}

export type MapThematicMetric = 'performance' | 'coverage' | 'sentiment' | 'crisis' | 'events';

export type ScoreBand = 'excellent' | 'good' | 'moderate' | 'attention' | 'critical';

export const METRIC_LABELS: Record<MapThematicMetric, string> = {
  performance: 'Performance Index',
  coverage: 'Media Coverage',
  sentiment: 'Sentiment',
  crisis: 'Crisis Alerts',
  events: 'Field Events',
};

export const BAND_COLORS: Record<ScoreBand, string> = {
  excellent: '#20A765', // Lovable Vibrant Emerald
  good: '#9BCB3C',      // Lovable Fresh Lime
  moderate: '#F2C94C',  // Lovable Warm Amber
  attention: '#F2994A', // Lovable Tangerine Orange
  critical: '#E94B4B',  // Lovable Vivid Red
};

export const BAND_BG_CLASSES: Record<ScoreBand, string> = {
  excellent: 'bg-[#20A765]',
  good: 'bg-[#9BCB3C]',
  moderate: 'bg-[#F2C94C]',
  attention: 'bg-[#F2994A]',
  critical: 'bg-[#E94B4B]',
};

export const METRIC_LEGENDS: Record<MapThematicMetric, { band: ScoreBand; label: string }[]> = {
  performance: [
    { band: 'excellent', label: '80 - 100 (Excellent)' },
    { band: 'good', label: '60 - 80 (Good)' },
    { band: 'moderate', label: '40 - 60 (Moderate)' },
    { band: 'attention', label: '20 - 40 (Needs Attention)' },
    { band: 'critical', label: '0 - 20 (Critical)' },
  ],
  coverage: [
    { band: 'excellent', label: '40+ placements' },
    { band: 'good', label: '30 - 40' },
    { band: 'moderate', label: '20 - 30' },
    { band: 'attention', label: '10 - 20' },
    { band: 'critical', label: '< 10' },
  ],
  sentiment: [
    { band: 'excellent', label: '+60% and above' },
    { band: 'good', label: '+20% to +60%' },
    { band: 'moderate', label: '-20% to +20%' },
    { band: 'attention', label: '-60% to -20%' },
    { band: 'critical', label: 'below -60%' },
  ],
  crisis: [
    { band: 'excellent', label: 'No active alerts' },
    { band: 'good', label: 'Low risk' },
    { band: 'moderate', label: 'Monitoring' },
    { band: 'attention', label: 'Elevated' },
    { band: 'critical', label: 'Critical' },
  ],
  events: [
    { band: 'excellent', label: '6+ events' },
    { band: 'good', label: '4 - 5' },
    { band: 'moderate', label: '3' },
    { band: 'attention', label: '1 - 2' },
    { band: 'critical', label: 'None' },
  ],
};

const RAW_DISTRICT_TUPLES: [string, string, string, number, number, number, number, number, number, number][] = [
  ['Thane', 'ठाणे', 'konkan', 88, 9, 34, 62, 38, 0, 6],
  ['Pune', 'पुणे', 'pune', 84, 11, 41, 55, 42, 1, 7],
  ['Mumbai', 'मुंबई', 'konkan', 81, 14, 52, 35, 35, 2, 8],
  ['Nagpur', 'नागपूर', 'nagpur', 78, 8, 29, 48, 51, 1, 5],
  ['Nashik', 'नाशिक', 'nashik', 76, 7, 26, 44, 55, 0, 4],
  ['Wardha', 'वर्धा', 'nagpur', 75, 3, 12, 34, 57, 0, 3],
  ['Aurangabad', 'छ. संभाजीनगर', 'chhatrapati-sambhajinagar', 74, 7, 24, 28, 58, 1, 4],
  ['Amravati', 'अमरावती', 'amravati', 73, 5, 17, 32, 61, 0, 3],
  ['Kolhapur', 'कोल्हापूर', 'pune', 72, 5, 19, 40, 60, 0, 3],
  ['Akola', 'अकोला', 'amravati', 71, 4, 14, 26, 63, 0, 3],
  ['Jalgaon', 'जळगाव', 'nashik', 70, 6, 18, 30, 64, 0, 3],
  ['Ahmednagar', 'अहिल्यानगर', 'nashik', 68, 5, 17, 25, 66, 0, 3],
  ['Yavatmal', 'यवतमाळ', 'amravati', 67, 4, 13, 12, 69, 1, 2],
  ['Palghar', 'पालघर', 'konkan', 66, 4, 14, 22, 70, 0, 2],
  ['Washim', 'वाशिम', 'amravati', 65, 2, 8, 15, 75, 0, 2],
  ['Dhule', 'धुळे', 'nashik', 64, 3, 11, 20, 74, 0, 2],
  ['Buldhana', 'बुलढाणा', 'amravati', 63, 3, 10, 18, 76, 0, 2],
  ['Satara', 'सातारा', 'pune', 62, 4, 13, 18, 72, 0, 2],
  ['Gondia', 'गोंदिया', 'nagpur', 61, 2, 8, 8, 82, 0, 1],
  ['Nandurbar', 'नंदुरबार', 'nashik', 60, 2, 8, 16, 78, 0, 2],
  ['Bhandara', 'भंडारा', 'nagpur', 59, 2, 7, 10, 84, 0, 1],
  ['Sangli', 'सांगली', 'pune', 58, 4, 12, 14, 80, 0, 2],
  ['Parbhani', 'परभणी', 'chhatrapati-sambhajinagar', 57, 2, 8, 2, 85, 0, 1],
  ['Jalna', 'जालना', 'chhatrapati-sambhajinagar', 56, 3, 9, 4, 86, 0, 2],
  ['Latur', 'लातूर', 'chhatrapati-sambhajinagar', 55, 3, 9, -6, 89, 1, 2],
  ['Hingoli', 'हिंगोली', 'chhatrapati-sambhajinagar', 54, 2, 6, 0, 90, 0, 1],
  ['Solapur', 'सोलापूर', 'pune', 52, 3, 10, -8, 88, 1, 2],
  ['Osmanabad', 'धाराशिव', 'chhatrapati-sambhajinagar', 50, 2, 6, -4, 94, 0, 1],
  ['Beed', 'बीड', 'chhatrapati-sambhajinagar', 48, 3, 8, -14, 102, 1, 1],
  ['Ratnagiri', 'रत्नागिरी', 'konkan', 46, 3, 8, 6, 95, 0, 1],
  ['Sindhudurg', 'सिंधुदुर्ग', 'konkan', 44, 2, 7, 10, 98, 0, 1],
  ['Nanded', 'नांदेड', 'chhatrapati-sambhajinagar', 42, 3, 9, -10, 110, 1, 1],
  ['Raigad', 'रायगड', 'konkan', 32, 4, 8, -12, 142, 2, 3],
  ['Gadchiroli', 'गडचिरोली', 'nagpur', 28, 1, 4, -22, 120, 1, 1],
  ['Chandrapur', 'चंद्रपूर', 'nagpur', 26, 2, 5, -18, 128, 2, 1],
];

export const LOVABLE_DISTRICTS: DistrictMetricData[] = RAW_DISTRICT_TUPLES.map(
  ([name, nameMr, division, performance, pressReleases, placements, sentiment, tat, crisisAlerts, fieldEvents], index) => {
    const placementPct = Math.min(95, Math.round((placements / (pressReleases * 4)) * 100));
    const trend = performance >= 60 ? (index * 7) % 8 + 1 : -((index * 5) % 5 + 1);

    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      nameMr,
      division: division as DistrictMetricData['division'],
      performance,
      pressReleases,
      placements,
      placementPct,
      sentiment,
      tat,
      crisisAlerts,
      fieldEvents,
      trend,
    };
  }
);

export function findDistrictMetricData(nameOrId: string): DistrictMetricData | undefined {
  if (!nameOrId) return undefined;
  const raw = nameOrId.trim();
  const q = raw.toLowerCase().replace(/\s+/g, '-');
  return LOVABLE_DISTRICTS.find(
    (d) =>
      d.id === q ||
      d.name.toLowerCase() === raw.toLowerCase() ||
      d.name.toLowerCase().replace(/\s+/g, '-') === q ||
      d.nameMr === raw ||
      ((q === 'mumbai-city' || q === 'mumbai-suburban' || q === 'mumbai') && d.id === 'mumbai') ||
      ((q === 'chhatrapati-sambhajinagar' || q === 'aurangabad') && (d.id === 'aurangabad' || d.id === 'chhatrapati-sambhajinagar')) ||
      ((q === 'ahilyanagar' || q === 'ahmednagar') && (d.id === 'ahmednagar' || d.id === 'ahilyanagar')) ||
      ((q === 'dharashiv' || q === 'osmanabad') && (d.id === 'osmanabad' || d.id === 'dharashiv'))
  );
}

export function getDistrictMetricNormalizedScore(district: DistrictMetricData, metric: MapThematicMetric): number {
  switch (metric) {
    case 'performance':
      return district.performance;
    case 'coverage':
      return Math.min(100, Math.round(district.placements * 2));
    case 'sentiment':
      return Math.min(100, Math.max(0, Math.round((district.sentiment + 100) / 2)));
    case 'crisis':
      return Math.max(0, Math.min(100, 100 - district.crisisAlerts * 35 - Math.max(0, district.tat - 60) / 2));
    case 'events':
      return Math.min(100, Math.round(district.fieldEvents * 12 + 10));
    default:
      return district.performance;
  }
}

export function getBandFromScore(score: number): ScoreBand {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'attention';
  return 'critical';
}

export function getDistrictFillColor(district: DistrictMetricData, metric: MapThematicMetric): string {
  const score = getDistrictMetricNormalizedScore(district, metric);
  const band = getBandFromScore(score);
  return BAND_COLORS[band];
}

export interface KPICardItem {
  key: string;
  label: string;
  sub?: string;
  value: string;
  change: number;
  target: string;
  goodWhenDown?: boolean;
}

export const TOP_KPI_DATA: KPICardItem[] = [
  {
    key: 'pr',
    label: 'Press Releases',
    sub: '(Today)',
    value: '142',
    change: 18,
    target: 'Target: Real-time dissemination',
  },
  {
    key: 'mp',
    label: 'Media Placements',
    value: '328',
    change: 12,
    target: 'Target: > 70% placement',
  },
  {
    key: 'ns',
    label: 'Net Sentiment Index',
    value: '72%',
    change: 6,
    target: 'Target: > 65% positive',
  },
  {
    key: 'tat',
    label: 'Crisis Response TAT',
    value: '48 min',
    change: -35,
    target: 'Target: < 90 minutes',
    goodWhenDown: true,
  },
  {
    key: 'fe',
    label: 'Field Publicity Events',
    value: '86',
    change: 14,
    target: 'IEC & Outreach Activities',
  },
];

export interface PressReleaseItem {
  id: number;
  title: string;
  district: string;
  time: string;
  status: 'Published' | 'Scheduled' | 'Draft';
}

export const RECENT_PRESS_RELEASES: PressReleaseItem[] = [
  {
    id: 1,
    title: 'Coastal tourism development initiative launched in Raigad',
    district: 'Raigad',
    time: '23 Oct 2026, 14:20',
    status: 'Published',
  },
  {
    id: 2,
    title: 'Flood preparedness review meeting held in Thane',
    district: 'Thane',
    time: '23 Oct 2026, 13:10',
    status: 'Published',
  },
  {
    id: 3,
    title: 'New irrigation project to benefit farmers in Jalgaon',
    district: 'Jalgaon',
    time: '23 Oct 2026, 11:45',
    status: 'Published',
  },
  {
    id: 4,
    title: 'Skill development camp for youth inaugurated in Nagpur',
    district: 'Nagpur',
    time: '23 Oct 2026, 10:30',
    status: 'Scheduled',
  },
  {
    id: 5,
    title: 'Health awareness drive reaches 40 villages in Gadchiroli',
    district: 'Gadchiroli',
    time: '23 Oct 2026, 09:15',
    status: 'Draft',
  },
];

export interface MediaClippingItem {
  id: number;
  title: string;
  source: string;
  date: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export const TODAYS_MEDIA_CLIPPINGS: MediaClippingItem[] = [
  {
    id: 1,
    title: 'रायगडमध्ये पर्यटन विकासाला चालना',
    source: 'Lokmat',
    date: '23 Oct 2026',
    sentiment: 'Positive',
  },
  {
    id: 2,
    title: 'ठाण्यात पूर परिस्थितीचा आढावा बैठक',
    source: 'Sakal',
    date: '23 Oct 2026',
    sentiment: 'Neutral',
  },
  {
    id: 3,
    title: 'नाशिकमध्ये नवीन सिंचन प्रकल्प',
    source: 'Maharashtra Times',
    date: '23 Oct 2026',
    sentiment: 'Positive',
  },
  {
    id: 4,
    title: 'चंद्रपुरात पाणीटंचाईवरून नागरिक त्रस्त',
    source: 'Loksatta',
    date: '23 Oct 2026',
    sentiment: 'Negative',
  },
];

export const CRISIS_CASE_SUMMARY = [
  { label: 'High Priority', count: 5, band: 'critical' as ScoreBand, color: '#E94B4B' },
  { label: 'Under Verification', count: 3, band: 'attention' as ScoreBand, color: '#F2994A' },
  { label: 'Rebuttal Issued', count: 2, band: 'moderate' as ScoreBand, color: '#F2C94C' },
  { label: 'Closed', count: 2, band: 'excellent' as ScoreBand, color: '#20A765' },
];

export const SOCIAL_MEDIA_PLATFORMS = [
  { key: 'x', name: 'X / Twitter', value: '12.4K', change: 22 },
  { key: 'fb', name: 'Facebook', value: '18.7K', change: 15 },
  { key: 'ig', name: 'Instagram', value: '9.2K', change: 28 },
  { key: 'yt', name: 'YouTube', value: '6.8K', change: 12 },
];

export const SOCIAL_ENGAGEMENT_7DAYS = [
  { day: '17 Oct', x: 12000, fb: 22000, ig: 6000, yt: 3000 },
  { day: '18 Oct', x: 14000, fb: 24000, ig: 7000, yt: 3500 },
  { day: '19 Oct', x: 13000, fb: 23000, ig: 8000, yt: 4200 },
  { day: '20 Oct', x: 15000, fb: 27000, ig: 8500, yt: 4800 },
  { day: '21 Oct', x: 17000, fb: 33000, ig: 9500, yt: 5200 },
  { day: '22 Oct', x: 16000, fb: 30000, ig: 9000, yt: 6000 },
  { day: '23 Oct', x: 18000, fb: 28000, ig: 10000, yt: 6800 },
];

export const BREAKING_NEWS_TICKER_ITEMS = [
  'मुख्यमंत्र्यांच्या हस्ते पुणे मेट्रो विस्ताराचे उद्घाटन',
  'Flood alert issued for Raigad coastal belt — DIO response team activated',
  'नागपूर में किसानों के लिए नई सिंचाई योजना की घोषणा',
  'Fact-check: viral message on school closures in Nashik is FALSE',
  'कोल्हापुरात आरोग्य शिबिराला उत्स्फूर्त प्रतिसाद',
  'छत्रपती संभाजीनगर औद्योगिक कॉरिडॉरला गती — ५००० नवीन रोजगार',
  'Daily DGIPR dissemination rate cross 95% target across Konkan and Pune divisions',
];

export interface SectionMeta {
  slug: string;
  title: string;
  description: string;
}

export const SECTIONS_META: SectionMeta[] = [
  { slug: 'district-performance', title: 'District Performance', description: 'Real-time CPI rankings and score progression across all 36 DIOs.' },
  { slug: 'press-releases', title: 'Press Releases', description: 'Real-time government press bulletins, departmental communiqués, and distribution status.' },
  { slug: 'media-clippings', title: 'Media Clippings', description: 'Statewide print and digital newspaper coverage with regional sentiment tags.' },
  { slug: 'social-media', title: 'Social Media', description: 'Omni-channel engagement tracking across X/Twitter, Facebook, Instagram, and YouTube.' },
  { slug: 'fact-check', title: 'Fact Check / Crisis', description: 'Counter-misinformation war room, active rumor verification, and rebuttal issuance.' },
  { slug: 'field-publicity', title: 'Field Publicity (IEC)', description: 'District-level grassroots Information, Education, and Communication campaigns.' },
  { slug: 'reports', title: 'Reports & Analytics', description: 'Executive intelligence summaries, multi-district comparative analytics, and telemetry audits.' },
  { slug: 'alerts', title: 'Alerts', description: 'High-priority emergency notifications and operational escalations.' },
  { slug: 'settings', title: 'Settings', description: 'Command center configuration, user preferences, API keys, and telemetry feeds.' },
];
