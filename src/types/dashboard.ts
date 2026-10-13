export type UserRole = 'dg_admin' | 'collector' | 'dio_desk';

export type Language = 'en' | 'mr';

export interface DistrictData {
  id: string;
  rank: number;
  name: string;
  division: string;
  releases: number;
  avgTAT: number; // in minutes
  sentiment: number; // percentage
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
  source: string;
  verificationStatus: string;
  slaRemaining: string;
  slaMinutes: number;
  district: string;
  authorized: boolean;
}

export interface OCRRecord {
  id: string;
  source: string;
  timestamp: string;
  headline: string;
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
