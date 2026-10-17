import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/serverData';
import { verifyAuthToken, signAuthToken, JWT_TTL_SECONDS } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  // 1. Check for JWT token in cookie or Authorization header
  const tokenCookie = request.cookies.get('maha_auth_token');
  const authHeader = request.headers.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = tokenCookie?.value || bearerToken;

  if (token) {
    const verification = await verifyAuthToken(token);
    if (!verification.valid || !verification.payload) {
      // Expired (>12h TTL) or tampered JWT: explicitly clear cookies and reject
      const response = NextResponse.json(
        { authenticated: false, message: verification.error || 'Token expired or invalid.', user: null },
        { status: 401 }
      );
      response.cookies.delete('maha_auth_token');
      response.cookies.delete('maha_auth_user');
      return response;
    }

    const tokenUser = verification.payload.user;
    const freshUser = (tokenUser.username && MOCK_USERS[tokenUser.username]?.user) || tokenUser;

    return NextResponse.json({
      authenticated: true,
      user: freshUser,
      exp: verification.payload.exp,
      iat: verification.payload.iat,
    });
  }

  // 2. Migration fallback for existing sessions transitioning to 12h JWT
  const userCookie = request.cookies.get('maha_auth_user');
  if (userCookie?.value) {
    try {
      const rawUser = JSON.parse(userCookie.value);
      const freshUser = (rawUser.username && MOCK_USERS[rawUser.username]?.user) || rawUser;
      if (freshUser && freshUser.username) {
        // Upgrade seamlessly to signed 12-hour JWT
        const upgradedToken = await signAuthToken(freshUser, '12h');
        const response = NextResponse.json({
          authenticated: true,
          user: freshUser,
          upgradedToJwt: true,
        });
        response.cookies.set('maha_auth_token', upgradedToken, {
          httpOnly: true,
          path: '/',
          maxAge: JWT_TTL_SECONDS,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        return response;
      }
    } catch {}
  }

  return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
}

