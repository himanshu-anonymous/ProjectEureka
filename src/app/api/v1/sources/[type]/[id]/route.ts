import { NextRequest, NextResponse } from 'next/server';
import { getSourceDetail } from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await context.params;
    const data = await getSourceDetail(type, id);

    if (!data) {
      return NextResponse.json(
        { status: 'error', message: `Source item '${type}/${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch source details' },
      { status: 500 }
    );
  }
}
