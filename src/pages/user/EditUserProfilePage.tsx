import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { UserProfileForm } from '../../features/user/components/UserProfileForm';
import { StripeConnect } from '../../features/seller/components/StripeConnect';
import { useSellerProfile, useStripeStatus } from '../../features/seller/hooks/useSeller';
import { Loader2 } from 'lucide-react';
import type { User } from '../../features/user/types/user_types';
import { AxiosError } from 'axios';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';

export const EditUserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const axios = useAuthenticatedAxios();
  const { data: userProfile, isLoading: isLoadingUser } = useUser(userId);
  const { data: sellerProfile, isLoading: isLoadingProfile } = useSellerProfile(userProfile?.id);
  const { data: stripeStatus, isLoading: isLoadingStripe } = useStripeStatus(
    userProfile?.id,
    sellerProfile?.stripe_account_id
  );

  const handleUserSubmit = async (formData: Partial<User>) => {
    try {
      await axios.patch(ENDPOINTS.USER.UPDATE_ME, formData);
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      if (error instanceof AxiosError && error.response?.data) {
        setError(`プロフィールの更新に失敗しました: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        setError('プロフィールの更新に失敗しました。もう一度お試しください。');
      }
    }
  };

  if (isLoadingUser || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
        <p className="mt-2 text-sm text-gray-600">
          ユーザー情報を編集できます
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* ユーザープロフィールフォーム */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
        <UserProfileForm 
          initialData={userProfile} 
          onSubmit={handleUserSubmit}
        />
      </div>

      {/* 出品者設定 */}
      {userProfile?.role !== 'buyer' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">出品者情報</h2>
          <StripeConnect 
            userId={userProfile.id}
            stripeAccountId={sellerProfile?.stripe_account_id ?? null}
            accountStatus={sellerProfile?.stripe_account_status ?? null}
            onboardingCompleted={sellerProfile?.stripe_onboarding_completed ?? false}
            isLoading={isLoadingStripe}
          />
        </div>
      )}
    </div>
  );
}; 