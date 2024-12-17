import React from 'react';
import { useStore } from '../store/useStore';
import { UserProfile } from '../components/mypage/UserProfile';
import { PurchaseHistoryList } from '../components/mypage/PurchaseHistoryList';

export const MyPage = () => {
  const user = useStore((state) => state.user);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">マイページ</h1>
      <div className="space-y-8">
        <UserProfile user={user} />
        <PurchaseHistoryList purchaseHistory={user.purchaseHistory} />
      </div>
    </div>
  );
};