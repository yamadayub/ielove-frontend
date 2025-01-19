import React, { useState } from 'react';
import { ProductDetails, ProductSpecification } from '../../product/types/product_types';
import type { Image, ImageType } from '../../image/types/image_types';
import { useAuth } from '@clerk/clerk-react';
import { ImageIcon, Image as LucideImage } from 'lucide-react';
import { ImagePreviewModal } from '../../common/components/modal/ImagePreviewModal';
import { useDrawings } from '../../drawing/hooks/useDrawings';

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
  const { userId } = useAuth();
  const shouldBlur = !userId || !isPurchased;
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  // メイン画像を取得（product_idでフィルタリング、product_specification_idがnullのもの）
  const productImages = images?.filter(img => 
    img.product_id === product.id && !img.product_specification_id
  );
  const mainImage = productImages?.find(img => img.image_type === 'MAIN') || 
                   productImages?.[0];  // メイン画像がない場合は最初の画像を使用

  const handleImageClick = (imageUrl: string, alt: string) => {
    if (!shouldBlur || (mainImage && mainImage.image_type !== 'PAID')) {
      setSelectedImage({ url: imageUrl, alt });
    }
  };

  return (
    <div className="group block w-full border-b border-gray-300 hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {mainImage ? (
            <div className="relative">
              <img
                src={mainImage.url}
                alt={product.name}
                className={`w-32 h-32 object-cover cursor-pointer ${shouldBlur && mainImage.image_type === 'PAID' ? 'blur-sm' : ''}`}
                onClick={() => handleImageClick(mainImage.url, product.name)}
              />
              <div className="absolute top-0 left-0 right-0 bg-black/50 px-2 py-1">
                <p className="text-xs font-medium text-white truncate">
                  {product.product_category_name}
                </p>
              </div>
            </div>
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
        const specImages = images?.filter(img => img.product_specification_id === spec.id);
        const specMainImage = specImages?.find(img => img.image_type === 'MAIN') || 
                            specImages?.[0];  // メイン画像がない場合は最初の画像を使用
        
        return (
          <div key={spec.id} className="ml-8 flex items-start">
            <div className="flex-shrink-0">
              {specMainImage ? (
                <img
                  src={specMainImage.url}
                  alt={`${spec.spec_type} - ${spec.spec_value}`}
                  className={`w-24 h-24 object-cover cursor-pointer ${shouldBlur && specMainImage.image_type === 'PAID' ? 'blur-sm' : ''}`}
                  onClick={() => handleImageClick(specMainImage.url, `${spec.spec_type} - ${spec.spec_value}`)}
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

      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt}
      />
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
  const { data: drawings } = useDrawings({ propertyId });

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

  // 図面の画像をフィルタリング
  const getDrawingImages = (drawingId: number) => {
    return images.filter(img => img.drawing_id === drawingId);
  };

  // 各図面のサムネイル画像を取得
  const getDrawingThumbnail = (drawingId: number) => {
    const drawingImages = getDrawingImages(drawingId);
    return drawingImages.length > 0 ? drawingImages[0] : null;
  };

  return (
    <div>
      {showMessage && (
        <p className="text-sm text-gray-500 mb-4 px-4 pt-4">
          物件仕様購入後に以下{products.length}件の詳細仕様が閲覧可能になります
        </p>
      )}
      
      <div>
        {/* 図面セクション */}
        {drawings && drawings.length > 0 && (
          <div>
            <div className="border-b border-gray-900/10">
              <h3 className="text-xl font-semibold text-gray-900 px-4 pt-4">
                図面
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-0.5 bg-gray-100">
              {drawings.map((drawing) => (
                <div key={drawing.id} className="relative aspect-square bg-white">
                  {getDrawingThumbnail(drawing.id) ? (
                    <div className="relative w-full h-full">
                      <img
                        src={getDrawingThumbnail(drawing.id)?.url}
                        alt={drawing.name}
                        className={`w-full h-full object-cover ${!isPurchased && !isOwner ? 'blur-sm' : ''}`}
                      />
                      {!isPurchased && !isOwner && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                            購入後に表示
                          </span>
                        </div>
                      )}
                      <div className="absolute top-0 left-0 right-0 bg-black/50 px-2 py-1">
                        <p className="text-xs font-medium text-white truncate">
                          {drawing.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <LucideImage className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm text-center">{drawing.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 部屋ごとの製品リスト */}
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