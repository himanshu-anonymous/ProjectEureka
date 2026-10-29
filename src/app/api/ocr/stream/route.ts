import { NextRequest, NextResponse } from 'next/server';
import { getServerOcrFeed, addServerOcrRecord } from '@/lib/serverData';
import { OCRRecord } from '@/types/dashboard';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sentiment = searchParams.get('sentiment') || 'All';
  const district = searchParams.get('district') || 'All';

  const feed = getServerOcrFeed(sentiment, district);
  return NextResponse.json({ success: true, count: feed.length, data: feed });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord: OCRRecord = {
      id: body.id || `ocr-${Date.now()}`,
      source: body.source || 'Saamana',
      timestamp: 'Just now',
      headline:
        body.headline ||
        'Direct administrative review and infrastructure initiatives operational across districts.',
      headlineEn: body.headlineEn || 'Direct administrative review and infrastructure initiatives operational across districts.',
      headlineMr: body.headlineMr || 'जिल्हास्तरीय प्रशासकीय व पायाभूत सुविधांचा तातडीने प्रत्यक्ष आढावा.',
      district: body.district || 'Thane',
      sentiment: body.sentiment || 'Positive',
      confidence: body.confidence || 0.95,
      latency: body.latency || '32s',
    };

    const updated = addServerOcrRecord(newRecord);
    return NextResponse.json({
      success: true,
      message: 'New OCR record ingested.',
      data: updated[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to ingest record', error: String(error) },
      { status: 500 }
    );
  }
}
