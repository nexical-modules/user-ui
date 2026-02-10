const AUTH_API_URL = (import.meta.env.PUBLIC_API_URL || 'http://localhost:4321') + '/api/auth';

export async function getCsrfToken() {
  try {
    const res = await fetch(`${AUTH_API_URL}/csrf`, { credentials: 'omit' }); // CSRF endpoint is usually public/no-cookie needed for initial
    const data = await res.json();
    return data.csrfToken;
  } catch (e) {
    console.error('Failed to fetch CSRF token', e);
    return null;
  }
}

export async function signIn(provider: string, options: Record<string, unknown>) {
  if (provider === 'credentials') {
    const csrfToken = await getCsrfToken();
    if (!csrfToken) throw new Error('CSRF Token missing');

    const formData = new URLSearchParams();
    formData.append('csrfToken', csrfToken);
    formData.append('email', (options.identifier || options.email) as string);
    formData.append('password', options.password as string);
    formData.append('callbackUrl', (options.callbackUrl as string) || window.location.href);
    formData.append('json', 'true');

    const res = await fetch(`${AUTH_API_URL}/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include', // Important for receiving the cookie
    });

    const data = await res.json();

    if (res.ok) {
      // Success, usually redirects. Since we passed json=true, we get url.
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.reload();
      }
      return { ok: true, ...data };
    } else {
      throw new Error(data.message || 'Login failed');
    }
  }
  // Handle other providers (GitHub etc) -> Redirect to backend endpoint
  if (provider === 'github') {
    const csrfToken = await getCsrfToken();
    // CSRF is needed for the signin POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${AUTH_API_URL}/signin/${provider}`;

    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrfToken';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    const callbackInput = document.createElement('input');
    callbackInput.type = 'hidden';
    callbackInput.name = 'callbackUrl';
    callbackInput.value = (options.callbackUrl as string) || window.location.href;
    form.appendChild(callbackInput);

    document.body.appendChild(form);
    form.submit();
  }
}

export async function signOut() {
  const csrfToken = await getCsrfToken();
  if (!csrfToken) return;

  await fetch(`${AUTH_API_URL}/signout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ csrfToken, callbackUrl: window.location.href, json: 'true' }),
    credentials: 'include',
  });
  window.location.reload();
}

export async function getSession() {
  try {
    const res = await fetch(`${AUTH_API_URL}/session`, { credentials: 'include' });
    if (res.ok) {
      const session = await res.json();
      if (Object.keys(session).length === 0) return null; // Auth.js returns empty object if no session
      return session;
    }
  } catch {
    return null;
  }
  return null;
}
