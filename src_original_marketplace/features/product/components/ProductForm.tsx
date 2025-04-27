import React, { useState } from 'react';
import type { Product } from '../types/product_types';
import { ImageUploader } from '../../image/components/ImageUploader';
import type { Image } from '../../image/types/image_types';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Product) => void;
  onCancel: () => void;
  clerkUserId?: string;
  productId?: string;
  roomId: number;
}

// アップロード中の画像の型定義
interface UploadingImage {
  id: string;
  url: string;
  status: 'uploading' | 'completed';
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  clerkUserId,
  productId,
  roomId
}) => {
  const [formData, setFormData] = useState<Product>(
    product || {
      room_id: roomId,
      product_category_id: 1, // TODO: カテゴリー選択機能の実装
      name: '',
      product_code: '',
      description: '',
      created_at: new Date().toISOString()
    }
  );

  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const axios = useAuthenticatedAxios();

  const handleUpload = async (files: FileList | null) => {
    if (!files || !clerkUserId || !productId) return;

    for (const file of Array.from(files)) {
      try {
        // 1. プリサインドURLを取得
        const { data: presignedData } = await axios.post(
          ENDPOINTS.GET_PRESIGNED_URL,
          null,
          {
            params: {
              file_name: file.name,
              content_type: file.type
            }
          }
        );

        // 一時的な状態として画像を追加
        const tempImage: UploadingImage = {
          id: presignedData.image_id,
          url: '',
          status: 'uploading'
        };
        setUploadingImages(prev => [...prev, tempImage]);

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
            entity_type: 'product',
            product_id: Number(productId)
          }
        );

        // 4. 状態を更新
        setUploadingImages(prev =>
          prev.map(img =>
            img.id === presignedData.image_id
              ? { ...img, url: presignedData.url, status: 'completed' }
              : img
          )
        );
      } catch (error) {
        console.error('Failed to upload image:', error);
        setError('画像のアップロードに失敗しました');
      }
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!clerkUserId) return;

    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      setUploadingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError('画像の削除に失敗しました');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <input
        type="hidden"
        name="room_id"
        value={formData.room_id}
      />

      {productId && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            内装・インテリアの写真
          </label>
          <ImageUploader
            images={uploadingImages}
            onUpload={(e) => handleUpload(e.target.files)}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          商品名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          製造者
        </label>
        <input
          type="text"
          value={formData.manufacturer_name || ''}
          onChange={(e) => setFormData({ ...formData, manufacturer_name: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          placeholder="製造者名を入力してください"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          商品コード <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.product_code}
          onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          保存
        </button>
      </div>
    </form>
  );
};