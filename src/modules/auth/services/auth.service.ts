import apiService from '../../../core/services/api.service';
import { API_CONFIG } from '../../../core/config/api.config';

export const authService = {
  login: async (credentials: any) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData: any) => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: async () => {
    return apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  },

  getCurrentUser: async () => {
    return apiService.get(API_CONFIG.ENDPOINTS.AUTH.ME);
  }
};
