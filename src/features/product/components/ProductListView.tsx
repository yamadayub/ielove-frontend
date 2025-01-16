import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, ProductDetails, ProductSpecification } from '../types/product_types';
import type { Image } from '../../image/types/image_types';
import { useAuth } from '@clerk/clerk-react';
import { ImageIcon } from 'lucide-react';

interface ProductListViewProps {
  propertyId: string;
  roomId: string;
  products: ProductDetails[];
  images: Image[];
  isPurchased?: boolean;
  isOwner?: boolean;
}

export const ProductListView: React.FC<ProductListViewProps> = ({ 
  propertyId, 
  roomId, 
  products,
  images,
  isPurchased = false,
  isOwner = false
}) => {
  const { userId } = useAuth();
  const shouldBlur = !userId || !(isPurchased || isOwner);
  const navigate = useNavigate();

  const handleProductClick = (productId: number | undefined) => {
    if (productId === undefined) return;
    navigate(`/property/${propertyId}/room/${roomId}/product/${productId}`);
  };

  // 部屋ごとに製品をグループ化
  const productsByRoom = products?.reduce((acc, product) => {
    const roomId = product.room_id;
    if (!acc[roomId]) {
      acc[roomId] = {
        roomName: product.room_name || '部屋名なし',
        products: []
      };
    }
    acc[roomId].products.push(product);
    return acc;
  }, {} as { [key: number]: { roomName: string; products: ProductDetails[] } });

  return (
    <div>
      {shouldBlur && (
        <p className="text-sm text-gray-500 mb-4 pt-4">
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
              {roomProducts.map(product => {
                // メイン画像を取得（product_idでフィルタリング、product_specification_idがnullのもの）
                const productImages = images?.filter(img => 
                  img.product_id === product.id && !img.product_specification_id
                );
                const mainImage = productImages?.find(img => img.image_type === 'MAIN') || 
                                productImages?.[0];  // メイン画像がない場合は最初の画像を使用

                return (
                  <div key={product.id} className="group block w-full border-b border-gray-300 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {mainImage ? (
                          <img
                            src={mainImage.url}
                            alt={product.name}
                            className={`w-32 h-32 object-cover ${shouldBlur && mainImage.image_type === 'PAID' ? 'blur-sm' : ''}`}
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow ml-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">商品名</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>{product.name}</span>
                        </div>
                        {product.manufacturer_name && (
                          <div className="text-sm mt-1">
                            <span className="font-medium text-gray-900">メーカー</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>{product.manufacturer_name}</span>
                          </div>
                        )}
                        {product.product_code && (
                          <div className="text-sm mt-1">
                            <span className="font-medium text-gray-900">型番</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>{product.product_code}</span>
                          </div>
                        )}
                        {product.catalog_url && (
                          <div className="text-sm mt-1">
                            <span className="font-medium text-gray-900">カタログ</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>
                              <a href={product.catalog_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                リンク
                              </a>
                            </span>
                          </div>
                        )}
                        {product.description && (
                          <div className="text-sm mt-1">
                            <span className="font-medium text-gray-900">説明</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>{product.description}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 仕様情報の表示 */}
                    {product.specifications?.map((spec: ProductSpecification) => {
                      // 仕様に紐づく画像を取得
                      const specImages = images?.filter(img => {
                        if (!img.product_specification_id || !spec.id) return false;
                        return img.product_specification_id === spec.id;
                      });
                      const specMainImage = specImages?.find(img => img.image_type === 'MAIN') || 
                                        specImages?.[0];  // メイン画像がない場合は最初の画像を使用
                      
                      return (
                        <div key={spec.id} className="ml-8 flex items-start">
                          <div className="flex-shrink-0">
                            {specMainImage ? (
                              <img
                                src={specMainImage.url}
                                alt={`${spec.spec_type} - ${spec.spec_value}`}
                                className={`w-24 h-24 object-cover ${shouldBlur && specMainImage.image_type === 'PAID' ? 'blur-sm' : ''}`}
                              />
                            ) : (
                              <div className="text-sm text-gray-500">
                                （オプション）
                              </div>
                            )}
                          </div>
                          <div className="flex-grow ml-4">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">{spec.spec_type}</span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className={`text-gray-700 ${shouldBlur ? 'blur-sm' : ''}`}>{spec.spec_value}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};