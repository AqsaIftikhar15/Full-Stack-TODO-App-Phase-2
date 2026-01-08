'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '../lib/types';
import { authManager } from '../lib/auth';
import { apiClient } from '../lib/api';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authManager.isAuthenticated() && !authManager.isTokenExpired()) {
          // Get user from storage or fetch from API if needed
          const currentUser = authManager.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login({ email, password });

      // Store token and user
      authManager.setToken(response.token);
      authManager.setCurrentUser(response.user);

      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.signup({ email, password, name });

      // Store token and user
      authManager.setToken(response.token);
      authManager.setCurrentUser(response.user);

      setUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Clear auth state
    authManager.logout();
    setUser(null);
  }, []);

  const isAuthenticated = authManager.isAuthenticated() && !authManager.isTokenExpired();

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated,
  };
};