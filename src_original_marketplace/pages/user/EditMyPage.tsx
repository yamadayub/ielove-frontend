import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';

export const EditMyPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: userProfile, refetch } = useUser(userId);
  const axios = useAuthenticatedAxios();
  const [name, setName] = useState(userProfile?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !name.trim() || !userProfile?.id) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.patch(`/api/users/me?user_id=${userProfile.clerk_user_id}`, {
        name: name.trim(),
        email: userProfile.email,
        user_type: userProfile.user_type,
      });

      // ユーザー情報を再取得
      await refetch();
      
      // マイページに戻る
      navigate('/mypage');
    } catch (error) {
      console.error('ユーザー情報の更新に失敗しました:', error);
      setError('ユーザー情報の更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg">プロフィール編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl">プロフィール編集</h1>
      </div>

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              ユーザー名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              required
            />
          </div>

          <div className="sticky bottom-0 bg-white p-4 -mx-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? '更新中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 