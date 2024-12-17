import React from 'react';
import { X, PlusCircle } from 'lucide-react';
import { RoomForm } from '../../types';

interface RoomTabsProps {
  rooms: RoomForm[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
  onRoomDelete: (roomId: string) => void;
  onAddRoomClick: () => void;
}

export const RoomTabs: React.FC<RoomTabsProps> = ({
  rooms,
  activeRoom,
  onRoomSelect,
  onRoomDelete,
  onAddRoomClick,
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {rooms.map(room => (
        <div key={room.id} className="relative group flex-shrink-0">
          <button
            type="button"
            onClick={() => onRoomSelect(room.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeRoom === room.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {room.name}
          </button>
          {rooms.length > 1 && (
            <button
              type="button"
              onClick={() => onRoomDelete(room.id)}
              className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAddRoomClick}
        className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <PlusCircle className="h-4 w-4" />
        <span>部屋を追加</span>
      </button>
    </div>
  );
};