import React from 'react';
import { Product } from '../../types';

interface ProductFormFieldsProps {
  product: Product;
  onChange: (field: keyof Product, value: string) => void;
}

export const ProductFormFields: React.FC<ProductFormFieldsProps> = ({
  product,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          インテリア名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          型番 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={product.modelNumber}
          onChange={(e) => onChange('modelNumber', e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          メーカー
        </label>
        <input
          type="text"
          value={product.manufacturer}
          onChange={(e) => onChange('manufacturer', e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          カタログURL
        </label>
        <input
          type="url"
          value={product.catalogUrl || ''}
          onChange={(e) => onChange('catalogUrl', e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
    </div>
  );
};