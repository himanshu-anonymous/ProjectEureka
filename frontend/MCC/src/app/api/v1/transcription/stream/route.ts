import { NextRequest } from 'next/server';
import { getBackendEndpoint } from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const channel = request.nextUrl.searchParams.get('channel') || 'tv_marathi_live';
  const targetUrl = getBackendEndpoint(`/api/v1/transcription/stream?channel=${encodeURIComponent(channel)}`);

  try {
    const backendRes = await fetch(targetUrl.toString(), {
      headers: {
        Accept: 'text/event-stream',
      },
      cache: 'no-store',
    });

    if (!backendRes.ok || !backendRes.body) {
      return new Response('Failed to connect to transcription stream', { status: 502 });
    }

    return new Response(backendRes.body as any, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(`Transcription proxy error: ${err?.message}`, { status: 502 });
  }
}
