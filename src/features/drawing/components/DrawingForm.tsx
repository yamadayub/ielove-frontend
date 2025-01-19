import React, { useState } from 'react';
import { ImageUploader } from '../../image/components/ImageUploader';
import type { Drawing } from '../types/drawing_types';
import type { ImageData, ImageType } from '../../image/types/image_types';
import { X } from 'lucide-react';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';

const IMAGE_TYPE_LABELS = {
  'MAIN': 'メイン画像',
  'SUB': 'サブ画像',
  'PAID': '有料画像'
} as const;

interface DrawingFormProps {
  onSubmit: (data: Drawing) => Promise<void>;
  initialData?: Partial<Drawing>;
  isSubmitting?: boolean;
  propertyId: number;
  clerkUserId: string;
  existingImages?: ImageData[];
  onImageChange?: () => void;
  drawingId?: number;
}

export const DrawingForm: React.FC<DrawingFormProps> = ({
  onSubmit,
  initialData = {},
  isSubmitting = false,
  propertyId,
  clerkUserId,
  existingImages = [],
  onImageChange,
  drawingId
}) => {
  const [formData, setFormData] = useState<Partial<Drawing>>({
    name: '',
    description: '',
    property_id: propertyId,
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);
  const axios = useAuthenticatedAxios();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Drawing>) => ({ ...prev, [name]: value }));
  };

  const handleImageDelete = async (imageId: number) => {
    if (!clerkUserId) return;

    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      if (onImageChange) {
        onImageChange();
      }
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      setError('画像の削除に失敗しました');
    }
  };

  const handleImageTypeChange = async (imageId: number, newType: ImageType) => {
    if (!clerkUserId) return;

    try {
      await axios.patch(
        ENDPOINTS.UPDATE_IMAGE_TYPE(imageId),
        { image_type: newType },
        {
          headers: {
            'x-clerk-user-id': clerkUserId
          }
        }
      );
      if (onImageChange) {
        onImageChange();
      }
    } catch (error) {
      console.error('画像タイプの更新に失敗しました:', error);
      setError('画像タイプの更新に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      await onSubmit(formData as Drawing);
    } catch (error) {
      console.error('図面の保存に失敗しました:', error);
      setError('図面の保存に失敗しました。もう一度お試しください。');
    }
  };

  const handleImageUploaded = (imageData: ImageData) => {
    if (onImageChange) {
      onImageChange();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          図面名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
          placeholder="例：1階平面図"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
          placeholder="図面の説明を入力してください"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          図面画像
        </label>
        {existingImages && existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt="図面画像"
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
                    value={image.image_type || 'PAID'}
                    onChange={(e) => handleImageTypeChange(image.id, e.target.value as ImageType)}
                    className="block w-full rounded-lg border-gray-200 text-sm focus:border-gray-900 focus:ring-0"
                  >
                    {Object.entries(IMAGE_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-1">
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            onError={setError}
            propertyId={propertyId}
            clerkUserId={clerkUserId}
            imageType="PAID"
            drawingId={drawingId}
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? '保存中...' : '保存する'}
        </button>
      </div>
    </form>
  );
}; 