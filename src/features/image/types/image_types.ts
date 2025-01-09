export interface Image {
  id: number;
  url: string;
  description?: string | null;
  image_type?: 'MAIN' | 'SUB' | 'PAID';
  s3_key?: string | null;
  property_id?: number | null;
  room_id?: number | null;
  product_id?: number | null;
  created_at?: string;
  status?: 'pending' | 'completed';
}