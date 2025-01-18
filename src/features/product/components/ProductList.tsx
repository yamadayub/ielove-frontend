import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product_types';
import type { Image } from '../../image/types/image_types';

interface ProductListProps {
  propertyId: string;
  roomId: string;
  products: Product[];
  images: Image[];
  isPurchased?: boolean;
  isOwner?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  propertyId,
  roomId,
  products,
  images,
  isPurchased = false,
  isOwner = false
}) => {
  const navigate = useNavigate();

  const shouldBlur = !isPurchased && !isOwner;

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">インテリアが登録されていません</p>
      </div>
    );
  }

  const handleProductClick = (productId: number) => {
    navigate(`/property/${propertyId}/room/${roomId}/product/${productId}`);
  };

  const getMainImage = (productId: number): Image | undefined => {
    return images.find(img => 
      img.product_id === productId && 
      img.image_type === 'MAIN'
    );
  };

  return (
    <div className="grid grid-cols-3">
      {products.map((product) => {
        const mainImage = getMainImage(product.id || 0);
        
        return (
          <div
            key={product.id}
            onClick={() => product.id && handleProductClick(product.id)}
            className="relative bg-white overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 z-10">
              <p className="text-xs font-medium truncate">{product.product_category_name || '未分類'}</p>
            </div>
            <div className="aspect-square">
              <img
                src={mainImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
                alt={product.name}
                className="w-full h-full object-cover transition-all"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};