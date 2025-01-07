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
  const currentPropertyId = useStore((state) => state.currentPropertyId);

  useEffect(() => {
    console.log('Initial state - Property ID:', currentPropertyId);
    console.log('Initial state - Checkout Listing ID:', currentCheckoutListingId);
    
    // 購入完了を記録（IDがある場合のみ）
    if (currentCheckoutListingId) {
      completePurchase(currentCheckoutListingId.toString());
      console.log('After completePurchase - Property ID:', currentPropertyId);
      console.log('After completePurchase - Checkout Listing ID:', currentCheckoutListingId);
    }
    
    // 3秒後に物件ページに遷移（ProductDetailsタブを表示）
    const timer = setTimeout(() => {
      console.log('Before redirect - Property ID:', currentPropertyId);
      if (currentPropertyId) {
        console.log('Redirecting to property page:', `/property/${currentPropertyId}?tab=products`);
        navigate(`/property/${currentPropertyId}?tab=products`);
      } else {
        console.log('No Property ID found, redirecting to mypage');
        navigate('/mypage');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentCheckoutListingId, currentPropertyId, completePurchase, navigate]);

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
          まもなく物件詳細ページに移動します...
        </p>
      </div>
    </div>
  );
}; 