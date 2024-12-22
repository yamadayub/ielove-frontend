export interface Image {
  url: string;
  description: string;
  image_type: 'main' | 'sub';
  property_id: number;
  room_id: number | null;
  product_id: number | null;
  s3_key: string | null;
  id: number;
}