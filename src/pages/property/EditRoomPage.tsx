import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { useImageUpload } from '../../hooks/useImageUpload';
import { ImageUploader } from '../../components/property/ImageUploader';
import { MaterialList } from '../../components/material/MaterialList';
import { ArrowLeft, Plus } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

const REQUIRED_MATERIALS = [
  { id: 'flooring', name: '床材', type: '床材' },
  { id: 'wallpaper', name: '壁紙', type: '壁紙' },
  { id: 'ceiling', name: '天井', type: '天井' },
  { id: 'lighting', name: '照明', type: '照明' },
  { id: 'window', name: '窓', type: '窓' },
  { id: 'door', name: 'ドア', type: 'ドア' },
];

export const EditRoomPage: React.FC = () => {
  const { propertyId, roomId } = useParams<{ propertyId: string; roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const roomImages = useImageUpload();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!propertyId || !roomId) return;
        const response = await mockApi.getRoom(propertyId, roomId);
        setRoom(response.data);
        
        // 既存の画像をセット
        if (response.data.images.length > 0) {
          roomImages.setImages(
            response.data.images.map(url => ({
              id: url,
              url,
              status: 'completed' as const
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch room:', error);
      }
    };

    fetchRoom();
  }, [propertyId, roomId]);

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{room.name}の編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{room.name}の編集</h1>
        </div>
      </div>

      {/* 部屋写真 */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                部屋写真
              </label>
            </div>
            <ImageUploader
              images={roomImages.images}
              onUpload={(e) => roomImages.handleUpload(e.target.files!)}
              onDelete={roomImages.deleteImage}
            />
          </div>
        </div>
      </div>

      {/* 仕上げ材一覧 */}
      <div className="bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">仕上げ材</h2>
              <button
                onClick={() => setShowAddMaterial(true)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                <span>仕上げ材を追加</span>
              </button>
            </div>
          </div>
          <MaterialList
            propertyId={propertyId!}
            roomId={roomId!}
            materials={Object.entries(room.specifications).map(([id, spec]) => ({
              id,
              ...spec,
              type: REQUIRED_MATERIALS.find(m => m.id === id)?.type || id
            }))}
          />
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <div className="max-w-5xl mx-auto">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            変更を保存
          </button>
        </div>
      </div>
    </div>
  );
};