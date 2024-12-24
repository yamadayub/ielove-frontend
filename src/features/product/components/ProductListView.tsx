import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product_types';

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
  const navigate = useNavigate();

  const handleProductClick = (productId: number | undefined) => {
    if (productId === undefined) return;
    navigate(`/property/${propertyId}/room/${roomId}/product/${productId}`);
  };

  return (
    <div className="divide-y divide-gray-100 -mx-4 bg-white">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => handleProductClick(product.id)}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
              <div className="text-sm text-gray-500 mt-2">
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
          </div>
        </div>
      ))}
    </div>
  );
};