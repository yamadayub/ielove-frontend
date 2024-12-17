export type PropertyType = 'house' | 'apartment' | 'other';

export interface PropertyForm {
  name: string;
  location: string;
  description: string;
  property_type: PropertyType;
  layout?: string;
  construction_year?: number;
  construction_month?: number;
  site_area?: number;
  building_area?: number;
  floor_count?: number;
  structure?: string;
  images: string[];
}

export interface Property extends PropertyForm {
  id: string;
  created_at: string;
  updated_at: string;
}