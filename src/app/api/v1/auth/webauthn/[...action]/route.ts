import { NextRequest, NextResponse } from 'next/server';
import { getBackendEndpoint } from '@/lib/backendClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function proxyRequest(request: NextRequest, context: any) {
  try {
    const rawParams = context?.params;
    const resolvedParams = rawParams && typeof rawParams === 'object' && 'then' in rawParams
      ? await rawParams
      : (rawParams || {});
    const actionPath = Array.isArray(resolvedParams?.action) ? resolvedParams.action.join('/') : '';

    const search = request.nextUrl?.search || '';
    const targetUrl = getBackendEndpoint(`/api/v1/auth/webauthn/${actionPath}${search}`);

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    const authHeader = request.headers.get('authorization');
    if (authHeader) headers['Authorization'] = authHeader;

    let body: any = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
      try {
        body = await request.text();
      } catch {}
    }

    const res = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    if (!res.ok) {
      return NextResponse.json({ registered: false, credentials: [], options: null, status: 'fallback' }, { status: 200 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { registered: false, credentials: [], options: null, status: 'fallback' },
      { status: 200 }
    );
  }
}

export async function GET(request: NextRequest, context: any) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: any) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: any) {
  return proxyRequest(request, context);
}
