import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../../store/useStore';

export const CheckoutResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const completePurchase = useStore((state) => state.completePurchase);
  const currentCheckoutListingId = useStore((state) => state.currentCheckoutListingId);

  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success' && currentCheckoutListingId) {
      // 購入完了を記録
      completePurchase(currentCheckoutListingId.toString());
      
      // 3秒後にマイページに遷移
      const timer = setTimeout(() => {
        navigate('/mypage');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, currentCheckoutListingId, completePurchase, navigate]);

  if (!isSignedIn) {
    navigate('/sign-in');
    return null;
  }

  if (status === 'cancel') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            購入がキャンセルされました
          </h1>
          <p className="mt-2 text-gray-600">
            購入を完了するには、もう一度お試しください。
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            購入画面に戻る
          </button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            ご購入ありがとうございます！
          </h1>
          <p className="mt-2 text-gray-600">
            物件仕様の詳細が確認できるようになりました。
          </p>
          <p className="mt-2 text-gray-500">
            まもなくマイページに移動します...
          </p>
        </div>
      </div>
    );
  }

  // status が不正な場合
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          エラーが発生しました
        </h1>
        <p className="mt-2 text-gray-600">
          予期せぬエラーが発生しました。もう一度お試しください。
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          トップページへ戻る
        </button>
      </div>
    </div>
  );
}; 