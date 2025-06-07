import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useMemo } from 'react';

// 環境に応じたベースURLを設定
// 本番環境では正しいAPIのURLを設定する
// 開発環境では現在のプロキシパスを使用する
// const baseURL = import.meta.env.VITE_API_BASE_URL || '';
const baseURL = window.location.origin;

// 注意: ベースURLが空の場合は、同じオリジンに対してリクエストが送信される
// デプロイ時には適切なURLに変更する必要がある

// 認証が必要なエンドポイントのパターンを定義
const AUTH_REQUIRED_PATTERNS = [
  // ユーザーステップ関連
  '/sugoroku/steps/user/',
  // いいね関連
  '/sugoroku/steps/user/liked',
  '/sugoroku/steps/*/like',
  '/sugoroku/steps/*/unlike',
  // チャット関連
  '/sugoroku/chats',
];

// エンドポイントが認証を必要とするかチェック
const isAuthRequired = (path: string): boolean => {
  return AUTH_REQUIRED_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '[^/]+');
      return new RegExp(regexPattern).test(path);
    }
    return path.startsWith(pattern);
  });
};

// 基本のaxiosインスタンス（認証不要なエンドポイント用）
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// レスポンスインターセプター（デバッグ用）
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('APIレスポンス:', response.config.url, response.data);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('認証エラー：ログインが必要です', error.config?.url);
      } else {
        console.error(
          `APIエラー (${error.response.status}):`, 
          error.config?.url, 
          error.response.data
        );
      }
    } else {
      console.error('ネットワークエラー:', error);
    }
    return Promise.reject(error);
  }
);

// 認証付きのaxiosインスタンスを取得するカスタムフック
export const useAuthenticatedAxios = () => {
  const { user } = useUser();

  return useMemo(() => {
    const api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // リクエストインターセプター
    api.interceptors.request.use(async (config) => {
      if (user?.id) {
        config.headers['x-clerk-user-id'] = user.id;
      }
      return config;
    });

    // レスポンスインターセプター（デバッグ用）
    api.interceptors.response.use(
      (response) => {
        console.log('APIレスポンス:', response.config.url, response.data);
        return response;
      },
      (error) => {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            console.error('認証エラー：ログインが必要です', error.config?.url);
          } else {
            console.error(
              `APIエラー (${error.response.status}):`, 
              error.config?.url, 
              error.response.data
            );
          }
        } else {
          console.error('ネットワークエラー:', error);
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [user]);
};

// Clerkのユーザー情報を保存する関数（後方互換性のため残す）
export const setClerkUser = (userId: string) => {
  localStorage.setItem('clerkUserId', userId);
};

// Clerkのユーザー情報をクリアする関数（後方互換性のため残す）
export const clearClerkUser = () => {
  localStorage.removeItem('clerkUserId');
};

// デフォルトエクスポート
export default axiosInstance; 