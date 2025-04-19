import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useListing } from '../../features/listing/hooks/useListing';
import { AxiosError } from 'axios';
import { useAuthenticatedAxios } from '../../features/shared/api/axios';
import { ENDPOINTS } from '../../features/shared/api/endpoints';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const axios = useAuthenticatedAxios();
  const listingId = useStore((state) => state.currentCheckoutListingId);
  const { data: listing, isLoading } = useListing(listingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post(ENDPOINTS.TRANSACTIONS.CHECKOUT, {
        listingId: listingId
      });
      window.location.href = data.url;
    } catch (error) {
      console.error('支払い処理に失敗しました:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const apiError = error.response.data as ApiError;
        setError(`支払い処理に失敗しました: ${apiError.message || JSON.stringify(apiError)}`);
      } else {
        setError('支払い処理に失敗しました。もう一度お試しください。');
      }
    }
  };

  if (!isSignedIn) {
    navigate('/sign-in');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">リスティング情報が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">購入内容の確認</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">注文内容</h2>
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>{listing.title}</span>
            <span className="font-medium">
              ¥{listing.price.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>合計</span>
          <span>¥{listing.price.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          購入する
        </button>
      </form>
    </div>
  );
};