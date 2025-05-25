export interface FloorplanEditor {
  canvas: {
    width: number;
    height: number;
    scale: number;
    offset: {
      x: number;
      y: number;
    };
  };
  grid: {
    size: number;
    visible: boolean;
    snap_enabled: boolean;
  };
  tools: {
    active_tool: EditorTool;
    selected_elements: string[];
  };
}

export type EditorTool = 
  | 'select'
  | 'wall'
  | 'door'
  | 'window'
  | 'furniture'
  | 'room'
  | 'dimension'
  | 'text';

export interface WallElement {
  id: string;
  type: 'wall';
  start_point: Point;
  end_point: Point;
  thickness: number;
  height: number;
  material_id?: string;
  openings: Opening[];
  properties: WallProperties;
}

export interface Opening {
  id: string;
  type: 'door' | 'window';
  position: number; // 0-1 along the wall
  width: number;
  height: number;
  properties: OpeningProperties;
}

export interface WallProperties {
  is_load_bearing: boolean;
  insulation_type?: string;
  fire_rating?: string;
}

export interface OpeningProperties {
  swing_direction?: 'left' | 'right' | 'inward' | 'outward';
  frame_material?: string;
  glass_type?: string;
}

export interface FurnitureElement {
  id: string;
  type: 'furniture';
  category: FurnitureCategory;
  position: Point;
  dimensions: Dimensions;
  rotation: number;
  model_url?: string;
  properties: FurnitureProperties;
}

export type FurnitureCategory = 
  | 'bed'
  | 'sofa'
  | 'table'
  | 'chair'
  | 'cabinet'
  | 'appliance'
  | 'fixture';

export interface FurnitureProperties {
  brand?: string;
  model?: string;
  color?: string;
  material?: string;
  price?: number;
}

export interface RoomElement {
  id: string;
  type: 'room';
  name: string;
  boundary_points: Point[];
  area: number;
  room_type: RoomType;
  properties: RoomProperties;
}

export type RoomType = 
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'dining_room'
  | 'office'
  | 'storage'
  | 'hallway'
  | 'balcony';

export interface RoomProperties {
  ceiling_height: number;
  floor_material_id?: string;
  wall_material_id?: string;
  ceiling_material_id?: string;
  lighting_requirements?: string;
  ventilation_requirements?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
  depth?: number;
}

export interface DimensionLine {
  id: string;
  start_point: Point;
  end_point: Point;
  value: number;
  unit: string;
  label_position: Point;
} 