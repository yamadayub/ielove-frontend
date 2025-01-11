import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Image } from '../../image/types/image_types';
import type { ProductDetails } from '../types/product_types';

interface ProductDetailTileProps {
  product: ProductDetails;
  mainImage?: Image;
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
  const productUrl = `/property/${propertyId}/room/${product.room_id}/product/${product.id}`;

  return (
    <Link 
      to={productUrl}
      className="group block w-full border-b border-gray-200 pb-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start">
        {/* 製品画像 */}
        <div className="w-32 h-32 flex-shrink-0">
          <div className="relative w-32 h-32 group-hover:ring-1 group-hover:ring-gray-300 transition-all overflow-hidden">
            {mainImage ? (
              <>
                <div className="absolute inset-0 z-10">
                  <div className="absolute top-0 left-0 right-0 bg-black/50 px-2 py-1">
                    <p className="text-xs font-medium text-white truncate">
                      {product.product_category_name}
                    </p>
                  </div>
                </div>
                <img
                  src={mainImage.url}
                  alt={product.name}
                  className={`w-full h-full object-cover ${shouldBlur ? 'blur-sm' : ''}`}
                />
                {product.id === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <span className="text-white text-sm font-medium">サンプル</span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* 製品情報 */}
        <div className="flex-grow ml-4 pt-4">
          <div>
            <h3 className="text-base font-medium group-hover:text-blue-600 transition-colors">
              {product.name}
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
                  <button
                    type="button"
                    className={`text-blue-600 hover:text-blue-800 ${shouldBlur ? 'pointer-events-none' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!shouldBlur) {
                        window.open(product.catalog_url, '_blank');
                      }
                    }}
                  >
                    <span className={blurClass}>カタログを見る</span>
                  </button>
                </p>
              )}
              <p className="text-xs text-gray-600">
                <span className="font-medium">設置場所:</span>{' '}
                <span className={blurClass}>{product.room_name}</span>
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

        {/* 矢印アイコン */}
        <div className="flex-shrink-0 self-center pr-4">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
}; 