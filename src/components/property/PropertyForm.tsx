import React from 'react';
import { PropertyForm as PropertyFormType } from '../../types';
import { ImageUploader } from './ImageUploader';
import { UploadedImage } from '../../types';
import { Camera } from 'lucide-react';

interface PropertyFormProps {
  property: PropertyFormType;
  images: UploadedImage[];
  onPropertyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (imageId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  images,
  onPropertyChange,
  onImageUpload,
  onImageDelete,
  onSubmit,
  isSubmitting = false,
  submitLabel = '登録する'
}) => {
  return (
    <form onSubmit={onSubmit} className="divide-y divide-gray-100">
      {/* 画像アップロードセクション */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            物件写真
          </label>
          <Camera className="h-5 w-5 text-gray-400" />
        </div>
        <ImageUploader
          images={images}
          onUpload={onImageUpload}
          onDelete={onImageDelete}
        />
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
            required
            value={property.name}
            onChange={onPropertyChange}
            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：グランドメゾン青山"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            所在地 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={property.location}
            onChange={onPropertyChange}
            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：東京都港区南青山1-1-1"
          />
        </div>

        <div>
          <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
            物件タイプ <span className="text-red-500">*</span>
          </label>
          <select
            id="property_type"
            name="property_type"
            required
            value={property.property_type}
            onChange={onPropertyChange}
            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
          >
            <option value="house">一戸建て</option>
            <option value="apartment">マンション</option>
            <option value="other">その他</option>
          </select>
        </div>
      </div>

      {/* 詳細情報セクション */}
      <div className="p-4 space-y-4">
        <h3 className="font-medium text-gray-900">詳細情報</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="layout" className="block text-sm font-medium text-gray-700">
              間取り
            </label>
            <input
              type="text"
              id="layout"
              name="layout"
              value={property.layout || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：3LDK"
            />
          </div>
          <div>
            <label htmlFor="structure" className="block text-sm font-medium text-gray-700">
              構造
            </label>
            <input
              type="text"
              id="structure"
              name="structure"
              value={property.structure || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：RC造"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="construction_year" className="block text-sm font-medium text-gray-700">
              築年
            </label>
            <input
              type="number"
              id="construction_year"
              name="construction_year"
              value={property.construction_year || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：2020"
            />
          </div>
          <div>
            <label htmlFor="construction_month" className="block text-sm font-medium text-gray-700">
              築月
            </label>
            <input
              type="number"
              id="construction_month"
              name="construction_month"
              min="1"
              max="12"
              value={property.construction_month || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
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
              value={property.site_area || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：120.50"
            />
          </div>
          <div>
            <label htmlFor="building_area" className="block text-sm font-medium text-gray-700">
              専有面積（㎡）
            </label>
            <input
              type="number"
              id="building_area"
              name="building_area"
              step="0.01"
              value={property.building_area || ''}
              onChange={onPropertyChange}
              className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
              placeholder="例：95.20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="floor_count" className="block text-sm font-medium text-gray-700">
            階数
          </label>
          <input
            type="number"
            id="floor_count"
            name="floor_count"
            min="1"
            value={property.floor_count || ''}
            onChange={onPropertyChange}
            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
            placeholder="例：3"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            物件説明
          </label>
          <textarea
            id="description"
            name="description"
            value={property.description}
            onChange={onPropertyChange}
            rows={4}
            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
            placeholder="物件の特徴や魅力を入力してください"
          />
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
          {submitLabel}
        </button>
      </div>
    </form>
  );
};