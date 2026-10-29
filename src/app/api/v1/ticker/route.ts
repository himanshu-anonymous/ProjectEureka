import { NextRequest, NextResponse } from 'next/server';
import { getLiveTickerItems } from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await getLiveTickerItems();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch ticker items' },
      { status: 500 }
    );
  }
}
