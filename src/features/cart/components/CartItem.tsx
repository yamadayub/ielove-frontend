import React from 'react';
import { Trash2 } from 'lucide-react';
import { MaterialSpec, DoorSpec, LightingSpec, FurnitureSpec } from '../../../types';
import { useStore } from '../../../store/useStore';
import { MOCK_ROOMS } from '../../../utils/mockData';

interface CartItemProps {
  productId: string;
  quantity: number;
}

export const CartItem: React.FC<CartItemProps> = ({ productId, quantity }) => {
  const removeFromCart = useStore((state) => state.removeFromCart);
  
  // Find the product in room specifications
  let product: MaterialSpec | DoorSpec | LightingSpec | FurnitureSpec | undefined;
  
  for (const room of MOCK_ROOMS) {
    const specs = room.specifications;
    
    // Check basic specifications
    if (specs.flooring.id === productId) product = specs.flooring;
    else if (specs.walls.id === productId) product = specs.walls;
    else if (specs.baseboard.id === productId) product = specs.baseboard;
    else if (specs.ceiling.id === productId) product = specs.ceiling;
    else if (specs.door.id === productId) product = specs.door;
    else if (specs.lighting.id === productId) product = specs.lighting;
    
    // Check furniture
    else if (specs.furniture) {
      product = specs.furniture.find(f => f.id === productId);
    }
    
    // Check kitchen
    else if (specs.kitchen) {
      if (specs.kitchen.cabinet.id === productId) product = specs.kitchen.cabinet;
      else if (specs.kitchen.countertop.id === productId) product = specs.kitchen.countertop;
    }
    
    if (product) break;
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(product.price * quantity);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-sm text-gray-500 mt-1">数量: {quantity}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-gray-900">{formattedPrice}</span>
        <button
          onClick={() => removeFromCart(productId)}
          className="text-red-600 hover:text-red-500 transition-colors"
          aria-label="商品を削除"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};