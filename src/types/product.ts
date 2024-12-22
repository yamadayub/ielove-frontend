export interface Product {
  id: string;
  type: string;
  name: string;
  manufacturer: string;
  modelNumber: string;
  catalogUrl?: string;
  color: string;
  dimensions: string;
  details: string;
  imageUrl?: string;
  additionalDetails?: Record<string, string>;
}

export interface ProductForm {
  type: string;
  name: string;
  manufacturer: string;
  modelNumber: string;
  catalogUrl?: string;
  color: string;
  dimensions: string;
  details: string;
  imageUrl?: string;
} 