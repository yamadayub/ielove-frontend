import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Property } from '../../features/property/types/property_types';
import { useUser } from '../../features/user/hooks/useUser';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { PropertyForm } from '../../features/property/components/PropertyForm';
import { AxiosError } from 'axios';

interface ApiError {
  status_code: number;
  detail: string;
}

export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: userProfile } = useUser(userId);
  const axios = useAuthenticatedAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">認証情報が見つかりません</p>
      </div>
    );
  }

  const handleSubmit = async (formData: Property) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    console.log('送信するデータ:', {
      ...formData,
      user_id: userProfile.id,
    });

    try {
      const response = await axios.post<Property>(
        '/api/properties',
        {
          ...formData,
          user_id: userProfile.id,
        },
        {
          headers: {
            'X-Clerk-User-Id': userId,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate(`/property/${response.data.id}/edit`);
    } catch (error) {
      console.error('物件の作成に失敗しました:', error);
      if (error instanceof AxiosError) {
        if (error.response?.data) {
          const apiError = error.response.data as ApiError;
          setError(`物件の作成に失敗しました: ${apiError.detail || '不明なエラーが発生しました'}`);
          console.error('APIエラーの詳細:', error.response.data);
        } else if (error.code === 'ERR_NETWORK') {
          setError('ネットワークエラー: サーバーに接続できません。インターネット接続を確認してください。');
        } else {
          setError(`エラー: ${error.message}`);
        }
        console.error('詳細なエラー情報:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data
        });
      } else {
        setError('物件の作成に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">新規物件登録</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">新規物件登録</h1>
      </div>

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:shadow-sm md:my-8">
        <PropertyForm 
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          userId={userProfile.id}
          submitButtonText="登録する"
          clerkUserId={userId}
        />
      </div>
    </div>
  );
};