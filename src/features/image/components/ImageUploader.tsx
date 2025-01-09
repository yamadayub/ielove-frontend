import React, { useState, useCallback, useRef } from 'react';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { Upload } from 'lucide-react';
import { AxiosError } from 'axios';

interface ImageUploaderProps {
  onImageUploaded: (imageData: {
    id: number;
    url: string;
    image_type: 'MAIN' | 'SUB' | 'PAID';
    status: 'pending' | 'completed';
  }) => void;
  onError: (error: string) => void;
  propertyId?: number;
  roomId?: number;
  productId?: number;
  clerkUserId?: string;
}

interface UploadProgressType {
  [key: string]: {
    progress: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    error?: string;
    retryCount: number;
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

const IMAGE_TYPE_LABELS = {
  'MAIN': 'メイン画像',
  'SUB': 'サブ画像',
  'PAID': '有料画像'
} as const;

type ImageType = keyof typeof IMAGE_TYPE_LABELS;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  onError,
  propertyId,
  roomId,
  productId,
  clerkUserId
}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const axios = useAuthenticatedAxios();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getPresignedUrl = async (params: {
    file_name: string;
    content_type: string;
    property_id?: number;
    room_id?: number;
    product_id?: number;
    image_type: 'MAIN' | 'SUB' | 'TEMP';
  }) => {
    if (!clerkUserId) {
      throw new Error('ユーザーIDが設定されていません');
    }

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.GET_PRESIGNED_URL}`,
      params,
      {
        headers: {
          'x-clerk-user-id': clerkUserId
        }
      }
    );
    return data;
  };

  const uploadToS3WithProgress = async (
    file: File,
    uploadUrl: string,
    fileId: string
  ): Promise<void> => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress }
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`S3アップロードに失敗しました: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('ネットワークエラーが発生しました'));

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const updateImageStatus = async (imageId: number, status: 'completed' | 'pending') => {
    if (!clerkUserId) {
      throw new Error('ユーザーIDが設定されていません');
    }

    await axios.patch(
      `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.UPDATE_IMAGE_STATUS(imageId)}`,
      { status },
      {
        headers: {
          'x-clerk-user-id': clerkUserId
        }
      }
    );
  };

  const handleImageTypeChange = async (imageId: number, newType: ImageType) => {
    if (!clerkUserId) {
      throw new Error('ユーザーIDが設定されていません');
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.UPDATE_IMAGE_TYPE(imageId)}`,
        { image_type: newType },
        {
          headers: {
            'x-clerk-user-id': clerkUserId
          }
        }
      );
      onImageUploaded({
        id: imageId,
        url: existingImages.find(img => img.id === imageId)?.url || '',
        image_type: newType,
        status: 'completed'
      });
    } catch (error) {
      console.error('画像タイプの更新に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        onError(`画像タイプの更新に失敗しました: ${error.response.data.message || '不明なエラー'}`);
      } else if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('画像タイプの更新に失敗しました');
      }
    }
  };

  const uploadImage = useCallback(async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    
    try {
      // ファイルサイズチェック (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('ファイルサイズは10MB以下にしてください');
      }

      // ファイル形式チェック
      if (!file.type.startsWith('image/')) {
        throw new Error('画像ファイルのみアップロード可能です');
      }

      // プログレス表示の初期化
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { progress: 0, status: 'uploading', retryCount: 0 }
      }));

      // 1. プリサインドURLの取得
      const presignedData = await getPresignedUrl({
        file_name: file.name,
        content_type: file.type,
        property_id: propertyId,
        room_id: roomId,
        product_id: productId,
        image_type: 'SUB'  // デフォルトでサブ画像としてアップロード
      });

      // 2. S3へのアップロード（リトライロジック付き）
      let lastError: Error | null = null;
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        try {
          await uploadToS3WithProgress(file, presignedData.upload_url, fileId);
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('アップロードに失敗しました');
          if (retry < MAX_RETRIES - 1) {
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: { 
                ...prev[fileId],
                retryCount: retry + 1,
                status: 'processing',
                error: `リトライ中... (${retry + 1}/${MAX_RETRIES})`
              }
            }));
            await sleep(RETRY_DELAY * (retry + 1)); // 指数バックオフ
            continue;
          }
          throw lastError;
        }
      }

      // 3. ステータス更新
      await updateImageStatus(presignedData.image_id, 'completed');

      // 4. アップロード完了を記録
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { progress: 100, status: 'completed', retryCount: 0 }
      }));

      // 5. 完了通知
      onImageUploaded({
        id: presignedData.image_id,
        url: presignedData.image_url,
        image_type: 'SUB',  // デフォルトでサブ画像として通知
        status: 'completed'
      });

    } catch (error) {
      console.error('画像アップロードエラー:', error);
      
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { 
          progress: 0, 
          status: 'error',
          error: error instanceof Error ? error.message : '画像のアップロードに失敗しました',
          retryCount: 0
        }
      }));
      
      if (error instanceof AxiosError && error.response?.data) {
        onError(`アップロードに失敗しました: ${error.response.data.message || '不明なエラー'}`);
      } else if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('画像のアップロードに失敗しました');
      }
    }
  }, [axios, propertyId, roomId, productId, onImageUploaded, onError, clerkUserId]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(file => {
        uploadImage(file);
      });
    }
  }, [uploadImage]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        uploadImage(file);
      });
    }
  }, [uploadImage]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* アップロードエリア */}
      <div
        className={`relative border border-dashed rounded-lg p-2 text-center cursor-pointer
          ${dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}
          transition-colors duration-200 ease-in-out hover:bg-gray-50`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && handleClick()}
        aria-label="画像をアップロード"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept="image/*"
          className="hidden"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Upload className="h-12 w-12 mb-4" />
          <p className="text-sm font-medium">
            クリックまたはドラッグ&ドロップで画像をアップロード
          </p>
          <p className="text-xs mt-2">
            JPG, PNG, GIF形式（10MB以下）
          </p>
        </div>
      </div>

      {/* アップロードプログレス */}
      {Object.entries(uploadProgress).map(([fileId, { progress, status, error, retryCount }]) => (
        <div key={fileId} className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full
                ${status === 'completed' ? 'text-green-600 bg-green-200' :
                  status === 'error' ? 'text-red-600 bg-red-200' :
                  'text-gray-600 bg-gray-200'}`}
              >
                {status === 'completed' ? '完了' :
                 status === 'error' ? 'エラー' :
                 status === 'processing' ? `リトライ中 (${retryCount}/${MAX_RETRIES})` :
                 `${Math.round(progress)}%`}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progress}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                ${status === 'error' ? 'bg-red-500' :
                  status === 'completed' ? 'bg-green-500' :
                  status === 'processing' ? 'bg-yellow-500' :
                  'bg-blue-500'}`}
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      ))}
    </div>
  );
};