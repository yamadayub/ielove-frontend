import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, CheckCircle } from 'lucide-react';
import { Property } from '../../types';
import { useStore } from '../../store/useStore';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(property.id));

  return (
    <Link 
      to={`/property/${property.id}`} 
      className="block bg-white active:bg-gray-50 transition-colors relative group"
    >
      <div className="relative">
        <div className="relative aspect-square">
          <img
            src={property.thumbnail}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // お気に入り処理をここに追加
            }}
          >
            <Heart className="h-5 w-5 text-gray-900" />
          </button>
          {isPropertyPurchased && (
            <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
              <CheckCircle className="h-3 w-3" />
              <span className="font-medium">購入済み</span>
            </div>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-900">
            詳細を表示
          </div>
        </div>
        <div className="px-2 py-3">
          <h3 className="font-semibold text-gray-900">{property.name}</h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{property.description}</p>
        </div>
      </div>
    </Link>
  );
};