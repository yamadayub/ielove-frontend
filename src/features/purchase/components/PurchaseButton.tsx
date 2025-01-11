import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Pencil } from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface PurchaseButtonProps {
  propertyId: number;
  listingId?: number;
  isPurchased?: boolean;
  isLoading?: boolean;
  price?: number;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  propertyId,
  listingId,
  isPurchased,
  isLoading,
  price,
  isOwner,
  onEdit
}) => {
  const navigate = useNavigate();
  const setCurrentCheckoutListingId = useStore((state) => state.setCurrentCheckoutListingId);

  const handlePurchase = () => {
    if (listingId) {
      setCurrentCheckoutListingId(listingId);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed w-full"
      >
        <span className="font-medium">読み込み中...</span>
      </button>
    );
  }

  if (isOwner && onEdit) {
    return (
      <button
        onClick={onEdit}
        className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors w-full"
      >
        <Pencil className="h-5 w-5" />
        <span className="font-medium">編集する</span>
      </button>
    );
  }

  if (isPurchased) {
    return (
      <button
        disabled
        className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg cursor-not-allowed w-full"
      >
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">購入済み</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="font-medium">物件仕様を購入する</span>
    </button>
  );
}; 