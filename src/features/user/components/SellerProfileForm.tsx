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
      <div>
        <label className="block text-sm font-medium text-gray-700">会社名</label>
        <input
          {...register('company_name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">代表者名</label>
        <input
          {...register('representative_name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">郵便番号</label>
        <input
          {...register('postal_code')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">住所</label>
        <input
          {...register('address')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">電話番号</label>
        <input
          {...register('phone_number')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="090-1234-5678"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {initialData ? '更新' : '登録'}
      </button>
    </form>
  );
}; 