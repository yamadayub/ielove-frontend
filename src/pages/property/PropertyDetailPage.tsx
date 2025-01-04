import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useImages } from '../../features/image/hooks/useImages';
import { PropertyGallery } from '../../features/property/components/PropertyGallery';
import { PropertyInfo } from '../../features/property/components/PropertyInfo';
import { ProductDetailTile } from '../../features/product/components/ProductDetailTile';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';

export const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAuthenticatedAxios();
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile } = useUser(clerkUserId);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data: property, isLoading: isLoadingProperty } = useProperty(id);
  const { data: images, isLoading: isLoadingImages } = useImages({ propertyId: id });
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

  // 物件の画像のみをフィルタリング
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  if (isLoadingProperty || isLoadingImages || isPurchaseStatusLoading || isListingLoading || isLoadingProducts) {
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
      <div className="max-w-7xl mx-auto">
        <PropertyGallery images={propertyImages} propertyName={property.name} />
        <div className="px-4 pt-4 pb-8">
          <PropertyInfo 
            property={property}
            isPurchased={purchaseStatus?.isPurchased}
            isLoading={isPurchaseStatusLoading}
            listingId={listingId}
            price={price}
            isOwner={isOwner}
          />

          {/* 製品リスト */}
          <div className="mt-8">
            <h2 className="text-xl font-medium mb-6">使用製品一覧</h2>
            <div className="divide-y divide-gray-200">
              {products?.map(product => {
                const mainImage = images?.find(img => 
                  img.product_id === product.id && 
                  img.image_type === 'MAIN'
                );

                if (!mainImage) return null;

                return (
                  <ProductDetailTile
                    key={product.id}
                    product={product}
                    mainImage={mainImage}
                    propertyId={id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 