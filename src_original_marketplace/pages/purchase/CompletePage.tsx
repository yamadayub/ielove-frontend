import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CompletePage: React.FC = () => {
  const location = useLocation();
  const completePurchase = useStore((state) => state.completePurchase);
  const [error, setError] = useState<string | null>(null);
  const propertyId = new URLSearchParams(location.search).get('propertyId');

  useEffect(() => {
    const updatePurchase = async () => {
      if (!propertyId) {
        setError('物件IDが指定されていません');
        return;
      }

      try {
        await completePurchase(propertyId);
      } catch (error) {
        console.error('購入完了処理に失敗しました:', error);
        setError('購入完了処理に失敗しました。カスタマーサポートにお問い合わせください。');
      }
    };

    updatePurchase();
  }, [propertyId, completePurchase]);

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">エラーが発生しました</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link
          to="/"
          className="inline-block bg-gray-900 text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">ご注文ありがとうございます</h1>
      <p className="text-gray-600 mb-8">
        ご注文の確認メールをお送りしました。
      </p>
      <Link
        to="/"
        className="inline-block bg-gray-900 text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
      >
        トップページに戻る
      </Link>
    </div>
  );
};