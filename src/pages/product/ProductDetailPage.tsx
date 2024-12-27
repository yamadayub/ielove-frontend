import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetails } from '../../features/product/hooks/useProductDetails';
import { useImages } from '../../features/image/hooks/useImages';
import { ProductDetailView } from '../../features/product/components/ProductDetailView';
import { useStore } from '../../store/useStore';
import { useAuth } from '@clerk/clerk-react';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import type { ProductDetails, ProductDimension } from '../../features/product/types/product_types';
import type { Image } from '../../features/image/types/image_types';

interface Store {
  isPropertyPurchased: (propertyId: string) => boolean;
}

export const ProductDetailPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { propertyId, roomId, productId } = useParams<{
    propertyId: string;
    roomId: string;
    productId: string;
  }>();

  // パラメータのnullチェック
  if (!productId || !propertyId || !roomId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-gray-900">
          製品情報が見つかりませんでした
        </h2>
      </div>
    );
  }
  
  const { data: product, isLoading: isLoadingProduct } = useProductDetails(productId);
  const { data: images, isLoading: isLoadingImages } = useImages({
    productId
  });
  const isPropertyPurchased = useStore((state: Store) => state.isPropertyPurchased(propertyId));

  const mainImage = images?.find(img => img.image_type === 'main');
  const displayImage = mainImage || images?.[0];

  // ブラー処理が必要かどうかを判定
  // 未購入の場合にブラー表示（ログイン状態に関係なく）
  const shouldBlur = !isPropertyPurchased;

  // ブラー用のクラス
  const blurClass = shouldBlur ? 'blur-[6px] hover:blur-none transition-all duration-200' : '';

  // 寸法情報を整理する関数
  const formatDimensions = (dimensions: ProductDimension[]) => {
    const dimensionMap = dimensions.reduce((acc, dim) => {
      acc[dim.dimension_type] = `${dim.value}${dim.unit}`;
      return acc;
    }, {} as Record<string, string>);

    return `${dimensionMap.width || ''}×${dimensionMap.height || ''}×${dimensionMap.depth || ''}`;
  };

  const isLoading = isLoadingProduct || isLoadingImages;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-gray-900">
          仕上げ材が見つかりませんでした
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <Breadcrumb />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white">
          {/* メイン画像 */}
          <div className="aspect-square md:aspect-video w-full">
            <img
              src={displayImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'}
              alt={product.name || '製品画像'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 未購入の場合の購入案内 */}
          {shouldBlur && (
            <div className="px-4 py-6 bg-gradient-to-b from-blue-50/80 to-white">
              <p className="text-gray-600 text-sm">
                この物件の情報を購入すると、詳細情報をご覧いただけます。
              </p>
              <button
                className="mt-3 w-full md:w-auto min-w-[160px] px-4 py-2.5 bg-[#0095F6] text-white rounded-md text-sm font-medium hover:bg-[#1877F2] transition-colors"
                onClick={() => {/* 購入処理 */}}
              >
                物件情報を購入する
              </button>
            </div>
          )}

          {/* 製品情報 */}
          <div className="px-4 py-6 space-y-6">
            {/* カテゴリー名と製品名を1行に */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {product.product_category_name || 'カテゴリーなし'}
                <span className="ml-2 font-medium">
                  {product.name}
                </span>
              </h2>
            </div>

            {/* メーカー */}
            <div className={`border-b pb-2 ${blurClass}`}>
              <dt className="text-sm text-gray-600">メーカー</dt>
              <dd className="text-sm font-medium">{product.manufacturer_name || '不明'}</dd>
            </div>

            {/* 製品コード */}
            <div className={`border-b pb-2 ${blurClass}`}>
              <dt className="text-sm text-gray-600">製品コード</dt>
              <dd className="text-sm font-medium">{product.product_code}</dd>
            </div>

            {/* カタログリンク */}
            {product.catalog_url && (
              <div className={`pt-2 ${blurClass}`}>
                <a 
                  href={shouldBlur ? '#' : product.catalog_url}
                  onClick={e => shouldBlur && e.preventDefault()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  カタログを見る →
                </a>
              </div>
            )}

            {/* 製品説明 */}
            <div className={`pt-2 ${blurClass}`}>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* 仕様・寸法情報 */}
        <ProductDetailView
          specifications={product.specifications}
          dimensions={product.dimensions}
          isPurchased={isPropertyPurchased}
          shouldBlur={shouldBlur}
        />
      </div>
    </div>
  );
};