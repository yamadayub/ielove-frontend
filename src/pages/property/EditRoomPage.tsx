import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ImageUploader } from '../../components/property/ImageUploader';
import { useRoom } from '../../api/quieries/useRoom';
import { useImages } from '../../api/quieries/useImages';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

interface RoomFormData {
  name: string;
  description: string;
}

export const EditRoomPage: React.FC = () => {
  const { propertyId, roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; status: 'uploading' | 'completed' }>>([]);

  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId!);
  const { data: roomImages, isLoading: isLoadingImages } = useImages({
    entity_type: 'room',
    entity_id: parseInt(roomId!)
  });

  const [roomForm, setRoomForm] = useState<RoomFormData>({
    name: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (room) {
      setRoomForm({
        name: room.name,
        description: room.description || ''
      });
    }

    if (roomImages?.length > 0) {
      setUploadedImages(
        roomImages.map(image => ({
          id: image.id.toString(),
          url: image.url,
          status: 'completed'
        }))
      );
    }
  }, [room, roomImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.patch(
        `${API_URL}/api/rooms/${roomId}?clerk_user_id=${userId}`,
        {
          ...roomForm,
          property_id: Number(propertyId)
        }
      );

      // キャッシュを更新して再フェッチ
      await queryClient.invalidateQueries(['room', roomId]);
      setError('部屋情報を更新しました');
    } catch (error) {
      console.error('Failed to update room:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        setError(`部屋の更新に失敗しました: ${JSON.stringify(error.response.data)}`);
      } else {
        setError('部屋の更新に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !userId) return;

    for (const file of Array.from(files)) {
      try {
        // 1. プリサインドURLを取得
        const { data: presignedData } = await axios.post(
          `${API_URL}${ENDPOINTS.GET_PRESIGNED_URL}?clerk_user_id=${userId}`,
          {
            content_type: file.type,
            entity_type: 'room',
            room_id: Number(roomId),
            property_id: Number(propertyId)
          }
        );

        // 一時的な状態として画像を追加
        const tempImage = {
          id: presignedData.image_id,
          url: '',
          status: 'uploading' as const
        };
        setUploadedImages(prev => [...prev, tempImage]);

        // 2. S3に画像をアップロード
        await axios.put(presignedData.presigned_url, file, {
          headers: {
            'Content-Type': file.type
          }
        });

        // 3. アップロード完了を通知
        await axios.post(
          `${API_URL}${ENDPOINTS.COMPLETE_IMAGE_UPLOAD(presignedData.image_id)}?clerk_user_id=${userId}`,
          {
            room_id: Number(roomId),
            property_id: Number(propertyId)
          }
        );

        // 4. 状態を更新
        setUploadedImages(prev =>
          prev.map(img =>
            img.id === presignedData.image_id
              ? { ...img, url: presignedData.url, status: 'completed' }
              : img
          )
        );

        // キャッシュを更新
        await queryClient.invalidateQueries(['images', { entity_type: 'room', entity_id: roomId }]);
      } catch (error) {
        console.error('Failed to upload image:', error);
        setError('画像のアップロードに失敗しました');
      }
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await axios.delete(
        `${API_URL}${ENDPOINTS.DELETE_IMAGE(imageId)}?clerk_user_id=${userId}`
      );
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      // キャッシュを更新
      await queryClient.invalidateQueries(['images', { entity_type: 'room', entity_id: roomId }]);
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError('画像の削除に失敗しました');
    }
  };

  if (isLoadingRoom || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">部屋が見つかりませんでした</h2>
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
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">部屋の編集</h1>
      </div>

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="md:max-w-2xl md:mx-auto">
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                写真
              </label>
              <ImageUploader
                images={uploadedImages}
                onUpload={handleUpload}
                onDelete={handleImageDelete}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                部屋名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={roomForm.name}
                onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={roomForm.description}
                onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? '保存中...' : '部屋情報を保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};