import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { PlusCircle, Edit } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

interface RoomListProps {
  propertyId: string;
}

export const RoomList: React.FC<RoomListProps> = ({ propertyId }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await mockApi.getRooms(propertyId);
        setRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50">
        <PlusCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">部屋が登録されていません</h3>
        <p className="text-gray-600">「部屋を追加」ボタンから部屋を登録してください</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
      {rooms.map((room) => (
        <Link
          key={room.id}
          to={`/property/${propertyId}/room/${room.id}/edit`}
          className="block relative group"
        >
          <div className="aspect-square relative">
            <img
              src={room.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
              alt={room.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors">
              {/* 編集ボタン */}
              <div className="absolute top-2 right-2">
                <button className="p-2 bg-white/90 rounded-full shadow-sm">
                  <Edit className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              {/* 部屋名を中央に配置 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-medium text-white text-sm md:text-lg text-center px-2">
                  {room.name}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};