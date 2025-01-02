import React, { useState } from 'react';
import type { Property } from '../types/property_types';
import { PROPERTY_TYPES, STRUCTURE_TYPES, STRUCTURE_TYPE_LABELS } from '../types/property_types';
import type { Image } from '../../image/types/image_types';
import { ImageUploader } from '../../image/components/ImageUploader';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { AxiosError } from 'axios';
import { X } from 'lucide-react';

interface PropertyFormProps {
  onSubmit: (data: Property) => Promise<void>;
  initialData?: Partial<Property>;
  isSubmitting?: boolean;
  userId: number;
  submitButtonText?: string;
  propertyId?: string;
  clerkUserId?: string;
  existingImages?: Image[];
  onImageChange?: () => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  initialData = {},
  isSubmitting = false,
  userId,
  submitButtonText = '登録する',
  propertyId,
  clerkUserId,
  existingImages = [],
  onImageChange,
}) => {
  const [formData, setFormData] = useState<Property>({
    user_id: userId,
    name: '',
    description: '',
    property_type: PROPERTY_TYPES.HOUSE,
    prefecture: '',
    layout: '',
    construction_year: undefined,
    construction_month: undefined,
    site_area: undefined,
    building_area: undefined,
    floor_count: undefined,
    structure: null,
    design_company_id: undefined,
    construction_company_id: undefined,
    ...initialData,
  });

  const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const axios = useAuthenticatedAxios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('保存エラー:', error);
      if (error instanceof Error) {
        setError(`保存に失敗しました: ${error.message}`);
      } else {
        setError('保存に失敗しました');
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData((prev: Property) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
      return;
    }

    if (name === 'structure') {
      setFormData((prev: Property) => ({
        ...prev,
        [name]: value === '' ? null : (value as typeof STRUCTURE_TYPES[keyof typeof STRUCTURE_TYPES]),
      }));
      return;
    }

    setFormData((prev: Property) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageDelete = async (imageId: number) => {
    if (!clerkUserId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.DELETE_IMAGE(imageId)}`,
        {
          headers: {
            'x-clerk-user-id': clerkUserId
          }
        }
      );
      // ローカルの状態から画像を削除
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      // 親コンポーネントに画像の変更を通知
      onImageChange?.();
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      setError('画像の削除に失敗しました');
    }
  };

  const handleImageTypeChange = async (imageId: number, newType: 'MAIN' | 'SUB') => {
    if (!clerkUserId) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.UPDATE_IMAGE(imageId)}`,
        { image_type: newType },
        {
          headers: {
            'x-clerk-user-id': clerkUserId
          }
        }
      );
      // 親コンポーネントに画像の変更を通知
      onImageChange?.();
    } catch (error) {
      console.error('画像タイプの更新に失敗しました:', error);
      setError('画像タイプの更新に失敗しました');
    }
  };

  const handleImageUploaded = (imageData: {
    id: number;
    url: string;
    image_type: 'MAIN' | 'SUB';
    status: 'pending' | 'completed';
  }) => {
    // 親コンポーネントに画像の変更を通知
    onImageChange?.();
  };

  // 表示用の画像配列を作成（既存の画像のみを使用）
  const displayImages = existingImages.map(img => ({
    ...img,
    image_type: (img.image_type || 'SUB').toUpperCase() as 'MAIN' | 'SUB'
  }));

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
      {error && (
        <div className="p-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* 画像アップロードセクション */}
      <div className="p-4">
        {propertyId ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写真
            </label>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {displayImages.map((image) => (
                  <div key={image.id} className="relative">
                    <div className="relative aspect-square">
                      <img
                        src={image.url}
                        alt="物件画像"
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
                propertyId={propertyId ? Number(propertyId) : undefined}
                clerkUserId={clerkUserId}
                existingImages={displayImages
                  .filter((img): img is Image & { image_type: 'MAIN' | 'SUB' } => 
                    img.image_type === 'MAIN' || img.image_type === 'SUB'
                  )
                  .map(img => ({
                    id: img.id,
                    image_type: img.image_type,
                    url: img.url
                  }))}
              />
            </div>
          </>
        ) : null}
      </div>

      {/* 基本情報セクション */}
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            物件名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：グランドメゾン青山"
          />
        </div>

        <div>
          <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
            物件タイプ <span className="text-red-500">*</span>
          </label>
          <select
            id="property_type"
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
          >
            <option value={PROPERTY_TYPES.HOUSE}>戸建</option>
            <option value={PROPERTY_TYPES.APARTMENT}>マンション</option>
            <option value={PROPERTY_TYPES.OTHER}>その他</option>
          </select>
        </div>

        <div>
          <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700">
            都道府県 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="prefecture"
            name="prefecture"
            value={formData.prefecture}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：東京都"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            物件説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            placeholder="物件の特徴や魅力を入力してください"
          />
        </div>
      </div>

      {/* 詳細情報セクション */}
      <div className="p-4 space-y-4">
        <h3 className="font-medium text-gray-900">詳細情報</h3>
        
        <div>
          <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
            間取
          </label>
          <input
            type="text"
            id="layout"
            name="layout"
            value={formData.layout || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：3LDK"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="construction_year" className="block text-sm font-medium text-gray-700">
              竣工年
            </label>
            <input
              type="number"
              id="construction_year"
              name="construction_year"
              value={formData.construction_year || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：2020"
            />
          </div>
          <div>
            <label htmlFor="construction_month" className="block text-sm font-medium text-gray-700">
              竣工月
            </label>
            <input
              type="number"
              id="construction_month"
              name="construction_month"
              min="1"
              max="12"
              value={formData.construction_month || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：4"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="site_area" className="block text-sm font-medium text-gray-700">
              敷地面積（㎡）
            </label>
            <input
              type="number"
              id="site_area"
              name="site_area"
              step="0.01"
              value={formData.site_area || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：120.50"
            />
          </div>
          <div>
            <label htmlFor="building_area" className="block text-sm font-medium text-gray-700">
              建築面積（㎡）
            </label>
            <input
              type="number"
              id="building_area"
              name="building_area"
              step="0.01"
              value={formData.building_area || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：95.20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="structure" className="block text-sm font-medium text-gray-700">
            構造
          </label>
          <select
            id="structure"
            name="structure"
            value={formData.structure || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
          >
            <option value="">選択してください</option>
            {Object.entries(STRUCTURE_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {STRUCTURE_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="sticky bottom-0 bg-white border-t p-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? '保存中...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};