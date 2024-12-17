import React from 'react';
import { PropertyCard } from '../components/common/PropertyCard';
import { MOCK_PROPERTIES } from '../utils/mockData';

export const HomePage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100">
      {MOCK_PROPERTIES.map((property) => (
        <div key={property.id} className="bg-white">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
};