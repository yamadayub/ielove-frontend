import React from 'react';
import type { Specification, Dimension } from '../../pages/property/ProductDetailPage';

interface ProductDetailViewProps {
  specifications: Specification[];
  dimensions: Dimension[];
  isPurchased: boolean;
  shouldBlur: boolean;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  specifications,
  dimensions,
  isPurchased,
  shouldBlur
}) => {
  const blurClass = shouldBlur ? 'blur-sm hover:blur-none transition-all duration-200' : '';

  return (
    <div className="bg-white">
      <div className="px-4 py-6 space-y-8">
        {/* 仕様情報 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">製品仕様</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${blurClass}`}>
            {specifications.map((spec) => (
              <div key={spec.id} className="border-b pb-2">
                <dt className="text-sm text-gray-600">{spec.spec_type}</dt>
                <dd className="text-sm font-medium">{spec.spec_value}</dd>
              </div>
            ))}
          </div>
        </div>

        {/* 寸法情報 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">寸法情報</h2>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${blurClass}`}>
            {dimensions.map((dim) => (
              <div key={dim.id} className="border-b pb-2">
                <dt className="text-sm text-gray-600">
                  {dim.dimension_type === 'width' && '幅'}
                  {dim.dimension_type === 'height' && '高さ'}
                  {dim.dimension_type === 'depth' && '奥行'}
                </dt>
                <dd className="text-sm font-medium">
                  {dim.value}{dim.unit}
                </dd>
              </div>
            ))}
          </div>
        </div>

        {/* 購入状態 */}
        {isPurchased && (
          <div className="mt-6 px-4 py-3 bg-green-50">
            <p className="text-green-700">この製品は購入済みです</p>
          </div>
        )}
      </div>
    </div>
  );
};