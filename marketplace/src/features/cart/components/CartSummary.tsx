import React from 'react';
import { Link } from 'react-router-dom';

interface CartSummaryProps {
  totalPrice: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice }) => {
  const formattedPrice = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">注文内容</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>小計</span>
          <span>{formattedPrice}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>消費税（10%）</span>
          <span>
            {new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
              minimumFractionDigits: 0,
            }).format(totalPrice * 0.1)}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>合計</span>
            <span>
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                minimumFractionDigits: 0,
              }).format(totalPrice * 1.1)}
            </span>
          </div>
        </div>
      </div>
      <Link
        to="/checkout"
        className="mt-6 block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        購入手続きへ進む
      </Link>
    </div>
  );
};