import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('nexuspay_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
      setWallet(data.wallet);
    } catch {
      localStorage.removeItem('nexuspay_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    if (data.requires2FA) return { requires2FA: true, tempToken: data.tempToken };
    localStorage.setItem('nexuspay_token', data.token);
    await loadUser();
    return { success: true };
  };

  const register = async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem('nexuspay_token', data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('nexuspay_token');
    setUser(null);
    setWallet(null);
  };

  const updateWallet = (updatedWallet) => {
    setWallet((prev) => ({ ...prev, ...updatedWallet }));
  };

  const refreshUser = loadUser;

  return (
    <AuthContext.Provider value={{ user, wallet, loading, login, register, logout, updateWallet, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};