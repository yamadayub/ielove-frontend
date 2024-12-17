import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);

  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-900" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{product.description}</p>
          </div>
          <span className="text-sm font-medium text-gray-900">{formattedPrice}</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 flex items-center justify-center w-full space-x-2 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="text-sm font-medium">カートに追加</span>
        </button>
      </div>
    </div>
  );
};