import { Property, Room, Material, PropertyForm } from '../types';
import { DEFAULT_MATERIALS } from './mockData/materials';

export const mockApi = {
  // 物件関連
  createProperty: async (data: PropertyForm): Promise<{ data: Property }> => {
    const property: Property = {
      id: `property-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: property }), 500);
    });
  },

  // 仕上げ材関連
  getMaterial: async (materialId: string): Promise<{ data: Material }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const material = DEFAULT_MATERIALS[materialId];
        if (material) {
          resolve({ data: material });
        } else {
          reject(new Error('Material not found'));
        }
      }, 500);
    });
  },

  updateMaterial: async (materialId: string, data: Partial<Material>): Promise<{ data: Material }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const baseMaterial = DEFAULT_MATERIALS[materialId] || DEFAULT_MATERIALS.f1;
        const updatedMaterial = { ...baseMaterial, ...data, id: materialId };
        resolve({ data: updatedMaterial });
      }, 500);
    });
  },
};