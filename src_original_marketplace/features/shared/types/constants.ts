export interface ConstantOption {
  value: string;
  label: string;
}

export interface Constants {
  company_types: ConstantOption[];
  property_types: ConstantOption[];
  structure_types: ConstantOption[];
  dimension_types: ConstantOption[];
  image_types: ConstantOption[];
  listing_types: ConstantOption[];
  listing_statuses: ConstantOption[];
  visibility_types: ConstantOption[];
} 