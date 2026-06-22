/**
 * Axios-free API client using native fetch.
 * All requests to /api/v1/* automatically attach the JWT Bearer token.
 * Handles 401 (token expired/invalid) and 403 (forbidden) by clearing
 * auth state and redirecting to login.
 */

function resolveBase(raw) {
  if (!raw) return 'http://localhost:8080/api/v1';
  const stripped = raw.replace(/\/+$/, '');
  if (stripped.endsWith('/api/v1')) return stripped;
  return `${stripped}/api/v1`;
}

const BASE = resolveBase(import.meta.env.VITE_API_BASE_URL);

function getToken() {
  return localStorage.getItem('mvt_token');
}

async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (!token) {
      // No token at all — dispatch expired event so AuthContext clears state
      window.dispatchEvent(new Event('auth:expired'));
      throw new Error('Session expired. Please log in again.');
    }
    headers['Authorization'] = `Bearer ${token}`;
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
    // 401 = token invalid/expired
    // 403 = token valid but role doesn't have permission
    // Both clear local auth state and force re-login so the user gets a
    // fresh token with the correct role rather than being stuck in a loop.
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('mvt_token');
      localStorage.removeItem('mvt_user');
      window.dispatchEvent(new Event('auth:expired'));
    }

    const message =
      (data?.fieldErrors && Object.values(data.fieldErrors)[0]) ||
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : `Request failed (${res.status})`);
    throw new Error(message);
  }

  return data;
}

const api = {
  get:    (path, opts)       => request(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT',  body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
};

export default api;
