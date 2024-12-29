export interface ListingItem {
  id?: number;
  seller_id?: number;
  title: string;
  description?: string | null;
  price: number;
  listing_type: 'PROPERTY_SPECS' | 'ROOM_SPECS' | 'PRODUCT_SPECS' | 'CONSULTATION' | 'PROPERTY_VIEWING';
  status?: 'DRAFT' | 'PUBLISHED' | 'RESERVED' | 'SOLD' | 'CANCELLED';
  property_id?: number;
  room_id?: number;
  product_id?: number;
  is_negotiable?: boolean;
  service_type?: 'online' | 'offline' | 'both';
  service_duration?: number;
  is_featured?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE';
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
} 