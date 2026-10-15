import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/serverData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, pin } = body;

    if (!username || !pin) {
      return NextResponse.json(
        { success: false, message: 'Username and PIN are required.' },
        { status: 400 }
      );
    }

    const matched = MOCK_USERS[username];
    if (!matched || matched.pin !== pin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your officer ID and PIN.' },
        { status: 401 }
      );
    }

    // Set a lightweight auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: matched.user,
    });

    response.cookies.set('maha_auth_user', JSON.stringify(matched.user), {
      httpOnly: false, // accessible to client for synchronization
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error during authentication.', error: String(error) },
      { status: 500 }
    );
  }
}
