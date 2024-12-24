import type { Image } from '../../image/types/image_types';

export interface ProductSpecification {
  id?: number;
  product_id: number;
  spec_type: string;
  spec_value: string;
  manufacturer_id?: number;
  model_number?: string;
  created_at: string; // ISO 8601形式の文字列として扱う
}

export interface ProductDimension {
  id?: number;
  product_id: number;
  dimension_type: string;
  value: number;
  unit: string;
  created_at: string; // ISO 8601形式の文字列として扱う
}

export interface Product {
  id?: number;
  room_id: number;
  product_category_id: number;
  manufacturer_id?: number;
  name: string;
  product_code: string;
  description?: string;
  catalog_url?: string;
  created_at: string; // ISO 8601形式の文字列として扱う
  product_category_name?: string; // カテゴリー名（APIレスポンスに含まれる場合）
  manufacturer_name?: string; // メーカー名（APIレスポンスに含まれる場合）
}

export interface ProductDetails extends Product {
  specifications: ProductSpecification[];
  dimensions: ProductDimension[];
  images: Image[];
} 