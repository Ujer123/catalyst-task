import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  if (!res.ok) return NextResponse.json({ error: data.message }, { status: 401 });

  const token = data.token || data.accessToken;
  if (!token || typeof token !== 'string' || token.length === 0) {
    return NextResponse.json({ error: 'Invalid token from provider' }, { status: 502 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('dummy_token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
