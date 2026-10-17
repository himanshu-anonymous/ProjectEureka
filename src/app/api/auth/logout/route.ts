import { NextResponse } from 'next/server';
 
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.delete('maha_auth_token');
  response.cookies.delete('maha_auth_user');
  return response;
}

