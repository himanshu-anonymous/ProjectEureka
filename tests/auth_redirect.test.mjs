import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { signAuthToken, verifyAuthToken } from '../src/lib/jwt.ts';

const ROOT_DIR = process.cwd();

describe('Authenticated Session & /login Redirection Suite', () => {
  const dummyOfficer = {
    id: 'collector-palghar',
    username: 'collector_palghar',
    name: 'Vikram S. Mahajan, IAS',
    marathiName: 'विक्रम एस. महाजन',
    role: 'collector',
    designation: 'District Magistrate & Collector',
    division: 'Konkan',
    district: 'Palghar',
    avatarInitials: 'VM',
    permittedDivisions: ['Konkan'],
    permittedDistricts: ['Palghar'],
    canAuthorizeRebuttals: true,
  };

  it('should verify token validation triggers redirect condition for active session', async () => {
    const validToken = await signAuthToken(dummyOfficer);
    const verification = await verifyAuthToken(validToken);

    assert.strictEqual(verification.valid, true, 'Valid token must be verified');
    assert.strictEqual(verification.payload?.user?.username, 'collector_palghar');

    // Simulate middleware decision logic
    const shouldRedirect = verification.valid;
    assert.strictEqual(shouldRedirect, true, 'Middleware must trigger redirect for valid session');
  });

  it('should reject redirect condition for expired or missing tokens', async () => {
    // Expired token (expired 10 seconds ago)
    const expiredToken = await signAuthToken(dummyOfficer, -10);
    const verification = await verifyAuthToken(expiredToken);

    assert.strictEqual(verification.valid, false, 'Expired token must fail verification');

    const shouldRedirect = verification.valid;
    assert.strictEqual(shouldRedirect, false, 'Expired session must not trigger redirect');
  });

  it('should verify Next.js middleware.ts intercepts /login and implements redirect', () => {
    const middlewarePath = path.join(ROOT_DIR, 'src', 'middleware.ts');
    assert.ok(fs.existsSync(middlewarePath), 'src/middleware.ts must exist');

    const content = fs.readFileSync(middlewarePath, 'utf8');
    assert.ok(
      content.includes("pathname === '/login'"),
      "Middleware must check for pathname === '/login'"
    );
    assert.ok(
      content.includes('maha_auth_token'),
      'Middleware must inspect maha_auth_token cookie'
    );
    assert.ok(
      content.includes('verifyAuthToken'),
      'Middleware must verify token with verifyAuthToken'
    );
    assert.ok(
      content.includes("NextResponse.redirect(new URL('/', request.url))"),
      "Middleware must redirect to '/' when authenticated"
    );
    assert.ok(
      content.includes("matcher: ['/login']"),
      "Middleware config matcher must include '/login'"
    );
  });

  it('should verify Server Component page.tsx implements server-side redirect for authenticated sessions', () => {
    const pagePath = path.join(ROOT_DIR, 'src', 'app', 'login', 'page.tsx');
    assert.ok(fs.existsSync(pagePath), 'src/app/login/page.tsx must exist');

    const content = fs.readFileSync(pagePath, 'utf8');
    assert.ok(content.includes('cookies()'), 'LoginPage must read cookies from next/headers');
    assert.ok(
      content.includes('verifyAuthToken'),
      'LoginPage must verify token with verifyAuthToken'
    );
    assert.ok(
      content.includes("redirect('/')"),
      "LoginPage must call redirect('/') for valid tokens"
    );
  });

  it('should verify LoginScreen.tsx client component contains active session guard and redirect logic', () => {
    const screenPath = path.join(
      ROOT_DIR,
      'src',
      'components',
      'portal',
      'LoginScreen.tsx'
    );
    assert.ok(fs.existsSync(screenPath), 'src/components/portal/LoginScreen.tsx must exist');

    const content = fs.readFileSync(screenPath, 'utf8');
    assert.ok(
      content.includes('isAuthenticated') && content.includes('authInitialized'),
      'LoginScreen must check isAuthenticated and authInitialized'
    );
    assert.ok(
      content.includes("router.replace('/')"),
      "LoginScreen must call router.replace('/') when authenticated"
    );
    assert.ok(
      content.includes('Active Government Officer Session Detected'),
      'LoginScreen must display session detected feedback to eliminate form flicker'
    );
  });
});
