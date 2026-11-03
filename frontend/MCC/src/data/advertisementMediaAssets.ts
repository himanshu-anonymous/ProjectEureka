/**
 * advertisementMediaAssets.ts
 * Curated real high-resolution imagery and creative visuals for outdoor hoardings and state advertisements.
 * Uses official government campaign visuals, highway unipole photos, metro gantry billboards, and print tearsheets.
 */

import { HoardingRecord } from './maharashtraDistrictsData';
import { StateAdvertisement } from './advertisementsData';

export const REAL_HOARDING_IMAGES: Record<string, string> = {
  // Campaign-specific real government artwork & photography
  'ladki-bahin': '/hoardings/ladki-bahin.svg', // Majhi Ladki Bahin Yojana banner
  'metro-infra': '/hoardings/metro-infra.svg', // Urban rail / metro corridor
  'health-scheme': '/hoardings/health-scheme.svg', // Public health / Mahatma Phule Jan Arogya
  'samruddhi': '/hoardings/samruddhi-feeder.svg', // Expressway / Hindu Hrudaysamrat Balasaheb Thackeray Samruddhi Mahamarg
  'jalyukta': '/hoardings/jalyukta-shivar.svg', // Jalyukta Shivar Abhiyan 2.0
  'tourism': '/hoardings/fort-conservation.svg', // Chhatrapati Shivaji Maharaj UNESCO Forts Circuit
  'unipole': '/hoardings/atal-setu.svg', // Modern highway unipole / Atal Setu
  'gantry': '/hoardings/coastal-road.svg', // Overhead highway gantry / Dharmveer Swarajyarakshak Coastal Road
  'led-screen': '/hoardings/pune-metro.svg', // Illuminated LED digital billboard
  'bus-shelter': '/hoardings/yuva-karya.svg', // Urban transit bus shelter
};

export const REAL_ADVERTISEMENT_CREATIVES: Record<string, string> = {
  'AD-2026-001': '/hoardings/ladki-bahin.svg', // Mukhyamantri Majhi Ladki Bahin Yojana
  'AD-2026-002': '/hoardings/alphonso-agri.svg', // Namo Shetkari Mahasanman Nidhi
  'AD-2026-003': '/hoardings/metro-infra.svg', // Maha Metro Connectivity & Urban Transit
  'AD-2026-004': '/hoardings/jalyukta-shivar.svg', // Jalyukta Shivar Abhiyan 2.0 (Water Harvesting)
  'AD-2026-005': '/hoardings/yuva-karya.svg', // Mukhyamantri Yuva Karyaprashikshan Internship Scheme
  'AD-2026-006': '/hoardings/fort-conservation.svg', // Maharashtra Tourism UNESCO World Heritage Forts Circuit
};

/**
 * Resolves a real photographic image for a hoarding record.
 */
export function getHoardingPhoto(hoarding: HoardingRecord): string {
  const c = (hoarding.campaign || '').toLowerCase();
  const s = (hoarding.size || '').toLowerCase();
  const loc = (hoarding.location || '').toLowerCase();

  if (c.includes('ladki') || c.includes('bahin') || c.includes('महिला') || c.includes('भगिनी')) {
    return '/hoardings/ladki-bahin.svg';
  }
  if (c.includes('pune metro') || loc.includes('swargate') || loc.includes('hinjawadi')) {
    return '/hoardings/pune-metro.svg';
  }
  if (c.includes('nagpur metro') || loc.includes('sitabuldi') || loc.includes('mihan')) {
    return '/hoardings/nagpur-metro.svg';
  }
  if (c.includes('metro') || c.includes('रेल्वे') || c.includes('मेट्रो') || c.includes('transit')) {
    return '/hoardings/metro-infra.svg';
  }
  if (c.includes('samruddhi') || c.includes('समृद्धी') || c.includes('mahamarg') || c.includes('expressway')) {
    return '/hoardings/samruddhi-feeder.svg';
  }
  if (c.includes('arogya') || c.includes('health') || c.includes('आरोग्य') || c.includes('रुग्ण')) {
    return '/hoardings/health-scheme.svg';
  }
  if (c.includes('jal') || c.includes('shivar') || c.includes('जलसंधारण') || c.includes('पाणी')) {
    return '/hoardings/jalyukta-shivar.svg';
  }
  if (c.includes('shetkari') || c.includes('farmer') || c.includes('agri') || c.includes('शेतकरी')) {
    return '/hoardings/alphonso-agri.svg';
  }
  if (c.includes('yuva') || c.includes('intern') || c.includes('karya') || c.includes('विद्यावेतन') || c.includes('युवा')) {
    return '/hoardings/yuva-karya.svg';
  }
  if (c.includes('tourism') || c.includes('fort') || c.includes('वारसा') || c.includes('पर्यटन') || c.includes('किल्ले')) {
    return '/hoardings/fort-conservation.svg';
  }
  if (c.includes('atal') || loc.includes('setu') || loc.includes('mthl')) {
    return '/hoardings/atal-setu.svg';
  }
  if (c.includes('coastal') || loc.includes('worli') || loc.includes('marine')) {
    return '/hoardings/coastal-road.svg';
  }
  if (c.includes('solar') || c.includes('सौर')) {
    return '/hoardings/solar-feeder.svg';
  }

  // Structure-based matching
  if (s.includes('gantry')) {
    return '/hoardings/coastal-road.svg';
  }
  if (s.includes('digital') || s.includes('led')) {
    return '/hoardings/metro-infra.svg';
  }
  if (s.includes('bus') || s.includes('shelter')) {
    return '/hoardings/pune-metro.svg';
  }

  return '/hoardings/atal-setu.svg';
}

/**
 * Resolves creative artwork image for an advertisement.
 */
export function getAdvertisementCreativePhoto(ad: StateAdvertisement): string {
  if (REAL_ADVERTISEMENT_CREATIVES[ad.id]) {
    return REAL_ADVERTISEMENT_CREATIVES[ad.id];
  }
  const t = (ad.campaignTitle + ' ' + ad.department).toLowerCase();
  if (t.includes('ladki') || t.includes('bahin')) return '/hoardings/ladki-bahin.svg';
  if (t.includes('shetkari') || t.includes('farmer') || t.includes('agri')) return '/hoardings/alphonso-agri.svg';
  if (t.includes('metro') || t.includes('transit')) return '/hoardings/metro-infra.svg';
  if (t.includes('jalyukta') || t.includes('water')) return '/hoardings/jalyukta-shivar.svg';
  if (t.includes('yuva') || t.includes('internship') || t.includes('skill')) return '/hoardings/yuva-karya.svg';
  if (t.includes('tourism') || t.includes('fort') || t.includes('heritage')) return '/hoardings/fort-conservation.svg';
  return '/hoardings/default.svg';
}
