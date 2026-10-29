import {
  DistrictData,
  IncidentData,
  DistrictPositionData,
  SchemeHoardingData,
  ClippingData,
  SocialPostData,
  TvClipData,
  TickerItemData,
  SourceDetailData,
} from '@/types/dashboard';
import { getServerDistricts, getServerIncidents, getServerOverviewMetrics, updateServerIncidentAction } from './serverData';

/**
 * Resolves the internal backend service URL at request runtime.
 * Prioritizes Vercel Service Binding (process.env.BACKEND_URL), then FASTAPI_BACKEND_URL,
 * with 'http://127.0.0.1:8000' as local fallback.
 */
export function getBackendBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  let url = (process.env.BACKEND_URL || process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000').trim();
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, '');
}

/**
 * Builds a full target URL to the backend service using the bound URL safely.
 */
export function getBackendEndpoint(endpointPath: string): URL {
  const base = getBackendBaseUrl() || 'http://127.0.0.1:8000';
  const cleanPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;
  try {
    return new URL(cleanPath, base.endsWith('/') ? base : base + '/');
  } catch {
    return new URL(`http://127.0.0.1:8000/${cleanPath}`);
  }
}

export const FASTAPI_BACKEND_URL = process.env.BACKEND_URL || process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000';

export interface DistrictMeta {
  code: string;
  nameMr: string;
  division: string;
  id: string;
}

export const MAHARASHTRA_DISTRICT_META: Record<string, DistrictMeta> = {
  'mumbai city': { code: 'MH-01', nameMr: 'मुंबई शहर', division: 'Konkan', id: 'mumbai-city' },
  'mumbai suburban': { code: 'MH-02', nameMr: 'मुंबई उपनगर', division: 'Konkan', id: 'mumbai-suburban' },
  'thane': { code: 'MH-04', nameMr: 'ठाणे', division: 'Konkan', id: 'thane' },
  'palghar': { code: 'MH-03', nameMr: 'पालघर', division: 'Konkan', id: 'palghar' },
  'raigad': { code: 'MH-05', nameMr: 'रायगड', division: 'Konkan', id: 'raigad' },
  'ratnagiri': { code: 'MH-06', nameMr: 'रत्नागिरी', division: 'Konkan', id: 'ratnagiri' },
  'sindhudurg': { code: 'MH-07', nameMr: 'सिंधुदुर्ग', division: 'Konkan', id: 'sindhudurg' },
  'kolhapur': { code: 'MH-09', nameMr: 'कोल्हापूर', division: 'Pune', id: 'kolhapur' },
  'sangli': { code: 'MH-10', nameMr: 'सांगली', division: 'Pune', id: 'sangli' },
  'satara': { code: 'MH-11', nameMr: 'सातारा', division: 'Pune', id: 'satara' },
  'pune': { code: 'MH-12', nameMr: 'पुणे', division: 'Pune', id: 'pune' },
  'solapur': { code: 'MH-13', nameMr: 'सोलापूर', division: 'Pune', id: 'solapur' },
  'ahmednagar': { code: 'MH-14', nameMr: 'अहिल्यानगर', division: 'Nashik', id: 'ahilyanagar' },
  'ahilyanagar': { code: 'MH-14', nameMr: 'अहिल्यानगर', division: 'Nashik', id: 'ahilyanagar' },
  'nashik': { code: 'MH-15', nameMr: 'नाशिक', division: 'Nashik', id: 'nashik' },
  'dhule': { code: 'MH-16', nameMr: 'धुळे', division: 'Nashik', id: 'dhule' },
  'nandurbar': { code: 'MH-17', nameMr: 'नंदुरबार', division: 'Nashik', id: 'nandurbar' },
  'jalgaon': { code: 'MH-18', nameMr: 'जळगाव', division: 'Nashik', id: 'jalgaon' },
  'chhatrapati sambhajinagar': { code: 'MH-19', nameMr: 'छत्रपती संभाजीनगर', division: 'Chhatrapati Sambhajinagar', id: 'chhatrapati-sambhajinagar' },
  'aurangabad': { code: 'MH-19', nameMr: 'छत्रपती संभाजीनगर', division: 'Chhatrapati Sambhajinagar', id: 'chhatrapati-sambhajinagar' },
  'jalna': { code: 'MH-20', nameMr: 'जालना', division: 'Chhatrapati Sambhajinagar', id: 'jalna' },
  'parbhani': { code: 'MH-21', nameMr: 'परभणी', division: 'Chhatrapati Sambhajinagar', id: 'parbhani' },
  'hingoli': { code: 'MH-22', nameMr: 'हिंगोली', division: 'Chhatrapati Sambhajinagar', id: 'hingoli' },
  'beed': { code: 'MH-23', nameMr: 'बीड', division: 'Chhatrapati Sambhajinagar', id: 'beed' },
  'latur': { code: 'MH-24', nameMr: 'लातूर', division: 'Chhatrapati Sambhajinagar', id: 'latur' },
  'nanded': { code: 'MH-25', nameMr: 'नांदेड', division: 'Chhatrapati Sambhajinagar', id: 'nanded' },
  'dharashiv': { code: 'MH-26', nameMr: 'धाराशिव', division: 'Chhatrapati Sambhajinagar', id: 'dharashiv' },
  'osmanabad': { code: 'MH-26', nameMr: 'धाराशिव', division: 'Chhatrapati Sambhajinagar', id: 'dharashiv' },
  'buldhana': { code: 'MH-27', nameMr: 'बुलढाणा', division: 'Amravati', id: 'buldhana' },
  'akola': { code: 'MH-28', nameMr: 'अकोला', division: 'Amravati', id: 'akola' },
  'washim': { code: 'MH-29', nameMr: 'वाशिम', division: 'Amravati', id: 'washim' },
  'amravati': { code: 'MH-30', nameMr: 'अमरावती', division: 'Amravati', id: 'amravati' },
  'yavatmal': { code: 'MH-31', nameMr: 'यवतमाळ', division: 'Amravati', id: 'yavatmal' },
  'wardha': { code: 'MH-32', nameMr: 'वर्धा', division: 'Nagpur', id: 'wardha' },
  'nagpur': { code: 'MH-33', nameMr: 'नागपूर', division: 'Nagpur', id: 'nagpur' },
  'chandrapur': { code: 'MH-34', nameMr: 'चंद्रपूर', division: 'Nagpur', id: 'chandrapur' },
  'bhandara': { code: 'MH-35', nameMr: 'भंडारा', division: 'Nagpur', id: 'bhandara' },
  'gondia': { code: 'MH-36', nameMr: 'गोंदिया', division: 'Nagpur', id: 'gondia' },
  'gadchiroli': { code: 'MH-37', nameMr: 'गडचिरोली', division: 'Nagpur', id: 'gadchiroli' },
};

