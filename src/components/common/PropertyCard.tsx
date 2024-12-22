import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Property } from '../../types/property';
import { useImages } from '../../api/quieries/useImages';

export const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  console.log('🏠 PropertyCard rendering:', property.id);  // レンダリング確認

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('/placeholder-property.jpg');
  const isPropertyPurchased = useStore((state: any) => state.isPropertyPurchased(property.id));
  
  // propertyIdが文字列の場合、適切に数値に変換
  const propertyId = parseInt(property.id);
  
  // propertyIdが有効な数値かチェック
  console.log('🔢 Parsed property ID:', {
    original: property.id,
    parsed: propertyId,
    isValid: !isNaN(propertyId)
  });

  const { data: images, isLoading, isError, error } = useImages({
    entity_type: 'property',
    entity_id: propertyId
  });

  useEffect(() => {
    console.log('🔄 Query state:', {
      propertyId,
      isLoading,
      isError,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasImages: Boolean(images?.length),
      imagesCount: images?.length,
      firstImageUrl: images?.[0]?.url
    });

    if (isError) {
      console.error('❌ Error loading images:', error);
    }
  }, [propertyId, images, isLoading, isError, error]);

  useEffect(() => {
    if (!isLoading && !isError && images?.length > 0) {
      const mainImage = images.find(img => img.image_type === 'main') || images[0];
      console.log('🎯 Processing image:', {
        mainImage,
        allImages: images,
        currentImageUrl: imageUrl
      });
      
      if (mainImage?.url) {
        console.log('🔄 Setting new image URL:', mainImage.url);
        setImageUrl(mainImage.url);
      } else {
        console.log('⚠️ No valid image URL found');
      }
    }
  }, [isLoading, isError, images]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageUrl('/placeholder-property.jpg');
    setImageLoaded(true);
  };

  return (
    <Link 
      to={`/property/${property.id}`} 
      className="block bg-white active:bg-gray-50 transition-colors relative group"
    >
      <div className="relative">
        <div className="relative aspect-square bg-gray-100">
          {(isLoading || !imageLoaded) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 w-full h-full" />
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-500">画像を読み込めませんでした</span>
            </div>
          )}
          {!isError && (
            <img
              src={imageUrl}
              alt={property.name}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
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