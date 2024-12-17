// 既存のインターフェースに追加
export interface SpecificationField {
  manufacturer: string;
  modelNumber: string;
  color: string;
  dimensions: string;
  details: string;
}

export interface RoomForm {
  id: string;
  name: string;
  description: string;
  images: string[];
  specifications: {
    床: SpecificationField;
    壁面: SpecificationField;
    天井: SpecificationField;
    ドア: SpecificationField;
    照明: SpecificationField;
  };
}

export interface PropertyForm {
  name: string;
  location: string;
  description: string;
  images: string[];
}

export type PropertyType = "house" | "apartment" | "other";

export interface PropertyForm {
  name: string;
  location: string;
  description: string;
  images: string[]; // 画像のURLを格納する配列
}

export interface RoomForm {
  id: string;
  name: string;
  description: string;
  images: string[]; // 画像のURLを格納する配列
  specifications: Specification[];
}

export interface Specification {
  manufacturer: string;
  modelNumber: string;
  color: string;
  dimensions: string;
  details: string;
}

// バックエンドのスキーマに基づいて他の型定義を追加
export interface User {
  id?: string;
  email: string;
  name: string;
  user_type: "individual" | "business";
  role: string;
  is_active: boolean;
  last_sign_in?: Date;
}

export interface ProductCategory {
  id?: number;
  name: string;
  description?: string;
}

// 画像関連
export interface UploadedImage {
  id: string;
  url: string;
  status: 'uploading' | 'completed' | 'error';
}

// 製品関連
export interface ProductSpecification {
  id?: string;
  spec_type: string;
  spec_value: string;
  manufacturer_id?: number;
  model_number?: string;
}

export interface ProductDimension {
  id?: string;
  dimension_type: string;  // width, height, depth など
  value: number;
  unit: string;           // mm, cm など
}

export interface Product {
  id: string;
  property_id?: number;
  room_id?: number;
  product_category_id: number;
  manufacturer_id: number;
  name: string;
  product_code: string;
  description?: string;
  catalog_url?: string;
  specifications: ProductSpecification[];
  dimensions: ProductDimension[];
  images: string[];      // 画像URLの配列
}

// 部屋関連
export interface Room {
  id: string;
  name: string;          // リビング、キッチン、など
  description?: string;
  products: Product[];   // 部屋に属する製品一覧
  images: string[];      // 画像URLの配列
}

// 物件関連
export interface PropertyForm {
  name: string;
  location: string;
  description?: string;
  property_type: 'house' | 'apartment' | 'other';
  prefecture: string;
  layout?: string;
  construction_year?: number;
  construction_month?: number;
  site_area?: number;
  building_area?: number;
  floor_count?: number;
  structure?: string;
  design_company_id?: number;
  construction_company_id?: number;
  rooms: Room[];         // 物件に属する部屋一覧
  images: string[];      // 画像URLの配列
}