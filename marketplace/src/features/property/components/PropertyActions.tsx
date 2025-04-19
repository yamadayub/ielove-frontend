import React from 'react';
import { Share2, Heart } from 'lucide-react';
import { Property } from '../../types';
import { PurchaseButton } from '../common/PurchaseButton';

interface PropertyActionsProps {
  property: Property;
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({ property }) => {
  return (
    <div className="py-6 border-t border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Heart className="h-7 w-7" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="h-7 w-7" />
          </button>
        </div>
        <PurchaseButton propertyId={property.id} />
      </div>
    </div>
  );
};