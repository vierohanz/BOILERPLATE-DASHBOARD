import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import Cookies from 'js-cookie';

const apiService = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = Cookies.get('app_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiService;
