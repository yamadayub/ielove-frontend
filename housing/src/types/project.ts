export interface Project {
  id: string;
  name: string;
  description?: string;
  type: 'detached_house' | 'apartment_renovation';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  owner_id: string;
  floorplan_data?: FloorplanData;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  grid_size: number;
  units: 'metric' | 'imperial';
  default_wall_thickness: number;
  default_ceiling_height: number;
  show_dimensions: boolean;
  snap_to_grid: boolean;
}

export interface FloorplanData {
  elements: FloorplanElement[];
  bounds: {
    width: number;
    height: number;
  };
  scale: number;
}

export interface FloorplanElement {
  id: string;
  type: 'wall' | 'door' | 'window' | 'furniture' | 'room';
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  rotation: number;
  properties: Record<string, any>;
  material_id?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  type: 'detached_house' | 'apartment_renovation';
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: 'draft' | 'in_progress' | 'completed' | 'archived';
  floorplan_data?: FloorplanData;
  settings?: Partial<ProjectSettings>;
} 