import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { RoomGallery } from '../components/room/RoomGallery';
import { RoomInfo } from '../components/room/RoomInfo';
import { ProductList } from '../components/product/ProductList';
import { ProductListView } from '../components/product/ProductListView';
import { ProductViewTabs } from '../components/product/ProductViewTabs';
import { useStore } from '../store/useStore';
import { useImages } from '../api/quieries/useImages';
import { useProducts } from '../api/quieries/useProducts';
import { useRoom } from '../api/quieries/useRoom';
import type { Room } from '../types/room';

export const RoomPage = () => {
  const { propertyId, roomId } = useParams();
  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(propertyId || ''));

  const {
    data: images,
    isLoading: isLoadingImages,
    isError: isImagesError
  } = useImages({
    entity_type: 'room',
    entity_id: parseInt(roomId || '0')
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError
  } = useProducts({ roomId });

  if (isLoadingRoom || isLoadingImages || isLoadingProducts) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">読み込み中...</h2>
      </div>
    );
  }

  if (!room || isImagesError || isProductsError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">エラーが発生しました</h2>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <RoomGallery images={images || []} />
      
      <div className="px-4">
        <RoomInfo room={room} />
      </div>

      <div className="bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">仕上げ材</h2>
              <ProductViewTabs view={view} onViewChange={setView} />
            </div>
          </div>
          {view === 'grid' ? (
            <ProductList
              propertyId={propertyId!}
              roomId={roomId!}
              products={products || []}
              isPurchased={isPropertyPurchased}
            />
          ) : (
            <div className="px-4">
              <ProductListView
                propertyId={propertyId!}
                roomId={roomId!}
                products={products || []}
                isPurchased={isPropertyPurchased}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};