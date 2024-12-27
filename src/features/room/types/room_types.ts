import type { Image } from './image';
import type { Product } from './product';

export interface Room {
  id: number;
  property_id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at: string;
  product_category_id: number | null;
  product_code: string | null;
}

export interface RoomDetails extends Room {
  products: Product[];
  images: Image[];
}