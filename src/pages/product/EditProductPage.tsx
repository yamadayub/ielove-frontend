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
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; status: 'uploading' | 'completed' }>>([]);

  // nullチェックの追加
  if (!productId || !roomId || !propertyId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-gray-500">Product ID, Room ID, and Property ID are required</p>
      </div>
    );
  }

  const { data: product, isLoading: isLoadingProduct } = useProductDetails(productId);
  const { data: productImages, isLoading: isLoadingImages } = useImages({
    entity_type: 'product',
    entity_id: parseInt(productId)
  });

  const [productForm, setProductForm] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    product_code: '',
    description: '',
    catalog_url: '',
    manufacturer_id: 0,
    product_category_id: 0,
    room_id: parseInt(roomId)
  });

  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [dimensions, setDimensions] = useState<ProductDimension[]>([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingSpecs, setIsSubmittingSpecs] = useState(false);
  const [isSubmittingDimensions, setIsSubmittingDimensions] = useState(false);

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'specification' | 'dimension' | null;
    id: number | null;
    index: number | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
    index: null
  });

  React.useEffect(() => {
    if (product) {
      setProductForm({
        name: product.name,
        product_code: product.product_code,
        description: product.description || '',
        catalog_url: product.catalog_url || '',
        manufacturer_id: product.manufacturer_id,
        product_category_id: product.product_category_id,
        room_id: product.room_id
      });
        
        // 既存の画像をセット
      if (productImages && productImages.length > 0) {
        setUploadedImages(
          productImages.map((image: Image) => ({
            id: image.id.toString(),
            url: image.url,
            status: 'completed' as const
          }))
        );
      }

      // 仕様情報のセット
      if (product.specifications) {
        setSpecifications(product.specifications.map((spec: ProductSpecification) => ({
          id: spec.id,
          spec_type: spec.spec_type,
          spec_value: spec.spec_value,
          manufacturer_id: spec.manufacturer_id,
          model_number: spec.model_number
        })));
      }

      // 寸法情報のセット
      if (product.dimensions) {
        setDimensions(product.dimensions.map((dim: ProductDimension) => ({
          id: dim.id,
          dimension_type: dim.dimension_type,
          value: dim.value,
          unit: dim.unit
        })));
      }
    }
  }, [product, productImages]);

  // キャッシュを更新する関数
  const invalidateProductQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingProduct) return;

    setIsSubmittingProduct(true);
    setError(null);

    try {
      await axios.patch(
        ENDPOINTS.UPDATE_PRODUCT(productId),
        {
          ...productForm,
          room_id: Number(roomId)
        }
      );

      await invalidateProductQueries();
      setError('基本情報を更新しました');
    } catch (error) {
      console.error('Failed to update product:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`仕上げ材の更新に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
      setError('仕上げ材の更新に失敗しました');
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleSpecificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingSpecs) return;

    setIsSubmittingSpecs(true);
    setError(null);

    try {
      await axios.put(
        ENDPOINTS.UPDATE_PRODUCT_SPECIFICATIONS(productId),
        { specifications }
      );
      
      await invalidateProductQueries();
      setError('仕様情報を更新しました');
    } catch (error) {
      console.error('Failed to update specifications:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`仕様情報の更新に失敗しました: ${apiError.message || '不明なエラー'}`);
      } else {
      setError('仕様情報の更新に失敗しました');
      }
    } finally {
      setIsSubmittingSpecs(false);
    }
  };

  const handleDimensionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingDimensions) return;

    setIsSubmittingDimensions(true);
    setError(null);

    try {
      await axios.put(
        ENDPOINTS.UPDATE_PRODUCT_DIMENSIONS(productId),
        { dimensions }
      );
      
      await invalidateProductQueries();
      setError('寸法情報を更新しました');
    } catch (error) {
      console.error('Failed to update dimensions:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`寸法情報の更新に失敗しました: ${apiError.message || '不明なエラー'}`);
      } else {
      setError('寸法情報の更新に失敗しました');
      }
    } finally {
      setIsSubmittingDimensions(false);
    }
  };

  const handleAddSpecification = async () => {
    try {
      const { data } = await axios.post(
        ENDPOINTS.CREATE_PRODUCT_SPECIFICATION(productId),
        {
          spec_type: "仕様タイプ",
          spec_value: "",
          manufacturer_id: 0,
          model_number: ""
        }
      );

      setSpecifications(prev => [...prev, data]);
      await invalidateProductQueries();
    } catch (error) {
      console.error('Failed to create specification:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`仕様情報の追加に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('仕様情報の追加に失敗しました');
      }
    }
  };

  const handleAddDimension = async () => {
    try {
      const { data } = await axios.post(
        ENDPOINTS.CREATE_PRODUCT_DIMENSION(productId),
        {
          dimension_type: "寸法タイプ",
          value: 0,
          unit: "mm"
        }
      );
      
      setDimensions(prev => [...prev, data]);
      await invalidateProductQueries();
    } catch (error) {
      console.error('Failed to create dimension:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`寸法情報の追加に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('寸法情報の追加に失敗しました');
      }
    }
  };

  const handleDelete = async () => {
    const { type, id, index } = deleteModalState;
    if (!type || id === null || index === null) return;

    try {
      if (type === 'specification') {
        await axios.delete(ENDPOINTS.DELETE_PRODUCT_SPECIFICATION(id));
        setSpecifications(prev => prev.filter((_, i) => i !== index));
      } else {
        await axios.delete(ENDPOINTS.DELETE_PRODUCT_DIMENSION(id));
        setDimensions(prev => prev.filter((_, i) => i !== index));
      }

      await invalidateProductQueries();
      setDeleteModalState({
        isOpen: false,
        type: null,
        id: null,
        index: null
      });
    } catch (error) {
      console.error('Failed to delete:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`${type === 'specification' ? '仕様情報' : '寸法情報'}の削除に失敗しました: ${apiError.message || '不明なエラー'}`);
      } else {
        setError(`${type === 'specification' ? '仕様情報' : '寸法情報'}の削除に失敗しました`);
      }
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const { data: presignedData } = await axios.post(
          ENDPOINTS.GET_PRESIGNED_URL,
          {
            content_type: file.type,
            file_name: file.name
          }
        );

        const tempImage = {
          id: presignedData.image_id,
          url: '',
          status: 'uploading' as const
        };
        setUploadedImages(prev => [...prev, tempImage]);

        await axios.put(presignedData.presigned_url, file, {
          headers: {
            'Content-Type': file.type
          }
        });

        await axios.post(
          ENDPOINTS.COMPLETE_IMAGE_UPLOAD(presignedData.image_id),
          {
            entity_type: 'product',
            entity_id: Number(productId)
          }
        );

        setUploadedImages(prev =>
          prev.map(img =>
            img.id === presignedData.image_id
              ? { ...img, url: presignedData.url, status: 'completed' as const }
              : img
          )
        );

        await queryClient.invalidateQueries({
          queryKey: ['images', { entity_type: 'product', entity_id: productId }]
        });
      } catch (error) {
        console.error('Failed to upload image:', error);
        if (error instanceof AxiosError && error.response?.data) {
          const apiError = error.response.data as ApiError;
          setError(`画像のアップロードに失敗しました: ${apiError.message || '不明なエラー'}`);
        } else {
        setError('画像のアップロードに失敗しました');
        }
      }
    }
  };

  const handleImageDelete = async (imageId: string) => {
    try {
      await axios.delete(ENDPOINTS.DELETE_IMAGE(imageId));
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      
      await queryClient.invalidateQueries({
        queryKey: ['images', { entity_type: 'product', entity_id: productId }]
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`画像の削除に失敗しました: ${apiError.message || '不明なエラー'}`);
      } else {
      setError('画像の削除に失敗しました');
      }
    }
  };

  const handleDeleteSpecification = (spec: ProductSpecification, index: number) => {
    if (!spec.id) {
      setSpecifications(prev => prev.filter((_, i) => i !== index));
      return;
    }

    setDeleteModalState({
      isOpen: true,
      type: 'specification',
      id: spec.id,
      index
    });
  };

  const handleDeleteDimension = (dim: ProductDimension, index: number) => {
    if (!dim.id) {
      setDimensions(prev => prev.filter((_, i) => i !== index));
      return;
    }

    setDeleteModalState({
      isOpen: true,
      type: 'dimension',
      id: dim.id,
      index
    });
  };

  const updateSpecification = (index: number, field: keyof ProductSpecification, value: string | number) => {
    setSpecifications(prev => prev.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const updateDimension = (index: number, field: keyof ProductDimension, value: string | number) => {
    setDimensions(prev => prev.map((dim, i) => 
      i === index ? { ...dim, [field]: value } : dim
    ));
  };

  if (isLoadingProduct || isLoadingImages) {
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
          <h1 className="ml-2 text-lg font-semibold">{product.name}の編集</h1>
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

      <div className="md:max-w-2xl md:mx-auto space-y-8">
        {/* 基本情報フォーム */}
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleProductSubmit} className="space-y-6 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写真
            </label>
            <ImageUploader
                images={uploadedImages}
                onUpload={handleUpload}
                onDelete={handleImageDelete}
            />
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

            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
              <button
                type="submit"
                disabled={isSubmittingProduct}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmittingProduct 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmittingProduct ? '保存中...' : '基本情報を保存'}
              </button>
            </div>
          </form>
        </div>

        {/* 仕様情報フォーム */}
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleSpecificationsSubmit} className="space-y-6 p-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">仕様情報</h2>
              <button
                type="button"
                onClick={handleAddSpecification}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </button>
            </div>

              {specifications.map((spec, index) => (
              <div key={spec.id || index} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        仕様タイプ
                      </label>
                      <input
                        type="text"
                        value={spec.spec_type}
                        onChange={(e) => updateSpecification(index, 'spec_type', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        仕様値
                      </label>
                      <input
                        type="text"
                        value={spec.spec_value}
                        onChange={(e) => updateSpecification(index, 'spec_value', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSpecification(spec, index)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  </div>
                </div>
              ))}

            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
              <button
                type="submit"
                disabled={isSubmittingSpecs}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSubmittingSpecs ? '更新中...' : '仕様情報を更新'}
              </button>
            </div>
          </form>
        </div>

        {/* 寸法情報フォーム */}
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleDimensionsSubmit} className="space-y-6 p-4 border-t">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">寸法情報</h2>
              <button
                type="button"
                onClick={handleAddDimension}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                追加
              </button>
            </div>

              {dimensions.map((dim, index) => (
              <div key={dim.id || index} className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        寸法タイプ
                      </label>
                      <input
                        type="text"
                        value={dim.dimension_type}
                        onChange={(e) => updateDimension(index, 'dimension_type', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                          値
                      </label>
                      <input
                        type="number"
                        value={dim.value}
                        onChange={(e) => updateDimension(index, 'value', parseFloat(e.target.value))}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        単位
                      </label>
                        <input
                          type="text"
                        value={dim.unit}
                        onChange={(e) => updateDimension(index, 'unit', e.target.value)}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDimension(dim, index)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  </div>
                </div>
              ))}

          <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
            <button
              type="submit"
                disabled={isSubmittingDimensions}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSubmittingDimensions ? '更新中...' : '寸法情報を更新'}
            </button>
          </div>
        </form>
      </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, type: null, id: null, index: null })}
        onConfirm={handleDelete}
        title="削除の確認"
        message={`この${deleteModalState.type === 'specification' ? '仕様情報' : '寸法情報'}を削除してもよろしいですか？`}
      />
    </div>
  );
};