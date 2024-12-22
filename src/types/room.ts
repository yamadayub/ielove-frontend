import type { Product } from './product';

export interface Room {
  id: number;
  property_id: number;
  name: string;
  description?: string;
  specifications?: Record<string, any>;
  images?: any[];
  created_at: string;
  updated_at: string;
}

export interface RoomForm {
  name: string;
  description: string;
  images: string[];
}