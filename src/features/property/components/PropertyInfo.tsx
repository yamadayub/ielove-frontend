import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../../../store/useStore';
import { Property } from '../types/property_types';
import { PurchaseButton } from '../../purchase/components/PurchaseButton';
import { Pencil } from 'lucide-react';

interface PropertyInfoProps {
  property: Property;
  isPurchased?: boolean;
  isLoading?: boolean;
  listingId?: number;
  price?: number;
  isOwner?: boolean;
  onEdit?: () => void;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ 
  property,
  isPurchased,
  isLoading,
  listingId,
  price,
  isOwner,
  onEdit
}) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const setCurrentCheckoutListingId = useStore((state) => state.setCurrentCheckoutListingId);

  const handlePurchase = () => {
    if (!isSignedIn) {
      // 現在のURLをエンコードしてクエリパラメータとして渡す
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (listingId) {
      setCurrentCheckoutListingId(listingId);
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{property.name}</h2>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Pencil className="h-4 w-4 mr-1.5" />
              編集する
            </button>
          )}
        </div>
        {property.description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{property.description}</p>
        )}
      </div>
      <div className="px-4 pb-3">
        <PurchaseButton
          propertyId={property.id ?? 0}
          listingId={listingId}
          isPurchased={isPurchased}
          isLoading={isLoading}
          price={price}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}; 