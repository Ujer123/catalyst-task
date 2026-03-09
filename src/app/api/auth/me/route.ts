import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/config';

async function getJsonData(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  let token = cookieStore.get('dummy_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok && response.status === 401) {
    const refreshResponse = await fetch(`/api/auth/refresh`, {
      method: 'POST',
      headers: { 
        Cookie: cookieStore.getAll()
          .map(c => `${c.name}=${encodeURIComponent(c.value)}`)
          .join('; ')
      }
    });

    if (refreshResponse.ok) {
      const newCookieHeader = refreshResponse.headers.get('set-cookie');
      if (newCookieHeader) {
        const newTokenMatch = newCookieHeader.match(/dummy_token=([^;]+)/);
        if (newTokenMatch) {
          token = newTokenMatch[1];
          response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
    }
  }

  if (!response.ok) {
    const errorRes = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    errorRes.cookies.delete('dummy_token');
    return errorRes;
  }

  const userData = await getJsonData(response);
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(userData);
}
