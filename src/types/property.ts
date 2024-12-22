export type PropertyType = 'house' | 'apartment' | 'other';

// 物件の基本データ（プロパティに閉じた定義）
export interface PropertyBase {
  name: string;
  description?: string;
  property_type: PropertyType;
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
}

// 物件作成用
export interface PropertyCreateData extends PropertyBase {
  user_id: string;
}

// フォーム用（user_idを除外）
export type PropertyFormData = PropertyBase;

export interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  thumbnail?: string;
}