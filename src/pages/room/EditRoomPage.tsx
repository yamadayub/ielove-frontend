import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, X, Plus, PlusCircle, ImageIcon, Trash2 } from 'lucide-react';
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

// 型定義を追加
type ImageType = 'MAIN' | 'SUB' | 'PAID';

const IMAGE_TYPE_LABELS = {
  'MAIN': 'メイン画像',
  'SUB': 'サブ画像',
  'PAID': '有料画像'
} as const;

export const EditRoomPage: React.FC = () => {
  const { propertyId, roomId } = useParams<{ propertyId: string; roomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId, getToken } = useAuth();
  const axios = useAuthenticatedAxios();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 所有者チェック
  useEffect(() => {
    const checkOwnership = async () => {
      if (!roomId || !userId) return;

      try {
        const token = await getToken();
        const response = await axios.get<boolean>(
          ENDPOINTS.CHECK_ROOM_OWNERSHIP(Number(roomId)),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-clerk-user-id': userId
            }
          }
        );
        
        if (!response.data) {
          navigate('/error', { 
            state: { message: 'この部屋は他のユーザーによって登録されています' }
          });
        }
      } catch (error) {
        console.error('所有権の確認に失敗しました:', error);
        navigate('/error', {
          state: { message: '所有権の確認に失敗しました' }
        });
      }
    };

    checkOwnership();
  }, [roomId, userId, getToken, axios, navigate]);

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
  const { 
    data: products, 
    isLoading: isLoadingProducts,
    refetch: refetchProducts 
  } = useProducts({
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
    image_type: ImageType;
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

  const handleImageTypeChange = async (imageId: number, newType: ImageType) => {
    try {
      await axios.patch(ENDPOINTS.UPDATE_IMAGE_TYPE(imageId), newType);
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
      // 現在のProductの数を取得して新しい番号を決定
      const interiorNumber = (products?.length || 0) + 1;

      const response = await axios.post<{ id: number }>(
        '/api/products',
        {
          name: `インテリア #${interiorNumber}`,
          description: '',
          room_id: Number(roomId)
        },
        {
          params: { room_id: Number(roomId) }
        }
      );
      navigate(`/property/${propertyId}/room/${roomId}/product/${response.data.id}/edit`);
    } catch (error) {
      console.error('インテリアの作成に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`インテリアの作成に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('インテリアの作成に失敗しました。もう一度お試しください');
      }
    }
  };

  // 製品のメイン画像を取得する関数
  const getProductMainImage = (productId: number | undefined) => {
    if (!productId) return null;
    return roomImages?.find(img => 
      img.product_id === productId && 
      img.image_type === 'MAIN'
    );
  };

  const handleDeleteProduct = async (productId: number | undefined) => {
    if (!productId) return;
    
    if (!window.confirm('このインテリアを削除してもよろしいですか？')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`);
      // 製品一覧と関連する画像を再取得
      await Promise.all([
        refetchProducts(),
        refetchImages()
      ]);
      // 成功メッセージを一時的に表示
      setError('インテリアを削除しました');
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (error) {
      console.error('インテリアの削除に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`インテリアの削除に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('インテリアの削除に失敗しました。もう一度お試しください');
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
                部屋の写真
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
                          onChange={(e) => handleImageTypeChange(image.id, e.target.value as ImageType)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
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
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  onError={setError}
                  roomId={Number(roomId)}
                  clerkUserId={userId || undefined}
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

            <div className="sticky bottom-0 bg-white p-4 -mx-4 -mb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSubmitting ? '更新中...' : '部屋情報を更新する'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Product一覧セクション */}
      <div className="md:max-w-2xl md:mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900">インテリア一覧</h2>
            <button
              onClick={handleCreateProduct}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              インテリアを追加
            </button>
          </div>

          {products && products.length > 0 ? (
            <div className="border-t border-gray-200">
              {products.map((product) => {
                const mainImage = getProductMainImage(product.id);
                return (
                  <div
                    key={product.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => navigate(`/property/${propertyId}/room/${roomId}/product/${product.id}/edit`)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                            {mainImage ? (
                              <img
                                src={mainImage.url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                            {product.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180" />
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="インテリアを削除"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">インテリアが登録されていません</h3>
              <p className="text-gray-600">「インテリアを追加」ボタンから製品を登録してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};