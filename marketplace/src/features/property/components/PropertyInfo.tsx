import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../../../store/useStore';
import { Property } from '../types/property_types';
import { PurchaseButton } from '../../purchase/components/PurchaseButton';

interface PropertyInfoProps {
  property: Property;
  isPurchased?: boolean;
  isLoading?: boolean;
  listingId?: number;
  price?: number;
  isOwner?: boolean;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ 
  property,
  isPurchased,
  isLoading,
  listingId,
  price,
  isOwner
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

  const handleEdit = () => {
    navigate(`/property/${property.id}/edit`);
  };

  return (
    <div className="bg-white">
      <div className="px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">{property.name}</h2>
        {property.description && (
          <p className="mt-1 text-sm text-gray-600 break-words whitespace-normal">{property.description}</p>
        )}
        
        {/* 設計・施工会社情報 */}
        <div className="mt-4 space-y-2">
          {property.design_company && (
            <div className="text-sm">
              <span className="font-medium text-gray-900">設計会社</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-700">{property.design_company}</span>
            </div>
          )}
          {property.construction_company && (
            <div className="text-sm">
              <span className="font-medium text-gray-900">施工会社</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-700">{property.construction_company}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-3">
        <PurchaseButton
          propertyId={property.id ?? 0}
          listingId={listingId}
          isPurchased={isPurchased}
          isLoading={isLoading}
          price={price}
          isOwner={isOwner}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}; 