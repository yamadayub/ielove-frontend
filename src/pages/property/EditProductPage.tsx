import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { ImageUploader } from '../../components/property/ImageUploader';
import { useProductDetails } from '../../api/quieries/useProductDetails';
import { useImages } from '../../api/quieries/useImages';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';
import type { Product, Specification, Dimension } from '../../types/product';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

interface ProductFormData {
  name: string;
  product_code: string;
  description: string;
  catalog_url: string;
  manufacturer_id: number;
  product_category_id: number;
}

interface SpecificationFormData {
  id?: number;
  spec_type: string;
  spec_value: string;
  manufacturer_id: number;
  model_number: string;
}

interface DimensionFormData {
  id?: number;
  dimension_type: string;
  value: number;
  unit: string;
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
  const { propertyId, roomId, productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; status: 'uploading' | 'completed' }>>([]);

  const { data: product, isLoading: isLoadingProduct } = useProductDetails(productId!);
  const { data: productImages, isLoading: isLoadingImages } = useImages({
    entity_type: 'product',
    entity_id: parseInt(productId!)
  });

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    product_code: '',
    description: '',
    catalog_url: '',
    manufacturer_id: 0,
    product_category_id: 0
  });

  const [specifications, setSpecifications] = useState<SpecificationFormData[]>([]);
  const [dimensions, setDimensions] = useState<DimensionFormData[]>([]);
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
        description: product.description,
        catalog_url: product.catalog_url,
        manufacturer_id: product.manufacturer_id,
        product_category_id: product.product_category_id
      });
        
        // 既存の画像をセット
      if (productImages?.length > 0) {
        setUploadedImages(
          productImages.map(image => ({
            id: image.id.toString(),
            url: image.url,
            status: 'completed'
          }))
        );
      }

      // 仕様情報のセット
      if (product.specifications) {
        setSpecifications(product.specifications.map(spec => ({
          id: spec.id,
          spec_type: spec.spec_type,
          spec_value: spec.spec_value,
          manufacturer_id: spec.manufacturer_id,
          model_number: spec.model_number
        })));
      }

      // 寸法情報のセット
      if (product.dimensions) {
        setDimensions(product.dimensions.map(dim => ({
          id: dim.id,
          dimension_type: dim.dimension_type,
          value: dim.value,
          unit: dim.unit
        })));
      }
    }
  }, [product, uploadedImages]);

  // キャッシュを更新する関数
  const invalidateProductQueries = () => {
    queryClient.invalidateQueries(['product', productId]);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingProduct) return;

    setIsSubmittingProduct(true);
    setError(null);

    try {
      console.log('Updating product with data:', {
        ...productForm,
        room_id: Number(roomId),
        images: imageUploader.images.map(img => img.url)
      });

      await axios.patch(
        `${API_URL}/api/products/${productId}?clerk_user_id=${userId}`,
        {
          ...productForm,
          room_id: Number(roomId),
          images: imageUploader.images.map(img => img.url)
        }
      );
      // キャッシュを更新して再フェッチ
      await invalidateProductQueries();
      setError('基本情報を更新しました');
    } catch (error) {
      console.error('Failed to update product:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        setError(`仕上げ材の更新に失敗しました: ${JSON.stringify(error.response.data)}`);
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
        `${API_URL}${ENDPOINTS.UPDATE_PRODUCT_SPECIFICATIONS(productId!)}?clerk_user_id=${userId}`,
        { specifications }
      );
      
      // キャッシュを更新して再フェッチ
      invalidateProductQueries();
    } catch (error) {
      console.error('Failed to update specifications:', error);
      setError('仕様情報の更新に失敗しました');
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
        `${API_URL}${ENDPOINTS.UPDATE_PRODUCT_DIMENSIONS(productId!)}?clerk_user_id=${userId}`,
        { dimensions }
      );
      
      // キャッシュを更新して再フェッチ
      invalidateProductQueries();
    } catch (error) {
      console.error('Failed to update dimensions:', error);
      setError('寸法情報の更新に失敗しました');
    } finally {
      setIsSubmittingDimensions(false);
    }
  };

  const addSpecification = async () => {
    try {
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.CREATE_PRODUCT_SPECIFICATION(productId!)}?clerk_user_id=${userId}`,
        {
          spec_type: "仕様タイプ",  // 空文字列ではなく、デフォルト値を設定
          spec_value: "仕様値",     // 空文字列ではなく、デフォルト値を設定
          manufacturer_id: product?.manufacturer_id || undefined,  // nullではなくundefinedを使用
          model_number: undefined   // 空文字列ではなくundefinedを使用
        }
      );
      
      // キャッシュを更新して再フェッチ
      await invalidateProductQueries();
      
      // 新しい仕様情報をフォームに追加
      setSpecifications([...specifications, response.data]);
    } catch (error) {
      console.error('Failed to create specification:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        setError(`仕様情報の追加に失敗しました: ${JSON.stringify(error.response.data)}`);
      } else {
        setError('仕様情報の追加に失敗しました');
      }
    }
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: keyof SpecificationFormData, value: string) => {
    setSpecifications(specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    ));
  };

  const addDimension = async () => {
    try {
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.CREATE_PRODUCT_DIMENSION(productId!)}?clerk_user_id=${userId}`,
        {
          product_id: Number(productId),
          dimension_type: '',
          value: 0,
          unit: 'mm'
        }
      );
      
      // キャッシュを更新して再フェッチ
      await invalidateProductQueries();
      
      // 新しい寸法情報をフォームに追加
      setDimensions([...dimensions, response.data]);
    } catch (error) {
      console.error('Failed to create dimension:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
        setError(`寸法情報の追加に失敗しました: ${JSON.stringify(error.response.data)}`);
      } else {
        setError('寸法情報の追加に失敗しました');
      }
    }
  };

  const removeDimension = (index: number) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
  };

  const updateDimension = (index: number, field: keyof DimensionFormData, value: string | number) => {
    setDimensions(dimensions.map((dim, i) => 
      i === index ? { ...dim, [field]: value } : dim
    ));
  };

  const handleDeleteSpecification = async (spec: SpecificationFormData, index: number) => {
    if (!spec.id) {
      removeSpecification(index);
      return;
    }

    setDeleteModalState({
      isOpen: true,
      type: 'specification',
      id: spec.id,
      index
    });
  };

  const handleDeleteDimension = async (dim: DimensionFormData, index: number) => {
    if (!dim.id) {
      removeDimension(index);
      return;
    }

    setDeleteModalState({
      isOpen: true,
      type: 'dimension',
      id: dim.id,
      index
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id, index } = deleteModalState;
    if (!type || !id || index === null) return;

    try {
      if (type === 'specification') {
        await axios.delete(
          `${API_URL}${ENDPOINTS.DELETE_PRODUCT_SPECIFICATION(id)}?clerk_user_id=${userId}`
        );
        removeSpecification(index);
      } else {
        await axios.delete(
          `${API_URL}${ENDPOINTS.DELETE_PRODUCT_DIMENSION(id)}?clerk_user_id=${userId}`
        );
        removeDimension(index);
      }

      // キャッシュを更新して再フェッチ
      invalidateProductQueries();
    } catch (error) {
      console.error('Failed to delete:', error);
      setError(`${type === 'specification' ? '仕様情��' : '寸法情報'}の削除に失敗しました`);
    } finally {
      setDeleteModalState({
        isOpen: false,
        type: null,
        id: null,
        index: null
      });
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || !userId) return;

    for (const file of Array.from(files)) {
      try {
        // 1. プリサインドURLを取得
        const { data: presignedData } = await axiosInstance.post(
          `${ENDPOINTS.GET_PRESIGNED_URL}?clerk_user_id=${userId}`,
          {
            content_type: file.type,
            entity_type: 'product',
            product_id: Number(productId),
            room_id: Number(roomId),
            property_id: Number(propertyId)
          }
        );

        // 一時的な状態として画像を追加
        const tempImage = {
          id: presignedData.image_id,
          url: '',
          status: 'uploading'
        };
        setImages(prev => [...prev, tempImage]);

        // 2. S3に画像をアップロード
        await axiosInstance.put(presignedData.presigned_url, file, {
          headers: {
            'Content-Type': file.type
          }
        });

        // 3. アップロード完了を通知
        await axiosInstance.post(
          `${ENDPOINTS.COMPLETE_IMAGE_UPLOAD(presignedData.image_id)}?clerk_user_id=${userId}`,
          {
            product_id: Number(productId),
            room_id: Number(roomId),
            property_id: Number(propertyId)
          }
        );

        // 4. 状態を更新
        setImages(prev =>
          prev.map(img =>
            img.id === presignedData.image_id
              ? { ...img, url: presignedData.url, status: 'completed' }
              : img
          )
        );
      } catch (error) {
        console.error('Failed to upload image:', error);
        setError('画像のアップロードに失敗しました');
      }
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await axiosInstance.delete(
        `${ENDPOINTS.DELETE_IMAGE(imageId)}?clerk_user_id=${userId}`
      );
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      setError('画像の削除に失敗しました');
    }
  };

  if (isLoadingProduct || isLoadingImages) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">仕上げ材が見つかりませんでした</h2>
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
          <form onSubmit={handleSpecificationsSubmit} className="space-y-6 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">仕様情報</h2>
              <button
                type="button"
                onClick={addSpecification}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                仕様詳細を追加
              </button>
            </div>

            <div className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="relative p-4 border rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleDeleteSpecification(spec, index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        仕様タイプ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={spec.spec_type}
                        onChange={(e) => updateSpecification(index, 'spec_type', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        仕様値 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={spec.spec_value}
                        onChange={(e) => updateSpecification(index, 'spec_value', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        型番
                      </label>
                      <input
                        type="text"
                        value={spec.model_number}
                        onChange={(e) => updateSpecification(index, 'model_number', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
              <button
                type="submit"
                disabled={isSubmittingSpecs}
                className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmittingSpecs 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmittingSpecs ? '保存中...' : '仕様情報を保存'}
              </button>
            </div>
          </form>
        </div>

        {/* 寸法情報フォーム */}
        <div className="bg-white md:rounded-lg md:shadow-sm">
          <form onSubmit={handleDimensionsSubmit} className="space-y-6 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">サイズ情報</h2>
              <button
                type="button"
                onClick={addDimension}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                サイズを追加
              </button>
            </div>

            <div className="space-y-4">
              {dimensions.map((dim, index) => (
                <div key={index} className="relative p-4 border rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleDeleteDimension(dim, index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={dim.dimension_type}
                        onChange={(e) => updateDimension(index, 'dimension_type', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-base appearance-none"
                        style={{
                          fontSize: '16px',
                          height: '42px',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">選択してください</option>
                        <option value="width">幅</option>
                        <option value="height">高さ</option>
                        <option value="depth">奥行き</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        サイズ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={dim.value}
                        onChange={(e) => updateDimension(index, 'value', parseFloat(e.target.value))}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-sm"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">
                        単位
                      </label>
                      <select
                        value={dim.unit}
                        onChange={(e) => updateDimension(index, 'unit', e.target.value)}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-base appearance-none"
                        style={{
                          fontSize: '16px',
                          height: '42px',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 -mb-4">
            <button
              type="submit"
                disabled={isSubmittingDimensions}
              className={`w-full py-3 px-4 rounded-full text-white font-medium transition-colors ${
                  isSubmittingDimensions 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
                {isSubmittingDimensions ? '保存中...' : '寸法情報を保存'}
            </button>
          </div>
        </form>
      </div>
      </div>

      {/* 削除確認モーダル */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, type: null, id: null, index: null })}
        onConfirm={handleConfirmDelete}
        title="削除の確認"
        message={`この${deleteModalState.type === 'specification' ? '仕様情報' : '寸法情報'}を削除してもよろしいですか？`}
      />
    </div>
  );
};