import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../../../store/useStore';
import { Loader2 } from 'lucide-react';

interface PurchaseButtonProps {
  propertyId: number;
  listingId?: number;
  isPurchased?: boolean;
  isLoading?: boolean;
  price?: number;
  isOwner?: boolean;
}

export const PurchaseButton: React.FC<PurchaseButtonProps> = ({
  propertyId,
  listingId,
  isPurchased,
  isLoading,
  price,
  isOwner
}) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const setCurrentCheckoutListingId = useStore((state) => state.setCurrentCheckoutListingId);
  const setCurrentPropertyId = useStore((state) => state.setCurrentPropertyId);

  const handlePurchase = () => {
    if (!isSignedIn) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (listingId) {
      setCurrentCheckoutListingId(listingId);
      setCurrentPropertyId(propertyId);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400"
      >
        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
      </button>
    );
  }

  if (isPurchased) {
    return (
      <button
        disabled
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600"
      >
        購入済み
      </button>
    );
  }

  if (isOwner) {
    return (
      <button
        disabled
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400"
      >
        所有者
      </button>
    );
  }

  if (!price) {
    return (
      <button
        disabled
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400"
      >
        準備中
      </button>
    );
  }

  return (
    <button
      onClick={handlePurchase}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      ¥{price.toLocaleString()}で購入
    </button>
  );
}; 