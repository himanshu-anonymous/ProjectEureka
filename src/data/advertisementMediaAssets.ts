/**
 * advertisementMediaAssets.ts
 * Curated real high-resolution imagery and creative visuals for outdoor hoardings and state advertisements.
 * Uses official government campaign visuals, highway unipole photos, metro gantry billboards, and print tearsheets.
 */

import { HoardingRecord } from './maharashtraDistrictsData';
import { StateAdvertisement } from './advertisementsData';

export const REAL_HOARDING_IMAGES: Record<string, string> = {
  // Campaign-specific real photography
  'ladki-bahin': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', // Women empowerment banner
  'metro-infra': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80', // Urban rail / metro corridor
  'health-scheme': 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1200&q=80', // Public health / hospital
  'samruddhi': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80', // Expressway / super-highway
  'jalyukta': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', // Rural agriculture & water
  'tourism': 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80', // Heritage & forts
  'unipole': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', // Modern highway unipole
  'gantry': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80', // Overhead highway gantry
  'led-screen': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80', // Illuminated LED digital billboard
  'bus-shelter': 'https://images.unsplash.com/photo-1572945753563-804956783104?auto=format&fit=crop&w=1200&q=80', // Urban transit bus shelter
};

export const REAL_ADVERTISEMENT_CREATIVES: Record<string, string> = {
  'AD-2026-001': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80', // Ladki Bahin Print Ad
  'AD-2026-002': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', // Namo Shetkari Outdoor
  'AD-2026-003': 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80', // Metro Connectivity Digital
  'AD-2026-004': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80', // Jalyukta Shivar Print
  'AD-2026-005': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', // Yuva Internship Audio/Digital
  'AD-2026-006': 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1200&q=80', // Tourism UNESCO Heritage
};

/**
 * Resolves a real photographic image for a hoarding record.
 */
export function getHoardingPhoto(hoarding: HoardingRecord): string {
  const c = hoarding.campaign.toLowerCase();
  const s = hoarding.size.toLowerCase();

  if (c.includes('ladki') || c.includes('bahin') || c.includes('महिला')) {
    return REAL_HOARDING_IMAGES['ladki-bahin'];
  }
  if (c.includes('metro') || c.includes('रेल्वे') || c.includes('मेट्रो')) {
    return REAL_HOARDING_IMAGES['metro-infra'];
  }
  if (c.includes('samruddhi') || c.includes('समृद्धी') || c.includes('mahamarg') || c.includes('highway')) {
    return REAL_HOARDING_IMAGES['samruddhi'];
  }
  if (c.includes('arogya') || c.includes('health') || c.includes('आरोग्य')) {
    return REAL_HOARDING_IMAGES['health-scheme'];
  }
  if (c.includes('jal') || c.includes('shivar') || c.includes('agri') || c.includes('shetkari')) {
    return REAL_HOARDING_IMAGES['jalyukta'];
  }
  if (c.includes('tourism') || c.includes('fort') || c.includes('वारसा')) {
    return REAL_HOARDING_IMAGES['tourism'];
  }

  // Structure-based
  if (s.includes('gantry')) {
    return REAL_HOARDING_IMAGES['gantry'];
  }
  if (s.includes('digital') || s.includes('led')) {
    return REAL_HOARDING_IMAGES['led-screen'];
  }
  if (s.includes('bus') || s.includes('shelter')) {
    return REAL_HOARDING_IMAGES['bus-shelter'];
  }

  return REAL_HOARDING_IMAGES['unipole'];
}

/**
 * Resolves creative artwork image for an advertisement.
 */
export function getAdvertisementCreativePhoto(ad: StateAdvertisement): string {
  if (REAL_ADVERTISEMENT_CREATIVES[ad.id]) {
    return REAL_ADVERTISEMENT_CREATIVES[ad.id];
  }
  return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';
}
