import { useState, useCallback } from 'react';
import { Material, MaterialForm } from '../types';
import { mockApi } from '../utils/mockApi';

export const useMaterials = (roomId: string) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await mockApi.getMaterials(roomId);
      setMaterials(response.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  const addMaterial = useCallback(async (materialData: MaterialForm) => {
    try {
      const response = await mockApi.createMaterial(roomId, materialData);
      setMaterials(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Failed to add material:', error);
      throw error;
    }
  }, [roomId]);

  const updateMaterial = useCallback(async (materialId: string, materialData: Partial<MaterialForm>) => {
    try {
      const response = await mockApi.updateMaterial(roomId, materialId, materialData);
      setMaterials(prev => prev.map(m => m.id === materialId ? response.data : m));
      return response.data;
    } catch (error) {
      console.error('Failed to update material:', error);
      throw error;
    }
  }, [roomId]);

  const deleteMaterial = useCallback(async (materialId: string) => {
    try {
      await mockApi.deleteMaterial(roomId, materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
    } catch (error) {
      console.error('Failed to delete material:', error);
      throw error;
    }
  }, [roomId]);

  return {
    materials,
    isLoading,
    fetchMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
  };
};