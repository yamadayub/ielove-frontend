import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../../image/components/ImageUploader';
import type { Room } from '../types/room_types';
import type { Image } from '../../image/types/image_types';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { X } from 'lucide-react';

interface RoomFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  initialData: Room;
  isSubmitting: boolean;
  userId: string | null | undefined;
  submitButtonText: string;
  propertyId: string;
  roomId: string;
  clerkUserId: string | null | undefined;
  existingImages?: Image[];
  onImageChange?: () => void;
}

type ImageType = 'MAIN' | 'SUB' | 'PAID';

const IMAGE_TYPE_LABELS = {
  'MAIN': 'メイン画像',
  'SUB': 'サブ画像',
  'PAID': '有料画像'
} as const;

export const RoomForm: React.FC<RoomFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting,
  userId,
  submitButtonText,
  propertyId,
  roomId,
  clerkUserId,
  existingImages = [],
  onImageChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState({
    name: initialData.name,
    description: initialData.description || ''
  });
  const axios = useAuthenticatedAxios();

  useEffect(() => {
    setRoomForm({
      name: initialData.name,
      description: initialData.description || ''
    });
  }, [initialData]);

  const handleImageUploaded = (imageData: {
    id: number;
    url: string;
    image_type: ImageType;
    status: 'pending' | 'completed';
  }) => {
    onImageChange?.();
  };

  const handleImageDelete = async (imageId: number) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      onImageChange?.();
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError('画像の削除に失敗しました');
    }
  };

  const handleImageTypeChange = async (imageId: number, newType: ImageType) => {
    try {
      await axios.patch(ENDPOINTS.UPDATE_IMAGE_TYPE(imageId), newType);
      onImageChange?.();
    } catch (error) {
      console.error('Failed to update image type:', error);
      setError('画像タイプの更新に失敗しました');
    }
  };

  // 表示用の画像配列を作成（既存の画像のみを使用）
  const displayImages = existingImages.map(img => ({
    ...img,
    image_type: (img.image_type || 'SUB').toUpperCase() as ImageType
  }));

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="p-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* 画像アップロードセクション */}
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-2">部屋の写真</p>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {displayImages.map((image) => (
              <div key={image.id} className="relative">
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt="部屋画像"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id!)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    aria-label="画像を削除"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <select
                    value={image.image_type || 'SUB'}
                    onChange={(e) => handleImageTypeChange(image.id!, e.target.value as ImageType)}
                    className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
                  >
                    {Object.entries(IMAGE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              onError={setError}
              propertyId={Number(propertyId)}
              roomId={Number(roomId)}
              clerkUserId={clerkUserId}
            />
          </div>
        </div>
      </div>

      {/* 基本情報セクション */}
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm mb-2">
            部屋名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={roomForm.name}
            onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
            required
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
            placeholder="例：リビング"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm mb-2">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={roomForm.description}
            onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
            placeholder="部屋の説明を入力してください"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg text-white font-medium 
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            {isSubmitting ? '更新中...' : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
}; 