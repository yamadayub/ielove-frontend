import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { DrawingForm } from '../../features/drawing/components/DrawingForm';
import { useDrawing } from '../../features/drawing/hooks/useDrawing';
import { useImages } from '../../features/image/hooks/useImages';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { AxiosError } from 'axios';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import type { Drawing } from '../../features/drawing/types/drawing_types';

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

export const EditDrawingPage: React.FC = () => {
  const { propertyId, drawingId } = useParams();
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const axios = useAuthenticatedAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: drawing, isLoading: isLoadingDrawing } = useDrawing(drawingId);
  const { 
    data: images = [], 
    isLoading: isLoadingImages,
    refetch: refetchImages 
  } = useImages({
    drawingId: Number(drawingId)
  });

  console.log('Drawing images:', images);

  // 所有者チェック
  useEffect(() => {
    const checkOwnership = async () => {
      if (!drawingId || !userId) return;

      try {
        const token = await getToken();
        const response = await axios.get<boolean>(
          ENDPOINTS.CHECK_DRAWING_OWNERSHIP(Number(drawingId)),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-clerk-user-id': userId
            }
          }
        );
        
        if (!response.data) {
          navigate('/error', { 
            state: { message: 'この図面は他のユーザーによって登録されています' }
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
  }, [drawingId, userId, getToken, axios, navigate]);

  const handleSubmit = async (formData: Drawing) => {
    if (isSubmitting || !drawingId) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.patch<Drawing>(
        ENDPOINTS.UPDATE_DRAWING(Number(drawingId)),
        formData
      );

      // 成功メッセージを設定
      setError('図面情報を更新しました');
    } catch (error) {
      console.error('図面の更新に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`図面の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('図面の更新に失敗しました。もう一度お試しください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDrawing || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!drawing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">図面が見つかりません</p>
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
          <h1 className="ml-2 text-lg font-semibold">{drawing.name}の編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">図面の編集</h1>
      </div>

      {error && (
        <div className="container mx-auto px-4 mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white md:rounded-lg">
          <DrawingForm 
            onSubmit={handleSubmit}
            initialData={drawing}
            isSubmitting={isSubmitting}
            propertyId={Number(propertyId)}
            clerkUserId={userId || ''}
            existingImages={images}
            drawingId={Number(drawingId)}
            onImageChange={() => refetchImages()}
          />
        </div>
      </div>
    </div>
  );
}; 