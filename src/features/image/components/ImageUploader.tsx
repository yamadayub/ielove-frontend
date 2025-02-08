import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { Upload, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { useImages } from '../hooks/useImages';

interface ImageUploaderProps {
  onImageUploaded: (imageData: {
    id: number;
    url: string;
    image_type: 'MAIN' | 'SUB' | 'PAID';
    status: 'pending' | 'completed';
  }) => void;
  onError: (error: string) => void;
  onImageDeleted?: () => void;
  propertyId?: number;
  roomId?: number;
  productId?: number;
  productSpecificationId?: number;
  drawingId?: number;
  clerkUserId?: string;
  compact?: boolean;
  imageType?: 'MAIN' | 'SUB' | 'PAID';
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
  onImageDeleted,
  propertyId,
  roomId,
  productId,
  productSpecificationId,
  drawingId,
  clerkUserId,
  compact = false,
  imageType: defaultImageType = 'MAIN'
}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const axios = useAuthenticatedAxios();

  // 仕様画像を取得
  const { data: images, refetch: refetchImages } = useImages({
    ...(propertyId && { propertyId }),
    ...(roomId && { roomId }),
    ...(productId && { productId })
  });

  // メイン画像の存在チェック
  const existingMainImage = images?.find(img => {
    if (productSpecificationId) {
      return img.product_specification_id === productSpecificationId && img.image_type === 'MAIN';
    }
    if (productId) {
      return img.product_id === productId && !img.product_specification_id && img.image_type === 'MAIN';
    }
    if (roomId) {
      return img.room_id === roomId && !img.product_id && img.image_type === 'MAIN';
    }
    if (propertyId) {
      return img.property_id === propertyId && !img.room_id && !img.product_id && img.image_type === 'MAIN';
    }
    return false;
  });

  // 実際に使用する画像タイプを決定
  const imageType = existingMainImage ? 'SUB' : defaultImageType;

  // 画像削除ハンドラー
  const handleDeleteImage = async (imageId: number) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      await refetchImages();
      onImageDeleted?.();
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      onError('画像の削除に失敗しました');
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getPresignedUrl = async (params: {
    file_name: string;
    content_type: string;
    property_id?: number;
    room_id?: number;
    product_id?: number;
    product_specification_id?: number;
    drawing_id?: number;
    image_type: 'MAIN' | 'SUB' | 'PAID';
  }) => {
    if (!clerkUserId) {
      throw new Error('ユーザーIDが設定されていません');
    }

    console.log('Presigned URL request params:', { ...params, image_type: imageType });

    const { data } = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.GET_PRESIGNED_URL}`,
      { ...params, image_type: imageType },
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
        product_specification_id: productSpecificationId,
        drawing_id: drawingId,
        image_type: imageType
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
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId]; // アップロード完了後はプログレス表示を削除
        return newProgress;
      });

      // 5. 完了通知
      onImageUploaded({
        id: presignedData.image_id,
        url: presignedData.image_url,
        image_type: 'MAIN',
        status: 'completed'
      });

      // アップロード完了後に画像一覧を更新
      await refetchImages();

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
  }, [axios, propertyId, roomId, productId, onImageUploaded, onError, clerkUserId, refetchImages]);

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

  // 仕様画像が存在する場合はサムネイルを表示
  if (productSpecificationId && existingMainImage) {
    return (
      <div className="relative w-24 h-24">
        <img
          src={existingMainImage.url}
          alt="仕様画像"
          className="w-full h-full object-cover rounded"
        />
        <button
          type="button"
          onClick={() => handleDeleteImage(existingMainImage.id)}
          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
          aria-label="画像を削除"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "space-y-4"}>
      {/* アップロードエリア */}
      <div
        className={`relative border border-dashed cursor-pointer
          ${dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}
          ${compact 
            ? 'w-24 h-24 rounded' 
            : 'p-2 rounded-lg'
          }
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
        <div className={`flex flex-col items-center justify-center text-gray-400 h-full`}>
          <Upload className={compact ? "h-6 w-6" : "h-12 w-12 mb-4"} />
          {!compact && (
            <>
              <p className="text-sm font-medium">
                クリックまたはドラッグ&ドロップで画像をアップロード
              </p>
              <p className="text-xs mt-2">
                JPG, PNG, GIF形式（10MB以下）
              </p>
            </>
          )}
        </div>
      </div>

      {/* アップロードプログレス */}
      {Object.entries(uploadProgress).map(([fileId, { progress, status, error, retryCount }]) => (
        <div key={fileId} className={`relative ${compact ? 'absolute inset-0 bg-white/80 backdrop-blur-sm' : 'pt-1'}`}>
          <div className={`flex items-center justify-center h-full ${!compact && 'mb-2'}`}>
            <div className={compact ? 'w-20' : 'w-full'}>
              <div className={`${compact ? 'px-2' : ''}`}>
                <div className="overflow-hidden h-1 mb-1 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                      ${status === 'error' ? 'bg-red-500' :
                        status === 'completed' ? 'bg-green-500' :
                        status === 'processing' ? 'bg-yellow-500' :
                        'bg-blue-500'}`}
                  />
                </div>
                <span className={`text-[10px] font-medium text-center block
                  ${status === 'completed' ? 'text-green-600' :
                    status === 'error' ? 'text-red-600' :
                    'text-gray-600'}`}
                >
                  {status === 'completed' ? '完了' :
                   status === 'error' ? 'エラー' :
                   status === 'processing' ? `リトライ中` :
                   `${Math.round(progress)}%`}
                </span>
              </div>
            </div>
          </div>
          {error && !compact && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>
      ))}
    </div>
  );
};