import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const apiService = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sigasi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Logic to logout or refresh token
      console.error('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiService;
