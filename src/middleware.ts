import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept requests to /login for already authenticated sessions
  if (pathname === '/login') {
    const token = request.cookies.get('maha_auth_token')?.value;
    if (token) {
      const verification = await verifyAuthToken(token);
      if (verification.valid) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    const userCookie = request.cookies.get('maha_auth_user')?.value;
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user?.username) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
};
