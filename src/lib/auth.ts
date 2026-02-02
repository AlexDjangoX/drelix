import { createHash } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'drelix-admin-session';
const RATE_LIMIT_SALT = 'drelix-login-rl-v1';

export { COOKIE_NAME };

/** Get JWT secret from env. Prefer JWT_SECRET; fallback to ADMIN_PASSWORD for backwards compat. */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_PASSWORD ?? '';
  return new TextEncoder().encode(secret);
}

/** Verify admin session JWT. Returns payload if valid, null otherwise. */
export async function verifyAdminSession(
  token: string
): Promise<{ role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.role === 'admin') {
      return { role: 'admin' };
    }
    return null;
  } catch {
    return null;
  }
}

/** Create admin session JWT. */
export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(getJwtSecret());
  return token;
}

/** Hash client identifier for rate-limit key (privacy + consistent lookup). */
export function hashClientIp(ip: string): string {
  return createHash('sha256')
    .update(RATE_LIMIT_SALT + ip)
    .digest('hex');
}

/** Get client IP from request headers (Vercel, etc.). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

/** Timing-safe string comparison. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  try {
    return nodeTimingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
