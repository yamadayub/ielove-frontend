import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useStore } from '../../../store/useStore';

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

  const handlePurchaseClick = () => {
    if (!isSignedIn) {
      const currentPath = encodeURIComponent(window.location.pathname);
      navigate(`/auth?redirect_url=${currentPath}`);
      return;
    }

    if (listingId) {
      setCurrentCheckoutListingId(listingId);
      navigate('/checkout');
    } else {
      toast.error('この物件は現在購入できません');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-3 px-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="w-full py-3 px-4 rounded-lg bg-blue-100 border border-blue-200">
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            登録済物件
          </span>
        </div>
      </div>
    );
  }

  if (isPurchased) {
    return (
      <div className="w-full py-3 px-4 rounded-lg bg-green-100 border border-green-200">
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">
            詳細仕様購入済み
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handlePurchaseClick}
      disabled={isLoading}
      className="w-full py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:bg-blue-400"
    >
      <span className="font-medium">
        {price ? `¥${price.toLocaleString()}で詳細情報を購入する` : '物件情報を購入する'}
      </span>
    </button>
  );
}; 