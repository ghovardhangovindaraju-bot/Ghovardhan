import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'erp_session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'WAC-Private-2026';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: 'active',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 },
    );
  }
}
