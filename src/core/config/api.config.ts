export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      ME: '/me',
    },
    DASHBOARD: '/dashboard',
    MEMBERS: '/members',
    PROJECTS: '/projects',
    SYSTEM: {
      STATS: '/system/stats',
      LOGS: '/system/logs',
    },
  },

  TIMEOUT: 10000,
};
