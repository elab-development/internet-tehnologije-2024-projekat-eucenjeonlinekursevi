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
  if (!res.ok)
    throw new Error(json?.message || `Request failed (${res.status})`);
  return json;
}

export const api = {
  // auth
  me: () => request('/api/auth/me'),
  login: (data) => request('/api/auth/login', { method: 'POST', body: data }),
  register: (data) =>
    request('/api/auth/register', { method: 'POST', body: data }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  // courses
  courses: {
    list: ({ page = 1, limit = 10, q = '', all = true } = {}) =>
      request(
        `/api/courses?page=${page}&limit=${limit}&all=${all ? '1' : '0'}${
          q ? `&q=${encodeURIComponent(q)}` : ''
        }`
      ),
    get: (id) => request(`/api/courses/${id}`),
    create: (data) => request('/api/courses', { method: 'POST', body: data }),
    update: (id, data) =>
      request(`/api/courses/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/api/courses/${id}`, { method: 'DELETE' }),

    // uploads (multipart/form-data)
    uploadResources: async (id, files) => {
      const form = new FormData();
      [...files].forEach((f) => form.append('files', f));
      const res = await fetch(`${API_URL}/api/courses/${id}/resources`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(json?.message || `Upload failed (${res.status})`);
      return json;
    },
    removeResource: (id, url) =>
      request(`/api/courses/${id}/resources`, {
        method: 'DELETE',
        body: { url },
      }),
  },
};