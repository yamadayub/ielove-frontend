import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2, CheckCircle } from 'lucide-react';
import { RoomGallery } from '../../features/room/components/RoomGallery';
import { RoomInfo } from '../../features/room/components/RoomInfo';
import { ProductList } from '../../features/product/components/ProductList';
import { ProductListView } from '../../features/product/components/ProductListView';
import { ProductViewTabs } from '../../features/product/components/ProductViewTabs';
import { useStore } from '../../store/useStore';
import { useImages } from '../../features/image/hooks/useImages';
import { useProducts } from '../../features/product/hooks/useProducts';
import { useRoom } from '../../features/room/hooks/useRoom';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '../../features/user/hooks/useUser';
import { useProperty } from '../../features/property/hooks/useProperty';

export const RoomPage = () => {
  const { propertyId = '', roomId = '' } = useParams<{ propertyId: string; roomId: string }>();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { userId: clerkUserId } = useAuth();
  const { data: userProfile } = useUser(clerkUserId);
  const { data: property } = useProperty(propertyId);

  if (!propertyId || !roomId) {
    return <Navigate to="/" replace />;
  }

  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
  const { data: products, isLoading: isLoadingProducts } = useProducts({ roomId });
  const { data: images, isLoading: isLoadingImages } = useImages({ roomId });
  const { data: purchaseStatus } = usePropertyPurchaseStatus(Number(propertyId));

  // 物件の所有者かどうかを判定
  const isOwner = userProfile?.id && property?.user_id ? property.user_id === userProfile.id : false;

  const filteredRoomImages = images?.filter(img => !img.product_id) || [];
  const productImages = images?.filter(img => img.product_id) || [];

  if (isLoadingRoom || isLoadingProducts || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <p className="text-gray-500 text-center">
          部屋情報の取得中にエラーが発生しました。<br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb />
      <div className="bg-white">
        <RoomGallery images={filteredRoomImages} roomName={room.name} />
        
        <div className="px-4">
          <RoomInfo 
            room={room}
            isOwner={isOwner}
          />
        </div>

        <div className="bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">インテリア</h2>
                <ProductViewTabs view={view} onViewChange={setView} />
              </div>
            </div>
            {view === 'grid' ? (
              <ProductList
                propertyId={propertyId}
                roomId={roomId}
                products={products || []}
                images={productImages}
                isPurchased={purchaseStatus?.isPurchased}
                isOwner={isOwner}
              />
            ) : (
              <div className="">
                <ProductListView
                  propertyId={propertyId}
                  roomId={roomId}
                  products={products || []}
                  images={productImages}
                  isPurchased={purchaseStatus?.isPurchased}
                  isOwner={isOwner}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};