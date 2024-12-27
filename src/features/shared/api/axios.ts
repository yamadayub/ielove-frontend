import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';

const baseURL = import.meta.env.VITE_APP_BACKEND_URL;

// 基本のaxiosインスタンス
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証付きのaxiosインスタンスを取得するカスタムフック
export const useAuthenticatedAxios = (): AxiosInstance => {
  const { getToken, userId } = useAuth();

  // インターセプターの参照を保持
  const interceptorId = axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // GETリクエストの場合は認証ヘッダーを付けない
        if (config.method?.toLowerCase() === 'get') {
          return config;
        }

        const token = await getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          // x-clerk-user-idヘッダーを追加
          if (userId) {
            config.headers['x-clerk-user-id'] = userId;
          }
        }
        return config;
      } catch (error) {
        console.error('Failed to get auth token:', error);
        return Promise.reject(error);
      }
    },
    (error) => Promise.reject(error)
  );

  // クリーンアップ関数
  useEffect(() => {
    return () => {
      axiosInstance.interceptors.request.eject(interceptorId);
    };
  }, [interceptorId]);

  return axiosInstance;
};

// デフォルトエクスポートを追加
export default axiosInstance;