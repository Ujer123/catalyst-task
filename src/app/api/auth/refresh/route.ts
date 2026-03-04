import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dummy_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    const response = NextResponse.json({ error: data?.message || 'Unauthorized' }, { status: 401 });
    response.cookies.delete('dummy_token');
    return response;
  }

  const newToken = data.token || data.accessToken;
  if (!newToken || typeof newToken !== 'string' || newToken.length === 0) {
    const response = NextResponse.json({ error: 'Invalid token from provider' }, { status: 502 });
    response.cookies.delete('dummy_token');
    return response;
  }

  const response = NextResponse.json({ success: true, token: newToken });
  response.cookies.set('dummy_token', newToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
