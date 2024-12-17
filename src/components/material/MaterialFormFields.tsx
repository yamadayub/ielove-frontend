import React from 'react';
import { Material } from '../../types';

interface MaterialFormFieldsProps {
  material: Material;
  onChange: (field: keyof Material, value: string) => void;
}

export const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  material,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          仕上げ材名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={material.name}
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
          value={material.modelNumber}
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
          value={material.manufacturer}
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
          value={material.catalogUrl || ''}
          onChange={(e) => onChange('catalogUrl', e.target.value)}
          className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
    </div>
  );
};