import React, { useState } from 'react';
import { User } from '../../types';
import { useStore } from '../../store/useStore';
import { UserCircle } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData.name, formData.email);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gray-100 p-3 rounded-full">
          <UserCircle className="h-8 w-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">プロフィール</h2>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">お名前</h3>
            <p className="mt-1 text-gray-900">{user.name || '未設定'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">メールアドレス</h3>
            <p className="mt-1 text-gray-900">{user.email || '未設定'}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            編集する
          </button>
        </div>
      )}
    </div>
  );
};