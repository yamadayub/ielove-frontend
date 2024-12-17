export interface Room {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  images: string[];
  specifications: Record<string, Material>;
  created_at: string;
  updated_at: string;
}

export interface RoomForm {
  name: string;
  description: string;
  images: string[];
}