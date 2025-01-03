import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, X, Plus, PlusCircle } from 'lucide-react';
import { ImageUploader } from '../../features/image/components/ImageUploader';
import { useRoom } from '../../features/room/hooks/useRoom';
import { useImages } from '../../features/image/hooks/useImages';
import { useProducts } from '../../features/product/hooks/useProducts';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import type { Room } from '../../features/room/types/room_types';
import { AxiosError } from 'axios';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // nullチェックの追加
  if (!roomId || !propertyId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">Room ID and Property ID are required</p>
      </div>
    );
  }

  const { data: room, isLoading: isLoadingRoom } = useRoom(roomId);
  const { 
    data: roomImages, 
    isLoading: isLoadingImages,
    refetch: refetchImages 
  } = useImages({
    roomId: roomId
  });
  const { data: products, isLoading: isLoadingProducts } = useProducts({
    roomId: roomId
  });

  // 部屋の画像のみをフィルタリング（製品に紐付いていない画像）
  const filteredRoomImages = roomImages?.filter(img => !img.product_id);

  const [roomForm, setRoomForm] = useState<RoomFormData>({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (room) {
      setRoomForm({
        name: room.name,
        description: room.description || ''
      });
    }
  }, [room]);

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

  const handleImageUploaded = (imageData: {
    id: number;
    url: string;
    image_type: 'MAIN' | 'SUB';
    status: 'pending' | 'completed';
  }) => {
    refetchImages();
  };

  const handleImageDelete = async (imageId: number) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      refetchImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`画像の削除に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('画像の削除に失敗しました');
      }
    }
  };

  const handleImageTypeChange = async (imageId: number, newType: 'MAIN' | 'SUB') => {
    try {
      await axios.patch(ENDPOINTS.UPDATE_IMAGE_TYPE(imageId), { image_type: newType });
      refetchImages();
    } catch (error) {
      console.error('Failed to update image type:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`画像タイプの更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('画像タイプの更新に失敗しました');
      }
    }
  };

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post<{ id: number }>(
        '/api/products',
        {
          name: '新規内装仕様',
          description: '',
          room_id: Number(roomId)
        },
        {
          params: { room_id: Number(roomId) }
        }
      );
      navigate(`/property/${propertyId}/room/${roomId}/product/${response.data.id}/edit`);
    } catch (error) {
      console.error('内装仕様の作成に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`内装仕様の作成に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('内装仕様の作成に失敗しました。もう一度お試しください');
      }
    }
  };

  if (isLoadingRoom || isLoadingImages || isLoadingProducts) {
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
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {filteredRoomImages?.map((image) => (
                    <div key={image.id} className="relative">
                      <div className="relative aspect-square">
                        <img
                          src={image.url}
                          alt="部屋画像"
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(image.id)}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                          aria-label="画像を削除"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <select
                          value={image.image_type || 'SUB'}
                          onChange={(e) => handleImageTypeChange(image.id, e.target.value as 'MAIN' | 'SUB')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                        >
                          <option value="MAIN">メイン画像</option>
                          <option value="SUB">サブ画像</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  onError={setError}
                  roomId={Number(roomId)}
                  clerkUserId={userId || undefined}
                  existingImages={filteredRoomImages
                    ?.filter(img => img.image_type === 'MAIN' || img.image_type === 'SUB')
                    .map(img => ({
                      id: img.id,
                      image_type: img.image_type as 'MAIN' | 'SUB',
                      url: img.url
                    }))}
                />
              </div>
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

      {/* Product一覧セクション */}
      <div className="md:max-w-2xl md:mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900">内装仕様一覧</h2>
            <button
              onClick={handleCreateProduct}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              内装仕様を追加
            </button>
          </div>

          {products && products.length > 0 ? (
            <div className="border-t border-gray-200">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => navigate(`/property/${propertyId}/room/${roomId}/product/${product.id}/edit`)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                        )}
                      </div>
                      <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">内装仕様が登録されていません</h3>
              <p className="text-gray-600">「内装仕様を追加」ボタンから製品を登録してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};