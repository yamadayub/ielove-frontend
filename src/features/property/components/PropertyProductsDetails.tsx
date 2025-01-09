import React from 'react';
import { ProductDetailTile } from '../../product/components/ProductDetailTile';
import { ProductDetails } from '../../product/types/product_types';
import { Image } from '../../image/types/image_types';
import { useAuth } from '@clerk/clerk-react';

interface PropertyProductsDetailsProps {
  propertyId: string;
  products: ProductDetails[];
  images: Image[];
  isPurchased: boolean;
  isOwner: boolean;
}

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

  console.log('PropertyProductsDetails - props:', {
    propertyId,
    productsLength: products.length,
    imagesLength: images.length,
    isPurchased,
    isOwner,
    userId,
    shouldBlur
  });

  // 部屋ごとに製品をグループ化
  const productsByRoom = products?.reduce((acc, product) => {
    const roomId = product.room_id;
    if (!acc[roomId]) {
      acc[roomId] = {
        roomName: product.room_name,
        products: []
      };
    }
    acc[roomId].products.push(product);
    return acc;
  }, {} as { [key: number]: { roomName: string; products: ProductDetails[] } });

  console.log('PropertyProductsDetails - productsByRoom:', productsByRoom);

  return (
    <div className="mt-8">
      {showMessage && (
        <p className="text-sm text-gray-500 mb-4 px-4">
          物件仕様購入後に以下{products.length}件の詳細仕様が閲覧可能になります
        </p>
      )}
      
      <div className="space-y-8">
        {Object.entries(productsByRoom || {}).map(([roomId, { roomName, products: roomProducts }]) => (
          <div key={roomId} className="space-y-4">
            <div className="border-b border-gray-900/10 pb-1 px-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {roomName || '部屋名なし'}
              </h3>
            </div>
            <div className="pl-4 divide-y divide-gray-200">
              {roomProducts.map(product => {
                const mainImage = images?.find(img => 
                  img.product_id === product.id && 
                  img.image_type === 'MAIN'
                );

                return (
                  <ProductDetailTile
                    key={product.id}
                    product={product}
                    mainImage={mainImage}
                    propertyId={propertyId}
                    shouldBlur={shouldBlur}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 