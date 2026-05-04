import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('app_token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = Cookies.get('app_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user from cookies', e);
      }
    }
  }, []);

  const checkAuth = () => {
    const token = Cookies.get('app_token');
    setIsAuthenticated(!!token);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    checkAuth
  };
};
