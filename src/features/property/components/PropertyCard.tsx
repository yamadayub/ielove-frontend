import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { useImages } from '../../image/hooks/useImages';
import type { Property } from '../types/property_types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  
  const isPropertyPurchased = useStore((state) => 
    property.id ? state.isPropertyPurchased(property.id.toString()) : false
  );
  
  const { data: images } = useImages({ 
    propertyId: property.id?.toString()
  });
  
  const mainImage = images?.find(img => !img.room_id && !img.product_id && img.image_type === 'MAIN');

  if (!property.id) return null;

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="bg-white cursor-pointer border-b pb-8" onClick={handleClick}>
      <div className="relative aspect-[4/3]">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={`${property.name} - メイン画像`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {isPropertyPurchased && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
            <span className="text-sm">購入済み</span>
          </div>
        )}
      </div>
      <div className="py-3 px-2">
        <h3 className="font-bold text-gray-900">{property.name}</h3>
        <p className="text-sm text-gray-600 mt-2 truncate overflow-hidden whitespace-nowrap">{property.description}</p>
      </div>
    </div>
  );
};