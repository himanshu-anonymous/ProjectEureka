import { NextRequest, NextResponse } from 'next/server';
import { getStatewideHoardings } from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const district = searchParams.get('district_code') || searchParams.get('district') || undefined;
    const department = searchParams.get('department_code') || searchParams.get('department') || undefined;
    const scheme = searchParams.get('scheme') || undefined;

    const authHeader = request.headers.get('authorization') || undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    const data = await getStatewideHoardings({ district, department, scheme }, token);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch hoardings' },
      { status: 500 }
    );
  }
}
