import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, PlusCircle, Loader2 } from 'lucide-react';
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
  const { data: rooms, isLoading: isLoadingRooms, error: roomsError } = useRooms({ propertyId });
  const { data: propertyImages, isLoading: isLoadingImages } = useImages({
    entity_type: 'property',
    entity_id: parseInt(propertyId)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

      navigate(`/property/${propertyId}`);
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

      <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:shadow-sm md:my-8">
        <PropertyForm 
          onSubmit={handleSubmit}
          initialData={property}
          isSubmitting={isSubmitting}
          userId={userProfile.id}
          submitButtonText="更新する"
          propertyId={propertyId}
          clerkUserId={userId}
        />
      </div>

      {/* Room一覧セクション */}
      <div className="md:max-w-2xl md:mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900">部屋一覧</h2>
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
            <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
              {rooms.map((room) => (
                <RoomTile
                  key={room.id}
                  room={room}
                  onClick={() => navigate(`/property/${propertyId}/room/${room.id}/edit`)}
                  showImage={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};