import { useState } from 'react';
import { authService } from '../services/auth.service';

export const useAuthController = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = {
        token: 'mock_token_for_sigasi',
        user: {
          name: 'Dinas Kesehatan',
          email: credentials.email,
          role: 'admin'
        }
      };
      
      localStorage.setItem('sigasi_token', response.token);
      localStorage.setItem('sigasi_user', JSON.stringify(response.user));
      
      return response;
    } catch (err: any) {
      setError(err?.message || 'Login gagal. Periksa kembali email dan password Anda.');
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
      setError(err?.message || 'Registrasi gagal.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sigasi_token');
    localStorage.removeItem('sigasi_user');
    window.location.href = '/login'; // Redirect ke login
  };

  return {
    login,
    register,
    logout,
    loading,
    error
  };
};
