import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '../../components/property/PropertyForm';
import type { PropertyFormData, PropertyCreateData } from '../../types/property';
import { useUserProfile } from '../../api/queries/useUser';

export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: userProfile } = useUserProfile(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: PropertyFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/properties`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      navigate(`/property/${response.data.id}/edit`);
    } catch (error) {
      console.error('物件の作成に失敗しました:', error);
      setError('物件の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

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
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          userId={userProfile.id}
          submitButtonText="登録する"
        />
      </div>
    </div>
  );
};