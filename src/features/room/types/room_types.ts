import type { Image } from './image';
import type { Product } from './product';

export interface Room {
  id: number;
  property_id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface RoomDetails extends Room {
  products: Product[];
  images: Image[];
}