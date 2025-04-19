import React, { useState } from 'react';
import { useMyListings } from '../hooks/useListing';
import { ListingItem } from '../types/listing_types';
import { Loader2, X } from 'lucide-react';
import { useAuthenticatedAxios } from '../../shared/api/axios';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const ListingList: React.FC = () => {
  const { data: listings, isLoading, error } = useMyListings();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">出品情報の取得に失敗しました。</p>
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-gray-700">出品中の商品はありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

interface ListingCardProps {
  listing: ListingItem;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ListingItem>>({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    is_negotiable: listing.is_negotiable,
  });
  const axios = useAuthenticatedAxios();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!listing.id || isUpdating) return;
    if (!window.confirm('この出品を削除してもよろしいですか？')) return;

    try {
      setIsUpdating(true);
      await axios.delete(ENDPOINTS.LISTING.DELETE(listing.id));
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('出品の削除に失敗しました。');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePublish = async () => {
    if (!listing.id || isUpdating) return;
    
    try {
      setIsUpdating(true);
      await axios.patch(ENDPOINTS.LISTING.UPDATE(listing.id), {
        status: 'published',
        published_at: new Date().toISOString()
      });
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
    } catch (error) {
      console.error('Failed to publish listing:', error);
      alert('出品の公開に失敗しました。');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing.id || isUpdating) return;

    try {
      setIsUpdating(true);
      await axios.patch(ENDPOINTS.LISTING.UPDATE(listing.id), formData);
      await queryClient.invalidateQueries({ queryKey: ['listings'] });
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('出品情報の更新に失敗しました。');
    } finally {
      setIsUpdating(false);
    }
  };

  if (showEditForm) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">出品情報の編集</h3>
          <button
            onClick={() => setShowEditForm(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
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
              説明
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isUpdating
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isUpdating ? '更新中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{listing.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{listing.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">¥{listing.price.toLocaleString()}</p>
          <p className="mt-1 text-sm text-gray-500">
            {listing.is_negotiable && '(相談可)'}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex space-x-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {listing.listing_type}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {listing.status}
          </span>
        </div>
        <div className="space-y-2">
          <button
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={() => navigate(`/listings/${listing.id}/edit`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            編集
          </button>
          <button
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
            onClick={handleDelete}
            disabled={isUpdating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            削除
          </button>
          {listing.status === 'DRAFT' && (
            <button
              className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isUpdating
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={handlePublish}
              disabled={isUpdating}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {isUpdating ? '処理中...' : '公開する'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 