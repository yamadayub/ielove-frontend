import { Material, MaterialForm } from '../../types';
import { DEFAULT_MATERIALS } from '../mockData/materials';

export const materialApi = {
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

  getMaterials: async (roomId: string): Promise<{ data: Material[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const materials = Object.values(DEFAULT_MATERIALS);
        resolve({ data: materials });
      }, 500);
    });
  },

  createMaterial: async (roomId: string, data: MaterialForm): Promise<{ data: Material }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material: Material = {
          id: `material-${Date.now()}`,
          ...data,
          additionalDetails: {},
        };
        resolve({ data: material });
      }, 500);
    });
  },

  updateMaterial: async (materialId: string, data: Partial<Material>): Promise<{ data: Material }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const material = DEFAULT_MATERIALS[materialId];
        if (!material) throw new Error('Material not found');
        
        const updatedMaterial = {
          ...material,
          ...data,
        };
        resolve({ data: updatedMaterial });
      }, 500);
    });
  },
};