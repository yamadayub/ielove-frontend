import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetails } from '../../features/product/hooks/useProductDetails';
import { useImages } from '../../features/image/hooks/useImages';
import { ProductDetailView } from '../../features/product/components/ProductDetailView';
import { Breadcrumb } from '../../features/common/components/navigation/Breadcrumb';
import { usePropertyPurchaseStatus } from '../../features/transaction/hooks/usePropertyPurchaseStatus';
import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { Loader2 } from 'lucide-react';
import { ProductHeader } from '../../features/product/components/ProductHeader';
import { ProductBasicInfo } from '../../features/product/components/ProductBasicInfo';

export const ProductDetailPage: React.FC = () => {
  const { propertyId, roomId, productId } = useParams<{
    propertyId: string;
    roomId: string;
    productId: string;
  }>();
  const axios = useAuthenticatedAxios();

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
  const { data: images, isLoading: isLoadingImages } = useImages({ productId });
  const { data: purchaseStatus, isLoading: isPurchaseStatusLoading } = usePropertyPurchaseStatus(Number(propertyId));
  const { data: listingData, isLoading: isListingLoading } = useQuery({
    queryKey: ['listing', propertyId],
    queryFn: async () => {
      const { data } = await axios.get(ENDPOINTS.LISTING.GET_BY_PROPERTY(propertyId));
      return data;
    },
    enabled: !!propertyId
  });

  const mainImage = images?.find(img => img.image_type === 'main');
  const displayImage = mainImage || images?.[0];

  // ブラー処理が必要かどうかを判定
  // 未購入の場合にブラー表示（ログイン状態に関係なく）
  const shouldBlur = !purchaseStatus?.isPurchased;

  // ブラー用のクラス
  const blurClass = shouldBlur ? 'blur-[6px]' : '';

  const isLoading = isLoadingProduct || isLoadingImages || isPurchaseStatusLoading || isListingLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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
          <ProductHeader
            name={product.name}
            productCategoryName={product.product_category_name}
            displayImage={displayImage}
            propertyId={Number(propertyId)}
            listingId={listingData?.listing?.id}
            isPurchased={purchaseStatus?.isPurchased}
            isLoading={isLoading}
            price={listingData?.listing?.price}
          />

          <ProductBasicInfo
            manufacturerName={product.manufacturer_name}
            productCode={product.product_code}
            catalogUrl={product.catalog_url}
            description={product.description}
            shouldBlur={shouldBlur}
            blurClass={blurClass}
          />
        </div>

        <ProductDetailView
          specifications={product.specifications}
          dimensions={product.dimensions}
          isPurchased={purchaseStatus?.isPurchased}
          shouldBlur={shouldBlur}
        />
      </div>
    </div>
  );
};