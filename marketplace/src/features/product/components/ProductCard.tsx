import React from 'react';
import { Product } from '../../types';
import { Edit } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  return (
    <div className="relative group">
      <div className="aspect-square">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
          {/* 編集ボタン */}
          <div className="absolute top-2 right-2">
            <button 
              onClick={onEdit}
              className="p-2 bg-white/90 rounded-full shadow-sm"
            >
              <Edit className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          {/* 材料名を中央に配置 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="font-medium text-white text-sm md:text-lg text-center px-2">
              {product.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};