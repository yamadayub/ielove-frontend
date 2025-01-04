import React from 'react';
import { ProductDetailTile } from '../../product/components/ProductDetailTile';
import { ProductDetails } from '../../product/types/product_types';
import { Image } from '../../image/types/image_types';

interface PropertyProductsDetailsProps {
  propertyId: string;
  products: ProductDetails[];
  images: Image[];
}

export const PropertyProductsDetails: React.FC<PropertyProductsDetailsProps> = ({
  propertyId,
  products,
  images,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-medium mb-6">使用製品一覧</h2>
      <div className="divide-y divide-gray-200">
        {products?.map(product => {
          const mainImage = images?.find(img => 
            img.product_id === product.id && 
            img.image_type === 'MAIN'
          );

          if (!mainImage) return null;

          return (
            <ProductDetailTile
              key={product.id}
              product={product}
              mainImage={mainImage}
              propertyId={propertyId}
            />
          );
        })}
      </div>
    </div>
  );
}; 