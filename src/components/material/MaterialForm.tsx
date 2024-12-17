import React from 'react';
import { MaterialForm as MaterialFormType } from '../../types';
import { ImageUploader } from '../property/ImageUploader';
import { useImageUpload } from '../../hooks/useImageUpload';

interface MaterialFormProps {
  material?: MaterialFormType;
  onSubmit: (data: MaterialFormType) => void;
  onCancel: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  material,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState<MaterialFormType>(
    material || {
      name: '',
      type: '',
      manufacturer: '',
      modelNumber: '',
      color: '',
      dimensions: '',
      details: '',
    }
  );

  const imageUploader = useImageUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      imageUrl: imageUploader.images[0]?.url,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          写真
        </label>
        <ImageUploader
          images={imageUploader.images}
          onUpload={(e) => imageUploader.handleUpload(e.target.files)}
          onDelete={imageUploader.deleteImage}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          名称
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-900 focus:ring-gray-900"
        />
      </div>

      {/* 他のフィールドも同様に */}

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