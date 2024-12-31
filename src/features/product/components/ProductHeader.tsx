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
}) => {
  return (
    <div className="bg-white">
      {/* メイン画像 */}
      <div className="aspect-square md:aspect-video w-full">
        <img
          src={displayImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
          alt={name || '製品画像'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 購入ボタン */}
      <div className="px-4 py-4">
        <PurchaseButton
          propertyId={propertyId}
          listingId={listingId}
          isPurchased={isPurchased}
          isLoading={isLoading}
          price={price}
        />
      </div>

      {/* カテゴリー名と製品名を1行に */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">
          {productCategoryName || 'カテゴリーなし'}
          <span className="ml-2 font-medium">
            {name}
          </span>
        </h2>
      </div>
    </div>
  );
}; 