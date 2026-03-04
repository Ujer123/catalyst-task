import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/login' || 
    pathname === '/' ||  // Allow home page without auth
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('dummy_token')?.value;
  
  if (!token) {
    return redirectToLogin(request, pathname);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const cookieHeader = request.cookies.toString();
    
    const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      headers: { 
        Cookie: cookieHeader,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'POST',
        headers: { Cookie: cookieHeader },
      });
      
      if (refreshResponse.ok) {
        const newCookieHeader = refreshResponse.headers.get('set-cookie');
        if (newCookieHeader) {
          const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
            headers: { Cookie: newCookieHeader },
            signal: controller.signal,
          });
          
          if (response.ok) {
            const response2 = NextResponse.next();
            response2.headers.set('set-cookie', newCookieHeader);
            return response2;
          }
        }
      }
      return redirectToLogin(request, pathname);
    }
  } catch {
    return redirectToLogin(request, pathname);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
