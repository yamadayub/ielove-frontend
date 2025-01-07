import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export const OnboardingCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // 3秒後にマイページに遷移
    const timer = setTimeout(() => {
      navigate('/mypage');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!isSignedIn) {
    navigate('/sign-in');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Stripeアカウントの登録が完了しました！
        </h1>
        <p className="mt-2 text-gray-600">
          これで物件情報の出品が可能になりました。
        </p>
        <p className="mt-2 text-gray-500">
          まもなくマイページに移動します...
        </p>
      </div>
    </div>
  );
}; 