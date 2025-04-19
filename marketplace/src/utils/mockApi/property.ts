import { Property, PropertyForm } from '../../types';
import { MOCK_PROPERTIES } from '../mockData/properties';
import { createDefaultRooms } from '../mockData/rooms';

// In-memory store for created properties
const createdProperties = new Map<string, Property>();

export const propertyApi = {
  createProperty: async (data: PropertyForm): Promise<{ data: Property }> => {
    const id = `property-${Date.now()}`;
    const property: Property = {
      id,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Store the property
    createdProperties.set(id, property);
    
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: property }), 500);
    });
  },

  getProperty: async (id: string): Promise<{ data: Property }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // First check mock properties
        const mockProperty = MOCK_PROPERTIES.find(p => p.id === id);
        if (mockProperty) {
          resolve({ data: mockProperty });
          return;
        }

        // Then check created properties
        const createdProperty = createdProperties.get(id);
        if (createdProperty) {
          resolve({ data: createdProperty });
          return;
        }

        // If not found, create a new mock property
        const mockData: Property = {
          id,
          name: 'グランドメゾン青山',
          location: '東京都港区南青山1-1-1',
          description: '緑豊かな環境と都会の利便性を兼ね備えた邸宅',
          property_type: 'house',
          layout: '3LDK',
          construction_year: 2020,
          construction_month: 4,
          site_area: 120.5,
          building_area: 95.2,
          floor_count: 3,
          structure: 'RC造',
          images: [
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        createdProperties.set(id, mockData);
        resolve({ data: mockData });
      }, 500);
    });
  },
};