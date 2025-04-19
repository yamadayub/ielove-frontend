import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useMemo } from 'react';

const baseURL = import.meta.env.VITE_APP_BACKEND_URL;

// 認証が必要なエンドポイントのパターン（常に認証必須）
const AUTH_REQUIRED_PATTERNS = [
  '/api/users/me',
  '/api/users/me/seller',
  '/api/sellers',
];

// メソッドに応じて認証が必要なエンドポイントのパターン（GET以外で認証必須）
const METHOD_BASED_AUTH_PATTERNS = [
  '/api/products',                   // 製品の操作（GET以外）
  '/api/products/*',                 // 個別の製品の操作（GET以外）
  '/api/products/*/specifications',  // 製品仕様の編集（GET以外）
  '/api/products/*/dimensions',      // 製品寸法の編集（GET以外）
  '/api/properties',                 // 物件の操作（GET以外）
  '/api/properties/*',               // 個別の物件の操作（GET以外）
  '/api/rooms',                      // 部屋の操作（GET以外）
  '/api/rooms/*',                    // 個別の部屋の操作（GET以外）
  '/api/images',                     // 画像の操作（GET以外）
];

// パスが認証必須かどうかをチェック
const isAuthRequired = (path: string, method: string = 'GET'): boolean => {
  // 常に認証が必要なパターンをチェック
  const isAlwaysAuthRequired = AUTH_REQUIRED_PATTERNS.some(pattern => path.startsWith(pattern));
  if (isAlwaysAuthRequired) return true;

  // メソッドに応じて認証が必要なパターンをチェック
  if (method.toUpperCase() !== 'GET') {
    return METHOD_BASED_AUTH_PATTERNS.some(pattern => {
      if (pattern.includes('*')) {
        const regexPattern = pattern.replace(/\*/g, '[^/]+');
        return new RegExp(regexPattern).test(path);
      }
      return path.startsWith(pattern);
    });
  }

  return false;
};

// 基本のaxiosインスタンス（認証不要なエンドポイント用）
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 認証付きのaxiosインスタンスを取得するカスタムフック
export const useAuthenticatedAxios = () => {
  const { userId, getToken } = useAuth();

  return useMemo(() => {
    const api = axios.create({
      baseURL
    });

    // リクエストインターセプター
    api.interceptors.request.use(async (config) => {
      // 全てのリクエストに認証ヘッダーを追加
      if (userId) {
        config.headers['x-clerk-user-id'] = userId;
        const token = await getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    });

    return api;
  }, [userId, getToken]);
};

// Seller API用の認証付きaxiosインスタンスを取得するカスタムフック
export const useSellerAxios = (): AxiosInstance => {
  const { user } = useUser();

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (config) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Seller関連のエンドポイントは常に認証が必要
    config.headers['x-clerk-user-id'] = user.id;
    return config;
  });

  return instance;
};

// デフォルトエクスポートを追加
export default axiosInstance;

