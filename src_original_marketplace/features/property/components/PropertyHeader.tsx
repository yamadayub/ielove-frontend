import React from 'react';
import { MapPin, Heart, Share2 } from 'lucide-react';
import { Property } from '../../types';

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="bg-white">
      <div className="aspect-w-16 aspect-h-9 md:aspect-h-7">
        <img
          src={property.thumbnail}
          alt={property.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-6 w-6 text-gray-900" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Share2 className="h-6 w-6 text-gray-900" />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
        </div>
        <p className="mt-4 text-gray-600">{property.description}</p>
      </div>
    </div>
  );
};