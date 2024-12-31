import React from 'react';
import { Property } from '../types/property_types';
import { PurchaseButton } from '../../purchase/components/PurchaseButton';

interface PropertyInfoProps {
  property: Property;
  isPurchased?: boolean;
  isLoading?: boolean;
  listingId?: number;
  price?: number;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ 
  property,
  isPurchased,
  isLoading,
  listingId,
  price
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-semibold text-gray-900">{property.name}</h2>
        <div className="mt-4 space-y-4">
          {/* ... 他の物件情報 ... */}
        </div>
      </div>
      <div className="px-4 py-4">
        <PurchaseButton
          propertyId={property.id ?? 0}
          listingId={listingId}
          isPurchased={isPurchased}
          isLoading={isLoading}
          price={price}
        />
      </div>
    </div>
  );
}; 