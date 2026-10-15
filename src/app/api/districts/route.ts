import { NextRequest, NextResponse } from 'next/server';
import { getServerDistricts } from '@/lib/serverData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role') || undefined;
  const district = searchParams.get('district') || undefined;
  const division = searchParams.get('division') || undefined;

  const districts = getServerDistricts(role, district, division);
  return NextResponse.json({ success: true, count: districts.length, data: districts });
}
