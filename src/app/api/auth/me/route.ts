import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/serverData';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('maha_auth_user');

  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const rawUser = JSON.parse(cookie.value);
    const freshUser = (rawUser.username && MOCK_USERS[rawUser.username]?.user) || rawUser;
    return NextResponse.json({ authenticated: true, user: freshUser });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
