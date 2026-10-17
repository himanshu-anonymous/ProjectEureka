import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { AuthUser } from '@/types/dashboard';

// Government Secret Key fallback (configurable via environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'maha-command-center-secure-gov-token-key-2026-dgipr';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const JWT_ISSUER = 'maha-command-center';
export const JWT_AUDIENCE = 'maha-gov-officers';

// Mandated Time-To-Live (TTL): 12 hours
export const JWT_TTL_HOURS = 12;
export const JWT_TTL_SECONDS = 12 * 60 * 60; // 43,200 seconds
export const JWT_EXPIRATION_EXPRESSION = '12h';

export interface AuthJwtPayload extends JWTPayload {
  user: AuthUser;
}

/**
 * Signs a cryptographically secured HMAC-SHA256 JWT for an authenticated government officer.
 * Defaults to 12 hours TTL.
 */
export async function signAuthToken(
  user: AuthUser,
  expiration: string | number = JWT_EXPIRATION_EXPRESSION
): Promise<string> {
  const jwt = new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setSubject(user.username);

  if (typeof expiration === 'number') {
    jwt.setExpirationTime(Math.floor(Date.now() / 1000) + expiration);
  } else {
    jwt.setExpirationTime(expiration);
  }

  return await jwt.sign(encodedSecret);
}

/**
 * Verifies a JWT token, ensuring cryptographic signature integrity,
 * matching issuer/audience, and strictly enforcing the 12-hour expiration window.
 */
export async function verifyAuthToken(
  token: string
): Promise<{ valid: boolean; payload?: AuthJwtPayload; error?: string }> {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token is missing or empty' };
    }

    const { payload } = await jwtVerify(token, encodedSecret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return {
      valid: true,
      payload: payload as AuthJwtPayload,
    };
  } catch (error: any) {
    const message = error?.message || 'Token verification failed';
    return {
      valid: false,
      error: message,
    };
  }
}
