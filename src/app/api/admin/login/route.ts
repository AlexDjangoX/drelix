import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const COOKIE_NAME = 'drelix-admin-session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not set in environment');
      return NextResponse.json(
        { error: 'Błąd konfiguracji serwera' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: 'Nieprawidłowe hasło' },
        { status: 401 }
      );
    }

    // Create JWT
    const secret = new TextEncoder().encode(adminPassword);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({ success: true });

    // Set HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas logowania' },
      { status: 500 }
    );
  }
}
