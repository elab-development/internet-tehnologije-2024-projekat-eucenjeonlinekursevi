const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const ct = res.headers.get('content-type') || '';
  const json = ct.includes('application/json')
    ? await res.json().catch(() => null)
    : null;
  if (!res.ok)
    throw new Error(json?.message || `Request failed (${res.status})`);
  return json;
}

export const api = {
  me: () => request('/api/auth/me'),
  login: (d) => request('/api/auth/login', { method: 'POST', body: d }),
  register: (d) => request('/api/auth/register', { method: 'POST', body: d }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  courses: {
    list: ({ page = 1, limit = 10, q = '', all = true } = {}) =>
      request(
        `/api/courses?page=${page}&limit=${limit}&all=${all ? '1' : '0'}${
          q ? `&q=${encodeURIComponent(q)}` : ''
        }`
      ),
    get: (id) => request(`/api/courses/${id}`),
    create: (d) => request('/api/courses', { method: 'POST', body: d }),
    update: (id, d) =>
      request(`/api/courses/${id}`, { method: 'PUT', body: d }),
    remove: (id) => request(`/api/courses/${id}`, { method: 'DELETE' }),

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

  tests: {
    listByCourse: ({ courseId, page = 1, limit = 50, all = true }) =>
      request(
        `/api/tests?course=${courseId}&page=${page}&limit=${limit}&all=${
          all ? '1' : '0'
        }`
      ),
    get: (id, { withAnswers = true } = {}) =>
      request(`/api/tests/${id}${withAnswers ? '?withAnswers=1' : ''}`),
    create: (d) => request('/api/tests', { method: 'POST', body: d }),
    update: (id, d) => request(`/api/tests/${id}`, { method: 'PUT', body: d }),
    remove: (id) => request(`/api/tests/${id}`, { method: 'DELETE' }),
  },
};