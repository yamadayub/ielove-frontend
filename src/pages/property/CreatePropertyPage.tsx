import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '../../hooks/useImageUpload';
import { PropertyForm as PropertyFormType } from '../../types';
import { PropertyForm } from '../../components/property/PropertyForm';
import { mockApi } from '../../utils/mockApi';
import { ArrowLeft } from 'lucide-react';

export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const [property, setProperty] = React.useState<PropertyFormType>({
    name: '',
    location: '',
    description: '',
    property_type: 'house',
    layout: '',
    construction_year: undefined,
    construction_month: undefined,
    site_area: undefined,
    building_area: undefined,
    floor_count: undefined,
    structure: '',
    images: [],
  });

  const { images, handleUpload, deleteImage, isUploading } = useImageUpload();

  const handlePropertyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProperty(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setProperty(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const imageUrls = images.map(img => img.url);
      const propertyData = {
        ...property,
        images: imageUrls,
      };

      const response = await mockApi.createProperty(propertyData);
      navigate(`/property/${response.data.id}/edit`);
    } catch (error) {
      console.error('Failed to create property:', error);
      setError('物件の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">新規物件登録</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">新規物件登録</h1>
      </div>

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="md:max-w-2xl md:mx-auto md:bg-white md:rounded-lg md:shadow-sm md:my-8">
        <PropertyForm
          property={property}
          images={images}
          onPropertyChange={handlePropertyChange}
          onImageUpload={(e) => handleUpload(e.target.files)}
          onImageDelete={deleteImage}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isUploading}
          submitLabel={isSubmitting ? '登録中...' : '物件を登録'}
        />
      </div>
    </div>
  );
};