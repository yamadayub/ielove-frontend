import React from 'react';
import { ProductTile } from './ProductTile';
import type { Product } from '../../types/product';

interface ProductListProps {
  propertyId: string;
  roomId: string;
  products: Product[];
  isPurchased?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  propertyId,
  roomId,
  products,
  isPurchased = false
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">仕上げ材が登録されていません</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {products.map((product) => (
        <ProductTile
          key={product.id}
          product={product}
          propertyId={propertyId}
          roomId={roomId}
          isPurchased={isPurchased}
        />
      ))}
    </div>
  );
};