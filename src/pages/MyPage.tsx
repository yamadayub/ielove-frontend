import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUserProfile } from '../api/queries/useUser';
import { UserProfile } from '../components/mypage/UserProfile';
import { InitialUserSetup } from '../components/mypage/InitialUserSetup';
import axios from 'axios';

export const MyPage = () => {
  const { userId } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return <InitialUserSetup />;
  }

  if (error) {
    console.error('Failed to load user profile:', error);
    return <div>ユーザー情報の取得に失敗しました</div>;
  }

  if (!userProfile) {
    return <InitialUserSetup />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">マイページ</h1>
      <div className="space-y-8">
        <UserProfile user={userProfile} />
        {/* 他のコンポーネント */}
      </div>
    </div>
  );
};