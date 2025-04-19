import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onEditProduct }) => {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEditProduct(product)}
        />
      ))}
    </div>
  );
};