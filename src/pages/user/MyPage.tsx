import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { useSellerProfile, useStripeStatus } from '../../features/seller/hooks/useSeller';
import { useUserProperties } from '../../features/property/hooks/useProperties';
import { UserProfile } from '../../features/user/components/UserProfile';
import { InitialUserSetup } from '../../features/user/components/InitialUserSetup';
import { SellerDashboard } from '../../features/seller/components/SellerDashboard';
import { AxiosError } from 'axios';
import { Loader2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StripeConnect } from '../../features/seller/components/StripeConnect';
import { ListingList } from '../../features/listing/components/ListingList';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { PurchasedProperties } from '../../features/purchase/components/PurchasedProperties';
import { useState } from 'react';

export const MyPage: React.FC = () => {
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(clerkUserId);
  const { data: properties, isLoading: isLoadingProperties } = useUserProperties(userProfile?.id);
  const { data: sellerProfile, isLoading: isLoadingProfile } = useSellerProfile(userProfile?.id);
  const { data: stripeStatus, isLoading: isLoadingStripe } = useStripeStatus(
    userProfile?.id,
    sellerProfile?.stripe_account_id
  );
  const axios = useAuthenticatedAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (userError instanceof AxiosError) {
    if (userError.response?.status === 404) {
      return <InitialUserSetup />;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          ユーザー情報の取得に失敗しました。<br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  if (!userProfile || typeof userProfile === 'string') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">
          ユーザー情報の取得に失敗しました。<br />
          APIの設定を確認してください。
        </p>
      </div>
    );
  }

  if (!userProfile.id) {
    return <InitialUserSetup />;
  }

  const handleCreateListing = async (propertyId: number) => {
    try {
      const property = properties?.find(p => p.id === propertyId);
      if (!property) return;

      const { data } = await axios.post(ENDPOINTS.LISTING.CREATE, {
        title: property.name,
        price: 5000,
        listing_type: 'PROPERTY_SPECS',
        property_id: propertyId
      });
      navigate(`/listings/${data.id}/edit`);
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('出品の作成に失敗しました。');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* プロフィールヘッダー */}
      <div className="px-4 py-8 border-b">
        <div className="flex items-start gap-8">
          {/* プロフィール画像 */}
          <div className="w-32 h-32 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            {userProfile.image_url ? (
              <img
                src={userProfile.image_url}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-4xl">👤</span>
              </div>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">{userProfile.name}</h1>
              <Link
                to="/settings"
                className="px-4 py-1.5 border rounded-md text-sm font-medium hover:bg-gray-50"
              >
                プロフィールを編集
              </Link>
            </div>

            <div className="flex gap-8 mb-4">
              <div className="text-center">
                <span className="font-semibold">{properties?.length || 0}</span>
                <span className="text-gray-500 text-sm block">登録物件</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">0</span>
                <span className="text-gray-500 text-sm block">出品中</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">0</span>
                <span className="text-gray-500 text-sm block">購入済み</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">{userProfile.email}</p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b">
        <div className="flex justify-center gap-12">
          <button 
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'buyer' 
                ? 'border-t-2 border-black text-black' 
                : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab('buyer')}
          >
            購入履歴
          </button>
          <button 
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'seller' 
                ? 'border-t-2 border-black text-black' 
                : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab('seller')}
          >
            販売情報
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="p-4">
        {activeTab === 'buyer' ? (
          <div>
            <PurchasedProperties />
          </div>
        ) : (
          <div className="space-y-12">
            {/* 物件情報 */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">物件情報</h3>
                <Link
                  to="/properties/create"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  新規登録
                </Link>
              </div>

              {isLoadingProperties ? (
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : !properties?.length ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">🏠</span>
                  </div>
                  <p className="text-gray-500 mb-2">登録されている物件がありません</p>
                  <p className="text-sm text-gray-400">新規登録ボタンから物件を登録してください</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-0.5">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="aspect-square relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gray-200">
                        {property.image_url ? (
                          <img
                            src={property.image_url}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-4xl">🏠</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-4 text-white">
                          <Link
                            to={`/property/${property.id}/edit`}
                            className="p-2 hover:text-blue-400"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => property.id && handleCreateListing(property.id)}
                            className="p-2 hover:text-blue-400"
                          >
                            出品
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 出品情報 */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">出品情報</h3>
              </div>
              {/* 出品情報がない場合 */}
              {!sellerProfile?.stripe_account_id ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">🏷️</span>
                  </div>
                  <p className="text-gray-500 mb-2">出品中の商品がありません</p>
                  <p className="text-sm text-gray-400">物件情報から出品を始めましょう</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ListingList />
                </div>
              )}
            </div>

            {/* 出品者登録 */}
            {!sellerProfile?.stripe_account_id && (
              <div className="border rounded-lg p-8 text-center bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <span className="text-3xl">💳</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  出品者登録をして出品を始めましょう
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Stripeアカウントを接続して、物件情報の出品を始めることができます
                </p>
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
        )}
      </div>
    </div>
  );
};

const SellerSection: React.FC<{ userId: number; clerkUserId: string | null | undefined }> = ({ userId, clerkUserId }) => {
  const { data: sellerProfile, isLoading: isLoadingProfile } = useSellerProfile(userId);
  const { data: stripeStatus, isLoading: isLoadingStripe } = useStripeStatus(
    userId,
    sellerProfile?.stripe_account_id
  );

  if (isLoadingProfile) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <StripeConnect 
        userId={userId} 
        stripeAccountId={sellerProfile?.stripe_account_id ?? null}
        accountStatus={sellerProfile?.stripe_account_status ?? null}
        onboardingCompleted={sellerProfile?.stripe_onboarding_completed ?? false}
        isLoading={isLoadingStripe}
      />

      {sellerProfile?.stripe_account_id && sellerProfile.stripe_onboarding_completed && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            出品商品
          </h3>
          <div className="grid grid-cols-3 gap-1">
            <ListingList />
          </div>
        </div>
      )}
    </div>
  );
};