import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product_types';
import { ArrowUpRight } from 'lucide-react';
import { useImages } from '../../../features/image/hooks/useImages';

interface ProductRowProps {
  product: Product;
  propertyId: string;
  roomId: string;
  isPurchased: boolean;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  propertyId,
  roomId,
  isPurchased
}) => {
  const { data: images, isLoading } = useImages({
    entity_type: 'product',
    entity_id: parseInt(product.id)
  });

  const mainImage = images?.find(img => img.image_type === 'main');
  const imageUrl = mainImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  return (
    <Link
      to={`/property/${propertyId}/room/${roomId}/product/${product.id}`}
      className="block hover:bg-gray-50/80 transition-colors"
    >
      <div className="flex items-center">
        <div className="w-24 h-24 flex-shrink-0 relative">
          {isLoading ? (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          ) : (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <h3 className="text-white text-sm font-medium text-center px-2">
                  {product.product_category_name}
                </h3>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 min-w-0 pl-4 pr-3 py-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.type}
              </h3>
              <p className="mt-1 text-sm text-gray-600 truncate">
                {product.name}
              </p>
              <div className={!isPurchased ? 'blur-sm' : ''}>
                <p className="mt-1 text-xs text-gray-500">
                  メーカー: {product.manufacturer_name || '不明'}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  型番: {product.modelNumber}
                </p>
              </div>
            </div>

            <div className="ml-4">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <ArrowUpRight className="h-3.5 w-3.5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}; 