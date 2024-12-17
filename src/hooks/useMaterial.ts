import { useState, useEffect } from 'react';
import { Material } from '../types';
import { mockApi } from '../utils/mockApi';

export const useMaterial = (materialId: string) => {
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await mockApi.getMaterial(materialId);
        setMaterial(response.data);
      } catch (err) {
        setError('Failed to fetch material');
        console.error('Failed to fetch material:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (materialId) {
      fetchMaterial();
    }
  }, [materialId]);

  return {
    material,
    isLoading,
    error,
  };
};