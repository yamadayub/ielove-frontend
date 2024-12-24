import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import type { Room } from '../types/room_types';
import type { Image } from '../../image/types/image_types';
import { RoomTile } from './RoomTile';

interface RoomListProps {
  rooms: Room[];
  propertyId: string;
  images?: Image[];
}

export const RoomList: React.FC<RoomListProps> = ({ rooms, propertyId, images = [] }) => {
  const navigate = useNavigate();

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50">
        <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">部屋が登録されていません</h3>
        <p className="text-gray-600">「部屋を追加」ボタンから部屋を登録してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {rooms.map((room) => (
        <RoomTile
          key={room.id}
          room={room}
          images={images}
          showImage={true}
          onClick={() => navigate(`/property/${propertyId}/room/${room.id}`)}
        />
      ))}
    </div>
  );
};