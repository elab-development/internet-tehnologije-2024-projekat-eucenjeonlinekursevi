const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const json = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    const message = json?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

export const api = {
  me: () => request('/api/auth/me'),
  login: (data) => request('/api/auth/login', { method: 'POST', body: data }),
  register: (data) =>
    request('/api/auth/register', { method: 'POST', body: data }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
};