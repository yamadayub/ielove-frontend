import React from 'react';
import { PropertyCard } from '../components/common/PropertyCard';
import { useProperties } from '../api/quieries/useProperties'; // 新しいフックをインポート

export const HomePage = () => {
  const { data: properties, isLoading, error } = useProperties(); // フックを使用

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading properties</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100">
      {properties?.map((property) => (
        <div key={property.id} className="bg-white">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
};