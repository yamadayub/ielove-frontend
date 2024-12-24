import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ImageUploader } from '../../features/image/components/ImageUploader';
import { useRoom } from '../../features/room/hooks/useRoom';
import { useImages } from '../../features/image/hooks/useImages';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import type { Room } from '../../features/room/types/room_types';
import { AxiosError } from 'axios';

// 型定義の追加
type QueryKeys = 
  | { queryKey: ['room', string] }
  | { queryKey: ['images', { entity_type: string; entity_id: string | number }] };

interface RoomFormData {
  name: string;
  description: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

export const EditRoomPage: React.FC = () => {
  const { propertyId, roomId } = useParams<{ propertyId: string; roomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const axios = useAuthenticatedAxios();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; status: 'uploading' | 'completed' }>>([]);

  // nullチェックの追加
  if (!roomId || !propertyId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">Room ID and Property ID are required</p>
      </div>
    );
  }

  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
  const { data: roomImages, isLoading: isLoadingImages } = useImages({
    entity_type: 'room',
    entity_id: parseInt(roomId)
  });

  const [roomForm, setRoomForm] = useState<RoomFormData>({
    name: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (room) {
      setRoomForm({
        name: room.name,
        description: room.description || ''
      });
    }

    if (roomImages && roomImages.length > 0) {
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
        ENDPOINTS.UPDATE_ROOM(roomId),
        {
          ...roomForm,
          property_id: Number(propertyId)
        }
      );

      // 型付きのクエリ無効化
      await queryClient.invalidateQueries({ queryKey: ['room', roomId] });
      setError('部屋情報を更新しました');
    } catch (error) {
      console.error('Failed to update room:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`部屋の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('部屋の更新に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const { data: presignedData } = await axios.post(
          ENDPOINTS.GET_PRESIGNED_URL,
          {
            content_type: file.type,
            file_name: file.name
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
          ENDPOINTS.COMPLETE_IMAGE_UPLOAD(presignedData.image_id),
          {
            entity_type: 'room',
            entity_id: Number(roomId)
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

        // 型付きのクエリ無効化
        await queryClient.invalidateQueries({
          queryKey: ['images', { entity_type: 'room', entity_id: roomId }]
        });
      } catch (error) {
        console.error('Failed to upload image:', error);
        if (error instanceof AxiosError && error.response?.data) {
          const apiError = error.response.data as ApiError;
          setError(`画像のアップロードに失敗しました: ${apiError.message || '不明なエラー'}`);
        } else {
          setError('画像のアップロードに失敗しました');
        }
      }
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await axios.delete(
        `${ENDPOINTS.DELETE_IMAGE(imageId)}?clerk_user_id=${userId}`
      );
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      // 型付きのクエリ無効化
      await queryClient.invalidateQueries({
        queryKey: ['images', { entity_type: 'room', entity_id: roomId }]
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`画像の削除に失敗しました: ${apiError.message || '不明なエラー'}`);
      } else {
        setError('画像の削除に失敗しました');
      }
    }
  };

  if (isLoadingRoom || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">部屋が見つかりませんでした</p>
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
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSubmitting ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};