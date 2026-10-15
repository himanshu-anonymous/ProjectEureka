import { NextResponse } from 'next/server';
import { KONKAN_DAILY_OPERATIONS_REPORT } from '@/lib/serverData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: KONKAN_DAILY_OPERATIONS_REPORT,
  });
}
