import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data.user;
      setUser({
        ...userData,
        username: userData.username || userData.name || 'User',
        avatar: userData.avatar || ''
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const userData = response.data.user;
    setUser({
      ...userData,
      username: userData.username || userData.name || 'User',
      avatar: userData.avatar || ''
    });
    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const user = response.data.user;
    setUser({
      ...user,
      username: user.username || user.name || 'User',
      avatar: user.avatar || ''
    });
    return response.data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const googleLogin = () => {
    authAPI.googleLogin();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};