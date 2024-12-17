import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Material } from '../../types';
import { useImageUpload } from '../../hooks/useImageUpload';
import { ImageUploader } from '../../components/property/ImageUploader';
import { MaterialHeader } from '../../components/material/MaterialHeader';
import { MaterialFormFields } from '../../components/material/MaterialFormFields';
import { mockApi } from '../../utils/mockApi';

export const EditMaterialPage: React.FC = () => {
  const { propertyId, roomId, materialId } = useParams<{
    propertyId: string;
    roomId: string;
    materialId: string;
  }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageUploader = useImageUpload();

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        if (!materialId) return;
        const response = await mockApi.getMaterial(materialId);
        setMaterial(response.data);
        
        // 既存の画像をセット
        if (response.data.imageUrl) {
          imageUploader.setImages([{
            id: response.data.imageUrl,
            url: response.data.imageUrl,
            status: 'completed'
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch material:', error);
        setError('仕上げ材の読み込みに失敗しました');
      }
    };

    fetchMaterial();
  }, [materialId, imageUploader]);

  const handleFieldChange = (field: keyof Material, value: string) => {
    if (!material) return;
    setMaterial({ ...material, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedMaterial = {
        ...material,
        imageUrl: imageUploader.images[0]?.url
      };
      await mockApi.updateMaterial(materialId!, updatedMaterial);
      navigate(`/property/${propertyId}/room/${roomId}/edit`);
    } catch (error) {
      console.error('Failed to update material:', error);
      setError('仕上げ材の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!material) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <MaterialHeader 
        title={`${material.type}の編集`}
        onBack={() => navigate(-1)}
      />

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:shadow-sm md:my-8">
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写真
            </label>
            <ImageUploader
              images={imageUploader.images}
              onUpload={(e) => imageUploader.handleUpload(e.target.files)}
              onDelete={imageUploader.deleteImage}
            />
          </div>

          <MaterialFormFields
            material={material}
            onChange={handleFieldChange}
          />

          <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? '保存中...' : '変更を保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};