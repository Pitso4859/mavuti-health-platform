import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/services';

const AuthContext = createContext(null);

const TOKEN_KEY = 'mvt_token';
const USER_KEY  = 'mvt_user';

function readStored() {
  try {
    const user  = JSON.parse(localStorage.getItem(USER_KEY));
    const token = localStorage.getItem(TOKEN_KEY);
    if (user && token) return { user, token };
  } catch { /* ignore */ }
  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const stored = readStored();
  const [user,  setUser]  = useState(stored.user);
  const [token, setToken] = useState(stored.token);

  // Listen for token-expired events dispatched by the API client
  useEffect(() => {
    const handler = () => { setUser(null); setToken(null); };
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const persist = useCallback((authResp) => {
    localStorage.setItem(TOKEN_KEY, authResp.token);
    localStorage.setItem(USER_KEY,  JSON.stringify(authResp));
    setToken(authResp.token);
    setUser(authResp);
  }, []);

  const login = useCallback(async (institutionNumber, password, expectedRole) => {
    const resp = await authApi.login({ institutionNumber, password, expectedRole });
    persist(resp);
    return resp;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const resp = await authApi.register(payload);
    persist(resp);
    return resp;
  }, [persist]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const isStaff = user?.role === 'EMPLOYEE' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  const value = useMemo(() => ({
    user, token, isStaff, isAdmin, login, register, logout,
    isAuthenticated: !!user,
  }), [user, token, isStaff, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
