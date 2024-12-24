export interface Image {
  id: number;
  url: string;
  description: string | null;
  image_type?: 'main' | 'sub';
  s3_key: string | null;
  property_id: number | null;
  room_id: number | null;
  product_id: number | null;
  created_at: string;
}