export type UserRole = 'dg_admin' | 'director_konkan' | 'collector' | 'dio_desk';

export type Language = 'en' | 'mr';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  marathiName: string;
  role: UserRole;
  designation: string;
  division: string;
  district: string;
  avatarInitials: string;
  permittedDivisions: string[];
  permittedDistricts: string[];
  canAuthorizeRebuttals: boolean;
}


export interface SentimentChannelBreakdown {
  printOcr: number; // 0-100%
  broadcastTv: number; // 0-100%
  socialListening: number; // 0-100%
  userComments: number; // 0-100%
  composite: number; // 0-100%
}

export interface DirectSourceBadge {
  name: string;
  nameMr?: string;
  url: string;
  type?: 'Print' | 'TV' | 'Social' | 'Portal' | 'Official' | 'Digital' | 'Wire';
}

export interface DistrictData {
  id: string;
  rank: number;
  name: string;
  nameMr?: string;
  division: string;
  releases: number;
  avgTAT?: number; // in minutes
  sentiment: number; // percentage
  sentimentChannels?: SentimentChannelBreakdown;
  crisisSLA: number; // percentage
  cpi: number; // 0 - 100
  // Score decomposition specifics
  volumeScore: number;
  tatScore?: number;
  sentimentScore: number;
  crisisScore: number;
  dioActive: boolean;
  // Key Result Area (KRA) In-Charge details
  collectorName?: string;
  collectorNameMr?: string;
  collectorDesignation?: string;
  collectorDesignationMr?: string;
  dioOfficer?: string;
  dioOfficerMr?: string;
  dioDesignation?: string;
  kraResponsibilities?: string[];
  kraResponsibilitiesMr?: string[];
}

export interface IncidentPeopleAffected {
  injured: number;
  evacuated: number;
  fatalities: number;
  totalAffected: number;
  details: string;
  detailsMr?: string;
}

export interface IncidentAccidentDetails {
  location?: string;
  locationMr?: string;
  highwayOrRoad?: string;
  vehiclesInvolved?: string;
  emergencyUnitsDeployed?: string[];
  deployedUnits?: string;
  hospitalAdmitted?: string;
  hospitalName?: string;
  trafficStatus?: string;
  trafficStatusMr?: string;
  helpline?: string;
  helplineNumber?: string;
  responseLatencyMinutes?: number;
}

export interface IncidentVerificationEvidence {
  claim?: string;
  claimMr?: string;
  claimMade?: string;
  verifiedFact?: string;
  verifiedFactMr?: string;
  verifiedTruth?: string;
  evidenceType?: 'CCTV' | 'Satellite' | 'Field Inspection' | 'Official Police Report' | 'Forensic Analysis';
  evidenceSummary?: string;
  evidenceSummaryMr?: string;
  investigatingAgency: string;
  investigatingAgencyMr?: string;
  forensicProof?: string;
  verifiedTimestamp?: string;
  officialDocumentUrl?: string;
  officialGazetteUrl?: string;
  debunkedStatus?: 'False News Debunked' | 'Verified Official Alert' | 'Partially True' | 'Unverified Viral Rumor';
  isFactChecked?: boolean;
}

export interface IncidentData {
  id: string;
  severity: 'High' | 'Medium' | 'Low';
  summary: string;
  summaryEn?: string;
  summaryMr?: string;
  source: string;
  url?: string;
  sources?: DirectSourceBadge[];
  verificationStatus: string;
  slaRemaining: string;
  slaMinutes: number;
  district: string;
  authorized: boolean;
  incidentType?: 'Accident' | 'Misinformation' | 'Disaster' | 'General';
  cityName?: string;
  cityNameMr?: string;
  newsDetails?: string;
  newsDetailsMr?: string;
  peopleAffected?: IncidentPeopleAffected;
  accidentDetails?: IncidentAccidentDetails;
  verificationEvidence?: IncidentVerificationEvidence;
}

export interface OCRRecord {
  id: string;
  source: string;
  url?: string;
  sources?: DirectSourceBadge[];
  timestamp: string;
  headline: string;
  headlineEn?: string;
  headlineMr?: string;
  district: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  confidence: number;
  latency: string;
}

export interface SocialMediaStats {
  totalMentions: string;
  totalMentionsGrowth: string;
  organicReach: string;
  organicReachGrowth: string;
  engagementRate: string;
  engagementRateGrowth: string;
  reelCompletion: string;
  reelCompletionGrowth: string;
  talukaEngagement: { name: string; value: string; num: number }[];
}

export interface DIOData {
  id: string;
  districtId: string;
  districtName: string;
  division: string;
  officerName: string;
  designation: string;
  phone: string;
  email: string;
  status: 'Active' | 'Standby' | 'Field Operation';
  pendingReleases: number;
  localAlerts: number;
  lastActive: string;
}

export interface NewspaperMetric {
  name: string;
  circulation: string;
  articlesTracked: number;
  positive: number;
  neutral: number;
  negative: number;
  topStory: string;
}

export interface TVChannelMetric {
  channel: string;
  airtimeMinutes: number;
  sentimentScore: number;
  primeTimeShare: string;
  currentTopic: string;
}

