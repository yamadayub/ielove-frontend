import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import type { Room } from '../types/room_types';
import { usePropertyPurchaseStatus } from '../../transaction/hooks/usePropertyPurchaseStatus';
import { PurchaseButton } from '../../purchase/components/PurchaseButton';

interface RoomInfoProps {
  room: Room;
  isOwner?: boolean;
}

export const RoomInfo: React.FC<RoomInfoProps> = ({ room, isOwner }) => {
  const { data: purchaseStatus, isLoading } = usePropertyPurchaseStatus(room.property_id);

  return (
    <div className="py-4 border-b">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">{room.name}</h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">{room.description}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
            <Heart className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
          </button>
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <PurchaseButton
          propertyId={room.property_id}
          isPurchased={purchaseStatus?.isPurchased}
          isLoading={isLoading}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
};