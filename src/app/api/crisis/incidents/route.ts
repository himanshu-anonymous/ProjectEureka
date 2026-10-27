import { NextRequest, NextResponse } from 'next/server';
import { getServerIncidents } from '@/lib/serverData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role') || undefined;
  const district = searchParams.get('district') || undefined;

  const incidents = getServerIncidents(role, district);
  return NextResponse.json({ success: true, count: incidents.length, data: incidents });
}
