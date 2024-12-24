import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL.replace(/\/+$/, '');

interface UserData {
  clerk_user_id: string;
  email: string;
  name: string;
  user_type: 'individual' | 'business';
  role: string;
  is_active: boolean;
}

export const InitialUserSetup: React.FC = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const userData: UserData = {
      clerk_user_id: userId!,
      email: user?.primaryEmailAddress?.emailAddress || '',
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      user_type: 'individual',
      role: 'buyer',
      is_active: true
    };

    try {
      await axios.post(`${API_URL}/api/users`, userData);
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to create user profile:', error);
      if (error.response) {
        setError(`ユーザー作成に失敗しました: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        setError('サーバーに接続できませんでした。');
      } else {
        setError('ユーザー作成に失敗しました。');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">アカウント情報の確認</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={user?.primaryEmailAddress?.emailAddress || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ユーザー名
          </label>
          <input
            type="text"
            value={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          アカウントを作成
        </button>
      </form>
    </div>
  );
}; 