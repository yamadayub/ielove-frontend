import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Room } from '../types/room_types';
import type { Image } from '../../image/types/image_types';

interface RoomTileProps {
  room: Room;
  onClick: () => void;
  showImage?: boolean;
  images?: Image[];
}

export const RoomTile: React.FC<RoomTileProps> = ({ 
  room, 
  onClick,
  showImage = false,
  images = []
}) => {
  const mainImage = images.find(img => 
    img.room_id === room.id && 
    img.image_type === 'main'
  );
  const imageUrl = mainImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800';

  if (showImage) {
    return (
      <div onClick={onClick} className="block relative group cursor-pointer">
        <div className="aspect-square relative">
          <img
            src={imageUrl}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors">
            <div className="absolute top-2 right-2">
              <button className="p-2 bg-white/90 rounded-full shadow-sm">
                <ArrowUpRight className="h-4 w-4 text-gray-700" />
              </button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-white text-base md:text-lg text-center">
                  {room.name}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{room.name}</h3>
          {room.description && (
            <p className="text-sm text-gray-500 mt-1">{room.description}</p>
          )}
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
      </div>
    </button>
  );
};

export default RoomTile; 