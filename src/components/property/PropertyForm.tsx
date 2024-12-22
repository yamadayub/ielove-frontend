import React, { useState } from 'react';
import type { PropertyFormData } from '../../types/property';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  initialData?: Partial<PropertyFormData>;
  isSubmitting?: boolean;
  userId: number;
  submitButtonText?: string;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  initialData = {},
  isSubmitting = false,
  userId,
  submitButtonText = '登録する',
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    user_id: userId,
    name: '',
    description: '',
    property_type: 'house',
    prefecture: '',
    layout: '',
    construction_year: undefined,
    construction_month: undefined,
    site_area: undefined,
    building_area: undefined,
    floor_count: undefined,
    structure: '',
    design_company_id: undefined,
    construction_company_id: undefined,
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // 数値フィールドの処理
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
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
            <option value="house">戸建</option>
            <option value="apartment">マンション</option>
            <option value="other">その他</option>
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
            間取り
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
          {isSubmitting ? '送信中...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};