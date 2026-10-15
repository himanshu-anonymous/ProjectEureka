import { NextRequest, NextResponse } from 'next/server';
import { getServerOcrFeed, addServerOcrRecord } from '@/lib/serverData';
import { OCRRecord } from '@/types/dashboard';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sentiment = searchParams.get('sentiment') || 'All';

  const feed = getServerOcrFeed(sentiment);
  return NextResponse.json({ success: true, count: feed.length, data: feed });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord: OCRRecord = {
      id: body.id || `ocr-${Date.now()}`,
      source: body.source || 'सामना (Saamana)',
      timestamp: 'Just now',
      headline:
        body.headline ||
        'मुंबई-गोवा महामार्ग कोकण टप्पा: सर्व खड्डे तातडीने बुजवा - विभागीय आयुक्त आदेश',
      district: body.district || 'Konkan',
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
