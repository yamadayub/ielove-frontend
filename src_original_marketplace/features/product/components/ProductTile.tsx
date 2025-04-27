import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product_types';
import { ArrowUpRight, Pencil } from 'lucide-react';
import { useImages } from '../../../features/image/hooks/useImages';

interface Image {
  id: number;
  url: string;
  image_type?: string;
}

interface ProductTileProps {
  product: Product;
  propertyId: string;
  roomId: string;
  isPurchased: boolean;
  onEdit?: () => void;
  isEditMode?: boolean;
}

export const ProductTile: React.FC<ProductTileProps> = ({
  product,
  propertyId,
  roomId,
  isPurchased,
  onEdit,
  isEditMode = false
}) => {
  const { data: images, isLoading } = useImages({
    entity_type: 'product',
    entity_id: parseInt(product.id)
  });

  const mainImage = images?.find((img: Image) => img.image_type === 'main');
  const imageUrl = mainImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode && onEdit) {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <Link
      to={isEditMode 
        ? `/property/${propertyId}/room/${roomId}/product/${product.id}/edit`
        : `/property/${propertyId}/room/${roomId}/product/${product.id}`
      }
      className="block relative group"
      onClick={handleClick}
    >
      <div className="aspect-square relative">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-lg font-medium text-center px-4">
              {product.product_category_name}
            </h3>
          </div>

          <div className="absolute top-2 right-2">
            {isEditMode ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit?.();
                }}
                className="p-2 bg-white/90 rounded-full shadow-sm"
              >
                <Pencil className="h-4 w-4 text-gray-700" />
              </button>
            ) : (
              <button className="p-2 bg-white/90 rounded-full shadow-sm">
                <ArrowUpRight className="h-4 w-4 text-gray-700" />
              </button>
            )}
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent ${!isPurchased ? 'blur-sm' : ''}`}>
            <p className="text-white text-xs">
              {product.manufacturer_name} / {product.product_code}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}; 