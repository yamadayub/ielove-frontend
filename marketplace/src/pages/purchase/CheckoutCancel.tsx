import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export const CheckoutCancel: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    navigate('/sign-in');
    return null;
  }

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
}; 