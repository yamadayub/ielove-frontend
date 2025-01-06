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

// 都道府県の定数を追加
const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
] as const;

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
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* 画像アップロードセクション */}
      {propertyId ? (
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
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
                      className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
                    >
                      <option value="MAIN">メイン画像</option>
                      <option value="SUB">サブ画像</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">物件全体の写真を追加</p>
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
          </div>
        </div>
      ) : null}

      {/* 基本情報セクション */}
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
            placeholder="例：ジャパンディな明るい平家"
          />
        </div>

        <div>
          <label htmlFor="property_type" className="block text-sm mb-2">
            物件種別 <span className="text-red-500">*</span>
          </label>
          <select
            id="property_type"
            name="property_type"
            value={formData.property_type}
            onChange={handleInputChange}
            required
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
          >
            <option value={PROPERTY_TYPES.HOUSE}>戸建</option>
            <option value={PROPERTY_TYPES.APARTMENT}>マンション</option>
            <option value={PROPERTY_TYPES.OTHER}>その他</option>
          </select>
        </div>

        <div>
          <label htmlFor="prefecture" className="block text-sm mb-2">
            都道府県 <span className="text-red-500">*</span>
          </label>
          <select
            id="prefecture"
            name="prefecture"
            value={formData.prefecture}
            onChange={handleInputChange}
            required
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm mb-2">
            物件説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
            placeholder="物件の特徴や魅力を入力してください&#13;&#10;&#13;&#10;例：異素材を組み合わせたジャパンディハウスです。壁は漆喰を使って、質感を感じることができます。"
          />
        </div>
      </div>

      {/* 詳細情報セクション */}
      <div className="p-6 space-y-6">
        <h3 className="text-sm">詳細情報</h3>
        
        <div>
          <label htmlFor="layout" className="block text-sm mb-2">
            間取
          </label>
          <input
            type="text"
            id="layout"
            name="layout"
            value={formData.layout || ''}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
            placeholder="例：3LDK"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="construction_year" className="block text-sm mb-2">
              竣工年
            </label>
            <input
              type="number"
              id="construction_year"
              name="construction_year"
              value={formData.construction_year || ''}
              onChange={handleInputChange}
              className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
              placeholder="例：2020"
            />
          </div>
          <div>
            <label htmlFor="construction_month" className="block text-sm mb-2">
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
              className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
              placeholder="例：4"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="site_area" className="block text-sm mb-2">
              敷地面積（㎡）
            </label>
            <input
              type="number"
              id="site_area"
              name="site_area"
              step="0.01"
              value={formData.site_area || ''}
              onChange={handleInputChange}
              className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
              placeholder="例：120.50"
            />
          </div>
          <div>
            <label htmlFor="building_area" className="block text-sm mb-2">
              建築面積（㎡）
            </label>
            <input
              type="number"
              id="building_area"
              name="building_area"
              step="0.01"
              value={formData.building_area || ''}
              onChange={handleInputChange}
              className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
              placeholder="例：95.20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="structure" className="block text-sm mb-2">
            構造
          </label>
          <select
            id="structure"
            name="structure"
            value={formData.structure || ''}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
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
      <div className="sticky bottom-0 bg-white p-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 rounded-lg text-white text-sm transition-colors ${
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