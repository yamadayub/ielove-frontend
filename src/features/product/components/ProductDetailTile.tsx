import React from 'react';
import { Link } from 'react-router-dom';
import type { Image } from '../../image/types/image_types';
import type { ProductDetails } from '../types/product_types';

interface ProductDetailTileProps {
  product: ProductDetails;
  mainImage: Image;
  propertyId: string;
  shouldBlur?: boolean;
}

export const ProductDetailTile: React.FC<ProductDetailTileProps> = ({
  product,
  mainImage,
  propertyId,
  shouldBlur = false,
}) => {
  const blurClass = shouldBlur ? 'blur-[6px]' : '';

  return (
    <div className="w-full border-b border-gray-200 py-4">
      <div className="flex gap-4">
        {/* 製品画像 */}
        <Link 
          to={`/property/${propertyId}/room/${product.room_id}/product/${product.id}`}
          className="block w-24 h-24 flex-shrink-0"
        >
          <img
            src={mainImage.url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* 製品情報 */}
        <div className="flex-grow">
          <div>
            <h3 className="text-base font-medium">
              <Link 
                to={`/property/${propertyId}/room/${product.room_id}/product/${product.id}`}
                className="hover:text-blue-600"
              >
                {product.name}
              </Link>
            </h3>
            <div className="mt-1 space-y-0.5">
              <p className="text-xs text-gray-600">
                <span className="font-medium">メーカー:</span>{' '}
                <span className={blurClass}>{product.manufacturer_name || '不明'}</span>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">型番:</span>{' '}
                <span className={blurClass}>{product.product_code}</span>
              </p>
              {product.catalog_url && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">カタログURL:</span>{' '}
                  <a
                    href={shouldBlur ? '#' : product.catalog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:text-blue-800 ${shouldBlur ? 'pointer-events-none' : ''}`}
                    onClick={(e) => shouldBlur && e.preventDefault()}
                  >
                    <span className={blurClass}>カタログを見る</span>
                  </a>
                </p>
              )}
              <p className="text-xs text-gray-600">
                <span className="font-medium">設置場所:</span>{' '}
                <span className={blurClass}>{product.room_name}</span>
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">カテゴリ:</span>{' '}
                <span className={blurClass}>{product.product_category_name}</span>
              </p>
            </div>
          </div>

          {/* 製品説明 */}
          <p className={`mt-2 text-xs text-gray-700 ${blurClass}`}>{product.description}</p>

          {/* 仕様情報 */}
          {product.specifications.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-900">仕様情報</h4>
              <div className="mt-1 space-y-1">
                {product.specifications.map(spec => (
                  <div key={spec.id} className="text-xs">
                    <span className="font-medium text-gray-600">{spec.spec_type}:</span>{' '}
                    <span className={`text-gray-900 ${blurClass}`}>{spec.spec_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 寸法情報 */}
          {product.dimensions.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-900">寸法情報</h4>
              <div className="mt-1 space-y-1">
                {product.dimensions.map(dim => (
                  <div key={dim.id} className="text-xs">
                    <span className="font-medium text-gray-600">{dim.dimension_type}:</span>{' '}
                    <span className={`text-gray-900 ${blurClass}`}>{dim.value}{dim.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 