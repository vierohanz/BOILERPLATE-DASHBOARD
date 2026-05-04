import { useState } from 'react';
import { authService } from '../services/auth.service';
import Cookies from 'js-cookie';

export const useAuthController = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = {
        token: 'mock_token_for_boilerplate',
        user: {
          name: 'Admin User',
          email: credentials.email,
          role: 'admin'
        }
      };
      
      // Store token and user in cookies (set expires to 7 days or as needed)
      Cookies.set('app_token', response.token, { expires: 7 });
      Cookies.set('app_user', JSON.stringify(response.user), { expires: 7 });
      
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
    Cookies.remove('app_token');
    Cookies.remove('app_user');
    window.location.href = '/login'; 
  };

  return {
    login,
    register,
    logout,
    loading,
    error
  };
};
