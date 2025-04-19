import React from 'react';
import { useForm } from 'react-hook-form';

export const UserProfileForm = ({ initialData, onSubmit }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">名前</label>
        <input
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ユーザータイプ</label>
        <select
          {...register('user_type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="individual">個人</option>
          <option value="business">法人</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ロール</label>
        <select
          {...register('role')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="buyer">購入者</option>
          <option value="seller">販売者</option>
          <option value="both">両方</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        更新
      </button>
    </form>
  );
}; 