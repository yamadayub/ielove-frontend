import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';

import './index.css';

interface BlurredProductCardProps {
  product: Product;
}

export const BlurredProductCard: React.FC<BlurredProductCardProps> = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const cart = useStore((state) => state.cart);
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(product.propertyId));
  
  const isPurchased = isPropertyPurchased || cart.items.some(item => item.productId === product.id);
  
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(product.price);

  const ProductDetail: React.FC<{
    label: string;
    value: string;
    isBlurred: boolean;
  }> = ({ label, value, isBlurred }) => (
    <div className="text-sm text-gray-600 flex items-center">
      <span className="mr-2">{label}:</span>
      <div className="flex-1">
        {isBlurred ? (
          <span className="text-gray-400 tracking-wider">＊＊＊＊＊＊</span>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );

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
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <div className="space-y-1">
            <ProductDetail 
              label="メーカー"
              value={product.manufacturer}
              isBlurred={!isPurchased}
            />
            <ProductDetail 
              label="型番"
              value={product.modelNumber}
              isBlurred={!isPurchased}
            />
            <ProductDetail 
              label="寸法"
              value={product.dimensions}
              isBlurred={!isPurchased}
            />
          </div>
          {!isPurchased && (
            <p className="text-xs text-gray-500 italic">
              ※ 詳細情報は購入後に表示されます
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-medium text-gray-900">{formattedPrice}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">カートに追加</span>
          </button>
        </div>
      </div>
    </div>
  );
};