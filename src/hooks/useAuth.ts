import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('app_token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('app_token');
    setIsAuthenticated(!!token);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    checkAuth
  };
};
