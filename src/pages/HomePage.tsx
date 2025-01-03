import React from 'react';
import { PropertyCard } from '../features/property/components/PropertyCard';
import { useProperties } from '../features/property/hooks/useProperties';
import { Loader2 } from 'lucide-react';

export const HomePage = () => {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <p className="text-gray-500 text-center">
          物件情報の取得中にエラーが発生しました。<br />
          しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }

  if (!properties?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
        <p className="text-gray-500 text-center">
          現在、表示できる物件がありません。
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
};