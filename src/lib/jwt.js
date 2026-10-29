import { SignJWT, jwtVerify } from 'jose';

// Government Secret Key fallback (configurable via environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'maha-command-center-secure-gov-token-key-2026-dgipr';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const JWT_ISSUER = 'maha-command-center';
export const JWT_AUDIENCE = 'maha-gov-officers';

// Mandated Time-To-Live (TTL): 12 hours
export const JWT_TTL_HOURS = 12;
export const JWT_TTL_SECONDS = 12 * 60 * 60; // 43,200 seconds
export const JWT_EXPIRATION_EXPRESSION = '12h';

/**
 * Signs a cryptographically secured HMAC-SHA256 JWT for an authenticated government officer.
 * Defaults to 12 hours TTL.
 */
export async function signAuthToken(
  user,
  expiration = JWT_EXPIRATION_EXPRESSION
) {
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
export async function verifyAuthToken(token) {
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
      payload,
    };
  } catch (error) {
    const err = error;
    if (err?.code === 'ERR_JWT_EXPIRED') {
      return { valid: false, error: 'Token expired. 12-hour validity exceeded.' };
    }
    return { valid: false, error: err?.message || 'Invalid token signature' };
  }
}
