import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  signAuthToken,
  verifyAuthToken,
  JWT_TTL_HOURS,
  JWT_TTL_SECONDS,
  JWT_EXPIRATION_EXPRESSION,
} from '../src/lib/jwt.ts';

describe('JWT Authentication & 12-Hour TTL Security Suite', () => {
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

  it('should define JWT TTL constants strictly matching 12 hours', () => {
    assert.strictEqual(JWT_TTL_HOURS, 12, 'JWT_TTL_HOURS must be 12');
    assert.strictEqual(
      JWT_TTL_SECONDS,
      12 * 60 * 60,
      'JWT_TTL_SECONDS must be exactly 43,200 seconds (12 hours)'
    );
    assert.strictEqual(
      JWT_EXPIRATION_EXPRESSION,
      '12h',
      'JWT_EXPIRATION_EXPRESSION must be 12h'
    );
  });

  it('should sign a valid JWT token with 12 hours TTL and valid payload claims', async () => {
    const token = await signAuthToken(dummyOfficer);
    assert.ok(token && typeof token === 'string', 'Token must be a non-empty string');
    assert.strictEqual(token.split('.').length, 3, 'JWT must contain header, payload, and signature');

    const result = await verifyAuthToken(token);
    assert.strictEqual(result.valid, true, 'Token must be valid');
    assert.ok(result.payload, 'Token must include payload');
    assert.strictEqual(result.payload.user.username, 'collector_palghar');
    assert.strictEqual(result.payload.user.role, 'collector');
    assert.strictEqual(result.payload.iss, 'maha-command-center');
    assert.strictEqual(result.payload.aud, 'maha-gov-officers');

    // Verify 12 hours expiration delta (43,200 seconds)
    const iat = result.payload.iat;
    const exp = result.payload.exp;
    assert.ok(iat && exp, 'Token must contain iat and exp timestamps');
    const ttlDeltaSeconds = exp - iat;
    assert.strictEqual(
      ttlDeltaSeconds,
      43200,
      `Expiration delta must be exactly 43,200 seconds (12 hours), received: ${ttlDeltaSeconds}`
    );
  });

  it('should reject a tampered JWT token', async () => {
    const validToken = await signAuthToken(dummyOfficer);
    const parts = validToken.split('.');

    // Tamper the payload segment
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        user: { ...dummyOfficer, role: 'dg_admin' },
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString('base64url');

    const forgedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
    const result = await verifyAuthToken(forgedToken);

    assert.strictEqual(result.valid, false, 'Tampered token must fail verification');
    assert.ok(result.error, 'Error message must be present for tampered token');
  });

  it('should reject an expired token exceeding the 12-hour window', async () => {
    // Generate an already expired token (expired 5 seconds ago)
    const expiredToken = await signAuthToken(dummyOfficer, -5);
    const result = await verifyAuthToken(expiredToken);

    assert.strictEqual(result.valid, false, 'Expired token must fail verification');
    assert.match(
      result.error || '',
      /exp|expired|claim/i,
      'Error message should indicate expiration'
    );
  });

  it('should reject empty or malformed token inputs gracefully', async () => {
    const result1 = await verifyAuthToken('');
    assert.strictEqual(result1.valid, false);

    const result2 = await verifyAuthToken('invalid.token');
    assert.strictEqual(result2.valid, false);

    // @ts-expect-error test invalid null
    const result3 = await verifyAuthToken(null);
    assert.strictEqual(result3.valid, false);
  });
});
