import React from 'react';
import { ProductDetails, ProductSpecification } from '../../product/types/product_types';
import { Image, ImageType } from '../../image/types/image_types';
import { useAuth } from '@clerk/clerk-react';
import { ImageIcon } from 'lucide-react';

interface PropertyProductsDetailsProps {
  propertyId: string;
  products: ProductDetails[];
  images: Image[];
  isPurchased: boolean;
  isOwner: boolean;
}

interface ProductTileProps {
  product: ProductDetails;
  isPurchased: boolean;
  images: Image[];
}

const ProductTile: React.FC<ProductTileProps> = ({ product, isPurchased, images }) => {
  // メイン画像を取得（product_idでフィルタリング、product_specification_idがnullのもの）
  const productImages = images?.filter(img => 
    img.product_id === product.id && !img.product_specification_id
  );
  const mainImage = productImages?.find(img => img.image_type === 'MAIN') || 
                   productImages?.[0];  // メイン画像がない場合は最初の画像を使用

  return (
    <div className="group block w-full border-b border-gray-300 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.name}
              className="w-32 h-32 object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-grow ml-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          {product.manufacturer_name && (
            <p className="mt-1 text-sm text-gray-500">{product.manufacturer_name}</p>
          )}
          {product.description && (
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
          )}
        </div>
      </div>

      {/* 仕様情報の表示 */}
      {product.specifications?.map((spec: ProductSpecification) => {
        // 仕様に紐づく画像を取得
        const specImages = images?.filter(img => img.product_specification_id === spec.id);
        const specMainImage = specImages?.find(img => img.image_type === 'MAIN') || 
                            specImages?.[0];  // メイン画像がない場合は最初の画像を使用
        
        return (
          <div key={spec.id} className="ml-8 flex items-start">
            <div className="flex-shrink-0 py-2">
              {specMainImage ? (
                <img
                  src={specMainImage.url}
                  alt={`${spec.spec_type} - ${spec.spec_value}`}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                <div className="text-sm text-gray-500">
                  （オプション）
                </div>
              )}
            </div>
            <div className="flex-grow ml-4 py-2">
              <div className="text-sm">
                <span className="font-medium text-gray-900">{spec.spec_type}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-700">{spec.spec_value}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PropertyProductsDetails: React.FC<PropertyProductsDetailsProps> = ({
  propertyId,
  products,
  images,
  isPurchased,
  isOwner,
}) => {
  const { userId } = useAuth();
  const shouldBlur = !userId || !(isPurchased || isOwner);
  const showMessage = !userId || !(isPurchased || isOwner);

  // 部屋ごとに製品をグループ化
  const productsByRoom = products?.reduce((acc, product) => {
    const roomId = product.room_id;
    if (!acc[roomId]) {
      acc[roomId] = {
        roomName: product.room_name || '部屋名なし', // デフォルト値を設定
        products: []
      };
    }
    acc[roomId].products.push(product);
    return acc;
  }, {} as { [key: number]: { roomName: string; products: ProductDetails[] } });

  return (
    <div>
      {showMessage && (
        <p className="text-sm text-gray-500 mb-4 px-4 pt-4">
          物件仕様購入後に以下{products.length}件の詳細仕様が閲覧可能になります
        </p>
      )}
      
      <div>
        {Object.entries(productsByRoom || {}).map(([roomId, { roomName, products: roomProducts }]) => (
          <div key={roomId}>
            <div className="border-b border-gray-900/10">
              <h3 className="text-xl font-semibold text-gray-900 px-4 pt-4">
                {roomName}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {roomProducts.map(product => (
                <ProductTile
                  key={product.id}
                  product={product}
                  isPurchased={isPurchased}
                  images={images}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 