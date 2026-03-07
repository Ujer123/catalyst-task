import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  if (!res.ok) return NextResponse.json({ error: data.message }, { status: 401 });

  const token = data.token || data.accessToken;
  if (!token || typeof token !== 'string' || token.length === 0) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 502 });
  }

  const userRes = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const userData = userRes.ok ? await userRes.json() : null;

  const response = NextResponse.json({ 
    success: true,
    user: userData
  });
  response.cookies.set('dummy_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
