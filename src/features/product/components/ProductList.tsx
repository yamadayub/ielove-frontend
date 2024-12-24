import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product_types';

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
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">仕上げ材が登録されていません</p>
      </div>
    );
  }

  const handleProductClick = (productId: number | undefined) => {
    if (productId === undefined) return;
    navigate(`/property/${propertyId}/room/${roomId}/product/${productId}`);
  };

  return (
    <div className="py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            )}
            <div className="text-sm text-gray-500">
              <p>商品コード: {product.product_code}</p>
              {product.catalog_url && (
                <a
                  href={product.catalog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  カタログを見る
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};