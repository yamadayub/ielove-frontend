import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { UserProfile } from '../../features/user/components/UserProfile';
import { InitialUserSetup } from '../../features/user/components/InitialUserSetup';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

export const MyPage: React.FC = () => {
  const { userId } = useAuth();
  const { data: userProfile, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return <InitialUserSetup />;
    }
    console.error('Failed to load user profile:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          ユーザー情報の取得に失敗しました。<br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
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