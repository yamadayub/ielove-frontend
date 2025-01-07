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

  return (
    <div className="mt-8">
      {showMessage && (
        <p className="text-sm text-gray-500 mb-4">
          仕様の詳細情報は詳細情報を購入すると表示されます
        </p>
      )}
      
      {shouldBlur ? (
        <div className="divide-y divide-gray-200">
          <ProductDetailTile
            key="sample"
            product={{
              id: 0,
              name: 'Live Natural Premium Rustic',
              manufacturer_name: '朝日ウッドテック',
              product_code: 'PMT2KJ05RYS',
              room_id: 0,
              room_name: 'サンプル',
              product_category_name: '床材',
              specifications: [
                {
                  id: 1,
                  product_id: 0,
                  spec_type: '素材',
                  spec_value: 'オーク N-45°'
                }
              ],
              dimensions: [],
              images: [{
                id: 0,
                url: 'https://www.woodtec.co.jp/cms/wp-content/uploads/2021/11/210917B14_dl_1024.jpg',
                product_id: 0,
                image_type: 'MAIN'
              }]
            }}
            mainImage={{
              id: 0,
              url: 'https://www.woodtec.co.jp/cms/wp-content/uploads/2021/11/210917B14_dl_1024.jpg',
              product_id: 0,
              image_type: 'MAIN'
            }}
            propertyId={propertyId}
            shouldBlur={false}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
}; 