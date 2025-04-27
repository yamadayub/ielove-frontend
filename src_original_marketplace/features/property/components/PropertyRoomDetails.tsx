import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Image as LucideImage } from 'lucide-react';
import { RoomTile } from '../../room/components/RoomTile';
import { Room } from '../../room/types/room_types';
import { Image } from '../../image/types/image_types';
import { useDrawings } from '../../drawing/hooks/useDrawings';

interface PropertyRoomDetailsProps {
  propertyId: string;
  rooms: Room[];
  images: Image[];
  isPurchased: boolean;
  isOwner: boolean;
}

export const PropertyRoomDetails: React.FC<PropertyRoomDetailsProps> = ({
  propertyId,
  rooms,
  images,
  isPurchased,
  isOwner
}) => {
  const navigate = useNavigate();
  const { data: drawings } = useDrawings({ propertyId });

  // 更新済みの部屋のみをフィルタリング
  const updatedRooms = rooms.filter(room => room.status === 'updated');

  // 図面の画像をフィルタリング
  const getDrawingImages = (drawingId: number | undefined) => {
    if (!drawingId) return [];
    return images.filter(img => img.drawing_id === drawingId);
  };

  // 各図面のサムネイル画像を取得
  const getDrawingThumbnail = (drawingId: number | undefined) => {
    if (!drawingId) return null;
    const drawingImages = getDrawingImages(drawingId);
    return drawingImages.length > 0 ? drawingImages[0] : null;
  };

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
      {/* 図面セクション */}
      {drawings && drawings.length > 0 && (
        <>
          <div>
            <div className="border-b border-gray-900/10">
              <h3 className="text-xl font-semibold text-gray-900 px-4 pt-4">
                図面
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
              {drawings.map((drawing) => {
                if (!drawing.id) return null;
                const thumbnail = getDrawingThumbnail(drawing.id);
                if (!thumbnail) return null;

                return (
                  <div key={drawing.id} className="relative aspect-square bg-white">
                    <img
                      src={thumbnail.url}
                      alt={drawing.name}
                      className={`w-full h-full object-cover ${!isPurchased && !isOwner ? 'blur-sm' : ''}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 部屋セクションのヘッダー */}
          <div className="border-b border-gray-900/10 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 px-4 pt-4">
              部屋
            </h3>
          </div>
        </>
      )}

      {/* 部屋一覧 */}
      {!updatedRooms || updatedRooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">部屋が登録されていません</h3>
          <p className="text-gray-600">この物件にはまだ部屋が登録されていません</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
          {updatedRooms.map((room) => (
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