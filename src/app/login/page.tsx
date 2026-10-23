import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuthToken } from '@/lib/jwt';
import { LoginScreen } from '@/components/portal/LoginScreen';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('maha_auth_token')?.value;

  if (token) {
    const verification = await verifyAuthToken(token);
    if (verification.valid && verification.payload?.user) {
      redirect('/');
    }
  }

  const userCookie = cookieStore.get('maha_auth_user')?.value;
  if (userCookie) {
    try {
      const parsed = JSON.parse(userCookie);
      if (parsed?.username) {
        redirect('/');
      }
    } catch {}
  }

  return <LoginScreen />;
}
