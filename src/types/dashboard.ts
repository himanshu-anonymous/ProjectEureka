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
  avgTAT: number; // in minutes
  sentiment: number; // percentage
  sentimentChannels?: SentimentChannelBreakdown;
  crisisSLA: number; // percentage
  cpi: number; // 0 - 100
  // Score decomposition specifics
  volumeScore: number;
  tatScore: number;
  sentimentScore: number;
  crisisScore: number;
  dioActive: boolean;
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

