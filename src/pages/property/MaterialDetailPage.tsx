import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMaterial } from '../../hooks/useMaterial';
import { MaterialHeader } from '../../components/material/MaterialHeader';
import { MaterialDetailView } from '../../components/material/MaterialDetailView';
import { useStore } from '../../store/useStore';

export const MaterialDetailPage: React.FC = () => {
  const { propertyId, materialId } = useParams<{
    propertyId: string;
    materialId: string;
  }>();
  const navigate = useNavigate();
  const { material, isLoading, error } = useMaterial(materialId!);
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(propertyId!));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-gray-900">仕上げ材が見つかりませんでした</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <MaterialHeader 
        title={material.type}
        onBack={() => navigate(-1)}
      />

      <MaterialDetailView
        material={material}
        isPurchased={isPropertyPurchased}
      />
    </div>
  );
};