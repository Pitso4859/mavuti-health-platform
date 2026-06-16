/**
 * Axios-free API client using native fetch.
 * All requests to /api/v1/* automatically attach the JWT Bearer token.
 * Handles 401 (token expired) by clearing auth state.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

function getToken() {
  return localStorage.getItem('mvt_token');
}

async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    // 401 = expired / invalid token — clear and redirect
    if (res.status === 401) {
      localStorage.removeItem('mvt_token');
      localStorage.removeItem('mvt_user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    const message =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : `Request failed (${res.status})`);
    throw new Error(message);
  }

  return data;
}

const api = {
  get:    (path, opts)   => request(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT',  body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts)   => request(path, { ...opts, method: 'DELETE' }),
};

export default api;
