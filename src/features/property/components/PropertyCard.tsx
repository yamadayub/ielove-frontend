import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useImages } from '../../image/hooks/useImages';
import type { Property } from '../types/property_types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isPropertyPurchased = useStore((state) => 
    property.id ? state.isPropertyPurchased(property.id.toString()) : false
  );
  
  const { data: images } = useImages({ 
    propertyId: property.id?.toString()
  });
  
  const propertyImages = images?.filter(img => !img.room_id && !img.product_id) || [];

  useEffect(() => {
    const mainImageIndex = propertyImages.findIndex(img => img.image_type === 'MAIN');
    if (mainImageIndex !== -1) {
      setCurrentImageIndex(mainImageIndex);
    }
  }, [propertyImages]);

  if (!property.id) return null;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? propertyImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === propertyImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        {propertyImages.length > 0 ? (
          <>
            <Link to={`/property/${property.id}`}>
              <img
                src={propertyImages[currentImageIndex].url}
                alt={`${property.name} - ${propertyImages[currentImageIndex].image_type === 'main' ? 'メイン画像' : `画像 ${currentImageIndex + 1}`}`}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </Link>
            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {propertyImages.map((img, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      } ${img.image_type === 'main' ? 'ring-2 ring-white ring-offset-1 ring-offset-black/50' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        {isPropertyPurchased && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center z-10">
            <span className="text-sm">購入済み</span>
          </div>
        )}
      </div>
      <Link to={`/properties/${property.id}`}>
        <div className="p-4">
          <h3 className="font-bold text-gray-900">{property.name}</h3>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.prefecture}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};