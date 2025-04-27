import type { Image } from '../../image/types/image_types';

export interface ProductSpecification {
  id?: number;
  product_id: number;
  spec_type?: string;
  spec_value?: string;
  manufacturer_id?: number;
  model_number?: string;
}

export interface ProductDimension {
  id?: number;
  product_id: number;
  dimension_type?: string;
  value?: number;
  unit?: string;
}

export interface Product {
  id?: number;
  room_id: number;
  product_category_id?: number;
  name?: string;
  product_code?: string;
  description?: string;
  catalog_url?: string;
  room_name?: string;
  product_category_name?: string;
  manufacturer_name?: string | null;
  created_at?: string;
  updated_at?: string;
  status: string;
}

export interface ProductDetails extends Product {
  specifications: ProductSpecification[];
  dimensions: ProductDimension[];
  images: Image[];
}

export interface ProductCategory {
  id: number
  name: string
} 