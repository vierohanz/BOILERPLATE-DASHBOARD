import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('sigasi_token'));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('sigasi_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('sigasi_token');
    setIsAuthenticated(!!token);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    checkAuth
  };
};
