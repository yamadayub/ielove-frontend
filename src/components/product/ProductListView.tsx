import React from 'react';
import { Product } from '../../types';
import { ProductRow } from './ProductRow';

interface ProductListViewProps {
  propertyId: string;
  roomId: string;
  products: Product[];
  isPurchased?: boolean;
}

export const ProductListView: React.FC<ProductListViewProps> = ({ 
  propertyId, 
  roomId, 
  products,
  isPurchased = false
}) => {
  return (
    <div className="divide-y divide-gray-100 -mx-4 bg-white">
      {products.map((product) => (
        <ProductRow
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