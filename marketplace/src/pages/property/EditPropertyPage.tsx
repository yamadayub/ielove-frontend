import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, PlusCircle, Loader2, Trash2, Pencil, ImageIcon, Image } from 'lucide-react';
import { PropertyForm } from '../../features/property/components/PropertyForm';
import type { Property } from '../../features/property/types/property_types';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useRooms } from '../../features/room/hooks/useRooms';
import { useDrawings } from '../../features/drawing/hooks/useDrawings';
import type { Drawing } from '../../features/drawing/types/drawing_types';
import { useUser } from '../../features/user/hooks/useUser';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { RoomTile } from '../../features/room/components/RoomTile';
import { useImages } from '../../features/image/hooks/useImages';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { AxiosError } from 'axios';
import { DeleteConfirmationModal } from '../../features/common/components/modal/DeleteConfirmationModal';

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

export const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const axios = useAuthenticatedAxios();
  const { data: userProfile } = useUser(userId);

  // 所有者チェック
  useEffect(() => {
    const checkOwnership = async () => {
      if (!propertyId || !userId) return;

      try {
        const token = await getToken();
        const response = await axios.get<boolean>(
          ENDPOINTS.CHECK_PROPERTY_OWNERSHIP(Number(propertyId)),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-clerk-user-id': userId
            }
          }
        );
        
        if (!response.data) {
          navigate('/error', { 
            state: { message: 'この物件は他のユーザーによって登録されています' }
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
  }, [propertyId, userId, getToken, axios, navigate]);

  // propertyIdのnullチェック
  if (!propertyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">物件IDが指定されていません</p>
      </div>
    );
  }

  const { data: property, isLoading: isLoadingProperty, error: propertyError } = useProperty(propertyId);
  const { 
    data: rooms, 
    isLoading: isLoadingRooms, 
    error: roomsError,
    refetch: refetchRooms 
  } = useRooms({ propertyId });
  const {
    data: drawings,
    isLoading: isLoadingDrawings,
    error: drawingsError,
    refetch: refetchDrawings
  } = useDrawings({ propertyId });
  const { 
    data: images = [], 
    isLoading: isLoadingImages,
    refetch: refetchImages 
  } = useImages({
    propertyId: Number(propertyId)
  });

  // 物件にのみ紐づいている画像をフィルタリング
  const propertyImages = images.filter(image => 
    image.property_id === Number(propertyId) &&
    !image.room_id &&
    !image.product_id &&
    !image.product_specification_id &&
    !image.drawing_id
  );

  // 部屋の画像のみをフィルタリング（製品に紐付いていない画像）
  const roomImages = images.filter(img => 
    img.room_id && !img.product_id
  );

  // 図面の画像をフィルタリング
  const getDrawingImages = (drawingId: number) => {
    return images.filter(img => img.drawing_id === drawingId);
  };

  // 各図面のサムネイル画像を取得
  const getDrawingThumbnail = (drawingId: number) => {
    const drawingImages = images.filter(img => img.drawing_id === drawingId);
    return drawingImages.length > 0 ? drawingImages[0] : null;
  };

  // 各部屋のメイン画像を取得
  const getRoomMainImage = (roomId: number) => {
    return images.find(img => 
      img.room_id === roomId && 
      img.image_type === 'MAIN'
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
  const [drawingToDelete, setDrawingToDelete] = useState<number | null>(null);

  // userIdのnullチェック
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">認証情報が見つかりません</p>
      </div>
    );
  }

  const handleSubmit = async (formData: Property) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await axios.patch<Property>(
        ENDPOINTS.UPDATE_PROPERTY(propertyId),
        formData
      );

      // 成功メッセージを設定
      setSubmitError('物件情報を更新しました');
    } catch (error) {
      console.error('物件の更新に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setSubmitError(`物件の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setSubmitError('物件の更新に失敗しました。もう一度お試しください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post<{ id: number }>(
        ENDPOINTS.CREATE_ROOM,
        {
          property_id: Number(propertyId),
          name: '新規部屋',
          description: '',
        }
      );
      navigate(`/property/${propertyId}/room/${response.data.id}/edit`);
    } catch (error) {
      console.error('部屋の作成に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setSubmitError(`部屋の作成に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setSubmitError('部屋の作成に失敗しました。もう一度お試しください');
      }
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_ROOM(roomId));
      // 成功メッセージを設定
      setSubmitError('部屋を削除しました');
      // 部屋一覧を更新
      await refetchRooms();
      // 画像一覧も更新（部屋に紐づく画像も削除されるため）
      await refetchImages();
    } catch (error) {
      console.error('部屋の削除に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setSubmitError(`部屋の削除に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setSubmitError('部屋の削除に失敗しました。もう一度お試しください');
      }
    } finally {
      setRoomToDelete(null);
    }
  };

  const handleCreateDrawing = async () => {
    try {
      const response = await axios.post<{ id: number }>(
        ENDPOINTS.CREATE_DRAWING,
        {
          property_id: Number(propertyId),
          name: '新規図面',
          description: '',
        }
      );
      navigate(`/property/${propertyId}/drawing/${response.data.id}/edit`);
    } catch (error) {
      console.error('図面の作成に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setSubmitError(`図面の作成に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setSubmitError('図面の作成に失敗しました。もう一度お試しください');
      }
    }
  };

  const handleDeleteDrawing = async (drawingId: number) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_DRAWING(drawingId));
      setDrawingToDelete(null);
      refetchDrawings();
    } catch (error) {
      console.error('図面の削除に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setSubmitError(`図面の削除に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setSubmitError('図面の削除に失敗しました。もう一度お試しください');
      }
    }
  };

  if (isLoadingProperty || isLoadingRooms || !userProfile || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (propertyError || roomsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">データの取得に失敗しました</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">物件が見つかりません</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-112px)] bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{property.name}の編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">物件情報の編集</h1>
      </div>

      {submitError && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{submitError}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <PropertyForm
            onSubmit={handleSubmit}
            initialData={property}
            isSubmitting={isSubmitting}
            userId={Number(userId)}
            propertyId={propertyId}
            clerkUserId={userId}
            existingImages={propertyImages}
            onImageChange={() => refetchImages()}
          />
        </div>
      </div>

      {/* Room一覧セクション */}
      <div className="md:max-w-2xl md:mx-auto mt-8">
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <h2 className="text-base font-medium text-gray-900">部屋一覧</h2>
            <button
              onClick={handleCreateRoom}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              部屋を追加
            </button>
          </div>

          {!rooms || rooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">部屋が登録されていません</h3>
              <p className="text-gray-600">「部屋を追加」ボタンから部屋を登録してください</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {rooms.map((room) => {
                const mainImage = getRoomMainImage(room.id);
                return (
                  <div key={room.id} className="flex items-start p-4 hover:bg-gray-50">
                    {/* サムネイル画像 */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {mainImage ? (
                        <img
                          src={mainImage.url}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* 部屋情報 */}
                    <div className="flex-grow ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{room.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{room.description}</p>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/property/${propertyId}/room/${room.id}/edit`)}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoomToDelete(room.id);
                        }}
                        className="inline-flex items-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 図面セクション */}
      <div className="md:max-w-2xl md:mx-auto mt-8">
        <div className="bg-white">
          <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <h2 className="text-base font-medium text-gray-900">図面一覧</h2>
            <button
              onClick={handleCreateDrawing}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              図面を追加
            </button>
          </div>

          {!drawings || drawings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">図面が登録されていません</h3>
              <p className="text-gray-600">「図面を追加」ボタンから図面を登録してください</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {drawings.map((drawing) => (
                <div key={drawing.id} className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* サムネイル画像 */}
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {getDrawingThumbnail(drawing.id) ? (
                          <img
                            src={getDrawingThumbnail(drawing.id).url}
                            alt={drawing.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Image className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{drawing.name}</h3>
                        {drawing.description && (
                          <p className="mt-1 text-sm text-gray-500">{drawing.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/property/${propertyId}/drawing/${drawing.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDrawingToDelete(drawing.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 削除確認モーダル（部屋） */}
      <DeleteConfirmationModal
        isOpen={roomToDelete !== null}
        onClose={() => setRoomToDelete(null)}
        onConfirm={() => roomToDelete && handleDeleteRoom(roomToDelete)}
        title="部屋の削除"
        message="この部屋を削除してもよろしいですか？この操作は取り消せません。"
      />

      {/* 削除確認モーダル（図面） */}
      <DeleteConfirmationModal
        isOpen={drawingToDelete !== null}
        onClose={() => setDrawingToDelete(null)}
        onConfirm={() => drawingToDelete && handleDeleteDrawing(drawingToDelete)}
        title="図面の削除"
        message="この図面を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
};