export interface LeadershipMessage {
  id: string;
  sender: string;
  role: 'Director General (DG)' | 'Director of Information';
  title: string;
  content: string;
  timestamp: string;
  priority: 'Urgent' | 'Standard' | 'Directive';
}

export interface DepartmentPressRelease {
  id: string;
  title: string;
  date: string;
  status: 'Published' | 'Under Review' | 'Draft';
  downloads: number;
  district?: string;
  tatMinutes?: number;
}

export interface DepartmentPhoto {
  id: string;
  title: string;
  date: string;
  photographer: string;
  category: string;
}

export interface DepartmentVideo {
  id: string;
  title: string;
  duration: string;
  date: string;
  views: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  marathiName: string;
  minister: string;
  secretary: string;
  pressReleases: DepartmentPressRelease[];
  photos: DepartmentPhoto[];
  videos: DepartmentVideo[];
  gazettes: { id: string; grNumber: string; title: string; date: string }[];
  socialStats: {
    handle: string;
    followers: string;
    mentions24h: string;
    sentimentScore: number;
    viralReach: string;
  };
}

export interface DailyWorkflowItem {
  id: number;
  step: string;
  title: string;
  titleMr?: string;
  description: string;
  descriptionMr?: string;
  owner: string;
  ownerMr?: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  timeSlot: string;
  metric: string;
  metricMr?: string;
}

export interface NewsQueueItem {
  id: string;
  source: string;
  sourceShort: string;
  url?: string;
  sources?: DirectSourceBadge[];
  channelType: 'TV' | 'Print' | 'Digital' | 'Wire';
  newsEn: string;
  newsMr: string;
  district: string;
  scoring: number;
  scoreLevel: 'Critical' | 'High' | 'Moderate' | 'Routine';
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Critical';
  verification: 'Verified' | 'Fact-Check Passed' | 'Under Review' | 'Flagged Misinfo';
  credibilityScore: number;
  credibilityTier: 'Tier-1 Accredited' | 'Verified Regional' | 'Digital Wire' | 'Pending Audit';
  volumes: string;
  impressions: string;
  timestamp: string;
}


export type PositionCategory =
  | 'MINISTER'
  | 'MP'
  | 'MLA'
  | 'MLC'
  | 'COLLECTOR'
  | 'SP'
  | 'ZP_CEO'
  | 'MUNICIPAL'
  | 'DIO'
  | 'OTHER';

export interface DistrictPositionData {
  id: string;
  district_code: string;
  category: PositionCategory | string;
  designation_en: string;
  designation_mr: string;
  person_name: string;
  responsibilities_en?: string;
  responsibilities_mr?: string;
  phone?: string;
  email?: string;
  provenance: string;
  created_at?: string;
}

export interface SchemeHoardingData {
  id: string;
  district_code: string;
  scheme_name_en: string;
  scheme_name_mr: string;
  department_code: string;
  lat: number;
  lon: number;
  address: string;
  size: string;
  installed_on?: string;
  expires_on?: string;
  status: string;
  announcement_en?: string;
  announcement_mr?: string;
  image_url?: string;
  provenance: string;
}

export interface ClippingData {
  id: string;
  district_code: string;
  headline: string;
  outlet: string;
  language: string;
  published_at?: string;
  source_url: string;
  clipping_image_url?: string;
  summary?: string;
  provenance: string;
}

export interface SocialPostData {
  id: string;
  district_code: string;
  platform: string;
  handle: string;
  post_url: string;
  text: string;
  posted_at?: string;
  engagement: number;
  provenance: string;
}

export interface TvClipData {
  id: string;
  district_code: string;
  channel: string;
  programme: string;
  clip_url: string;
  aired_at?: string;
  start_offset_sec: number;
  transcript_text?: string;
  provenance: string;
}

export interface TickerItemData {
  id: string;
  kind: 'HEADLINE' | 'ANNOUNCEMENT' | 'ALERT' | string;
  text_en: string;
  text_mr: string;
  link_url?: string;
  created_at?: string;
  expires_at?: string;
  provenance: string;
}

export interface SourceDetailData {
  status: string;
  type: 'clipping' | 'social' | 'tv' | 'hoarding' | string;
  id: string;
  district_code: string;
  title?: string;
  title_en?: string;
  title_mr?: string;
  headline?: string;
  outlet?: string;
  channel?: string;
  platform?: string;
  handle?: string;
  programme?: string;
  department?: string;
  language?: string;
  timestamp?: string;
  published_at?: string;
  posted_at?: string;
  aired_at?: string;
  start_offset_sec?: number;
  source_url?: string;
  post_url?: string;
  clip_url?: string;
  image_url?: string;
  clipping_image_url?: string;
  summary?: string;
  text?: string;
  transcript_text?: string;
  body?: string;
  engagement?: number | { likes?: number; shares?: number; comments?: number; views?: number };
  address?: string;
  coordinates?: { lat: number; lon: number };
  size?: string;
  status_badge?: string;
  announcement_en?: string;
  announcement_mr?: string;
  provenance: string;
}

