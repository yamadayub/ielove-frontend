import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../utils/mockData';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { RoomNavigation } from '../components/property/RoomNavigation';
import { MapPin, Heart, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PropertyPage = () => {
  const { id } = useParams();
  const property = MOCK_PROPERTIES.find(p => p.id === id);
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(id || ''));

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-gray-900">物件が見つかりませんでした</h2>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PropertyGallery images={property.images} />
      
      {/* 物件情報 */}
      <div className="px-4 py-6 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
              <span className="text-sm md:text-base">{property.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
              <Heart className="h-5 w-5 text-gray-900" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
              <Share2 className="h-5 w-5 text-gray-900" />
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm md:text-base text-gray-600">{property.description}</p>
      </div>

      {/* 購入ボタン */}
      <div className="px-4 py-4">
        <button
          onClick={() => window.location.href = `/checkout?propertyId=${property.id}`}
          disabled={isPropertyPurchased}
          className={`w-full py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm md:text-base ${
            isPropertyPurchased
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } transition-colors`}
        >
          {isPropertyPurchased ? (
            <span className="font-medium">購入済み</span>
          ) : (
            <span className="font-medium">物件仕様を購入する</span>
          )}
        </button>
      </div>

      {/* 部屋一覧 */}
      <RoomNavigation propertyId={property.id} />
    </div>
  );
};