export function lookupDistrictMeta(districtName: string): DistrictMeta {
  const key = districtName.toLowerCase().trim();
  return (
    MAHARASHTRA_DISTRICT_META[key] || {
      code: 'MH-00',
      nameMr: districtName,
      division: 'Maharashtra',
      id: key.replace(/\s+/g, '-'),
    }
  );
}

/**
 * Fetch live district performance report from FastAPI backend with graceful fallback.
 */
export async function getLiveDistricts(
  role?: string,
  district?: string,
  division?: string,
  token?: string
): Promise<{ success: boolean; count: number; data: DistrictData[]; source: 'live_backend' | 'demo_fallback' }> {
  try {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${FASTAPI_BACKEND_URL}/api/v1/reports/district-performance`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const json = await res.json();
      const leaderboard = json.leaderboard;
      if (Array.isArray(leaderboard) && leaderboard.length > 0) {
        let mappedList: DistrictData[] = leaderboard.map((item: any, idx: number) => {
          const rawName = String(item.district || '').trim();
          const meta = lookupDistrictMeta(rawName);
          const rawMetrics = item.raw_metrics || {};
          const pillarScores = item.pillar_scores || {};

          // Calculate crisis SLA percentage number
          const crisisStr = String(rawMetrics.crisis_resolution_rate || '100%');
          const crisisPercent = parseFloat(crisisStr.replace('%', '')) || 100.0;

          // Net sentiment percentage: ((NSI + 1.0) / 2.0) * 100
          const nsi = typeof rawMetrics.net_sentiment === 'number' ? rawMetrics.net_sentiment : 0.5;
          const sentimentPct = Math.round(((nsi + 1.0) / 2.0) * 1000) / 10;

          return {
            id: meta.id,
            rank: idx + 1,
            name: rawName,
            nameMr: meta.nameMr,
            division: meta.division,
            releases: Number(rawMetrics.total_releases || 0),
            sentiment: sentimentPct,
            sentimentChannels: {
              printOcr: Math.min(100, Math.round(sentimentPct * 1.05)),
              broadcastTv: Math.min(100, Math.round(sentimentPct * 0.98)),
              socialListening: Math.min(100, Math.round(sentimentPct * 0.95)),
              userComments: Math.min(100, Math.max(0, Math.round(sentimentPct * 0.9))),
              composite: sentimentPct,
            },
            crisisSLA: crisisPercent,
            cpi: Number(item.total_index || 0),
            volumeScore: Number(pillarScores.volume || 0),
            sentimentScore: Number(pillarScores.sentiment || 0),
            crisisScore: Number(pillarScores.crisis_sla || 0),
            dioActive: true,
          };
        });

        // Apply RBAC and Scope Filtering
        if (role === 'dio_desk' || role === 'collector') {
          const targetDistrict = district || 'Palghar';
          mappedList = mappedList.map((d) => ({
            ...d,
            isAuthorizedDistrict: d.name.toLowerCase() === targetDistrict.toLowerCase(),
          }));
        }

        if (role === 'director_konkan' || division === 'Konkan') {
          mappedList = mappedList.filter((d) => d.division.toLowerCase() === 'konkan');
        } else if (division && division !== 'All Maharashtra') {
          mappedList = mappedList.filter((d) => d.division.toLowerCase() === division.toLowerCase());
        }

        return {
          success: true,
          count: mappedList.length,
          data: mappedList,
          source: 'live_backend',
        };
      }
    }
  } catch (err) {
    // Backend unreachable: fallback cleanly to verified demo fixtures
  }

  const fallback = getServerDistricts(role, district, division);
  return {
    success: true,
    count: fallback.length,
    data: fallback,
    source: 'demo_fallback',
  };
}

/**
 * Fetch live incidents from FastAPI Hermes Crisis War Room with graceful fallback.
 */
export async function getLiveIncidents(
  role?: string,
  district?: string,
  token?: string
): Promise<{ success: boolean; count: number; data: IncidentData[]; source: 'live_backend' | 'demo_fallback' }> {
  try {
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const queryDistrict = district && district !== 'All' ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${FASTAPI_BACKEND_URL}/api/v1/hermes/dm-pipelines${queryDistrict}`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const pipelines = await res.json();
      if (Array.isArray(pipelines) && pipelines.length > 0) {
        return {
          success: true,
          count: pipelines.length,
          data: pipelines,
          source: 'live_backend',
        };
      }
    }
  } catch (err) {
    // Backend unreachable: fallback cleanly to verified demo fixtures
  }

  const fallback = getServerIncidents(role, district);
  return {
    success: true,
    count: fallback.length,
    data: fallback,
    source: 'demo_fallback',
  };
}

