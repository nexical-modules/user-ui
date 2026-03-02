import type { APIContext } from 'astro';
import type { Session } from '@auth/core/types';
import { config } from '@/lib/core/config';

export async function getSession(request: Request, context?: APIContext): Promise<Session | null> {
  const url = new URL(request.url);
  const isAuthRoute = url.pathname.startsWith('/api/auth');

  // Skip if we're on an auth route
  if (isAuthRoute) return null;

  try {
    // Build the backend session URL - resolve localhost to IPv4 to avoid Node.js IPv6 prioritization
    const rawUrl = `${config.PUBLIC_API_URL}/auth/session`;
    const fetchUrl = rawUrl.replace('//localhost:', '//127.0.0.1:');

    // *** CRITICAL FIX ***
    // The Cloudflare workerd runtime strips raw Cookie headers from incoming requests.
    // We MUST use Astro's context.cookies API to read cookies, then rebuild the header.
    let cookieString = '';
    if (context) {
      // Rebuild cookie string from Astro's parsed cookie store (works in all runtimes)
      const cookieEntries: string[] = [];
      // Look up all known Auth.js cookie names
      const authCookieNames = [
        'authjs.session-token',
        '__Secure-authjs.session-token',
        'authjs.csrf-token',
        'authjs.callback-url',
      ];
      for (const name of authCookieNames) {
        const cookie = context.cookies.get(name);
        if (cookie) {
          console.log(`[getSession] Found Astro cookie: ${name}`);
          cookieEntries.push(`${name}=${cookie.value}`);
        }
      }
      cookieString = cookieEntries.join('; ');
    }

    // Fallback: try raw request header (works in Node.js adapter)
    if (!cookieString) {
      cookieString = request.headers.get('cookie') || request.headers.get('Cookie') || '';
      if (cookieString)
        console.log(`[getSession] Found raw request cookies, length: ${cookieString.length}`);
    }

    console.log(
      `[getSession] Fetching ${fetchUrl}, cookieString length: ${cookieString.length}, has session token: ${cookieString.includes('authjs.session-token') || cookieString.includes('__Secure-authjs.session-token')}`,
    );

    if (!cookieString) {
      console.log('[getSession] No cookies available - skipping fetch');
      return null;
    }

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        cookie: cookieString,
      },
    });

    if (!response.ok) {
      console.error(
        `[getSession] Backend responded with ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const sessionText = await response.text();
    console.log(`[getSession] Raw session text length: ${sessionText.length}`);

    if (!sessionText) return null;

    const session = JSON.parse(sessionText);

    if (!session || Object.keys(session).length === 0) {
      console.log('[getSession] Session object is empty or null');
      return null;
    }

    console.log(
      `[getSession] Successfully parsed session for: ${session.user?.email || 'unknown'}`,
    );
    return session as Session;
  } catch (error) {
    console.error('[getSession] Failed to fetch session from backend (network/json error):', error);
    return null;
  }
}
