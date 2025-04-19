import React from 'react';
import type { SpecificationField } from '../types/product_types';

interface SpecificationFormProps {
  specification: SpecificationField;
  onChange: (key: keyof SpecificationField, value: string) => void;
}

export const SpecificationForm: React.FC<SpecificationFormProps> = ({
  specification,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          メーカー
        </label>
        <input
          type="text"
          value={specification.manufacturer}
          onChange={(e) => onChange('manufacturer', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          型番
        </label>
        <input
          type="text"
          value={specification.modelNumber}
          onChange={(e) => onChange('modelNumber', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          色
        </label>
        <input
          type="text"
          value={specification.color}
          onChange={(e) => onChange('color', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          寸法
        </label>
        <input
          type="text"
          value={specification.dimensions}
          onChange={(e) => onChange('dimensions', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">
          詳細情報
        </label>
        <textarea
          value={specification.details}
          onChange={(e) => onChange('details', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
        />
      </div>
    </div>
  );
};