import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('voltgrid_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await getMe();
          setUser(profile);
        } catch (err) {
          console.error('[Auth] Failed to restore session:', err.message);
          localStorage.removeItem('voltgrid_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  async function login(email, password) {
    const data = await apiLogin({ email, password });
    localStorage.setItem('voltgrid_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function register(userData) {
    const data = await apiRegister(userData);
    localStorage.setItem('voltgrid_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem('voltgrid_token');
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
