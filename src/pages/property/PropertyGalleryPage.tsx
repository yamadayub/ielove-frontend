import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useImages } from '../../features/image/hooks/useImages';
import { PropertyGallery } from '../../features/property/components/PropertyGallery';
import { PropertyInfo } from '../../features/property/components/PropertyInfo';
import { PhotoTile } from '../../features/property/components/PhotoTile';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { FilterIcon } from '../../features/property/components/FilterIcon';
import { useRooms } from '../../features/room/hooks/useRooms';
import { useProducts } from '../../features/product/hooks/useProducts';

export const PropertyGalleryPage = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAuthenticatedAxios();
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile } = useUser(clerkUserId);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const { data: property, isLoading: isLoadingProperty } = useProperty(id);
  const { data: images, isLoading: isLoadingImages } = useImages({ propertyId: id });
  const { data: purchaseStatus, isLoading: isPurchaseStatusLoading } = usePropertyPurchaseStatus(Number(id));
  const { data: rooms } = useRooms({ propertyId: id });

  // リスティング情報の取得
  const { data: listingData, isLoading: isListingLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.LISTING.GET_BY_PROPERTY(id));
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

  // メイン画像を持つ部屋と製品を抽出
  const roomMainImages = images?.filter(img => 
    img.room_id && !img.product_id && img.image_type === 'MAIN'
  ).map(img => {
    const room = rooms?.find(r => r.id === img.room_id);
    return {
      ...img,
      roomName: room?.name || `部屋 ${img.room_id}`
    };
  }) || [];

  const productMainImages = images?.filter(img => 
    img.product_id && img.image_type === 'MAIN'
  ).map(img => {
    const room = rooms?.find(r => r.id === img.room_id);
    const products = room?.products || [];
    const product = products.find(p => p.id === img.product_id);
    return {
      ...img,
      productName: product?.name || `製品 ${img.product_id}`
    };
  }) || [];

  // 部屋と製品の全画像をフィルタリング
  const roomImages = images?.filter(img => 
    img.room_id && !img.product_id
  ) || [];

  const productImages = images?.filter(img => 
    img.product_id && img.image_type === 'MAIN'
  ) || [];

  // 全ての画像を結合
  const allImages = [...roomImages, ...productImages];

  // フィルタリングされた画像
  const filteredImages = selectedFilter 
    ? allImages.filter(img => {
        if (selectedFilter.startsWith('room_')) {
          const roomId = selectedFilter.replace('room_', '');
          return img.room_id === roomId;
        } else if (selectedFilter.startsWith('product_')) {
          const productId = selectedFilter.replace('product_', '');
          return img.product_id === productId;
        }
        return false;
      })
    : allImages;

  if (isLoadingProperty || isLoadingImages || isPurchaseStatusLoading || isListingLoading) {
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
        <div className="md:px-4 pt-4 pb-8">
          <PropertyInfo 
            property={property}
            isPurchased={purchaseStatus?.isPurchased}
            isLoading={isPurchaseStatusLoading}
            listingId={listingId}
            price={price}
            isOwner={isOwner}
          />
          
          {/* フィルターアイコン */}
          <div className="mt-8 px-4">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              <FilterIcon
                image={propertyImages[0]}
                label="全て"
                isSelected={selectedFilter === null}
                onClick={() => setSelectedFilter(null)}
              />
              {roomMainImages.map((image) => (
                <FilterIcon
                  key={`room_${image.room_id}`}
                  image={image}
                  label={image.roomName}
                  isSelected={selectedFilter === `room_${image.room_id}`}
                  onClick={() => setSelectedFilter(`room_${image.room_id}`)}
                />
              ))}
              {productMainImages.map((image) => (
                <FilterIcon
                  key={`product_${image.product_id}`}
                  image={image}
                  label={image.productName}
                  isSelected={selectedFilter === `product_${image.product_id}`}
                  onClick={() => setSelectedFilter(`product_${image.product_id}`)}
                />
              ))}
            </div>
          </div>

          {/* 画像グリッド */}
          <div className="mt-4 -mx-4 md:mx-0">
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-0.5 bg-gray-100">
              {filteredImages.map((image) => {
                const room = rooms?.find(r => r.id === image.room_id);
                const products = room?.products || [];
                const product = products.find(p => p.id === image.product_id);
                const name = product?.name || room?.name || '';

                return (
                  <PhotoTile
                    key={image.id}
                    image={image}
                    propertyId={id}
                    name={name}
                    link={image.product_id 
                      ? `/property/${id}/room/${image.room_id}/product/${image.product_id}`
                      : `/property/${id}/room/${image.room_id}`
                    }
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