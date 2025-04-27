import React from 'react';
import { Product } from '../../types';
import { BlurredProductCard } from './BlurredProductCard';

interface RoomProductsProps {
  products: Product[];
}

export const RoomProducts: React.FC<RoomProductsProps> = ({ products }) => {
  const categories = {
    wallpaper: '壁紙',
    lighting: '照明',
    fixture: '設備',
    other: 'その他',
  };

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="py-6 space-y-8">
      {Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {categories[category as keyof typeof categories]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <BlurredProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};