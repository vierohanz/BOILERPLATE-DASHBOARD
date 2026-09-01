import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id?: string | number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const getInitialUser = (): User | null => {
  const stored = Cookies.get('app_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const initialToken = Cookies.get('app_token') || null;

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  setAuth: (user: User, token: string) => {
    Cookies.set('app_token', token, { expires: 7 });
    Cookies.set('app_user', JSON.stringify(user), { expires: 7 });
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove('app_token');
    Cookies.remove('app_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = Cookies.get('app_token');
    const isValid = Boolean(token);
    set({ isAuthenticated: isValid });
    return isValid;
  },
}));
