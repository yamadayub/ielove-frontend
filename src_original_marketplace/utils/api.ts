import axios from 'axios';
import { ApiResponse } from '../types';

// バックエンドURLの末尾のスラッシュを正規化
const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

export const axiosInstance = axios.create({
  baseURL: normalizeUrl(import.meta.env.VITE_APP_BACKEND_URL),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // URLの二重スラッシュを防ぐ
    if (config.url) {
      config.url = config.url.replace(/([^:]\/)\/+/g, '$1');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string): Promise<ApiResponse<T>> => axiosInstance.get(url),
  post: <T>(url: string, data: unknown): Promise<ApiResponse<T>> => axiosInstance.post(url, data),
  put: <T>(url: string, data: unknown): Promise<ApiResponse<T>> => axiosInstance.put(url, data),
  delete: <T>(url: string): Promise<ApiResponse<T>> => axiosInstance.delete(url),
};