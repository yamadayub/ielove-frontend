import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useProperty } from '../../features/property/hooks/useProperty';
import { AxiosError } from 'axios';

interface FormData {
  name: string;
  email: string;
  address: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const propertyId = new URLSearchParams(location.search).get('propertyId');
  const { data: property, isLoading, isError } = useProperty(propertyId || '');
  const specificationPrice = 3000; // TODO: 価格は設定から取得するように修正

  const validateForm = (): boolean => {
    if (!propertyId) {
      setError('物件IDが指定されていません');
      return false;
    }

    // クレジットカード番号のバリデーション（16桁の数字）
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      setError('有効なクレジットカード番号を入力してください');
      return false;
    }

    // 有効期限のバリデーション（MM/YY形式）
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      setError('有効期限は MM/YY 形式で入力してください');
      return false;
    }

    // CVVのバリデーション（3-4桁の数字）
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      setError('有効なセキュリティコードを入力してください');
      return false;
    }

    // メールアドレスのバリデーション
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('有効なメールアドレスを入力してください');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: 実際の支払い処理を実装
      // const response = await axios.post('/api/payments', {
      //   propertyId,
      //   ...formData,
      // });

      if (typeof clearCart === 'function') {
        clearCart();
        navigate(`/complete?propertyId=${propertyId}`);
      } else {
        throw new Error('clearCart is not a function');
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // クレジットカード番号のフォーマット（4桁ごとにスペース）
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    // 有効期限のフォーマット（MM/YY）
    else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">物件が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">お支払い情報</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">注文内容</h2>
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>{property.name} 仕様情報 購読</span>
            <span className="font-medium">
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
                minimumFractionDigits: 0,
              }).format(specificationPrice)}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>合計</span>
          <span>
            {new Intl.NumberFormat('ja-JP', {
              style: 'currency',
              currency: 'JPY',
              minimumFractionDigits: 0,
            }).format(specificationPrice)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              住所
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">クレジットカード情報</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  カード番号
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                    有効期限
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                    value={formData.expiry}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    セキュリティコード
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    required
                    maxLength={4}
                    placeholder="123"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900"
                    value={formData.cvv}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          注文を確定する
        </button>
      </form>
    </div>
  );
};