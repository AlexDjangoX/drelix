import { NextResponse } from 'next/server';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { api } from 'convex/_generated/api';
import {
  COOKIE_NAME,
  createAdminSession,
  getClientIp,
  hashClientIp,
  timingSafeEqual,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not set in environment');
      return NextResponse.json(
        { error: 'Błąd konfiguracji serwera' },
        { status: 500 }
      );
    }

    const ip = getClientIp(request);
    const key = hashClientIp(ip);

    // 1. Check rate limit (Convex - no Redis needed)
    const rateCheck = await fetchQuery(api.auth.checkLoginAllowed, { key });
    if (!rateCheck.allowed) {
      const mins = rateCheck.lockoutUntil
        ? Math.ceil((rateCheck.lockoutUntil - Date.now()) / 60000)
        : 15;
      return NextResponse.json(
        {
          error: `Zbyt wiele prób. Spróbuj ponownie za ${mins} minut.`,
        },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const submitted = typeof password === 'string' ? password : '';

    // 2. Timing-safe password check
    if (!timingSafeEqual(submitted, adminPassword)) {
      await fetchMutation(api.auth.recordFailedLoginAttempt, { key });
      return NextResponse.json(
        { error: 'Nieprawidłowe hasło' },
        { status: 401 }
      );
    }

    // 3. Success: clear rate limit, issue JWT
    await fetchMutation(api.auth.clearLoginAttempts, { key });
    const token = await createAdminSession();

    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
