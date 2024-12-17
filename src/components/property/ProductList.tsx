import React from 'react';
import { Room } from '../../types';
import { MOCK_ROOMS } from '../../utils/mockData';

interface ProductListProps {
  propertyId: string;
}

export const ProductList: React.FC<ProductListProps> = ({ propertyId }) => {
  const rooms = MOCK_ROOMS.filter(room => room.propertyId === propertyId);
  
  if (rooms.length === 0) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
            <div className="space-y-2">
              {Object.entries(room.specifications).map(([key, spec]) => {
                if (key === 'furniture' || key === 'kitchen') return null;
                return (
                  <div key={key} className="text-sm text-gray-600">
                    <span className="font-medium">{spec.type}:</span> {spec.name}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};