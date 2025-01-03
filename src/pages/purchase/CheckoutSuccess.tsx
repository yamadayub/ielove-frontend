import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../../store/useStore';

export const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const completePurchase = useStore((state) => state.completePurchase);
  const currentCheckoutListingId = useStore((state) => state.currentCheckoutListingId);

  useEffect(() => {
    // 購入完了を記録（IDがある場合のみ）
    if (currentCheckoutListingId) {
      completePurchase(currentCheckoutListingId.toString());
    }
    
    // 3秒後にマイページに遷移（IDの有無に関わらず）
    const timer = setTimeout(() => {
      navigate('/mypage');
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentCheckoutListingId, completePurchase, navigate]);

  if (!isSignedIn) {
    navigate('/sign-in');
    return null;
  }

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
}; 