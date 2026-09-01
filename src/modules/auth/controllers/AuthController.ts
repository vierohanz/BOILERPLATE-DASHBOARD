import { useState } from 'react';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/stores';

export const useAuthController = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = {
        token: 'mock_token_for_boilerplate',
        user: {
          name: 'Admin User',
          email: credentials.email,
          role: 'admin',
        },
      };

      setAuth(response.user, response.token);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your email and password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      return await authService.register(userData);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutStore();
    window.location.href = '/login';
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};
