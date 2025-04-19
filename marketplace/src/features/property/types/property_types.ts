import type { Room } from '../../room/types/room_types';
import type { Image } from '../../image/types/image_types';

export const PROPERTY_TYPES = {
  HOUSE: "HOUSE",
  APARTMENT: "APARTMENT",
  OTHER: "OTHER"
} as const;

export type PropertyType = typeof PROPERTY_TYPES[keyof typeof PROPERTY_TYPES];

export const STRUCTURE_TYPES = {
  WOODEN: "WOODEN",
  STEEL_FRAME: "STEEL_FRAME",
  RC: "RC",
  SRC: "SRC",
  LIGHT_STEEL: "LIGHT_STEEL"
} as const;

export const STRUCTURE_TYPE_LABELS = {
  [STRUCTURE_TYPES.WOODEN]: "木造",
  [STRUCTURE_TYPES.STEEL_FRAME]: "鉄骨造",
  [STRUCTURE_TYPES.RC]: "RC造",
  [STRUCTURE_TYPES.SRC]: "SRC造",
  [STRUCTURE_TYPES.LIGHT_STEEL]: "軽量鉄骨造"
} as const;

export type StructureType = typeof STRUCTURE_TYPES[keyof typeof STRUCTURE_TYPES];

export interface Property {
  id?: number;
  user_id: number;
  name: string;
  description: string;
  property_type: PropertyType;
  prefecture: string;
  layout?: string;
  construction_year?: number;
  construction_month?: number;
  site_area?: number;
  building_area?: number;
  floor_count?: number;
  structure?: StructureType | null;
  design_company?: string;
  construction_company?: string;
  created_at?: string;
  status?: string;
  updated_at?: string;
  images?: Image[];
}

export interface PropertyDetails extends Property {
  rooms: Room[];
  images: Image[];
}