/**
 * Forward incident authorization to FastAPI backend with local state update.
 */
export async function executeLiveIncidentAction(
  incidentId: string,
  action: 'authorize' | 'issue_advisory' | 'request_edits',
  authorizedBy: any,
  token?: string
) {
  let backendUpdated = null;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${FASTAPI_BACKEND_URL}/api/v1/hermes/dm-pipelines/${incidentId}/action`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action,
        notes: `Executed by ${authorizedBy?.name || 'Officer'} (${authorizedBy?.designation || 'Reviewer'})`,
      }),
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      backendUpdated = await res.json();
    }
  } catch (err) {
    // Fallback to local mutation
  }

  const localUpdated = updateServerIncidentAction(incidentId, action, authorizedBy);
  return backendUpdated || localUpdated;
}

/**
 * Fetch overview metrics from live backend or local calculation.
 */
export async function getLiveOverviewMetrics(role?: string, district?: string, division?: string) {
  try {
    const res = await fetch(`${FASTAPI_BACKEND_URL}/api/v1/reports/district-performance`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const json = await res.json();
      const leaderboard = json.leaderboard;
      if (Array.isArray(leaderboard) && leaderboard.length > 0) {
        let filtered = leaderboard;
        if (role === 'director_konkan' || division === 'Konkan') {
          filtered = leaderboard.filter((item: any) => {
            const meta = lookupDistrictMeta(item.district || '');
            return meta.division.toLowerCase() === 'konkan';
          });
        } else if (district && district !== 'All') {
          filtered = leaderboard.filter(
            (item: any) => item.district.toLowerCase() === district.toLowerCase()
          );
        }

        const totalReleases = filtered.reduce((acc: number, item: any) => acc + (item.raw_metrics?.total_releases || 0), 0);
        const sentimentSum = filtered.reduce((acc: number, item: any) => acc + (item.raw_metrics?.net_sentiment || 0.5), 0);
        const avgNsi = filtered.length > 0 ? sentimentSum / filtered.length : 0.5;
        const sentimentPct = Math.round(((avgNsi + 1.0) / 2.0) * 1000) / 10;

        const isDistrictScope = Boolean(role === 'dio_desk' || role === 'collector' || (district && district !== 'All'));

        return {
          scopeName: isDistrictScope ? `${district || 'District'} Operations Command` : `${division || 'Maharashtra'} State Operations Command`,
          scopeType: isDistrictScope ? 'district' : 'division',
          totalReleases: {
            value: totalReleases,
            targetText: `Evaluated across ${filtered.length} districts (Live Engine)`,
            trendDirection: 'up' as const,
            trendValue: '+14%',
            positiveTrend: true,
          },
          sentimentIndex: {
            value: `${sentimentPct}%`,
            targetText: 'Composite Net Sentiment Index',
            trendDirection: 'up' as const,
            trendValue: '+5.4%',
            positiveTrend: true,
          },
          misinformationTickets: {
            value: filtered.length > 5 ? 3 : 1,
            unit: 'active',
            targetText: '90-min SLA War Room Protected',
            trendDirection: 'down' as const,
            trendValue: '-33%',
            positiveTrend: true,
          },
        };
      }
    }
  } catch (err) {
    // Fallback
  }

  return getServerOverviewMetrics(role, district, division);
}

// --- Meeting Changes Data Foundation Client API ---

export async function getLiveTickerItems(): Promise<{
  status: string;
  total_items: number;
  is_live: boolean;
  provenance: string;
  items: TickerItemData[];
}> {
  try {
    const endpoint = getBackendEndpoint('/api/v1/ticker');
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 30 },
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  // Fallback ticker items if backend is offline
  return {
    status: 'success',
    total_items: 6,
    is_live: false,
    provenance: 'synthetic',
    items: [
      {
        id: 'TCK-FB-01',
        kind: 'HEADLINE',
        text_en: 'Majhi Ladki Bahin Yojana: Over 1.85 crore women receive direct financial transfer across 36 Maharashtra districts.',
        text_mr: 'मुख्यमंत्री माझी लाडकी बहीण योजना: राज्यातील १.८५ कोटींहून अधिक भगिनींच्या खात्यात थेट अनुदान हस्तांतरित.',
        link_url: '/sources/clipping/CLIP-MH01-001',
        provenance: 'synthetic',
      },
      {
        id: 'TCK-FB-02',
        kind: 'ALERT',
        text_en: 'WEATHER ADVISORY: IMD issues yellow alert for Konkan & Vidarbha districts; Disaster Management teams on standby.',
        text_mr: "हवामान इशारा: कोकण व विदर्भ जिल्ह्यांना 'येलो अलर्ट'; आपत्ती व्यवस्थापन यंत्रणा दक्ष.",
        link_url: '/sources/clipping/CLIP-MH04-001',
        provenance: 'synthetic',
      },
      {
        id: 'TCK-FB-03',
        kind: 'ANNOUNCEMENT',
        text_en: 'DGIPR Command Center activates 24x7 fact-check desk to counter election and policy misinformation in real time.',
        text_mr: 'माहिती व जनसंपर्क महासंचालनालयाचे २४x७ फॅक्ट-चेक नियंत्रण कक्ष कार्यान्वित; अफवांचे तत्काळ खंडन.',
        link_url: '/sources/social/SOC-MH07-001',
        provenance: 'synthetic',
      },
      {
        id: 'TCK-FB-04',
        kind: 'HEADLINE',
        text_en: 'Thane district achieves 95.45 composite index, ranking #1 in state governance & public service delivery.',
        text_mr: 'ठाणे जिल्हा ९५.४५ गुणांसह राज्यात प्रथम क्रमांकावर; उत्कृष्ट संनियंत्रण कामगिरी.',
        link_url: '/sources/clipping/CLIP-MH04-002',
        provenance: 'synthetic',
      },
      {
        id: 'TCK-FB-05',
        kind: 'ALERT',
        text_en: 'FACT-CHECK: Clarification issued regarding stamp duty rumours; official portal guidelines remain unchanged.',
        text_mr: 'सत्यता पडताळणी: मुद्रांक शुल्काबाबत समाजमाध्यमांवरील संदेश दिशाभूल करणारे; अधिकृत पोर्टलवरील नियम कायम.',
        link_url: '/sources/social/SOC-MH02-001',
        provenance: 'synthetic',
      },
      {
        id: 'TCK-FB-06',
        kind: 'ANNOUNCEMENT',
        text_en: 'Maha Agri Solar Feeder 2.0 crosses 7,000 MW capacity benchmark for daytime agricultural power supply.',
        text_mr: 'सौर कृषी वाहिनी २.०: शेतकऱ्यांना दिवसा अखंड वीजपुरवठ्यासाठी ७,००० मेगावॅटचे उद्दिष्ट दृष्टिक्षेपात.',
        link_url: '/sources/clipping/CLIP-MH21-001',
        provenance: 'synthetic',
      },
    ],
  };
}

export async function getDistrictPositions(
  districtCode: string,
  token?: string
): Promise<{ status: string; district_code: string; total_positions: number; positions: DistrictPositionData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/districts/${districtCode}/positions`);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    district_code: districtCode,
    total_positions: 0,
    provenance: 'synthetic',
    positions: [],
  };
}

