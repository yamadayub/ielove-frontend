import React from 'react';
import { Room } from '../../types';
import { Heart, Share2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface RoomInfoProps {
  room: Room;
}

export const RoomInfo: React.FC<RoomInfoProps> = ({ room }) => {
  const isPropertyPurchased = useStore((state) => state.isPropertyPurchased(room.propertyId));

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
        <button
          onClick={() => window.location.href = `/checkout?propertyId=${room.propertyId}`}
          disabled={isPropertyPurchased}
          className={`w-full py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-sm md:text-base ${
            isPropertyPurchased
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          } transition-colors`}
        >
          {isPropertyPurchased ? (
            <span className="font-medium">購入済み</span>
          ) : (
            <span className="font-medium">物件仕様を購入する</span>
          )}
        </button>
      </div>
    </div>
  );
};