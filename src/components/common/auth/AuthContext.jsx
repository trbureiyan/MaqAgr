import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../../lib/apiClient';

const REMOTE_AUTH_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_AUTH_API === 'true';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const readStoredUser = () => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser || storedUser === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

/**
 * Proveedor global de autenticacion con soporte dual Remote/Mock.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const clearSession = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }, []);

  const persistSession = useCallback((nextUser, token) => {
    if (!token || !nextUser) {
      throw new Error('La respuesta de autenticacion no incluyo token o usuario.');
    }

    setIsAuthenticated(true);
    setUser(nextUser);

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem('token', token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = readStoredUser();

    if (storedAuth && token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    } else if (storedAuth || token || storedUser) {
      clearSession();
    }

    const handleUnauthorized = () => {
      clearSession();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [clearSession]);

  const login = async (credentials) => {
    const normalizedCredentials = {
      email: credentials?.email?.trim(),
      password: credentials?.password ?? '',
    };

    if (REMOTE_AUTH_API_ENABLED) {
      const response = await apiClient('/api/auth/login', {
        method: 'POST',
        body: normalizedCredentials,
      });

      const payload = response?.data ?? response;
      const token = payload?.token ?? payload?.accessToken;
      const rawUser = payload?.user ?? payload?.account ?? null;

      // El backend coloca role y role_id en el RAÍZ del payload (no dentro de user).
      // Los fusionamos en authUser para que ProtectedRoute pueda verificar el rol.
      const authUser = rawUser
        ? {
            ...rawUser,
            role: payload?.role ?? rawUser?.role ?? null,
            roleId: payload?.roleId ?? payload?.role_id ?? rawUser?.roleId ?? rawUser?.role_id ?? null,
          }
        : null;

      persistSession(authUser, token);
      return payload;
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    const email = normalizedCredentials.email || 'usuario@maqagr.local';
    const mockUser = {
      id: `mock-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
    };

    persistSession(mockUser, 'mock-token');

    return {
      success: true,
      data: {
        token: 'mock-token',
        user: mockUser,
      },
    };
  };

  const register = async (registerData) => {
    const payload = {
      name: registerData?.name?.trim(),
      email: registerData?.email?.trim(),
      password: registerData?.password ?? '',
      role: registerData?.role ?? 'user',
    };

    if (REMOTE_AUTH_API_ENABLED) {
      return apiClient('/api/auth/register', {
        method: 'POST',
        body: payload,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      success: true,
      data: {
        id: `mock-${Date.now()}`,
        ...payload,
      },
    };
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};