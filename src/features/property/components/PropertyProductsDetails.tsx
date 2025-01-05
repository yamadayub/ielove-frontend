import React from 'react';
import { ProductDetailTile } from '../../product/components/ProductDetailTile';
import { ProductDetails } from '../../product/types/product_types';
import { Image } from '../../image/types/image_types';
import { useAuth } from '@clerk/clerk-react';

interface PropertyProductsDetailsProps {
  propertyId: string;
  products: ProductDetails[];
  images: Image[];
  isPurchased?: boolean;
  isOwner?: boolean;
}

export const PropertyProductsDetails: React.FC<PropertyProductsDetailsProps> = ({
  propertyId,
  products,
  images,
  isPurchased = false,
  isOwner = false,
}) => {
  const { userId } = useAuth();
  const shouldBlur = !userId || (!isPurchased && !isOwner);
  const showMessage = !userId || (!isPurchased && !isOwner && userId);

  return (
    <div className="mt-8">
      {showMessage && (
        <p className="text-sm text-gray-500 mb-4">
          仕様の詳細情報は詳細情報を購入すると表示されます
        </p>
      )}
      <div className="divide-y divide-gray-200">
        {products?.map(product => {
          const mainImage = images?.find(img => 
            img.product_id === product.id && 
            img.image_type === 'MAIN'
          );

          return (
            <ProductDetailTile
              key={product.id}
              product={product}
              mainImage={mainImage}
              propertyId={propertyId}
              shouldBlur={shouldBlur}
            />
          );
        })}
      </div>
    </div>
  );
}; 