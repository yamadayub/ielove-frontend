import React from 'react';
import { useForm } from 'react-hook-form';
import type { SellerProfile } from '../../../types/types';

interface Props {
  initialData?: SellerProfile;
  onSubmit: (data: Partial<SellerProfile>) => void;
}

export const SellerProfileForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit } = useForm<Partial<SellerProfile>>({
    defaultValues: initialData || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-500">
        出品者として登録すると、物件の仕様情報を出品できるようになります。
      </p>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {initialData ? '更新' : '登録'}
      </button>
    </form>
  );
}; 