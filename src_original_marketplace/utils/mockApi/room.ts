import { Room, RoomForm } from '../../types';
import { createDefaultRooms } from '../mockData/rooms';
import { DEFAULT_MATERIALS } from '../mockData/materials';

// In-memory store for rooms
const roomsStore = new Map<string, Room[]>();

export const roomApi = {
  getRooms: async (propertyId: string): Promise<{ data: Room[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let rooms = roomsStore.get(propertyId);
        if (!rooms) {
          rooms = createDefaultRooms(propertyId);
          roomsStore.set(propertyId, rooms);
        }
        resolve({ data: rooms });
      }, 500);
    });
  },

  getRoom: async (propertyId: string, roomId: string): Promise<{ data: Room }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let rooms = roomsStore.get(propertyId);
        if (!rooms) {
          rooms = createDefaultRooms(propertyId);
          roomsStore.set(propertyId, rooms);
        }

        const room = rooms.find(r => r.id === roomId);
        if (room) {
          resolve({ data: room });
        } else {
          // Create a new mock room if not found
          const mockRoom: Room = {
            id: roomId,
            propertyId,
            name: 'リビングダイニング',
            description: '明るく開放的な空間で、ご家族との団らんを楽しめます。',
            images: [
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            ],
            specifications: DEFAULT_MATERIALS,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // Add the mock room to the store
          if (!rooms) {
            roomsStore.set(propertyId, [mockRoom]);
          } else {
            rooms.push(mockRoom);
          }

          resolve({ data: mockRoom });
        }
      }, 500);
    });
  },
};