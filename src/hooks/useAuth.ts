import { useAuthStore } from '@/stores';

export const useAuth = () => {
  const { isAuthenticated, user, checkAuth, logout } = useAuthStore();

  return {
    isAuthenticated,
    user,
    checkAuth,
    logout,
  };
};
