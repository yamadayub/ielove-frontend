import axios from 'axios';
import { ApiResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string): Promise<ApiResponse<T>> => api.get(url),
  post: <T>(url: string, data: unknown): Promise<ApiResponse<T>> => api.post(url, data),
  put: <T>(url: string, data: unknown): Promise<ApiResponse<T>> => api.put(url, data),
  delete: <T>(url: string): Promise<ApiResponse<T>> => api.delete(url),
};