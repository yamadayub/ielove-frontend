import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { ArrowUpRight } from 'lucide-react';
import { MOCK_ROOMS } from '../../utils/mockData';

interface RoomNavigationProps {
  propertyId: string;
}

export const RoomNavigation: React.FC<RoomNavigationProps> = ({ propertyId }) => {
  const rooms = MOCK_ROOMS.filter(room => room.propertyId === propertyId);

  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {rooms.map((room) => (
        <div key={room.id} className="relative group">
          <Link
            to={`/property/${propertyId}/room/${room.id}`}
            className="block relative"
          >
            <div className="aspect-square relative">
              <img
                src={room.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
                {/* 部屋名を中央に配置 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-medium text-white text-sm md:text-base text-center px-2">
                    {room.name}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
          {/* 詳細表示アイコンを別のリンクとして配置 */}
          <Link
            to={`/property/${propertyId}/room/${room.id}`}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowUpRight className="h-4 w-4 text-gray-700" />
          </Link>
        </div>
      ))}
    </div>
  );
};