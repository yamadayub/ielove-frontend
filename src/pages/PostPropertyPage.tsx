import React, { useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { PropertyForm, RoomForm, SpecificationField } from '../types';
import { ImageUploader } from '../components/property/ImageUploader';
import { SpecificationForm } from '../components/property/SpecificationForm';
import { RoomTabs } from '../components/property/RoomTabs';

const DEFAULT_SPECIFICATION: SpecificationField = {
  manufacturer: '',
  modelNumber: '',
  color: '',
  dimensions: '',
  details: '',
};

const createDefaultRoom = (id: string, name: string = '新しい部屋'): RoomForm => ({
  id,
  name,
  description: '',
  images: [],
  specifications: {
    flooring: { ...DEFAULT_SPECIFICATION },
    walls: { ...DEFAULT_SPECIFICATION },
    ceiling: { ...DEFAULT_SPECIFICATION },
    window: { ...DEFAULT_SPECIFICATION },
    door: { ...DEFAULT_SPECIFICATION },
    lighting: { ...DEFAULT_SPECIFICATION },
  },
});

const DEFAULT_ROOMS = [
  createDefaultRoom('living', 'リビングダイニング'),
  createDefaultRoom('kitchen', 'キッチン'),
  createDefaultRoom('bedroom', '寝室'),
];

export const PostPropertyPage: React.FC = () => {
  const [property, setProperty] = useState<PropertyForm>({
    name: '',
    location: '',
    description: '',
    images: [],
  });

  const [rooms, setRooms] = useState<RoomForm[]>(DEFAULT_ROOMS);
  const [activeRoom, setActiveRoom] = useState<string>(rooms[0].id);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const propertyImages = useImageUpload();
  const roomImages = useImageUpload();

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificationChange = (
    field: keyof RoomForm['specifications'],
    key: keyof SpecificationField,
    value: string
  ) => {
    setRooms(prev => prev.map(room => {
      if (room.id === activeRoom) {
        return {
          ...room,
          specifications: {
            ...room.specifications,
            [field]: {
              ...room.specifications[field],
              [key]: value,
            },
          },
        };
      }
      return room;
    }));
  };

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = createDefaultRoom(`room-${Date.now()}`, newRoomName);
      setRooms(prev => [...prev, newRoom]);
      setActiveRoom(newRoom.id);
      setNewRoomName('');
      setShowAddRoom(false);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    if (activeRoom === roomId) {
      setActiveRoom(rooms[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const activeRoomData = rooms.find(room => room.id === activeRoom);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">物件情報</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物件写真
            </label>
            <ImageUploader
              images={propertyImages.images}
              onUpload={(e) => propertyImages.handleUpload(e.target.files!)}
              onDelete={propertyImages.deleteImage}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              物件名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={property.name}
              onChange={handlePropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              所在地
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={property.location}
              onChange={handlePropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              物件説明
            </label>
            <textarea
              id="description"
              name="description"
              value={property.description}
              onChange={handlePropertyChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">部屋情報</h2>
          </div>

          <RoomTabs
            rooms={rooms}
            activeRoom={activeRoom}
            onRoomSelect={setActiveRoom}
            onRoomDelete={handleDeleteRoom}
            onAddRoomClick={() => setShowAddRoom(true)}
          />

          {showAddRoom && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="部屋名を入力"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={handleAddRoom}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                追加
              </button>
            </div>
          )}

          {activeRoomData && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  部屋写真
                </label>
                <ImageUploader
                  images={roomImages.images}
                  onUpload={(e) => roomImages.handleUpload(e.target.files!)}
                  onDelete={roomImages.deleteImage}
                />
              </div>

              {Object.entries(activeRoomData.specifications).map(([field, spec]) => (
                <div key={field} className="space-y-4">
                  <h3 className="font-medium text-gray-900">{field}</h3>
                  <SpecificationForm
                    specification={spec}
                    onChange={(key, value) => handleSpecificationChange(field as keyof RoomForm['specifications'], key, value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-20 bg-white py-4 border-t">
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
};