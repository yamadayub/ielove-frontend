import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useSellerProfile, useUpdateUserProfile, useUpdateSellerProfile, useCreateSellerProfile } from '../../api/queries/useUser';
import { UserProfileForm } from '../../components/mypage/UserProfileForm';
import { SellerProfileForm } from '../../components/mypage/SellerProfileForm';

export const EditUserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading: isLoadingUser } = useUserProfile();
  const { data: sellerProfile, isLoading: isLoadingSeller } = useSellerProfile();
  const { mutate: updateUser } = useUpdateUserProfile();
  const { mutate: updateSeller } = useUpdateSellerProfile();
  const { mutate: createSeller } = useCreateSellerProfile();

  const handleUserSubmit = (formData: any) => {
    updateUser(formData, {
      onSuccess: () => {
        navigate('/mypage');
      }
    });
  };

  const handleSellerSubmit = (formData: any) => {
    const mutation = sellerProfile ? updateSeller : createSeller;
    mutation(formData, {
      onSuccess: () => {
        navigate('/mypage');
      }
    });
  };

  if (isLoadingUser || isLoadingSeller) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
        <p className="mt-2 text-sm text-gray-600">
          ユーザー情報を編集できます
        </p>
      </div>
      
      {/* ユーザープロフィールフォーム */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
        <UserProfileForm 
          initialData={userProfile} 
          onSubmit={handleUserSubmit}
        />
      </div>

      {/* 販売者情報フォーム（ユーザーがseller/bothの場合のみ表示） */}
      {userProfile?.role !== 'buyer' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">販売者情報</h2>
          <SellerProfileForm
            initialData={sellerProfile}
            onSubmit={handleSellerSubmit}
          />
        </div>
      )}
    </div>
  );
}; 