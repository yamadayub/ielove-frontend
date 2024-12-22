import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const baseURL = import.meta.env.VITE_APP_BACKEND_URL;

// 基本のaxiosインスタンス
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証付きのaxiosインスタンスを取得するカスタムフック
export const useAuthenticatedAxios = () => {
  const { getToken } = useAuth();

  // リクエストインターセプターを設定
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return Promise.reject(error);
    }
  });

  return axiosInstance;
};

// デフォルトエクスポートを追加
export default axiosInstance;