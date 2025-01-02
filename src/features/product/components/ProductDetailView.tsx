import React from 'react';
import type { ProductSpecification, ProductDimension } from '../types/product_types';

interface ProductDetailViewProps {
  specifications: ProductSpecification[];
  dimensions: ProductDimension[];
  isPurchased?: boolean;
  shouldBlur?: boolean;
  isOwner?: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  specifications,
  dimensions,
  isPurchased,
  shouldBlur,
}) => {
  // 寸法情報を整理する関数
  const formatDimensions = (dimensions: ProductDimension[]) => {
    if (!dimensions) return '';
    const dimensionMap = dimensions.reduce((acc, dim) => {
      if (dim.dimension_type) {
        acc[dim.dimension_type] = `${dim.value}${dim.unit}`;
      }
      return acc;
    }, {} as Record<string, string>);

    return `${dimensionMap.width || ''}×${dimensionMap.height || ''}×${dimensionMap.depth || ''}`;
  };

  const blurClass = shouldBlur ? 'blur-[6px]' : '';

  return (
    <div className="bg-white p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">仕様・寸法情報</h3>
      
      {/* 仕様情報 */}
      {specifications && specifications.length > 0 && (
        <div className={`space-y-4 ${blurClass}`}>
          <h4 className="text-base font-medium">仕様</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specifications.map((spec, index) => (
              <div key={index} className="border-b pb-2">
                <dt className="text-sm text-gray-600">{spec.name}</dt>
                <dd className="text-sm font-medium mt-1">{spec.value}</dd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 寸法情報 */}
      {dimensions && dimensions.length > 0 && (
        <div className={`mt-6 ${blurClass}`}>
          <h4 className="text-base font-medium mb-4">寸法</h4>
          <div className="text-sm">
            {formatDimensions(dimensions)}
          </div>
        </div>
      )}
    </div>
  );
};