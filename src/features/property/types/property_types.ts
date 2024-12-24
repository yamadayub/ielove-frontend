import type { Room } from '../../room/types/room_types';
import type { Image } from '../../image/types/image_types';

export interface Property {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  property_type: 'house' | 'apartment' | 'other';
  prefecture: string;
  layout?: string;
  construction_year?: number;
  construction_month?: number;
  site_area?: number;
  building_area?: number;
  floor_count?: number;
  structure?: string;
  design_company_id?: number;
  construction_company_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyDetails extends Property {
  rooms: Room[];
  images: Image[];
}
