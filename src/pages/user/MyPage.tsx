import { useAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { useSellerProfile, useStripeStatus } from '../../features/seller/hooks/useSeller';
import { useUserProperties } from '../../features/property/hooks/useProperties';
import { UserProfile } from '../../features/user/components/UserProfile';
import { InitialUserSetup } from '../../features/user/components/InitialUserSetup';
import { SellerDashboard } from '../../features/seller/components/SellerDashboard';
import { AxiosError } from 'axios';
import { Loader2, Plus, ArrowRight, Trash2, Copy, Share2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StripeConnect } from '../../features/seller/components/StripeConnect';
import { ListingList } from '../../features/listing/components/ListingList';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { PurchasedProperties } from '../../features/purchase/components/PurchasedProperties';
import { useState } from 'react';
import { useMyPurchases } from '../../features/purchase/hooks/useMyPurchases';
import { useMyListings } from '../../features/listing/hooks/useListing';
import { useQueryClient } from '@tanstack/react-query';

export const MyPage: React.FC = () => {
  const { userId: clerkUserId } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(clerkUserId);
  const { data: properties, isLoading: isLoadingProperties } = useUserProperties(userProfile?.id);
  const { data: purchaseData } = useMyPurchases();
  const { data: listings } = useMyListings();
  const { data: sellerProfile, isLoading: isLoadingProfile } = useSellerProfile(userProfile?.id);
  const { data: stripeStatus, isLoading: isLoadingStripe } = useStripeStatus(
    userProfile?.id,
    sellerProfile?.stripe_account_id
  );
  const axios = useAuthenticatedAxios();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const queryClient = useQueryClient();
  const [showCopyModal, setShowCopyModal] = useState(false);

  const openDashboard = async () => {
    try {
      setIsLoadingDashboard(true);
      const response = await axios.get<{ url: string }>(
        ENDPOINTS.SELLER.GET_DASHBOARD_URL
      );
      window.open(response.data.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to get dashboard URL:', error);
      alert('ダッシュボードの取得に失敗しました。');
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!propertyId || !confirm('この物件を削除してもよろしいですか？')) {
      return;
    }

    try {
      await axios.delete(ENDPOINTS.DELETE_PROPERTY(propertyId));
      // 物件リストを再取得
      queryClient.invalidateQueries(['properties', userProfile?.id]);
    } catch (error) {
      console.error('物件の削除に失敗しました:', error);
      alert('物件の削除に失敗しました。');
    }
  };

  const handleCopyUrl = (propertyId: number | undefined) => {
    if (!propertyId) return;
    
    const url = `${window.location.origin}/property/${propertyId}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyModal(true);
      setTimeout(() => {
        setShowCopyModal(false);
      }, 2000);
    }).catch(err => {
      console.error('URLのコピーに失敗しました:', err);
    });
  };

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
      <div className="px-4 py-4 border-b">
        <div className="flex items-start gap-4">
          {/* プロフィール画像 */}
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-4 border-double border-gray-100">
            {clerkUser?.imageUrl ? (
              <img
                src={clerkUser.imageUrl}
                alt={clerkUser.firstName || 'プロフィール画像'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-2xl">👤</span>
              </div>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold">{userProfile.name}</h1>
              <Link
                to="/settings"
                className="p-1 text-gray-700 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Link>
            </div>

            <p className="text-xs text-gray-600 mb-1">{userProfile.email}</p>

            {sellerProfile?.stripe_account_id && sellerProfile.stripe_onboarding_completed && (
              <button
                onClick={openDashboard}
                disabled={isLoadingDashboard}
                className="inline-flex items-center text-xs font-medium text-gray-700 hover:text-blue-600 disabled:text-gray-400"
              >
                {isLoadingDashboard ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    Stripeダッシュボード
                    <ArrowRight className="ml-1 h-3 w-3 inline" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50">
        <div className="text-center py-2">
          <span className="block font-semibold text-2xl text-gray-900">{properties?.length || 0}</span>
          <span className="text-gray-600 text-xs">登録物件</span>
        </div>
        <div className="text-center py-2">
          <span className="block font-semibold text-2xl text-gray-900">{listings?.length || 0}</span>
          <span className="text-gray-600 text-xs">出品中</span>
        </div>
        <div className="text-center py-2">
          <span className="block font-semibold text-2xl text-gray-900">{purchaseData?.transactions?.length || 0}</span>
          <span className="text-gray-600 text-xs">購入済み</span>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b">
        <div className="flex justify-center gap-8">
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'buyer' 
                ? 'border-t-2 border-black text-black' 
                : 'text-gray-500 hover:text-black'
            }`}
            onClick={() => setActiveTab('buyer')}
          >
            購入履歴
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
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
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-6 p-4 animate-pulse">
                      <div className="w-48 h-48 bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 space-y-4 py-2">
                        <div className="h-4 bg-gray-100 w-1/4" />
                        <div className="h-4 bg-gray-100 w-1/2" />
                        <div className="h-4 bg-gray-100 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !properties?.length ? (
                <div className="text-center py-12 bg-gray-50">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100">
                    <span className="text-3xl">🏷</span>
                  </div>
                  <p className="text-gray-500 mb-2">登録されている物件がありません</p>
                  <p className="text-sm text-gray-400">新規登録ボタンから物件を登録してください</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="border-b last:border-b-0"
                    >
                      <div className="flex items-start gap-3 p-4">
                        {/* サムネイル画像 */}
                        <div className="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden rounded-lg">
                          {property.images?.find(img => img.image_type === 'MAIN')?.url ? (
                            <img
                              src={property.images.find(img => img.image_type === 'MAIN')?.url}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="text-2xl">🏠</span>
                            </div>
                          )}
                        </div>

                        {/* 物件情報 */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{property.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{property.prefecture}</p>
                          {property.layout && (
                            <p className="text-sm text-gray-500">{property.layout}</p>
                          )}
                        </div>

                        {/* アクションボタン */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyUrl(property.id)}
                            className="p-2 text-gray-500 hover:text-gray-900"
                            title="リンクをシェア"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/property/${property.id}/edit`}
                            className="p-2 text-gray-500 hover:text-gray-900"
                            title="編集"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => property.id && handleCreateListing(property.id)}
                            className="p-2 text-gray-500 hover:text-gray-900"
                            title="出品"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => property.id && handleDeleteProperty(property.id)}
                            className="p-2 text-gray-500 hover:text-red-600"
                            title="削除"
                          >
                            <Trash2 className="h-4 w-4" />
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
                <div className="text-center py-12 bg-gray-50">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100">
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
            {!sellerProfile?.stripe_onboarding_completed && (
              <div className="p-8 text-center bg-gray-50">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100">
                  <span className="text-3xl">💳</span>
                </div>
                {!sellerProfile?.stripe_account_id ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      出品者登録をして出品を始めましょう
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Stripeアカウントを接続して、物件情報の出品を始めることができます
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Stripeアカウントの登録を完了させてください
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      登録作業を完了すると、物件情報の出品が可能になります
                    </p>
                  </>
                )}
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

      {/* コピー完了モーダル */}
      {showCopyModal && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            物件のリンクをコピーしました
          </div>
        </div>
      )}
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