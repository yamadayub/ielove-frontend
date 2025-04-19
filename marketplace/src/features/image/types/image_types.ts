export type ImageType = 'MAIN' | 'SUB' | 'PAID';

export interface Image {
  id?: number;
  url?: string;
  image_type?: ImageType;
  status?: 'pending' | 'completed';
  property_id?: number;
  room_id?: number;
  product_id?: number;
  product_specification_id?: number;
  drawing_id?: number;
  created_at?: string;
}export interface UseImagesParams {
  propertyId?: string;
  roomId?: string;
  productId?: string;
  productSpecificationId?: number;
  drawingId?: string;
}

