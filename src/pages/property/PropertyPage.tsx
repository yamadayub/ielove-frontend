import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2, LayoutGrid, DoorOpen, FileText } from 'lucide-react';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useImages } from '../../features/image/hooks/useImages';
import { useRooms } from '../../features/room/hooks/useRooms';
import { PropertyGallery } from '../../features/property/components/PropertyGallery';
import { PropertyInfo } from '../../features/property/components/PropertyInfo';
import { PropertyGalleryDetails } from '../../features/property/components/PropertyGalleryDetails';
import { PropertyRoomDetails } from '../../features/property/components/PropertyRoomDetails';
import { PropertyProductsDetails } from '../../features/property/components/PropertyProductsDetails';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';

type TabType = 'gallery' | 'rooms' | 'products';

export const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAuthenticatedAxios();
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile } = useUser(clerkUserId);
  const [activeTab, setActiveTab] = useState<TabType>('products');

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data: property, isLoading: isLoadingProperty } = useProperty(id);
  const { data: images, isLoading: isLoadingImages } = useImages({ propertyId: id });
  const { data: rooms, isLoading: isLoadingRooms } = useRooms({ propertyId: id });
  const { data: purchaseStatus, isLoading: isPurchaseStatusLoading } = usePropertyPurchaseStatus(Number(id));

  // リスティング情報の取得
  const { data: listingData, isLoading: isListingLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.LISTING.GET_BY_PROPERTY(id));
      return data;
    },
    enabled: !!id
  });

  // 製品情報の取得
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/property/${id}`);
      return data;
    },
    enabled: !!id
  });

  // 最初のリスティングのIDと価格を取得
  const listingId = listingData?.items?.[0]?.id;
  const price = listingData?.items?.[0]?.price;

  // 物件の所有者かどうかを判定
  const isOwner = userProfile?.id && property?.user_id ? property.user_id === userProfile.id : false;

  // 物件の画像のみをフィルタリング（部屋や製品に紐付いていない画像）
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  if (isLoadingProperty || isLoadingImages || isLoadingRooms || isPurchaseStatusLoading || isListingLoading || isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <p className="text-gray-500 text-center">
          物件情報の取得中にエラーが発生しました。<br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb />
      <div className="max-w-7xl mx-auto">
        <PropertyGallery images={propertyImages} propertyName={property.name} />
        <div className="pb-8">
          <PropertyInfo 
            property={property}
            isPurchased={purchaseStatus?.isPurchased}
            isLoading={isPurchaseStatusLoading}
            listingId={listingId}
            price={price}
            isOwner={isOwner}
          />

          {/* タブナビゲーション */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`
                  flex-1 flex justify-center pb-4 border-b-2 font-medium
                  ${activeTab === 'products'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-label="製品一覧"
              >
                <FileText className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`
                  flex-1 flex justify-center pb-4 border-b-2 font-medium
                  ${activeTab === 'gallery'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-label="ギャラリー"
              >
                <LayoutGrid className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveTab('rooms')}
                className={`
                  flex-1 flex justify-center pb-4 border-b-2 font-medium
                  ${activeTab === 'rooms'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-label="部屋一覧"
              >
                <DoorOpen className="h-6 w-6" />
              </button>
            </nav>
          </div>

          {/* タブコンテンツ */}
          {activeTab === 'products' && (
            <PropertyProductsDetails
              propertyId={id}
              products={products || []}
              images={images || []}
              isPurchased={purchaseStatus?.isPurchased}
              isOwner={isOwner}
            />
          )}
          {activeTab === 'gallery' && (
            <PropertyGalleryDetails
              propertyId={id}
              images={images || []}
              rooms={rooms || []}
            />
          )}
          {activeTab === 'rooms' && (
            <PropertyRoomDetails
              propertyId={id}
              rooms={rooms || []}
              images={images || []}
            />
          )}
        </div>
      </div>
    </div>
  );
};