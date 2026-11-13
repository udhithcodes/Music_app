import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [backendHealth, setBackendHealth] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Check backend health periodically
  const checkHealth = useCallback(async () => {
    const health = await authAPI.getHealth();
    setBackendHealth(health.status === 'online' ? 'online' : 'offline');
  }, []);

  // Fetch current user if token exists
  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const profile = await authAPI.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Failed to load profile:', err);
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    refreshProfile();

    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth, refreshProfile]);

  const login = async (username_or_email, password) => {
    const res = await authAPI.login({ username_or_email, password });
    if (res.access_token) {
      localStorage.setItem('token', res.access_token);
      setToken(res.access_token);
      const profile = await authAPI.getProfile();
      setUser(profile);
      setAuthModalOpen(false);
      return profile;
    }
    throw new Error('No access token returned');
  };

  const register = async ({ username, email, password, role }) => {
    const newUser = await authAPI.register({ username, email, password, role });
    // After registration, auto-login the user
    try {
      await login(username, password);
    } catch {
      // If auto-login fails, switch modal to login
      setAuthModalMode('login');
    }
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    role: user?.role || 'GUEST',
    isAdmin: user?.role === 'ADMIN',
    isCreator: user?.role === 'CREATOR' || user?.role === 'ADMIN',
    loading,
    backendHealth,
    checkHealth,
    refreshProfile,
    login,
    register,
    logout,
    isAuthModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