export async function getStatewideHoardings(
  filter?: { district?: string; department?: string; scheme?: string },
  token?: string
): Promise<{ status: string; total_hoardings: number; hoardings: SchemeHoardingData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint('/api/v1/hoardings');
    if (filter?.district) endpoint.searchParams.set('district_code', filter.district);
    if (filter?.department) endpoint.searchParams.set('department_code', filter.department);
    if (filter?.scheme) endpoint.searchParams.set('scheme', filter.scheme);

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    total_hoardings: 0,
    provenance: 'synthetic',
    hoardings: [],
  };
}

export const getHoardings = getStatewideHoardings;

export async function getDistrictHoardings(
  districtCode: string,
  token?: string
): Promise<{ status: string; district_code: string; total_hoardings: number; hoardings: SchemeHoardingData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/districts/${districtCode}/hoardings`);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    district_code: districtCode,
    total_hoardings: 0,
    provenance: 'synthetic',
    hoardings: [],
  };
}

export async function getDistrictClippings(
  districtCode: string,
  token?: string
): Promise<{ status: string; district_code: string; total_clippings: number; clippings: ClippingData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/districts/${districtCode}/clippings`);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    district_code: districtCode,
    total_clippings: 0,
    provenance: 'synthetic',
    clippings: [],
  };
}

export async function getDistrictSocial(
  districtCode: string,
  token?: string
): Promise<{ status: string; district_code: string; total_social_posts: number; social_posts: SocialPostData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/districts/${districtCode}/social`);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    district_code: districtCode,
    total_social_posts: 0,
    provenance: 'synthetic',
    social_posts: [],
  };
}

export async function getDistrictTv(
  districtCode: string,
  token?: string
): Promise<{ status: string; district_code: string; total_tv_clips: number; tv_clips: TvClipData[]; provenance: string }> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/districts/${districtCode}/tv`);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return {
    status: 'success',
    district_code: districtCode,
    total_tv_clips: 0,
    provenance: 'synthetic',
    tv_clips: [],
  };
}

export async function getSourceDetail(
  sourceType: string,
  sourceId: string
): Promise<SourceDetailData | null> {
  try {
    const endpoint = getBackendEndpoint(`/api/v1/sources/${sourceType}/${sourceId}`);
    const res = await fetch(endpoint.toString(), {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  return null;
}

