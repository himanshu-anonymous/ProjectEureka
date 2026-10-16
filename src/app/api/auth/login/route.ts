import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/serverData';

const EMAIL_ALIAS_MAP: Record<string, string> = {
  'director.konkan@maharashtra.gov.in': 'director_konkan',
  'director_konkan@maharashtra.gov.in': 'director_konkan',
  'collector.palghar@maharashtra.gov.in': 'collector_palghar',
  'collector_palghar@maharashtra.gov.in': 'collector_palghar',
  'collector.thane@maharashtra.gov.in': 'collector_thane',
  'collector_thane@maharashtra.gov.in': 'collector_thane',
  'dio.konkan@maharashtra.gov.in': 'operator_konkan',
  'operator_konkan@dgipr.maharashtra.gov.in': 'operator_konkan',
  'operator_konkan@maharashtra.gov.in': 'operator_konkan',
  'dg.gokhale@maharashtra.gov.in': 'admin',
  'admin@maharashtra.gov.in': 'admin',
  'mh-dgipr-konkan-04': 'operator_konkan',
  'mh-dgipr-dir-01': 'director_konkan',
  'mh-dm-palghar-01': 'collector_palghar',
  'mh-dm-thane-01': 'collector_thane',
  'mh-state-dg-01': 'admin',
};

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

    const normalized = String(username).toLowerCase().trim();
    const resolvedUsername = EMAIL_ALIAS_MAP[normalized] || normalized;

    const matched = MOCK_USERS[resolvedUsername] || MOCK_USERS[username];
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
