// 部屋のモックデータを別ファイルに分離
import { Room } from '../../types';
import { DEFAULT_MATERIALS } from './materials';
import { DEFAULT_ROOM_NAMES } from '../constants';

export const createDefaultRooms = (propertyId: string): Room[] => {
  return DEFAULT_ROOM_NAMES.map((name, index) => ({
    id: `room${index + 1}`,
    propertyId,
    name,
    description: `${name}の説明文がここに入ります。`,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: DEFAULT_MATERIALS,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};