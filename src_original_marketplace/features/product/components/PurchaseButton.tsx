import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface PurchaseButtonProps {
  propertyId: string;
  className?: string;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({ propertyId, className = '' }) => {
  const navigate = useNavigate();
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(propertyId));

  const handlePurchase = () => {
    navigate(`/checkout?propertyId=${propertyId}`);
  };

  if (isPropertyPurchased) {
    return (
      <button
        disabled
        className={`flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg cursor-not-allowed ${className}`}
      >
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">購入済み</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      className={`flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="font-medium">仕様情報を購入する</span>
    </button>
  );
};