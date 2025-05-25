export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  description?: string;
  texture_url?: string;
  normal_map_url?: string;
  roughness_map_url?: string;
  properties: MaterialProperties;
  price_per_unit?: number;
  unit: string;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export type MaterialCategory = 
  | 'wall_paint'
  | 'wallpaper'
  | 'tile'
  | 'flooring'
  | 'wood'
  | 'stone'
  | 'metal'
  | 'fabric'
  | 'glass';

export interface MaterialProperties {
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  repeat_u: number;
  repeat_v: number;
  bump_scale?: number;
}

export interface MaterialApplication {
  element_id: string;
  material_id: string;
  surface?: 'front' | 'back' | 'top' | 'bottom' | 'left' | 'right' | 'all';
}

export interface MaterialLibrary {
  categories: MaterialCategory[];
  materials: Material[];
  favorites: string[];
} 