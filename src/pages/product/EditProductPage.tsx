import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { ImageUploader } from '../../features/image/components/ImageUploader';
import { useProductDetails } from '../../features/product/hooks/useProductDetails';
import { useImages } from '../../features/image/hooks/useImages';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import type { Product, ProductSpecification, ProductDimension } from '../../features/product/types/product_types';
import type { Image } from '../../features/image/types/image_types';
import { AxiosError } from 'axios';
import { useCompanies } from '../../features/company/hooks/useCompanies';

// 型定義の追加
type QueryKeys = 
  | { queryKey: ['product', string] }
  | { queryKey: ['images', { entity_type: string; entity_id: string | number }] };

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              はい
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditProductPage: React.FC = () => {
  const { propertyId, roomId, productId } = useParams<{ propertyId: string; roomId: string; productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const axios = useAuthenticatedAxios();

  // State hooks
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    product_code: '',
    description: '',
    catalog_url: '',
    manufacturer_id: 0,
    product_category_id: 0,
    room_id: parseInt(roomId || '0')
  });
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [dimensions, setDimensions] = useState<ProductDimension[]>([]);

  // Query hooks
  const { data: product, isLoading: isLoadingProduct } = useProductDetails(productId || '');
  const { 
    data: productImages, 
    isLoading: isLoadingImages,
    refetch: refetchImages 
  } = useImages({
    productId: productId || ''
  });
  const { data: manufacturers, isLoading: isLoadingManufacturers } = useCompanies({
    company_type: 'MANUFACTURER'
  });

  // 製品の画像のみをフィルタリング
  const filteredProductImages = productImages?.filter(img => img.product_id === Number(productId));

  // Effect hooks
  React.useEffect(() => {
    if (product) {
      setProductForm({
        name: product.name,
        product_code: product.product_code,
        description: product.description ?? '',
        catalog_url: product.catalog_url ?? '',
        manufacturer_id: product.manufacturer_id,
        product_category_id: product.product_category_id,
        room_id: product.room_id
      });
      if ('specifications' in product) {
        setSpecifications(product.specifications || []);
      }
      if ('dimensions' in product) {
        setDimensions(product.dimensions || []);
      }
    }
  }, [product]);

  // 必要な情報が不足している場合の表示
  if (!productId || !roomId || !propertyId || !userId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">必要な情報が不足しています</p>
      </div>
    );
  }

  const handleAddSpecification = async () => {
    try {
      const newSpec = {
        product_id: Number(productId),
        spec_type: '',
        spec_value: ''
      };

      const response = await axios.post(
        ENDPOINTS.CREATE_PRODUCT_SPECIFICATION(productId),
        newSpec
      );

      setSpecifications(prev => [...prev, response.data]);
    } catch (error) {
      console.error('仕様の追加に失敗しました:', error);
      setError('仕様の追加に失敗しました');
    }
  };

  const handleRemoveSpecification = async (specId: number | undefined) => {
    if (specId === undefined) return;

    try {
      await axios.delete(ENDPOINTS.DELETE_PRODUCT_SPECIFICATION(specId));
      setSpecifications(prev => prev.filter(spec => spec.id !== specId));
      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (error) {
      console.error('仕様の削除に失敗しました:', error);
      setError('仕様の削除に失敗しました');
    }
  };

  const handleAddDimension = async () => {
    try {
      const newDimension = {
        product_id: Number(productId),
        dimension_type: '',
        value: 0,
        unit: 'mm'
      };

      const response = await axios.post(
        ENDPOINTS.CREATE_PRODUCT_DIMENSION(productId),
        newDimension
      );

      setDimensions(prev => [...prev, response.data]);
    } catch (error) {
      console.error('寸法の追加に失敗しました:', error);
      setError('寸法の削除に失敗しました');
    }
  };

  const handleRemoveDimension = async (dimensionId: number | undefined) => {
    if (dimensionId === undefined) return;

    try {
      await axios.delete(ENDPOINTS.DELETE_PRODUCT_DIMENSION(dimensionId));
      setDimensions(prev => prev.filter(dim => dim.id !== dimensionId));
      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (error) {
      console.error('寸法の削除に失敗しました:', error);
      setError('寸法の削除に失敗しました');
    }
  };

  const handleUpdateSpecification = (specId: number | undefined, field: keyof ProductSpecification, value: string) => {
    if (specId === undefined) return;
    
    setSpecifications(prev => prev.map(spec => {
      if (spec.id === specId) {
        return { ...spec, [field]: value };
      }
      return spec;
    }));
  };

  const handleUpdateDimension = (dimensionId: number | undefined, field: keyof ProductDimension, value: string | number) => {
    if (dimensionId === undefined) return;
    
    setDimensions(prev => prev.map(dim => {
      if (dim.id === dimensionId) {
        return { ...dim, [field]: value };
      }
      return dim;
    }));
  };

  const handleSubmitBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 基本情報の更新
      await axios.patch(
        ENDPOINTS.UPDATE_PRODUCT(productId),
        {
          ...productForm,
          room_id: Number(roomId)
        }
      );

      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setError('製品情報を更新しました');
    } catch (error) {
      console.error('Failed to update product:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`製品の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('製品の更新に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSpecifications = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // バリデーション
      const isValid = specifications.every(spec => 
        spec.spec_type && 
        spec.spec_value
      );

      if (!isValid) {
        setError('すべての仕様情報を入力してください');
        return;
      }

      // 一時的なIDを除外してAPIに送信
      const specificationsToSubmit = specifications.map(({ id, product_id, spec_type, spec_value }) => ({
        ...(typeof id === 'number' ? { id } : {}),
        product_id,
        spec_type,
        spec_value
      }));

      await axios.put(
        ENDPOINTS.UPDATE_PRODUCT_SPECIFICATIONS(productId),
        specificationsToSubmit
      );

      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setError('仕様情報を更新しました');
    } catch (error) {
      console.error('Failed to update specifications:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`仕様情報の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('仕様情報の更新に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDimensions = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // バリデーション
      const isValid = dimensions.every(dim => 
        dim.dimension_type && 
        (dim.value !== undefined && dim.value !== null) && 
        dim.unit
      );

      if (!isValid) {
        setError('すべての寸法情報を入力してください');
        return;
      }

      // 一時的なIDを除外してAPIに送信
      const dimensionsToSubmit = dimensions.map(({ id, product_id, dimension_type, value, unit }) => ({
        ...(typeof id === 'number' ? { id } : {}),
        product_id,
        dimension_type,
        value,
        unit
      }));

      await axios.put(
        ENDPOINTS.UPDATE_PRODUCT_DIMENSIONS(productId),
        dimensionsToSubmit
      );

      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setError('サイズ情報を更新しました');
    } catch (error) {
      console.error('Failed to update dimensions:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`サイズ情報の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('サイズ情報の更新に失敗しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (imageData: {
    id: number;
    url: string;
    image_type: 'MAIN' | 'SUB';
    status: 'pending' | 'completed';
  }) => {
    refetchImages();
  };

  const handleImageDelete = async (imageId: number) => {
    if (!userId) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.DELETE_IMAGE(imageId)}`,
        {
          headers: {
            'x-clerk-user-id': userId
          }
        }
      );
      refetchImages();
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      setError('画像の削除に失敗しました');
    }
  };

  const handleImageTypeChange = async (imageId: number, newType: 'MAIN' | 'SUB') => {
    if (!userId) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_URL}${ENDPOINTS.UPDATE_IMAGE(imageId)}`,
        { image_type: newType },
        {
          headers: {
            'x-clerk-user-id': userId
          }
        }
      );
      refetchImages();
    } catch (error) {
      console.error('画像タイプの更新に失敗しました:', error);
      setError('画像タイプの更新に失敗しました');
    }
  };

  if (isLoadingProduct || isLoadingImages || isLoadingManufacturers) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">製品が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      {/* モバイルヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b md:hidden">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold">{product.name}編集</h1>
        </div>
      </div>

      {/* デスクトップヘッダー */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">仕上げ材の編集</h1>
      </div>

      {error && (
        <div className="mx-4 md:max-w-2xl md:mx-auto mb-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="md:max-w-2xl md:mx-auto">
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleSubmitBasicInfo} className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                写真
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {filteredProductImages?.map((image) => (
                    <div key={image.id} className="relative">
                      <div className="relative aspect-square">
                        <img
                          src={image.url}
                          alt="製品画像"
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(image.id)}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                          aria-label="画像を削除"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <select
                          value={image.image_type || 'SUB'}
                          onChange={(e) => handleImageTypeChange(image.id, e.target.value as 'MAIN' | 'SUB')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                        >
                          <option value="MAIN">メイン画像</option>
                          <option value="SUB">サブ画像</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  onError={(message: string) => setError(message)}
                  clerkUserId={userId}
                  productId={Number(productId)}
                  roomId={Number(roomId)}
                  propertyId={Number(propertyId)}
                  existingImages={filteredProductImages?.map(img => ({
                    id: img.id,
                    image_type: img.image_type || 'SUB',
                    url: img.url
                  })) || []}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                仕上げ材名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="manufacturer_id" className="block text-sm font-medium text-gray-700">
                メーカー <span className="text-red-500">*</span>
              </label>
              <select
                id="manufacturer_id"
                name="manufacturer_id"
                value={productForm.manufacturer_id || ''}
                onChange={(e) => {
                  console.log('Selected manufacturer:', e.target.value);
                  setProductForm(prev => ({ ...prev, manufacturer_id: Number(e.target.value) }));
                }}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              >
                <option value="">選択してください</option>
                {manufacturers?.map((manufacturer) => {
                  console.log('Manufacturer option:', manufacturer);
                  return (
                    <option key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="product_code" className="block text-sm font-medium text-gray-700">
                製品コード <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="product_code"
                name="product_code"
                value={productForm.product_code}
                onChange={(e) => setProductForm(prev => ({ ...prev, product_code: e.target.value }))}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div>
              <label htmlFor="catalog_url" className="block text-sm font-medium text-gray-700">
                カタログURL
              </label>
              <input
                type="url"
                id="catalog_url"
                name="catalog_url"
                value={productForm.catalog_url}
                onChange={(e) => setProductForm(prev => ({ ...prev, catalog_url: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? '保存中...' : '基本情報を更新する'}
              </button>
            </div>
          </form>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                仕様情報
              </label>
              <button
                type="button"
                onClick={handleAddSpecification}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </button>
            </div>
            <div className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.spec_type}
                      onChange={(e) => handleUpdateSpecification(spec.id, 'spec_type', e.target.value)}
                      placeholder="仕様項目"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.spec_value}
                      onChange={(e) => handleUpdateSpecification(spec.id, 'spec_value', e.target.value)}
                      placeholder="仕様値"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(spec.id)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSubmitSpecifications}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? '保存中...' : '詳細仕様を更新する'}
              </button>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                寸法情報
              </label>
              <button
                type="button"
                onClick={handleAddDimension}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </button>
            </div>
            <div className="space-y-4">
              {dimensions.map((dim, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1">
                    <select
                      value={dim.dimension_type || ''}
                      onChange={(e) => handleUpdateDimension(dim.id, 'dimension_type', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="width">幅</option>
                      <option value="height">高さ</option>
                      <option value="depth">奥行</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={dim.value ?? ''}
                      onChange={(e) => handleUpdateDimension(dim.id, 'value', e.target.value)}
                      placeholder="寸法値"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <select
                      value={dim.unit || 'mm'}
                      onChange={(e) => handleUpdateDimension(dim.id, 'unit', e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                    >
                      <option value="mm">mm</option>
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDimension(dim.id)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSubmitDimensions}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? '保存中...' : 'サイズを更新する'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};