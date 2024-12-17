import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const CartPage = () => {
  const cart = useStore((state) => state.cart);

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">カートは空です</h2>
        <p className="text-gray-600 mb-8">商品を追加してください</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
        >
          物件一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ショッピングカート</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                productId={item.productId}
                quantity={item.quantity}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <CartSummary totalPrice={cart.totalPrice} />
        </div>
      </div>
    </div>
  );
};