import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, PlusCircle, Loader2, Trash2, Pencil, ImageIcon } from 'lucide-react';
import { PropertyForm } from '../../features/property/components/PropertyForm';
import type { Property } from '../../features/property/types/property_types';
import { useProperty } from '../../features/property/hooks/useProperty';
import { useRooms } from '../../features/room/hooks/useRooms';
import { useUser } from '../../features/user/hooks/useUser';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { RoomTile } from '../../features/room/components/RoomTile';
import { useImages } from '../../features/image/hooks/useImages';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { AxiosError } from 'axios';

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              はい
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditPropertyPage: React.FC = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const axios = useAuthenticatedAxios();
  const { data: userProfile } = useUser(userId);

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
    data: images, 
    isLoading: isLoadingImages,
    refetch: refetchImages 
  } = useImages({
    propertyId: Number(propertyId)
  });

  // 物件に関連する画像のみをフィルタリング（部屋や製品に紐付いていない画像）
  const propertyImages = images?.filter(image => 
    !image.room_id && !image.product_id
  );

  // 部屋の画像のみをフィルタリング（製品に紐付いていない画像）
  const roomImages = images?.filter(img => img.room_id && !img.product_id) || [];

  // 各部屋のメイン画像を取得
  const getRoomMainImage = (roomId: number) => {
    return roomImages.find(img => 
      img.room_id === roomId && 
      img.image_type === 'MAIN'
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

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

      <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:my-8">
        <PropertyForm 
          onSubmit={handleSubmit}
          initialData={property}
          isSubmitting={isSubmitting}
          userId={userProfile.id}
          submitButtonText="物件情報を更新する"
          propertyId={propertyId}
          clerkUserId={userId}
          existingImages={propertyImages}
          onImageChange={() => refetchImages()}
        />
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

      {/* 削除確認モーダル */}
      <DeleteConfirmationModal
        isOpen={roomToDelete !== null}
        onClose={() => setRoomToDelete(null)}
        onConfirm={() => roomToDelete && handleDeleteRoom(roomToDelete)}
        title="部屋の削除"
        message="この部屋を削除してもよろしいですか？この操作は取り消せません。"
      />
    </div>
  );
};