import type { Image } from './image';
import type { Product } from './product';

export interface Room {
  id?: number;
  property_id?: number;
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  product_category_id?: number;
  product_code?: string;
}

export interface RoomDetails extends Room {
  products: Product[];
  images: Image[];
}