import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, verifyAdminToken, adminLogout, getCurrentAdmin, isAuthenticated, getStoredUser } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if token exists
      if (isAuthenticated()) {
        // Try to get user from storage first
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Verify token with backend
        try {
          const userData = await verifyAdminToken();
          setUser(userData.user || userData);
        } catch (error) {
          // Token invalid, clear everything
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await adminLogin(email, password);
      // Response structure: { user: {...}, accessToken: "...", refreshToken: "..." }
      const userData = response.user || response;
      setUser(userData);
      return { success: true, data: response };
    } catch (error) {
      // Backend error structure: { success: false, message: "..." } or axios error
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Use window.location for navigation since we're outside Router context
      window.location.href = '/Login';
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUser: async () => {
      try {
        const userData = await getCurrentAdmin();
        setUser(userData.user || userData);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
