import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await api.me();
        if (isMounted) setUser(data.user ?? null);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setInitializing(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}