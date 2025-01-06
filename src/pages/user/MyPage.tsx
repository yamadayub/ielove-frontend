import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { useSellerProfile, useStripeStatus } from '../../features/seller/hooks/useSeller';
import { useUserProperties } from '../../features/property/hooks/useProperties';
import { Property } from '../../features/property/types/property_types';
import { UserProfile } from '../../features/user/components/UserProfile';
import { InitialUserSetup } from '../../features/user/components/InitialUserSetup';
import { BecomeSeller } from '../../features/seller/components/BecomeSeller';
import { SellerDashboard } from '../../features/seller/components/SellerDashboard';
import { AxiosError } from 'axios';
import { Loader2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StripeConnect } from '../../features/seller/components/StripeConnect';
import { ListingList } from '../../features/listing/components/ListingList';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { PurchasedProperties } from '../../features/purchase/components/PurchasedProperties';

export const MyPage: React.FC = () => {
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile, isLoading: isUserLoading, error: userError } = useUser(clerkUserId);

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
    console.error('Failed to load user profile:', userError);
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
    console.error('Invalid user profile:', userProfile);
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
    console.error('User profile ID is missing:', userProfile);
    return <InitialUserSetup />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">マイページ</h1>
      <div className="space-y-8">
        <UserProfile user={userProfile} />
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              購入済み物件
            </h2>
            <PurchasedProperties />
          </div>
        </div>

        <SellerSection userId={userProfile.id} clerkUserId={clerkUserId} />
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
  const { data: properties, isLoading: isLoadingProperties } = useUserProperties(userId);
  const axios = useAuthenticatedAxios();
  const navigate = useNavigate();

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

  if (isLoadingProfile) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-3 mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!sellerProfile) {
    return <BecomeSeller userId={userId} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            登録済み物件
          </h3>
          <div className="mt-4 space-y-4">
            {isLoadingProperties ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : !properties?.length ? (
              <p className="text-gray-500">
                物件が登録されていません。
                <Link to="/properties/create" className="text-blue-600 hover:text-blue-500 ml-2">
                  物件を登録する
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{property.name}</h4>
                      <p className="text-sm text-gray-500">{property.prefecture}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/property/${property.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        編集
                      </Link>
                      <button
                        onClick={() => property.id && handleCreateListing(property.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        出品する
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            販売者情報
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">会社名</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {sellerProfile.company_name || '未設定'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">代表者名</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {sellerProfile.representative_name || '未設定'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">住所</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {sellerProfile.address ? (
                  <>
                    〒{sellerProfile.postal_code}
                    <br />
                    {sellerProfile.address}
                  </>
                ) : (
                  '未設定'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">電話番号</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {sellerProfile.phone_number || '未設定'}
              </dd>
            </div>
          </div>
        </div>
      </div>

      <StripeConnect 
        userId={userId} 
        stripeAccountId={sellerProfile.stripe_account_id}
        accountStatus={sellerProfile.stripe_account_status}
        onboardingCompleted={sellerProfile.stripe_onboarding_completed}
        isLoading={isLoadingStripe}
      />

      {sellerProfile.stripe_account_id && sellerProfile.stripe_onboarding_completed && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              出品商品
            </h3>
            <div className="mt-4">
              <ListingList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};