import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useImages } from '../../features/image/hooks/useImages';
import { useRooms } from '../../features/room/hooks/useRooms';
import { PropertyGallery } from '../../features/property/components/PropertyGallery';
import { PropertyInfo } from '../../features/property/components/PropertyInfo';
import { RoomTile } from '../../features/room/components/RoomTile';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';

export const PropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axios = useAuthenticatedAxios();
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile } = useUser(clerkUserId);

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

  // 物件の所有者かどうかを判定
  const isOwner = userProfile?.id && property?.user_id ? property.user_id === userProfile.id : false;

  // 物件の画像のみをフィルタリング（部屋や製品に紐付いていない画像）
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  // 部屋の画像のみをフィルタリング（製品に紐付いていない画像）
  const roomImages = images?.filter(img => img.room_id && !img.product_id) || [];

  // 各部屋のメイン画像を取得
  const getRoomMainImage = (roomId: number) => {
    return roomImages.find(img => 
      img.room_id === roomId && 
      img.image_type === 'MAIN'
    );
  };

  if (isLoadingProperty || isLoadingImages || isLoadingRooms || isPurchaseStatusLoading || isListingLoading) {
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
        <div className="px-4 py-8">
          <PropertyInfo 
            property={property}
            isPurchased={purchaseStatus?.isPurchased}
            isLoading={isPurchaseStatusLoading}
            listingId={listingData?.listing?.id}
            price={listingData?.listing?.price}
            isOwner={isOwner}
          />
          <div className="mt-8">
            {!rooms || rooms.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">部屋が登録されていません</h3>
                <p className="text-gray-600">この物件にはまだ部屋が登録されていません</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
                {rooms.map((room) => (
                  <RoomTile
                    key={room.id}
                    room={room}
                    image={getRoomMainImage(room.id)}
                    showImage={true}
                    onClick={() => navigate(`/property/${id}/room/${room.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};