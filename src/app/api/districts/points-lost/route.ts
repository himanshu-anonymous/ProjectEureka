import { NextResponse } from 'next/server';
import { POINTS_LOST_DATA } from '@/data/pointsLostData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: POINTS_LOST_DATA,
  });
}
