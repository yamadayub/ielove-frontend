import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { SellerProfileSchema } from '../types/seller_types';
import { useSellerAxios } from '../../shared/api/axios';

interface BecomeSellerProps {
  userId: number;
  onRegistered?: () => void;
}

export const BecomeSeller: React.FC<BecomeSellerProps> = ({ userId, onRegistered }) => {
  const queryClient = useQueryClient();
  const axios = useSellerAxios();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const profileData: Partial<SellerProfileSchema> = {
        user_id: userId,
      };

      await axios.post<SellerProfileSchema>(
        '/api/sellers/register',
        profileData
      );
      
      // キャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['seller-profile', userId] });
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });

      setIsOpen(false);
      onRegistered?.();
    } catch (error: any) {
      console.error('Failed to register seller:', error);
      setError(error.response?.data?.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        出品者として登録
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-10"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              出品者登録
            </Dialog.Title>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                出品者として登録すると、物件の仕様情報を出品できるようになります。
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? '登録中...' : '登録する'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}; 