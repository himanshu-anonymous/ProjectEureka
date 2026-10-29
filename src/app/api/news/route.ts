import { NextRequest, NextResponse } from 'next/server';
import { getServerNewsQueue, addServerNewsItem } from '@/lib/serverData';
import { NewsQueueItem } from '@/types/dashboard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const district = searchParams.get('district') || undefined;
    const sentiment = searchParams.get('sentiment') || undefined;
    const channel = searchParams.get('channel') || undefined;
    const verification = searchParams.get('verification') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const filtered = getServerNewsQueue(district, sentiment, channel, verification, search);

    // Pagination
    const totalCount = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve news data', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const newItem: NewsQueueItem = {
      id: body.id || `NQ-${Date.now().toString().slice(-4)}`,
      source: body.source || 'Digital Wire',
      sourceShort: body.sourceShort || 'Digital',
      url: body.url || 'https://dgipr.maharashtra.gov.in',
      sources: body.sources || [
        { name: 'Digital Wire', nameMr: 'डिजिटल वृत्त', url: 'https://dgipr.maharashtra.gov.in', type: 'Digital' }
      ],
      channelType: body.channelType || 'Digital',
      newsEn: body.newsEn || 'Statewide infrastructure and administrative review update.',
      newsMr: body.newsMr || 'राज्यव्यापी पायाभूत सुविधा व प्रशासकीय आढावा वृत्त.',
      district: body.district || 'Thane',
      scoring: body.scoring || 85,
      scoreLevel: body.scoreLevel || 'High',
      sentiment: body.sentiment || 'Positive',
      verification: body.verification || 'Verified',
      credibilityScore: body.credibilityScore || 94,
      credibilityTier: body.credibilityTier || 'Tier-1 Accredited',
      volumes: body.volumes || '120.0K Reach',
      impressions: body.impressions || '320.0K views',
      timestamp: `${hours}:${minutes}:${seconds}`,
    };

    addServerNewsItem(newItem);

    return NextResponse.json({
      success: true,
      message: 'News item ingested successfully.',
      data: newItem,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to ingest news item', error: String(error) },
      { status: 500 }
    );
  }
}
