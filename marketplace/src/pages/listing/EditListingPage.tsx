import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../../features/listing/hooks/useListing';
import { ListingItem } from '../../features/listing/types/listing_types';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useConstants } from '../../features/shared/hooks/useConstants';

type ListingType = 'PROPERTY_SPECS' | 'ROOM_SPECS' | 'PRODUCT_SPECS' | 'CONSULTATION' | 'PROPERTY_VIEWING';
type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'RESERVED' | 'SOLD' | 'CANCELLED';
type ListingVisibility = 'PUBLIC' | 'PRIVATE';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listingId = id ? Number(id) : undefined;
  const { data: listing, isLoading: isLoadingListing, error: listingError } = useListing(listingId);
  const { data: constants, isLoading: isLoadingConstants } = useConstants();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ListingItem>>({
    title: '',
    description: '',
    price: 0,
    is_negotiable: false,
    listing_type: 'PROPERTY_SPECS' as ListingType,
    status: 'DRAFT' as ListingStatus,
    visibility: 'PUBLIC' as ListingVisibility
  });
  const axios = useAuthenticatedAxios();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        is_negotiable: listing.is_negotiable,
        listing_type: listing.listing_type,
        status: listing.status,
        visibility: listing.visibility
      });
    }
  }, [listing]);

  const isLoading = isLoadingListing || isLoadingConstants;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (listingError || !listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">出品情報の取得に失敗しました。</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await axios.put(ENDPOINTS.LISTING.UPDATE(Number(id)), formData);
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('出品情報の更新に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await axios.put(ENDPOINTS.LISTING.UPDATE(Number(id)), {
        status: 'PUBLISHED',
        published_at: new Date().toISOString()
      });
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to publish listing:', error);
      alert('出品の公開に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900 mb-6">
            出品情報の編集
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                リスティングタイプ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({ ...formData, listing_type: e.target.value as ListingType })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">リスティングタイプを選択</option>
                {constants?.listing_types.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ListingStatus })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">ステータスを選択</option>
                {constants?.listing_statuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                公開設定 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as ListingVisibility })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">公開設定を選択</option>
                {constants?.visibility_types.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                説明
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                価格
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                min="0"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_negotiable"
                checked={formData.is_negotiable}
                onChange={(e) => setFormData({ ...formData, is_negotiable: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_negotiable" className="ml-2 block text-sm text-gray-900">
                価格相談可
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/mypage')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? '保存中...' : '保存する'}
              </button>
              {listing.status === 'draft' && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isSubmitting ? '公開中...' : '公開する'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 