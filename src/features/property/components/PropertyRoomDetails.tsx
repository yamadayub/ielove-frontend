import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { RoomTile } from '../../room/components/RoomTile';
import { Room } from '../../room/types/room_types';
import { Image } from '../../image/types/image_types';

interface PropertyRoomDetailsProps {
  propertyId: string;
  rooms: Room[];
  images: Image[];
}

export const PropertyRoomDetails: React.FC<PropertyRoomDetailsProps> = ({
  propertyId,
  rooms,
  images,
}) => {
  const navigate = useNavigate();

  // 部屋の画像のみをフィルタリング（製品に紐付いていない画像）
  const roomImages = images?.filter(img => img.room_id && !img.product_id) || [];

  // 各部屋のメイン画像を取得
  const getRoomMainImage = (roomId: number) => {
    return roomImages.find(img => 
      img.room_id === roomId && 
      img.image_type === 'MAIN'
    );
  };

  return (
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
              onClick={() => navigate(`/property/${propertyId}/room/${room.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 