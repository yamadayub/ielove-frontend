import React from 'react';
import { Link } from 'react-router-dom';
import type { Image } from '../../image/types/image_types';

interface Specification {
  id: number;
  product_id: number;
  spec_type: string;
  spec_value: string;
  manufacturer_id: number;
  model_number: string;
}

interface Dimension {
  id: number;
  product_id: number;
  dimension_type: string;
  value: number;
  unit: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  product_code: string;
  catalog_url: string;
  room_id: number;
  room_name: string;
  product_category_id: number;
  product_category_name: string;
  manufacturer_id: number;
  manufacturer_name: string;
  specifications: Specification[];
  dimensions: Dimension[];
}

interface ProductDetailTileProps {
  product: Product;
  mainImage: Image;
  propertyId: string;
}

export const ProductDetailTile: React.FC<ProductDetailTileProps> = ({
  product,
  mainImage,
  propertyId,
}) => {
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
                <span className="font-medium">メーカー:</span> {product.manufacturer_name}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">型番:</span> {product.product_code}
              </p>
              {product.catalog_url && (
                <p>
                  <a
                    href={product.catalog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    カタログを見る
                  </a>
                </p>
              )}
              <p className="text-xs text-gray-600">
                <span className="font-medium">設置場所:</span> {product.room_name}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">カテゴリ:</span> {product.product_category_name}
              </p>
            </div>
          </div>

          {/* 製品説明 */}
          <p className="mt-2 text-xs text-gray-700">{product.description}</p>

          {/* 仕様情報 */}
          {product.specifications.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-900">仕様情報</h4>
              <div className="mt-1 space-y-1">
                {product.specifications.map(spec => (
                  <div key={spec.id} className="text-xs">
                    <span className="font-medium text-gray-600">{spec.spec_type}:</span>{' '}
                    <span className="text-gray-900">{spec.spec_value}</span>
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
                    <span className="text-gray-900">{dim.value}{dim.unit}</span>
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