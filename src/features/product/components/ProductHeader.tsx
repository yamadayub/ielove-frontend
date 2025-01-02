import React from 'react';
import { PurchaseButton } from '../../purchase/components/PurchaseButton';
import type { Image } from '../../image/types/image_types';

interface ProductHeaderProps {
  name: string;
  productCategoryName: string;
  displayImage?: Image;
  propertyId: number;
  listingId?: number;
  isPurchased?: boolean;
  isLoading?: boolean;
  price?: number;
  isOwner?: boolean;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  productCategoryName,
  displayImage,
  propertyId,
  listingId,
  isPurchased,
  isLoading,
  price,
  isOwner
}) => {
  return (
    <div className="bg-white">
      <div className="aspect-w-16 aspect-h-9 md:aspect-h-7">
        <img
          src={displayImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <div className="text-gray-600 mt-2">
              <span>{productCategoryName}</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <PurchaseButton
            propertyId={propertyId}
            listingId={listingId}
            isPurchased={isPurchased}
            isLoading={isLoading}
            price={price}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}; 