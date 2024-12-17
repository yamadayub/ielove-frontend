import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoomGallery } from '../components/room/RoomGallery';
import { RoomInfo } from '../components/room/RoomInfo';
import { MaterialList } from '../components/material/MaterialList';
import { MaterialListView } from '../components/material/MaterialListView';
import { MaterialViewTabs } from '../components/material/MaterialViewTabs';
import { MOCK_ROOMS } from '../utils/mockData';
import { useStore } from '../store/useStore';

export const RoomPage = () => {
  const { propertyId, roomId } = useParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const room = MOCK_ROOMS.find(r => r.id === roomId && r.propertyId === propertyId);
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(propertyId || ''));

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">部屋が見つかりませんでした</h2>
      </div>
    );
  }

  const materials = Object.entries(room.specifications).map(([id, spec]) => ({
    id,
    ...spec,
  }));

  return (
    <div className="bg-white">
      {/* 部屋写真 */}
      <RoomGallery images={room.images} />
      
      {/* 部屋情報 */}
      <div className="px-4">
        <RoomInfo room={room} />
      </div>

      {/* 仕上げ材一覧 */}
      <div className="bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">仕上げ材</h2>
              <MaterialViewTabs view={view} onViewChange={setView} />
            </div>
            {view === 'grid' ? (
              <MaterialList
                propertyId={propertyId!}
                roomId={roomId!}
                materials={materials}
                isPurchased={isPropertyPurchased}
              />
            ) : (
              <MaterialListView
                propertyId={propertyId!}
                roomId={roomId!}
                materials={materials}
                isPurchased={isPropertyPurchased}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};