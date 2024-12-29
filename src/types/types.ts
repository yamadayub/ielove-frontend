import { PropertyCreateData } from "./property";


// 基本的な型定義
export type UserType = "individual" | "business";
export type PropertyType = "HOUSE" | "APARTMENT" | "OTHER";
export type CompanyType = "MANUFACTURER" | "DESIGN" | "CONSTRUCTION";
export type ImageType = "MAIN" | "SUB" | "PAID";
export type SaleType = "PROPERTY_SPECS" | "ROOM_SPECS" | "PRODUCT_SPECS" | "CONSULTATION" | "PROPERTY_VIEWING";



// 商品カテゴリー
export interface ProductCategory {
  id?: number;
  name: string;
  description?: string;
}

// 購入関連
export interface Purchase {
  id?: number;
  buyer_id: string;
  product_for_sale_id: number;
  amount: number;
  status: string;
  stripe_payment_intent_id?: string;
  stripe_payment_status?: string;
  stripe_transfer_id?: string;
}

// 販売関連
export interface Sale {
  id?: number;
  seller_id: number;
  product_for_sale_id: number;
  purchase_id: number;
  amount: number;
  platform_fee: number;
  seller_amount: number;
  status: string;
  stripe_transfer_id?: string;
  stripe_transfer_status?: string;
}

// 販売商品
export interface ProductForSale {
  id?: number;
  seller_id: number;
  name: string;
  description?: string;
  price: number;
  sale_type: SaleType;
  consultation_type?: string;
  status: string;
  property_id?: number;
  room_id?: number;
  product_id?: number;
  is_negotiable: boolean;
  consultation_minutes?: number;
}

// 販売者プロフィール
export interface SellerProfile {
  id?: number;
  user_id: string;
  company_name?: string;
  representative_name?: string;
  postal_code?: string;
  address?: string;
  phone_number?: string;
  business_registration_number?: string;
  tax_registration_number?: string;
  stripe_account_id?: string;
  stripe_account_status?: string;
  stripe_account_type?: string;
  stripe_onboarding_completed: boolean;
  stripe_charges_enabled: boolean;
  stripe_payouts_enabled: boolean;
}

// 会社情報
export interface Company {
  id?: number;
  name: string;
  company_type: CompanyType;
  description?: string;
  website?: string;
}


// プリサインURL
export interface PreSignedUrlResponse {
  upload_url: string;
  image_id: string;
  image_url: string;
}