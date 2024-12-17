import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CompletePage = () => {
  const location = useLocation();
  const completePurchase = useStore((state) => state.completePurchase);
  const propertyId = new URLSearchParams(location.search).get('propertyId');

  useEffect(() => {
    if (propertyId) {
      completePurchase(propertyId);
    }
  }, [propertyId, completePurchase]);

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