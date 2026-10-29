import { NextRequest, NextResponse } from 'next/server';
import {
  getDistrictPositions,
  getDistrictHoardings,
  getDistrictClippings,
  getDistrictSocial,
  getDistrictTv,
} from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string; section: string }> }
) {
  try {
    const { code, section } = await context.params;
    const authHeader = request.headers.get('authorization') || undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    const s = section.toLowerCase();
    let data;

    if (s === 'positions') {
      data = await getDistrictPositions(code, token);
    } else if (s === 'hoardings') {
      data = await getDistrictHoardings(code, token);
    } else if (s === 'clippings') {
      data = await getDistrictClippings(code, token);
    } else if (s === 'social') {
      data = await getDistrictSocial(code, token);
    } else if (s === 'tv') {
      data = await getDistrictTv(code, token);
    } else {
      return NextResponse.json(
        { status: 'error', message: `Unknown district section '${section}'` },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch district section data' },
      { status: 500 }
    );
  }
}
